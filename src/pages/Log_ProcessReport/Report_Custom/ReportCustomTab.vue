<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表.
 * @Date: 2020-03-18 09:55:55
 * @LastEditors: mybells
 -->
<template>
  <div style="margin: 20px 0 20px 5px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="报表配置" name="pane1" v-if="judgeRoleBtn('logCenter_dbaCustom_config')">
        <custom-config v-if="activeTab === 'pane1'"></custom-config>
      </s-tab-pane>
      <s-tab-pane label="报表生成" name="pane2" v-if="judgeRoleBtn('logCenter_dbaCustom_record')">
        <custom-generate v-if="activeTab === 'pane2'"></custom-generate>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import CustomConfig from './CustomConfig'
  import CustomGenerate from './CustomGenerate'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_dbaCustom_config', 'logCenter_dbaCustom_record'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      CustomConfig,
      CustomGenerate
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
