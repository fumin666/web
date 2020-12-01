<template>
  <div style="margin:10px 5px 0 5px;" class="myHavedone">
    <s-form :inline="true" :model="searchForm" class="search_form"
            :rules="searchFormRules" label-width="100px" style="margin-bottom: 10px">
      <div>
        <s-form-item label="工单编号:" prop="serialCode">
          <s-input v-model="searchForm.serialCode" placeholder="请输入" style="width: 185px"></s-input>
        </s-form-item>
        <s-form-item label="工单简要描述:" prop="briefDesc">
          <s-input v-model="searchForm.briefDesc" placeholder="请输入" style="width: 185px"></s-input>
        </s-form-item>
        <s-form-item label="工单类型:">
          <s-select v-model="searchForm.orderType" placeholder="请选择" style="width: 185px">
            <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="parseInt(key)"
                      :label="value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="工单状态:">
          <s-select v-model="searchForm.status" v-if="searchForm.orderType === 2 || searchForm.orderType === 3 || searchForm.orderType === 4" style="width: 185px;">
            <s-option v-for="(item, index) in statusData" :label="item" :value="index + 1" :key="index"></s-option>
          </s-select>
          <s-select v-model="searchForm.status" v-else style="width: 185px;">
            <s-option v-for="(item, index) in statusData" :label="item" :value="index" :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="提交人:" prop="createUser">
          <s-input v-model="searchForm.createUser" placeholder="请输入" style="width: 185px;"></s-input>
        </s-form-item>
        <s-form-item label="提交时间:">
          <s-date-picker
            style="width: 205px"
            type="datetime"
            placeholder="选择起始时间"
            v-model="searchForm.startTime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="disableAfterToday1"
            @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker
            style="width: 205px"
            type="datetime"
            placeholder="选择结束时间"
            v-model="searchForm.endTime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="disableAfterToday2"
            @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-table-page :data="list" @selection-change="selectionChange" :actions-col-width="`150px`">
      <s-table-column type="selection" width="45">
      </s-table-column>
      <s-table-column prop="serialCode" label="工单编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="goDetail(scope.row.orderType,scope.row.uuid)" class="ip" href="javascript:;">{{ scope.row.serialCode }}</a>
        </template>
      </s-table-column>
      <s-table-column prop="briefDesc" label="工单简要描述" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.briefDesc || scope.row.title}}
        </template>
      </s-table-column>
      <s-table-column prop="orderType" label="工单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="haveorderType[scope.row.itilType]"></span>
        </template>
      </s-table-column>
      <s-table-column prop="status" label="工单状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getStatus(scope.row.itilType, scope.row.status)}}
        </template>
      </s-table-column>
      <s-table-column prop="createUserName" label="提交人" :show-overflow-tooltip="false" :showTooltipWhenOverflow="false">
        <template slot-scope="scope">
          <NameCardClick :useruuid="scope.row.createUser" :placement="'top-start'">
            <div>{{scope.row.createUserName}}</div>
          </NameCardClick>
        </template>
      </s-table-column>
      <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <div class="btns" id="btns">
            <span v-if="scope.row.orderType === 0 || scope.row.orderType === 1 || scope.row.orderType === 3 || scope.row.orderType === 6">
              <s-button class="btnCol" icon="receive" title="接单"
                        @click="scope.row.taskSource === 6 ? clickToPublishTaskOrder(scope.row, '接单') : GetWorkOrder(scope.row.uuid, scope.row.orderType, scope.row)"
                        :disabled="getworkroleDisabled(scope.row)">
              </s-button>
            </span>
            <span v-if="scope.row.orderType=== 1">
              <s-button class="btnCol" icon="delegate" :disabled="roleDisabled(scope.row)"
                        @click="propblemDelegateWorkOrder(scope.row.uuid, scope.row.orderType, undefined, scope.row.companyUuid)"
                        title="指派"></s-button>
            </span>
            <span v-if="scope.row.orderType=== 0 || scope.row.orderType === 3">
              <s-button class="btnCol" icon="delegate" :disabled="roleDisabled(scope.row)"
                        @click="scope.row.taskSource === 6 ? DelegatePublishWorkOrder(scope.row) : DelegateWorkOrder(scope.row, scope.row.uuid, scope.row.orderType, scope.row.companyUuid)"
                        title="指派"></s-button>
            </span>
            <span v-if="scope.row.orderType=== 6">
              <s-button class="btnCol" icon="delegate" :disabled="roleDisabled(scope.row)"
                        @click="requestServDelegateWorkOrder(scope.row.uuid, scope.row.companyUuid)"
                        title="指派"></s-button>
            </span>
            <span v-if="scope.row.orderType === 2 || scope.row.orderType === 5 || scope.row.orderType === 4">
              <s-button class="btnCol" icon="delegate" :disabled="roleDisabled(scope.row)"
                        @click="GetWorkOrder(scope.row.uuid, scope.row.orderType, scope.row)"
                        title="处理"></s-button>
            </span>
            <span>
            <i class="iconfont" :class="[scope.row.isConcern === 1 ? 'icon-star-full' : 'icon-star-empty']"
               @click="handleConcern(scope.row)"
               :title="scope.row.isConcern === 1 ? '取消关注' : '关注'"></i>
          </span>
          </div>
        </template>
      </s-table-column>
    </s-table-page>
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
  </div>
