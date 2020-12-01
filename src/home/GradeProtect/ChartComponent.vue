<template>
    <s-row style="padding: 20px;">
      <s-col :span="8" class="grade-chart-leftbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <div class="grade-title">安全管理中心 (角色集中管控)</div>
            <div style="float: right;font-size:12px;opacity: 0.45;margin-top: 6px;">
              <span style="margin-right: 6px;">管理员人数 <span style="font-weight: bold;">{{adminCount}}</span></span>
              <span>管理员账号数 <span style="font-weight: bold;">{{adminAccountCount}}</span></span>
              <s-tooltip content="当真实管理员人数小于三个角色账号的总数时，代表角色之间存在兼任。" placement="right">
                <i class="iconfont icon-help"></i>
              </s-tooltip>
            </div>
          </div>
          <div>
            <s-chart :chart="roleCount" v-if="roleCount.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" class="grade-chart-centerbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">身份鉴别 (鉴别技术统计)</span>
          </div>
          <div>
            <s-chart :chart="loginTypeCount" v-if="Object.keys(loginTypeCount.data).length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" class="grade-chart-rightbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">安全审计 (事件级别统计)</span>
          </div>
          <div>
            <s-chart :chart="incidentLevelCount" v-if="incidentLevelCount.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" v-if="gradeLevel === '0'" class="grade-chart-leftbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title" v-if="hasMonitor">集中管控 (资产运行情况统计)</span>
            <span class="grade-title" v-if="!hasMonitor">集中管控 (资产生命周期状态统计)</span>
          </div>
          <div>
            <s-chart :chart="assetCount" v-if="assetCount.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" v-if="gradeLevel === '1'" class="grade-chart-leftbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">资产管理 (资产责任部门TOP5)</span>
          </div>
          <div>
            <s-charts :chart="itCompOperCount" v-if="Object.keys(itCompOperCount.data).length"></s-charts>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" class="grade-chart-centerbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">资产管理 (资产重要程度统计)</span>
          </div>
          <div>
            <s-chart :chart="assetImportance" v-if="Object.keys(assetImportance.data).length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" v-if="gradeLevel === '0'" class="grade-chart-rightbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">集中管控 (告警事件统计)</span>
          </div>
          <div>
            <s-chart :chart="eventCountGroupByModule" v-if="Object.keys(eventCountGroupByModule.data).length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
      <s-col :span="8" v-if="gradeLevel === '1'" class="grade-chart-rightbox">
        <div class="grade-chart-box">
          <div class="chart-box-header">
            <span class="grade-title">安全审计 (事件走势)</span>
          </div>
          <div class="radio-box" style="overflow: hidden;margin-right: 10px;">
            <s-button-group class="fr" style="margin: 10px 0">
              <s-button class="group-button" :class="{hoverbutton:isActive === 'today'}" @click="chooseTimeType('today')">当天</s-button>
              <s-button class="group-button" :class="{hoverbutton:isActive === 'week'}" @click="chooseTimeType('week')">本周</s-button>
              <s-button class="group-button" :class="{hoverbutton:isActive === 'month'}" @click="chooseTimeType('month')">本月</s-button>
            </s-button-group>
          </div>
          <div>
            <s-chart :chart="chart2" v-if="chart2.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px;"></div>
          </div>
        </div>
      </s-col>
    </s-row>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import barChartOption from '@/components/chart/barChartOptionY.js'
  import ringChartOption from '@/components/chart/ringChartOption.js'
  // import pieChartOption from '@/components/chart/pieChartOption.js'
  import { merge } from 'lodash'
  import barChartOptionColor from '@/components/chart/barChartOptionColor.js'
  import stackBarChartOption from '@/components/chart/stackBarChartOption.js'
    export default {
      data() {
        return {
          isActive: 'today',
          hasMonitor: true,
          adminCount: 0,
          adminAccountCount: 0,
          roleCount: {
            name: 'roleCount',
            type: 'rainbowBarChart',
            width: '100%',
            height: '100%',
            data: {},
            option: {
              grid: {
                left: '14%',
                right: '4%',
                bottom: '14%'
              },
              series: [{
                type: 'bar',
                barWidth: 20
              }]
            }
          },
          loginTypeCount: {
            name: 'loginTypeCount',
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
                top: 'center',
                left: '60%',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              },
              series: [{
                itemStyle: {
                  normal: {
                    color: function (params) {
                      var colorlist = ['#60ACFC', '#5BC49F', '#32D3EB', '#FEB64D', '#FF7C7C', '#9287E7', '#2FB2ED', '#36CEC8', '#FFDC2D', '#FC8069', '#626DE1', '#648CD9']
                      return colorlist[params.dataIndex]
                    }
                  }
                }
              }]
            }
          },
          incidentLevelCount: {
            name: 'incidentLevelCount',
            type: 'rainbowBarChart',
            width: '100%',
            height: '150px',
            data: {},
            option: {
              grid: {
                left: '14%',
                right: '4%',
                bottom: '12%'
              },
              series: [{
                type: 'bar',
                barWidth: 20
              }]
            }
          },
          roundOption: {
            title: {
              x: '33%',
              y: '43%',
              textStyle: {
                fontSize: 12,
                opacity: 0.45
              },
              subtextStyle: {
                fontSize: 16,
                opacity: 0.65,
                fontWeight: 100
              }
            },
            legend: {
              type: '',
              x: '55%',
              y: '0',
              orient: 'vertical'
            },
            series: [{
              radius: ['35%', '50%'],
              center: ['35%', '50%']
            }]
          },
          eventCountOption: {
            title: {
              x: '33%',
              y: '43%',
              textStyle: {
                fontSize: 12,
                opacity: 0.45
              },
              subtextStyle: {
                fontSize: 16,
                opacity: 0.65,
                fontWeight: 100
              }
            },
            legend: {
              type: '',
              x: '70%',
              y: '25%',
              orient: 'vertical'
            },
            series: [{
              radius: ['35%', '50%'],
              center: ['35%', '50%']
            }]
          },
          itCompOperCount: {
            el: 'itCompOperCount',
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
                    return (value.length > 7 ? (value.slice(0, 7) + '...') : value)
                  }
                },
                triggerEvent: true
              },
              color: ['#60ACFC'],
              series: [{
                type: 'bar',
                data: [],
                barWidth: 20,
                label: {
                  normal: {
                    show: true,
                    position: 'right'
                  }
                }
              }]
            }
          },
          assetImportance: {
            name: 'assetImportance',
            type: 'pieChart',
            width: '100%',
            height: '100%',
            data: [],
            option: {
              legend: {
                left: '60%',
                top: 'center',
                orient: 'vertical',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 8,             // 图例图形宽度
                itemHeight: 8,
                data: ['很高', '高', '中等', '低', '很低']
              },
              color: ['#60ACFC', '#FF9E61', '#FF6C65', '#9ADD7E', '#32D3EB'],
              series: [{
                type: 'pie',
                radius: '50%',
                center: ['35%', '50%']
              }]
            }
          },
          chart2: {
            name: 'chart2',
            type: 'lineChart',
            width: '100%',
            height: '160px',
            data: {},
            option: {
              xAxis: [
                {
                  axisLabel: {show: true},
                  axisLine: {show: false}, // 轴线不显示
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                }
              ],
              yAxis: [
                {
                  axisLabel: {show: false},
                  axisLine: {show: false}, // 轴线不显示
                  splitLine: {
                    lineStyle: {
                      type: 'dashed'
                    }
                  }
                }
              ],
              grid: {
                left: '6%',
                right: '6%',
                top: 10,
                bottom: '30%'
              },
              tooltip: {
                show: true,
                formatter: function (params) {
                  let str = `${params[0].name} <br/> 数量：${params[0].value}`;
                  return str;
                }
              },
              series: [
                {
                  itemStyle: {
                    normal: {
                      color: '#60ACFC',
                      lineStyle: {
                        color: '#60ACFC'
                      }
                    }
                  }
                }
              ]
            }
          },
          eventCountGroupByModule: {
            name: 'eventCountGroupByModule',
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
                orient: 'horizontal',
                y: 'bottom',
                left: '60%',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              },
              series: [{
                itemStyle: {
                  normal: {
                    color: function (params) {
                      var colorlist = ['#FF6C65', '#FFB851', '#EE85FF', '#A89FEC', '#60ACFC', '#32D3EB', '#BEC2C1']
                      return colorlist[params.dataIndex]
                    }
                  }
                }
              }]
            }
          },
          assetCount: {
            name: 'assetCount',
            type: 'stackBarChart',
            width: '100%',
            height: '100%',
            data: [],
            option: {
              legend: {
                orient: 'horizontal',
                y: 'top',
                x: 'right',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 8,             // 图例图形宽度
                itemHeight: 8
              },
              series: [{barWidth: 20}]
            }
          }
        }
      },
      props: ['gradeLevel'],
      mounted() {
        // 判断是否有监控模块
        let firstMenu = this.$store.getters.firstMenu;
        firstMenu = firstMenu.filter(item => {
          return item.keyWord === 'assetsMonitor';
        });
        if (firstMenu.length <= 0) {
          this.hasMonitor = false
        }
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight()
        window.addEventListener('resize', this.initDivHeight);
        this.getData()
      },
      watch: {
        '$store.state.theme': function(val) {
          this.getTheme(val)
        },
        'gradeLevel': function(val) {
          if (val === '1') {
            this.chooseTimeType('today')
          }
        }
      },
      methods: {
        getData() {
          $axios.get('/gradeProtection/getStatisticalGraphics').then(res => {
            let roleCount = []
            for (let key in res.data.roleCount) {
              if (key !== '管理员人数') {
                this.adminAccountCount += parseInt(res.data.roleCount[key])
                roleCount.push({name: key, value: parseInt(res.data.roleCount[key])})
              }
            }
            this.roleCount.data = roleCount
            this.adminCount = res.data.roleCount.管理员人数
            let title = 0
            let data = []
            for (let i in res.data.loginTypeCount) {
              title += parseInt(res.data.loginTypeCount[i])
              data.push({
                name: i,
                value: res.data.loginTypeCount[i]
              })
            }
            if (title === 0) {
              title = '0'
            }
            this.loginTypeCount.data = data
            this.loginTypeCount.option.title.subtext = title
            let eventCountGroupByModuletitle = 0
            for (let i in res.data.eventCountGroupByModule) {
              eventCountGroupByModuletitle += parseInt(res.data.eventCountGroupByModule[i].value)
            }
            if (eventCountGroupByModuletitle === 0) {
              eventCountGroupByModuletitle = '0'
            }
            this.eventCountGroupByModule.data = res.data.eventCountGroupByModule
            this.eventCountGroupByModule.option.title.subtext = eventCountGroupByModuletitle
            let incidentData = []
            for (let key in res.data.incidentLevelCount) {
              incidentData.push({name: key, value: parseInt(res.data.incidentLevelCount[key])})
            }
            this.incidentLevelCount.data = incidentData
            let assetImportance = []
            for (let i in res.data.assetImportance) {
              assetImportance.push({
                name: i,
                value: res.data.assetImportance[i]
              })
            }
            this.assetImportance.data = assetImportance
            if (res.data.itCompOperCount.length > 0) {
              let arr = res.data.itCompOperCount.slice(0, 5)
              let msg = {}
              let seriesData = []
              for (let i in arr) {
                msg[arr[i].name] = parseInt(arr[i].value);
                seriesData.push(arr[i].value)
              }
              this.itCompOperCount.opt.series[0].data = seriesData.sort(function(a, b) { return a - b })
              this.itCompOperCount.data = msg
            }
            let arr = [];
            for (let item in res.data.assetCount) {
              let newObject = {
                'stack': res.data.assetCount[item].title
              }
              for (let j in res.data.assetCount[item].data) {
                newObject[j] = Number(res.data.assetCount[item].data[j])
              }
              arr.push(newObject);
            }
            this.assetCount.data = arr;
            this.assetCount.option.yAxis[0].data = arr.map(item => item.stack)
          })
        },
        getTheme(val) {
          let option = {
            series: [{
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorlist = ['#71B3FA', '#FFB851', '#32D3EB']
                    return colorlist[params.dataIndex]
                  }
                }
              }
            }]
          }
          let optionIncident = {
            series: [{
              itemStyle: {
                normal: {
                  color: function (params) {
                    const colorlist = ['#E7493E', '#FFB851', '#60ACFC', '#BEC2C1', '#9ADD7E', '#F3608D', '#FB8032'];
                    return colorlist[params.dataIndex]
                  }
                }
              }
            }]
          }
          let assetCountOption = {
            color: [],
            xAxis: [{
              type: 'value',
              axisLine: {
                show: false // 坐标轴轴线不显示
              },
              axisLabel: {
                show: false // 坐标轴刻度不显示
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed',
                  color: ''
                }
              }
            }],
            yAxis: [{
              type: 'category',
              data: [],
              axisLine: {
                show: true,
                lineStyle: {
                  color: ''
                }
              },
              axisLabel: {
                show: true,
                color: '',
                formatter: function (value) {
                  return (value.length > 3 ? (value.slice(0, 3) + '...') : value)
                }
              },
              splitLine: {
                show: false
              },
              triggerEvent: true
            }],
            grid: {
              left: '22%',
              right: '6%',
              top: '20%',
              bottom: '10%'
            },
            series: []
          }
          let series = []
          for (let i = 0; i < 7; i++) {
            series.push(
              {
                type: 'bar',
                itemStyle: {
                  normal: {
                    label: {
                      show: false
                    }
                  }
                }
              }
            )
          }
          if (this.hasMonitor) {
            assetCountOption.color = ['#60ACFC', '#FFB851']
          } else {
            assetCountOption.series = series
            assetCountOption.color = ['#E7493E', '#FFB851', '#60ACFC', '#BEC2C1', '#9ADD7E', '#F3608D', '#FB8032'];
          }
          if (val === 'dark') {
            assetCountOption.yAxis[0].axisLabel.color = 'rgba(255,255,255,0.6)'
            assetCountOption.xAxis[0].splitLine.lineStyle.color = 'rgba(255,255,255,0.2)'
            this.loginTypeCount.option = merge({}, this.loginTypeCount.option, ringChartOption.dark, this.roundOption)
            this.eventCountGroupByModule.option = merge({}, this.eventCountGroupByModule.option, ringChartOption.dark, this.eventCountOption)
            this.roleCount.option = merge({}, this.roleCount.option, barChartOptionColor.dark, option)
            this.incidentLevelCount.option = merge({}, this.incidentLevelCount.option, barChartOption.dark, optionIncident)
            this.itCompOperCount.option = merge({}, this.itCompOperCount.option, barChartOption.dark)
            this.assetCount.option = merge({}, this.assetCount.option, stackBarChartOption.dark, assetCountOption)
          } else {
            assetCountOption.yAxis[0].axisLabel.color = 'rgba(0,0,0,0.6)'
            assetCountOption.xAxis[0].splitLine.lineStyle.color = 'rgba(0,0,0,0.2)'
            this.loginTypeCount.option = merge({}, this.loginTypeCount.option, ringChartOption.light, this.roundOption)
            this.eventCountGroupByModule.option = merge({}, this.eventCountGroupByModule.option, ringChartOption.light, this.eventCountOption)
            this.roleCount.option = merge({}, this.roleCount.option, barChartOptionColor.light, option)
            this.incidentLevelCount.option = merge({}, this.incidentLevelCount.option, barChartOption.light, optionIncident)
            this.itCompOperCount.option = merge({}, this.itCompOperCount.option, barChartOption.light)
            this.assetCount.option = merge({}, this.assetCount.option, stackBarChartOption.light, assetCountOption)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementsByClassName('grade-chart-box')[0].offsetHeight;
          this.loginTypeCount.height = boxCardItemHeight - 50 + 'px';
          this.itCompOperCount.height = boxCardItemHeight - 50 + 'px';
          this.assetImportance.height = boxCardItemHeight - 50 + 'px';
          this.chart2.height = boxCardItemHeight - 50 + 'px';
          this.eventCountGroupByModule.height = boxCardItemHeight - 50 + 'px';
          this.roleCount.height = boxCardItemHeight - 70 + 'px';
          this.incidentLevelCount.height = boxCardItemHeight - 50 + 'px';
          this.assetCount.height = boxCardItemHeight - 50 + 'px';
        },
        chooseTimeType (val) {
          if (val === 'week') {
            this.isActive = 'week';
            this.trendByWeek()
          } else if (val === 'today') {
            this.isActive = 'today';
            this.trendByDay()
          } else {
            this.isActive = 'month';
            this.trendByMonth()
          }
        },
        trendByDay() {
          // 当天事件走势
          $axios.get('eventCount/getEventCountByDay').then((res) => {
            if (res.data && res.data instanceof Array) {
              this.chart2.data = res.data;
            }
          });
        },
        trendByWeek() {
          // 本周事件走势
          $axios.get('eventCount/getEventCountByWeek').then((res) => {
            if (res.data && res.data instanceof Array) {
              this.chart2.data = res.data;
            }
          });
        },
        trendByMonth() {
          // 本月事件走势
          $axios.get('eventCount/getEventCountByMonth').then((res) => {
            if (res.data && res.data instanceof Array) {
              this.chart2.data = res.data;
            }
          });
        }
      },
      destroyed() {
        window.removeEventListener('resize', this.initDivHeight);
      }
    }
</script>

<style scoped>
  .grade-chart-leftbox {
    padding-right: 10px;
  }
  .grade-chart-centerbox {
    padding: 0 10px;
  }
  .grade-chart-rightbox {
    padding-left: 10px;
  }
</style>
