/**
* Created by alex on 2018/10/30.
*/
<template>
  <s-form ref="periodForm" :model="periodForm" :rules="rules" label-width="120px">
    <s-form-item v-if="showPeriodItem" label="执行周期" prop="timeType" class="required-tips">
      <s-select v-model="periodForm.timeType" :disabled="disableFromProp" style="width:80px" @change="typeChange">
        <s-option label="日" :value="1"></s-option>
        <s-option label="周" :value="2"></s-option>
        <s-option label="月" :value="3"></s-option>
        <s-option label="年" :value="4"></s-option>
      </s-select>
      <span style="margin: 0 10px">
        <span class="spanText">每隔</span>
        <s-form-item v-if="isShow([1])" style="display: inline-block" prop="day">
         <s-input :disabled="disableFromProp" v-model="periodForm.day" style="width:80px"></s-input>
        </s-form-item>
        <s-form-item v-if="isShow([2])" style="display: inline-block" prop="week">
         <s-input :disabled="disableFromProp" v-model="periodForm.week" style="width:80px"></s-input>
        </s-form-item>
        <s-form-item v-if="isShow([3])" style="display: inline-block" prop="month">
         <s-input :disabled="disableFromProp" v-model="periodForm.month" style="width:80px"></s-input>
        </s-form-item>
        <s-form-item v-if="isShow([4])" style="display: inline-block" prop="year">
         <s-input :disabled="disableFromProp" v-model="periodForm.year" style="width:80px"></s-input>
        </s-form-item>
        <span class="spanText">{{wordText[periodForm.timeType - 1]}}</span>
      </span>
      <s-select :disabled="disableFromProp" v-model="periodForm.dayOfWeek" multiple collapse-tags v-if="isShow([2])" style="width:100px">
        <s-option label="星期一" :value="1"></s-option>
        <s-option label="星期二" :value="2"></s-option>
        <s-option label="星期三" :value="3"></s-option>
        <s-option label="星期四" :value="4"></s-option>
        <s-option label="星期五" :value="5"></s-option>
        <s-option label="星期六" :value="6"></s-option>
        <s-option label="星期日" :value="7"></s-option>
      </s-select>
      <span v-if="isShow([4])" style="margin: 0 10px">
        <s-select :disabled="disableFromProp" v-model="periodForm.monthOfYear" @change="monthChange" style="width:80px">
          <s-option v-for="(item, index) in 12" :key="item.id" :label="`${index+1}`" :value="index+1"></s-option>
        </s-select>
        <span class="spanText">月</span>
      </span>
      <span v-if="isShow([3, 4])" style="margin: 0 10px">
        <s-select :disabled="disableFromProp" v-model="periodForm.dayOfMonth" multiple collapse-tags style="width:100px">
          <s-option v-for="(item, index) in this.monthDays" :key="item.id" :label="`${index+1}`" :value="index+1"></s-option>
        </s-select>
        <span class="spanText">日</span>
      </span>
    </s-form-item>
    <s-form-item label="开始时间" prop="firstFireTime" v-if="showTimeItem">
      <s-date-picker
        :disabled="disableFromProp"
        id="firstFireTime"
        :popper-class="isShowNow"
        v-model="periodForm.firstFireTime"
        type="datetime"
        :editable="false"
        value-format="yyyy-MM-dd HH:mm:ss">
      </s-date-picker>
    </s-form-item>
    <s-form-item v-if="showPeriodItem && showTimeItem" label="结束时间" prop="endFireTime">
      <s-date-picker
        id="endFireTime"
        :popper-class="isShowNow"
        :disabled="!!periodForm.isForever || disableFromProp"
        v-model="periodForm.endFireTime"
        type="datetime"
        :editable="false"
        value-format="yyyy-MM-dd HH:mm:ss">
      </s-date-picker>
      <s-checkbox :disabled="disableFromProp" v-model="periodForm.isForever" :true-label="1" :false-label="0">永不结束</s-checkbox>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils'

  export default {
    data () {
      return {
        rules: {
          day: [
            Validaters.NotNull,
            Validaters.integerNum
          ],
          week: [
            Validaters.NotNull,
            Validaters.integerNum
          ],
          month: [
            Validaters.NotNull,
            Validaters.integerNum
          ],
          year: [
            Validaters.NotNull,
            Validaters.integerNum
          ],
          firstFireTime: [Validaters.NotNull, Validaters.LargerNowDate],
          endFireTime: []
        },
        firstPickerOptions: {},
        lastPickerOptions: {},
        wordText: ['日', '周', '月', '年'],
        nowTimeType: 1,
        templateScheduleTime: {
          timeType: 1,
          day: 1,
          week: 1,
          month: 1,
          year: 1,
          dayOfWeek: [1],
          dayOfMonth: [1],
          monthOfYear: 1,
          isForever: 0,
          firstFireTime: undefined,
          endFireTime: undefined
        },
        periodForm: {
          timeType: 1,
          day: 1,
          week: 1,
          month: 1,
          year: 1,
          dayOfWeek: [1],
          dayOfMonth: [1],
          monthOfYear: 1,
          isForever: 0,
          firstFireTime: undefined,
          endFireTime: undefined
        },
        monthDays: 31
      }
    },
    created() {
      if (this.form === undefined) {
        console.log('you need a object for this')
      } else {
        let form = this.extend(this.templateScheduleTime, this.form)
        this.periodForm = form
        /* 周期类型选"年"，此时"月"字段取monthOfYear，从string类型转换为int类型 */
        if (this.periodForm.monthOfYear) {
          this.periodForm.monthOfYear = parseInt(this.periodForm.monthOfYear)
        }
      }
    },
    props: {
      isShowNow: { // 是否含有此刻按钮
        type: String,
        default: 'now'
      },
      disableFromProp: {
        type: Boolean,
        default: false
      },
      isPeriod: Number,
      form: Object,
      showPeriodItem: Boolean,
      showTimeItem: {
        type: Boolean,
        default: true
      }
    },
    model: {
      prop: 'form',
      event: 'change'
    },
    methods: {
      monthChange(val) {
        let obj = {
          '1': 31,
          '2': 29,
          '3': 31,
          '4': 30,
          '5': 31,
          '6': 30,
          '7': 31,
          '8': 31,
          '9': 30,
          '10': 31,
          '11': 30,
          '12': 31
        };
        // 防止出现选择大月31号，然后改成小月的情况
        this.periodForm.dayOfMonth = [];
        this.monthDays = obj[val];
      },
      typeChange(val) {
        this.periodForm.day = 1
        this.periodForm.week = 1
        this.periodForm.month = 1
        this.periodForm.year = 1
        this.periodForm.dayOfWeek = [1]
        this.periodForm.dayOfMonth = [1]
        this.periodForm.monthOfYear = 1
        this.monthDays = 31
      },
      isShow (val) {
        if (val.indexOf(this.periodForm.timeType) > -1) {
          return true
        } else {
          return false
        }
      },
      validateForm() {
        let validRes = false;
        this.$refs['periodForm'].validate((valid) => {
          if (valid) validRes = true;
        });
        return validRes;
      },
      clearValidate() {
        this.$refs['periodForm'].clearValidate()
      },
      extend(sourceObj, targetObj) {
        var res = {};
        for (let key in targetObj) {
          if (sourceObj.hasOwnProperty(key)) {
            targetObj[key] !== null ? res[key] = targetObj[key] : res[key] = sourceObj[key]
          }
          if ((key === 'dayOfWeek' || key === 'dayOfMonth') && !!(targetObj[key]) && !Array.isArray(targetObj[key])) {
            res[key] = targetObj[key].split(',').map(item => parseInt(item))
          }
        }
        return res;
      }
    },
    watch: {
      periodForm () {
        this.$emit('change', this.periodForm)
      },
      'periodForm.isForever': {
        handler: function (val) {
          val === 1 ? this.rules.endFireTime = [Validaters.LargerNowDate] : this.rules.endFireTime = [Validaters.NotNull, Validaters.LargerNowDate]
          this.clearValidate()
        },
        deep: true
      },
      /* 以下两个watch限制结束时间大于开始时间 */
      'periodForm.firstFireTime'(val) {
        if (this.showPeriodItem && val) {
          if (new Date(val) > new Date(this.periodForm.endFireTime) && this.periodForm.endFireTime) {
            this.periodForm.firstFireTime = undefined;
            this.$message.warning('开始时间必须小于结束时间！');
          }
        }
      },
      'periodForm.endFireTime'(val) {
        if (this.showPeriodItem && val) {
          if (!this.periodForm.firstFireTime) {
            this.periodForm.endFireTime = undefined;
            this.$message.warning('请先选择开始时间！');
          } else {
            if (new Date(this.periodForm.endFireTime) < new Date(this.periodForm.firstFireTime)) {
              this.periodForm.endFireTime = undefined;
              this.$message.warning('结束时间必须大于开始时间！');
            }
          }
        }
      }
    }
  }
</script>
