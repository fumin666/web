<!--
 * @Author: 高建鹏
 * @Date: 2019-05-16 09:15:28
 * @LastEditors  : mybells
 * @Description: 业务账号同步//Q4手风琴样式
 * @Position:
 -->
<template>
  <section class="fileList">
    <div v-if="notResultDetail">
      <s-row>
        <s-button icon="plus" @click="opentaskAddDialog">添加</s-button>
        <s-button icon="batch-del" @click="handleDeletes">批量删除</s-button>
      </s-row>
      <s-row>
        <s-form :inline="true" :model="searchForm" class="search_form" label-width="105px">
          <div>
            <s-form-item label="任务名称：">
              <s-input v-model="TaskSearchForm.taskName" style="width:200px;"></s-input>
            </s-form-item>
            <s-form-item label="任务周期：">
              <s-select v-model="TaskSearchForm.taskType" filterable clearable style="width:200px;">
                <s-option label="否" :value="0"></s-option>
                <s-option label="是" :value="1"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="状态：">
              <s-select v-model="TaskSearchForm.taskStatus" filterable clearable style="width:200px;">
                <s-option v-for="(item,index) in taskStatusList" :label="item.label" :value="item.value" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="创建者：">
              <s-input v-model="TaskSearchForm.createUserName" style="width:200px;"></s-input>
            </s-form-item>
            <s-form-item label="上次执行时间：">
              <date-range v-model="TaskSearchForm.previousFireTime"></date-range>
            </s-form-item>
            <s-form-item label="下次执行时间：">
              <date-range v-model="TaskSearchForm.nextFireTime"></date-range>
            </s-form-item>
            <s-form-item label=" 创建时间：">
              <date-range v-model="TaskSearchForm.createTime"></date-range>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" @click="getList">查询</s-button>
          </div>
        </s-form>
      </s-row>
      <s-table-page
        :data="timingData"
        @selection-change="handleSelection">
        <s-table-column type="selection" :selectable="rowSelectable"></s-table-column>
        <s-table-column label="任务名称" prop="taskName"></s-table-column>
        <s-table-column label="任务周期" prop="taskType">
          <template slot-scope="scope">
            <span v-if="scope.row.taskType===1">是</span>
            <span v-if="scope.row.taskType===0">否</span>
          </template>
        </s-table-column>
        <s-table-column label="上次执行时间" prop="previousFireTime" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.previousFireTime}}</span>
          </template>
        </s-table-column>
        <s-table-column label="下次执行时间" prop="nextFireTime" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.nextFireTime}}</span>
          </template>
        </s-table-column>
        <s-table-column label="状态" prop="taskStatus"></s-table-column>
        <s-table-column label="创建者" prop="createUserName"></s-table-column>
        <s-table-column label="创建时间" prop="createTime" width="180"></s-table-column>
        <s-table-column label="操作" width="190">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看定时任务" @click="scanTask(scope.row)" v-if="scope.row.taskStatus!=='已删除'"> </i>
            <i class="iconfont icon-pencil" title="编辑定时任务" @click="editTask(scope.row)" v-if="scope.row.taskStatus!=='已删除'"> </i>
            <i class="iconfont icon-eye" title="查看同步结果" @click="scanResult(scope.row)"></i>
            <i class="iconfont icon-delete" title="删除" @click="del(scope.row)" v-if="scope.row.taskStatus!=='已删除'&&scope.row.taskStatus!=='执行中'&&scope.row.taskStatus!=='已暂停'"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
    <div v-else>
      <BusinessSyncResultDialog ref="syncResult" :syncResultList="syncResultList" @back="notResultDetail=true"></BusinessSyncResultDialog>
    </div>
    <!--新增业务账号定时同步任务-->
    <s-dialog
      v-model="taskAdd"
      v-if="taskAdd"
      width="950px"
      title="新增同步任务">
      <Business-task-add-dialog ref="taskAdd" :emaillist="selectedEmailList" @showEmailM="bloomMyEmail = true" @showEmail="bloomLink = true"></Business-task-add-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">保存</s-button>
        <s-button type="cancel" @click="taskAdd = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑业务账号定时同步任务-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="950px"
      title="编辑同步任务">
      <Business-task-edit-dialog ref="taskEdit" :defaultData="rowData" :emaillist="selectedEmailList"  @showEmailM="bloomMyEmail = true" @showEmail="bloomLink = true"></Business-task-edit-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看业务账号定时同步任务-->
    <s-dialog
      v-model="seeDialog"
      v-if="seeDialog"
      width="950px"
      title="查看同步任务">
      <Business-task-edit-dialog ref="taskSee" type="see" :defaultData="rowData" :emaillist="selectedEmailList"></Business-task-edit-dialog>
    </s-dialog>
    <!--手动增加邮件-->
    <s-dialog
      v-model="bloomMyEmail"
      v-if="bloomMyEmail"
      title="手动添加邮件">
      <Business-add-email-m ref="addMyEmail"></Business-add-email-m>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addMyEmailOK">确定</s-button>
        <s-button type="cancel" @click="bloomMyEmail = false">取消</s-button>
      </template>
    </s-dialog>
    <!--引用邮件-->
    <s-dialog
      v-model="bloomLink"
      v-if="bloomLink"
      title="增加引用"
      width="800px">
      <s-scrollbar wrap-style="max-height: 600px;">
        <Business-add-email ref="linkEmail" :data="selectedEmailList"></Business-add-email>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="linkEmailOK">确定</s-button>
        <s-button type="cancel" @click="bloomLink = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import {intersectObj} from 'sunflower-common-utils'
  import { cloneDeep } from 'lodash'
  import $axios from 'sunflower-ajax';
  // import Bus from '@/plugins/eventBus'
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import DateRange from '@/components/tableCom/src/DateRange';
  import BusinessTaskAddDialog from './BusinessSyncDialog/BusinessTaskAdd.vue'
  import BusinessTaskEditDialog from './BusinessSyncDialog/BusinessTaskEdit.vue'
  import BusinessSyncResultDialog from './BusinessSyncDialog/BusinessSyncResult.vue'
  import BusinessAddEmailM from './BusinessSyncDialog/BusinessAddEmailM'
  import BusinessAddEmail from './BusinessSyncDialog/BusinessAddEmail'

  export default {
    data() {
      return {
        notResultDetail: true, // 当点击查看同步结果时隐藏当前页面显示同步结果页面
        taskAdd: false,
        editDialog: false,
        seeDialog: false,
        bloomMyEmail: false,
        bloomLink: false,
        timingData: [],
        selectionList: [],
        TaskSearchForm: {
          taskName: '',
          taskType: '',
          previousFireTime: [],
          nextFireTime: [],
          createUserName: '',
          createTime: [],
          taskStatus: '', // 1-新建，2-执行中，3-已完成，4-已删除，5-已暂停
          taskCategory: 3// 必传参数，表示业务账号同步任务,
        },
        syncResultList: [],
        selectedEmailList: [],
        rowData: {},
        taskStatusList: [ {label: '新建', value: 1}, {label: '执行中', value: 2}, {label: '已完成', value: 3}, {label: '已删除', value: 4}, {label: '已暂停', value: 5} ]
      }
    },
    components: {
      // SearchBox,
      BusinessTaskAddDialog,
      BusinessTaskEditDialog,
      BusinessSyncResultDialog,
      BusinessAddEmailM,
      BusinessAddEmail,
      DateRange
    },
    methods: {
      /* 本地搜索 */
      search() {

      },
      /* 获取列表数据 */
      getList() {
        let vm = this
        let form = cloneDeep(vm.TaskSearchForm)
        form.taskName = form.taskName ? form.taskName : null
        form.taskType = Number.isInteger(form.taskType) ? form.taskType : null
        form.createUserName = form.createUserName ? form.createUserName : null
        form.taskStatus = form.taskStatus ? form.taskStatus : null
        form.previousFireTime[0] = form.previousFireTime[0] ? new Date(form.previousFireTime[0]).getTime() / 1000 : 0
        form.previousFireTime[1] = form.previousFireTime[1] ? new Date(form.previousFireTime[1]).getTime() / 1000 : 0
        form.nextFireTime[0] = form.nextFireTime[0] ? new Date(form.nextFireTime[0]).getTime() / 1000 : 0
        form.nextFireTime[1] = form.nextFireTime[1] ? new Date(form.nextFireTime[1]).getTime() / 1000 : 0
        form.createTime[0] = form.createTime[0] ? new Date(form.createTime[0]).getTime() / 1000 : 0
        form.createTime[1] = form.createTime[1] ? new Date(form.createTime[1]).getTime() / 1000 : 0

        $axios.post('/commonTask/getTaskList', form).then((res) => {
          if (res.status === 200) {
            let arr = res.data;
            this.timingData = arr.map(function(obj) {
              obj.taskName = obj.commonTask.taskName;
              obj.taskType = obj.commonTask.taskType;
              obj.createUserName = obj.commonTask.createUserName;
              obj.taskStatus = obj.commonTask.taskStatus;
              obj.createTime = obj.commonTask.createTime;
              obj.previousFireTime = obj.tScheduleTask ? obj.tScheduleTask.previousFireTime : null;
              obj.nextFireTime = obj.tScheduleTask ? obj.tScheduleTask.nextFireTime : null;
              return obj;
            })
          }
        });
      },
      // 已删除的不能够选中
      rowSelectable(row, index) {
        return row.taskStatus !== '已删除' && row.taskStatus !== '执行中' && row.taskStatus !== '已暂停';
      },
      handleSelection (selection) {
        this.selectionList = selection
      },
      // 打开同步任务弹窗
      opentaskAddDialog() {
        this.selectedEmailList = [];
        this.taskAdd = true;
      },
      scanResult(row) {
        this.notResultDetail = false;
      },
      /* 查看定时任务 */
      scanTask(row) {
        this.rowData = row;
        let emailarr = row.noticesList ? row.noticesList : [];
        this.selectedEmailList = emailarr.map(function(item) {
          item.userEmail = item.noticeUserEmail;
          item.userName = item.noticeUserName;
          item.userUuid = item.noticeUserUuid;
          if (!item.noticeUserUuid) {
            item.tmp = true;
          }
          return item;
        })
        this.seeDialog = true;
      },
      editTask(row) {
        this.rowData = row;
        let emailarr = row.noticesList ? row.noticesList : [];
        this.selectedEmailList = emailarr.map(function(item) {
          item.userEmail = item.noticeUserEmail;
          item.userName = item.noticeUserName;
          item.userUuid = item.noticeUserUuid;
          if (!item.noticeUserUuid) {
            item.tmp = true;
          }
          return item;
        })
        this.editDialog = true;
      },
      del(row) {
          this.$confirm('确定删除选中数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/commonTask/deleteTask`, [row.commonTask.uuid], {
              data: [{name: row.commonTask.taskName}],
              logTemplate: '删除|业务账号同步任务(#name#)'
            }).then(({data}) => {
              if (data.state) {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          }).catch(() => {
          });
      },
      /* 保存新增的同步任务 */
      addOk() {
        let vm = this;
        /* 基础设定 */
        let newForm = vm.$refs['taskAdd'].collectTask;
        this.$refs['taskAdd'].$refs['baseForm'].validate((valid) => {
          if (!valid) {
            this.$refs['taskAdd'].activeName = '1'
            return false;
          }
          this.$refs['taskAdd'].$refs['period'].$refs['periodForm'].validate((valid) => {
            if (!valid) {
              this.$refs['taskAdd'].activeName = '1'
              return false;
            }
            let common = {
              taskName: '',
              taskType: '', // 任务类型 0非周期任务 1 周期任务
              taskCategory: 3, // 必传参数，表示业务账号同步任务,
              beginTime: '',
              endTime: '',
              remark: ''
            }
            let commonTask = intersectObj(common, newForm);
            let tScheduleTime = this.formattScheduleTime(newForm);
            // 选中的资产账号
            let relObjectUuidList = vm.$refs['taskAdd'].multipleSelection.map(function (value) {
              return value.uuid
            });
            /* email信息 */
            let emailarr = vm.$refs.taskAdd.listEmail;
            let commonTaskNoticeList = emailarr.map(function(item) {
              return {
                noticeUserName: item.userName,
                noticeUserEmail: item.userEmail,
                noticeUserUuid: item.userUuid
              }
            })
            if (vm.$refs['taskAdd'].openEmail === false) {
              commonTaskNoticeList = [];
            }
            let data = {
              commonTask: commonTask,
              tScheduleTime: tScheduleTime,
              relObjectUuidList: relObjectUuidList,
              commonTaskNoticeList: commonTaskNoticeList
            };
            $axios.post('/commonTask/addTask', data).then((res) => {
              if (res.data.state) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  });
                  this.getList();
                  this.taskAdd = false;
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
          })
        })
      },
      /* 保存编辑的同步任务 */
      editOk () {
        let vm = this;
        /* 基础设定 */
        let newForm = vm.$refs['taskEdit'].collectTask;
        this.$refs['taskEdit'].$refs['baseForm'].validate((valid) => {
          if (!valid) {
            this.$refs['taskEdit'].activeName = '1'
            return false;
          }
          this.$refs['taskEdit'].$refs['period'].$refs['periodForm'].validate((valid) => {
            if (!valid) {
              this.$refs['taskEdit'].activeName = '1'
              return false;
            }
            let common = {
              uuid: '',
              taskName: '',
              taskType: '', // 任务类型 0非周期任务 1 周期任务
              taskCategory: 3, // 必传参数，表示业务账号同步任务,
              beginTime: '',
              endTime: '',
              remark: ''
            }
            let commonTask = intersectObj(common, newForm);
            let tScheduleTime = this.formattScheduleTime(newForm);
            // 选中的资产账号
            let relObjectUuidList = vm.$refs['taskEdit'].multipleSelection.map(function (value) {
              return value.uuid
            });
            /* email信息 */
            let emailarr = vm.$refs.taskEdit.listEmail;
            let commonTaskNoticeList = emailarr.map(function(item) {
              return {
                noticeUserName: item.userName,
                noticeUserEmail: item.userEmail,
                noticeUserUuid: item.userUuid
              }
            })
            if (vm.$refs['taskEdit'].openEmail === false) {
              commonTaskNoticeList = [];
            }
            let data = {
              commonTask: commonTask,
              tScheduleTime: tScheduleTime,
              relObjectUuidList: relObjectUuidList,
              commonTaskNoticeList: commonTaskNoticeList
            };
            $axios.post('/commonTask/updateTask', data).then((res) => {
              if (res.data.state) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  });
                  this.getList();
                  this.editDialog = false;
              } else {
                this.$message.error(res.data.errorMsg);
              }
            })
          })
        })
      },
      /* 批量删除 */
      handleDeletes () {
        if (this.selectionList.length) {
          let uuidArr = this.selectionList.map(row => {
            return row.commonTask.uuid;
          })
          let dellist = this.selectionList.map(row => {
            return {name: row.commonTask.taskName};
          })
          this.$confirm('确定删除选中数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/commonTask/deleteTask`, uuidArr,
            {
              data: dellist,
              logTemplate: '删除|业务账号同步任务(#name#)'
            }).then(({data}) => {
              if (data.state) {
                this.$message({
                  type: 'success',
                  message: '删除成功！'
                })
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          }).catch(() => {
          });
        } else {
          this.$message({
            type: 'warning',
            message: '选择要删除的数据！'
          })
        }
      },
      /* 手动增加email */
      addMyEmailOK() {
        this.$refs.addMyEmail.$refs.myEmailForm.validate((valid) => {
          if (valid) {
            let newEmail = this.$refs.addMyEmail.myEmailForm;
            let oldEmail = this.selectedEmailList;
            for (let i in oldEmail) {
              if (oldEmail[i].userEmail === newEmail.userEmail) {
                this.$message({message: '不能添加相同的Email', type: 'warning'});
                return
              }
            }
            this.selectedEmailList.push(newEmail);
            this.bloomMyEmail = false;
          } else {
            return false;
          }
        });
      },
      /* 增加email引用 */
      linkEmailOK() {
        let _this = this;
        let newEmail = this.$refs.linkEmail.selectedUser;
        for (let i = 0; i < newEmail.length; i++) {
          if (!newEmail[i].userName) {
            newEmail[i].userName = newEmail[i].userRealName;
          }
          if (!newEmail[i].userEmail) {
            newEmail[i].userEmail = newEmail[i].userMail;
          }
          if (!newEmail[i].userUuid) {
            newEmail[i].userUuid = newEmail[i].uuid;
          }
        }
        let handleArr = this.selectedEmailList.filter(item => item.tmp)
        let autoArr = JSON.parse(JSON.stringify(newEmail));
        handleArr.forEach(function(obj1) {
          newEmail.forEach(function(obj2) {
              if (obj1.userEmail === obj2.userEmail) {
                _this.$message({message: `列表已存在邮箱${obj1.userEmail},不能添加相同的email`, type: 'warning'});
                autoArr = autoArr.filter(item => item.userEmail !== obj1.userEmail);
              }
          })
        })
        this.selectedEmailList = handleArr.concat(autoArr);
        this.bloomLink = false;
      },
      delNotNeedKey(arr, target) {
        for (var key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      formattScheduleTime(obj) {
        const notPeriod = ['timeType', 'firstFireTime']
        const dayKeys = ['timeType', 'firstFireTime', 'endFireTime', 'day']
        const dayKeysForever = ['timeType', 'firstFireTime', 'isForever', 'day']
        const weekKeys = ['timeType', 'firstFireTime', 'endFireTime', 'week', 'dayOfWeek']
        const weekKeysForever = ['timeType', 'firstFireTime', 'isForever', 'week', 'dayOfWeek']
        const monthKeys = ['timeType', 'firstFireTime', 'endFireTime', 'month', 'dayOfMonth']
        const monthKeysForever = ['timeType', 'firstFireTime', 'isForever', 'month', 'dayOfMonth']
        const yearKeys = ['timeType', 'firstFireTime', 'endFireTime', 'year', 'dayOfMonth', 'monthOfYear']
        const yearKeysForever = ['timeType', 'firstFireTime', 'isForever', 'year', 'dayOfMonth', 'monthOfYear']
        let newForm = cloneDeep(obj)
        if (newForm.taskType === 0) {
          newForm.tScheduleTime = this.delNotNeedKey(notPeriod, newForm.tScheduleTime)
          newForm.tScheduleTime.timeType = 7
        } else {
          let type = newForm.tScheduleTime.timeType
          let forever = newForm.tScheduleTime.isForever
          if (type === 1) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeys, newForm.tScheduleTime)
            }
          }
          if (type === 2) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeys, newForm.tScheduleTime)
            }
          }
          if (type === 3) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeys, newForm.tScheduleTime)
            }
          }
          if (type === 4) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeys, newForm.tScheduleTime)
            }
          }
        }
        for (let key in newForm.tScheduleTime) {
          // 转日期为int
          if ((key === 'firstFireTime' || key === 'endFireTime') && newForm.tScheduleTime[key] !== null) {
            newForm.tScheduleTime[key] = parseInt(new Date(newForm.tScheduleTime[key]).getTime() / 1000)
          }
          // 转数组为字符串
          if ((key === 'dayOfWeek' || key === 'dayOfMonth') && newForm.tScheduleTime[key].length > 0) {
            newForm.tScheduleTime[key] = newForm.tScheduleTime[key].join(',')
          }
          // 依据不同情况删除多余字段
        }
        return newForm.tScheduleTime
      }
    },
    created() {
      this.getList()
    }
  }
</script>
