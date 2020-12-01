<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-01-28 15:34:21
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-18 11:00:00
 * @Description: 备份页面
 -->

<template>
  <section class="sys-backup login-set">
    <s-tab v-model="activeTab" type="card">
      <s-tab-pane label="备份设置" name="pane1" v-if="judgeRoleBtn('systemSet_backupSet') || judgeRoleBtn('gradeProtect_rsBackUpSet')">
        <BackupSet v-if="activeTab === 'pane1'"></BackupSet>
      </s-tab-pane>
      <s-tab-pane label="备份恢复" name="pane2" v-if="judgeRoleBtn('systemSet_backupRecover') || judgeRoleBtn('gradeProtect_rsBackUpRecover')">
        <BackupRec v-if="activeTab === 'pane2'"></BackupRec>
      </s-tab-pane>
      <s-tab-pane label="备份日志" name="pane3" v-if="judgeRoleBtn('systemSet_backupLog') || judgeRoleBtn('gradeProtect_rsBackUpLog')">
        <BackupLog v-if="activeTab === 'pane3'"></BackupLog>
      </s-tab-pane>
      <s-tab-pane label="恢复日志" name="pane4" v-if="judgeRoleBtn('systemSet_recoverLog') || judgeRoleBtn('gradeProtect_rsRecoverLog')">
        <RecoveryLog v-if="activeTab === 'pane4'"></RecoveryLog>
      </s-tab-pane>
      <s-tab-pane label="定时清除" name="pane5" v-if="judgeRoleBtn('systemSet_timingClean') || judgeRoleBtn('gradeProtect_rsTimingClear')">
        <RegularClean v-if="activeTab === 'pane5'"></RegularClean>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">

import BackupSet from './components/BackupSet.vue'; // 备份设置
import BackupRec from './components/BackupRec.vue'; // 备份恢复
import BackupLog from './components/BackupLog.vue'; // 备份日志
import RecoveryLog from './components/RecoveryLog.vue'; // 恢复日志
import RegularClean from './components/RegularClean.vue'; // 定时清除

export default {
  data() {
    return {
      tabNameArr: [
        'systemSet_backupSet',
        'systemSet_backupRecover',
        'systemSet_backupLog',
        'systemSet_recoverLog',
        'systemSet_timingClean'
      ], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1'  // 当前活跃tab
    }
  },
  components: {
    BackupSet,  // 备份设置
    BackupRec,  // 备份恢复
    BackupLog,  // 备份日志
    RecoveryLog,  // 恢复日志
    RegularClean  // 定时清除
  },
  created() {
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
  },
  filters: {
  },
  methods: {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.sys-backup {
  margin: 15px;
}
</style>
