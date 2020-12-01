<template>
  <div>
    <s-tab v-model="activeTab">
      <s-tab-pane label='业务角色稽核' name="pane1" v-if="judgeRoleBtn('assetsManage_businessRoleCollection')">
        <Role-Auditing v-if="activeTab === 'pane1'"></Role-Auditing>
      </s-tab-pane>
      <s-tab-pane label='业务账号稽核' name="pane2" v-if="judgeRoleBtn('assetsManage_businessAccountCollection')">
        <AccountAuditing v-if="activeTab === 'pane2'"></AccountAuditing>
      </s-tab-pane>
      <s-tab-pane label='业务账号同步' name="pane3" v-if="judgeRoleBtn('assetsManage_businessAccountSync')">
        <BusinessSync v-if="activeTab === 'pane3'"></BusinessSync>
      </s-tab-pane>
    </s-tab>
  </div>
</template>
<script>
  import RoleAuditing from './RoleAuditing.vue'
  import AccountAuditing from './AccountAuditing.vue'
  import BusinessSync from './BusinessSync.vue'
  export default {
    data() {
      return {
        tabNameArr: ['assetsManage_businessRoleCollection', 'assetsManage_businessAccountCollection', 'assetsManage_businessAccountSync'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      RoleAuditing,
      AccountAuditing,
      BusinessSync
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    methods: {
    }
  }
</script>
