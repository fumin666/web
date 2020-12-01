<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:41
 * @LastEditTime: 2019-09-24 15:48:41
 * @LastEditors: Please set LastEditors
 -->
/**
* Created by alex on 2019/2/26.
*/
<template>
  <section class="logCenterSummary" style="margin-top: 20px;">
    <s-row :gutter="20">
      <s-col :span="12">
        <s-card class="box-card" style="height: calc( (100vh - 101px) / 2);" id="boxCardItem">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-clock"></i>
              全网日志级别数量统计图(最近24小时)
            </span>
          </div>
          <s-col :span="14">
            <div class="chart">
              <s-chart :chart="levelCount" v-if="levelCount.data.length"></s-chart>
              <div v-nodata="true" v-else style="height: 250px"></div>
            </div>
          </s-col>
          <s-col :span="10">
            <s-scrollbar wrap-style="max-height: 300px;">
              <s-table
                :data="logLevelData"
                class="logLevelHeight">
                <s-table-column label="级别" prop="logLevelName"></s-table-column>
                <s-table-column label="数量" prop="count"></s-table-column>
                <s-table-column label="百分比">
                  <template slot-scope="scope">
                    <div>{{scope.row.per}}%</div>
                  </template>
                </s-table-column>
              </s-table>
            </s-scrollbar>
          </s-col>
        </s-card>
      </s-col>
      <s-col :span="12">
        <s-card class="box-card" id="boxCardItem">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-align-bottom"></i>
              全网日志数量时间分布图(最近24小时)
            </span>
          </div>
          <div class="chart">
            <s-chart :chart="logTime" v-if="logTime.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px"></div>
          </div>
        </s-card>
      </s-col>
    </s-row>
    <s-row :gutter="20">
      <s-col :span="12">
        <s-card class="box-card" id="boxCardItem">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-panel"></i>
              全网日志来源统计TOP10(最近24小时)
            </span>
          </div>
          <div class="chart">
            <s-chart :chart="originTop" v-if="originTop.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px"></div>
          </div>
        </s-card>
      </s-col>
      <s-col :span="12">
        <s-card class="box-card" id="boxCardItem">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-event"></i>
              潜在危害性分析
            </span>
          </div>
          <s-charts :chart="chartData" v-if="Object.keys(chartData.data).length"></s-charts>
          <div v-nodata="true" v-else style="height: 250px"></div>
        </s-card>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOptionColor from '@/components/chart/barChartOptionColor.js'
  export default {
    data() {
      return {
        levelCount: {
          name: 'levelCount',
          type: 'statRingChart',
          width: '100%',
          height: '300px',
          data: [],
          option: {
            legend: {
              left: '80%',
              top: '10%',
              orient: 'vertical',
              icon: 'circle',
              padding: [5, 20],
              itemGap: 10,
              itemWidth: 8,             // 图例图形宽度
              itemHeight: 8
            },
            series: [{
              itemStyle: {
                normal: {
                  color: function (params) {
                    var colorlist = ['#FFD600', '#FFB851', '#E7493E', '#837F7F', '#FB8032', '#60ACFC', '#9287E7', '#5BC49F', '#BBC1D1']
                    return colorlist[params.dataIndex]
                  }
                }
              },
              radius: ['35%', '50%'],
              center: ['40%', '50%']
            }]
          }
        },
        logTime: {
          name: 'logTime',
          type: 'lineChart',
          width: '100%',
          height: '300px',
          itemName: '日志数量',
          data: [],
          option: {
            xAxis: [
              {
                axisLabel: {
                  interval: 0, // 横轴信息全部显示
                  rotate: 60 // 60度角倾斜显示
                }
              }
            ],
            grid: {
              y2: 115,
              x2: 40
            },
            yAxis: [{
              type: 'value',
              minInterval: 1
            }]
          }
        },
        originTop: {
          name: 'originTop',
          type: 'rainbowBarChart',
          width: '100%',
          height: '242px',
          data: [],
          option: {
            grid: {
              left: '10%',
              right: '4%',
              bottom: '22%'
            },
            legend: {
              show: false
            },
            yAxis: [{
              type: 'value',
              minInterval: 1
            }]
          }
        },
        logLevelData: [],
        logList: [],
        chartData: {
          el: 'chartData',
          type: 'threeBarChart',
          width: '100%',
          height: '250px',
          data: {}
        }
      }
    },
    methods: {
      getTheme(val) {
        var option = {
          yAxis: [
            {
              axisLine: {
                show: true
              },
              axisLabel: {
                textStyle: {
                  color: '#000'
                }
              }
            }
          ],
          xAxis: [
            {
              axisLine: {
                show: true
              },
              axisLabel: {
                interval: 0,
                rotate: 60,
                formatter: function(value) {
                  let ret = '';     // 拼接加\n返回的类目项
                  let maxLength = 8;      // 每项显示文字个数
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
                },
                textStyle: {
                  color: '#000'
                }
              }
            }
          ],
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
          option.xAxis[0].axisLabel.textStyle.color = '#fff';
          option.yAxis[0].axisLabel.textStyle.color = '#fff';
          this.originTop.option = merge({}, this.originTop.option, barChartOptionColor.dark, option)
        } else {
          option.series[0].itemStyle.normal.borderColor = '#fff';
          option.xAxis[0].axisLabel.textStyle.color = '#000';
          option.yAxis[0].axisLabel.textStyle.color = '#000';
          this.originTop.option = merge({}, this.originTop.option, barChartOptionColor.light, option)
        }
      },
      initDivHeight () {
        if (document.getElementById('boxCardItem')) {
          var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
          // var boxCardItemWidth = document.getElementById('boxCardItem').offsetWidth;
          this.levelCount.height = boxCardItemHeight - 50 + 'px';
          this.logTime.height = boxCardItemHeight - 50 + 'px';
          // this.originTop.height = boxCardItemHeight - 150 + 'px';
        }
      },
      getData() {
        let _self = this;
        let arr = [];
        // 全网日志级别数量统计图(最近24小时)
        $axios.get(`/syslogReport/countLogLevelFor24Hours`).then((res) => {
          if (res.data) {
            // 转换为日志级别数量统计图右侧的表格
            for (var name in res.data) {
              let obj = {};
              obj.logLevelName = name;
              for (var nameObj in res.data[name]) {
                obj.count = nameObj
                obj.per = res.data[name][nameObj]
              }
              arr.push(obj)
            }
            _self.logLevelData = arr;
            let chartData = []
            for (let i in res.data) {
              let chartObj = {};
              for (let j in res.data[i]) {
                chartObj.name = i;
                chartObj.value = j
              }
              chartData.push(chartObj)
            }
            _self.levelCount.data = chartData
          }
        })
        // 全网日志来源统计TOP10(最近24小时)
        $axios.get(`/syslogReport/top10LogSourceFor24Hours`).then((res) => {
          if (res.data.length > 0) {
            _self.originTop.data = res.data
          }
        })
        // 全网日志数量时间分布图(最近24小时)
        $axios.get(`/syslogReport/logSourceNumFor24Hours`).then((res) => {
          if (res.data.length > 0) {
            // 时间返回时反向的
            _self.logTime.data = res.data.reverse()
          }
        })
        // 全网最新日志列表
        $axios.get(`/syslogReport/getHazardCountFor7Day`).then((res) => {
            _self.chartData.data = res.data
        })
      }
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      let _self = this;
      this.initDivHeight();
      window.resizeHandler = function () {
        _self.initDivHeight();
      };
      window.addEventListener('resize', window.resizeHandler);
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    created() {
      this.getData()
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .logCenterSummary
    .s-card-header
      margin-bottom 20px
    .clearfix
      &:before, &:after
        content: ''
        display block
      &:after
        overflow hidden
        clear both
      .card-title
        font-size 14px
        margin-bottom 20px
    .myHeight
      height 242px
    .logLevelHeight
      td, th
        height 33px
        line-height 33px
</style>
