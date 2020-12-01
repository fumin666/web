<template>
  <section class="logLevelReport">
    <s-row class="main-content">
      <s-col style="overflow: hidden;">
        <s-col :span="4" style="margin-top: 15px;">
          <div class="reportName">选择报表名称</div>
          <s-menu @on-select="selection"
                  accordion :active-name="currentUuid"
                  :active-key="currentUuid"
                  :open-names=[activeOpen]
                  style="font-size: 14px;">
            <s-submenu v-for="(item, index) in leftMenu" :key="index" :title="item.name" :name="item.uuid">
              <template slot="title"><i :class="`iconfont icon-${item.node.icon}`"></i>{{item.name}}</template>
              <s-menu-item v-for="(item1, index1) in item.childrenList" :key="index1" @click.native="changeUuid(item1.uuid, item1.node.keyWord.split('_')[1])" :title="item1.name" :name="item1.node.uuid">
                <span class="menu-dot"></span>{{item1.name}}</s-menu-item>
            </s-submenu>
          </s-menu>
        </s-col>
        <s-col :span="20" style="padding-left: 10px;">
          <s-scrollbar :wrap-style="'height:' + scrollbarHeight + 'px;'">
            <component :is="currentView" :activeTab="currentView" :safeTaskUuid='safeTaskUuid' :key='safeTaskUuid' style="padding-top:16px;padding-left:20px;"></component>
          </s-scrollbar>
        </s-col>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import authCheck from '@/common/mixins/auth.js'
  import methodOfIdentityAuthentication from '@/pages/Log_LevelReport/Level_2'
  import accessControl from '@/pages/Log_LevelReport/Level_3'
  import itcompAccountChange from '@/pages/Log_LevelReport/Level_4'
  import dbaAuditAuthChange from '@/pages/Log_LevelReport/Level_5'
  import dbaAuditLevelProtection from '@/pages/Log_LevelReport/Level_17'
  import useDangerousCmd from '@/pages/Log_LevelReport/Level_6'
  import sensitiveAccount from '@/pages/Log_LevelReport/Level_7'
  import assetOperationAndMaintenanceOperations from '@/pages/Log_LevelReport/Level_8'
  import dbUserOperationAudit from '@/pages/Log_LevelReport/Level_9'
  import dbSensitiveAccount from '@/pages/Log_LevelReport/Level_10'
  import dbImportantCmd from '@/pages/Log_LevelReport/Level_11'
  import dbaDMLAudit from '@/pages/Log_LevelReport/Level_12'
  import dbaDDLAudit from '@/pages/Log_LevelReport/Level_13'
  import resourcesException from '@/pages/Log_LevelReport/Level_14'
  import eventFailureStatistics from '@/pages/Log_LevelReport/Level_15'
  import assetImportance from '@/pages/Log_LevelReport/Level_16'
  export default {
    mixins: [authCheck],
    data () {
      return {
        scrollbarHeight: 0,
        activeOpen: '', // 默认展开项
        leftMenu: [],
        currentView: '',
        currentUuid: '',
        safeTaskUuid: ''
      }
    },
    created() {
      this.leftMenu = this.reportData.childrenList;
      this.currentUuid = this.leftMenu[0].childrenList[0].node.uuid
      this.activeOpen = this.leftMenu[0].uuid
      this.currentView = this.leftMenu[0].childrenList[0].node.keyWord.split('_')[1]
      this.mounted()
    },
    props: ['reportData'],
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    methods: {
      initDivHeight () {
        let leftMenuHeight = document.getElementsByClassName('logLevelReport').offsetHeight;
        this.scrollbarHeight = leftMenuHeight - 20;
      },
      changeUuid(key, val) {
        this.currentView = val
        this.currentUuid = key
        this.safeTaskUuid = key
      },
      selection(key) {
      },
      mounted() {
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
      }
    },
    components: {
      methodOfIdentityAuthentication,
      accessControl,
      itcompAccountChange,
      dbaAuditAuthChange,
      dbaAuditLevelProtection,
      useDangerousCmd,
      sensitiveAccount,
      assetOperationAndMaintenanceOperations,
      dbUserOperationAudit,
      dbSensitiveAccount,
      dbImportantCmd,
      dbaDMLAudit,
      dbaDDLAudit,
      resourcesException,
      eventFailureStatistics,
      assetImportance
    }
  }
</script>
