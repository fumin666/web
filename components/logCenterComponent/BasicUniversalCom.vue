<template>
  <div>
    <s-row type="flex" style="height: 70%;padding:0 20px;">
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">人员分类统计</span>
          </div>
          <div class="chart">
            <s-chart v-if="userClassifyChart.data.length" :chart="userClassifyChart"></s-chart>
            <div v-nodata="!userClassifyChart.data.length" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">资产生命周期统计</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart1.data.length" :chart="chart1"></s-chart>
            <div v-nodata="!chart1.data.length" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">事件等级分布</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart2.data.length" :chart="chart2"></s-chart>
            <div v-nodata="!chart2.data.length" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOptionColor from '@/components/chart/barChartOptionColor.js'
  import barChartOptionY from '@/components/chart/barChartOptionY.js'
    export default {
      data() {
        return {
          userClassifyChart: {
            name: 'userClassifyChart',
            type: 'pieChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              legend: {
                left: '70%',
                top: 'center',
                orient: 'vertical',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 8,             // 图例图形宽度
                itemHeight: 8
              },
              color: ['#FEB64D', '#71B3FA', '#32D3EB', '#5BC49F'],
              series: [{
                type: 'pie',
                radius: '60%',
                center: ['35%', '50%']
              }]
            }
          },
          chart1: {
            name: 'chart1',
            type: 'rainbowBarChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              grid: {
                left: '10%',
                right: '4%',
                bottom: '18%'
              }
            }
          },
          chart2: {
            name: 'chart2',
            type: 'rainbowBarChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              grid: {
                left: '10%',
                right: '4%',
                bottom: '18%'
              }
            }
          },
          specialOperationHeight: 200
        }
      },
      methods: {
        getTheme(val) {
          var option = {
            xAxis: [{
              axisLabel: {
                interval: 0,
                formatter: function(value) {
                  let ret = '';     // 拼接加\n返回的类目项
                  let maxLength = 2;      // 每项显示文字个数
                  let valLength = value.length;     // X轴类目项的文字个数
                  let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
                  // 如果类目项的文字大于3,
                  if (rowN > 1) {
                    for (let i = 0; i < rowN; i++) {
                      let temp = '';      // 每次截取的字符串
                      let start = i * maxLength;        // 开始截取的位置
                      let end = start + maxLength;      // 结束截取的位置
                      // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                      temp = value.substring(start, end) + '\n';
                      ret += temp;      // 凭借最终的字符串
                    }
                    return ret;
                  } else {
                    return value;
                  }
                }
              }
            }],
            series: [{
              label: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#1E2732'
                }
              }
            }]
          }
          if (val === 'dark') {
            option.series[0].itemStyle.normal.borderColor = '#1E2732';
            this.chart1.option = merge({}, this.chart1.option, barChartOptionY.dark, option)
            this.chart2.option = merge({}, this.chart2.option, barChartOptionColor.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.chart1.option = merge({}, this.chart1.option, barChartOptionY.light, option)
            this.chart2.option = merge({}, this.chart2.option, barChartOptionColor.light, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
          this.specialOperationHeight = boxCardItemHeight;
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        $axios.get(`/userAccount/departOrClassifyStatistical/classify`).then((res) => { // 人员分类统计
          if (Object.keys(res.data).length > 0) {
            var data = []
            for (var key in res.data.classifyMap) {
              data.push({name: key, value: res.data.classifyMap[key]})
            }
            this.userClassifyChart.data = data
          }
        });
        $axios.get('/logCenterIndex/assetStatusCount').then((res) => {
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: parseInt(res.data[key])})
          }
          this.chart1.data = data
        });
        $axios.get('/logCenterIndex/incidentLeverCount').then((res) => {
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: parseInt(res.data[key])})
          }
          this.chart2.data = data
        });
      },
      watch: {
        '$store.state.theme': function(val) {
          this.getTheme(val)
        }
      },
      destroyed() {
        window.removeEventListener('resize', this.initDivHeight);
      }
    }
</script>

<style scoped>
.cardcol {
   height: 100%;
 }
.cardcol:first-of-type {
  padding-right: 5px;
}
.cardcol:nth-of-type(2) {
  padding: 0 5px;
}
.cardcol:nth-of-type(3) {
  padding-left: 5px;
}
.chart{
  height: calc(100% - 13px);
}
.clearfix {
  padding-left: 10px;
  opacity: 0.65;
  color: #000;
  margin-top: -10px;
  height: 31px;
  line-height: 31px;
}
</style>
