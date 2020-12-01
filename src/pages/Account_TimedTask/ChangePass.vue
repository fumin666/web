<template>
  <section id="change-pass-ctn" class="login-set">
    <s-tab id="change-pass" @on-click="tabClick">
      <s-tab-pane label="改密任务列表" class="taskListsTab" v-if="judgeRoleBtn('accountManage_toCloseTaskList')">
        <s-row>
          <s-col :span="12">
            <s-button icon="plus" @click="addChangePass">添加</s-button>
            <s-button icon="batch-del" @click="batchDel">批量删除</s-button>
            <!--<s-button icon="import" @click="batchImport">导入</s-button>-->
            <s-button icon="export" @click="batchExport">导出</s-button>
          </s-col>
          <s-col :span="4" :offset="8">
            <s-input v-model="fuzzySearchKeyWord" placeholder="请输入查询条件" icon="magnifier" style="float: right;"
                     @input="fuzzySearch"></s-input>
          </s-col>
        </s-row>
        <s-table-page
          id="changePassTable"
          :data='changePwdTaskLists'
          v-loading='loading'
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
          <s-table-column label="操作" width="160" :show-overflow-tooltip="false">
            <template slot-scope="scope">
              <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>

      <s-tab-pane label="改密任务日志" v-if="judgeRoleBtn('accountManage_toCloseTaskLog')">
        <div style="margin-bottom: 15px">
          <s-form :inline="true" :model="searchForm" class="search_form" label-width='85px'>
            <div>
              <s-form-item label="任务名称：">
                <s-input v-model="searchForm.taskName"></s-input>
              </s-form-item>
              <s-form-item label="开始时间：">
                <s-date-picker v-model="searchForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                               format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false"
                               @change="getDateRangeStart">
                </s-date-picker>
                ~
                <s-date-picker v-model="searchForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                               format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false"
                               @change="getDateRangeEnd">
                </s-date-picker>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" title="查询" @click="changePassLogListsInit">查询</s-button>
            </div>
          </s-form>
        </div>
        <RealPageTable
          :ajax-obj="ajaxObjTask">
          <s-table-column prop="taskName" label="任务名称"></s-table-column>
          <s-table-column prop="beginTime" label="开始时间" sortable></s-table-column>
          <s-table-column prop="endTime" label="结束时间" sortable></s-table-column>
          <s-table-column prop="totalCnt" label="账号总数"></s-table-column>
          <s-table-column prop="successCnt" label="成功数量"></s-table-column>
          <s-table-column prop="failCnt" label="失败数量"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="viewTaskLog(scope.row)"> </i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
      <s-tab-pane label="验证密码日志" v-if="judgeRoleBtn('accountManage_verifyPasswordLog')">
        <div style="margin-bottom: 15px">
          <s-form :inline="true" :model="passForm" class="search_form" label-width='85px'>
            <div>
              <s-form-item label="任务名称：">
                <s-input v-model="passForm.taskName"></s-input>
              </s-form-item>
              <s-form-item label="开始时间：">
                <s-date-picker v-model="passForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                               format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false"
                               @change="getDateRangeStart1">
                </s-date-picker>
                ~
                <s-date-picker v-model="passForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                               format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false"
                               @change="getDateRangeEnd1">
                </s-date-picker>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" title="查询" @click="initCfmPassLogList">查询</s-button>
            </div>
          </s-form>
        </div>
        <RealPageTable
          :ajax-obj="ajaxObjPass">
          <s-table-column prop="taskName" label="任务名称"></s-table-column>
          <s-table-column prop="beginTime" label="开始时间" sortable></s-table-column>
          <s-table-column prop="endTime" label="结束时间" sortable></s-table-column>
          <s-table-column prop="totalCnt" label="账号总数"></s-table-column>
          <s-table-column prop="successCnt" label="成功数量"></s-table-column>
          <s-table-column prop="failCnt" label="失败数量"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="viewPassLog(scope.row)"> </i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
    </s-tab>

    <!--新增改密任务-->
    <s-dialog
      v-model="addDialogFlag"
      v-if="addDialogFlag"
      title="新增改密任务"
      width="980px"
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
      width="980px"
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

  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  import addPassTask from '@/pages/Account_ChangePassword/AddChangePassTask.vue'
  import viewPassTask from '@/pages/Account_ChangePassword/ViewChangePassTask.vue'
  import editPassTask from '@/pages/Account_ChangePassword/EditChangePassTask.vue'
  import viewLogInfo from '@/pages/Account_ChangePassword/ViewChangePassLog.vue'
  import viewCfmPass from '@/pages/Account_ChangePassword/ViewCfmPassLog.vue'
  import ImportChangePass from '@/pages/Account_ChangePassword/ImportChangePass.vue'
  import ChangePwdExport from '@/pages/Account_ChangePassword/ChangePwdExport.vue'
  // import ImportDialog from '@/components/importDialog/ImportDialog';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    props: {},
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
        },
        searchForm: {
          taskName: null,
          startTime: '',
          endTime: '',
          type: 0
        },
        passForm: {
          taskName: null,
          startTime: '',
          endTime: '',
          type: 2
        },
        tableOption: {// 操作栏配置项
          isHidden: true, // 是否开启隐藏
          appendId: '#changePassTable',
          showNum: 3// 超过3ge隐藏
        },
        loading: false,
        ajaxObjTask: {
          type: 'post',
          url: '/changePwdLog/list',
          params: {
            condition: {}
          }
        },
        ajaxObjPass: {
          type: 'post',
          url: '/changePwdLog/list',
          params: {
            condition: {}
          }
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
      ChangePwdExport,
      buttonSet,
      RealPageTable
    },
    methods: {
      btnData() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看',
            handler: function (row, scope) {
              vm.viewChangePassDetail(row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            handler: function (row, scope) {
              vm.editChangePass(row)
            }
          },
          {
            icon: 'delete',
            name: '删除',
            handler: function (row, scope) {
              vm.deleteChangePass(row)
            },
            v_if: function (row, scope) {
              return row.isDeleteLogo !== 0
            }
          },
          {
            icon: 'assist',
            name: '立即发起',
            handler: function (row, scope) {
              vm.immediatelyStart(row);
            }
          },
          {
            icon: 'activation',
            name: '激活',
            handler: function (row, scope) {
              vm.activeChangePass(row);
            }
          },
          {
            icon: 'approve',
            name: '验证',
            handler: function (row, scope) {
              vm.approveChangePass(row);
            }
          },
          {
            icon: 'export',
            name: '导出改密结果',
            handler: function (row, scope) {
              vm.exportChangePassResult(row);
            },
            v_if: function (row, scope) {
              return row.isDeleteLogo === 0
            }
          },
          {
            icon: 'export',
            name: '导出改密任务',
            handler: function (row) {
              vm.exportChangePassTask(row);
            }
          }
        ]
      },
      // tab标签点击切换
      tabClick(key) {
        this.searchForm = {
          taskName: null,
          startTime: '',
          endTime: '',
          type: 0
        };
        this.passForm = {
          taskName: null,
          startTime: '',
          endTime: '',
          type: 2
        };
        switch (key) {
          case 0:
            this.ChangePassTaskListsInit()
            break
          case 1:
            this.changePassLogListsInit()
            break
          case 2:
            this.initCfmPassLogList()
            break
        }
      },
      // 表头添加操作
      addChangePass() {
        $axios.post(`tPasswdChangeTask/isCanAddPasswdTask`).then(({data}) => {
          if (data) {
            this.addDialogFlag = true;
          } else {
            this.$message.warning('系统中无可关联的账号，无法创建改密任务！');
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
          }).catch(() => {
          })
        }
      },
      batchImport() {
        this.ImportChangePassDialog = true
      },
      batchExport() {
        Download('/tPasswdChangeTask/exportPasswordTask')
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
        $axios.post(`/tPasswdChangeTask/getAccountInfoByPasswdTask/${pwdUuid}`).then((res) => {
          if (res.data.length !== 0) {
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
            }).catch(() => {
            })
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
        }).catch(() => {
        })
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
        }).catch(() => {
        })
      },
      // 导出改密结果
      exportChangePassResult(row) {
        if (row.isDeleteLogo !== 0) return;
        $axios.post(`/tPasswdChangeTask/getAccountInfoByPasswdTask/${row.uuid}`).then(({data}) => {
          if (data.length !== 0) {
            this.uuids = data.map(item => item.uuid);
            this.changePwdExportDialog = true;
          }
        });
      },
      // 关闭导出改密结果弹框
      closeExport() {
        this.ChangePassTaskListsInit();
        this.changePwdExportDialog = false;
      },
      exportChangePassTask(row) {
        Download(`/tPasswdChangeTask/exportSinglePasswordTask/${row.uuid}`);
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
        }).catch(() => {
        })
      },
      // 改密日志列表-操作列查看功能
      viewTaskLog(row) {
        this.changePassLogInfo = row
        this.logDialogFlag = true
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
        this.loading = true
        $axios.get('/tPasswdChangeTask/list').then((res) => {
          let data = res.data;
          this.loading = false
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
        let params = Object.assign({}, this.searchForm)
        params.startTime = params.startTime !== null ? new Date(this.searchForm.startTime).getTime() / 1000 : null
        params.endTime = params.endTime !== null ? new Date(this.searchForm.endTime).getTime() / 1000 : null
        this.ajaxObjTask.params.condition = params;
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
      viewPassLog(row) {
        this.cfmPassLogInfo = row
        this.cfmPassDialogFlag = true
      },
      // 验证密码日志列表初始化/(刷新数据)
      initCfmPassLogList() {
        let vm = this
        let params = Object.assign({}, vm.passForm)
        params.startTime = params.startTime !== null ? new Date(vm.passForm.startTime).getTime() / 1000 : null
        params.endTime = params.endTime !== null ? new Date(vm.passForm.endTime).getTime() / 1000 : null
        this.ajaxObjPass.params.condition = params;
      },
      getDateRangeStart() {
        let start = this.searchForm.startTime ? new Date(this.searchForm.startTime).getTime() / 1000 : 0
        let end = this.searchForm.endTime ? new Date(this.searchForm.endTime).getTime() / 1000 : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.startTime = '';
          }
        }
      },
      getDateRangeEnd() {
        let start = this.searchForm.startTime ? new Date(this.searchForm.startTime).getTime() / 1000 : 0
        let end = this.searchForm.endTime ? new Date(this.searchForm.endTime).getTime() / 1000 : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.endTime = '';
          }
        }
      },
      getDateRangeStart1() {
        let start = this.passForm.startTime ? new Date(this.passForm.startTime).getTime() / 1000 : 0
        let end = this.passForm.endTime ? new Date(this.passForm.endTime).getTime() / 1000 : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.passForm.startTime = '';
          }
        }
      },
      getDateRangeEnd1() {
        let start = this.passForm.startTime ? new Date(this.passForm.startTime).getTime() / 1000 : 0
        let end = this.passForm.endTime ? new Date(this.passForm.endTime).getTime() / 1000 : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.passForm.endTime = '';
          }
        }
      }
    },
    created() {
      console.log(this.searchForm);
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
