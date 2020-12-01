<template>
  <div>
    <s-row type="flex" style="height: 70%;padding:0 20px;">
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">全网日志数量时间分布图 (最近24小时内)</span>
          </div>
          <div class="chart">
            <s-chart v-if="userClassifyChart.data.length" :chart="userClassifyChart"></s-chart>
            <div v-else v-nodata="!userClassifyChart.data.length" :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">全网日志来源统计TOP10 (最近24小时内)</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart1.data.length" :chart="chart1"></s-chart>
            <div v-else v-nodata="!chart1.data.length" :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">全网最新告警列表</span>
          </div>
          <div class="chart">
            <s-scrollbar :wrap-style="'max-height:' + dataListHeight + 'px;'">
              <s-table ref="table1" style="width: 100%" :data="dataList">
                <s-table-column label="接收人" prop="alarmReceiver"></s-table-column>
                <s-table-column label="接收地址" prop="alarmReceiver"></s-table-column>
                <s-table-column label="告警内容" prop="alarmContent"></s-table-column>
                <s-table-column label="告警时间" prop="createTime">
                  <template slot-scope="scope">{{formatDate(scope.row.createTime)}}</template>
                </s-table-column>
              </s-table>
            </s-scrollbar>
          </div>
        </s-card-diy>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOption from '@/components/chart/barChartOptionY.js'
  import lineChartOption from '@/components/chart/lineChartOption.js'
    export default {
      data() {
        return {
          userClassifyChart: {
            name: 'userClassifyChart',
            type: 'lineChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              color: ['#60ACFC'],
              grid: {
                top: '8%',
                left: '12%',
                right: '4%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
                  interval: 0,
                  rotate: 50,
                  textStyle: {
                    color: 'rgba(0, 0, 0, 0.3)'
                  }
                }
              }],
              yAxis: [{
                axisLine: {
                  show: false
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    type: 'dashed',
                    color: '#D6D6D6'
                  }
                }
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
                right: '4%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
                  interval: 0,
                  rotate: 60
                }
              }]
            }
          },
          dataList: [],
          dataListHeight: '100%'
        }
      },
      methods: {
        formatDate(seconds) {
          if (seconds) {
            let date = new Date()
            date.setTime(seconds * 1000)
            let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
            let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
            let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
            let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
            let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
            return dateStr
          } else {
            return ''
          }
        },
        getTheme(val) {
          var option = {
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
            this.chart1.option = merge({}, this.chart1.option, barChartOption.dark, option)
            this.userClassifyChart.option = merge({}, this.userClassifyChart.option, lineChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.chart1.option = merge({}, this.chart1.option, barChartOption.light, option)
            this.userClassifyChart.option = merge({}, this.userClassifyChart.option, lineChartOption.light, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
          this.dataListHeight = boxCardItemHeight
        }
      },
      mounted() {
        this.$nextTick(() => {
          this.initDivHeight();
          window.addEventListener('resize', this.initDivHeight);
        });
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        $axios.get('/syslogReport/logSourceNumFor24Hours').then(res => {
          this.userClassifyChart.data = res.data.reverse();
        })
        $axios.get('/syslogReport/top10LogSourceFor24Hours').then((res) => {
          this.chart1.data = res.data
        });
        $axios.get('logCenterIndex/dataAlarmSendLogs').then((res) => {
          this.dataList = res.data
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
