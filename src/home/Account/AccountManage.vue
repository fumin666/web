<template>
  <section class="content account-box home-page-box">
    <s-row>
      <s-col span="19" class="main-left">
        <s-card class="main-card-content box-card card-line account-card" id="orgGraphCard" style="height: calc(100vh - 310px);">
          <div slot="header" class="clearfix">
            <span class="card-title">
              组织机构管理
            </span>
            <div class="card-enter more-info" @click="goto('orgTopo')">更多</div>
          </div>
          <accountOrgGraph ref="accountGraph"></accountOrgGraph>
          <div class="linearline"></div>
        </s-card>
        <div class="tab-box">
          <div class="tab-more more-info"  @click="goto(`accountManage_passwordExpiration/${moreTab}`)">更多</div>
          <s-tab v-model="activeTab">
            <s-tab-pane label="密码过期" name="pane3">
              <!--密码账号-component-->
              <account-pwd-overdue></account-pwd-overdue>
            </s-tab-pane>
            <s-tab-pane label="账号过期" name="pane2">
              <!--账号过期-component-->
              <account-acc-overdue></account-acc-overdue>
            </s-tab-pane>
          </s-tab>
        </div>
      </s-col>
      <s-col span="5" class="main-right">
        <navs :modelName="'accountManage'" @openDialog="securitySetClick" @goto="goto" @buttonCount='buttonCount' class="contentOpacity" style="padding-right: 20px;"></navs>
        <s-scrollbar :wrap-style="wrapstyle" class="clr right-scroll">
          <s-card class="box-card card-line right-card">
            <div slot="header" class="clearfix">
            <span class="card-title">
              <!--<i class="iconfont icon-pie-chart"></i>-->
              账号状态统计
            </span>
            </div>
            <div v-nodata="!chart1.data.length" style="height: 350px">
              <s-chart :chart="chart1" v-if="Object.keys(chart1.data).length"></s-chart>
            </div>
          </s-card>
          <s-card class="box-card card-line right-card">
            <div slot="header" class="clearfix">
            <span class="card-title">
              不活跃账号趋势图
            </span>
            </div>
            <div v-nodata="!chart2.data.length" style="height: 200px">
              <s-chart :chart="chart2" v-if="chart2.data.length"></s-chart>
            </div>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
    <security-set-dialog v-model="securitySetDialog" v-if="securitySetDialog"></security-set-dialog>
    <!-- 应用系统登录 -->
    <BussinessLogin :loginDialog.sync="loginDialog" v-if="loginDialog" ></BussinessLogin>
    <!--发现幽灵账号-->
    <s-dialog
      v-model="ghostDialog"
      v-if="ghostDialog"
      width="70%"
      title="查看稽核结果详情">
      <ghost-dialog :init="firstAudit"></ghost-dialog>
    </s-dialog>
  </section>

</template>

