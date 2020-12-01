/**
* Created by songyf on 2019/7/29.
* 报表中心-账号使用情况统计.
*/

<template>
  <div class="event-rules">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="不活跃账号统计" name="pane1" v-if="show1 && (judgeRoleBtn('logCenter_inactiveAccountReport') || judgeRoleBtn('accountManage_inactiveAccountList'))">
        <inactive-account v-if="activeTab === 'pane1'"></inactive-account>
      </s-tab-pane>
      <s-tab-pane label="账号过期账号统计" name="pane2" v-if="show2 && (judgeRoleBtn('logCenter_accountExpirationReport') || judgeRoleBtn('accountManage_accountExpirationList'))">
        <overdue-account v-if="activeTab === 'pane2'" :moduleType="moduleType"></overdue-account>
      </s-tab-pane>
      <s-tab-pane label="密码过期账号统计" name="pane3" v-if="show3 && (judgeRoleBtn('logCenter_passwordExpirationReport') || judgeRoleBtn('accountManage_passwordExpirationList'))">
        <pw-overdue-account v-if="activeTab === 'pane3'" :moduleType="moduleType"></pw-overdue-account>
      </s-tab-pane>
      <s-tab-pane label="注销账号统计" name="pane4" v-if="show4 && judgeRoleBtn('logCenter_logOffAccountReport')">
        <cancellation-account v-if="activeTab === 'pane4'"></cancellation-account>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import InactiveAccount from './InactiveAccount'
  import OverdueAccount from './OverdueAccount'
  import PwOverdueAccount from './PwOverdueAccount'
  import CancellationAccount from './CancellationAccount'
  export default {
    data() {
      return {
        activeTab: 'pane1',
        show1: true,
        moduleType: 1, // 0——从账号进入   1——从报表进入
        show2: true,
        show3: true,
        show4: true
      }
    },
    components: {
      InactiveAccount,
      OverdueAccount,
      PwOverdueAccount,
      CancellationAccount
    },
    created() {
      let {params} = this.$route
      // 根据参数设置当前tab页
      if (params && params.tabIndex) {
        this.activeTab = `pane${parseInt(params.tabIndex)}`;
        this.show1 = this.activeTab === 'pane1';
        this.show2 = this.activeTab === 'pane2';
        this.show3 = this.activeTab === 'pane3';
        this.show4 = this.activeTab === 'pane4';
        this.moduleType = 0 // 从账号进入
      }
    }
  }
</script>
<style>
  .event-rules {
    margin: 20px 0 20px 5px;
  }
</style>
