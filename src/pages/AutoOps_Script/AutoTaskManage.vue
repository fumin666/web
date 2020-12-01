<template>
  <section class="autoTask" style="margin-top: 15px;">
    <s-tab type="card" v-model="activeName">
      <s-tab-pane label="单次任务" name="singleTask">
        <div class="runScript">
          <s-button icon="carry-out" @click="runScriptBloom = true">执行脚本</s-button>
          <s-button icon="cloud" @click="uploadScriptBloom = true">脚本上传与分发</s-button>
        </div>
        <div class="inputWrap" style="position: relative;margin-top: -48px;">
          <s-input v-model="assetsSearchKey" @keyup.enter.native="getInterimListData" placeholder="请输入内容" class="real-search-input" style="margin-bottom: 10px;"></s-input>
          <span class="realPageSearch" style="padding-top: 4px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getInterimListData"></i></span>
        </div>
        <RealPageTable :ajax-obj="ajaxObj" @filter-change="filterType">
          <s-table-column prop="taskName" label="任务名称"></s-table-column>
          <s-table-column prop="taskType" column-key="taskType" :filters="filters" label="任务类型" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.taskType === 1">脚本执行</span>
              <span v-if="scope.row.taskType === 2">脚本分发</span>
            </template>
          </s-table-column>
          <s-table-column prop="taskStatus" column-key="taskStatus" :filters="filtersState" label="状态" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus === 2">进行中</span>
              <span v-if="scope.row.taskStatus === 3">已完成</span>
            </template>
          </s-table-column>
          <s-table-column prop="createUserName" label="创建人"></s-table-column>
          <s-table-column prop="createTime" label="创建时间"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="checkInterimHandle(scope.row)" title="查看"></i>
              <i v-if="scope.row.taskStatus === 3" class="iconfont icon-delete" @click="deleteSingleTask(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
      <s-tab-pane label="周期任务" name="periodicTasks">
        <div class="runScript">
          <s-button icon="plus" @click="createTaskBloom = true">新建任务</s-button>
          <s-button icon="refresh-circle" @click="getData()">刷新</s-button>
        </div>
        <div class="inputWrap" style="position: relative;margin-top: -48px;">
          <s-input v-model="searchKey" @keyup.enter.native="getData" placeholder="请输入内容" class="real-search-input" style="margin-bottom: 10px;"></s-input>
          <span class="realPageSearch" style="padding-top: 4px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getData"></i></span>
        </div>
        <RealPageTable :ajax-obj="ajaxCircleObj" @filter-change="filterType1">
          <s-table-column prop="taskName" label="任务名称">
            <template slot-scope="scope">
              <a @click="viewTaskHandler(scope.row)" style="color:#199fed;cursor: pointer;">{{scope.row.taskName}}</a>
            </template>
          </s-table-column>
          <s-table-column prop="timeTypeStr" label="任务周期"></s-table-column>
          <s-table-column prop="priority" column-key="priority" :filters="filters1" label="优先级">
            <template slot-scope="scope">
              <span v-if="scope.row.priority === 1">高</span>
              <span v-if="scope.row.priority === 2">中</span>
              <span v-if="scope.row.priority === 3">低</span>
            </template>
          </s-table-column>
          <s-table-column prop="previousFireTime" label="上次执行时间"></s-table-column>
          <s-table-column prop="nextFireTime" label="下次执行时间">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus !== 3">{{scope.row.nextFireTime}}</span>
              <span v-else-if="scope.row.taskStatus === 3">- -</span>
            </template>
          </s-table-column>
          <s-table-column prop="taskStatus" column-key="taskStatus" :filters="filtersState1" label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.taskStatus === 1">新建</span>
              <span v-if="scope.row.taskStatus === 2">进行中</span>
              <span v-if="scope.row.taskStatus === 3">已完成</span>
              <span v-if="scope.row.taskStatus === 5">已暂停</span>
            </template>
          </s-table-column>
          <s-table-column prop="scriptLibName" label="脚本库名称"></s-table-column>
          <s-table-column prop="createUserName" label="创建人"></s-table-column>
          <s-table-column prop="createTime" label="创建时间"></s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <!--新建1：编辑、执行、删除、查看-->
              <!--执行中2：暂停、删除、查看-->
              <!--已完成3：删除、查看-->
              <!--已删除：无-->
              <!--已暂停5：执行、删除、查看-->
              <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="runScriptBloom"
      v-if="runScriptBloom"
      width="650px"
      title="脚本执行">
      <run-script ref="createtask" @cancelRun="cancelRun"></run-script>
    </s-dialog>
    <s-dialog
      v-model="checkTaskBloom"
      v-if="checkTaskBloom"
      width="900px"
      title="查看任务">
      <!--<create-task ref="checktask" :current="current"></create-task>-->
      <check-task :currentRow="currentRow"></check-task>
    </s-dialog>
    <s-dialog
      v-model="createTaskBloom"
      v-if="createTaskBloom"
      width="650px"
      title="新建任务">
      <create-task ref="createtask"></create-task>
      <template slot="footer">
        <s-button @click="createTaskOk">确定</s-button>
        <s-button @click="createTaskBloom = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="editTaskBloom"
      v-if="editTaskBloom"
      width="650px"
      title="编辑任务">
      <create-task ref="edittask" :current="current"></create-task>
      <template slot="footer">
        <s-button @click="editTaskOk">确定</s-button>
        <s-button @click="editTaskBloom = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="viewTaskBloom"
      v-if="viewTaskBloom"
      width="650px"
      title="查看任务">
      <view-task :current="current"></view-task>
    </s-dialog>
    <s-dialog
      v-model="uploadScriptBloom"
      v-if="uploadScriptBloom"
      width="750px"
      title="脚本上传与分发">
      <upload-script @cancelUpload="cancelUpload"></upload-script>
    </s-dialog>
    <s-dialog
      v-model="interimTaskBloom"
      v-if="interimTaskBloom"
      width="950px"
      title="脚本执行详情">
      <script-execute ref="scriptexecute" :executeResult="scriptExeParam" :multipleSelectionHost="[]" :showDialog="true"></script-execute>
    </s-dialog>
    <s-dialog
      v-model="interimUploadBloom"
      v-if="interimUploadBloom"
      width="950px"
      title="脚本上传与分发执行结果详情">
      <share-execute ref="shareexecute" :executeResult="scriptExeParam" :multipleSelectionHost="[]" :showDialog="true"></share-execute>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  import $axios from 'sunflower-ajax'
  import createTask from './CreateTask.vue'
  import ViewTask from './ViewTask.vue'
  import RunScript from './RunScript.vue'
  import UploadScript from './UploadScript.vue'
  import checkTask from './CheckTask.vue'
  import ScriptExecute from './ScriptExecute.vue'
  import shareExecute from './ShareExecute.vue'
  // import { sTimeLine, sTimeLineItem } from '@/components/timeline'
  import { cloneDeep } from 'lodash'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      createTask,
      ViewTask,
      buttonSet,
      RunScript,
      UploadScript,
      checkTask,
      ScriptExecute,
      shareExecute,
      // sTimeLine,
      RealPageTable
      // sTimeLineItem
    },
    data () {
      return {
        taskForm: {
          state: ''
        },
        tableOption: {
          isHidden: true,
          showNum: 3,
          appendId: '.s-table-column',
          trigger: 'click',
          placement: 'left'
        },
        stateList: [],
        assetsSearchKey: '',
        searchKey: '',
        ajaxObj: {
          type: 'post',
          url: '/immediateExcuteTask/searchImmediateTask',
          params: {
            condition: {
            }
          }
        },
        ajaxCircleObj: {
          type: 'post',
          url: '/autoScriptTask/searchAutoScriptTask',
          params: {
            condition: {
            }
          }
        },
        current: [],
        currentRow: '',
        createTaskBloom: false,
        runScriptBloom: false,
        checkTaskBloom: false,
        editTaskBloom: false,
        uploadScriptBloom: false,
        interimTaskBloom: false,
        interimUploadBloom: false,
        viewTaskBloom: false,
        scriptExeParam: {},
        filters: [
          {text: '脚本执行', value: 1},
          {text: '脚本分发', value: 2}
        ],
        filters1: [
          {text: '高', value: 1},
          {text: '中', value: 2},
          {text: '低', value: 3}
        ],
        filtersState: [
          {text: '进行中', value: 2},
          {text: '已完成', value: 3}
        ],
        filtersState1: [
          {text: '新建', value: 1},
          {text: '进行中', value: 2},
          {text: '已完成', value: 3},
          {text: '已暂停', value: 5}
        ],
        activeName: 'singleTask',
        taskType: [1, 2],
        taskStatus: [2, 3],
        priorityList: [1, 2, 3],
        taskStatusList: [1, 2, 3, 5]
      }
    },
    methods: {
      btnData() {
        let vm = this;
        return [
          {
            icon: 'edit',
            name: '编辑',
            handler: function (row, scope) {
              vm.editttHandle(row)
            },
            v_if: function (row, scope) {
              return row.taskStatus === 1
            }
          },
          {
            icon: 'pause',
            name: '暂停',
            handler: function (row, scope) {
              vm.pauseHandle(row)
            },
            v_if: function (row, scope) {
              return row.taskStatus === 2
            }
          },
          {
            icon: 'carry-out',
            title: '执行',
            handler: function (row, scope) {
              vm.startHandle(row);
            },
            v_if: function (row, scope) {
              return (row.taskStatus === 5)
            }
          },
          {
            icon: 'eye',
            name: '查看',
            handler: function (row, scope) {
              vm.checkHandle(row)
            },
            v_if: function (row, scope) {
              return row.taskStatus !== 4
            }
          },
          {
            icon: 'delete',
            name: '删除',
            handler: function (row, scope) {
              vm.deleteHandle(row)
            },
            v_if: function (row, scope) {
              return row.taskStatus !== 4
            }
          }
        ]
      },
      filterType(val) {
        this.taskType = val.taskType ? val.taskType : this.taskType
        this.taskStatus = val.taskStatus ? val.taskStatus : this.taskStatus
        this.getInterimListData()
      },
      filterType1(val) {
        this.priorityList = val.priority ? val.priority : this.priorityList
        this.taskStatusList = val.taskStatus ? val.taskStatus : this.taskStatusList
        this.getData()
      },
      statusFilter(status) {
        const statusMap = ['', 'primary', 'success', 'gray', 'warning']
        return statusMap[status - 1]
      },
      goto(path) {
        this.$router.push(path)
      },
      goBack() {
        this.$router.push('/AutoOpsCenter/script/scriptControl')
      },
      editttHandle(row) {
        let vm = this
        vm.editTaskBloom = true
        vm.current = row
      },
      pauseHandle(row) {
        let vm = this
        $axios.get(`/autoScriptTask/pauseAutoScriptTask/${row.uuid}`).then((res) => {
          if (res.data && res.data.state) {
            vm.$message.success('已暂停！')
            vm.getData()
          } else {
            vm.$message.error(res.data.errormsg)
          }
        })
      },
      startHandle(row) {
        let vm = this
        $axios.get(`/autoScriptTask/cancelPauseAutoScriptTask/${row.uuid}`).then((res) => {
          if (res.data && res.data.state) {
            vm.$message.success('已恢复！')
            vm.getData()
          } else {
            vm.$message.error(res.data.errormsg)
          }
        })
      },
      // 单次任务删除
      deleteSingleTask(row) {
        let vm = this;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get(`/immediateExcuteTask/deleteImmediateTask/${row.uuid}`, {
            data: [row],
            logTemplate: '删除|单次任务(#taskName#)'
          }).then((res) => {
            if (res.data) {
              vm.$message.success('已删除！')
              vm.getInterimListData()
            } else {
              vm.$message.error(res.data.errormsg)
            }
          })
        }).catch(() => {});
      },
      // 周期任务删除
      deleteHandle(row) {
        let vm = this;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post(`/autoScriptTask/batchDelAutoScriptTask`, [row.uuid], {
            data: [row],
            logTemplate: '删除|周期任务(#taskName#)'
          }).then((res) => {
            if (res.data && res.data.state) {
              vm.$message.success('已删除！')
              vm.getData()
            } else {
              vm.$message.error(res.data.errormsg)
            }
          })
        }).catch(() => {});
      },
      checkHandle(row) {
        let vm = this
        vm.checkTaskBloom = true
        vm.currentRow = row
      },
      checkInterimHandle(row) {
        this.scriptExeParam.scriptUuid = row.uuid
        if (row.taskType === 1) {
          this.interimTaskBloom = true
        } else {
          this.interimUploadBloom = true
        }
      },
      // 状态下拉框
      getState() {
        $axios.get(`/autoScriptTask/getAutoScriptTaskSelectData`).then((res) => {
          if (res.data && res.data.taskStatusList instanceof Array) {
            this.stateList = res.data.taskStatusList
          }
        })
      },
      // 时间格式化为秒
      getTimeStamp(str) {
        if (str === null) return str;
        return parseInt(new Date(str).getTime() / 1000);
      },
      // 获取周期任务列表
      getData() {
        let params = {
          priorityList: this.priorityList,
          taskStatusList: this.taskStatusList,
          searchKey: this.searchKey
        }
        this.ajaxCircleObj.params.condition = cloneDeep(params);
      },
      // 获取单次任务列表
      getInterimListData() {
        let params = {
          searchKey: this.assetsSearchKey,
          taskTypeList: this.taskType,
          taskStatusList: this.taskStatus
        }
        this.ajaxObj.params.condition = cloneDeep(params);
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
        if (newForm.isPeriodicTask === 0) {
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
        console.log(newForm);
        return newForm
      },
      cancelRun() {
        this.runScriptBloom = false
        this.getInterimListData()
      },
      cancelUpload() {
        this.uploadScriptBloom = false
        this.getInterimListData()
      },
      viewTaskHandler(row) {
        this.current = row
        this.viewTaskBloom = true
      },
      // 新建任务
      createTaskOk() {
        this.$refs['createtask'].$refs['taskForm'].validate((valid) => {
          if (valid) {
            this.$refs['createtask'].$refs['taskForm1'].validate((valid1) => {
              if (valid1) {
                if (this.$refs['createtask'].$refs['period'].validateForm()) {
                  let multipleSelection = this.$refs['createtask'].multipleSelection
                  if (multipleSelection.length > 0) {
                    let assetUuidList = multipleSelection.map((item) => {
                      return item.uuid
                    })
                    let params = this.formattScheduleTime(Object.assign({}, {assetUuidList}, this.$refs['createtask'].taskForm)) // 否则双向渲染
                    let scriptUuidParList = []
                    this.$refs['createtask'].paramList.map(item => {
                      scriptUuidParList.push({
                        scriptUuid: item.uuid,
                        scriptParam: item.scriptParam
                      })
                    })
                    params.scriptUuidParList = scriptUuidParList
                    params.timeOut = parseInt(params.timeOut)
                    $axios.post(`/autoScriptTask/isTrigger`, params).then((res) => {
                      if (res.data && res.data.state === false) {
                        this.$message.warning(res.data.errormsg)
                      } else {
                        $axios.post(`/autoScriptTask/saveAutoScriptTask`, params, {
                          data: [params],
                          logTemplate: '添加|周期任务(#taskName#)'
                        }).then((res) => {
                          if (res.data && res.data.state === true) {
                            this.createTaskBloom = false
                            this.$message.success('新建任务成功！')
                            this.getData()
                          } else {
                            this.$message({
                              message: res.data.errormsg,
                              type: 'error'
                            })
                          }
                        })
                      }
                    })
                  } else {
                    this.$refs['createtask'].activeNames = 'host'
                    this.$message({message: '请先选择一个主机！', type: 'warning'});
                  }
                }
              } else {
                this.$refs['createtask'].activeNames = 'script'
                this.$message({
                  type: 'warning',
                  message: '请按要求填写'
                })
              }
            })
          } else {
            this.$refs['createtask'].activeNames = 'base'
            this.$message({
              type: 'warning',
              message: '请按要求填写'
            })
          }
        })
      },
      // 编辑任务
      editTaskOk() {
        this.$refs['edittask'].$refs['taskForm'].validate((valid) => {
          if (valid) {
            this.$refs['edittask'].$refs['taskForm1'].validate((valid1) => {
              if (valid1) {
                if (this.$refs['edittask'].$refs['period'].validateForm()) {
                  let multipleSelection = this.$refs['edittask'].multipleSelection
                  if (multipleSelection.length > 0) {
                    let assetUuidList = multipleSelection.map((item) => {
                      return item.uuid
                    })
                    let params1 = this.formattScheduleTime(Object.assign({}, {assetUuidList}, this.$refs['edittask'].taskForm)) // 否则双向渲染
                    let scriptUuidList = []
                    this.$refs['edittask'].paramList.map(item => {
                      scriptUuidList.push({
                        scriptUuid: item.uuid || item.scriptUuid,
                        scriptParam: item.scriptParam
                      })
                    })
                    params1.scriptUuidParList = scriptUuidList
                    let {uuid, taskName, isPeriodicTask, priority, scriptLibUuid, timeOut, scriptUuidParList, tScheduleTime} = params1
                    let params = {
                      assetUuidList,
                      uuid,
                      taskName,
                      priority,
                      scriptLibUuid,
                      timeOut,
                      scriptUuidParList,
                      isPeriodicTask,
                      tScheduleTime
                    }
                    params.timeOut = parseInt(params.timeOut);
                    $axios.post(`/autoScriptTask/updateAutoScriptTask`, params, {
                      data: [params],
                      logTemplate: '编辑|周期任务(#taskName#)'
                    }).then((res) => {
                      if (res.data && res.data.state === true) {
                        this.editTaskBloom = false
                        this.$message.success('编辑任务成功！')
                        this.getData()
                      } else {
                        this.$message.error('编辑任务失败！')
                      }
                    })
                  } else {
                    this.$refs['edittask'].activeNames = 'host'
                    this.$message({message: '请先选择一个主机！', type: 'warning'});
                  }
                }
              } else {
                this.$refs['edittask'].activeNames = 'script'
                this.$message({
                  type: 'warning',
                  message: '请按要求填写'
                })
              }
            })
          } else {
            this.$refs['edittask'].activeNames = 'base'
            this.$message({
              type: 'warning',
              message: '请按要求填写'
            })
          }
        })
      },
      init() {
        this.getState()
        this.getData()
        this.getInterimListData()
      }
    },
    mounted() {
      this.getInterimListData()
      this.getData()
    },
    created() {
      if (this.$route.query.tab) {
        this.activeName = this.$route.query.tab;
      }
      this.init()
    }
  }
</script>
<style scoped>
  .runScript {
    height: 50px;
    line-height: 50px;
    margin-bottom: 10px;
  }
</style>
