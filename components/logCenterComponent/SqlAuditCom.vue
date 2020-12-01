<template>
  <div>
    <s-row type="flex" style="height: 70%;padding:0 20px;">
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">本月DDL指令操作次数时间走势</span>
          </div>
          <div class="chart">
            <s-chart v-if="userClassifyChart.data.length" :chart="userClassifyChart"></s-chart>
            <div v-nodata="userClassifyChart.data.length === 0" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">本月DML指令操作次数时间走势</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart1.data.length" :chart="chart1"></s-chart>
            <div v-nodata="chart1.data.length === 0" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">本月审计记录时间走势</span>
          </div>
          <div class="chart">
            <s-chart v-if="chart2.data.length" :chart="chart2"></s-chart>
            <div v-nodata="chart2.data.length === 0" v-else :style="'height: ' + dataListHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import lineChartOption from '@/components/chart/lineChartOption.js'
    export default {
      data() {
        return {
          userClassifyChart: {
            name: 'userClassifyChart',
            type: 'lineChart',
            width: '100%',
            height: '100%',
            data: [],
            option: {
              color: ['#60ACFC'],
              grid: {
                top: '10%',
                left: '12%',
                right: '10%',
                bottom: '18%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
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
            type: 'lineChart',
            width: '100%',
            height: '100%',
            data: [],
            option: {
              color: ['#60ACFC'],
              grid: {
                top: '10%',
                left: '12%',
                right: '10%',
                bottom: '18%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
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
          chart2: {
            name: 'chart2',
            type: 'lineChart',
            width: '100%',
            height: '100%',
            data: [],
            option: {
              color: ['#60ACFC'],
              grid: {
                top: '10%',
                left: '12%',
                right: '10%',
                bottom: '18%'
              },
              xAxis: [{
                axisLabel: {
                  show: true,
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
          dataListHeight: 200
        }
      },
      methods: {
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
          this.dataListHeight = boxCardItemHeight
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
            this.userClassifyChart.option = merge({}, this.userClassifyChart.option, lineChartOption.dark, option)
            this.chart1.option = merge({}, this.chart1.option, lineChartOption.dark, option)
            this.chart2.option = merge({}, this.chart2.option, lineChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.userClassifyChart.option = merge({}, this.userClassifyChart.option, lineChartOption.light, option)
            this.chart1.option = merge({}, this.chart1.option, lineChartOption.light, option)
            this.chart2.option = merge({}, this.chart2.option, lineChartOption.light, option)
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
      watch: {
        '$store.state.theme': function(val) {
          this.getTheme(val)
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.$nextTick(() => {
          this.initDivHeight();
          window.addEventListener('resize', this.initDivHeight);
        });
        let form = {
          startTime: parseInt(new Date(this.getLastMonthYestdy(new Date())).getTime() / 1000),
          endTime: parseInt(new Date().getTime() / 1000),
          timeType: '3'
        }
        $axios.post('/dbauditReport/ddlCmdTimeStat', form).then(res => {
          let data = []
          for (let i in res.data.data) {
            data.push({name: res.data.data[i].date, value: res.data.data[i].all})
          }
          this.userClassifyChart.data = data
        })
        $axios.post('/dbauditReport/dmlCmdTimeStat', form).then((res) => {
          let data = []
          for (let i in res.data.data) {
            data.push({name: res.data.data[i].date, value: res.data.data[i].all})
          }
          this.chart1.data = data
        });
        $axios.post('/dbauditReport/auditAll', form).then((res) => {
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: res.data[key]})
          }
          this.chart2.data = data
        });
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
