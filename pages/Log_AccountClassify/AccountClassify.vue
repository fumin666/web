<template>
  <section class="log-alarm-more content">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="账号分类统计" name="pane1" v-if="judgeRoleBtn('logCenter_assetAccountType')">
        <asset-account-category v-if="activeTab === 'pane1'"></asset-account-category>
      </s-tab-pane>
      <!--<s-tab-pane label="业务账号分类" name="pane2" v-if="judgeRoleBtn('logCenter_businessAccountType')">-->
        <!--<operation-account-category v-if="activeTab === 'pane2'"></operation-account-category>-->
      <!--</s-tab-pane>-->
    </s-tab>
  </section>
</template>
<script>
  import AssetAccountCategory from './AssetAccount/AssetAccountCategory'
  import OperationAccountCategory from './Person_userClassify/OperationAccountCategory'
  export default {
    data () {
      return {
        tabNameArr: ['logCenter_assetAccountType', 'logCenter_businessAccountType'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      AssetAccountCategory,
      OperationAccountCategory
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