<script type="text/babel">
  import ringChartOption from '@/components/chart/ringChartOption.js'
  import { merge } from 'lodash'
  import navs from '@/components/navButton/NavButton';
  import securitySetDialog from '@/pages/Account_SecuritySet/SecuritySet';
  import BussinessLogin from '@/pages/Account_Login/BussinessLogin.vue';
  import accountOrgGraph from '@/pages/Account_Organization/AccountOrgGraph';
  import AccountPwdOverdue from './AccountPwdOverdue';
  import AccountAccOverdue from './AccountAccOverdue';
  import $axios from 'sunflower-ajax'
  import ghostDialog from './GhostAccount'
  // import {chunk} from 'lodash';
  import authCheck from '@/common/mixins/auth.js'
  export default {
    mixins: [authCheck],
    data () {
      return {
        btncount: 6,
        maxheight: 170,
        activeTab: 'pane3',
        moreTab: 3,  // 过期的tab
        chartHeight: 140,
        auditList: [
          {
            name: '稽核时间',
            content: '2017-05-04 12:09:23'
          },
          {
            name: '稽核申请者',
            content: 'cafthy'
          },
          {
            name: '稽核资产数',
            content: '12个'
          },
          {
            name: '发现幽灵账号',
            content: '60个'
          },
          {
            name: '下次稽核时间',
            content: '2017-05-18 12:09:23'
          }
        ],
        chart1: {
          name: 'chart',
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
        chart2: {
          name: 'chart2',
          type: 'lineChart',
          width: '100%',
          height: '200px',
          data: [],
          option: {
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
              left: 20,
              right: 20,
              top: 20,
              bottom: 20
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
            ],
            tooltip: {
              show: true,
              formatter: function (params) {
                let str = `${params[0].name} <br/> 数量：${params[0].value}`;
                return str;
              }
            }
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
        securitySetDialog: false,
        loginDialog: false,
        ghostDialog: false,
        isolateListLength: '',
        // firstAudit: {},
        changePass: {}
      }
    },
    components: {
      navs,
      securitySetDialog,
      BussinessLogin,
      accountOrgGraph,
      ghostDialog,
      AccountPwdOverdue,
      AccountAccOverdue
    },
    watch: {
      'activeTab': {
        immediate: true,
        handler: function(val) {
          if (val === 'pane3') {
            this.moreTab = 3
          } else {
            this.moreTab = 2
          }
        }
      },
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    computed: {
      wrapstyle() {
        return 'max-height:' + this.maxheight + 'px;';
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },
    mounted() {
      this.getChart();
      // this.getAudit();
      this.getChangePass();
      this.getInactiveChart();
      this.$nextTick(() => {
        window.addEventListener('resize', this.initDivHeight);
        window.addEventListener('resize', this.computeAssetHeight);
      });
    },
    beforeRouteLeave (to, from, next) {
      this.$refs['accountGraph'].closeFloatBox();
      next()
    },
    methods: {
      // 计算右侧按钮的高度
      buttonCount(count) {
        this.btncount = count;
        this.computeAssetHeight();
      },
      computeAssetHeight() {
        let navbuttonheight = Math.ceil(this.btncount / 2) * 40;
        // eslint-disable-next-line no-undef
        let sreenheight = $('#app').height();
        this.maxheight = sreenheight - navbuttonheight - 90;
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.dark, this.roundOption)
        } else {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.light, this.roundOption)
        }
      },
      // getAudit() {
      //   $axios.post('/collectTask/getLatestTaskInfo').then((res) => {
      //     this.firstAudit = res.data
      //   });
      // },
      getChangePass() {
        $axios.post('/tPasswdChangeTask/getMakePwdDetail').then((res) => {
          this.changePass = res.data
        });
      },
      getChart() {
        $axios.get('iamUserInfo/getCountByStatus').then((res) => {
          this.chart1.data = res.data
          let accountNum = 0
          res.data.forEach(v => {
            accountNum += v.value
          })
          this.chart1.option.title.subtext = accountNum
        });
      },
      goto(path) {
        this.$router.push('/AccountManage/' + path)
      },
      securitySetClick(key) {
        if (key === 'appSystemAccess') { // 应用系统登录
          this.loginDialog = true;
        } else {
          this.securitySetDialog = true;// 安全配置
        }
      },
      showGhostAccount() {
        this.ghostDialog = true
      },
      getInactiveChart() { // 不活跃账号趋势图
        let param = {
            dateType: 'week',
            departUuidList: null,
            startTime: null,
            endTime: null,
            startDay: null,
            endDay: null
          };
        $axios.post('/iamUserInfo/inactiveAccountStatistical', param).then((res) => {
          let newArr = [];
          res.data.forEach((v, i) => {
            newArr.push({name: v.weekFew, value: v.count === null ? 0 : v.count})
          });
          this.chart2.data = newArr
        });
      }
    }
  }
</script>
<style lang="stylus">
  .account-box
    width 100%
    height 100%
    margin 0 auto
    &>.s-row
      height 100%
      margin-bottom 0
      .tab-box
        position relative
        .tab-more
          position absolute
          right 20px
          top: 12.5px
          z-index 100
          cursor pointer
      .s-tabs-nav-wrap
        padding 0 20px
      .main-left
        height 100%
        .account-card
          .s-card-header
            padding 0 20px
      .main-right
        padding 20px 0 20px 20px
        .right-scroll
          .s-scrollbar-wrap
            padding-right 20px
        .right-card
          .s-card-header
            padding-right 16px
            border-bottom none!important
</style>
