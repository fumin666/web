<template>
  <s-form ref="form" :model="form" :rules="formRules">
    <s-form-item label="选择资产重要程度" prop="importancelist">
      <s-checkbox-group v-model="form.importancelist">
        <s-checkbox :label="2">很高</s-checkbox>
        <s-checkbox :label="3">高</s-checkbox>
        <s-checkbox :label="4">中等</s-checkbox>
        <s-checkbox :label="5">低</s-checkbox>
        <s-checkbox :label="6">很低</s-checkbox>
      </s-checkbox-group>
    </s-form-item>
    <s-form-item label="周期执行" prop="isPeriodicTask">
      <s-switch v-model="form.isPeriodicTask" :active-value="1" :inactive-value="0"></s-switch>
    </s-form-item>
    <s-period v-if="periodShow" v-model="form.tScheduleTime" :showPeriodItem="showPeriodItem" :isShowNow="'is-show-now'" ref="period"></s-period>
  </s-form>
</template>

<script>
  import sPeriod from '@/components/periodFormItem/Period'
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        showPeriodItem: false, // 是否启动周期时间
        form: {
          uuid: '',
          isPeriodicTask: 1,
          importancelist: [],
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
        periodShow: false,
        formRules: {
          isPeriodicTask: [{required: true}],
          importancelist: [{type: 'array', required: true, message: '资产重要程度不能为空', trigger: 'blur'}]
        }
      }
    },
    components: {
      sPeriod
    },
    watch: {
      'form.isPeriodicTask': {
        immediate: true,
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    },
    created() {
      $axios.get('/safetyInspect/getSafetyInspectConf').then(res => {
        this.periodShow = true
        this.form.uuid = res.data.uuid
        this.form.isPeriodicTask = res.data.isPeriodicTask
        this.form.tScheduleTime = res.data.tScheduleTime
        this.form.importancelist = res.data.importancelist
      })
    }
  }
</script>

<style scoped>

</style>
