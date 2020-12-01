/**
* @Author: songyf
* @Description: 报表中心-系统在线人员
* @Date: 2019-07-24
*/
<template>
  <section class="content" style="margin-top: 20px;">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="人员可用性状态统计" name="pane1" v-if="judgeRoleBtn('logCenter_userAvailabilityStatus')">
        <availability-status v-if="activeTab === 'pane1'"></availability-status>
      </s-tab-pane>
      <s-tab-pane label="人员登录状态统计" name="pane2" v-if="judgeRoleBtn('logCenter_userLoginStatus')">
        <login-status v-if="activeTab === 'pane2'"></login-status>
      </s-tab-pane>
      <s-tab-pane label="人员运维状态统计" name="pane3" v-if="judgeRoleBtn('logCenter_userOperationStatus')">
        <oper-status v-if="activeTab === 'pane3'"></oper-status>
      </s-tab-pane>
    </s-tab>
  </section>
</template>
<script>
  import AvailabilityStatus from './AvailabilityStatus';
  import LoginStatus from './LoginStatus';
  import OperStatus from './OperStatus';

  export default{
    components: {
      AvailabilityStatus,
      LoginStatus,
      OperStatus
    },
    data () {
      return {
        tabNameArr: ['logCenter_userAvailabilityStatus', 'logCenter_userLoginStatus', 'logCenter_userOperationStatus'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    methods: {}
  }
</script>