</template>

<script>
  // import DateRange from '@/components/tableCom/src/DateRange';
  import $axios from 'sunflower-ajax';
  // import {Validaters} from 'sunflower-common-utils';
  import {NameCardClick} from '@/components/nameCard/NameCard';
  import PublishDelegateDialog from '@/home/ProcessCenter/ProcessUndealOrders/PublishDelegateDialog.vue';
  import assignOthers from '@/pages/Process_RequestService/DetailDialog/AssignToOthers.vue';
  import EventDelegate from '@/home/ProcessCenter/ProcessUndealOrders/delegateDialog.vue'
  import processRoleMixin from '@/home/ProcessCenter/processRoleMixin.js'
  import detailMixin from '@/pages/Process_ProblemDetail/ProblemDetailMixin'
  //  import Bus from '@/plugins/eventBus';

  export default {
    mixins: [processRoleMixin, detailMixin],
    name: 'processCenter_knowledge',
    components: {
      // DateRange,
      NameCardClick,
      PublishDelegateDialog,
      assignOthers,
      EventDelegate
    },
    data() {
      return {
        searchForm: {
          serialCode: '',
          orderType: null,
          startTime: '',
          endTime: '',
          briefDesc: '',
          createUser: '',
          status: null
        },
        orderTypeMap: {},
        deletitle: '事件工单委派给他人',
        delegatePublishDialog: false,
        delegateDialog: false,
        delegateRowData: {},
        AssignToOtherDialog: false,
        AssignToOtherRSDialog: false,
        searchFormRules: {
          // serialCode: [Validaters.Number]
        },
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        list: [],
        selections: [],
        statusData: [],
        eventParams: {},
        isShowButton: false,
        refuseuuid: '',
        haveorderType: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],
        problemStatus: ['草稿', '评审中', '已指派', '调查中', '待决', '已完成'], // 问题1
        changeStatus: ['草稿', '变更请求', '已计划审批', '计划', '技术审批', '正在执行', '待决', '已完成'], // 变更2
        incidentStatus: ['新建', '已指派', '待决', '进行中', '已解决'], // 事件0
        taskStatus: ['草稿', '已指派', '处理中', '已完成'], // 任务3
        knowledgeStatus: ['草稿', '已启动', '发布审批', '待发布', '已发布'], // 知识4
        publishStatus: ['草稿', '启动审批', '计划审批', '开发审批', '测试审批', '部署审批', '关闭审批', '进行中', '待决', '已完成'], // 发布5
        requestStatus: ['草稿', '已提交', '启动审批', '已指派', '进行中', '已完成']  // 服务请求6
      }
    },
    computed: {
      rolePro() {
        return this.$store.state.processCenter.rolePro;
      }
    },
    created() {
      this.statusData = this.incidentStatus
      this.getOrderType().then(() => { this.search() })
    },
    mounted() {
      this.getDateRangeStart(this.searchForm.startTime)
      this.getDateRangeEnd(this.searchForm.endTime)
    },
    watch: {
      'searchForm.orderType'(val) {
        switch (val) {
          case 0:
            this.statusData = this.incidentStatus
            this.searchForm.status = null
            break;
          case 1:
            this.statusData = this.problemStatus
            this.searchForm.status = null
            break;
          case 2:
            this.statusData = this.changeStatus
            this.searchForm.status = null
            break;
          case 3:
            this.statusData = this.taskStatus
            this.searchForm.status = null
            break;
          case 4:
            this.statusData = this.knowledgeStatus
            this.searchForm.status = null
            break;
          case 5:
            this.statusData = this.publishStatus
            this.searchForm.status = null
            break;
          case 6:
            this.statusData = this.requestStatus
            this.searchForm.status = null
            break;
        }
      }
    },
    methods: {
      updateData() {
        this.search()
      },
      closeAssignToOthers() {
        this.AssignToOtherRSDialog = false
      },
      savePublishDelegate() {
        this.$refs['publishDelegate'].$refs['deleateForm'].validate(valid => {
          if (!valid) return;
          let data = this.$refs.publishDelegate.deleateForm
          $axios.get(`/itilChangeOrder/changeTaskAssign/${this.publishParams.uuid}/${data.assignGroup}/${data.assignUser}`, {
            data: [],
            logTemplate: `指派|工单(${this.publishData.serialCode})`
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({
                message: '委派成功',
                type: 'success'
              });
              this.delegatePublishDialog = false
              this.search()
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
      eventorderDelegate() {
        this.$refs['eventdelegate'].$refs['deleateForm'].validate(valid => {
          if (!valid) return;
          let data = this.$refs.eventdelegate.deleateForm
          if (this.orderType === 0) {
            $axios.get(`/itilIncidentCenter/incidentOrderOrderAssigneOther/${this.eventParams.uuid}/${data.assignUser}/${data.assignGroup}`, {
              data: [],
              logTemplate: `指派|工单(${this.delegateRowData.serialCode})`
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  message: '委派成功',
                  type: 'success'
                });
                this.delegateDialog = false
                this.search()
                //  刷新数据
              } else {
                this.$message({
                  message: '委派失败',
                  type: 'error'
                })
              }
            })
          } else {
            $axios.get(`/itilChangeOrder/changeTaskAssign/${this.eventParams.uuid}/${data.assignGroup}/${data.assignUser}`, {
              data: [],
              logTemplate: `指派|工单(${this.delegateRowData.serialCode})`
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  message: '委派成功',
                  type: 'success'
                });
                this.delegateDialog = false
                this.search()
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
      reset() {
        this.searchForm = {
          startTime: '',
          endTime: ''
        }
      },
      clickToPublishTaskOrder(model, type) {
        if (type === '详情') {
          this.goto('/ProcessCenter/publishTaskOrderDetail/' + model.uuid);
        } else if (type === '接单') {
          $axios.get(`/itilChangeOrder/changeTaskTaking/${model.uuid}`, {
            data: [model],
            logTemplate: `接单|工单(#serialCode#)`
          }).then((res) => {
            if (res.data.state === true) {
              this.goto('/ProcessCenter/publishTaskOrderDetail/' + model.uuid);
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              })
            }
          })
        }
      },
      propblemDelegateWorkOrder(taskId, orderType, orderId, companyUuid) {
        this.AssignToOtherDialog = true
        this.eventParams.orderType = orderType
        this.eventParams.incidentOrderUuid = orderId
        this.eventParams.taskId = taskId
        this.eventParams.companyUuid = companyUuid
        this.search()
      },
      requestServDelegateWorkOrder(uuid, companyUuid) {
        this.AssignToOtherRSDialog = true
        this.requestParams.uuid = uuid
        this.requestParams.companyUuid = companyUuid
        this.search()
      },
      DelegateWorkOrder(row, uuid, orderType, companyUuid) {
        this.orderType = orderType
        if (this.orderType === 3) {
          this.deletitle = '任务工单委派给他人'
        }
        this.delegateRowData = row
        this.delegateDialog = true;
        this.eventParams.uuid = uuid
        this.search()
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
      GetWorkOrder(uuid, orderType, model) {
        switch (orderType) {
          case 0:
            $axios.get(`/itilIncidentCenter/OrderTalking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('/ProcessCenter/eventDetail/' + uuid);
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
                  this.goto('/ProcessCenter/problemDetail/' + uuid);
                } else {
                  this.$message({
                    message: res.data.errormsg,
                    type: 'error'
                  })
                }
              })
            } else {
              this.goto('/ProcessCenter/problemDetail/' + uuid);
            }
            break;
          case 2:
            this.goto('/ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            $axios.get(`/itilChangeOrder/changeTaskTaking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('/ProcessCenter/taskOrderDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
          case 4:
            this.goto('/ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('/ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            $axios.get(`/itilServiceRequest/orderTakling/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('/ProcessCenter/requestServiceDetail/' + uuid);
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
      getOrderType() {
        return $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.orderTypeMap = res.data;
          return this.orderTypeMap;
        })
      },
      getStatus(orderType, status) {
        switch (orderType) {
          case 0: // 事件
            return this.incidentStatus[status]
          case 1: // 问题
            return this.problemStatus[status]
          case 2: // 变更
            return this.changeStatus[status - 1]
          case 3: // 任务
            return this.taskStatus[status - 1]
          case 4: // 知识
            return this.knowledgeStatus[status - 1]
          case 5: // 发布
            return this.publishStatus[status]
          case 6: // 服务请求
            return this.requestStatus[status]
        }
      },
      getDateRangeStart(value) {
        this.disableAfterToday2 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() < new Date(value).getTime())
          }
        }
      },
      getDateRangeEnd(value) {
        this.disableAfterToday1 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() > new Date(value).getTime())
          }
        }
      },
      search() {
        let params = {
          serialCode: this.searchForm.serialCode,
          orderType: this.searchForm.orderType,
          startTime: parseInt(new Date(this.searchForm.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.searchForm.endTime).getTime() / 1000),
          briefDesc: this.searchForm.briefDesc,
          createUser: this.searchForm.createUser,
          status: this.searchForm.status
        }
        $axios.post('/itilWorkflowCenter/getUndealOrdersFromCondition', params).then(({data}) => {
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
          this.list = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList].reverse()
        })
      },
      getworkroleDisabled(model) {
        let alive = false
        if (((model.orderType === 0 && this.rolePro.incident < 1 && model.incidentStatus === 3) || (model.orderType === 0 && model.incidentStatus === 3) || ((model.orderType === 0 && this.rolePro.incident === null))) ||
          // currentAuth === 1 && state < 1 || currentAuth === 2 && state < 3
          (model.orderType === 1 && !(this.rolePro.problemArr.includes(3) && model.problemStatus < 1 || this.rolePro.problemArr.includes(2) && this.model.problemStatus === 2)) ||
          ((model.orderType === 3 && model.taskStatus === 4) || (model.orderType === 3 && model.taskStatus === 3)) ||
          (model.orderType === 6 && ((model.status === 4 && model.isOtherOrder === 1) || !(((this.IsUserGroups && this.rolePro.serviceArr.includes(2)) || (this.rolePro.serviceArr.includes(1) && this.rolePro.serviceArr.includes(4))) && [0, 1, 3].includes(model.status) || (this.rolePro.serviceArr.includes(1) && !this.rolePro.serviceArr.includes(4)) && [0, 1].includes(model.status) || (!this.rolePro.serviceArr.includes(1) && this.rolePro.serviceArr.includes(4)) && model.status === 3)))
        ) {
          alive = true;
        }
        return alive
      },
      roleDisabled(model) {
        let alive = false
        if ((model.serialCode.slice(0, 2) === 'SJ' && this.rolePro.incident < 1) ||
          (model.serialCode.slice(0, 2) === 'WT' && (this.rolePro.problem === 3 && [4, 5].indexOf(model.problemStatus) !== -1 || this.rolePro.problem === 2 && [4].indexOf(model.problemStatus) !== -1)) ||
          (model.serialCode.slice(0, 2) === 'BG' && this.rolePro.change <= 1) ||
          (model.serialCode.slice(0, 2) === 'RW' && [4].indexOf(model.taskStatus) !== -1) ||
          (model.serialCode.slice(0, 2) === 'RE' && ((model.status === 4 && model.isOtherOrder === 1) || !((this.rolePro.service === 4 || this.rolePro.service === 2) && (model.status === 3 || model.status === 4))))
        ) {
          alive = true;
        }
        return alive;
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      approve(name) {
        switch (name) {
          case 'isConcern':
            this.batchAttention()
            break;
        }
      },
      batchAttention() {
      },
      goto(path) {
        this.$router.push(path)
      },
      goDetail(orderType, uuid) {
        switch (orderType) {
          case 0:
            this.goto('/ProcessCenter/eventDetail/' + uuid);
            break;
          case 1:
            this.goto('/ProcessCenter/problemDetail/' + uuid);
            break;
          case 2:
            this.goto('/ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('/ProcessCenter/taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('/ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('/ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            this.goto('/ProcessCenter/requestServiceDetail/' + uuid);
            break;
        }
      },
      handleConcern(row) {
        if (row.isConcern !== 1) {
          this.$confirm('确定关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${row.uuid}/${row.orderType}`, {
              data: [],
              logTemplate: `关注|工单(${row.serialCode})`
            }).then(({data}) => {
              if (data) {
                this.$message({
                  type: 'success',
                  message: '关注成功'
                })
              }
              row.concernUuid = data
              this.search()
            })
          }).catch(() => {});
        } else {
          this.$confirm('确定取消关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${row.concernUuid}`, {
              data: [],
              logTemplate: `取消关注|工单(${row.serialCode})`
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消关注成功'
                })
                this.search()
              } else {
                this.$message({
                  type: 'error',
                  message: '取消关注失败'
                })
              }
            })
          }).catch(() => {});
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .myHavedone
    .reButton
      float: right;
      margin-right: 16px;
      margin-top: -38px;
  .btnCol
    background: none;
    border: none;
    padding: 1% 0 1% 3%;
    &:hover
      background: none;
      border: none;
</style>
