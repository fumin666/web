/**
* Created by alex on 2018/8/10.
*/
<template>
  <section id="auto-ops-collect-task">
    <div class="box-card">
      <s-table-page :data='taskList'
                :header-actions='getListActionsDef()'
                :header-search='getSearchDef()'
                @selection-change="handleSelectChange">
        <s-table-column
          prop="taskName"
          label="任务名称">
        </s-table-column>
        <s-table-column
          prop="circleTypeStr"
          label="任务周期">
        </s-table-column>
        <s-table-column
          prop="ipCount"
          label="网段IP数">
        </s-table-column>
        <s-table-column
          label="状态"
          prop="taskStatus"
          :filters="filters"
          :filter-method="filterTag">
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 1">新建</span>
            <span v-if="scope.row.taskStatus === 2">执行中</span>
            <span v-if="scope.row.taskStatus === 3">已暂停</span>
            <span v-if="scope.row.taskStatus === 4">已完成</span>
          </template>
        </s-table-column>
        <s-table-column
          label="上次执行时间">
          <template slot-scope="scope">
            <span v-if="scope.row.task && scope.row.task.previousFireTime">{{scope.row.task.previousFireTime}}</span>
            <span v-else> -- </span>
          </template>
        </s-table-column>
        <s-table-column
          label="下次执行时间">
          <template slot-scope="scope">
            <span v-if="scope.row.task && scope.row.task.nextFireTime === '1970-01-01 08:00:00'"> -- </span>
            <span v-else>{{scope.row.task.nextFireTime}}</span>
          </template>
        </s-table-column>
        <s-table-column
          prop="createUser"
          label="创建人">
        </s-table-column>
        <s-table-column
          prop="createTime"
          label="创建时间"
          sortable>
        </s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-eye" title="查看采集结果" @click="openNumDialog('server', scope.row)"></i>
            <i v-if="scope.row.taskStatus === 1"class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)"></i>
            <i v-if="scope.row.taskStatus === 3" class="iconfont icon-carry-out" title="执行" @click="startOrPause(scope.row, 1)"></i>
            <i v-if="scope.row.taskStatus === 2" class="iconfont icon-pause" title="暂停" @click="startOrPause(scope.row, 0)"></i>
            <i class="iconfont icon-delete" title="删除" @click="taskDel([scope.row.uuid], scope.row)"></i>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
    <!--新增采集任务-->
    <s-dialog
      v-model="collectDialog"
      v-if="collectDialog"
      width="700px"
      title="新建采集任务">
      <collect-dialog ref="AddTask"></collect-dialog>
      <template slot="footer">
        <s-button @click="saveTask">保存</s-button>
        <s-button @click="collectDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑采集任务-->
    <s-dialog
      v-model="collectEditDialog"
      v-if="collectEditDialog"
      width="700px"
      title="编辑采集任务">
      <collect-dialog ref="editTask" :editData="editData"></collect-dialog>
      <template slot="footer">
        <s-button @click="editSave">保存</s-button>
        <s-button @click="collectEditDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看详情-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="900px"
      title="采集结果">
      <collect-result ref="collectResult" :topInfo="topInfo" :collectNum="collectNum" :result="chooseResult"></collect-result>
      <template slot="footer">
        <s-button @click="saveCMDB">保存</s-button>
        <s-button @click="viewDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import collectDialog from './components/AddCollectDialog'
  import collectResult from './components/CollectResult'
  import { cloneDeep } from 'lodash'
  export default {
    data() {
      return {
        topInfo: [],
        taskList: [],
        filters: [
          {text: '新建', value: 1},
          {text: '执行中', value: 2},
          {text: '已暂停', value: 3},
          {text: '已完成', value: 4}
        ],
        collectDialog: false,
        collectEditDialog: false,
        viewDialog: false,
        selectUuid: [],
        collectNum: [],
        chooseResult: [],
        chooseUuid: '',
        editData: ''
      }
    },
    components: {

      collectDialog,
      collectResult
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['primary', 'warning', 'danger', 'success']
        return statusMap[status - 1]
      },
      wordFilter(status) {
        const wordMap = ['新建', '执行中', '已暂停', '已完成']
        return wordMap[status - 1]
      }
    },
    created() {
      this.getTaskList()
    },
    methods: {
      filterTag(value, row) {
        return row.taskStatus === value
      },
      getCheckFilterDef() {
        return {
          props: 'taskStatus',
          actions: [{
            'code': '1',
            'name': '新建'
          }, {
            'code': '2',
            'name': '执行中'
          }, {
            'code': '3',
            'name': '已暂停'
          }, {
            'code': '4',
            'name': '已完成'
          }]
        }
      },
      getListActionsDef() {
        let self = this
        return {
          width: 12,
          actions: [{
            name: '新增采集任务',
            icon: 'plus',
            click: function() {
              self.collectDialog = true
            }
          }, {
            name: '刷新',
            icon: 'refresh-circle',
            click: function() {
              self.getTaskList()
            }
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入任务名称或创建人',
          searchProps: ['taskName', 'createUser']
        }
      },
      getTaskList() {
        $axios.get('/cicollectTaskinfo/getAutoMateCicollectTaskList').then((res) => {
          if (res.data) {
            this.taskList = res.data
          } else {
            this.$message.error('获取列表失败');
          }
        })
      },
      startOrPause(row, type) {
        let form = {
          uuid: row.uuid,
          type: type
        }
        $axios.post('/cicollectTaskinfo/batchPauseTaskinfoStatusByUuids', form).then((res) => {
          if (res.data) {
            this.$message.success('操作成功');
            this.getTaskList();
          } else {
            this.$message.error('操作失败，请检查后再试');
          }
        })
      },
      taskView(row) {
      },
      editHandler(row) {
        this.collectEditDialog = true
        this.editData = row
      },
      taskDel(uuids, row) {
        if (uuids.length === 0) {
          this.$message.warning('请至少选择一个')
          return false
        }
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/cicollectTaskinfo/batchDelAutoMateCicollectTaskinfo', uuids, {
            data: [row],
            logTemplate: '删除|采集任务(#taskName#)'
          }).then((res) => {
            if (res.data) {
              this.$message.success('删除成功');
              this.getTaskList();
            } else {
              this.$message.error('删除失败');
            }
          })
        }).catch(() => {});
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
        if (newForm.isPeriod === 0) {
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
      saveTask() {
        let taskForm = this.formattScheduleTime(this.$refs['AddTask'].taskForm)
        let uuid = this.$refs['AddTask'].delIpList.map(item => {
          return item.uuid;
        })
        if (uuid.length === 0) {
          this.$message.error('请填写网段')
          return false
        }
        let form = {
          uuids: uuid,
          autoMateCiCollectTaskInfo: taskForm
        }
        this.$refs['AddTask'].$refs['taskForm'].validate(valid => {
          if (valid) {
            this.$refs['AddTask'].$refs.period.$refs.periodForm.validate((v) => {
              if (v) {
                $axios.post('/cicollectTaskinfo/isTrigger', form).then((res) => {
                  if (res.data.state) {
                    $axios.post('/cicollectTaskinfo/saveAutoMateCollection', form, {
                      data: [form],
                      logTemplate: '添加|采集任务(#taskName#)'
                    }).then((res) => {
                      if (res.data) {
                        this.$message.success('保存成功');
                        this.collectDialog = false;
                        this.getTaskList()
                      } else {
                        this.$message.error('保存失败');
                      }
                    })
                  } else {
                    this.$message.error(res.data.errorMsg);
                  }
                })
              } else {
                this.$message.error('请选择正确的时间')
              }
            })
          } else {
            return;
          }
        })
      },
      editSave() {
        let taskForm = this.formattScheduleTime(this.$refs['editTask'].taskForm)
        let uuid = this.$refs['editTask'].delIpList.map(item => {
          return item.uuid;
        })
        if (uuid.length === 0) {
          this.$message.error('请填写网段')
          return false
        }
        let form = {
          uuids: uuid,
          autoMateCiCollectTaskInfo: taskForm
        }
        this.$refs['editTask'].$refs['taskForm'].validate(valid => {
          if (valid) {
            this.$refs['editTask'].$refs.period.$refs.periodForm.validate((v) => {
              if (v) {
                $axios.post('/cicollectTaskinfo/isTrigger', form).then((res) => {
                  if (res.data.state) {
                    $axios.post('/cicollectTaskinfo/updateAutoMateCollection', form, {
                      data: [form],
                      logTemplate: '编辑|采集任务(#taskName#)'
                    }).then((res) => {
                      if (res.data) {
                        this.$message.success('编辑成功');
                        this.collectEditDialog = false;
                        this.getTaskList()
                      } else {
                        this.$message.error('编辑失败');
                      }
                    })
                  } else {
                    this.$message.error(res.data.errorMsg);
                  }
                })
              } else {
                this.$message.error('请选择正确的时间')
              }
            })
          } else {
            return;
          }
        })
      },
      handleSelectChange(val) {
        this.selectUuid = val.map(item => item.uuid)
      },
      openNumDialog(type, row) {
        this.chooseUuid = row.uuid
        $axios.post(`/cicollectTaskinfo/getCicollectResult/${row.uuid}`).then((res) => {
          if (res.data) {
            this.topInfo = row
            this.collectNum = res.data
            this.chooseResult = this.collectNum[type]
            this.viewDialog = true
          }
        })
      },
      saveCMDB() {
        const model = this.$refs['collectResult']
        if (model.isSave && model.selectList.length > 0) {
          let form = {
            taskuuid: this.chooseUuid,
            ituuids: model.selectList
          }
          $axios.post('/cicollectTaskinfo/synchronousItcomp', form).then((res) => {
           if (res.data) {
             this.$message.success('同步成功')
             this.viewDialog = false
           } else {
             this.$message.error('同步失败')
           }
          })
        } else {
          this.$message.error('请选择您要同步的设备再保存')
        }
      }
    }
  }
</script>
