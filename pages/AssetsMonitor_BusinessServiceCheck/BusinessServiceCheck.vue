<template>
  <div class="assetPollingStyles">
    <s-tab type="card" class="assetPolling">
      <s-tab-pane label="巡检任务">
        <s-form :inline="true" ref="form" :model="searchForm" class="search_form" label-width='105px'>
          <div>
            <s-form-item label="巡检名称：" prop="inspectName">
              <s-input @keyup.enter.native="search" v-model="searchForm.inspectName"></s-input>
            </s-form-item>
            <s-form-item label="创建者：">
              <s-input @keyup.enter.native="search" v-model="searchForm.createUserName"></s-input>
            </s-form-item>
            <s-form-item label="巡检周期：" prop="cycle">
              <s-select v-model="searchForm.cycle" clearable>
                <s-option label="日" value="1"></s-option>
                <s-option label="周" value="2"></s-option>
                <s-option label="月" value="3"></s-option>
                <s-option label="年" value="4"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="上次执行时间：" prop="previousExcuteTime.value">
              <s-date-picker
                v-model="searchForm.lastStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择开始日期时间"
              >
              </s-date-picker>~
              <s-date-picker
                v-model="searchForm.lastEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择结束日期时间"
              >
              </s-date-picker>
              <!--<date-range v-model="searchForm.excuteTime.value" :value-format-flag="true"></date-range>-->
            </s-form-item>
            <s-form-item label="下次执行时间：" prop="nextExcuteTime.value">
              <s-date-picker
                v-model="searchForm.nextStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择开始日期时间"
              >
              </s-date-picker>~
              <s-date-picker
                v-model="searchForm.nextEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="请选择结束日期时间"
              >
              </s-date-picker>
              <!--<date-range v-model="searchForm.nextExcutetime.value" :value-format-flag="true"></date-range>-->
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" @click="search">查询</s-button>
          </div>
        </s-form>
        <div style="margin: 15px 0">
          <s-button icon="plus" @click="add">添加</s-button>
          <s-button icon="batch-del" @click="del">批量删除</s-button>
        </div>
        <RealPageTable :ajax-obj="ajaxObjAssets" :isChecked="true" @selection-change="selectionChange" >
          <s-table-column type="selection" width="45" align="center"></s-table-column>
          <s-table-column label="巡检名称" prop="inspectName">
            <template slot-scope="scope">
              <a @click="axiosObjectData(scope.row)" class="assetName" style="cursor: pointer">{{scope.row.inspectName}}</a>
            </template>
          </s-table-column>
          <s-table-column label="巡检周期" prop="circleTypeStr">
            <template slot-scope="scope">
              <span>{{scope.row | filterPeriod}}</span>
            </template>
          </s-table-column>
          <s-table-column label="上次执行时间" prop="previousExcuteTime">
            <template slot-scope="scope">
              <span>{{scope.row.previousExcuteTime || '-'}}</span>
            </template>
          </s-table-column>
          <s-table-column label="下次执行时间" prop="nextExcuteTime">
            <template slot-scope="scope">
              <span>{{timeDate(scope.row.nextExcuteTime)}}</span>
            </template>
          </s-table-column>
          <s-table-column label="创建者" prop="createUserName"></s-table-column>
          <s-table-column label="创建时间" prop="createTime"></s-table-column>
          <s-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <i v-if="IsDel(scope.row)" class="iconfont icon-edit" @click="rowEdit(scope.row)"></i>
              <i v-if="IsDel(scope.row)" class="iconfont icon-delete" @click="rowDel(scope.row)"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-tab-pane>
    </s-tab>
    <s-tab type="card">
      <s-tab-pane label="巡检对象">
        <s-row style="font-weight: 600">
          <span>巡检任务名称：</span> <span>{{ inspectName }}</span>
          <span style="margin-left: 250px;">最新执行时间：</span> <span>{{ excuteTime }}</span>
        </s-row>
        <s-table-page :data="inspectingObjectData" >
          <s-table-column label="服务名称" prop="name">
            <template slot-scope="scope">
              <span @click="axiosHistoryData(scope.row)" class="assetName" style="cursor: pointer">{{scope.row.name}}</span>
            </template>
          </s-table-column>
          <s-table-column label="关键程度" prop="criticalityName"></s-table-column>
          <s-table-column label="影响度" prop="effectName"></s-table-column>
          <s-table-column label="负责人" prop="maintenanceView.userRealName"></s-table-column>
          <s-table-column label="可用率（%）" prop="todayAvailable"></s-table-column>
          <s-table-column label="状态" prop="statusName">
            <template slot-scope="scope">
              <s-tag v-if="scope.row.status === 4" type="success">{{scope.row.statusName}}</s-tag>
              <s-tag v-if="scope.row.status === 3" type="success">{{scope.row.statusName}}</s-tag>
              <s-tag v-if="scope.row.status === 2" type="warning">{{scope.row.statusName}}</s-tag>
              <s-tag v-if="scope.row.status === 1" type="danger">{{scope.row.statusName}}</s-tag>
            </template>
          </s-table-column>
          <s-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="safetyScoreSee(scope.row)" v-if="isShow(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-tab type="card">
      <s-tab-pane label="历史记录">
        <s-row style="font-weight: 600">
          <span>服务名称：</span> <span>{{ assetName }}</span>
        </s-row>
        <s-table-page :data="historyTableData" >
          <s-table-column label="执行时间" prop="createTime"></s-table-column>
          <s-table-column label="可用率（%）" prop="serviceBaseInfoObj.serviceAvailable"></s-table-column>
          <s-table-column label="状态" prop="serviceBaseInfoObj.serviceStatusName"></s-table-column>
          <s-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="rowSee(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
      </s-tab-pane>
    </s-tab>
    <s-dialog
      v-model="addDialogFlag"
      v-if="addDialogFlag"
      width="700px"
      title="添加巡检任务">
      <task-area ref="task"
                 @client-change="onClientChange"
                 @email-change="onEmailChange">
      </task-area>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitTask">确定</s-button>
        <s-button @click="addDialogFlag = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="editDialogFlag"
      v-if="editDialogFlag"
      width="700px"
      title="修改巡检任务">
      <task-area ref="editTask"
                 :data="curPollingTask"
                 @client-change="onClientChange"
                 @email-change="onEmailChange"></task-area>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editTask">确定</s-button>
        <s-button @click="editDialogFlag = false">取消</s-button>
      </template>
    </s-dialog>
    <EyeBusinessServe v-if="EyeBusinessDialog" :eyeRow='eyeRow' v-model="EyeBusinessDialog"></EyeBusinessServe>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import taskArea from './TaskArea';
  import EyeBusinessServe from './EyeBusinessServe';
  // import {multiSearch} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';

  export default {
    data() {
      return {
        addDialogFlag: false,
        editDialogFlag: false,
        EyeBusinessDialog: false,
        eyeRow: {},
        searchForm: {
          inspectName: '',
          cycle: '',
          lastStartTime: '',
          lastEndTime: '',
          nextStartTime: '',
          nextEndTime: '',
          createUserName: ''
        },
        tableData: [],
        curTableData: [],
        selections: [],
        curPollingTask: {},
        inspectingObjectData: [],
        historyData: [],
        historyTableData: [],
        inspectName: '',
        excuteTime: '',
        assetName: '',
        currentUuid: '',
        ajaxObjAssets: {
          type: 'post',
          url: '/businessinspect/getInspectTaskList',
          checkedUuidArr: [],
          params: {
            condition: {
            }
          }
        }
      }
    },
    created() {
    // this.search()
      this.axiosTaskList();
    },
    mounted() {
      this.ajaxObjAssets.params.condition = Object.assign({}, this.searchForm)
    },
    filters: {
      filterPeriod(val) {
        if (val.isPeriodicTask === 0) {
          return '-'
        } else if (val.isPeriodicTask === 1) {
          return val.circleStr
        }
      }
    },
    methods: {
      delNotNeedKey(arr, target) {
        for (var key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      timeDate(val) {
        if (val === '1970-01-01 08:00:00') {
          return '--'
        } else {
          return val
        }
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
        return newForm
      },
      editTask() {
        let vm = this;
        let newForm = vm.formattScheduleTime(vm.$refs['editTask'].form)
        newForm.serviceUuids = vm.$refs['editTask'].$refs['serviceList'].getAllSelectedData().map(item => item.uuid)
        vm.$refs['editTask'].$refs['form'].validate((valid) => {
          if (!valid || !(vm.$refs['editTask'].$refs['periods'].validateForm())) {
            vm.$refs['editTask'].toTab('1')
            return false;
          }
          if (newForm.emailUuids.length === 0 && newForm.email === true) {
            vm.$refs['editTask'].toTab('3')
            vm.$message.error('请添加通知账号')
            return false;
          }
          if (newForm.serviceUuids && newForm.serviceUuids.length > 0) {
            $axios.post('/businessinspect/updateInspectTask', newForm, {
              data: [{name: newForm.inspectName}],
              logTemplate: '编辑|巡检任务>巡检任务(#name#)'
            }).then((res) => {
              if (res.data.state === true) {
                vm.$message.success('修改巡检任务成功');
                vm.axiosTaskList();
                vm.editDialogFlag = false;
              } else {
                vm.$message.error(res.data.errormsg);
              }
            });
          } else {
            vm.$refs['editTask'].toTab('2')
            vm.$message.error('请添加巡检对象')
          }
        })
      },
      submitTask() {
        let vm = this;
        let newForm = vm.formattScheduleTime(vm.$refs['task'].form)
        newForm.serviceUuids = vm.$refs['task'].$refs['serviceList'].getAllSelectedData().map(item => item.uuid)
        vm.$refs['task'].$refs['form'].validate((valid) => {
          if (!valid || !(vm.$refs['task'].$refs['periods'].validateForm())) {
            vm.$refs['task'].toTab('1')
            return false;
          }
          if (newForm.emailUuids.length === 0 && newForm.email === true) {
            vm.$refs['task'].toTab('3')
            vm.$message.error('请添加通知账号')
            return false;
          }
          $axios.post('/businessinspect/isTrigger', newForm).then((res) => {
            if (res.data.state) {
              if (newForm.serviceUuids && newForm.serviceUuids.length > 0) {
                $axios.post('/businessinspect/saveInspectTask', newForm, {
                  data: [{name: newForm.inspectName}],
                  logTemplate: '添加|巡检任务>巡检任务(#name#)'
                }).then((res) => {
                  if (res.data.state === true) {
                    vm.$message.success('新增巡检任务成功');
                    vm.axiosTaskList();
                    vm.addDialogFlag = false;
                  } else {
                    vm.$message.error(res.data.errormsg);
                  }
                });
              } else {
                vm.$refs['task'].toTab('2')
                vm.$message.error('请添加巡检对象')
              }
            } else {
              vm.$message.error(res.data.errormsg)
            }
          })
        })
      },
      IsDel(row) {
        if (row.status === 5) {
          return false
        }
        return true
      },
      statusFilter(status) {
        const statusMap = ['', 'primary', 'success', 'gray', 'warning']
        return statusMap[status - 1]
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      isShow(row) {
        if (row.baseline === null || row.baseline === '') {
          return false;
        } else {
          return true
        }
      },
      search() {
        this.ajaxObjAssets.params.condition = Object.assign({}, this.searchForm)
      },
      add() {
        this.curPollingTask = {};
        this.addDialogFlag = true;
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选择一个', type: 'warning'});
          return;
        }
        this.axiosDel(this.selections.map(item => item.uuid), this.selections);
      },
      rowEdit(row) {
        this.curPollingTask = row;
        this.editDialogFlag = true;
      },
      rowDel(row) {
        this.axiosDel([row.uuid], row);
      },
      axiosTaskList() {
        this.ajaxObjAssets.params.condition = Object.assign({}, this.searchForm)
      },
      axiosDel(param, data) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('/businessinspect/batchDeleteInspectTask', param, {
            data: [{name: data.inspectName}],
            logTemplate: '删除|巡检任务>巡检任务(#name#)'
          }).then(({data}) => {
            if (data.state === true) {
              this.$message.success('删除成功');
              this.axiosTaskList();
            } else {
              this.$message.error(data.state.errormsg);
            }
          });
        }).catch(() => {
        });
      },
      axiosObjectData(row) {
        this.inspectName = row.inspectName;
        this.excuteTime = row.previousExcuteTime || '-';
        $axios.get('businessinspect/getInspectBusinessServiceInfo/' + row.uuid).then(res => {
          this.inspectingObjectData = res.data;
          this.historyData = [];
          this.historyTableData = [];
          this.assetName = '';
        })
        this.currentUuid = row.uuid
      },
      axiosHistoryData(row) {
        this.assetName = row.assetName;
        $axios.get('businessinspect/getInspectHisList/' + this.currentUuid + '/' + row.uuid).then(res => {
          this.historyData = res.data;
          this.historyTableData = cloneDeep(res.data);
        })
      },
      rowSee(row) {
        this.eyeRow = row
        this.EyeBusinessDialog = true
      },
      safetyScoreSee(row) {
        this.EyeBusinessDialog = true
        this.eyeRow = row
        this.eyeRow.rowUuid = this.currentUuid
      },
      onClientChange (type) {
        let _self = this
        let task = _self.$refs[type]
        $axios.post('/businessinspect/getUnselectedSysUser', []).then(function (res) {
          let added = task.clientList
          _self.citeData = res.data.filter(function (item, index) {
            for (let i in added) {
              if (added[i].uuid === item.uuid) {
                return false
              }
            }
            return item
          })
          _self.clientDialog = true
        })
      },
      onEmailChange (type) {
        let _self = this
        let task = _self.$refs[type]
        $axios.post('/businessinspect/getUnselectedSysUser', []).then(function (res) {
          let added = task.emailList
          _self.citeData = res.data.filter(function (item, index) {
            for (let i in added) {
              if (added[i].uuid === item.uuid) {
                return false
              }
            }
            return item
          })
          _self.emailDialog = true
        })
      }
    },
    components: {
      // SearchBox,
      // DateRange,
      taskArea,
      EyeBusinessServe,
      RealPageTable
    }
  }
</script>

<style lang="stylus">
</style>
