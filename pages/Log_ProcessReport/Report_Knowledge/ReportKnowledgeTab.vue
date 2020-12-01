/**
* Created by songyf on 2019/7/29.
* 报表中心-流程统计报表-发布流程报表.
*/

<template>
  <div style="margin: 20px 0 20px 5px">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="知识库趋势统计" name="pane1" v-if="judgeRoleBtn('logCenter_knowledgeTrend')">
        <knowledge-trend v-if="activeTab === 'pane1'"></knowledge-trend>
      </s-tab-pane>
      <s-tab-pane label="知识库发布率统计" name="pane2" v-if="judgeRoleBtn('logCenter_knowledgePublishRate')">
        <knowledge-release v-if="activeTab === 'pane2'"></knowledge-release>
      </s-tab-pane>
      <s-tab-pane label="知识库使用率统计" name="pane3" v-if="judgeRoleBtn('logCenter_knowledgeUsage')">
        <knowledge-use v-if="activeTab === 'pane3'"></knowledge-use>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import KnowledgeTrend from './KnowledgeTrend'
  import KnowledgeRelease from './KnowledgeRelease'
  import KnowledgeUse from './KnowledgeUse'
  export default {
    data() {
      return {
        tabNameArr: ['logCenter_knowledgeTrend', 'logCenter_knowledgePublishRate', 'logCenter_knowledgeUsage'], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    components: {
      KnowledgeTrend,
      KnowledgeRelease,
      KnowledgeUse
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    }
  }
</script>
<style lang="stylus">

</style>
