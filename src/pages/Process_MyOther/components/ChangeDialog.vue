<template>
<s-form :model="changeform" :rules="formrules" ref="changeform" label-width="120px" style="margin-left: 20px">
  <s-form-item label="计划开始时间 :" prop="startTime">
    <s-date-picker
      type="datetime"
      placeholder="选择开始时间"
      v-model="changeform.startTime"
      :editable="false"
      value-format="yyyy-MM-dd HH:mm:ss"
      format="yyyy-MM-dd HH:mm:ss"
      :picker-options="disableAfterToday1"
      @change="getDateRangeStart"
      style="width: 80%"
    >
    </s-date-picker>
  </s-form-item>
  <s-form-item label="计划结束时间 :" prop="endTime">
    <s-date-picker
      type="datetime"
      placeholder="选择结束时间"
      v-model="changeform.endTime"
      :editable="false"
      value-format="yyyy-MM-dd HH:mm:ss"
      format="yyyy-MM-dd HH:mm:ss"
      :picker-options="disableAfterToday2"
      @change="getDateRangeEnd"
      style="width: 80%">
    </s-date-picker>
  </s-form-item>
  <s-form-item label="建议选择时间  :">
  <div>可选时间</div>
    <s-scrollbar wrap-style="max-height: 200px;">
     <div class="sucessdata" v-for="item in noConflitData">
      <span class="rightTime">{{item.startTime}}</span> ~ <span class="rightTime">{{item.endTime}}</span>
     </div>
    </s-scrollbar>
  </s-form-item>
</s-form>
</template>

<script>
 import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        changeform: {
          startTime: '',
          endTime: ''
        },
        formrules: {
          startTime: [{required: true, message: '不能为空', trigger: 'blur'}],
          endTime: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        noConflitData: [],
        disableAfterToday1: {
        },
        disableAfterToday2: {
        }
      }
    },
    created() {
    this.getTime()
    },
    methods: {
      getDateRangeStart(val) {
        let self = this
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.changeform.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.changeform.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          self.changeform.startTime = val
          self.disableAfterToday2 = {
            disabledDate(time) {
              return time.getTime() < new Date(self.changeform.startTime) - 24 * 60 * 60 * 1000
            }
          }
        }
      },
      getDateRangeEnd(val) {
        let self = this
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.changeform.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.changeform.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          self.changeform.endTime = val
          this.disableAfterToday1 = {
            disabledDate(time) {
              return time.getTime() > new Date(self.changeform.endTime)
            }
          }
        }
      },
      getTime() {
          $axios.get(`/itilWorkflowCenter/getNoConflictTimeArea/${this.uuid}`).then(({data}) => {
          this.noConflitData = data
         })
      }
    },
    props: {
      uuid: String
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
 .sucessdata
  .rightTime
    color #6cd2fd
</style>
