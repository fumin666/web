<template>
  <div class="latest-notice">
    <div class="latest-notice-item" v-if="data.incidentType === 1">
      <s-row class="recent-row">
        <s-col :span="18" class="left-message">
          <s-row>
            <p><span class="date">{{data.createTimeStr}}</span></p>
          </s-row>
          <s-row>
            <p>名称 : <span>{{detail.ScriptAudit.taskName}}</span></p>
          </s-row>
          <s-row>
            <p>申请人 : <span :title="detail.ScriptAudit.userRealName">{{detail.ScriptAudit.userRealName}}</span></p>
          </s-row>
          <s-row>
            <p>执行周期 : <span :title="detail.ScriptAudit.strPeriod">{{detail.ScriptAudit.strPeriod}}</span></p>
          </s-row>
          <s-row>
            <p>执行时间 : <span :title="detail.scripttask.beginTimeDate">{{detail.scripttask.beginTimeDate}} ~ {{detail.scripttask.endTimeDate}}</span></p>
          </s-row>
        </s-col>
        <s-col :span="6" class="right-message">
          <s-row><p> <span class="notice-title">{{data.incidentName}}</span></p></s-row>
          <s-row style="margin-top: 35px"> <s-button @click="takeAction(data)">审批</s-button></s-row>
        </s-col>
      </s-row>
    </div>
    <div class="latest-notice-item" v-if="data.incidentType === 2">
      <s-row class="recent-row">
        <s-col :span="18" class="left-message">
          <s-row>
            <p><span class="date">{{data.createTimeStr}}</span></p>
          </s-row>
          <s-row>
            <p>申请人 : <span :title="detail.content.conUserName">{{detail.content.conUserName}}</span></p>
          </s-row>
          <s-row>
            <p>IP : <span :title="detail.content.controlAdderss">{{detail.content.controlAdderss}}</span></p>
          </s-row>
          <s-row>
            <p>协议 : <span :title="detail.content.protocolName">{{detail.content.protocolName}}</span></p>
          </s-row>
          <s-row>
            <p>设备账号 : <span :title="detail.content.accountName">{{detail.content.accountName}}</span></p>
          </s-row>
        </s-col>
        <s-col :span="6" class="right-message">
          <s-row>
            <p>
              <span class="notice-title">{{data.incidentName}}</span>
            </p>
          </s-row>
          <s-row style="margin-top: 35px"> <s-button @click="takeAction(data)">会同</s-button></s-row>
        </s-col>
      </s-row>
    </div>
    <div class="latest-notice-item" v-if="data.incidentType === 3">
      <s-row class="recent-row">
        <s-col :span="18" class="left-message">
          <s-row>
            <p><span class="date">{{data.createTimeStr}}</span></p>
          </s-row>
          <s-row>
            <p>申请人 : <span :title="detail.content.userRealName">{{detail.content.userRealName}}</span></p>
          </s-row>
          <s-row>
            <p>IP : <span :title="detail.content.deviceIp">{{detail.content.deviceIp}}</span></p>
          </s-row>
          <s-row>
            <p>协议 : <span :title="detail.content.protocolName">{{detail.content.protocolName}}</span></p>
          </s-row>
          <s-row>
            <p>设备账号 : <span :title="detail.content.accountName">{{detail.content.accountName}}</span></p>
          </s-row>
        </s-col>
        <s-col :span="6" class="right-message">
          <s-row><p> <span class="notice-title">{{data.incidentName}}</span></p></s-row>
          <s-row style="margin-top: 35px"> <s-button @click="takeAction(data)">接受</s-button></s-row>
        </s-col>
      </s-row>

    </div>
    <div class="latest-notice-item" v-if="data.incidentType === 4">
      <s-row class="recent-row">
        <s-col :span="18" class="left-message">
          <s-row>
            <p><span class="date">{{data.createTimeStr}}</span></p>
          </s-row>
          <s-row>
            <p>申请人 : <span :title="detail.content.userRealName">{{detail.content.userRealName}}</span></p>
          </s-row>
          <s-row>
            <p>IP : <span :title="detail.content.deviceIp">{{detail.content.deviceIp}}</span></p>
          </s-row>
          <s-row>
            <p>协议 : <span :title="detail.content.protocolName">{{detail.content.protocolName}}</span></p>
          </s-row>
          <s-row>
            <p>设备账号 : <span :title="detail.content.accountName">{{detail.content.accountName}}</span></p>
          </s-row>
        </s-col>
        <s-col :span="6" class="right-message">
          <s-row><p> <span class="notice-title">{{data.incidentName}}</span></p></s-row>
          <s-row style="margin-top: 35px"> <s-button @click="takeAction(data)">复核</s-button></s-row>
        </s-col>
      </s-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        detail: {}
      }
    },
    props: {
      data: {
        type: Object
      }
    },
    created() {
      console.log(this.data);
      let detail = JSON.parse(this.data.detailInfo)
      this.detail = JSON.parse(detail.message)
    },
    methods: {
      takeAction(detail) {
        this.$emit('chooseDialog', detail)
        this.$emit('eventDialog', detail)
      }
    }
  }
</script>

<style lang="stylus">
  .latest-notice-item
    .recent-row
      color rgba(0,0,0,.65)
      height 158px
      padding 16px
      box-sizing border-box
      .left-message
        line-height 20px
        p
          min-width 196px
          overflow:hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          color rgba(0,0,0,.65)
          .date
            font-size 12px
      .right-message
        .notice-title
          color #FF9023
          font-size 12px
          padding 2px 4px
          display inline-block
          text-align center
          border 1px solid #FFBF80
          box-sizing border-box
          border-radius 2px
          float right
        .s-button
          float right


</style>
