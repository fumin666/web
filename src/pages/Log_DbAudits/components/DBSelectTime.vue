<template>
  <s-form-item>
    <s-form-item label="日期单位：">
      <s-select v-model="period" @change="showNext">
        <s-option label="月" value="3"></s-option>
        <s-option label="周" value="2"></s-option>
        <s-option label="日" value="1"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="选择日期：">
      <s-date-picker v-model="beginTimes" v-if="bloomYear" :clearable="false" :editable="false" type="week" format="yyyy 第 WW 周" @change="getStartTime">
      </s-date-picker>
      <s-date-picker v-model="beginTimes" v-if="bloomMonth" :clearable="false" :editable="false" type="month" format="yyyy-MM" @change="getStartTime">
      </s-date-picker>
      <s-date-picker v-model="beginTimes" v-if="bloomDate" :clearable="false" :editable="false" type="date" format="yyyy-MM-dd" @change="getStartTime">
      </s-date-picker>
    </s-form-item>
  </s-form-item>
</template>

<script>
  import {cloneDeep} from 'lodash'
  export default {
    components: {
    },
    data() {
      return {
        period: '1',
        beginTimes: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()}`,
        bloomMonth: false,
        bloomDate: true,
        bloomYear: false,
        formatBegin: '',
        formatEnd: ''
      }
    },
    methods: {
      getStartTime(val) {
        let nowTime = val
        this.formatBegin = nowTime
        let cloneTime = cloneDeep(nowTime)
        let end
        switch (this.period) {
          case '1':
            end = cloneTime.setDate(cloneTime.getDate() + 1);
            break
          case '2':
            end = cloneTime.setDate(cloneTime.getDate() + 6);
            break
          case '3':
            end = cloneTime.setMonth(cloneTime.getMonth() + 1);
            break
        }
        this.formatEnd = new Date(end)
      },
      showNext(val) {
        this.beginTimes = '';
        this.endTimes = '';
        switch (val) {
          case '1':
            this.bloomYear = false;
            this.bloomMonth = false;
            this.bloomDate = true;
            break;
          case '2':
            this.bloomMonth = false;
            this.bloomDate = false;
            this.bloomYear = true;
            break;
          case '3':
            this.bloomDate = false;
            this.bloomYear = false;
            this.bloomMonth = true;
            break;
        }
      }
    },
    created() {
      let time = this.beginTimes
      let beginVal = new Date(Date.parse(time.replace(/-/g, '/')));
      this.formatBegin = beginVal
      let cloneTime = cloneDeep(beginVal)
      this.formatEnd = new Date(cloneTime.setDate(cloneTime.getDate() + 1));
    }
  }
</script>
