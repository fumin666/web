<template>
  <div>
    <s-row type="flex" style="height: 70%;padding:0 20px;">
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">组织机构运维工作量(TOP30)</span>
          </div>
          <div class="chart">
            <s-scrollbar v-if="Object.keys(organizationOperation.data).length" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
              <s-charts :chart="organizationOperation"></s-charts>
            </s-scrollbar>
            <div v-nodata="true" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">员工运维工作量(TOP30)</span>
          </div>
          <div class="chart">
            <s-scrollbar v-if="Object.keys(staffOperation.data).length" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
              <s-charts :chart="staffOperation"></s-charts>
            </s-scrollbar>
            <div v-nodata="true" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
          </div>
        </s-card-diy>
      </s-col>
      <s-col :span="8" class="cardcol">
        <s-card-diy class="cardview">
          <div class="clearfix">
            <span class="card-title">特殊运维申请工作量</span>
          </div>
          <div class="chart">
            <s-scrollbar v-if="specialOperation.data.length > 0" :wrap-style="'max-height: ' + specialOperationHeight + 'px;'">
              <s-chart :chart="specialOperation"></s-chart>
            </s-scrollbar>
            <div v-nodata="true" v-else :style="'height: ' + specialOperationHeight + 'px;'"></div>
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
  import barChartOptionColor from '@/components/chart/barChartOptionColor.js'
  export default {
    data() {
      return {
        organizationOperation: {
          el: 'organizationOperation',
          type: 'yBarChart',
          width: '100%',
          height: '100%',
          data: [],
          opt: {
            xAxis: {
              axisLine: {
                show: false // 坐标轴轴线不显示
              },
              axisLabel: {
                show: false // 坐标轴刻度不显示
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: '#000',
                  opacity: 0.2
                }
              },
              axisLabel: {
                show: true,
                formatter: function (value) {
                  return (value.length > 5 ? (value.slice(0, 5) + '...') : value)
                }
              },
              triggerEvent: true
            },
            color: ['#60ACFC'],
            series: [{
              type: 'bar',
              data: [],
              barWidth: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              }
            }]
          }
        },
        staffOperation: {
          el: 'staffOperation',
          type: 'yBarChart',
          width: '100%',
          height: '100%',
          data: [],
          opt: {
            xAxis: {
              axisLine: {
                show: false // 坐标轴轴线不显示
              },
              axisLabel: {
                show: false // 坐标轴刻度不显示
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: '#000',
                  opacity: 0.2
                }
              },
              axisLabel: {
                show: true,
                formatter: function (value) {
                  return (value.length > 5 ? (value.slice(0, 5) + '...') : value)
                }
              },
              triggerEvent: true
            },
            color: ['#32D3EB'],
            series: [{
              type: 'bar',
              data: [],
              barWidth: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              }
            }]
          }
        },
        specialOperation: {
          name: 'specialOperation',
          type: 'rainbowBarChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {
            grid: {
              left: '10%',
              bottom: '30%'
            }
          }
        },
        specialOperationHeight: 200
      }
    },
    methods: {
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
        var option1 = {
          xAxis: [{
            axisLabel: {
              interval: 0,
              formatter: function (value) {
                return (value.length > 3 ? (value.slice(0, 3) + '...') : value)
              }
            },
            triggerEvent: true
          }]
        }
        if (val === 'dark') {
          option.series[0].itemStyle.normal.borderColor = '#1E2732';
          this.organizationOperation.option = merge({}, this.organizationOperation.option, barChartOption.dark)
          this.staffOperation.option = merge({}, this.staffOperation.option, barChartOption.dark, option)
          this.specialOperation.option = merge({}, this.specialOperation.option, barChartOptionColor.dark, option, option1)
        } else {
          option.series[0].itemStyle.normal.borderColor = '#fff';
          this.organizationOperation.option = merge({}, this.organizationOperation.option, barChartOption.light)
          this.staffOperation.option = merge({}, this.staffOperation.option, barChartOption.light, option)
          this.specialOperation.option = merge({}, this.specialOperation.option, barChartOptionColor.light, option, option1)
        }
      },
      initDivHeight () {
        var boxCardItemHeight = document.getElementsByClassName('chart')[0].offsetHeight;
        this.specialOperationHeight = boxCardItemHeight + 30;
        this.organizationOperation.height = this.specialOperationHeight + 'px'
        this.staffOperation.height = this.specialOperationHeight + 'px'
        this.specialOperation.height = this.specialOperationHeight + 'px'
      }
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
      $axios.post('/operationWorkStat/orgStat', {departUuids: [], endTime: '', startTime: ''}).then((res) => {
        let data = []
        for (let key in res.data) {
          data.push({name: res.data[key].departName, value: res.data[key].sessionNum})
        }
        if (data.length > 0) {
          let msg = {}
          for (let i in data) {
            msg[data[i].name] = parseInt(data[i].value)
            this.organizationOperation.opt.series[0].data.push(data[i].value)
          }
          this.organizationOperation.data = msg
        }
      });
      $axios.post('/logCenterIndex/getUserStat').then((res) => {
        let data = []
        for (let key in res.data) {
          data.push({name: res.data[key].userLoginName, value: res.data[key].sessionNum}) // userRealName
        }
        if (data.length > 0) {
          let msg = {}
          for (let i in data) {
            msg[data[i].name] = parseInt(data[i].value)
            this.staffOperation.opt.series[0].data.push(data[i].value)
          }
          this.staffOperation.data = msg
        }
      });
      $axios.get('/specialOperationApply/operationTypeKpi').then((res) => {
        this.specialOperation.data = res.data.data
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
