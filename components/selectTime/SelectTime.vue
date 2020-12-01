<template>
  <s-form
    class="search_form" style="margin:10px 0" label-width='90px' :inline="true">
    <div>
      <s-form-item label="日期单位：">
        <s-select v-model="period" @change="showNext">
          <s-option label="年" value="0"></s-option>
          <s-option label="月" value="1"></s-option>
          <s-option label="日" value="2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="开始日期：">
        <s-date-picker v-model="beginTimes" v-if="bloomYear" :clearable="false" :editable="false" type="year" value-format="yyyy-MM-dd 00:00:00"
                       format="yyyy-MM-dd 00:00:00" @change="getStartTime">
        </s-date-picker>
        <s-date-picker v-model="beginTimes" v-if="bloomMonth" :clearable="false" :editable="false" type="month" value-format="yyyy-MM-dd 00:00:00"
                       format="yyyy-MM-dd 00:00:00" @change="getStartTime">
        </s-date-picker>
        <s-date-picker v-model="beginTimes" v-if="bloomDate" :clearable="false" :editable="false" type="date" value-format="yyyy-MM-dd 00:00:00"
                       format="yyyy-MM-dd 00:00:00" @change="getStartTime">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="结束日期：">
        <s-date-picker v-model="endTimes" v-if="bloomYear" :clearable="false" :editable="false" type="year" value-format="yyyy-12-31 23:59:59"
                       format="yyyy-12-31 23:59:59" @change="getEndTime">
        </s-date-picker>
        <s-date-picker v-model="endTimes" v-if="bloomMonth" :clearable="false" :editable="false" type="month" value-format="yyyy-MM-dd 23:59:59"
                       format="yyyy-MM-dd 23:59:59" @change="getEndTime">
        </s-date-picker>
        <s-date-picker v-model="endTimes" v-if="bloomDate" :clearable="false" :editable="false" type="date" value-format="yyyy-MM-dd 23:59:59"
                       format="yyyy-MM-dd 23:59:59" @change="getEndTime">
        </s-date-picker>
      </s-form-item>
     <!-- slot 表单-->
      <slot name="serachForm"></slot>
    </div>
    <!-- slot 查询按钮-->
    <slot name="searchBtn"></slot>
  </s-form>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        period: '2',
        beginTimes: `${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (1 + new Date().getMonth()) : 1 + new Date().getMonth()}-${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date().getDate()} 00:00:00`,
        endTimes: `${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (1 + new Date().getMonth()) : 1 + new Date().getMonth()}-${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date().getDate()} 23:59:59`,
        bloomYear: false,
        bloomMonth: false,
        bloomDate: true
      }
    },
    methods: {
      getStartTime(val) {
        if (val == null) {
          val = ''
        }
        if (this.endTimes == null) {
          this.endTimes = '';
        }
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.endTimes.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.beginTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.beginTimes = val;
        }
      },
      getEndTime(val) {
        if (val == null) {
          val = ''
        }
        if (this.beginTimes == null) {
          this.beginTimes = '';
        }
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.beginTimes.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.endTimes = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          // 月
          if (this.period === '1') {
            let arr = val.split('-');
            let day = arr[2].split(' ');
            let day1 = new Date(arr[0], arr[1], 0).getDate();// 获取月的天数
            let day2 = day1 + ' ' + day[1];
            val = arr[0] + '-' + arr[1] + '-' + day2;// 返回此月的最后一天
          }
          this.endTimes = val;
        }
      },
      showNext(val) {
        this.beginTimes = '';
        this.endTimes = '';
        switch (val) {
          case '0':
            this.bloomYear = true;
            this.bloomMonth = false;
            this.bloomDate = false;
            this.beginTimes = new Date().getFullYear() + '-01-01 00:00:00'
            this.endTimes = new Date().getFullYear() + '-12-31 23:59:59'
            break;
          case '1':
            this.bloomMonth = true;
            this.bloomDate = false;
            this.bloomYear = false;
            let M = parseInt(new Date().getMonth() + 1) > 10 ? parseInt(new Date().getMonth() + 1) : '0' + parseInt(new Date().getMonth() + 1)
            this.beginTimes = new Date().getFullYear() + '-' + M + '-01 00:00:00'
            let D = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
            this.endTimes = new Date().getFullYear() + '-' + M + '-' + D + ' 23:59:59'
            break;
          case '2':
            this.bloomDate = true;
            this.bloomYear = false;
            this.bloomMonth = false;
            let m = parseInt(new Date().getMonth() + 1) > 10 ? parseInt(new Date().getMonth() + 1) : '0' + parseInt(new Date().getMonth() + 1)
            let d = new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate()
            this.beginTimes = new Date().getFullYear() + '-' + m + '-' + d + ' 00:00:00'
            this.endTimes = new Date().getFullYear() + '-' + m + '-' + d + ' 23:59:59'
            break;
        }
      }
    },
    created() {
    }
  }
</script>
