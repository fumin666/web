/**
* Created by alex on 2018/8/21.
*/
<template>
  <section>
    <div style="float: left;">
      <s-button icon="plus" @click="addTask">新增任务</s-button>
      <s-button icon="export" @click="exportDispatch">批量导出</s-button>
      <s-button icon="refresh-circle" @click="refresh">刷新</s-button>
    </div>
    <div class="inputWrap" style="position: relative;">
      <s-input v-model="assetsSearchKey" @keyup.enter.native="getTaskList" placeholder="请输入内容" style="margin-bottom: 7px;" class="real-search-input"></s-input>
      <span class="realPageSearch" style="padding-top: 7px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getTaskList"></i></span>
    </div>
    <RealPageTable
      style="width: 100%"
      :ajax-obj="ajaxObj"
      @selection-change="changeSelection"


      @filter-change="filterType">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column
        label="任务名称">
        <template slot-scope="scope">
          <a @click="viewTaskHandler(scope.row)" style="color:#1675cb;cursor: pointer;">{{scope.row.taskName}}</a>
        </template>
      </s-table-column>
      <s-table-column
        prop="timeTypeStr"
        label="任务周期">
      </s-table-column>
      <s-table-column
        prop="ipNums"
        label="IP数">
      </s-table-column>
      <s-table-column
        prop="compliance_rate"
        label="合规率"
        sortable
        :formatter="formatterRate">
      </s-table-column>
      <s-table-column
        label="状态"
        :filters="filtersStatus"
        prop="taskStatus" column-key="taskStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.taskStatus === 1">新建</span>
          <span v-if="scope.row.taskStatus === 3">执行中</span>
          <span v-if="scope.row.taskStatus === 4">已完成</span>
          <span v-if="scope.row.taskStatus === 2">已暂停</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="previousFireTime"
        label="上次执行时间">
      </s-table-column>
      <s-table-column
        prop="nextFireTime"
        label="下次执行时间">
        <template slot-scope="scope">
          <span v-if="scope.row.nextFireTime && scope.row.nextFireTime === '1970-01-01 08:00:00'"> -- </span>
          <span v-else>{{scope.row.nextFireTime}}</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="createUserName"
        label="创建人">
      </s-table-column>
      <s-table-column
        prop="beginTime"
        label="创建时间">
      </s-table-column>
      <!--<s-table-column-->
      <!--prop="taskType"-->
      <!--label="任务类型"-->
      <!--:formatter="formatterType">-->
      <!--</s-table-column>-->
      <s-table-column label="操作">
        <template slot-scope="scope">
          <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
        </template>
      </s-table-column>
    </RealPageTable>
    <!--新增-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="800px"
      title="新建任务">
      <add-task ref="addItem"></add-task>
      <template slot="footer">
        <s-button @click="saveHandler">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--详情-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="900px"
      title="任务详情">
      <task-detail :taskUuid="taskUuid" :editData="editData"></task-detail>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="800px"
      title="编辑任务">
      <add-task ref="editItem" :editData="editData"></add-task>
      <template slot="footer">
        <s-button @click="editSave">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看-->
    <s-dialog
      v-model="viewTaskDialog"
      v-if="viewTaskDialog"
      width="800px"
      title="查看任务">
      <view-task :editData="editData"></view-task>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import addTask from './components/AddTask'
  import viewTask from './components/ViewTask'
  import taskDetail from './components/TaskDetail'
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import { cloneDeep } from 'lodash'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  export default {
    data() {
      return {
        addDialog: false,
        editDialog: false,
        viewDialog: false,
        viewTaskDialog: false,
        taskUuid: '',
        tableData: [],
        tableOption: {
          isHidden: true,
          showNum: 3,
          appendId: '.s-table',
          trigger: 'click',
          placement: 'left'
        },
        filtersStatus: [
          {text: '新建', value: 1},
          {text: '执行中', value: 3},
          {text: '已完成', value: 4},
          {text: '已暂停', value: 2}
        ],
        statusList: [1, 2, 3, 4],
        assetsSearchKey: '',
        ajaxObj: {
          type: 'post',
          url: '/automateSystemFasten/getAllSystemFastenTaskList',
          params: {
            condition: {
            }
          }
        },
        criteria: {                 // 真分页分页数据
          condition: {
          },
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        taskSelections: [],
        selectUuid: [],
        selectedEmailList: [],
        editData: ''
      }
    },
    components: {
      addTask,
      taskDetail,
      viewTask,
      RealPageTable,
      buttonSet
    },
    created() {
    },
    mounted() {
      this.getTaskList()
    },
    filters: {
      statusFilter(status) {
        const statusMap = ['primary', 'danger', 'warning', 'success']
        return statusMap[status - 1]
      },
      wordFilter(status) {
        const wordMap = ['新建', '已暂停', '执行中', '已完成']
        return wordMap[status - 1]
      }
    },
    methods: {
      btnData() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看详情',
            handler: function (row, scope) {
              vm.viewHandler(row.uuid, row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            handler: function (row, scope) {
              vm.editHandler(row)
            },
            v_if: function (row, scope) {
              return row.taskStatus === 1
            }
          },
          {
            icon: 'pause',
            title: '暂停',
            handler: function (row, scope) {
              vm.startOrStopHandler([scope.row.uuid], 2)
            },
            v_if: function (row, scope) {
              return (row.taskStatus === 3 || (row.taskStatus === 1 && row.isPeriod === '1'))
            }
          },
          {
            icon: 'carry-out',
            name: '执行',
            handler: function (row, scope) {
              vm.startOrStopHandler([scope.row.uuid], 3)
            },
            v_if: function (row, scope) {
              return row.taskStatus === 2
            }
          },
          {
            icon: 'export',
            name: '结果导出',
            handler: function (row, scope) {
              vm.exportResult([scope.row])
            }
          },
          {
            icon: 'delete',
            name: '删除',
            handler: function (row, scope) {
              vm.deleteHandler([scope.row])
            }
          }
        ]
      },
      filterType(obj) {
        this.statusList = obj.taskStatus;
        this.getTaskList();
      },
      addTask() {
        this.addDialog = true
      },
      exportDispatch() {
        this.exportResult(this.taskSelections);
      },
      refresh() {
        this.getTaskList()
      },
      // 任务表格多选
      changeSelection(val) {
        this.taskSelections = val;
      },
      formatterRate(item) {
        return item.compliance_rate + '%'
      },
      handleSelectChange(val) {
        this.selectUuid = val.map(item => item.uuid)
      },
      formatterType(item) {
        return item.taskType === '0' ? '即时任务' : '周期任务';
      },
      getTaskList() {
        this.criteria.condition.statusList = this.statusList
        this.criteria.condition.searchKey = this.assetsSearchKey
        this.ajaxObj.params = cloneDeep(this.criteria);
      },
      editSave() {
        let vm = this
        let form = cloneDeep(this.$refs['editItem'].form)
        form.timeOut = parseInt(form.timeOut)
        let arr = this.$refs['editItem'].selectList
        let middleTemplateName = this.$refs['editItem'].middleTemplateName
        let arrNew = arr.map(item => {
          return {
            itcompUuid: item.uuid,
            name: item.itcompname,
            ipAddress: item.controladderss,
            type: item.automatetype,
            templateName: middleTemplateName
          }
        })
        form.ipNums = arrNew.length
        form.executeResults = arrNew
        let openEmail = this.$refs['editItem'].openEmail
        form.notices = this.filterNotices(this.$refs['editItem'].quoteList, this.$refs['editItem'].openEmail)
        let fastenScriptList = []
        this.$refs['editItem'].paramList.map(item => {
          fastenScriptList.push({
            itemUuid: item.itemUuid || item.uuid,
            scriptParam: item.scriptParam
          })
        })
        form.fastenScriptList = fastenScriptList
        form = this.formattScheduleTime(form)
        this.$refs['editItem'].$refs['taskForm'].validate(valid => {
          if (valid) {
            this.$refs['editItem'].$refs['taskForm1'].validate((valid1) => {
              if (valid1) {
                if (arr.length <= 0) {
                  this.$message.error('请选择主机')
                  this.$refs['editItem'].activeNames = 'host'
                } else {
                  if (this.$refs['editItem'].$refs['period'].validateForm()) {
                    if (openEmail && form.notices.length <= 0) {
                      this.$message.info('请选择通知对象');
                      this.$refs['editItem'].activeNames = 'message'
                    } else {
                      $axios.post('/automateSystemFasten/isTrigger', form).then((res) => {
                        if (res.data.state) {
                          $axios.post('/automateSystemFasten/editSystemFastenTask', form).then((res) => {
                            if (res.data) {
                              vm.$message.success('编辑成功');
                              vm.getTaskList();
                              vm.editDialog = false;
                            } else {
                              vm.$message.error('编辑失败');
                            }
                          })
                        } else {
                          this.$message.error(res.data.errormsg);
                        }
                      })
                    }
                  } else {
                    this.$message.info('请按要求填写');
                    this.$refs['editItem'].activeNames = 'base'
                  }
                }
              } else {
                this.$message.info('请按要求填写');
                this.$refs['editItem'].activeNames = 'script'
              }
            })
          } else {
            this.$message.info('请按要求填写');
            this.$refs['editItem'].activeNames = 'base'
          }
        })
      },
      editHandler(row) {
        this.editDialog = true
        this.editData = row
      },
      viewTaskHandler(row) {
        this.viewTaskDialog = true
        this.editData = row
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
      filterNotices(arr, openEmail) {
        if (!openEmail) return [];
        return arr.map(item => {
          if (item.accountUuid) {
            return {accountUuid: item.accountUuid}
          } else {
            return item;
          }
        })
      },
      saveHandler() {
        let form = cloneDeep(this.$refs['addItem'].form)
        form.timeOut = parseInt(form.timeOut)
        let arr = this.$refs['addItem'].selectList
        let openEmail = this.$refs['addItem'].openEmail
        let middleTemplateName = this.$refs['addItem'].middleTemplateName
        let arrNew = arr.map(item => {
          return {
            itcompUuid: item.uuid,
            name: item.itcompname,
            ipAddress: item.controladderss,
            type: item.automatetype,
            templateName: middleTemplateName
          }
        })
        form.ipNums = arrNew.length
        form.executeResults = arrNew
        form = this.formattScheduleTime(form)
        form.notices = this.filterNotices(this.$refs['addItem'].quoteList, this.$refs['addItem'].openEmail)
        let fastenScriptList = []
        this.$refs['addItem'].paramList.map(item => {
          fastenScriptList.push({
            itemUuid: item.uuid,
            scriptParam: item.scriptParam
          })
        })
        form.fastenScriptList = fastenScriptList
        let vm = this
        this.$refs['addItem'].$refs['taskForm'].validate((valid) => {
          if (valid) {
            this.$refs['addItem'].$refs['taskForm1'].validate((valid1) => {
              if (valid1) {
                if (arr.length <= 0) {
                  this.$message.error('请选择主机')
                  this.$refs['addItem'].activeNames = 'host'
                } else {
                  if (this.$refs['addItem'].$refs['period'].validateForm()) {
                    if (openEmail && form.notices.length <= 0) {
                      this.$message.info('请选择通知对象');
                      this.$refs['addItem'].activeNames = 'message'
                    } else {
                      $axios.post('/automateSystemFasten/isTrigger', form).then((res) => {
                        if (res.data.state) {
                          $axios.post('/automateSystemFasten/addSystemFastenTask', form, {
                            data: [form],
                            logTemplate: '添加|任务执行>任务(#taskName#)'
                          }).then((res) => {
                            if (res.data) {
                              vm.$message.success('保存成功');
                              vm.getTaskList();
                              vm.addDialog = false;
                            } else {
                              vm.$message.error(res.data.errormsg);
                            }
                          })
                        } else {
                          this.$message.error(res.data.errormsg);
                        }
                      })
                    }
                  } else {
                    this.$message.info('请按要求填写');
                    this.$refs['addItem'].activeNames = 'base'
                  }
                }
              } else {
                this.$message.info('请按要求填写');
                this.$refs['addItem'].activeNames = 'script'
              }
            })
          } else {
            this.$message.info('请按要求填写');
            this.$refs['addItem'].activeNames = 'base'
          }
        })
      },
      viewHandler(uuid, row) {
        this.viewDialog = true
        this.taskUuid = uuid
        this.editData = row
      },
      deleteHandler(row) {
        if (row.length === 0) {
          this.$message.error('至少选择一个');
          return false
        }
        let arr = row.map(item => item.uuid)
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/automateSystemFasten/batchDeleteSystemFastenTask', arr, {
            data: row,
            logTemplate: '删除|任务执行>任务(#taskName#)'
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
      startOrStopHandler(uuids, isOpen) {
        /* 开始1 关闭2 */
        if (uuids.length === 0) {
          this.$message.error('至少选择一个');
          return false
        }
        $axios.post(`/automateSystemFasten/batchStartOrStopSystemFastenTask/${isOpen}`, uuids).then((res) => {
          if (res.data) {
            this.$message.success('操作成功');
            this.getTaskList();
          } else {
            this.$message.error('操作失败');
          }
        })
      },
      // 单个/批量导出任务执行结果
      exportResult(arr) {
      let uuids = arr.map(item => item.uuid)
        $axios.post('/automateSystemFasten/createSystemFastenTaskExecuteResultExportFile', uuids, {
          data: arr,
          logTemplate: arr.length > 1 ? '批量导出|任务执行>批量导出(FastenTaskExecuteResult.xls)' : '导出|任务执行>任务(#taskName#)'
        }).then(({data}) => {
          if (data.state === true) {
            Download(`/automateSystemFasten/exportSystemFastenTaskExecuteResult/${data.fileName}`);
          } else {
            this.$message.error('导出失败，请重试！');
          }
        });
      }
    }
  }
</script>
