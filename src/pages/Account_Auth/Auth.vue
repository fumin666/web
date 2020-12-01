<template>
  <section class="account-auth login-set" style="margin-left:10px;margin-right:10px">
    <s-tab type="card" :animated="false" v-model="activeTab">
      <s-tab-pane label="授权策略管理" name="pane1" v-if="judgeRoleBtn('accountManage_authorizationPolicy') || judgeRoleBtn('gradeProtect_rsAuthManage')">
        <auth-list v-if="activeTab === 'pane1'"></auth-list>
      </s-tab-pane>
      <s-tab-pane label="访问规则管理" name="pane2" v-if="judgeRoleBtn('accountManage_accessRules') || judgeRoleBtn('gradeProtect_rsAccessRuleManage')">
        <rule-list v-if="activeTab === 'pane2'"></rule-list>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  import AuthList from './AuthList';
  import RuleList from './RuleList';

  export default {
    components: {
      AuthList,
      RuleList
    },

    data() {
      return {
        tabNameArr: ['accountManage_authorizationPolicy', 'accountManage_accessRules'], // 页签名字的集合
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>

<style>
  .account-auth {
    margin-top: 20px;
  }
</style>
