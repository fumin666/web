<template>
  <section>
    <s-tab type="card" class="oper-subpage-margin" @on-click="switchTab">
      <s-tab-pane label="申请列表" v-if="judgeRoleBtn('operationCenter_batchApplyList')">
        <s-table-page :data='lists'

                  :has-action-col='false'
                  :header-actions='getListActionsDef()'
                  :header-search='getSearchDef()'
                  @selection-change="handleSelectionChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="taskName"
            label="任务名称">
          </s-table-column>
          <s-table-column
            prop="userRealName"
            label="任务创建者">
          </s-table-column>
          <s-table-column
            prop="beginTime"
            label="开始时间">
          </s-table-column>
          <s-table-column
            prop="endTime"
            label="结束时间">
          </s-table-column>
          <s-table-column
            prop="lastTime"
            label="上次执行完成时间"
            :formatter="formatterStatus">
          </s-table-column>
          <s-table-column
            label="下次执行时间">
            <template slot-scope="scope">
              <span v-if="Date.parse(new Date(scope.row.endTime)) - Date.parse(new Date(scope.row.nextTime)) > 0">
                {{scope.row.nextTime}}
              </span>
              <span v-else>任务结束</span>
            </template>
          </s-table-column>
          <s-table-column
            prop="taskStatus"
            label="状态"
            :formatter="taStatus">
          </s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="viewListHandle(scope.row)" title="查看详情"></i>
              <i v-if="isShowCarry(scope.row)" class="iconfont icon-carry-out" @click="carryHandle(scope.row)" title="立即执行"></i>
              <i class="iconfont icon-delete" @click="delListHandle(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="执行结果" v-if="judgeRoleBtn('operationCenter_batchExecutionResult')">
        <s-table-page :data='BatchExeLogList'

                  :actions-col-width="`20px`"
                  :row-actions='getLogDef()'
                  :header-search='getResultSearchDef()'>
          <s-table-column
            prop="itcompName"
            label="资产名称">
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址">
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="审批列表" v-if="judgeRoleBtn('operationCenter_batchApproveList')">
        <s-table-page :data='BatchExcuteAuditList'

                  :has-action-col='false'
                  :header-search='getExcSearchDef()'>
          <s-table-column
            prop="taskName"
            label="任务名称">
          </s-table-column>
          <s-table-column
            prop="userRealName"
            label="申请者">
          </s-table-column>
          <s-table-column
            prop="typeStr"
            label="审核状态">
          </s-table-column>
          <s-table-column
            prop="strPeriod"
            label="执行周期">
          </s-table-column>
          <s-table-column
            prop="beginTime"
            label="开始时间">
          </s-table-column>
          <s-table-column
            prop="endTime"
            label="结束时间">
          </s-table-column>
          <s-table-column label="操作" width="180">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="viewListHandle(scope.row, 1)" title="查看详情"></i>
              <i class="iconfont icon-download" @click="downloadHandle(scope.row)" title="下载"></i>
              <i v-if="!isShow(scope.row)" class="iconfont icon-delete" @click="delHandle(scope.row)" title="删除"></i>
              <i v-if="isShow(scope.row)" class="iconfont icon-seal" @click="approveHandle(scope.row)" title="审批"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="AddBatchDialog"
      v-if="AddBatchDialog"
      width="700px"
      title="添加批量执行任务">
      <add-batch :uuid="uploadUuid" ref="addBatchDialog"></add-batch>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">下一步</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="relatedEquipmentDialog"
      v-if="relatedEquipmentDialog"
      width="900px"
      title="设置批量任务关联资产">
      <relate-dialog :taskUuid="uploadUuid" ref="relatedEquipment"></relate-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveRelated">保存</s-button>
        <s-button type="cancel" @click="relatedEquipmentDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--执行结果查看-->
    <s-dialog
      v-model="viewResultDialog"
      v-if="viewResultDialog"
      width="80%"
      title="审批后运维列表">
      <exe-log :uuid="uuids"></exe-log>
    </s-dialog>
    <!--审批操作-->
    <s-dialog
      v-model="approveDialog"
      v-if="approveDialog"
      width="50%"
      title="审批">
      <view-dialog :uuid="viewUuid" :taskUuid="viewTaskUuid" ref="approveDia"></view-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="doing" @click="approveOk">确定</s-button>
        <s-button v-if="!doing" disabled style="width:100px">
          <div style="float: left">正在审批</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button type="cancel" @click="approveDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看详情-->
    <s-dialog
      v-model="viewInfoDialog"
      v-if="viewInfoDialog"
      width="900px"
      title="申请详情">
      <view-list :viewdata="viewdata"></view-list>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  import AddBatch from './AddBatchExe'
  import exeLog from './ExeLogTable'
  import viewDialog from './ViewList'
  import relateDialog from './RelateEquipment'
  import {Download} from 'sunflower-common-utils';
  import {isArray, indexOf} from 'lodash';
  import viewList from './ViewBatchDialog'
  export default {
    data() {
      return {
        lists: [],
        resultList: [],
        BatchExcuteAuditList: [],
        BatchExeLogList: [],
        AddBatchDialog: false,
        viewResultDialog: false,
        approveDialog: false,
        relatedEquipmentDialog: false,
        uuids: '',
        viewUuid: '',
        viewUuidName: '',
        viewTaskUuid: '',
        uploadUuid: '',
        selectList: [],
        viewInfoDialog: false,
        viewdata: {},
        doing: true
      }
    },
    components: {

      AddBatch,
      exeLog,
      viewDialog,
      relateDialog,
      viewList
    },
    methods: {
      formatterStatus(item) {
        return (item.lastTime.substr(0, 4) === '1970') ? '' : item.lastTime
      },
      switchTab(idx) {
        switch (idx) {
          case 0: this.getLists(); break;
          case 1: this.getBatchExeLogList(); break;
          case 2: this.getBatchExcuteAuditList(); break;
        }
      },
      handleSelectionChange(val) {
        this.selectList = val
      },
      carryHandle(row) {
        this.$confirm('确定立即执行？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationBatchExcute/exeBatchExcuteTask/${row.uuid}`).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getLists()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }).catch(() => {});
      },
      viewListHandle(row, type) {
        let infoUuid = ''
        type === 1 ? infoUuid = row.taskUuid : infoUuid = row.uuid
        $axios.get(`/operationBatchExcute/getAddFormInfo/${infoUuid}`).then(res => {
          this.viewInfoDialog = true
          this.viewdata = res.data
        })
      },
      delListHandle(row) {
        if (row.length === 0) {
          this.$message({
            message: '请至少选择一个',
            type: 'warning'
          });
          return false
        }
        let form = [];
        let formName = [];
        if (isArray(row)) {
          let uuids = []
          let names = []
          for (let v of row) {
            uuids.push(v.uuid)
            names.push({
              name: v.taskName
            })
          }
          form = uuids
          formName = names
        } else {
          form.push(row.uuid)
          formName.push({
            name: row.taskName
          })
        }
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('/operationBatchExcute/delBatchExcuteTask', form, {
            data: formName,
            logTemplate: '删除|申请列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getLists();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              });
            }
          });
        }).catch(() => {
        });
      },
      approveOk() {
        let addForm = this.$refs['approveDia'].addForm;
        this.$refs['approveDia'].$refs['addForm'].validate(valid => {
          if (!valid) return;
          this.doing = false
          $axios.post('/operationBatchExcute/batchExcuteAudit', addForm, {
            data: [{name: this.viewUuidName}],
            logTemplate: '审批|审批列表>审批任务（#name#）'
          }).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.approveDialog = false
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
            this.getBatchExcuteAuditList();
            this.doing = true;
          })
        })
      },
      taStatus(item) {
        switch (item.taskStatus) {
          case 1: return '正在上传脚本'
          case 2: return '等待执行'
          case 3: return '正在执行'
          case 4: return '执行完成(正常)'
          case 5: return '执行完成(异常)'
          case 6: return '等待审批'
          case 7: return '审批通过'
          case 8: return '审批拒绝'
          case 9: return '上传脚本失败'
        }
      },
      isShow(row) {
        if (row.createTime.substr(0, 4) === '1970') {
          return true
        }
      },
      isShowCarry(row) {
        if (row.taskStatus === 2 || row.taskStatus === 4 || row.taskStatus === 5) {
          if (Date.parse(new Date(row.nextTime)) > Date.parse(new Date(row.endTime))) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
      downloadHandle(row) {
        Download(`/operationBatchExcute/downloadExeScript/${row.uuid}`, {
          data: [row],
          logTemplate: '下载|审批列表>审批任务(#taskName#)'
        });
      },
      delHandle(row) {
        $axios.get(`/operationBatchExcute/delScriptAudit/${row.uuid}`).then((res) => {
          if (res.data === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getBatchExcuteAuditList();
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
        });
      },
      approveHandle(row) {
        this.viewUuid = row.uuid
        this.viewUuidName = row.taskName
        this.viewTaskUuid = row.taskUuid
        this.approveDialog = true
      },
      getLogDef() {
        let vm = this;
        return [{
          icon: 'info',
          click(row) {
            vm.viewResultDialog = true
            vm.uuids = row.deviceUuid
          },
          name: '详细'
        }]
      },
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '添加',
            click() {
              $axios.get('/operationBatchExcute/isCanAdd').then((res) => {
                if (res.data.status === 'false') {
                  self.$message({
                    message: res.data.msg,
                    type: 'error'
                  });
                } else {
                  self.uploadUuid = ''
                  self.AddBatchDialog = true
                  self.AddBatchDialogShow = true
                }
              });
            },
            icon: 'plus'
          }, {
            name: '批量删除',
            click() {
              self.delListHandle(self.selectList)
            },
            icon: 'batch-del'
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 14,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'userRealName', 'beginTime', 'endTime', 'lastTime', 'nextTime'] // can be string or Array
        }
      },
      getResultSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss'] // can be string or Array
        }
      },
      getExcSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'userRealName', 'type', 'taskPeriod', 'beginTime', 'endTime'] // can be string or Array
        }
      },
      getListRowActionsDef() {
        let vm = this;
        return [{
          type: 'info',
          click(row) {
            vm.editAccountDialog = true
          },
          name: '详细'
        }]
      },
      getLists() {
        $axios.get('/operationBatchExcute/getBatchExcuteTaskList').then((res) => {
          this.lists = res.data
        });
      },
      getBatchExcuteAuditList() {
        $axios.get('/operationBatchExcute/getBatchExcuteAuditList').then((res) => {
          this.BatchExcuteAuditList = res.data
        });
      },
      getBatchExeLogList() {
        $axios.get('/operationBatchExcute/getBatchExeLogList').then((res) => {
          this.BatchExeLogList = res.data
        });
      },
      addOk() {
        let self = this
        let addForm = this.$refs['addBatchDialog'].addForm;
        let uploadfiles = this.$refs['addBatchDialog'].$refs['upload'].uploadFiles
        if (uploadfiles.length === 0) {
          this.$message({
            message: '未上传脚本文件',
            type: 'error'
          });
          return false
        }
        for (let v of uploadfiles) {
          let arr = v.name.split('.')
          let num = arr.length - 1
          if (arr[num] !== 'sh') {
            this.$message.error('文件类型必须是sh')
            return false
          }
        }
        if (Date.parse(addForm.endTimeDate) - Date.parse(addForm.beginTimeDate) < 0) {
          this.$message({
            message: '结束时间必须大于开始时间',
            type: 'error'
          });
          return false
        }
        if (Date.parse(addForm.endTimeDate) - Date.parse(new Date().toLocaleDateString()) < 0) {
          this.$message({
            message: '结束时间必须大于当前时间',
            type: 'error'
          });
          return false
        }
        this.$refs['addBatchDialog'].$refs['addScriptForm'].validate(valid => {
          if (!valid) return;
          $axios.post('/operationBatchExcute/addBatchExcuteTask', addForm, {
            data: [{name: addForm.taskName}],
            logTemplate: '添加|申请列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data.status === 'true') {
              self.getLists()
              self.uploadUuid = res.data.uuid
              self.relatedEquipmentDialog = true
            } else {
              self.$message({
                message: res.data.msg,
                type: 'error'
              });
              self.AddBatchDialog = true
            }
          }).then(() => {
            if (self.uploadUuid !== '') {
              self.AddBatchDialog = false
            }
          })
        })
      },
      saveRelated() {
        let addForm = this.$refs['relatedEquipment'].form;
        let selection = this.$refs['relatedEquipment'].selection
        for (let v of selection) {
          addForm.accountUuids.push(v.accountUuids)
          addForm.deviceUuids.push(v.itcompUuid)
          addForm.portUuids.push(v.protocolUuids)
        }
        if (indexOf(addForm.accountUuids, undefined) !== -1 || indexOf(addForm.portUuids, undefined) !== -1) {
          this.$message({
            message: '协议端口或者登录账号尚未选择',
            type: 'error'
          });
          addForm.accountUuids.length = 0
          addForm.deviceUuids.length = 0
          addForm.portUuids.length = 0
          return false
        }
        $axios.post('/operationBatchExcute/saveDeviceList', addForm).then((res) => {
          if (res.data.status === 'true') {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.relatedEquipmentDialog = false
          } else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
            addForm.accountUuids.length = 0
            addForm.deviceUuids.length = 0
            addForm.portUuids.length = 0
          }
        });
      },
      addCancel() {
        this.AddBatchDialog = false
      }
    },
    mounted() {
      this.getLists()
      this.getBatchExeLogList()
      this.getBatchExcuteAuditList()
    }
  }
</script>
