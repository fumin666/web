/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-服务请求流程报表.
*/

<template>
  <div style="margin: 20px 0 20px 5px;">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="服务请求数据详情" name="pane1" v-if="judgeRoleBtn('logCenter_requestDateDetails')">
        <service-details v-if="activeTab === 'pane1'"></service-details>
      </s-tab-pane>
      <s-tab-pane label="服务请求成功解决率" name="pane2" v-if="judgeRoleBtn('logCenter_requestSucceedSolve')">
        <service-success v-if="activeTab === 'pane2'"></service-success>
      </s-tab-pane>
      <s-tab-pane label="服务请求受理解决时长" name="pane3" v-if="judgeRoleBtn('logCenter_requestDealTime')">
        <service-solve v-if="activeTab === 'pane3'"></service-solve>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import ServiceDetails from './ServiceDetails'
  import ServiceSuccess from './ServiceSuccess'
  import ServiceSolve from './ServiceSolve'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_requestDateDetails', 'logCenter_requestSucceedSolve', 'logCenter_requestDealTime'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      ServiceDetails,
      ServiceSuccess,
      ServiceSolve
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
