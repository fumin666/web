<template>
  <section id="change-pass-ctn">
    <s-tab id="change-pass" @on-click="tabClick">
      <s-tab-pane label="改密任务列表" class="taskListsTab">
        <s-row>
          <s-col :span="12">
            <s-button icon="plus" @click="addChangePass">添加</s-button>
            <s-button icon="batch-del" @click="batchDel">批量删除</s-button>
            <!--<s-button icon="import" @click="batchImport">导入</s-button>-->
            <s-button icon="export" @click="batchExport">导出</s-button>
          </s-col>
          <s-col :span="4" :offset="8">
            <s-input v-model="fuzzySearchKeyWord" placeholder="请输入查询条件" icon="magnifier" style="float: right;" @input="fuzzySearch"></s-input>
          </s-col>
        </s-row>
        <s-table-page
          id="changePassTable"
          :data='changePwdTaskLists'


          :header-search='getListSearchDef()'
          @selection-change="handleSelectionChange"
          row-class-name="changePassTableRow">
          <s-table-column type="selection" width="50" :selectable="changPwdSelectable"></s-table-column>
          <s-table-column prop="taskName" label="改密任务名称"></s-table-column>
          <s-table-column prop="periodStrTemp" label="改密任务周期"></s-table-column>
          <!--<s-table-column prop="firstFireTimeTemp" label="首次执行时间" sortable show-overflow-tooltip></s-table-column>-->
          <s-table-column prop="previousFireTimeTemp" label="上次执行时间" sortable show-overflow-tooltip></s-table-column>
          <s-table-column prop="nextChangeDateStr" label="下次执行时间" sortable show-overflow-tooltip></s-table-column>
          <s-table-column prop="userName" width="120" label="创建者"></s-table-column>
          <s-table-column prop="statusStr" width="80" label="状态"></s-table-column>
          <s-table-column label="操作" width="280" :show-overflow-tooltip="false">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="viewChangePassDetail(scope.row)"></i>
              <i class="iconfont icon-edit" title="编辑" @click="editChangePass(scope.row)"></i>
              <i class="iconfont icon-assist" title="立即发起" @click="immediatelyStart(scope.row)"></i>
              <i class="iconfont icon-activation" title="激活" @click="activeChangePass(scope.row)"></i>
              <i class="iconfont icon-approve" title="验证" @click="approveChangePass(scope.row)"></i>
              <i class="iconfont icon-export"
                 :class="{noDelete: scope.row.isDeleteLogo!==0}"
                 title="导出改密结果"
                 @click="exportChangePassResult(scope.row)"></i>
              <i class="iconfont icon-delete"
                 :class="{noDelete: scope.row.isDeleteLogo===0}"
                 title="删除"
                 @click="deleteChangePass(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="改密任务日志">
        <s-table-page
          :data='changeLogLists'

          :row-actions='changeLogRowActionsDef()'
          :header-search='getLogSearchDef()'>
          <s-table-column prop="taskName" label="任务名称"></s-table-column>
          <s-table-column prop="beginTime" label="开始时间"  sortable></s-table-column>
          <s-table-column prop="endTime" label="结束时间" sortable></s-table-column>
          <s-table-column prop="totalCnt" label="账号总数"></s-table-column>
          <s-table-column prop="successCnt" label="成功数量"></s-table-column>
          <s-table-column prop="failCnt" label="失败数量"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="验证密码日志">
        <s-table-page
          :data="cfmPassLogList"

          :row-actions='cfmPassRowActionsDef()'
          :header-search='getLogSearchDef()'>
          <s-table-column prop="taskName" label="任务名称"></s-table-column>
          <s-table-column prop="beginTime" label="开始时间"  sortable></s-table-column>
          <s-table-column prop="endTime" label="结束时间" sortable></s-table-column>
          <s-table-column prop="totalCnt" label="账号总数"></s-table-column>
          <s-table-column prop="successCnt" label="成功数量"></s-table-column>
          <s-table-column prop="failCnt" label="失败数量"></s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>

    <!--新增改密任务-->
    <s-dialog
      v-model="addDialogFlag"
      v-if="addDialogFlag"
      title="新增改密任务"
      width="900px"
      class="dialogFlag">
      <add-pass-task
        ref="addPassTask"
        @closeDialog="closeAddDialog"></add-pass-task>
    </s-dialog>
    <!--查看改密任务-->
    <s-dialog
      v-model="viewDialogFlag"
      v-if="viewDialogFlag"
      title="改密任务详情"
      class="dialogFlag">
      <view-pass-task
        ref="viewPassTask"
        :data="rowData"></view-pass-task>
    </s-dialog>
    <!--编辑改密任务-->
    <s-dialog
      v-model="editDialogFlag"
      v-if="editDialogFlag"
      title="编辑改密任务"
      width="900px"
      class="dialogFlag">
      <edit-pass-task
        ref="editPassTask"
        :originData="rowData"
        @closeDialog="closeEditDialog"></edit-pass-task>
    </s-dialog>
    <!--导出改密结果-->
    <s-dialog
      v-model="changePwdExportDialog"
      v-if="changePwdExportDialog"
      title="导出改密结果">
      <change-pwd-export :uuids="uuids" @closeExport="closeExport"></change-pwd-export>
    </s-dialog>
    <!--改密任务日志详情查看-->
    <s-dialog
      v-model="logDialogFlag"
      v-if="logDialogFlag"
      title="改密日志详情"
      class="dialogFlag"
      width="850px">
      <view-log-info :logInfo="changePassLogInfo"></view-log-info>
    </s-dialog>
    <!--验证密码日志详情查看-->
    <s-dialog
      v-model="cfmPassDialogFlag"
      v-if="cfmPassDialogFlag"
      title="验证日志详情"
      class="dialogFlag"
      width="850px">
      <view-cfm-pass :logInfo="cfmPassLogInfo"></view-cfm-pass>
    </s-dialog>
    <!--改密批量导入-->
    <s-dialog
      v-model="ImportChangePassDialog"
      v-if="ImportChangePassDialog"
      title="导入改密任务"
      class="dialogFlag">
      <import-change-pass
        @importChangePassSuccess="ImportChangePassDialog=false"></import-change-pass>
    </s-dialog>
    <!--<import-dialog
      v-model="ImportChangePassDialog"
      :uploadObj="uploadObj"
      :saveLog="true"
      :modelName="'导入改密任务'"
      :downObj="downObj"
      @reload="ChangePassTaskListsInit"
      :fileTypes="['xls', 'xlsx']"></import-dialog>-->
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  import addPassTask from '@/pages/Account_ChangePassword/AddChangePassTask.vue'
  import viewPassTask from '@/pages/Account_ChangePassword/ViewChangePassTask.vue'
  import editPassTask from '@/pages/Account_ChangePassword/EditChangePassTask.vue'
  import viewLogInfo from '@/pages/Account_ChangePassword/ViewChangePassLog.vue'
  import viewCfmPass from '@/pages/Account_ChangePassword/ViewCfmPassLog.vue'
  import ImportChangePass from '@/pages/Account_ChangePassword/ImportChangePass.vue'
  import ChangePwdExport from '@/pages/Account_ChangePassword/ChangePwdExport.vue'
  // import ImportDialog from '@/components/importDialog/ImportDialog';

  export default {
    data() {
      return {
        changePwdTaskLists: [],
        changePwdTaskListsOrigin: [], // 改密任务列表原始数据，查询使用
        fuzzySearchKeyWord: '',
        changeLogLists: [],
        cfmPassLogList: [],     // 验证密码日志列表
        logs: [],
        multipleSelection: [],
        total: 0,
        pageSize: 10,
        currentPage: 1,
        uuids: [],                // 改密结果导出弹框传参，关联账号的uuids
        rowData: {},              // table行内数据
        associationFreshLists: [],
        changePassLogInfo: {},    // 改密日志详情
        cfmPassLogInfo: {},       // 密码验证日志详情
        // 子组件Dialog v-model初始化
        addDialogFlag: false,     // 新增
        viewDialogFlag: false,    // 查看
        editDialogFlag: false,    // 编辑
        logDialogFlag: false,             // 改密任务日志详情
        cfmPassDialogFlag: false,         // 验证密码日志详情
        ImportChangePassDialog: false,    // 改密任务导入弹框
        changePwdExportDialog: false,     // 导出改密结果弹框
        uploadObj: {
          url: '/tPasswdChangeTask/importPasswordTask',
          type: 'post'
        },
        downObj: {
          url: '/tPasswdChangeTask/exportPasswordTaskTemplate',
          text: '批量改密任务导入模板'
        }
      }
    },
    components: {

      addPassTask,
      viewPassTask,
      editPassTask,
      viewLogInfo,
      viewCfmPass,
      ImportChangePass,
      ChangePwdExport
    },
    methods: {
      // tab标签点击切换
      tabClick(key) {
        switch (key) {
          case 0: this.ChangePassTaskListsInit()
            break
          case 1: this.changePassLogListsInit()
            break
          case 2: this.initCfmPassLogList()
            break
        }
      },
      // 表头添加操作
      addChangePass() {
        $axios.post(`/tPasswdChangeTask/editAccount/null/null`).then(({data}) => {
          if (data) {
            // eslint-disable-next-line
            let counter = 0;
            let allAccounts = data.allassetsAccountInfo;    // 所有资产账号心思
            let alreadyAccounts = data.assetsAccountInfoTworesult.map(item => item.uuid);   // 已关联其他改密任务的资产账号信息
            allAccounts.forEach((account, i) => {
              if (alreadyAccounts.indexOf(account.uuid) !== -1) counter++;
            });
            /**
            * 判断所有资产账号是否已被关联，
            * 若全部被关联，提示无法新增改密任务
            */
            if (counter >= allAccounts.length) {
              this.$message.warning('系统中无可关联的账号，无法创建改密任务！');
            } else {
              this.addDialogFlag = true;
            }
          }
        });
      },
      batchDel() {
        let self = this
        if (self.multipleSelection.length === 0) {
          self.$message({
            type: 'warning',
            message: '请至少选择一项改密任务！'
          })
        } else {
          self.$confirm('确定删除所选任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let logData = []
            let deleteArr = self.multipleSelection.map((item) => {
              logData.push({taskName: item.taskName})
              return item.uuid
            })
            $axios.post('/tPasswdChangeTask/deleteTPasswdChangeTask', deleteArr, {
              data: logData,
              logTemplate: '删除|改密任务列表>改密任务(#taskName#)'
            }).then((res) => {
              let resData = res.data
              if (resData === 'true') {
                self.ChangePassTaskListsInit()
                self.$message({
                  type: 'success',
                  message: '删除成功！'
                })
              } else {
                self.$message({
                  type: 'error',
                  message: '删除失败，请重试！'
                })
              }
            })
          }).catch(() => {})
        }
      },
      batchImport() {
        this.ImportChangePassDialog = true
      },
      batchExport() {
        Download('/tPasswdChangeTask/exportPasswordTask')
      },
      // 改密任务列表 表格搜索
      getListSearchDef() {
        return {
          show: false
        }
      },
      // 改密任务列表表头查询
      fuzzySearch() {
        let result = []
        let filterKeys = ['taskName', 'circleStrTemp', 'userName', 'statusStr']
        if (!this.fuzzySearchKeyWord.trim()) {
          this.changePwdTaskLists = this.changePwdTaskListsOrigin
          return
        }
        for (let i = 0; i < this.changePwdTaskListsOrigin.length; i++) {
          for (let key in this.changePwdTaskListsOrigin[i]) {
            if (filterKeys.indexOf(key) !== -1 && this.changePwdTaskListsOrigin[i][key] !== null) {
              if (this.changePwdTaskListsOrigin[i][key].toString().indexOf(this.fuzzySearchKeyWord.toString()) !== -1) {
                result.push(this.changePwdTaskListsOrigin[i])
                break
              }
            }
          }
        }
        this.changePwdTaskLists = result
      },
      // 改密任务是否可勾选
      changPwdSelectable(row, index) {
        return !(row.isDeleteLogo === 0)
      },
      /* ****改密任务列表表格操作按钮初始化**** */
      // 查看
      viewChangePassDetail(row) {
        this.rowData = row
        this.viewDialogFlag = true
      },
      // 编辑
      editChangePass(row) {
        this.rowData = row
        this.editDialogFlag = true
      },
      // 立即发起
      immediatelyStart(row) {
        let pwdUuid = row.uuid
        $axios.post(`/tPasswdChangeTask/editAccount/${pwdUuid}/null`).then((res) => {
          let accountRes = res.data
          if (accountRes.AssetsAccountInfo.length !== 0) {
            this.$confirm('确定发起该任务？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.loadingInstance = this.$loading({fullscreen: true, text: '发起改密任务请求中...'});
              $axios.get(`/tPasswdChangeTask/ModifyPassword/${pwdUuid}`, {
                data: [{taskName: row.taskName}],
                logTemplate: '立即发起|改密任务列表>改密任务(#taskName#)'
              }).then((res) => {
                this.loadingInstance.close();
                let resData = res.data
                if (resData === 'true') {
                  this.$message({
                    type: 'success',
                    message: '发起成功！'
                  })
                } else if (resData === 'false') {
                  this.$message({
                    type: 'error',
                    message: '发起失败，请重试！'
                  })
                } else if (resData === 'fail') {
                  this.$message({
                    type: 'warning',
                    message: '未关联账号，不能改密！'
                  })
                } else {
                  this.$message({
                    type: 'info',
                    message: resData
                  })
                }
              })
            }).catch(() => {})
          } else {
            this.$message({
              type: 'warning',
              message: '未关联账号，不能改密！'
            })
          }
        })
      },
      // 激活
      activeChangePass(row) {
        this.$confirm('确定激活该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let pwdUuid = row.uuid
          $axios.get(`/tPasswdChangeTask/editTPasswdstatus/${pwdUuid}`, {
            data: [{taskName: row.taskName}],
            logTemplate: '激活|改密任务列表>改密任务(#taskName#)'
          }).then((res) => {
            let resData = res.data
            if (resData === 'true') {
              this.ChangePassTaskListsInit()
              this.$message({
                type: 'success',
                message: '已激活！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '激活失败，请重试！'
              })
            }
          })
        }).catch(() => {})
      },
      // 验证
      approveChangePass(row) {
        this.$confirm('确定验证资产密码？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/tPasswdChangeTask/batchValidate/${row.uuid}`, {
            data: [{taskName: row.taskName}],
            logTemplate: '批量密码验证|改密任务列表>改密任务(#taskName#)'
          }).then(res => {
            let resData = res.data
            if (parseInt(resData) > 0) {
              this.$message({
                type: 'success',
                message: '验证任务已发起！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '验证任务发起失败，请重试！'
              })
            }
          })
        }).catch(() => {})
      },
      // 导出改密结果
      exportChangePassResult(row) {
        if (row.isDeleteLogo !== 0) return;
        $axios.post(`/tPasswdChangeTask/editAccount/${row.uuid}/null`).then(({data}) => {
          if (data.hasOwnProperty('AssetsAccountInfo') && data.AssetsAccountInfo instanceof Array) {
            this.uuids = data.AssetsAccountInfo.map(item => item.uuid);
            this.changePwdExportDialog = true;
          }
        });
      },
      // 关闭导出改密结果弹框
      closeExport() {
        this.ChangePassTaskListsInit();
        this.changePwdExportDialog = false;
      },
      // 删除
      deleteChangePass(row) {
        if (row.isDeleteLogo === 0) return
        this.$confirm('确定删除该任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let uuidArr = [row.uuid]
          $axios.post('/tPasswdChangeTask/deleteTPasswdChangeTask', uuidArr, {
            data: [{taskName: row.taskName}],
            logTemplate: '删除|改密任务列表>改密任务(#taskName#)'
          }).then((res) => {
            let resData = res.data
            if (resData === 'true') {
              this.ChangePassTaskListsInit()
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败，请重试！'
              })
            }
          })
        }).catch(() => {})
      },
      // 改密日志列表 表格搜索
      getLogSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'beginTime', 'endTime', 'deviceIp', 'accountName']
        }
      },
      // 改密日志列表-操作列查看功能
      changeLogRowActionsDef() {
        let vm = this;
        let def = [{
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.changePassLogInfo = row
            vm.logDialogFlag = true
          }
        }]
        return def
      },
      // 改密任务列表多选
      handleSelectionChange(val) {
        let slctSelf = this
        slctSelf.multipleSelection = []
        val.forEach((item) => {
          slctSelf.multipleSelection.push(item)
        })
      },
      // 改密任务列表数据初始化(刷新)
      ChangePassTaskListsInit() {
        $axios.get('/tPasswdChangeTask/list').then((res) => {
          let data = res.data;
          data.forEach((item) => {
            item.periodStrTemp = item.isPeriod ? item.periodStr || '-' : '-';
            item.firstFireTimeTemp = (item.tScheduleTime && item.tScheduleTime.firstFireTime) || '-';
            item.previousFireTimeTemp = (item.task && item.task.previousFireTime !== null) ? item.task.previousFireTime : '-';
            // item.nextChangeDateStrTemp = item.isPeriod ? item.nextChangeDateStr || '-' : '-';
          });
          this.changePwdTaskListsOrigin = data;
          this.changePwdTaskLists = data;
        })
      },
      // 改密日志列表初始化
      changePassLogListsInit() {
        $axios.get('/changePwdLog/listByDic/0').then((res) => {
          let logData = res.data
          this.changeLogLists = logData
        })
      },
      // 新增改密成功，刷新列表数据
      closeAddDialog() {
        this.ChangePassTaskListsInit();
        this.addDialogFlag = false;
      },
      // 改密任务编辑成功，刷新列表数据
      closeEditDialog() {
        this.ChangePassTaskListsInit();
        this.editDialogFlag = false;
      },
      // 验证密码日志 行内操作列初始化
      cfmPassRowActionsDef() {
        let vm = this;
        let def = [{
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.cfmPassLogInfo = row
            vm.cfmPassDialogFlag = true
          }
        }]
        return def
      },
      // 验证密码日志列表初始化/(刷新数据)
      initCfmPassLogList() {
        let vm = this
        $axios.get('/changePwdLog/listByDic/2').then(res => {
          let resData = res.data
          if (resData && resData instanceof Array) {
            vm.cfmPassLogList = resData
          }
        })
      }
    },
    created() {
      this.ChangePassTaskListsInit()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #change-pass-ctn
    #changePassTable
      .changePassTableRow
        .iconfont
          margin-right 10px
        .noDelete
          cursor not-allowed
          color #999999
</style>
