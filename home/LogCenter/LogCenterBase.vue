<template>
  <section class="content logCenterBase autoOpsfix" style="height: calc(100vh - 45px);">
    <s-row :gutter="10" style="height: 100%;">
      <s-col :span="19" style="height: 100%;">
        <section class="autoOperation logCard" style="height: 60%;box-shadow: inset -1px 0 0 rgba(123, 134, 164, .2);">
          <s-row style="height: 100%;">
            <s-card class="box-card card-line" style="height: calc( 2 *  (100vh - 80px) / 4);"
                    id="boxCardItem">
              <div slot="header">
                <div class="clearfix">
                <span class="card-title">
                  报表中心
                </span>
                </div>
              </div>
              <s-col :span="4" style="margin-top: 8px;">
                <navs1 :modelName="'logCenterDynamic1'" @goto="showLogInfo" class="logCenter" key="log"></navs1>
              </s-col>
              <component :is="currentView" :ref="currentView"></component>
            </s-card>
          </s-row>
        </section>
        <section class="autoScriptStatic" style="height: 40%;box-shadow: inset -1px 0 0 rgba(123, 134, 164, .2);">
          <component :is="currentView1" :ref="currentView1" style="height: 100%;" :monitorChart="monitorChart"></component>
        </section>
      </s-col>
      <s-col :span="5" class="logCard" style="height: 100%;">
        <!--返回的分类报表 ，报表订阅-->
        <navs :modelName="'logCenter'" @goto="goto" @buttonCount="buttonCount" class="logCenterNavs" key="log"></navs>
        <s-scrollbar :wrap-style="wrapstyle">
          <s-card class="box-card card-line">
            <div class="clearfix ys processTit" style="padding: 0;border: none;">
              <span class="card-title menu-title">账号统计</span>
            </div>
            <s-chart :chart="chart3" v-if="chart3.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px"></div>
          </s-card>
          <s-card class="box-card card-line" style="margin-top: 15px;">
            <div class="clearfix ys processTit" style="padding: 0;border: none;">
              <span class="card-title menu-title">资产统计</span>
            </div>
            <div class="chart">
              <s-charts :chart="chartAssetClass" v-if="Object.keys(chartAssetClass.data).length > 0"></s-charts>
              <div v-nodata="true" v-else style="height: 250px"></div>
            </div>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import ringChartOption from '@/components/chart/ringChartOption.js'
  import barChartOption from '@/components/chart/barChartOptionY.js'
  import { merge } from 'lodash'
  import navs from '@/components/navButton/NavButton.vue';
  import navs1 from './NavButton.vue';
  import $axios from 'sunflower-ajax';
  import BasicUniversal from '@/components/logCenterComponent/BasicUniversal';
  import BasicUniversalCom from '@/components/logCenterComponent/BasicUniversalCom';
  import AssetsMonitor from '@/components/logCenterComponent/AssetsMonitor';
  import AssetsMonitorCom from '@/components/logCenterComponent/AssetsMonitorCom';
  import BasicOperation from '@/components/logCenterComponent/BasicOperation';
  import BasicOperationCom from '@/components/logCenterComponent/BasicOperationCom';
  import LogAudit from '@/components/logCenterComponent/LogAudit';
  import LogAuditCom from '@/components/logCenterComponent/LogAuditCom';
  import ProcessManage from '@/components/logCenterComponent/ProcessManage';
  import ProcessManageCom from '@/components/logCenterComponent/ProcessManageCom';
  import SqlAudit from '@/components/logCenterComponent/SqlAudit';
  import SqlAuditCom from '@/components/logCenterComponent/SqlAuditCom';
  export default {
    data () {
      return {
        institutionData: [],
        chartAssetClass: {
          el: 'chartAssetClass',
          type: 'yBarChart',
          width: '100%',
          height: '360px',
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
        chart3: {
          name: 'chart3',
          type: 'statRingChart',
          width: '100%',
          height: '350px',
          data: {},
          option: {
            title: {
              text: '账号总数',
              subtext: 0
            },
            legend: {
              orient: 'horizontal',
              y: 'bottom',
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
                    var colorlist = ['#98DF79', '#FF9F63', '#FFB740', '#FF6C65', '#5CAAFF', '#BBC1D2', '#837F7F']
                    return colorlist[params.dataIndex]
                  }
                }
              }
            }]
          }
        },
        roundOption: {
          title: {
            x: '48%',
            y: '35%',
            textStyle: {
              fontSize: 14
            }
          },
          legend: {
            type: '',
            x: 'left',
            y: '80%',
            orient: 'horizontal'
          },
          series: [{
            radius: ['40%', '60%'],
            center: ['50%', '40%']
          }]
        },
        currentView: 'BasicUniversal',
        currentView1: 'BasicUniversalCom',
        monitorChart: [],
        btncount: 6,
        maxheight: 172
      }
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    components: {
      navs,
      navs1,
      BasicUniversal,
      BasicUniversalCom,
      AssetsMonitor,
      AssetsMonitorCom,
      BasicOperation,
      BasicOperationCom,
      LogAudit,
      LogAuditCom,
      ProcessManage,
      ProcessManageCom,
      SqlAudit,
      SqlAuditCom
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    methods: {
      getTheme(val) {
        if (val === 'dark') {
          this.chart3.option = merge({}, this.chart3.option, ringChartOption.dark, this.roundOption)
          this.chartAssetClass.option = merge({}, this.chartAssetClass.option, barChartOption.dark)
        } else {
          this.chart3.option = merge({}, this.chart3.option, ringChartOption.light, this.roundOption)
          this.chartAssetClass.option = merge({}, this.chartAssetClass.option, barChartOption.light)
        }
      },
      showLogInfo (data) {
        if (data === 'logCenter_base') {
          this.currentView = 'BasicUniversal'
          this.currentView1 = 'BasicUniversalCom'
        } else if (data === 'logCenter_imp') {
          this.currentView = 'AssetsMonitor'
          this.currentView1 = 'AssetsMonitorCom'
        } else if (data === 'logCenter_oma') {
          this.currentView = 'BasicOperation'
          this.currentView1 = 'BasicOperationCom'
        } else if (data === 'logCenter_siem') {
          this.currentView = 'LogAudit'
          this.currentView1 = 'LogAuditCom'
        } else if (data === 'logCenter_itil') {
          this.currentView = 'ProcessManage'
          this.currentView1 = 'ProcessManageCom'
        } else if (data === 'logCenter_dba') {
          this.currentView = 'SqlAudit'
          this.currentView1 = 'SqlAuditCom'
        }
      },
      initDivHeight () {
        var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
        this.chartAssetClass.height = boxCardItemHeight - 100 + 'px';
        this.chart3.height = boxCardItemHeight - 100 + 'px';
      },
      computeAutoOpsHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 33;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#index-body').height();
        this.maxheight = sreenheight - navbuttonheight - 25;
      },
      buttonCount(count) {
        this.btncount = count;
        this.computeAutoOpsHeight();
      },
      // 跳转
      goto(path) {
        this.$router.push('/LogCenter/' + path)
      },
      // 跳转Tab
      gotoTab(path, tab) {
        this.$router.push(`/LogCenter/${path}/${tab}`)
      }
    },
    mounted() {
      this.initDivHeight()
      window.addEventListener('resize', this.initDivHeight);
      $axios.get('/logCenterIndex/assetCitypeCount').then((res) => {
        if (Object.keys(res.data).length > 0) {
          for (let key in res.data) {
            var param = {
              value: 0,
              name: ''
            };
            param.name = key;
            param.value = res.data[key];
            this.chartAssetClass.opt.series[0].data.push(param.value)
          }
          this.chartAssetClass.data = res.data;
        }
      });
      $axios.get('iamUserInfo/getCountByStatus').then((res) => {
        if (res.data.length > 0) {
          this.chart3.data = res.data
          let title = 0
          for (let i in res.data) {
            title += res.data[i].value
          }
          if (title === 0) {
            title = '0'
          }
          this.chart3.option.title.subtext = title
        }
      });
      $axios.get('/monitorcitype/getStatCountCitype').then((res) => {
        this.monitorChart = res.data.slice(0, 5)
      });
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .logCenterBase
    .processTit
      height: 40px
      line-height: 40px
      font-weight: 600
    & .s-card
      overflow visible
      & .chart-box
        margin-top 15px
    & .s-carousel
      box-shadow 0 0 0
    & .s-carousel-item.is-active
      border: none
      box-shadow: 0 0 0
      background none
    & .logCenterNavs
      margin 20px 20px 10px 10px
      & li
        & i
          margin-left 3px
        & span
          letter-spacing: -0.07em;
    & .logCenter
      & .accountBtns
        & li
          float: none;
          padding-left: 20%;
          border: none;
          box-shadow: none;
          margin-left: 0;
          height 35px
          line-height 35px
          width: 100%;
          box-sizing: border-box
</style>
