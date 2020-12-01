<template>
  <section class="content logCenterBase autoOpsfix" style="height: calc(100vh - 45px);" id="process-center">
    <s-row :gutter="10" id="process-main-card" style="height: 100%">
      <s-col span="19" style="height: 100%;" class="ProcessLeft">
        <s-row :gutter="10" style="height: 100%;">
          <s-col span="24" style="padding-right: 0;height: 100%;">
            <section class="main-card-content box-card" style="height: calc( (100vh - 98px) / 3 * 2 - 15px);margin-bottom:5px;">
              <s-tab v-model="activeTab" >
                <s-tab-pane :label="myWillDoneLabel" name="myWillDone">
                  <div v-if="activeTab ==='myWillDone'">
                    <s-row class="Orderbackground" style="line-height:30px;margin: 10px 0 1px 10px;" id="selectRow">
                      <s-col span="22">
                        <span style="font-size: 14px; padding-left: 14px;">筛选工单：</span>
                        <s-select style="width: 200px;" v-model="pendingOrder" @change="changeType">
                          <s-option label="全部" :value="null"></s-option>
                          <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                    :label="value.bulletinName"></s-option>
                        </s-select>
                      </s-col>
                      <span class="card-enter more-info" style="margin-right: 20px;font-size: 14px;"><div @click="gotoMore('safetyBulletin_myToDo')">更多</div></span>
                    </s-row>
                    <s-row shape="beauty" style="padding:0 5px 0 20px">
                      <s-scrollbar v-if="pendingLists.length" :wrap-style="'height: calc( (100vh - 98px) / 5 * 4);z-index:-1;'" class="Orderbackground">
                        <s-carousel class="work-order-wrapper" arrow="never" :autoplay="false" :height=" 650 +'px'">
                          <s-carousel-item  v-for="(items, indexes) in pendingListsDouble" :key="indexes + 'outter'">
                            <s-row class="operational-equip" type="flex" align="middle">
                              <deal-work-item
                              v-for="(item, index) in pendingListsDouble[indexes]"
                              :key="indexes * 6 + index + 'inner'"
                              :num="indexes * 6 + index"
                              :spanHeight="spanHeight"
                              :model="item"
                              @receive='receive'
                              :flowType='1'
                              :userData='userData'
                              ></deal-work-item>
                            </s-row>
                          </s-carousel-item>
                        </s-carousel>
                      </s-scrollbar>
                      <div v-nodata="true" v-else :style="'height:' + mainScrollbarHeight + 'px'"></div>
                    </s-row>
                    <s-row :gutter="10">
                      <s-col span="24">
                        <s-card class="box-card card-line" style="height: calc(((100vh - 98px) /  3 * 0) - 15px); margin: 0;">
                          <div slot="header" class="clearfix">
                            <span class="card-title">
                              最近24小时工单
                            </span>
                          </div>
                          <s-chart :chart="chart4"></s-chart>
                        </s-card>
                      </s-col>
                    </s-row>
                  </div>
                </s-tab-pane>
                <s-tab-pane :label="myApprovalLabel" name="myApproval">
                  <div v-if="activeTab ==='myApproval'">
                    <s-row class="Orderbackground" style="line-height:30px;margin: 10px 0 1px 10px;" id="selectRow">
                      <s-col span="2" style="font-size: 14px; padding-left: 14px;">筛选工单：</s-col>
                      <s-col span="20">
                        <s-select style="width: 200px;" v-model="pendingOrder" @change="changeType">
                          <s-option label="全部" :value="null"></s-option>
                          <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                    :label="value.bulletinName"></s-option>
                        </s-select>
                      </s-col>
                      <span class="card-enter more-info" style="margin-right: 20px;font-size: 14px;"><div @click="gotoMore('safetyBulletin_myApproval')">更多</div></span>
                    </s-row>
                    <s-row shape="beauty" style="padding:0 5px 0 20px">
                      <s-carousel v-if="pendingLists.length" class="work-order-wrapper" arrow="never" :autoplay="false" :height=" + carouselHeight1 +'px'">
                          <s-carousel-item  v-for="(items, indexes) in pendingListsDouble" :key="indexes + 'outter'">
                            <s-row class="operational-equip" type="flex" align="middle">
                              <deal-work-item
                              v-for="(item, index) in pendingListsDouble[indexes]"
                              :key="indexes * 6 + index + 'inner'"
                              :num="indexes * 6 + index"
                              :spanHeight="spanHeight"
                              :model="item"
                              :flowType='2'
                              @receive='receive'
                              :userData='userData'
                              ></deal-work-item>
                            </s-row>
                          </s-carousel-item>
                        </s-carousel>
                      <div v-nodata="true" v-else :style="'height: ' + carouselHeight1 +'px'"></div>
                    </s-row>
                  </div>
                 </s-tab-pane>
                <s-tab-pane :label="InformationReceipt" name="InformationReceipt">
                    <s-row class="Orderbackground" style="line-height:30px;margin: 10px 0 1px 10px;" id="selectRow">
                      <s-col span="2" style="font-size: 14px; padding-left: 14px;">筛选工单：</s-col>
                      <s-col span="20">
                        <s-select style="width: 200px;" v-model="pendingOrder" @change="changeType">
                          <s-option label="全部" :value="null"></s-option>
                          <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="value.uuid"
                                    :label="value.bulletinName"></s-option>
                        </s-select>
                      </s-col>
                      <span class="card-enter more-info" style="margin-right: 20px;font-size: 14px;"><div @click="gotoMore('safetyBulletin_myInformationReceipt')">更多</div></span>
                    </s-row>
                    <s-row shape="beauty" style="padding:0 5px 0 20px">
                      <s-carousel v-if="pendingLists.length" class="work-order-wrapper" arrow="never" :autoplay="false" :height=" + carouselHeight1 +'px'">
                          <s-carousel-item  v-for="(items, indexes) in pendingListsDouble" :key="indexes + 'outter'">
                            <s-row class="operational-equip" type="flex" align="middle">
                              <deal-work-item
                              v-for="(item, index) in pendingListsDouble[indexes]"
                              :key="indexes * 6 + index + 'inner'"
                              :num="indexes * 6 + index"
                              :spanHeight="spanHeight"
                              :model="item"
                              @receive='receive'
                              :flowType='3'
                              :userData='userData'
                              ></deal-work-item>
                            </s-row>
                          </s-carousel-item>
                        </s-carousel>
                      <div v-nodata="true" v-else :style="'height: ' + carouselHeight1 +'px'"></div>
                    </s-row>
                </s-tab-pane>
                <s-tab-pane :label="myHavedoneLabel" name="myHavedone" style="padding:10px 20px;min-height:350px">
                    <my-Havedone v-if="activeTab === 'myHavedone'"></my-Havedone>
                </s-tab-pane>
                <s-tab-pane :label="myAttentionLabel" name="myAttention" style="padding:10px 20px;min-height:350px">
                    <my-Attention v-if="activeTab === 'myAttention'"></my-Attention>
                </s-tab-pane>
              </s-tab>
            </section>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="5" class="processRight logCenterBase logCard" style="height: 100%;">
        <navs :modelName="'safetyBulletin'" @goto="goto" @gotoReport="gotoReport" style="margin: 20px 20px 10px 10px"></navs>
        <s-scrollbar wrap-style="height:calc(100vh - 153px);">
          <div style="margin: 0px 20px 10px 10px">
            <s-button icon='plus' style="width:100%" @click='Bulletin'>通报下发</s-button>
          </div>
          <s-card class="box-card card-line"  style="margin-top: 15px">
            <div class="clearfix ys processTit" style="padding: 0;border: none;">
                  <span class="card-title">
                    近七天通报下发趋势图
                  </span>
            </div>
            <s-chart :chart="chart1" v-if="chart1.data.length"></s-chart>
            <div v-nodata="true" v-else style="height: 250px"></div>
          </s-card>
          <s-card class="box-card card-line"  style="margin-top: 15px">
            <div class="clearfix ys processTit" style="padding: 0;border: none;">
                  <span class="card-title">
                    近七天通报完成状况统计
                  </span>
            </div>
              <div id="chartData" :style="{height:chartHeight5,minHeight:'200px'}">
                <bar-chart v-if="chart2.data.length" :chart="chart2"></bar-chart>
                <div v-nodata="!chart2.data.length"></div>
              </div>
          </s-card>
        </s-scrollbar>
      </s-col>
    </s-row>
        <!--添加编辑通报下发-->
    <add-release-bulletin
      v-if="addReleaseBulletinFlag"
      v-model="addReleaseBulletinFlag"
      :bulletinTypeUuid="bulletinTypeUuid"
      :rowData="rowData"
      @updateTable="getList"
    >
    </add-release-bulletin>
  </section>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import navs from '@/components/navButton/NavButton.vue'
  import dealWorkItem from '@/home/SafetyBulletin/safeDialog/SafeWorkItem.vue'
  import { merge } from 'lodash';
  import CloseDialog from '@/pages/Process_MyOther/components/CloseDialog';
  // import PublishDelegateDialog from './ProcessUndealOrders/PublishDelegateDialog.vue';
  import authCheck from '@/common/mixins/auth.js'
  // import ringChartOption from '@/components/chart/pieChartOption.js'
  import lineChartOption from '@/components/chart/lineChartOption.js'
  import myHavedone from '@/pages/Safety_BulletinTask/MyHaveDone';
  import myAttention from '@/pages/Safety_BulletinTask/MyAttention';
  import barChart from '@/components/chart/barChart.vue'
  import addReleaseBulletin from '@/pages/Safety_BulletinTask/components/dialog/AddReleaseBulletin'
  export default {
    mixins: [authCheck],
    data() {
      return {
        // 右上角nav按钮
        knowDialog: false,
        issueDialog: false,
        changeDialog: false,
        publishDialog: false,
        radio: null,
        delegateDialog: false,
        Counter: [],
        deletitle: '事件工单委派给他人',
        templateDialogFlag: false,
        orderTemDialog: false,
        navsList: [],
        carouselHeight1: 0,
        specialOperationHeight: 200,
        workloadTopN: [], // 工作量统计TOP5数组
        orderList: [], // 待跟踪工单数组
        pendingOrder: null, // 待处理工单类型选中值
        allOrderTypes: [], // 全部工单类型数组
        orderTypeMap: {}, // 我的审批工单类型
        createOrderTypes: [],
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
        roundOption: {
          legend: {
            y: '90%',
            y1: '10px'
          },
          series: [{
            type: 'pie',
            center: ['50%', '45%'],
            radius: '60%'
          }]
        },
        chart2: {
          height: '100%',
          name: 'chartData',
          data: [],
          option: {
            series: [
              {barWidth: '12px'},
              {barWidth: '15px'}
            ]
          }
        },
        chart4: {
          name: 'chart4',
          type: 'multilineChart',
          width: '100%',
          height: '240px',
          data: [],
          option: {
            yAxis: [{
              axisLine: {
                show: false
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed'
                }
              }
            }],
            color: ['#60ACFC', '#5BC49F']
          }
        },
        workLoadMoreBox: {
          show: false,
          title: '',
          select: 0
        },
        orderDelegateBox: {
          show: false
        },
        workOrderBox: {
          show: false,
          workflowType: null,
          orderType: '',
          id: {},
          child: {},
          assetCurrent: [],
          tabIndex: 0,
          savebtn: true
        },
        isChild: 0,
        workOrderDetailsBox: {
          show: false,
          btn: false,
          id: {}
        },
        processSetBox: {
          show: false,
          processSetFrom: []
        },
        pendingLists: [],
        OrderType: -1,
        orderDelegateCurrent: {},
        scrollbarHeight: null,
        mainScrollbarHeight: 0,
        otherScrollbarHeight: 0,
        carouselHeight: 0,
        spanHeight: 20,
        boxCardHeight: 0,
        orderType: 0,
        activeTab: 'myWillDone',
        Closedialog: false,
        myWillDoneLabel: '我的待办 (0)',
        myApprovalLabel: '我的审批 (0)',
        InformationReceipt: '信息回执 (0)',
        myHavedoneLabel: '我的已办',
        myAttentionLabel: '我的关注',
        changeItem: 'getNeedMineDoOrder',
        userData: [],
        addReleaseBulletinFlag: false,
        rowData: {},
        bulletinTypeUuid: '',
        chartHeight5: '100px'
      }
    },
    components: {
      navs,
      dealWorkItem,
      CloseDialog,
      myHavedone,
      myAttention,
      barChart,
      addReleaseBulletin
    },
    watch: {
      activeTab: function (val) {
        if (val === 'myWillDone') {
          this.changeItem = 'getNeedMineDoOrder'
          this.pendingOrder = null
          this.getData('getNeedMineDoOrder')
        } else if (val === 'myApproval') {
          this.changeItem = 'getNeedMineApproval'
          this.pendingOrder = null
          this.getData('getNeedMineApproval')
        } else if (val === 'InformationReceipt') {
          this.changeItem = 'getMyNoticeList'
          this.pendingOrder = null
          this.getData('getMyNoticeList')
        }
      },
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    computed: {
      // pendingListsDouble
      pendingListsDouble() {
        let DoubleList = new Array([])
        for (let i = 0; i < this.pendingLists.length; i += 9) {
          let k = Math.floor(i / 9)
          DoubleList[k] = []
          for (let j = 0; j < 9; j++) {
            this.pendingLists[i + j] ? DoubleList[k].push(this.pendingLists[i + j]) : ''
          }
        }
        return DoubleList
      }
    },
    created() {
      this.getUser()
      this.getLabel()
      $axios.get('/safetyPlatform/safeOrder/getNearDayCount/7').then(res => {
        let Arr = []
        res.data.map((val) => {
          Arr.push({
            name: val.weekStr,
            value: val.count
          })
        })
          this.chart1.data = Arr
      })
      $axios.get('/safetyPlatform/safeOrder/getOrderTypeStatusCount').then(res => {
        let arr = []
          res.data.map(val => {
            arr.push({
              value: val.finishCount,
              name: val.safeTypeName
            })
          })
          this.chart2.data = arr
          console.log(this.chart2.data)
          this.chartHeight5 = res.data.length * 50 + 'px'
    })
    },
    methods: {
      getLabel() {
        $axios.get('/safetyPlatform/safeOrder/getAssignedMineCount').then(res => {
          this.myWillDoneLabel = '我的待办' + ' ' + '(' + res.data.needMineDoOrderCount + ')'
          this.myApprovalLabel = '我的审批' + ' ' + '(' + res.data.needMineApprovalCount + ')'
          this.InformationReceipt = '信息回执' + ' ' + '(' + res.data.myNoticeListCount + ')'
          // this.myHavedoneLabel = '我的已办' + ' ' + '(' + res.data.dealedOrderCnt + ')'
          // this.myAttentionLabel = '我的关注' + ' ' + '(' + res.data.concernOrderCnt + ')'
        })
      },
      getList() {
        this.getLabel()
        this.getData(this.changeItem)
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chart1.option = merge({}, this.chart1.option, lineChartOption.dark)
        } else {
          this.chart1.option = merge({}, this.chart1.option, lineChartOption.light)
        }
      },
      changeType () {
          this.getData(this.changeItem)
      },
      initDivHeight () {
        var mainCardContentHeight = document.getElementsByClassName('main-card-content')[0].offsetHeight;
        var tableHeight = document.getElementsByClassName('logCenterBase')[0].offsetHeight;
        // var mainHeight = document.getElementById('process-main-card').offsetHeight;
        var accountBtnsHeight = document.getElementsByClassName('accountBtns')[0].offsetHeight;
        var sCardHeader = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        var selectRowHeight = document.getElementById('selectRow') ? document.getElementById('selectRow').offsetHeight : 0;
        let chartHeight = mainCardContentHeight / 2 - sCardHeader + 20 + 'px'
        this.chart1.height = mainCardContentHeight / 2 - sCardHeader + 50 + 'px';
        this.specialOperationHeight = chartHeight;
        this.chart4.height = chartHeight;
        this.mainScrollbarHeight = mainCardContentHeight - 65;
        this.otherScrollbarHeight = tableHeight - 120;
        let tempCarouseHeight = this.mainScrollbarHeight - 22;
        let tempCarouseHeight1 = this.mainScrollbarHeight + 140;
        this.carouselHeight = tempCarouseHeight > 315 ? tempCarouseHeight : 315;
        this.carouselHeight1 = tempCarouseHeight1 > 315 ? tempCarouseHeight1 : 315;
        // this.boxCardHeight = (mainCardContentHeight * 3 / 2 - accountBtnsHeight - 11) * 2;
       this.boxCardHeight = (mainCardContentHeight * 3 / 2 - accountBtnsHeight - 60) * 2 / 3;
        this.scrollbarHeight = this.boxCardHeight - sCardHeader;
        var tempSpanHeight = (mainCardContentHeight - sCardHeader - selectRowHeight - 280) / 4;
        this.spanHeight = tempSpanHeight > 18 ? tempSpanHeight : 18;
      },
      receive(val) {
        if (val) {
          this.getData(this.changeItem)
          this.getLabel()
        }
      },
      gotoMore(e) {
        this.$router.push(`/SafetyBulletin/${e}`)
      },
      goto(path) {
        this.$router.push('/SafetyBulletin/' + path)
      },
      Bulletin() {
        this.addReleaseBulletinFlag = true
      },
      gotoReport() {
      },
      openDia() {
      },
      getUser() {
        $axios.get(`/safetyPlatform/safeOrder/getSafeUserInfoList`).then(res => {
            this.userData = res.data
        })
      },

      // 获取我的待办列表
      getData(num) {
        let parms = {
            currentPage: 1,
            pageSize: 45,
            condition: {
              safeId: '',
              title: '',
              typeUuid: this.pendingOrder,
              userName: '',
              startTime: '',
              endTime: ''
            }
        }
        $axios.post(`/safetyPlatform/safeOrder/${num}`, parms).then(({data}) => {
            this.pendingLists = data.pageList
            if (this.pendingLists.length > 5) {
              this.pendingLists = this.pendingLists.slice(0, 45)
            }
          })
      },
      goWeekWorkAccount(data) {
        let orderType = (data.name === '服务' || data.name === '服务请求') ? '服务请求' : data.name;
        this.goto('ProcessCenter/WeekWorkAccount/2/' + orderType);
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    mounted() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      const _this = this
      _this.getData('getNeedMineDoOrder');
      _this.$nextTick(() => {
        _this.initDivHeight();
        window.addEventListener('resize', _this.initDivHeight);
      });
      $axios.get('/safetyPlatform/safeOrder/getAllSafeType').then(res => {
        _this.orderTypeMap = res.data;
      })
    }
  }
</script>
<style lang="stylus">
  #process-center
    .processTit
      height: 40px
      line-height: 40px
      font-weight: 600
    .changetest
      margin-left: 5px
      font-size: 14px
      padding: 5px 0
      margin-bottom: 10px
      margin-right: 10px
    .titletest
      font-size: 16px
      margin-left: 10px
      cursor:pointer
    .timetest
      margin-left: 10px
      margin-right: 5px
    .section-header
      height:30px
      padding:3px 10px
      line-height: 35px
      .s-col
        font-size: 15px
        cursor: pointer
      .speedsearch
        text-align: right
    .nodata
      color: #5e7382;
      font-size: 18px;
      position: absolute;
      left: 50%;
      margin-top: 40%;
      transform: translate(-50%,-50%);
    .s-tabs-header
      margin: 0px !important
      padding-left 20px
      height 40px
      line-height: 40px;
  // 创建工单
  .createProcess
    .s-form-item-content
      & > .s-input, .s-select, .s-textarea, .upload
        width: calc(100% - 49px)
</style>
