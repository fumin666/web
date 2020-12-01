<template>
  <section class="content logCenterBase autoOpsfix" style="height: calc(100vh - 45px);" id="process-center">
    <s-row :gutter="10" id="process-main-card" style="height: 100%">
      <s-col span="19" style="height: 100%;" class="ProcessLeft">
        <s-row :gutter="10" style="height: 100%;">
          <s-col span="24" style="padding-right: 0;height: 100%;">
            <section class="main-card-content box-card" style="height: calc( (100vh - 98px) / 3 * 2 - 15px);margin-bottom:5px;">
              <s-tab v-model="activeTab">
                <s-tab-pane :label="myWillDoneLabel" name="myWillDone">
                  <div v-if="activeTab ==='myWillDone'">
                  <s-row type="flex" class="Orderbackground" style="line-height:30px;margin: 10px 0 1px 10px;" id="selectRow">
                    <s-col span="2" offset="19" style="font-size: 14px; padding-left: 14px;">筛选工单：</s-col>
                    <s-col span="20">
                      <s-select style="width: 200px;" v-model="pendingOrder" @change="changeType">
                        <s-option label="全部" :value="null"></s-option>
                        <s-option v-for="(item, index) in allOrderTypes" :label="item" :key="index" :value="index">
                        </s-option>
                      </s-select>
                    </s-col>
                    <s-col class="card-enter more-info" style="margin-left: 50px;font-size: 14px;"><div @click="gotoMore('myWillDone')">更多</div></s-col>
                  </s-row>
                  <s-row shape="beauty" style="padding-left: 14px;">
                    <s-scrollbar v-if="pendingLists.length" :wrap-style="'height:' + mainScrollbarHeight + 'px;z-index:-1;'" class="Orderbackground">
                      <s-carousel class="work-order-wrapper" arrow="never" :autoplay="false" :height=" + carouselHeight +'px'">
                        <s-carousel-item  v-for="(items, indexes) in pendingListsDouble" :key="indexes + 'outter'">
                          <s-row class="operational-equip" type="flex" align="middle">
                            <deal-work-item
                            v-for="(item, index) in pendingListsDouble[indexes]"
                            :key="indexes * 6 + index + 'inner'"
                            :num="indexes * 6 + index"
                            :spanHeight="spanHeight"
                            :model="item"
                            :IsUserGroups="IsUserGroups"
                            :rolePro="rolePro"
                            @goOrder="goOrder"
                            @GetWorkOrder="GetWorkOrder"
                            @propblemDelegateWorkOrder="propblemDelegateWorkOrder"
                            @requestServDelegateWorkOrder="requestServDelegateWorkOrder"
                            @DelegateWorkOrder="DelegateWorkOrder"
                            @handleConcern="handleConcern"
                            @goPublishTask="goPublishTask"
                            @DelegatePublishWorkOrder="DelegatePublishWorkOrder"
                          ></deal-work-item>
                          </s-row>
                        </s-carousel-item>
                      </s-carousel>
                    </s-scrollbar>
                    <div v-nodata="true" v-else :style="'height:' + mainScrollbarHeight + 'px'"></div>
                  </s-row>
                  <s-row :gutter="10">
                    <s-col span="24">
                      <s-card class="box-card card-line" style="height: calc(((100vh - 98px) /  3 * 1) - 15px); margin: 0;">
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
                    <s-row type="flex" class="Orderbackground" style="line-height:30px;margin: 10px 0 1px 10px;" id="selectRow">
                      <s-col span="2" style="font-size: 14px; padding-left: 14px;">筛选工单：</s-col>
                      <s-col span="20">
                        <s-select style="width: 200px;" v-model="pendingOrder1" @change="changeType1">
                          <s-option label="全部" :value="null"></s-option>
                          <s-option v-for="(value, index) in orderTypeMap" :key="index" :value="index"
                                    :label="value"></s-option>
                        </s-select>
                      </s-col>
                      <s-col class="card-enter more-info" style="margin-left: 50px;font-size: 14px;"><div @click="gotoMore('myApproval')">更多</div></s-col>
                    </s-row>
                    <s-row shape="beauty" style="padding-left: 14px;">
                      <s-carousel v-if="pendingLists1.length" class="work-order-wrapper" arrow="never" :autoplay="false" :height=" + carouselHeight1 +'px'">
                          <s-carousel-item  v-for="(items, indexes) in pendingListsDouble1" :key="indexes + 'outter'">
                            <s-row class="operational-equip" type="flex" align="middle">
                              <deal-work-item1
                              v-for="(item, index) in pendingListsDouble1[indexes]"
                              :key="indexes * 9 + index + 'inner'"
                              :num="indexes * 9 + index"
                              :spanHeight="spanHeight"
                              :model="item"
                              :rolePro="rolePro"
                              @goOrder="goOrder"
                              @allow="allow"
                              @refuse="refuse"
                              @handleConcern1="handleConcern1"
                            ></deal-work-item1>
                            </s-row>
                          </s-carousel-item>
                        </s-carousel>
                      <div v-nodata="true" v-else :style="'height: ' + carouselHeight1 +'px'"></div>
                    </s-row>
                  </div>
                 </s-tab-pane>
                <s-tab-pane :label="myHavedoneLabel" name="myHavedone">
                  <s-scrollbar :wrap-style="'height:' + otherScrollbarHeight + 'px;z-index:-1;'" class="Orderbackground">
                    <My-havedone v-if="activeTab ==='myHavedone'" :activeTab="myHavedoneLabel"></My-havedone>
                  </s-scrollbar>
                </s-tab-pane>
                <s-tab-pane :label="myAttentionLabel" name="myAttention">
                  <s-scrollbar :wrap-style="'height:' + otherScrollbarHeight + 'px;z-index:-1;'" class="Orderbackground">
                  <My-attention v-if="activeTab ==='myAttention'" @goPublishTask="goPublishTask"></My-attention>
                  </s-scrollbar>
                </s-tab-pane>
                <s-tab-pane name="speedSearch">
                  <span slot="label"><i class="iconfont icon-magnifier"></i> 快速搜索</span>
                  <s-scrollbar :wrap-style="'height:' + otherScrollbarHeight + 'px;z-index:-1;'" class="Orderbackground">
                  <Speed-search v-if="activeTab ==='speedSearch'" @goPublishTask="goPublishTask"></Speed-search>
                  </s-scrollbar>
                </s-tab-pane>
              </s-tab>
            </section>
          </s-col>
        </s-row>
      </s-col>
      <s-col span="5" class="processRight logCenterBase logCard" style="height: 100%;">
        <navs :modelName="'processCenter'" @goto="goto" @gotoReport="gotoReport" @openDialog="openDia" style="margin: 20px 20px 10px 10px"></navs>
        <s-card class="box-card card-line"  style="margin-top: 15px">
          <div class="clearfix ys processTit" style="padding: 0;border: none;">
                <span class="card-title">
                  本周工作量统计
                </span>
          </div>
          <s-charts :chart="chart2" v-if="Object.keys(chart2.data).length" :click-fun="goWeekWorkAccount"></s-charts>
          <div v-nodata="true" v-else style="height: 250px"></div>
        </s-card>
        <s-card class="box-card card-line"  style="margin-top: 15px">
          <div class="clearfix ys processTit" style="padding: 0;border: none;">
                <span class="card-title">
                  我的工单数量汇总
                </span>
          </div>
          <s-chart :chart="chart1" v-if="chart1.data.length"></s-chart>
          <div v-nodata="true" v-else style="height: 250px"></div>
        </s-card>
      </s-col>
    </s-row>
    <!--创建工单弹框-->
    <s-dialog
      v-model="createWorkDialog"
      v-if="createWorkDialog"
      width="550px"
      title="创建工单">
      <div style="margin-bottom: 15px;">工单类型</div>
      <s-radio-group v-model="radio">
        <s-radio :label="1" :disabled="rolePro.incident<0 || rolePro.incident === null">事件</s-radio>
        <s-radio :label="2" :disabled="rolePro.problem<0 || rolePro.problem === null">问题</s-radio>
        <s-radio :label="3" :disabled="rolePro.change<0 || rolePro.change === null">变更</s-radio>
        <!--未作权限控制-->
        <s-radio :label="4" :disabled="rolePro.publish<0 || rolePro.publish === null">发布</s-radio>
        <s-radio :label="6" :disabled="rolePro.knowledge<0 || rolePro.knowledge === null">知识库</s-radio>
      </s-radio-group>
      <template slot="footer" class="dialog-footer">
        <s-button @click="nextCreate">下一步</s-button>
        <s-button type="cancel" @click="createWorkDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--事件单-->
    <s-dialog
      v-model="eventDialog"
      v-if="eventDialog"
      width="600px"
      class="createProcess"
      title="创建工单">
      <create-event ref="eventForm" @show-template="showTemDialog"></create-event>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEvent" :disabled="eventLock">保存</s-button>
        <s-button type="cancel" @click="eventDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--事件模板-->
    <template-dialog v-if="templateDialogFlag" v-model="templateDialogFlag" :cur-template="curTemplate"></template-dialog>
    <!--问题单-->
    <s-dialog
      v-model="issueDialog"
      v-if="issueDialog"
      width="600px"
      class="createProcess"
      title="创建工单">
      <create-issue ref="issueForm"></create-issue>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveIssue" :disabled="issueLock">保存</s-button>
        <s-button type="cancel" @click="issueDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--变更单-->
    <s-dialog
      v-model="changeDialog"
      v-if="changeDialog"
      width="600px"
      class="createProcess"
      title="创建工单">
      <create-change ref="changeForm" @show-template="showOrderTemDialog"
                     :changePath="changePath" :riskLevel="riskLevel"
                     @show-riskTemplate="showRiskTemplate"></create-change>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChangeOrder" :disabled="locked">保存</s-button>
        <s-button type="cancel" @click="changeDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--变更模板-->
    <order-template-dialog v-if="orderTemDialog" v-model="orderTemDialog" :cur-template="orderCurTemplate">
    </order-template-dialog>
    <!--事件工单委派-->
    <s-dialog v-model="delegateDialog" v-if="delegateDialog" width="600px" :title="deletitle">
      <event-delegate ref="eventdelegate" :companyUuid = "companyUuid" :orderType="orderType"></event-delegate>
      <template slot="footer" class="dialog-footer">
        <s-button @click="eventorderDelegate">确定</s-button>
        <s-button type="cancel" @click="delegateDialog= false">取消</s-button>
      </template>
    </s-dialog>

    <!--发布 任务单委派-->
    <s-dialog v-model="delegatePublishDialog" v-if="delegatePublishDialog" width="600px" :title="deletitle">
      <publish-delegate-dialog ref="publishDelegate" :model="publishData"></publish-delegate-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="savePublishDelegate">确定</s-button>
        <s-button type="cancel" @click="delegatePublishDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!-- 问题单指派 -->
    <AssignToOtherDialog v-if="AssignToOtherDialog" :uuid="eventParams.taskId" :companyUuid="eventParams.companyUuid"
                         @submit="updateData"
                         v-model="AssignToOtherDialog"></AssignToOtherDialog>
    <!-- 服务请求单指派 -->
    <s-dialog v-model="AssignToOtherRSDialog" v-if="AssignToOtherRSDialog" width="600px" title="服务请求工单委派给他人">
      <assign-others :orderUuid="requestParams.uuid" :companyUuid="requestParams.companyUuid"
                     @closeAssignToOthers="closeAssignToOthers">
      </assign-others>
    </s-dialog>
    <!--流程设置弹框-->
    <s-dialog v-model="processSetBox.show" v-if="processSetBox.show" width="600px" title="流程配置" :before-close="closeProcessSetBox">
      <ProcessSetBox ref="processSetBox" :model="processSetBoxModel" @processSetFrom="processSetFrom"></ProcessSetBox>
      <template slot="footer" class="dialog-footer">
        <s-button @click="processSetConfirm">确定</s-button>
        <s-button type="cancel" @click="closeProcessSetBox">取消</s-button>
      </template>
    </s-dialog>
    <!--变更风险问卷弹窗-->
    <change-risk-question
      v-model="changeRiskQuestion"
      v-if="changeRiskQuestion"
      :cur-template="riskTemplate"
      ref="changeRiskQuestion">
    </change-risk-question>
    <!--创建知识库弹框-->
    <s-dialog
      v-model="knowDialog"
      v-if="knowDialog"
      width="700px"
      class="createKnow"
      title="创建知识库">
      <create-know ref="knowForm"></create-know>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveKnow" :disabled="saveKnowDisabled">保存</s-button>
        <s-button type="cancel" @click="knowDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--发布单-->
    <s-dialog
      v-model="publishDialog"
      v-if="publishDialog"
      width="600px"
      class="createProcess"
      title="创建工单">
      <create-publish ref="publishForm"></create-publish>
      <template slot="footer" class="dialog-footer">
        <s-button @click="savePublish" :disabled="publishLocked">保存</s-button>
        <s-button type="cancel" @click="publishDialog = false">关闭</s-button>
      </template>
    </s-dialog>
    <!--审批拒绝-->
    <s-dialog
      v-if="Closedialog"
      v-model="Closedialog"
      title="拒绝"
      width="500px"
    >
      <close-dialog ref="closeData"></close-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="closeOK()">确定</s-button>
        <s-button type="cancel" @click="Closedialog= false">关闭</s-button>
      </template>
    </s-dialog>
  </section>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import navs from '@/components/navButton/NavButton.vue'
  import createEvent from '@/home/ProcessCenter/ProcessCreatOrder/EventOrderDialog'
  import createIssue from '@/home/ProcessCenter/ProcessCreatOrder/IssueOrderDialog'
  import createChange from '@/home/ProcessCenter/ProcessCreatOrder/ChangeOrderDialog'
  import createPublish from '@/home/ProcessCenter/ProcessCreatOrder/PublishOrderDialog'
  import dealWorkItem from '@/home/ProcessCenter/ProcessUndealOrders/DealWorkItem.vue'
  import dealWorkItem1 from '@/home/ProcessCenter/ProcessUndealOrders/DealWorkItem1.vue'
  import EventDelegate from '@/home/ProcessCenter/ProcessUndealOrders/delegateDialog.vue'
  import detailMixin from '@/pages/Process_ProblemDetail/ProblemDetailMixin'
  import TemplateDialog from './ProcessCreatOrder/TemplateDialog';
  import createKnow from '@/home/ProcessCenter/ProcessCreatOrder/KnowDialog'
  import changeRiskQuestion from './ProcessCreatOrder/ChangeRiskQuestionDialog.vue';
  import orderTemplateDialog from './ProcessCreatOrder/OrderTemplateDialog.vue';
  import processRoleMixin from '@/home/ProcessCenter/processRoleMixin.js'
  // import MyApproval from '@/pages/Process_MyOther/MyApproval'
  import MyAttention from '@/pages/Process_MyOther/MyAttention'
  import MyHavedone from '@/pages/Process_MyOther/MyHavedone'
  import SpeedSearch from '@/pages/Process_MyOther/MyOther'
  import assignOthers from '@/pages/Process_RequestService/DetailDialog/AssignToOthers.vue';
  import { sortBy, filter, forOwn, merge } from 'lodash';
  import CloseDialog from '@/pages/Process_MyOther/components/CloseDialog';
  import PublishDelegateDialog from './ProcessUndealOrders/PublishDelegateDialog.vue';
  import authCheck from '@/common/mixins/auth.js'
  import ringChartOption from '@/components/chart/pieChartOption.js'
  import barChartOption from '@/components/chart/barChartOptionY.js'
  export default {
    mixins: [processRoleMixin, detailMixin, authCheck],
    data() {
      return {
        // 右上角nav按钮
        createWorkDialog: false,
        eventDialog: false,
        knowDialog: false,
        issueDialog: false,
        changeDialog: false,
        publishDialog: false,
        radio: null,
        delegateDialog: false,
        deletitle: '事件工单委派给他人',
        templateDialogFlag: false,
        orderTemDialog: false,
        navsList: [],
        workloadTopN: [], // 工作量统计TOP5数组
        orderList: [], // 待跟踪工单数组
        pendingOrder: null, // 待处理工单类型选中值
        pendingOrder1: null, // 待处理工单类型选中值
        allOrderTypes: [], // 全部工单类型数组
        orderTypeMap: {}, // 我的审批工单类型
        createOrderTypes: [],
        chart1: {
          name: 'myOrdersNumber',
          type: 'pieChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {
            legend: {
              left: 'center',
              orient: 'horizontal'
            },
            color: ['#5BC49F', '#71B3FA', '#32D3EB'],
            series: [{
              type: 'pie',
              radius: '50%'
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
          el: 'chart2',
          type: 'yBarChart',
          width: '100%',
          height: '100%',
          data: {},
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
              }
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
        pendingLists1: [],
        workOrderBoxParams: {},
        workOrderBoxModel: {},
        workLoadMoreBoxModel: {},
        orderDelegateBoxModel: {},
        workOrderDetailsBoxModel: {},
        processSetBoxModel: [],
        createCount: null,
        getTop5Active: 0,
        OrderType: -1,
        orderDelegateCurrent: {},
        scrollbarHeight: null,
        mainScrollbarHeight: 0,
        otherScrollbarHeight: 0,
        carouselHeight: 0,
        spanHeight: 20,
        boxCardHeight: 0,
        raiseUsers: {},
        eventParams: {},
        requestParams: {},
        ConflictOrders: [],
        curTemplate: {},
        orderCurTemplate: {},
        riskTemplate: {},
        changeRiskQuestion: false,
        riskLevel: 0,
        changePath: 0,
        orderType: 0,
        companyUuid: '',
        activeTab: 'myWillDone',
        locked: false,
        eventLock: false,
        issueLock: false,
        saveKnowDisabled: false,
        publishLocked: false,
        publishData: {},
        publishParams: {},
        delegatePublishDialog: false,
        AssignToOtherRSDialog: false,
        initReport: '',
        refuseuuid: '',
        Closedialog: false,
        userGroups: [],
        IsUserGroups: false,
        leftMenuList: [
          {
            label: '事件',
            children: [{
              label: '事件详情汇总',
              uuid: 'report_event_1'
            },
              {
                label: '事件平均解决时间',
                uuid: 'report_event_2'
              },
              {
                label: '事件解决百分比',
                uuid: 'Report_Event_3'
              }
            ]
          },
          {
            label: '问题',
            children: [{
              label: '问题详情内容分类统计',
              uuid: 'report_problem_1'
            },
              {
                label: '未完成详情内容分类统计',
                uuid: 'report_problem_2'
              },
              {
                label: '问题成功解决情况统计',
                uuid: 'report_problem_3'
              }
            ]
          },
          {
            label: '变更',
            children: [{
              label: '按变更路径统计变更总数',
              uuid: 'report_change_1'
            },
              {
                label: '变更积压数统计',
                uuid: 'report_change_2'
              },
              {
                label: '变更成功率统计',
                uuid: 'report_change_3'
              }
            ]
          },
          {
            label: '发布',
            children: [{
              label: '发布管理详细信息',
              uuid: 'report_release_1'
            },
              {
                label: '发布管理平均处理时长',
                uuid: 'report_release_2'
              },
              {
                label: '发布管理趋势分析',
                uuid: 'report_release_3'
              }
            ]
          },
          {
            label: '知识库',
            children: [{
              label: '知识库趋势统计',
              uuid: 'report_knowledge_1'
            },
              {
                label: '知识库发布率统计',
                uuid: 'report_knowledge_2'
              },
              {
                label: '知识库使用率统计',
                uuid: 'report_knowledge_3'
              }
            ]
          },
          {
            label: '服务请求',
            children: [{
              label: '服务请求数据详情',
              uuid: 'report_requestService_1'
            },
              {
                label: '服务请求成功解决率',
                uuid: 'report_requestService_2'
              },
              {
                label: '服务请求受理解决时长',
                uuid: 'report_requestService_3'
              }
            ]
          }
        ],
        myWillDoneLabel: '我的待办 (0)',
        myApprovalLabel: '我的审批 (0)',
        myHavedoneLabel: '我的已办 (0)',
        myAttentionLabel: '我的关注 (0)'
      }
    },
    components: {
      navs,
      createEvent,
      createIssue,
      createChange,
      createPublish,
      dealWorkItem,
      dealWorkItem1,
      CloseDialog,
      EventDelegate,
      createKnow,
      TemplateDialog,
      changeRiskQuestion,
      orderTemplateDialog,
      // MyApproval,
      MyAttention,
      MyHavedone,
      SpeedSearch,
      assignOthers,
      PublishDelegateDialog
    },
    watch: {
      rolePro: {
        deep: true,
        handler (val) {
          let radioSet = new Set();
          if (val.incident >= 0 && val.incident !== null) {
            radioSet.add(1);
          }
          if (val.problem >= 0 && val.incident !== null) {
            radioSet.add(2);
          }
          if (val.change >= 0 && val.incident !== null) {
            radioSet.add(3);
          }
          if (val.publish >= 0 && val.incident !== null) {
            radioSet.add(4);
          }
          if (val.knowledge >= 0 && val.incident !== null) {
            radioSet.add(6);
          }
          this.radio = [...radioSet][0];
        }
      },
      activeTab: function (val) {
        if (val === 'myWillDone') {
          this.getPendingList(parseInt(this.pendingOrder))
        } else if (val === 'myApproval') {
          this.getPendingList1(this.pendingOrder1)
        }
        this.getLabel()
      },
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    },
    computed: {
      // pendingListsDouble
      pendingListsDouble() {
        let DoubleList = new Array([])
        for (let i = 0; i < this.pendingLists.length; i += 6) {
          let k = Math.floor(i / 6)
          DoubleList[k] = []
          for (let j = 0; j < 6; j++) {
            this.pendingLists[i + j] ? DoubleList[k].push(this.pendingLists[i + j]) : ''
          }
        }
        return DoubleList
      },
      pendingListsDouble1() {
        let DoubleList1 = new Array([])
        for (let i = 0; i < this.pendingLists1.length; i += 9) {
          let k = Math.floor(i / 9)
          DoubleList1[k] = []
          for (let j = 0; j < 9; j++) {
            this.pendingLists1[i + j] ? DoubleList1[k].push(this.pendingLists1[i + j]) : ''
          }
        }
        return DoubleList1
      },
      rolePro() {
        return this.$store.state.processCenter.rolePro;
      }
    },
    created() {
      this.getAllConflictOrders()
      this.getPath();
      this.getLabel()
      // 获取当前用户组
      $axios.get('/ItilCommonWorkflow/getGroupListByUser').then(({data}) => {
        var userGroups = data.map(item => item.uuid)
        for (let item in this.pendingLists) {
          this.IsUserGroups = userGroups.indexOf(this.pendingLists[item].managerGroup) > -1
        }
      })
    },
    methods: {
      getLabel() {
        $axios.get('/itilWorkflowCenter/userOrderCnt').then(res => {
          this.myWillDoneLabel = '我的待办' + ' ' + '(' + res.data.undealOrderCnt + ')'
          this.myApprovalLabel = '我的审批' + ' ' + '(' + res.data.approveOrderCnt + ')'
          this.myHavedoneLabel = '我的已办' + ' ' + '(' + res.data.dealedOrderCnt + ')'
          this.myAttentionLabel = '我的关注' + ' ' + '(' + res.data.concernOrderCnt + ')'
        })
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.dark, this.roundOption)
          this.chart2.option = merge({}, this.chart2.option, barChartOption.dark)
        } else {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.light, this.roundOption)
          this.chart2.option = merge({}, this.chart2.option, barChartOption.light)
        }
      },
      getPath() {
        let leftMenuList = this.leftMenuList;
        for (let i in leftMenuList) {
          switch (leftMenuList[i].label) {
            case '事件':
              leftMenuList[i].isShow = this.EventAuth;
              break;
            case '问题':
              leftMenuList[i].isShow = this.ProblemAuth;
              break;
            case '变更':
              leftMenuList[i].isShow = this.ChangeAuth;
              break;
            case '发布':
              leftMenuList[i].isShow = this.PublishAuth;
              break;
            case '知识库':
              leftMenuList[i].isShow = this.KnowledgeAuth;
              break;
            case '服务请求':
              leftMenuList[i].isShow = this.ServiceAuth;
              break;
          }
        }
        this.filterData(leftMenuList);
      },
      filterData(data) {
        let newArr = [];
        for (let i in data) {
          if (data[i].isShow === true) {
            newArr.push(data[i])
          }
        }
        let initReportArr = newArr[0].children;
        this.initReport = initReportArr[0].uuid;
      },
      updateData() {
        this.getPendingList(parseInt(this.pendingOrder))
      },
      goChange(uuid) {
        this.goto('ProcessCenter/modifyDetail/' + uuid);
      },
      changeType () {
        this.getPendingList(parseInt(this.pendingOrder))
      },
      changeType1() {
        this.getPendingList1(parseInt(this.pendingOrder1))
      },
      getAllConflictOrders() {
        $axios.get('/itilWorkflowCenter/getAllConflictOrders').then((res) => {
          this.ConflictOrders = res.data
        })
      },
      eventorderDelegate() {
        this.$refs['eventdelegate'].$refs['deleateForm'].validate(valid => {
          if (!valid) return;
          let data = this.$refs.eventdelegate.deleateForm
          if (this.orderType === 0) {
            $axios.get(`/itilIncidentCenter/incidentOrderOrderAssigneOther/${this.eventParams.uuid}/${data.assignUser}/${data.assignGroup}`).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  message: '委派成功',
                  type: 'success'
                });
                this.delegateDialog = false
                this.getPendingList(parseInt(this.pendingOrder))
                this.getLabel()
                //  刷新数据
              } else {
                this.$message({
                  message: '委派失败',
                  type: 'error'
                })
              }
            })
          } else {
            $axios.get(`/itilChangeOrder/changeTaskAssign/${this.eventParams.uuid}/${data.assignGroup}/${data.assignUser}`).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  message: '委派成功',
                  type: 'success'
                });
                this.delegateDialog = false
                this.getPendingList(parseInt(this.pendingOrder))
                this.getLabel()
                //  刷新数据
              } else {
                this.$message({
                  message: '委派失败',
                  type: 'error'
                })
              }
            })
          }
        })
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
        this.chart2.height = chartHeight;
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
      nextCreate() {
        if (!this.radio) {
          this.$message({type: 'warning', message: '此角色没有操作权限!'});
          return;
        }
        this.createWorkDialog = false
        switch (this.radio) {
          case 1:
            this.eventDialog = true;
            break;
          case 2:
            this.issueDialog = true;
            break;
          case 3:
            this.changeDialog = true;
            break;
          case 4:
            this.publishDialog = true;
            break;
          case 6:
            this.knowDialog = true;  // 知识库
            break;
        }
      },
      showTemDialog(template) {
        this.templateDialogFlag = true;
        this.curTemplate = template;
      },
      showOrderTemDialog(template) {
        this.orderTemDialog = true;
        this.orderCurTemplate = template;
      },
      showRiskTemplate(template) {
        this.changeRiskQuestion = true;
        this.riskTemplate = template;
      },
      saveEvent() {
        this.$refs['eventForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['eventForm'].form
          let param = {};
          for (let i in form) {
            if (form[i] || form[i] === 0) {
              param[i] = form[i]
            }
          }
          param.attachuuid = this.$refs['eventForm'].fileList.map(item => {
            return item.response.attachuuid;
          }).join(',');
          this.eventLock = true;
          $axios.post('/itilIncidentCenter/saveIncidentOrderUser', param, {
            data: [form],
            logTemplate: '创建|事件工单(#serialCode#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.eventDialog = false;
              this.getPendingList();
              this.getLabel()
              this.eventLock = false;
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
              this.eventLock = false;
            }
          })
        })
      },
      saveIssue () {
        this.$refs['issueForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['issueForm'].form;
          this.issueLock = true;
          $axios.post('/itilProblemOrder/saveItilProblemOrder', form, {
            data: [form],
            logTemplate: '创建|问题工单(#serialCode#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.issueDialog = false;
              this.getPendingList();
              this.getLabel()
              this.issueLock = false;
            } else {
              this.issueLock = false;
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
            }
          })
        })
      },
      saveChangeOrder() {
        this.$refs['changeForm'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeForm'].form;
          this.locked = true;
          $axios.post('/itilChangeOrder/saveChangeOrder', form, {
            data: [form],
            logTemplate: '创建|变更工单(#serialCode#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.changeDialog = false;
              this.getPendingList();
              this.getLabel()
              this.locked = false;
            } else {
              this.locked = false;
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
            }
          })
        })
      },
      saveKnow() {
        this.$refs['knowForm'].$refs['knowledgeForm'].validate(valid => {
          if (!valid) return;
          this.saveKnowDisabled = true // 保存按钮暂时禁用
          let form = Object.assign({}, this.$refs['knowForm'].knowledgeForm)
          form.knowledgeType = Number(form.knowledgeType)
          $axios.post('/itilKnowledgeOrder/saveKnowledgeOrder', form, {
            data: [form],
            logTemplate: '创建|知识库(#serialCode#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.knowDialog = false;
              this.saveKnowDisabled = false;
              this.getPendingList();
              this.getLabel()
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
              this.saveKnowDisabled = false;
            }
          })
        })
      },
      savePublish() {
        this.$refs['publishForm'].$refs['form'].validate(valid => {
          if (!valid) return;
          this.publishLocked = true;
          $axios.post('/itilPublishOrder/savePublishOrder', this.$refs.publishForm.form, {
            data: [this.$refs.publishForm.form],
            logTemplate: '创建|发布工单(#serialCode#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({type: 'success', message: '保存成功'});
              this.publishDialog = false;
              this.publishLocked = false;
              this.getPendingList();
              this.getLabel()
            } else {
              this.publishLocked = false;
              this.$message({type: 'error', message: res.data.errormsg});
            }
          });
        });
      },
      gotoMore(path) {
        this.$router.push('ProcessCenter/' + path)
      },
      goto(path) {
        this.$router.push(path)
      },
      gotoReport() {
        this.$router.push('ProcessCenter/Process_report_console/' + this.initReport);
      },
      openDia() {
        this.createWorkDialog = true;
      },
      // 待处理工单更多
      GotoMore(title) {
        switch (title) {
          case 'pending':
            this.goto('ProcessCenter/process_pending');
            break;
          case 'tracing':
            this.goto('ProcessCenter/process_tracing');
            break;
          case 'top5':
            this.goto('ProcessCenter/changeconflict');
            break;
        }
      },
      closeProcessSetBox() {
        this.processSetBox.show = false
      },
      goOrder(uuid, orderType) {
        switch (orderType) {
          case 0:
            this.goto('ProcessCenter/eventDetail/' + uuid);
            break;
          case 1:
            this.goto('ProcessCenter/problemDetail/' + uuid);
            break;
          case 2:
            this.goto('ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('ProcessCenter/taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            this.goto('ProcessCenter/requestServiceDetail/' + uuid);
            break;
        }
      },
      goPublishTask(model) {
        this.goto('ProcessCenter/publishTaskOrderDetail/' + model.uuid);
      },
      dialogallow(params) {
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/itilWorkflowCenter/approvePass', params).then((res) => {
            if (res.data.state === true) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getPendingList1(parseInt(this.pendingOrder1))
              this.getLabel()
            } else {
              this.$message({
                type: 'error',
                message: '审批通过/拒绝失败，请刷新重试！'
              })
            }
          })
        }).catch(() => {});
      },
      allow(uuid) {
        this.dialogallow([uuid])
      },
      refuse(uuid) {
        this.refuseuuid = uuid
        this.Closedialog = true
      },
      diolagRequse(params) {
        this.$refs.closeData.$refs.closeform.validate((valid) => {
          if (valid) {
            $axios.post('/itilWorkflowCenter/approveRefuse', params).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  type: 'success',
                  message: '拒绝成功'
                })
                this.Closedialog = false
                this.getPendingList1(parseInt(this.pendingOrder1))
                this.getLabel()
              } else {
                this.$message({
                  type: 'error',
                  message: '拒绝失败'
                })
                this.Closedialog = false
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: '拒绝原因不能为空'
            })
          }
        })
      },
      closeOK() {
        this.diolagRequse({[this.refuseuuid]: this.$refs.closeData.closeform.reason})
      },
      GetWorkOrder(uuid, orderType, model) {
        switch (orderType) {
          case 0:
            $axios.get(`/itilIncidentCenter/OrderTalking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/eventDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
          case 1:
            if (model.problemStatus === 0 && this.rolePro.problem > 1 || model.problemStatus === 1 || model.problemStatus === 2 || model.problemStatus === 3) {
              $axios.get(`/itilProblemOrder/takeItilProblemOrder/${uuid}`).then((res) => {
                if (res.data.state === true) {
                  this.goto('ProcessCenter/problemDetail/' + uuid);
                } else {
                  this.$message({
                    message: res.data.errormsg,
                    type: 'error'
                  })
                }
              })
            } else {
              this.goto('ProcessCenter/problemDetail/' + uuid);
            }
            break;
          case 2:
            this.goto('ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            $axios.get(`/itilChangeOrder/changeTaskTaking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/taskOrderDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
          case 4:
            this.goto('ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            $axios.get(`/itilServiceRequest/orderTakling/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/requestServiceDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
        }
      },
      propblemDelegateWorkOrder(taskId, orderType, orderId, companyUuid) {
        this.AssignToOtherDialog = true
        this.eventParams.orderType = orderType
        this.eventParams.incidentOrderUuid = orderId
        this.eventParams.taskId = taskId
        this.eventParams.companyUuid = companyUuid
        this.getPendingList(parseInt(this.pendingOrder))
        this.getLabel()
      },
      requestServDelegateWorkOrder(uuid, companyUuid) {
        this.AssignToOtherRSDialog = true
        this.requestParams.uuid = uuid
        this.requestParams.companyUuid = companyUuid
        this.getPendingList(parseInt(this.pendingOrder))
        this.getLabel()
      },
      closeAssignToOthers() {
        this.AssignToOtherRSDialog = false
      },
      handleConcern(uuid, orderType, isConcern, concernUuid) {
        if (isConcern !== 1) {
          this.$confirm('是否关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${uuid}/${orderType}`).then(({data}) => {
              concernUuid = data
              if (data) {
                this.$message({
                  type: 'success',
                  message: '关注成功'
                })
                this.getPendingList(parseInt(this.pendingOrder))
                this.getLabel()
              } else {
                this.$message({
                  type: 'error',
                  message: '关注失败'
                })
              }
            })
          }).catch(() => {});
        } else {
          this.$confirm('是否取消关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${concernUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: data.errormsg
                })
                this.getPendingList(parseInt(this.pendingOrder))
                this.getLabel()
              } else {
                this.$message({
                  type: 'error',
                  message: '取消关注失败'
                })
              }
            })
          }).catch(() => {});
        }
      },
      handleConcern1(uuid, orderType, isConcern, concernUuid) {
        if (isConcern !== 1) {
          this.$confirm('是否关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${uuid}/${orderType}`).then(({data}) => {
              concernUuid = data
              if (data) {
                this.$message({
                  type: 'success',
                  message: '关注成功'
                })
                this.getPendingList1(parseInt(this.pendingOrder1))
                this.getLabel()
              } else {
                this.$message({
                  type: 'error',
                  message: '关注失败'
                })
              }
            })
          }).catch(() => {});
        } else {
          this.$confirm('是否取消关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${concernUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: data.errormsg
                })
                this.getPendingList1(parseInt(this.pendingOrder1))
                this.getLabel()
              } else {
                this.$message({
                  type: 'error',
                  message: '取消关注失败'
                })
              }
            })
          }).catch(() => {});
        }
      },
      DelegateWorkOrder(uuid, orderType, companyUuid) {
        this.orderType = orderType
        if (this.orderType === 3) {
          this.deletitle = '任务工单委派给他人'
        }
        this.delegateDialog = true;
        this.eventParams.uuid = uuid
        this.getPendingList(parseInt(this.pendingOrder))
        this.getLabel()
        this.companyUuid = companyUuid
      },
      DelegatePublishWorkOrder(model) {
        this.publishParams.uuid = model.uuid;
        this.publishData = model;
        if (model.orderType === 3) {
          this.deletitle = '任务工单委派给他人'
        }
        this.delegatePublishDialog = true;
      },
      savePublishDelegate() {
        this.$refs['publishDelegate'].$refs['deleateForm'].validate(valid => {
          if (!valid) return;
          let data = this.$refs.publishDelegate.deleateForm
          $axios.get(`/itilChangeOrder/changeTaskAssign/${this.publishParams.uuid}/${data.assignGroup}/${data.assignUser}`).then((res) => {
            if (res.data.state === true) {
              this.$message({
                message: '委派成功',
                type: 'success'
              });
              this.delegatePublishDialog = false
              this.getPendingList(parseInt(this.pendingOrder))
              this.getLabel()
              //  刷新数据
            } else {
              this.$message({
                message: '委派失败',
                type: 'error'
              })
            }
          })
        })
      },
      orderUrge(taskId, orderType) {
        // const _this = this
        $axios.get('/workflow/emergencyDeal/' + taskId + '/' + ((orderType >= 5) ? '5' : orderType)).then(res => {
          if (res.status === 200) {
            if (res.data.result === 'success') {
              this.$message({
                message: '工单催办成功',
                type: 'success'
              });
            } else if (res.data.result === 'fail') {
              this.$message({
                message: res.data.err,
                type: 'error'
              });
            } else {
              this.$message({
                message: '请刷新重试',
                type: 'warning'
              });
            }
          }
        });
      },
      orderCancel(orderType, workflowType, orderId) {
        $axios.get('/workflow/recovate/' + orderType + '/' + workflowType + '/' + orderId).then(res => {
          if (res.data) {
            this.$message({
              message: '工单撤销成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '工单撤销失败',
              type: 'warning'
            });
          }
        });
      },
      strlen(str) {
        if (str == null) return 0;
        if (typeof str !== 'string') {
          str += '';
        }
        return str.replace(/[^\x00-\xff]/g, '01').length
      },
      chartSerialize(data, stopnum) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (this.strlen(data[i]) >= stopnum) {
            arr.push(data[i].substring(0, stopnum));
          } else {
            arr.push(data[i]);
          }
        }
        return arr;
      },
      getPendingList(num) {
        let params = {
          ordertype: num
        }
        $axios.post('/itilWorkflowCenter/getUndealOrders', num === '全部' ? '' : params).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList, requestOrderList} = data
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            status: item.changeStatus,
            orderType: 2
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            status: item.taskStatus,
            orderType: 3
          }))
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            status: item.incidentStatus,
            orderType: 0
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            status: item.problemStatus,
            orderType: 1
          }))
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            status: item.knowledgeStatus,
            orderType: 4
          }))
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            status: item.publishStatus,
            orderType: 5
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            status: item.status,
            orderType: 6
          }))
          this.pendingLists = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList]
          this.pendingLists = this.pendingLists.sort(function(a, b) {
            return a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0
          })
          if (this.pendingLists.length > 5) {
            this.pendingLists = this.pendingLists.slice(0, 30)
          }
        })
      },
      getPendingList1(num) {
        let params = {
          approveResult: null,
          orderType: num,
          commitTimeStart: null,
          commitTimeEnd: null
        }
        $axios.post('/itilWorkflowCenter/getItilApproveOrderList', params).then(({data}) => {
          this.pendingLists1 = data.map(item => Object.assign(item.approveDetail, {createTime: item.createTime}, {orderType: item.orderType},
            {titile: item.titile}, {sercode: item.sercode}, {userRealName: item.commituser ? item.commituser.userRealName : ''}, {createUser: item.commituser ? item.commituser.uuid : ''},
            {approveStatus: item.approveStatus}, {userStatus: item.orderStatus}, {isConcern: item.isConcern}, {uuid: item.approveDetail.uuid}, {orderUuid: item.approveDetail.orderUuid}, {concernUuid: item.concernUuid})
          )
          this.pendingLists1 = this.pendingLists1.sort(function(a, b) {
            return a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0
          })
          if (this.pendingLists1.length > 5) {
            this.pendingLists1 = this.pendingLists1.slice(0, 45)
          }
        })
      },
      getDepartment() {
        $axios.get('/workflow/getDepartment').then(res => {
          if (res.status === 200) {
            this.workOrderBox.getDepartment = res.data
          }
        });
      },
      refresh() {
        this.getPendingList(parseInt(this.pendingOrder));
        this.getPendingList1(parseInt(this.pendingOrder1));
        this.pendingOrder = '';
      },
      keysrt(key, desc) {
        return function (a, b) {
          return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
      },
      boolToInt(b) {
        if (b) {
          return 1
        } else {
          return 0
        }
      },
      processSetFrom(form) {
        this.processSetBox.processSetFrom = form
      },
      processSetConfirm() {
        let arr = this.processSetBox.processSetFrom
        for (let i = 0; i < arr.length; i++) {
          let json = {
            orderType: arr[i].orderType,
            isSendEmail: this.boolToInt(arr[i].isSendEmail),
            isSendShortMessage: this.boolToInt(arr[i].isSendShortMessage)
          }
          this.processSetBox.processSetFrom[i] = json;
        }
        let logData = {
          logTemplate: '设置|流程设置'
        }
        $axios.post('/workflowServicePlatm/setWorkflow', this.processSetBox.processSetFrom, logData).then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.processSetBox.show = false
              this.processSetBox.processSetFrom = []
              this.$message({
                message: '保存设置成功',
                type: 'success'
              });
            }
          } else {
            this.$message({
              message: '保存设置失败，请重试',
              type: 'error'
            });
          }
        });
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
      _this.getPendingList(parseInt(this.pendingOrder));
      _this.$nextTick(() => {
        _this.initDivHeight();
        window.addEventListener('resize', _this.initDivHeight);
      });
      $axios.get('/itilWorkflowCenter/orderWorksStat/2').then(res => {
        if (res) {
          var data = [];
          // var order = _this.chartSerialize(res.data.order, 2)
          var order = res.data.order
          for (let key in order) {
            var param = {
              value: 0,
              name: ''
            };
            param.name = order[key];
            param.value = res.data.group[0].data[key];
            data.push(param)
          }
          if (data.length > 0) {
            let msg = {};
            for (let item in data) {
              msg[data[item].name] = parseInt(data[item].value);
              _this.chart2.opt.series[0].data.push(data[item].value)
            }
            _this.chart2.data = msg
          }
        }
      });
      $axios.get('/itilWorkflowCenter/getUserOrdersState').then(res => {
        if (res) {
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
          _this.chart1.data = data
        }
      })
      $axios.post('/itilWorkflowCenter/getCreateAndComplteOrderStatChart').then(res => {
        _this.chart4.data = sortBy(res.data, function (item) {
          return item.date
        });
        _this.chart4.data = filter(res.data, function (item) {
          forOwn(item, function (value, key) {
            let key1 = '创建';
            let key2 = '完成';
            switch (key) {
              case 'create':
                item[key1] = item[key];
                delete item[key];
                break;
              case 'complete':
                item[key2] = item[key];
                delete item[key];
                break;
            }
          })
          return item;
        })
      })
      $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
        if (res) {
          _this.allOrderTypes = res.data
        }
      });
      $axios.get('ItilCommonWorkflow/getApproveOrderType').then(res => {
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
