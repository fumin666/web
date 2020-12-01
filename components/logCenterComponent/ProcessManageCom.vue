<template>
  <div>
    <s-row type="flex" style="height: 70%;padding:0 20px;">
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">我的工单数量汇总</span>
          </div>
          <div class="chart">
            <s-chart v-if="orderCountChart.data.length" :chart="orderCountChart"></s-chart>
            <div v-nodata="true" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">事件详情汇总</span>
          </div>
          <div class="chart">
            <s-chart v-if="Object.keys(chart1.data).length > 0" :chart="chart1"></s-chart>
            <div v-nodata="true" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">服务请求详情汇总</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart2.data.length" :chart="chart2"></s-chart>
            <div v-nodata="true" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import ringChartOption from '@/components/chart/ringChartOption.js'
  import { merge } from 'lodash'
  import pieChartOption from '@/components/chart/pieChartOption.js'
    export default {
      data() {
        return {
          orderCountChart: {
            name: 'orderCountChart',
            type: 'statRingChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              title: {
                text: '总数',
                subtext: 0
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              }
            }
          },
          roundOption: {
            title: {
              x: '28%',
              y: '40%',
              textStyle: {
                fontSize: 14
              }
            },
            legend: {
              type: '',
              x: '60%',
              y: '25%',
              orient: 'vertical'
            },
            series: [{
              radius: ['40%', '60%'],
              center: ['30%', '50%']
            }]
          },
          chart1: {
            name: 'chart1',
            type: 'pieChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              legend: {
                orient: 'vertical',
                x: '60%',
                y: '25%',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 8,             // 图例图形宽度
                itemHeight: 8
              },
              color: ['#71B3FA', '#32D3EB', '#5BC49F', '#FEB64D'],
              series: [{
                type: 'pie',
                radius: '55%',
                center: ['30%', '50%']
              }]
            }
          },
          chart2: {
            name: 'chart2',
            type: 'pieChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              color: ['#71B3FA', '#32D3EB', '#FEB64D']
            }
          },
          dataListHeight: 200
        }
      },
      methods: {
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
          this.dataListHeight = boxCardItemHeight
        },
        getTheme(val) {
          let option = {
            legend: {
              orient: 'vertical',
              x: '60%',
              y: '25%',
              textStyle: {
                color: '#000'
              }
            },
            series: [
              {
                type: 'pie',
                radius: '55%',
                center: ['30%', '50%'],
                label: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    borderColor: '#fff'
                  }
                }
              }
            ]
          }
          if (val === 'dark') {
            option.series[0].itemStyle.normal.borderColor = '#1E2732';
            option.legend.textStyle.color = 'rgba(255, 255, 255, 0.45)';
            this.orderCountChart.option = merge({}, this.orderCountChart.option, ringChartOption.dark, this.roundOption)
            this.chart2.option = merge({}, this.chart2.option, pieChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            option.legend.textStyle.color = '#000';
            this.orderCountChart.option = merge({}, this.orderCountChart.option, ringChartOption.light, this.roundOption)
            this.chart2.option = merge({}, this.chart2.option, pieChartOption.dark, option)
          }
        },
        getLastMonthYestdy(date) { // 获取当前时间的上个月这一天
          var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          var strYear = date.getFullYear();
          var strDay = date.getDate();
          var strMonth = date.getMonth() + 1;
          var strHours = date.getHours();
          var strSeconds = date.getSeconds();
          var strMinutes = date.getMinutes();
          if (strYear % 4 === 0 && strYear % 100 !== 0) {
            daysInMonth[2] = 29;
          }
          if (strMonth - 1 === 0) {
            strYear -= 1;
            strMonth = 12;
          } else {
            strMonth -= 1;
          }
          strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
          if (strMonth < 10) {
            strMonth = '0' + strMonth;
          }
          if (strDay < 10) {
            strDay = '0' + strDay;
          }
          if (strHours < 10) {
            strHours = '0' + strHours;
          }
          if (strSeconds < 10) {
            strSeconds = '0' + strSeconds;
          }
          if (strMinutes < 10) {
            strMinutes = '0' + strMinutes;
          }
          let datastr = strYear + '-' + strMonth + '-' + strDay + ' ' + strHours + ':' + strMinutes + ':' + strSeconds;
          return datastr;
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        $axios.get('/itilWorkflowCenter/getUserOrdersState').then((res) => {
          var data = [];
          for (let key in res.data) {
            var param = {
              value: 0,
              name: ''
            };
            for (let item in res.data[key]) {
              param.value += res.data[key][item];
              param.name = key;
            }
            data.push(param)
          }
          let title = 0
          for (let i in data) {
            title += data[i].value
          }
          if (title === 0) {
            title = '0'
          }
          this.orderCountChart.option.title.subtext = title
          this.orderCountChart.data = data
        });
        let params1 = {
          startTime: parseInt(new Date(this.getLastMonthYestdy(new Date())).getTime() / 1000),
          endTime: parseInt(new Date().getTime() / 1000)
        }
        $axios.post(`/itilReportCenter/getIncidentReport/${1}`, params1).then((res) => {
          if (res.data.statchart) {
            this.chart1.data = res.data.statchart
          }
        });
        $axios.post(`/itilReportCenter/getRequestReport/${16}`, params1).then((res) => {
          if (res.data.charts) {
            this.chart2.data = res.data.charts
          }
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
