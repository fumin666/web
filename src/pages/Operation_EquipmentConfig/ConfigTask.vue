<template>
  <section>
    <s-tab type="card" id="equipment-config" class="oper-subpage-margin">
      <s-tab-pane label="配置保存任务列表" v-if="judgeRoleBtn('operationCenter_confSaveTaskList')">
        <s-table-page :data='lists'  :has-action-col='false' :header-actions='getListActionsDef()' :header-search='getNewSearchDef()'>
          <s-table-column prop="taskName" label="任务名称">
          </s-table-column>
          <s-table-column prop="userRealName" label="任务创建者">
          </s-table-column>
          <s-table-column prop="taskPeriodStr" label="备份周期">
          </s-table-column>
          <s-table-column prop="beginTimeStr" label="开始时间">
          </s-table-column>
          <s-table-column prop="endTimeStr" label="结束时间">
          </s-table-column>
          <s-table-column prop="lastBackupDateStr" label="上次执行时间">
          </s-table-column>
          <s-table-column label="下次执行时间">
            <template slot-scope="scope">
                          <span v-if="Date.parse(new Date(scope.row.nextBackupDateStr)) - Date.parse(new Date(scope.row.endTimeStr)) < 0">
                            {{scope.row.nextBackupDateStr}}
                          </span>
              <span v-else>任务结束</span>
            </template>
          </s-table-column>
          <s-table-column label="操作" width="160">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row.uuid)"></i>
              <i class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane >
      <s-tab-pane label="配置保存任务日志" v-if="judgeRoleBtn('operationCenter_confSaveTaskLog')">
        <s-table-page :data='logLists' :has-action-col='false'  :header-search='getLogSearchDef()'>
          <s-table-column prop="itcompName" label="资产名称">
          </s-table-column>
          <s-table-column prop="ipaddr" label="IP地址">
          </s-table-column>
          <s-table-column label="操作" width="120">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="seeLogHandler(scope.row.deviceUuid)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <!--新增-->
    <s-dialog v-model="addDialog" v-if="addDialog" width="60%" title="添加">
      <config-add ref="configSave"></config-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveConfigTaskHandler">保存</s-button>
        <s-button type="cancel" @click="addDialog=false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog v-model="editDialog" v-if="editDialog" width="60%" title="修改">
      <config-add ref="configEdit" :editData="editData"></config-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="alterConfig">保存</s-button>
        <s-button type="cancel" @click="editDialog=false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看详情-->
    <s-dialog v-model="viewDialog" v-if="viewDialog" width="75%" title="查看详情">
      <log-View :deviceUuid="deviceUuid" @refreshParent="getLogLists()"></log-View>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  import logView from './LogViewDialog'
  import configAdd from './ConfigSaveDialog'
  // import relateDialog from './EquipmentRelate'
  export default {
    data() {
      return {
        lists: [],
        logLists: [],
        deviceUuid: '',
        viewDialog: false,
        addDialog: false,
        editDialog: false,
        editData: '',
        taskUuid: ''
      }
    },
    components: {

      logView,
      configAdd
      // relateDialog
    },
    created() {
      this.getLogLists()
      this.getLists()
    },
    methods: {
      getLists() {
        $axios.get('deviceConf/getNetTaskList').then((res) => {
          this.lists = res.data
        });
      },
      getLogLists() {
        $axios.get('deviceConf/getNetTaskLogList').then((res) => {
          this.logLists = res.data
        });
      },
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '添加',
            click() {
              self.addDialog = true
            },
            icon: 'plus'
          }]
        }
      },
      getNewSearchDef() {
        return {
          width: 3,
          offset: 15,
          placeholder: '查询条件',
          searchProps: ['taskName', 'userRealName', 'taskPeriodStr', 'beginTimeStr', 'endTimeStr', 'lastBackupDateStr', 'nextBackupDateStr']
        }
      },
      getLogSearchDef() {
        return {
          width: 3,
          offset: 21,
          placeholder: '查询条件',
          searchProps: ['itcompName', 'ipaddr']
        }
      },
      seeLogHandler(uuid) {
        this.viewDialog = true
        this.deviceUuid = uuid
      },
      editHandler(uuid) {
        $axios.get(`deviceConf/getNetSaveTaskByUuid/${uuid}`).then((res) => {
          this.editData = res.data
          this.editDialog = true
        })
      },
      delHandler(row) {
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`deviceConf/deleteNetSaveTask/${row.uuid}`, {
            data: [row],
            logTemplate: '删除|配置保存任务列表>设置任务(#taskName#)'
          }).then((res) => {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getLists()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败，请重试！'
              })
            }
          })
        }).catch(() => {});
      },
      saveConfigTaskHandler() {
        const form = this.$refs['configSave'].$refs['addForm']
        const formContent = this.$refs['configSave'].form
        const selection = this.$refs['configSave'].assetSelection
        let nowUuid = this.taskUuid
        if (selection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择资产'
          })
          return false
        }
        let saveParams = selection.map(function (v, i) {
          let temp = {
            taskUuid: nowUuid !== '' ? nowUuid : v.taskUuid,
            deviceUuid: v.deviceUuid,
            oldTaskUuid: v.oldTaskUuid,
            portUuid: v.portUuid,
            accountUuid: v.accountUuid,
            authAccountUuid: v.authAccountUuid
          }
          return temp
        })
        if (Date.parse(formContent.endTimeStr) - Date.parse(formContent.beginTimeStr) < 0 || Date.parse(formContent.endTimeStr) - Date.parse(new Date()) < 0) {
          this.$message({
            message: '结束时间必须大于开始时间及当前时间',
            type: 'warning'
          });
          return false
        }
        formContent.netDeviceInfoList = saveParams
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('deviceConf/saveNetTask', formContent, {
            data: [{name: formContent.taskName}],
            logTemplate: '添加|配置保存任务列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data.hasOwnProperty('success')) {
              this.taskUuid = res.data.taskUuid
              this.addDialog = false
              this.getLists()
            } else {
              this.$message({
                type: 'error',
                message: res.data.fail
              })
            }
          });
        })
      },
      alterConfig() {
        const form = this.$refs['configEdit'].$refs['addForm']
        const formContent = this.$refs['configEdit'].form
        const selection = this.$refs['configEdit'].assetSelection
        let nowUuid = this.taskUuid
        if (selection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择资产'
          })
          return false
        }
        let saveParams = selection.map(function (v, i) {
          let temp = {
            taskUuid: nowUuid !== '' ? nowUuid : v.taskUuid,
            deviceUuid: v.deviceUuid,
            oldTaskUuid: v.oldTaskUuid,
            portUuid: v.portUuid,
            accountUuid: v.accountUuid,
            authAccountUuid: v.authAccountUuid
          }
          return temp
        })
        if (Date.parse(formContent.endTimeStr) - Date.parse(formContent.beginTimeStr) < 0 || Date.parse(formContent.endTimeStr) - Date.parse(new Date()) < 0) {
          this.$message({
            message: '结束时间必须大于开始时间及当前时间',
            type: 'warning'
          });
          return false
        }
        formContent.netDeviceInfoList = saveParams
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('deviceConf/editSaveNetTask', formContent, {
            data: [{name: formContent.taskName}],
            logTemplate: '编辑|配置保存任务列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data.hasOwnProperty('success')) {
              this.$message({
                type: 'success',
                message: res.data.success
              })
              this.editDialog = false
              this.getLists()
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          });
        })
      }
    }
  }
</script>
