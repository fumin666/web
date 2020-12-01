<!--
 * @Author: songyf
 * @Date: 2019-11-25
 * @LastEditors: songyf
 * @Description: 运维中心-系统管理员-一级页面.
 -->

<template>
  <s-scrollbar wrap-style="max-height: calc(100vh - 155px);" style="margin: 20px">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="运维设置" name="pane1" v-if="judgeRoleBtn('operationCenter_operationSettings')">
        <oper-set v-if="activeTab === 'pane1'"></oper-set>
      </s-tab-pane>
      <s-tab-pane label="特殊运维设置" name="pane2" v-if="judgeRoleBtn('operationCenter_specialOperationSettings')">
        <special-set v-if="activeTab === 'pane2'"></special-set>
      </s-tab-pane>
      <s-tab-pane label="自定义脚本设置" name="pane3" v-if="judgeRoleBtn('operationCenter_customScriptSet')">
        <custom-set v-if="activeTab === 'pane3'"></custom-set>
      </s-tab-pane>
    </s-tab>
  </s-scrollbar>
</template>

<script>
  import operSet from '@/pages/Operation_TotalSet/OperSet'
  import specialSet from '@/pages/Operation_TotalSet/SpecialSet'
  import customSet from '@/pages/Operation_CustomSet/CustomSet'
  export default {
    data() {
      return {
        tabNameArr: [
          'operationCenter_operationSettings',
          'operationCenter_specialOperationSettings',
          'operationCenter_customScriptSet'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      operSet,
      specialSet,
      customSet
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style>
  .event-rules {
    margin: 20px 0;
  }
</style>

