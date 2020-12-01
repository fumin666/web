<!--
 * @Description: 备份任务管理
 * @Author: songyf
 * @Date: 2020-4-14
 * @LastEditTime : 2020-4-14
 * @LastEditors  : LaMando
 -->
<template>
  <div class="backup-task">
    <s-dialog
      v-model="dialogFlag"
      v-if="dialogFlag"
      width="700px"
      append-to-body
      title="编辑">
      <s-scrollbar wrap-style="max-height: 650px;">
        <s-form ref="backTaskForm" :model='backTaskForm.networkCfgTask' :rules="rules" label-width="120px">
          <s-form-item label="任务名称" prop="taskName">
            <s-input v-model="backTaskForm.networkCfgTask.taskName" style="width:400px;"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop='isPeriod'>
            <s-radio-group v-model="backTaskForm.networkCfgTask.isPeriod">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-period v-model="backTaskForm.networkCfgTask.tScheduleTime" :showPeriodItem="showPeriodItem"
                    ref="period"></s-period>
          <s-form-item label="备注" prop="remark">
            <s-input v-model="backTaskForm.networkCfgTask.remark" type='textarea' style="width:400px;"></s-input>
          </s-form-item>
        </s-form>
        <div style="font-weight:600;margin-bottom:10px">选择资产</div>
        <s-table-page ref="stable" :data="logList" :max-height='300' :show-header-checkbox="true"
                      :header-search="getHeaderSearch()" @selection-change='handleSelection'>
          <s-table-column type="selection"></s-table-column>
          <s-table-column label="资产名称" prop='itcompName'></s-table-column>
          <s-table-column label="IP地址" prop='controlAdderss'></s-table-column>
          <s-table-column label="资产类型" prop='citypeName'></s-table-column>
          <s-table-column label="厂商" prop='itManufacturer'></s-table-column>
          <s-table-column label="型号" prop='productName'></s-table-column>
        </s-table-page>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveData">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import {cloneDeep} from 'lodash';
  import $axios from 'sunflower-ajax';
  import sPeriod from '@/components/periodFormItem/Period'

  export default {
    data() {
      let checkRepeatName = (rule, value, callback) => {  // 校验重复名称
        let vm = this
        if (value !== vm.editTaskName) {
          if (value) {
            if (vm.taskNameArr.indexOf(value) !== -1) {
              callback(new Error('该名称已经存在！'));
            } else {
              callback()
            }
          }
        } else {
          callback()
        }
      };
      return {
        editTaskName: '',
        dialogFlag: false,
        backTaskForm: {
          networkCfgTask: {
            taskName: '',
            isPeriod: 0,
            remark: '',
            tScheduleTime: {
              timeType: 1,
              day: 1,
              week: 1,
              month: 1,
              year: 1,
              dayOfWeek: [2],
              dayOfMonth: [1],
              monthOfYear: 1,
              isForever: 0,
              firstFireTime: undefined,
              endFireTime: undefined
            }
          },
          networkCfgTaskDeviceList: []
        },
        logList: [],
        rules: {
          taskName: [{max: 50, message: '不能超过50个字符', trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: checkRepeatName, trigger: 'blur'}],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        showPeriodItem: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: String,
      editBackupData: Object,
      taskNameArr: {
        type: Array,
        default: []
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      logList: {
        immediate: true,
        handler(val) {
          if (this.logList.length > 0) {
            this.$nextTick(() => {
              this.logList.map(ele => {
                this.editBackupData.networkCfgTaskDeviceList.map(val => {
                  if (ele.uuid === val.deviceUuid) {
                    this.$refs.stable.toggleRowSelection(ele, true)
                  }
                })
              })
            })
          }
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      },
      'backTaskForm.networkCfgTask.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    },
    components: {
      sPeriod
    },
    created() {
      $axios.get(`/netConfigTask/getSelectNetItcompInfoList`).then(({data}) => {
        this.logList = data
      })
      if (this.editBackupData.networkCfgTask) {
        this.backTaskForm.networkCfgTask = this.editBackupData.networkCfgTask
        this.editTaskName = this.editBackupData.networkCfgTask.taskName
      }
    },
    mounted() {

    },
    methods: {
      handleSelection(val) {
        let arr = []
        val.map(e => {
          arr.push({deviceUuid: e.uuid})
        })
        this.backTaskForm.networkCfgTaskDeviceList = arr
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'itManufacturer', 'productName']
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
      delNotNeedKey(arr, target) {
        for (var key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      saveData() {
        let vm = this
        vm.$refs['backTaskForm'].validate(valid => {
          if (valid) {
            let parms = cloneDeep(vm.backTaskForm)
            console.log(parms)
            parms.networkCfgTask = vm.formattScheduleTime(parms.networkCfgTask)
            parms.networkCfgTask.creatTme = null
            $axios.post(`/netConfigTask/updateNetConfigTask`, parms).then(({data}) => {
              if (data === '1') {
                vm.$message.success('编辑备份任务成功');
                vm.$emit('resore', true)
                vm.dialogFlag = false
              } else {
                vm.$message.error('编辑备份任务失败');
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  .s-scrollbar-bar
    right -15px
</style>
