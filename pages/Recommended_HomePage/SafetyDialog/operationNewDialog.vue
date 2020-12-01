<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-31 15:58:16
 * @LastEditTime: 2019-09-19 11:21:40
 * @LastEditors: Please set LastEditors
 -->
<template>
  <s-dialog v-model="dialogFlag" title="最新通知" max-height=500  width="800px">
    <div style="min-height: 200px" v-nodata="newEvents.length===0">
      <s-scrollbar wrap-style="height: 450px;" >
        <div style="margin:0 20px;" v-for="(item, index) in newEvents" :key="index">
          <div v-if="item.typeStr==='审批通过'">
            <div style="height:20px;">
              <div class="circular"></div>
              <div class="notice_time">{{item.updateTime}}</div>
            <div class="notice_maintenance" style="border:1px solid #FDA85C;" >运维审批</div>
            </div>
            <div class="notice_content">
              <div class="notice_font">名称：{{item.taskName}}</div>
              <div class="notice_font">执行时间：{{item.beginTime}}～{{item.endTime}}</div>
              <div class="notice_font">执行周期：{{item.strPeriod}}</div>
              <div class="notice_font" style="color:#53BF7C;margin-top:20px;">{{item.typeStr}}</div>
            </div>
          </div>
          <div v-if="item.typeStr==='审批拒绝'">
            <div style="height:20px;">
              <div class="circular"></div>
              <div class="notice_time">{{item.updateTime}}</div>
              <div class="notice_maintenance" style="border:1px solid #FDA85C;color:#FDA85C;" >运维审批</div>
            </div>
            <div class="notice_content">
              <div class="notice_font">名称：{{item.taskName}}</div>
              <div class="notice_font">执行时间：{{item.beginTime}}～{{item.endTime}}</div>
              <div class="notice_font">执行周期：{{item.strPeriod}}</div>
              <div class="notice_font" style="color:red;margin-top:20px;">{{item.typeStr}}</div>
            </div>
          </div>
        </div>
      </s-scrollbar>
    </div>
  </s-dialog>
</template>
<style  scoped>
.circular {
  width: 14px;
  height: 14px;
  border: 1px solid #fda85c;
  border-radius: 50%;
  float: left;
}
.notice_time {
  float: left;
  font-family: PingFang SC;
  margin-left: 20px;
  font-size: 14px;
  line-height: 17px;
  opacity: 0.45;
}
.notice_maintenance {
  float: right;
  width: 80px;
  text-align: center;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 2px;
  opacity: 0.65;
  cursor: pointer;
  color:#FDA85C;
}
.notice_maintenance:hover {
  background: #fda85c;
  color: #fff
}
.notice_content {
  padding: 0px 0 0 30px;
  margin-left: 7px;
  height: 150px;
  border-left: 1px solid #e1e1e1;
}
.notice_content .notice_font {
  font-family: PingFang SC;
  font-size: 14px;
  margin-top: 5px;
  line-height: 20px;
  opacity: 0.65;
}
</style>
<script>
  import $axios from 'sunflower-ajax'
  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false,
        newEvents: [],
        newEventstime: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getNewEventList()
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: []
        }
      },
      formatDate(seconds) {
        if (seconds) {
          let date = new Date()
          date.setTime(seconds)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      },
      getNewEventList() {
        $axios.get('/omaIndex/getMyApplyApprovalOrder/10').then(res => {
          this.newEvents = res.data
          this.newEventstime = this.formatDate(res.data.updateTime * 1000)
        });
      },
      cons(detail) {
        this.$emit('chooseDialog', detail)
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
