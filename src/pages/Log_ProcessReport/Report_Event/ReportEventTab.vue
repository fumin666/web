/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-事件流程报表.
*/

<template>
  <div>
    <s-tab type="card" v-model="activeTab" style="margin: 20px 0 20px 5px">
      <s-tab-pane label="事件详情汇总" name="pane1" v-if="judgeRoleBtn('logCenter_incidentDetails')">
        <event-details v-if="activeTab === 'pane1'"></event-details>
      </s-tab-pane>
      <s-tab-pane label="事件平均解决时间" name="pane2" v-if="judgeRoleBtn('logCenter_incidentSolveTime')">
        <event-solve-time v-if="activeTab === 'pane2'"></event-solve-time>
      </s-tab-pane>
      <s-tab-pane label="事件解决百分比" name="pane3" v-if="judgeRoleBtn('logCenter_incidentSolveTimePercent')">
        <event-percentage v-if="activeTab === 'pane3'"></event-percentage>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import EventDetails from './EventDetails'
  import EventSolveTime from './EventSolveTime'
  import EventPercentage from './EventPercentage'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_incidentDetails', 'logCenter_incidentSolveTime', 'logCenter_incidentSolveTimePercent'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      EventDetails,
      EventSolveTime,
      EventPercentage
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
