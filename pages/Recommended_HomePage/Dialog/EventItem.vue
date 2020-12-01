<template>
  <div>
    <div class="recentEventItem" v-if="data.incidentType === 1">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail default">
        <s-col :span="20">
          名称:{{detail.ScriptAudit.taskName}},申请人:{{detail.ScriptAudit.userRealName}},执行周期:{{detail.ScriptAudit.strPeriod}},
          执行时间:{{detail.scripttask.beginTimeDate}} ~ {{detail.scripttask.endTimeDate}}
        </s-col>
        <s-col :span="4">
          <s-button style="margin-right: 22px" class="specialBtn" @click="takeAction(data)">审批</s-button>
        </s-col>
      </s-row>
    </div>
    <div class="recentEventItem" v-if="data.incidentType === 2">
      <s-row class="title"><span>{{data.incidentName}}</span></s-row>
      <s-row class="time-title"><span>{{data.createTimeStr}}</span></s-row>
      <s-row class="detail current">
        <s-col :span="4">
          <s-row type="flex" justify="around">
            <s-col>
              <img :src="`static/images/topologyicon/default/${detail.content.iconName}.svg`" style="height: 36px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row type="flex" justify="around">
            <s-col>申请人: {{detail.content.conUserName}}</s-col>
            <s-col>IP: {{detail.content.controlAdderss}}</s-col>
          </s-row>
          <s-row type="flex" justify="around">
            <s-col>协议: {{detail.content.protocolName}}</s-col>
            <s-col>设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" justify="around">
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
          <s-row type="flex" justify="around">
            <s-col>
            <img :src="`static/images/topologyicon/default/${detail.content.iconName}.png`" style="width: 36px;height: 36px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row type="flex" justify="around">
            <s-col>申请人: {{detail.content.userRealName}}</s-col>
            <s-col>IP: {{detail.content.deviceIp}}</s-col>
          </s-row>
          <s-row type="flex" justify="around">
            <s-col>协议: {{detail.content.protocolName}}</s-col>
            <s-col>设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" justify="around">
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
          <s-row type="flex" justify="around">
            <s-col>
              <img :src="`static/images/topologyicon/default/${detail.content.iconName}.png`" style="width: 36px;height: 36px" alt="">
            </s-col>
          </s-row>
        </s-col>
        <s-col :span="16">
          <s-row type="flex" justify="around">
            <s-col>申请人: {{detail.content.userRealName}}</s-col>
            <s-col>IP: {{detail.content.deviceIp}}</s-col>
          </s-row>
          <s-row type="flex" justify="around">
            <s-col>协议: {{detail.content.protocolName}}</s-col>
            <s-col>设备账号: {{detail.content.accountName}}</s-col>
          </s-row>
        </s-col>
        <s-col :span="4">
          <s-row type="flex" justify="around">
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
