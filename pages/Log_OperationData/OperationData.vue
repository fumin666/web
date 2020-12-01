<template>
  <section class="log-alarm-more content operationData">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="会话审计" name="pane1" v-if="judgeRoleBtn('logCenter_businessDataSessionAudit')">
        <talk-audit v-if="activeTab === 'pane1'" :uuid="uuID"></talk-audit>
      </s-tab-pane>
      <s-tab-pane label="操作审计" name="pane2" v-if="judgeRoleBtn('logCenter_businessDataOperationAudit')">
        <operation-audit v-if="activeTab === 'pane2'" :isSearchOperation="isSearchOperation" :isStart="isStart" :isEnd="isEnd" @closeSqlEntry="isSearchOperation='';isStart='';isEnd=''"></operation-audit>
      </s-tab-pane>
      <s-tab-pane label="SQL模式审计" name="pane3" v-if="judgeRoleBtn('logCenter_businessDataSqlAudit')">
        <model-audit v-if="activeTab === 'pane3'" @formsql="formsql"></model-audit>
      </s-tab-pane>
      <s-tab-pane label="业务审计" name="pane4" v-if="judgeRoleBtn('logCenter_businessDataBusinessAudit')">
        <business-audit v-if="activeTab === 'pane4'"></business-audit>
      </s-tab-pane>
      <s-tab-pane label="智能免审计" name="pane5" v-if="judgeRoleBtn('logCenter_businessDataSmartfreeAudit')">
        <not-audit v-if="activeTab === 'pane5'"></not-audit>
      </s-tab-pane>
      <s-tab-pane label="策略审计" name="pane6" v-if="judgeRoleBtn('logCenter_businessDataStrategyAudit')">
        <policy-audit v-if="activeTab === 'pane6'"></policy-audit>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'

  import TalkAudit from './TalkAudit'
  import OperationAudit from './OperationAudit'
  import ModelAudit from './SqlModelAudit'
  import BusinessAudit from './BusinessAudit'
  import NotAudit from './NotAudit'
  import PolicyAudit from './PolicyAudit'

  export default {
    components: {

      TalkAudit,
      OperationAudit,
      ModelAudit,
      BusinessAudit,
      NotAudit,
      PolicyAudit
    },
    data() {
      return {
        tabNameArr: [
          'logCenter_businessDataSessionAudit',
          'logCenter_businessDataOperationAudit',
          'logCenter_businessDataSqlAudit',
          'logCenter_businessDataBusinessAudit',
          'logCenter_businessDataSmartfreeAudit',
          'logCenter_businessDataStrategyAudit'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1',
        isSearchOperation: '',
        isStart: '',
        isEnd: '',
        uuID: ''
      }
    },
    methods: {
      formsql(obj) {
        let path = obj.pattern_md5;
        let start = obj.start;
        let end = obj.end;
        if (path.length !== 0) {
          this.activeTab = 'pane2';
          this.isSearchOperation = path;
          this.isStart = start;
          this.isEnd = end;
        }
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
      if ((this.$route.fullPath.indexOf('dbiUuid') > 1)) {
        this.uuID = this.$route.query.dbiUuid
      }
    }
  }
</script>
