<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-08 18:20:17
 * @LastEditTime: 2019-08-13 13:43:56
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section>
    <s-tab type="card" id="change-pass" v-model="activeTab" class="oper-subpage-margin" @tab-click="handleClick">
      <s-tab-pane name="pane1" label="运维申请" v-if="judgeRoleBtn('operationCenter_operationApply')">
        <!-- <s-tab v-model="activeApplyTab" v-if="activeTab === 'operationsApply'"> -->
          <!-- <s-tab-pane name="applyList" label="申请列表" v-if="judgeRoleBtn('operationCenter_applyList')"> -->
            <s-table-page :data='lists'
                      id="3333"
                      v-if="activeTab === 'pane1'"

                      :has-action-col='false'
                      :header-actions='getListActionsDef()'
                      :header-search='getNewSearchDef()'>
              <s-table-column
                prop="specialoperCode"
                label="运维号">
              </s-table-column>
              <s-table-column
                prop="specialoperName"
                label="标题">
              </s-table-column>
              <s-table-column
                prop="specialoperTypeName"
                label="运维类型">
              </s-table-column>
              <s-table-column
                prop="applyStatus"
                label="审批状态">
              </s-table-column>
              <s-table-column
                prop="startTime"
                label="开始时间"
                show-tool->
              </s-table-column>
              <s-table-column
                prop="endTime"
                label="结束时间">
              </s-table-column>
              <s-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <i v-if="isShow(scope.row.oprType).includes(1)" class="iconfont icon-eye" title="查看" @click="viewHandler(scope.row)"></i>
                  <i v-if="isShow(scope.row.oprType).includes(6)" class="iconfont icon-delegate" @click="autoApprovalHandler(scope.row)" title="自动审批"></i>
                 <!-- <i v-if="isShow(scope.row.oprType).includes(2)" title='查看审批详情' class="iconfont icon-config-audit" @click="gotoApproval(scope.row)"></i>-->
                  <i v-if="isShow(scope.row.oprType).includes(4)" class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
                  <i v-if="isShow(scope.row.oprType).includes(3)" class="iconfont icon-special-oper" title="运维" @click="opsHandler(scope.row)"></i>
                  <i v-if="isShow(scope.row.oprType).includes(5)" class="iconfont icon-order" title='查看作废详情' @click="getcancelReason(scope.row.uuid)"></i>
                </template>
              </s-table-column>
            </s-table-page>
      </s-tab-pane >
      <s-tab-pane name="pane2" label="运维审批" v-if="judgeRoleBtn('operationCenter_operationApprove')">
        <s-tab v-model="activeApproveTab" v-if="activeTab === 'pane2'">
          <s-tab-pane name="approveList" label="审批列表" v-if="judgeRoleBtn('operationCenter_approveList')">
            <special-approve ref="approveList"  v-if="activeApproveTab === 'approveList'"></special-approve>
          </s-tab-pane>
          <s-tab-pane name="approveAgent" label="代理审批" v-if="judgeRoleBtn('operationCenter_approveOfAgent')">
            <approve-agent ref="approveAgent" v-if="activeApproveTab === 'approveAgent'"></approve-agent>
          </s-tab-pane>
          <s-tab-pane name="approveAll" label="全局审批" v-if="judgeRoleBtn('operationCenter_globalApprove')">
            <approve-all ref="approveAll" v-if="activeApproveTab === 'approveAll'"></approve-all>
          </s-tab-pane>
          <s-tab-pane name="approveHistory" label="审批历史" v-if="judgeRoleBtn('operationCenter_approveHistory')">
            <special-history ref="approveHistory" v-if="activeApproveTab === 'approveHistory'"></special-history>
          </s-tab-pane>
          <s-tab-pane name="approveLog" label="审批日志" v-if="judgeRoleBtn('operationCenter_approveLog')">
            <special-log ref="approveLog" @startDialog="getcancelReason" v-if="activeApproveTab === 'approveLog'"></special-log>
          </s-tab-pane>
        </s-tab>
      </s-tab-pane>
      <s-tab-pane name="pane3" label="工单运维" v-if="judgeRoleBtn('operationCenter_orderOperation')">
        <s-tab v-model="activeOrderTab" v-if="activeTab === 'pane3'">
          <s-tab-pane name="orderManagement" label="工单管理" v-if="judgeRoleBtn('operationCenter_orderManagement') && isShowOrderManagement">
            <order-management ref="orderManagement" v-if="activeOrderTab === 'orderManagement'"></order-management>
          </s-tab-pane>
          <s-tab-pane name="orderOperationsList" label="工单运维列表" v-if="judgeRoleBtn('operationCenter_orderOperationList') && isShowOrderOperations">
            <order-operations-list ref="orderOperationsList" v-if="activeOrderTab === 'orderOperationsList'"></order-operations-list>
          </s-tab-pane>
          <s-tab-pane name="orderHistory" label="工单历史" v-if="judgeRoleBtn('operationCenter_orderHistory')">
            <order-history ref="orderHistory" v-if="activeOrderTab === 'orderHistory'"></order-history>
          </s-tab-pane>
        </s-tab>
      </s-tab-pane>
      <s-tab-pane name="pane4" label="特殊运维KPI" v-if="judgeRoleBtn('operationCenter_specialOperationKpi')">
        <special-kpi v-if="showKpi"></special-kpi>
      </s-tab-pane>
    </s-tab>
    <!--新建申请-->
    <s-dialog
      v-model="AddApplyDialog"
      v-if="AddApplyDialog"
      width="900px"
      title="添加申请">
      <add-apply ref="AddApply" @saveApp="ApplySave"></add-apply>
      <template slot="footer" class="dialog-footer">
        <s-button @click="uploadFile">保存</s-button>
        <s-button type="cancel" @click="ApplyCancel">取消</s-button>
      </template>
    </s-dialog>
    <!--运维弹框-->
    <s-dialog
      v-model="specialDialog"
      v-if="specialDialog"
      width="900px"
      title="特殊运维">
      <spec-list :uuid="uuids" @showOperation="operation"></spec-list>
    </s-dialog>
    <!--查看-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="70%"
      title="申请信息">
      <view-special :viewdata="viewdata"></view-special>
    </s-dialog>
    <!--运维访问(new)-->
    <s-dialog
      v-model="opsAccessNewDialog"
      v-if="opsAccessNewDialog"
      width="700px"
      title="运维访问">
      <ops-access-new :rowData="rowData" ref="opsAccessNew"></ops-access-new>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOpsAccessNew">运维</s-button>
        <s-button type="cancel" @click="opsAccessNewDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--运维弹框-->
    <s-dialog
      v-model="opsDialog"
      v-if="opsDialog"
      width="700px"
      title="运维访问">
      <ops-add :decisionData="rowData" :showModel="showModel" ref="ops"></ops-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOps">保存</s-button>
        <s-button type="cancel" @click="opsDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看详情弹框-->
    <s-dialog v-model="viewApproveDialog" v-if="viewApproveDialog" width="70%" title="查看详情">
      <s-table-page :data='approvalList' >
        <s-table-column
          prop="approvalTime"
          label="审批时间">
        </s-table-column>
        <s-table-column
          prop="approvalUserName"
          label="审批人">
        </s-table-column>
        <s-table-column
          prop="applyStatus"
          label="审批状态">
        </s-table-column>
        <s-table-column
          prop="approvalComments"
          label="审批意见">
        </s-table-column>
      </s-table-page>
    </s-dialog>
    <!--自动审批-->
    <s-dialog
      v-model="approvalDialog"
      v-if="approvalDialog"
      width="600px"
      title="自动审批">
      <auto-approval :initData="initViewdata" ref="autoApprovalDialog"></auto-approval>
      <template slot="footer" class="dialog-footer">
        <s-button @click="sendMessage">发送短信</s-button>
        <s-button @click="approvalByAuto">自动审批</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="autoViewDialog"
      v-if="autoViewDialog"
      width="800px"
      title="审批详情">
      <s-table :data="autoViewList">
        <s-table-column label="申请人" prop="applyUserName"></s-table-column>
        <s-table-column label="审批人" prop="approveUserName"></s-table-column>
        <s-table-column label="审批状态" prop="type"></s-table-column>
        <s-table-column label="审批时间" prop="replyTime"></s-table-column>
      </s-table>
    </s-dialog>
    <!--作废原因查看的窗口-->
    <s-dialog
      v-model="cancellationDialog"
      v-if="cancellationDialog"
      width="600px"
      title="作废原因">
      <div v-for="item in cancelReason">
        <s-row>
          <s-col :span="6">
            <div class="grid-content bg-purple">{{item.name}}</div>
          </s-col>
          <s-col :span="18">
            <div class="grid-content bg-purple-light" style="height:100%;word-wrap: break-word">{{item.val}}</div>
          </s-col>
        </s-row>
      </div>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import roleCheckMixin from '@/common/mixins/roleCheckMixin'

  import $axios from 'sunflower-ajax'
  import AddApply from './ApplySpecial'
  import specList from './OpsEquipment'
  import opsAdd from '../Operation_Equipment/OpsAdd'
  import viewSpecial from './ViewSpecialApplycation'
  import autoApproval from './AutomaticApproval'
  import specialApprove from './SpecialApprove.vue'
  import specialKpi from './SpecialKpi.vue'
  import specialHistory from './SpecialHistory.vue'
  import specialLog from './SpecialLog.vue'
  import orderManagement from './OrderManagement'
  import orderOperationsList from './OrderOperationsList'
  import orderHistory from './OrderHistory'
  import approveAll from './ApproveAll'
  import approveAgent from './ApproveAgent'
  import OpsAccessNew from '@/pages/Operation_Equipment/OpsAccessNew';

  const VNC = '00000000000000000000000000000078';
  const RDP = '00000000000000000000000000000077';
  const account = 'noneaccount000000000000000000000';
  const mysql = '00000000000000000000000000000084';
  const sqlserver = '00000000000000000000000000000085';
  const db2 = '00000000000000000000000000000081';
  const informix = '00000000000000000000000000000082';
  const sybase = '00000000000000000000000000000086';
  const oracle = '00000000000000000000000000000080';
  const plsql = '00000000000000000000000000000114';
  const toadoracle = '00000000000000000000000000000120';
  const SSH = '00000000000000000000000000000072';
  const SFTP = '00000000000000000000000000000074';
  const mssqlserver = '00000000000000000000000000000113';
  export default {
    mixins: [roleCheckMixin],
    data() {
      return {
        tabNameArr: ['operationCenter_operationApply', 'operationCenter_operationApprove', 'operationCenter_orderOperation', 'operationCenter_specialOperationKpi'], // 页签名字的集合(顺序和页签一致)
        isShowOrderManagement: false,
        isShowOrderOperations: false,
        lists: [],
        history: [],
        pendingLists: [],
        activeTab: 'operationsApply',
        activeApplyTab: 'applyList',
        activeApproveTab: 'approveList',
        activeOrderTab: 'orderManagement',
        AddApplyDialog: false,
        specialDialog: false,
        viewDialog: false,
        opsDialog: false,
        opsAccessNewDialog: false, // 运维访问(new)
        approvalDialog: false,
        autoViewDialog: false,
        viewApproveDialog: false,
        cancellationDialog: false,
        showKpi: false,
        uuids: '',
        viewdata: {},
        rowData: {},
        showModel: '',
        specialOperateCode: '',
        initdata: {
          specialoperUuid: '',
          approveUserUuid: '',
          userPasswd: ''
        },
        initViewdata: {},
        autoViewList: [],
        currentRow: {},
        cancelReason: [],
        approvalList: []
      }
    },
    components: {

      AddApply,
      specList,
      viewSpecial,
      opsAdd,
      autoApproval,
      specialApprove,
      specialKpi,
      specialHistory,
      specialLog,
      orderManagement,
      orderOperationsList,
      orderHistory,
      approveAll,
      approveAgent,
      OpsAccessNew
    },
    watch: {
      activeApplyTab: {
        immediate: true,
        handler(val) {
          if (val === 'applyList') {
            this.getLists()
          } else if (val === 'applyHistory') {
            this.getHistory()
          }
        }
      }
    },
    methods: {
      isShow(status) {
        let arr = status.split('').map(Number)
        return arr
      },
      handleClick(tab) {
        this.showKpi = false
        switch (tab.name) {
          case 'applyList': this.getLists(); break;
          case 'applyHistory': this.getHistory(); break;
          case 'approveList': this.$refs['approveList'].getPendingList(); break;
          case 'approveHistory': this.$refs['approveHistory'].getHistoryList(); break;
          case 'approveLog': this.$refs['approveLog'].getLogList(); break;
          case 'pane4': this.showKpi = true; break;
        }
      },
      sendMessage() {
        let form = this.$refs['autoApprovalDialog'].form
        if (form.leaderUuid === '') {
          this.$message({
            type: 'error',
            message: '请选择审批领导'
          })
          return false
        }
        this.initdata.approveUserUuid = form.leaderUuid
        $axios.post('specialOperationApply/autoApproveSendMessage', this.initdata).then(res => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              type: 'success',
              message: '发送成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.error_reason
            })
          }
        })
      },
      approvalByAuto() {
        let form = this.$refs['autoApprovalDialog'].form
        if (form.pwd === '') {
          this.$message({
            type: 'error',
            message: '请输入口令'
          })
        } else {
          this.initdata.userPasswd = form.pwd
          this.initdata.approveUserUuid = form.leaderUuid
          $axios.post('specialOperationApply/confirmAutoApprove', this.initdata).then(res => {
            if (res.data.hasOwnProperty('success')) {
              this.$message({
                type: 'success',
                message: '自动审批成功'
              })
              this.approvalDialog = false
              this.getLists()
            } else {
              this.$message({
                type: 'error',
                message: res.data.error_reason
              })
            }
          })
        }
      },
      autoApprovalHandler(row) {
        $axios.get('/specialOperationApply/getApproveLeader').then(res => {
          this.approvalDialog = true
          this.initViewdata = res.data
          this.initdata.specialoperUuid = row.uuid
        })
      },
      gotoApproval(row) {
        let _this = this
        _this.currentRow = row
        if (row.specialoperCategory === 0) {
          this.autoViewDialog = true
          $axios.get(`/specialOperationApply/getSpecialoperAuditList/${row.uuid}`).then(res => {
            this.autoViewList = res.data
          })
        } else {
          $axios.post(`/specialOperationApply/getApplySpecialoperAuditDetailList/${row.uuid}`).then(res => {
            if (res.status === 200) {
              _this.viewApproveDialog = true;
              _this.approvalList = res.data
            } else {
              _this.$message({
                message: '获取审批详情失败，请重试',
                type: 'error'
              });
            }
          });
        }
      },
      viewHandler(row) {
        $axios.get(`/specialOperationApply/getSpecialoperApplyDetail/${row.uuid}`).then(res => {
          this.viewDialog = true
          this.viewdata = res.data
        })
      },
      opsHandler(row) {
        $axios.get(`specialOperationApply/judgeApplyBeforeOperation/${row.uuid}`).then(res => {
          if (res.data.hasOwnProperty('true')) {
            this.specialOperateCode = row.uuid
            this.uuids = row.uuid
            this.specialDialog = true
          } else if (res.data.hasOwnProperty('false')) {
            this.$message({
              type: 'error',
              message: res.data.false
            })
          }
        })
      },
      delHandler(row) {
        let vm = this
        vm.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/specialOperationApply/deleteSpecialoperApply/${row.uuid}`, {
            data: [{code: row.specialoperCode}],
            logTemplate: '删除|运维申请(#code#)'
          }).then((res) => {
            if (res.data === true) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getLists()
            }
          });
        }).catch(() => {});
      },
      addHandler() {
        this.AddApplyDialog = true
      },
      getNewSearchDef() {
        return {
          width: 4,
          offset: 14,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'specialoperName', 'specialoperTypeName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '添加',
            click() {
              $axios.get('/specialOperationApply/isCanAddSpecialoperApply').then(res => {
                if (res.data.hasOwnProperty('false')) {
                  self.$message({
                    type: 'error',
                    message: res.data.false
                  });
                }
                if (res.data.hasOwnProperty('true')) {
                  self.AddApplyDialog = true
                }
              });
            },
            icon: 'plus'
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'specialoperName', 'specialoperTypeName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      getLists() {
        $axios.get('/specialOperationApply/getSpecialoperApplyList').then(res => {
          this.lists = res.data
        });
      },
      getHistory() {
        $axios.get('/specialOperationApply/getSpecialoperApplyHistory').then(res => {
          this.history = res.data
        });
      },
      uploadFile() {
        let files = this.$refs['AddApply'].fileList
        let formObj = this.$refs['AddApply'].$refs['addSpecialForm']
        let form = this.$refs['AddApply'].addForm
        if (files.length > 5) {
          this.$message({message: '最多上传五个附件', type: 'error'});
          return false
        }
        if (Date.parse(form.endTimeStr) - Date.parse(form.startTimeStr) < 0) {
          this.$message({
            message: '结束时间必须大于开始时间',
            type: 'error'
          });
          return false
        }
        if (form.relresourceList.length < 1) {
          this.$message({
            message: '您还没有选择资产',
            type: 'error'
          });
          return false
        }
        formObj.validate((valid) => {
          if (!valid) {
            return false;
          }
          if (files.length !== 0) {
            this.$refs['AddApply'].$refs['upload'].submit();
          } else {
            this.ApplySave()
          }
        })
      },
      ApplySave() {
        let applyData = this.$refs['AddApply']
        let form = applyData.addForm
        for (let v of applyData.selectionsCommand) {
          form.relcommandList.push(
            {
              type: v.commandtype,
              accountUuid: v.accountUuid,
              commandType: v.commandinfoType,
              commandUuid: v.comanduuid,
              maintainedDeviceUuid: v.maintainedDeviceUuid
            }
          )
        }
        $axios.post('/specialOperationApply/addSpecialoperApply', form, {
          data: [{title: form.specialoperName}],
          logTemplate: '添加|运维申请(#title#)'
        }).then((res) => {
          if (res.data.result === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            if (res.data.notExpired === true) {
              this.getLists()
            } else {
              this.activeTab = 'applyHistory'
              this.getHistory()
            }
            this.AddApplyDialog = false
          }
        })
      },
      ApplyCancel() {
        this.AddApplyDialog = false
      },
      goToOperation (form) {
        form['specialOperateCode'] = this.specialOperateCode
        $axios.post('/basicOperation/webOperation', form).then((res) => {
          if (res.status === 200) {
            if (res.data !== '') {
              if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
                window.location.href = res.data
                this.opsDialog = false
              } else {
                this.opsDialog = false
                this.$message({
                  type: 'error',
                  message: res.data
                });
              }
            } else {
              this.opsDialog = false
              this.$message({
                type: 'error',
                message: '无法运维,请检查！'
              });
            }
          }
        });
      },
      saveOpsAccessNew() { // 保存运维访问（new）
        let form = this.$refs.opsAccessNew.searchForm
        if (!this.opsAccessNewDialog) {
          form.isAutoRecord = 0
        } else if (!this.$refs.opsAccessNew.userShow && !this.$refs.opsAccessNew.pwdShow) {
          form.isAutoRecord = 0
        }
        this.$refs['opsAccessNew'].$refs['searchForm'].validate(valid => {
          if (!valid) return;
          if (form.passwordType === 1 && form.strKeyPath === '') {
            this.$message({type: 'warning', message: '请先上传文件'});
            return
          }
          this.goToOperation(form)
        })
      },
      saveOps() {
        let form = this.$refs.ops.form
        this.$refs['ops'].$refs['addForm'].validate(valid => {
          if (!valid) return;
          if (form.passwordType === 1 && form.strKeyPath === '') {
            this.$message({type: 'warning', message: '请先上传文件'});
            return
          }
          this.goToOperation(form)
        })
      },
      operation(row) {
        if (!row.portUuid) {
          this.rowData = row
          this.opsAccessNewDialog = true
        } else {
          this.handleOps(row)
        }
      },
      handleOps(row) {
        this.rowData = row
        let opsForm = {
          specialOperateCode: this.specialOperateCode,
          accountuuid: row.accountUuid,
          diskMapping: row.diskMapping,
          operationuuid: row.maintainedDeviceUuid,
          oprationIp: row.device_ip,
          portuuid: row.portUuid,
          protocluuid: row.protocolUuid,
          clipboard: row.clipboard,
          accountName: '',
          accountPwd: '',
          colorDepth: '',
          rdpConsole: '',
          dbname: row.dbName || row.dbServerName,
          resolution: ''
        }
        let pid = row.protocolUuid
        let pType = row.protocolType
        let aid = row.accountUuid
        let authorized = false
        if (aid === account || aid === null) {
          authorized = true
        }   // 未授权
        if (pType === 2 || pType === 5 || pid === db2 || pid === informix || pid === sybase || pid === sqlserver || pid === mysql) {
          if (authorized) {
            if (pid === SSH || pid === SFTP) {
              this.showModel = 8
              this.opsDialog = true
            } else {
              this.showModel = 1
              this.opsDialog = true
            }
          } else {
            this.goToOperation(opsForm)
          }
        } else if (pid === oracle || pid === plsql || pid === toadoracle || pid === mssqlserver) {
          if (authorized) {
            this.showModel = 3
            this.opsDialog = true
          } else {
            this.showModel = 2
            this.opsDialog = true
          }
        } else if (pid === RDP || (pType === 1 && pid !== toadoracle && pid !== plsql && pid !== mssqlserver)) {
          if (authorized) {
            this.showModel = 5
            this.opsDialog = true
          } else {
            this.showModel = 4
            this.opsDialog = true
          }
        } else if (pid === VNC) {
          if (authorized) {
            this.showModel = 7
            this.opsDialog = true
          } else {
            this.showModel = 6
            this.opsDialog = true
          }
        } else {
          if (authorized) {
            this.showModel = 1
            this.opsDialog = true
          } else {
            this.goToOperation(opsForm)
          }
        }
      },
      getcancelReason(uuid) {
        this.cancellationDialog = true
        $axios.get('/specialOperationApply/getInvalidLogByApplyUuid/' + uuid).then(res => {
          let detail = res.data
          this.cancelReason = [
            {name: '运维号', val: detail.specialoperCode},
            {name: '作废时间', val: detail.invalidTime},
            {name: '作废人员', val: detail.userName},
            {name: '原因', val: detail.invalidReason}
            ]
        });
      },
      isShowOrderOperationsList () {
        if (this.isSystemAdmin || this.$store.state.userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000008') !== -1) { // 是否是系统管理员
          if (this.$store.state.userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000009') !== -1) { // 判断是否是 运维人员角色
            this.isShowOrderManagement = true;
            this.isShowOrderOperations = true;
            if (!this.judgeRoleBtn('operationCenter_orderManagement')) {
              this.activeOrderTab = 'orderOperationsList'
            }
          } else {
            this.isShowOrderManagement = true;
            this.isShowOrderOperations = false;
          }
        } else {
          if (this.$store.state.userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000009') !== -1) { // 判断是否是 运维人员角色
            this.isShowOrderOperations = true;
            this.isShowOrderManagement = false;
            this.activeOrderTab = 'orderOperationsList'
          }
        }
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.isShowOrderOperationsList()
    },
    mounted() {
      this.getLists()
      this.getHistory()
    }
  }
</script>
