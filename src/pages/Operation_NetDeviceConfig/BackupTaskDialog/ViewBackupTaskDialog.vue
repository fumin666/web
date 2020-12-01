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
      title="查看">
        <s-form ref="backTaskForm" :model='backTaskForm.networkCfgTask' :rules="rules" label-width="120px">
          <s-form-item label="任务名称" prop="taskName">
            <s-input v-model="backTaskForm.networkCfgTask.taskName" disabled style="width:400px;"></s-input>
          </s-form-item>
          <s-form-item label="是否周期任务" prop='isPeriodicTask'>
            <s-radio-group v-model="backTaskForm.networkCfgTask.isPeriod" disabled>
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="备注" prop="remark">
              <s-input disabled v-model="backTaskForm.networkCfgTask.remark" type='textarea' style="width:400px;"></s-input>
          </s-form-item>
        </s-form>
        <s-period disableFromProp v-model="backTaskForm.networkCfgTask.tScheduleTime" :showPeriodItem="showPeriodItem" ref="period"></s-period>
        <div style="font-weight:600;margin-bottom:10px">选择资产</div>
        <s-table-page :data="taskData" :max-height='300'>
          <s-table-column label="资产名称" prop='itcompName'></s-table-column>
          <s-table-column label="IP地址" prop='controlAdderss'></s-table-column>
          <s-table-column label="资产类型" prop='citypeName'></s-table-column>
          <s-table-column label="厂商" prop='itManufacturer'></s-table-column>
          <s-table-column label="型号" prop='productName'></s-table-column>
        </s-table-page>
    </s-dialog>
  </div>
</template>

<script>
  // import {cloneDeep} from 'lodash';
  import $axios from 'sunflower-ajax';
  import sPeriod from '@/components/periodFormItem/Period'
  export default {
    data() {
      return {
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
        taskData: [],
        rules: {
          taskName: [
            {max: 120, message: '不能超过120个字符', trigger: 'blur'},
            {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        showPeriodItem: false
      }
    },
    props: {
        value: {
            type: Boolean,
            default: false
        },
        viewBackupData: Object
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
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
      this.backTaskForm.networkCfgTask.tScheduleTime = this.viewBackupData.tScheduleTime
      this.backTaskForm.networkCfgTask.taskName = this.viewBackupData.taskName
      this.backTaskForm.networkCfgTask.isPeriod = this.viewBackupData.isPeriod
      this.backTaskForm.networkCfgTask.remark = this.viewBackupData.remark
      $axios.get(`/netConfigTask/getSelectNetItcompInfoList`).then(({data}) => {
        this.logList = data
      })
    },
    mounted() {
      if (this.viewBackupData) {
        $axios.get(`/netConfigTask/getTaskDetailByuuid/${this.viewBackupData.uuid}`).then(({data}) => {
          // this.backTaskForm.networkCfgTask.tScheduleTime = data.networkCfgTask.tScheduleTime
          console.log(this.backTaskForm.networkCfgTask.tScheduleTime)
          let arr = []
          this.logList.map(ele => {
            data.networkCfgTaskDeviceList.map(val => {
              if (ele.uuid === val.deviceUuid) {
                arr.push(ele)
              }
            })
          })
          this.taskData = arr
        })
      }
    },
    methods: {
    }
  }
</script>
<style lang="stylus">
</style>
