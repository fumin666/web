<template>
  <section class="content">
    <s-form ref="searchBox" :inline="true" :model="searchForm" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="任务名称:">
          <s-input @keyup.enter.native="search" v-model="searchForm.reportSendTaskName"></s-input>
        </s-form-item>
        <s-form-item label="是否周期任务:">
          <s-select v-model="searchForm.isPeriodicTask" clearable>
            <s-option :value="1" label="是"></s-option>
            <s-option :value="0" label="否"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="周期类型:">
          <s-select v-model="searchForm.timeType" clearable>
            <s-option :value="1" label="日"></s-option>
            <s-option :value="2" label="周"></s-option>
            <s-option :value="3" label="月"></s-option>
            <s-option :value="4" label="年"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="创建者:">
          <s-input @keyup.enter.native="search" v-model="searchForm.createUserName"></s-input>
        </s-form-item>
        <s-form-item label="上次执行时间:">
          <s-date-picker v-model="period" style="width: 320px!important;" type="datetimerange" placeholder="选择时间范围">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
      </div>
    </s-form>
    <s-row>
      <s-button icon="plus" @click="addTaskDialog = true">添加</s-button>
      <s-button icon="batch-del" @click="deleteBatchTask">批量删除</s-button>
    </s-row>
    <s-table-page
      :data="taskList"
      @selection-change="handleClientSelect">
      <s-table-column type="selection"></s-table-column>
      <s-table-column prop="tReportSendTask.reportSendTaskName" label="任务名称"></s-table-column>
      <s-table-column label="是否周期任务">
        <template slot-scope="scope">
          <span v-if="scope.row.tReportSendTask.isPeriodicTask === 1">是</span>
          <span v-else>否</span>
        </template>
      </s-table-column>
      <s-table-column label="定时发送周期">
        <template slot-scope="scope">
          <span v-if="scope.row.tScheduleTime.timeType === 1">日</span>
          <span v-else-if="scope.row.tScheduleTime.timeType === 2">周</span>
          <span v-else-if="scope.row.tScheduleTime.timeType === 3">月</span>
          <span  v-else-if="scope.row.tScheduleTime.timeType === 4">年</span>
          <span v-else>无</span>
        </template>
      </s-table-column>
      <s-table-column prop="tScheduleTask.previousFireTime" label="上次执行时间"></s-table-column>
      <s-table-column prop="tScheduleTask.nextFireTime" label="下次执行时间">
        <template slot-scope="scope">
          <span v-if="scope.row.tScheduleTask.isPaused === 0">{{scope.row.tScheduleTask.nextFireTime}}</span>
          <span v-else-if="scope.row.tScheduleTask.isPaused === 1">- -</span>
        </template>
      </s-table-column>
      <s-table-column prop="tReportSendTask.createUserName" label="创建者"></s-table-column>
      <s-table-column prop="tReportSendTask.createTime" label="创建时间">
      </s-table-column>
      <s-table-column label="操作" width="240">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="checkTask(scope.row)"></i>
          <i class="iconfont icon-start" title="启动" v-if="scope.row.tReportSendTask.isPeriodicTask && scope.row.tScheduleTask.isPaused" @click="startTask(scope.row)"></i>
          <i class="iconfont icon-pause" title="暂停" v-if="scope.row.tReportSendTask.isPeriodicTask && !scope.row.tScheduleTask.isPaused && scope.row.tScheduleTask.nextFireTime" @click="pauseTask(scope.row)"></i>
          <i class="iconfont icon-edit" title="编辑" @click="editTask(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="deleteTask(scope.row.tReportSendTask.uuid)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加任务-->
    <s-dialog v-model="addTaskDialog" v-if="addTaskDialog" title="添加" width="800px">
      <add-task ref="addtask"></add-task>
      <template slot="footer">
        <s-button :disabled="addDisabled" @click="addTaskOk()">确定</s-button>
        <s-button type="cancel" @click="addTaskDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看任务-->
    <s-dialog v-model="checkTaskDialog" v-if="checkTaskDialog" title="查看" width="800px">
      <view-task ref="checktask" :currentData="currentData"></view-task>
    </s-dialog>
    <!--编辑任务-->
    <s-dialog v-model="editTaskDialog" v-if="editTaskDialog" title="编辑" width="800px">
      <add-task ref="edittask" :currentData="currentData"></add-task>
      <template slot="footer">
        <s-button :disabled="editDisabled" @click="editTaskOk">确定</s-button>
        <s-button type="cancel" @click="editTaskDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import AddTask from './AddTask.vue'
  import ViewTask from './ViewTask.vue'
  import { cloneDeep } from 'lodash'
  import { getTime } from 'sunflower-common-utils'
  export default {
    data() {
      return {
        taskList: [],
        addDisabled: false,
        editDisabled: false,
        searchForm: {
          reportSendTaskName: '',
          isPeriodicTask: null,
          createUserName: '',
          timeType: null,
          startTime: null,
          endTime: null,
          taskOrigin: 1
        },
        period: '',
        addTaskDialog: false,
        selectionList: [],
        checkTaskDialog: false,
        editTaskDialog: false,
        currentData: {},
        isPause: false
      }
    },
    components: {
      // SearchBox,
      AddTask,
      ViewTask
    },
    methods: {
      checkTask(row) {
        let vm = this
        vm.checkTaskDialog = true
        vm.currentData = cloneDeep(row)
        // 构造接口所需参数格式
        vm.currentData.tReportSendTaskNoticeList = row.tReportSendTaskNoticeList.map((item) => {
          let {
            noticeUserName,
            noticeUserEmail,
            uuid
          } = item
          let obj = {
            userRealName: noticeUserName,
            userMail: noticeUserEmail,
            uuid: uuid
          }
          return obj
        })
      },
      pauseTask(row) {
        let vm = this
        $axios.get(`/logCenterIndex/pauseReportSendTask/${row.tReportSendTask.uuid}`).then(res => {
          if (res.data.state === true) {
            vm.$message({
              type: 'success',
              message: '暂停成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.errormsg
            })
          }
        })
      },
      startTask(row) {
        let vm = this
        $axios.get(`/logCenterIndex/resumeReportSendTask/${row.tReportSendTask.uuid}`).then(res => {
          if (res.data.state === true) {
            vm.$message({
              type: 'success',
              message: '恢复成功'
            })
            vm.getList()
          } else {
            vm.$message({
              type: 'error',
              message: res.data.errormsg
            })
          }
        })
      },
      editTask(row) {
        let vm = this
        vm.editTaskDialog = true
        vm.currentData = cloneDeep(row);
        // 构造接口所需参数格式
        vm.currentData.tReportSendTaskNoticeList = row.tReportSendTaskNoticeList.map((item) => {
          let {
            noticeUserName,
            noticeUserEmail,
            noticeUserUuid
          } = item
          let obj = {
            userRealName: noticeUserName,
            userMail: noticeUserEmail,
            uuid: noticeUserUuid
          }
          return obj
        })
      },
      deleteTask(uuid) {
        let uuidList = []
        if (uuid instanceof Array) {
          uuidList = uuid
        } else {
          uuidList.push(uuid)
        }
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/logCenterIndex/batchDelReportSendTask', uuidList).then((res) => {
            if (res.data.state === true) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.errormsg
              })
            }
          })
        }).catch(() => {});
      },
      deleteBatchTask() {
        if (this.selectionList.length < 1) {
          this.$message({
            type: 'info',
            message: '请选择要删除的数据'
          });
        } else {
          let uuidList = this.selectionList.map(item => item.tReportSendTask.uuid);
          this.deleteTask(uuidList);
        }
      },
      handleClientSelect(val) {
        this.selectionList = val
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
        if (newForm.tReportSendTask.isPeriodicTask === 0) {
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
        return newForm
      },
      delNotNeedKey(arr, target) {
        for (let key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      getTimes(val) {
        return getTime(val)
      },
      addTaskOk() {
        // 构造接口所需参数格式
        this.addDisabled = true
        var baseForm = cloneDeep(this.$refs.addtask.baseForm)
        baseForm.tReportSendTaskNotices = this.$refs.addtask.tReportSendTaskNotices.map((item) => {
          let {
            userMail,
            userRealName,
            uuid
          } = item
          let obj = {
            noticeUserName: userRealName,
            noticeUserEmail: userMail
          }
          if (uuid) {
            obj.noticeUserUuid = uuid
          } else {
            obj.noticeUserUuid = ''
          }
          return obj
        })
        let arr = []
        if (this.$refs.edittask) {
          this.$refs.edittask.baseForm.reportTypeUuidList.map((item, index) => {
            if (item.indexOf('reportmodule') === -1) {
              arr.push(item)
            }
          })
        }
        this.$refs.addtask.$refs.tReportSendTaskForm.validate((valid) => {
          if (valid) {
            this.$refs.addtask.$refs.period.$refs.periodForm.validate((v) => {
              if (v) {
                if (baseForm.reportTypeUuidList.length > 0) {
                  if (baseForm.tReportSendTaskNotices.length > 0) {
                    $axios.post('/logCenterIndex/isTrigger', this.formattScheduleTime(baseForm)).then((res) => {
                      if (res.data.state === true) {
                        $axios.post('/logCenterIndex/saveReportSendTask', this.formattScheduleTime(baseForm)).then((res) => {
                          if (res.data.state === true) {
                            this.$message({
                              message: '添加成功',
                              type: 'success'
                            })
                            this.addTaskDialog = false
                            this.getList()
                          } else {
                            this.$message({
                              message: res.data.errormsg,
                              type: 'error'
                            })
                          }
                          this.addDisabled = false
                        })
                      } else {
                        this.addDisabled = false
                        this.$message({
                          message: res.data.errormsg,
                          type: 'error'
                        })
                      }
                    })
                  } else {
                    this.addDisabled = false
                    this.$refs.addtask.activeNames = 'type'
                    this.$message({
                      message: '请先选择通知对象',
                      type: 'error'
                    })
                  }
                } else {
                  this.addDisabled = false
                  this.$refs.addtask.activeNames = 'select'
                  this.$message({
                    message: '请先选择报表',
                    type: 'error'
                  })
                }
              } else {
                this.addDisabled = false
                this.$refs.addtask.activeNames = 'base'
                this.$message({
                  message: '请先选择正确的时间',
                  type: 'error'
                })
              }
            })
          } else {
            this.addDisabled = false
            this.$refs.addtask.activeNames = 'base'
            this.$message({
              message: '请先填写任务名称',
              type: 'error'
            })
          }
        })
      },
      editTaskOk() {
        // 构造接口所需参数格式
        this.editDisabled = true
        var baseForm = cloneDeep(this.$refs.edittask.baseForm)
        baseForm.tReportSendTaskNotices = this.$refs.edittask.tReportSendTaskNotices.map((item) => {
          let {
            userMail,
            userRealName,
            uuid
          } = item
          let obj = {
            noticeUserName: userRealName,
            noticeUserEmail: userMail
          }
          if (uuid) {
            obj.noticeUserUuid = uuid
          } else {
            obj.noticeUserUuid = ''
          }
          return obj
        })
        let arr = []
        this.$refs.edittask.baseForm.reportTypeUuidList.map((item, index) => {
          if (item.indexOf('reportmodule') === -1) {
            arr.push(item)
          }
        })
        baseForm.reportTypeUuidList = arr
        this.$refs.edittask.$refs.tReportSendTaskForm.validate((valid) => {
          if (valid) {
            this.$refs.edittask.$refs.period.$refs.periodForm.validate((v) => {
              if (v) {
                if (baseForm.reportTypeUuidList.length > 0) {
                  if (baseForm.tReportSendTaskNotices.length > 0) {
                    $axios.post('/logCenterIndex/isTrigger', this.formattScheduleTime(baseForm)).then((res) => {
                      if (res.data.state === true) {
                        $axios.post('/logCenterIndex/updateReportSendTask', this.formattScheduleTime(baseForm)).then((res) => {
                          if (res.data.state === true) {
                            this.$message({
                              message: '编辑成功',
                              type: 'success'
                            })
                            this.editDisabled = false
                            this.editTaskDialog = false
                            this.getList()
                          } else {
                            this.editDisabled = false
                            this.$message({
                              message: res.data.errormsg,
                              type: 'error'
                            })
                          }
                        })
                      } else {
                        this.editDisabled = false
                        this.$message({
                          message: res.data.errormsg,
                          type: 'error'
                        })
                      }
                    })
                  } else {
                    this.editDisabled = false
                    this.$refs.edittask.activeNames = 'type'
                    this.$message({
                      message: '请先选择通知对象',
                      type: 'error'
                    })
                  }
                } else {
                  this.editDisabled = false
                  this.$refs.edittask.activeNames = 'select'
                  this.$message({
                    message: '请先选择报表',
                    type: 'error'
                  })
                }
              } else {
                this.editDisabled = false
                this.$refs.edittask.activeNames = 'base'
                this.$message({
                  message: '请先选择正确的时间',
                  type: 'error'
                })
              }
            })
          } else {
            this.editDisabled = false
            this.$refs.edittask.activeNames = 'base'
            this.$message({
              message: '请先填写任务名称',
              type: 'error'
            })
          }
        })
      },
      getTime(str) {
        if (!str) return '';
        return window.parseInt((new Date(str).getTime()) / 1000);
      },
      getList() {
        this.period = this.period == null ? '' : this.period;
        this.searchForm.isPeriodicTask = this.searchForm.isPeriodicTask === '' ? null : this.searchForm.isPeriodicTask;
        this.searchForm.startTime = this.getTime(this.period[0]) !== '' ? this.getTime(this.period[0]) : null;
        this.searchForm.endTime = this.getTime(this.period[1]) !== '' ? this.getTime(this.period[1]) : null;
        $axios.post('/logCenterIndex/getReportSendTaskList', this.searchForm).then((res) => {
          if (res.data && res.data.length >= 0) {
            this.taskList = res.data
          }
        })
      }
    },
    mounted() {},
    created() {
      this.getList()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
