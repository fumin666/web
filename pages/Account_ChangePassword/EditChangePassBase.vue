<template>
  <s-form id="editPassTaskForm" ref="editPassTaskForm" :model="editPassTaskForm" :rules="editPassTaskRule" label-width="120px">
    <s-form-item label="改密任务名称:" prop="taskName">
      <s-input v-model="editPassTaskForm.taskName" :maxlength="20"></s-input>
    </s-form-item>

    <s-form-item label="是否周期任务" prop="isPeriod">
      <s-radio-group v-model="editPassTaskForm.isPeriod">
        <s-radio :label="0">否</s-radio>
        <s-radio :label="1">是</s-radio>
      </s-radio-group>
    </s-form-item>

    <s-period ref="peroids" v-model="editPassTaskForm.tScheduleTime" :showPeriodItem="!!(editPassTaskForm.isPeriod)"></s-period>
    <s-form-item label="改密类型">
      <s-select v-model="editPassTaskForm.taskType" placeholder="请选择" @change="changeTaskType">
        <s-option
          v-for="item in taskTypeOptions"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </s-option>
      </s-select>
    </s-form-item>

    <s-form-item label="口令长度:" prop="passwdLenth">
      <s-select v-model.number="editPassTaskForm.passwdLenth">
        <s-option label="8" :value="8" :key="8"></s-option>
        <s-option label="9" :value="9" :key="9"></s-option>
        <s-option label="10" :value="10" :key="10"></s-option>
        <s-option label="11" :value="11" :key="11"></s-option>
        <s-option label="12" :value="12" :key="12"></s-option>
        <s-option label="13" :value="13" :key="13"></s-option>
        <s-option label="14" :value="14" :key="14"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="口令组成:" prop="ctn">
      <s-checkbox label="包含数字" :true-label="1" :false-label="0" v-model.number="editPassTaskForm.passwdD"></s-checkbox>
      <s-checkbox label="包含小写字母" :true-label="1" :false-label="0" v-model.number="editPassTaskForm.passwdL" disabled></s-checkbox>
      <s-checkbox label="包含大写字母" :true-label="1" :false-label="0" v-model.number="editPassTaskForm.passwdU" disabled></s-checkbox>
      <s-checkbox label="包含特殊字符" :true-label="1" :false-label="0" v-model.number="editPassTaskForm.passwdS"></s-checkbox>
    </s-form-item>
    <!--<s-form-item label="备注">
      <s-input v-model="editPassTaskForm.remark" type="textarea" :rows="4" resize="none"></s-input>
    </s-form-item>-->
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  // import {Validaters} from 'sunflower-common-utils';
  import {intersectObj} from 'sunflower-common-utils';
  import { cloneDeep } from 'lodash';
  import sPeriod from '@/components/periodFormItem/Period';
  import Bus from '@/plugins/eventBus';

  export default{
    data () {
      return {
        taskTypeOptions: [
          {
            value: 0,
            name: '普通账号改密'
          }, {
            value: 1,
            name: '数据库账号改密'
          }
        ],
        editPassTaskForm: {
          taskName: '',
          passwdLenth: 8,
          passwdD: 0,
          passwdL: 1,
          passwdU: 1,
          passwdS: 0,
          isPeriod: 0,
          taskType: '',
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
        editPassTaskRule: {
          taskName: [
            {required: true, message: '请输入任务名称', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在6-20个字符', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      sPeriod
    },
    props: {
      originData: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 编辑时改密基础信息表单验证
      validateBase() {
        let validRes = false;
        this.$refs['editPassTaskForm'].validate((valid) => {
          if (valid) validRes = true;
        });
        return validRes;
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
        for (let key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      // 改密基础信息表单提交请求
      savePost(resolve, reject) {
        let newForm = this.formattScheduleTime(this.editPassTaskForm);
        newForm.uuid = this.originData.uuid;
        $axios.post('/tPasswdChangeTask/editTPasswdChangeTask', newForm).then((res) => {
          let resData = res.data
          if (resData === 'true') {
            resolve('base');
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            });
            reject('base');
          }
        })
      },
      // 编辑时重名验证，提交基础信息表单
      saveEditPassTaskForm() {
        return new Promise((resolve, reject) => {
          let _self = this;
          if (_self.requestFlag) {
            $axios.post('/tPasswdChangeTask/nameValidate', {name: _self.editPassTaskForm.taskName}).then((res) => {
              let data = res.data;
              if (data === 'false') {
                _self.savePost(resolve, reject);
              } else if (data === 'true') {
                _self.$message({
                  type: 'error',
                  message: '已存在同名改密任务，请勿重复！'
                });
                reject('base');
              } else {
                _self.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                });
                reject('base');
              }
            })
          } else {
            _self.savePost(resolve, reject);
          }
        });
      },
      changeTaskType () { // 改变数据库类型
        Bus.$emit('handleTaskType', this.editPassTaskForm.taskType);
      }
    },
    watch: {
    },
    created() {
      this.editPassTaskForm = intersectObj(this.editPassTaskForm, this.originData);
      this.changeTaskType();
      // this.originTaskName = this.editPassTaskForm.taskName;
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
#editPassTaskForm
  .Verticalmiddle
    height 30px
    line-height 35px
    padding-left 10px
</style>
