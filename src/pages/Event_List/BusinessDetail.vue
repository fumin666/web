<template>
  <section id="businessDetail">
    <s-scrollbar wrap-style="max-height:450px;">
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">用户名：</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light">{{detailData.account_name}}</div>
        </s-col>
        <s-col :span="5">
          <div class="grid-content bg-purple">事件时间：</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light">{{detailData.start_time}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">事件级别：</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light">{{levels[rowData.alarm_level] || levelStr}}</div>
        </s-col>
        <s-col :span="5">
          <div class="grid-content bg-purple">触发规则：</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light">{{rowData.policy_name}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">事件原因：</div>
        </s-col>
        <s-col :span="7">
          <s-tooltip :content="rowData.alarm_value">
            <div class="grid-content bg-purple-light overFlowTip">{{rowData.alarm_value}}</div>
          </s-tooltip>
        </s-col>
        <s-col :span="5">
          <div class="grid-content bg-purple">URL：</div>
        </s-col>
        <s-col :span="7">
          <s-tooltip :content="detailData.url">
            <div class="grid-content bg-purple-light overFlowTip">{{detailData.url}}</div>
          </s-tooltip>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">参数类型：</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light">{{detailData.action_type}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">参数：</div>
        </s-col>
        <s-col :span="19">
          <div class="grid-content bg-purple-light">{{detailData.post_arg}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">Cookie值：</div>
        </s-col>
        <s-col :span="19" style="word-wrap:break-word">
          <div class="grid-content bg-purple-light">{{detailData.cookie}}</div>
        </s-col>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        detailData: {},
        levels: ['未知', '正常', '提示', '警告', '次要', '主要', '严重']
      }
    },
    props: {
      rowData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
      formatDate(seconds) {
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
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
      }
    },
    created() {
      // 业务审计详情
      $axios.get(`/dbaIncident/getMongdb/t_data_url/biz_id/${this.rowData.biz_id}`).then(res => {
        let resData = res.data
        if (resData instanceof Array && resData[0]) {
          this.detailData = resData[0]
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #businessDetail
    .overFlowTip
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .footerRow
      margin-top 15px
      text-align right
      .s-button
        &:nth-of-type(1)
         margin-right 20px
</style>
