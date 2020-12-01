/*
create by YOU
*/
<template>
  <div class="sys-ope-log login-set">
    <s-tab type="card" v-model="activeTab">
      <s-tab-pane label="归档清理策略" name="pane1" v-if="judgeRoleBtn('systemSet_archiveCleanStrategy') || judgeRoleBtn('gradeProtect_rsFilingCleanStrategy')">
        <archiving-clean-strategy v-if="activeTab === 'pane1'"></archiving-clean-strategy>
      </s-tab-pane>
      <s-tab-pane label="手动归档" name="pane2" v-if="judgeRoleBtn('systemSet_manualArchive') || judgeRoleBtn('gradeProtect_rsManualFiling')">
        <archiving-by-hand v-if="activeTab === 'pane2'"></archiving-by-hand>
      </s-tab-pane>
<!--      <s-tab-pane label="归档恢复" name="pane3" v-if="judgeRoleBtn('systemSet_archiveRecover') || judgeRoleBtn('gradeProtect_rsFilingRecover')">
        <archiving-recovery v-if="activeTab === 'pane3'"></archiving-recovery>
      </s-tab-pane>-->
      <s-tab-pane label="归档日志" name="pane4" v-if="judgeRoleBtn('systemSet_archiveLog') || judgeRoleBtn('gradeProtect_rsFilingLog')">
        <archiving-log v-if="activeTab === 'pane4'"></archiving-log>
      </s-tab-pane>
      <s-tab-pane label="恢复日志" name="pane5" v-if="judgeRoleBtn('systemSet_recoverLog') || judgeRoleBtn('gradeProtect_rsRecoverLog')">
        <recovery-log v-if="activeTab === 'pane5'"></recovery-log>
      </s-tab-pane>
      <s-tab-pane label="清理日志" name="pane6" v-if="judgeRoleBtn('systemSet_cleanLog') || judgeRoleBtn('gradeProtect_rsClearLog')">
        <clean-log v-if="activeTab === 'pane6'"></clean-log>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script type="text/babel">
  import archivingCleanStrategy from './components/ArchivingCleanStrategy.vue'
  // import archivingRecovery from './components/ArchivingRecovery.vue'
  import archivingByHand from './components/ArchivingByHand.vue'
  import archivingLog from './components/ArchivingLog.vue'
  import recoveryLog from './components/RecoveryLog.vue'
  import cleanLog from './components/CleanLog.vue'
  export default {
    components: {
      archivingCleanStrategy,
      archivingByHand,
      // archivingRecovery,
      archivingLog,
      recoveryLog,
      cleanLog
    },
    data() {
      return {
        tabNameArr: ['systemSet_archiveCleanStrategy',
          'systemSet_manualArchive',
          // 'systemSet_archiveRecover',
          'systemSet_archiveLog',
          'systemSet_recoverLog',
          'systemSet_cleanLog'
        ], // 页签名字的集合(顺序和页签一致)
        activeTab: 'pane1'
      }
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    methods: {
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .sys-ope-log
    margin-top: 20px
</style>
