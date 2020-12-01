<template>
  <div>
    <div class="recentEventItem" v-if="data.incidentType === 1">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail default">
        <s-col :span="20">
          <s-row type="flex" class="col-height">
            <s-col :span="12">名称: {{detail.ScriptAudit.taskName}}</s-col>
            <s-col :span="12">申请人: {{detail.ScriptAudit.userRealName}}</s-col>
            <s-col :span="24">执行周期: {{detail.ScriptAudit.strPeriod}}</s-col>
            <s-col :span="24">执行时间: {{detail.scripttask.beginTimeDate}} ~ {{detail.scripttask.endTimeDate}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" style="justify-content: flex-end;">
            <s-col>
              <s-button style="margin-right: 35px" class="specialBtn" @click="takeAction(data)">审批</s-button>
            </s-col>
          </s-row>
        </s-col>
      </s-row>
    </div>
    <div class="recentEventItem" v-if="data.incidentType === 2">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail current">
        <s-col :span="4">
          <s-row type="flex">
            <s-col>
              <img :src="`static/images/topologyicon/default/${detail.content.iconName}.svg`" style="height: 36px;margin-left: 10px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row>
            <s-col>申请人: <span>{{detail.content.conUserName}}</span></s-col>
            <s-col>IP: {{detail.content.controlAdderss}}</s-col>
          </s-row>
          <s-row>
            <s-col class="ellipsis item-min-width320" :title="detail.content.protocolName">协议: {{detail.content.protocolName}}</s-col>
            <s-col class="ellipsis item-min-width320" :title="detail.content.accountName">设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" style="justify-content: flex-end;">
            <s-col>
              <s-button @click="takeAction(data)">会同</s-button>
            </s-col>
          </s-row>
        </s-col>
      </s-row>
    </div>
    <div class="recentEventItem" v-if="data.incidentType === 3">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail current">
        <s-col :span="4">
          <s-row type="flex">
            <s-col>
              <img :src="`static/images/topologyicon/default/${detail.content.iconName}.png`" style="width: 36px;height: 36px;margin-left: 10px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row>
            <s-col>申请人: {{detail.content.userRealName}}</s-col>
            <s-col>IP: {{detail.content.deviceIp}}</s-col>
          </s-row>
          <s-row>
            <s-col class="ellipsis item-min-width320" :title="detail.content.protocolName">协议: {{detail.content.protocolName}}</s-col>
            <s-col class="ellipsis item-min-width320" :title="detail.content.accountName">设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" style="justify-content: flex-end;">
            <s-col>
              <s-button @click="takeAction(data)">接受</s-button>
            </s-col>
          </s-row>
        </s-col>
      </s-row>
    </div>
    <div class="recentEventItem" v-if="data.incidentType === 4">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail current">
        <s-col :span="4">
          <s-row type="flex">
            <s-col>
              <img :src="`static/images/topologyicon/default/${detail.content.iconName}.png`" style="height: 36px;margin-left: 10px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row>
            <s-col>申请人: {{detail.content.userRealName}}</s-col>
            <s-col>IP: {{detail.content.deviceIp}}</s-col>
          </s-row>
          <s-row>
            <s-col class="ellipsis item-min-width320" :title="detail.content.protocolName">协议: {{detail.content.protocolName}}</s-col>
            <s-col class="ellipsis item-min-width320" :title="detail.content.accountName">设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" style="justify-content: flex-end;">
            <s-col>
              <s-button @click="takeAction(data)">复核</s-button>
            </s-col>
          </s-row>
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
  .recentEventItem
    .col-height
      .s-col
        height 26px!important
    .item-min-width320
      min-width 320px
    .item-min-width160
      min-width 160px
</style>
