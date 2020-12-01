/**
* Created by alex on 2018/1/17.
*/

<template>
  <s-tab v-model="activeTab" type="card" style="margin: 20px 0" class="tab-style-box">
    <s-tab-pane label="组织机构图" name="pane1" v-if="judgeRoleBtn('accountManage_organizationChart')">
      <org-graph v-if="activeTab === 'pane1'"></org-graph>
    </s-tab-pane>
    <s-tab-pane label="人员管理" name="pane2" v-if="judgeRoleBtn('accountManage_peopleManagement')">
      <people-manage v-if="activeTab === 'pane2'"></people-manage>
    </s-tab-pane>
    <s-tab-pane label="离职人员管理" name="pane3" v-if="judgeRoleBtn('accountManage_leavePeopleManagement')">
      <peopleDimission v-if="activeTab === 'pane3'"></peopleDimission>
    </s-tab-pane>
    <s-tab-pane label="人员属性配置" name="pane4" v-if="judgeRoleBtn('accountManage_attributeConfiguration')">
      <peopleAttributeConf v-if="activeTab === 'pane4'"></peopleAttributeConf>
    </s-tab-pane>
  </s-tab>
</template>

<script type="text/babel">
  import orgGraph from '@/pages/Account_Organization/OrgGraph'
  import peopleManage from '@/pages/Account_Man/AssetStaff'
  import peopleDimission from '@/pages/Account_Man/PeopleDimission'
  import peopleAttributeConf from '@/pages/Account_Man/PeopleAttributeConf'

  export default {
    data() {
      return {
        tabNameArr: ['accountManage_organizationChart', 'accountManage_peopleManagement', 'accountManage_leavePeopleManagement'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      orgGraph,
      peopleManage,
      peopleDimission,
      peopleAttributeConf
    },
    methods: {
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      this.$route.query.tab && (this.activeTab = this.$route.query.tab)
    }
  }
</script>
<style lang="stylus">
  .tab-style-box
    .s-tabs-header
      margin 0 0 5px
</style>
