<template>
  <section>
    <s-col span="4">
      <s-menu active-name="pane1" @on-select="selection" style="padding-top:16px;font-size:14px">
        <s-menu-item name="pane1" v-if="judgeRoleBtn('systemSet_emailServer') || judgeRoleBtn('gradeProtect_rsEmailService')">
          <i class="icon iconfont icon-email"></i>
          邮件服务器
        </s-menu-item>
        <s-menu-item name="pane2" v-if="judgeRoleBtn('systemSet_messageServer') || judgeRoleBtn('gradeProtect_rsMessageService')">
          <i class="icon iconfont icon-message"></i>
          短信服务器
        </s-menu-item>
        <s-menu-item name="wechatServer" v-if="judgeRoleBtn('systemSet_wechatServer') || judgeRoleBtn('gradeProtect_rsWeChatService')">
          <i class="iconfont icon-wechat"></i>
          微信服务器
        </s-menu-item>
        <s-menu-item name="ftpServer" v-if="judgeRoleBtn('systemSet_ftpServer') || judgeRoleBtn('gradeProtect_rsFTPService')">
          <i class="icon iconfont icon-folder"></i>
          FTP服务器
        </s-menu-item>
        <s-menu-item name="daycareCenters" v-if="judgeRoleBtn('systemSet_daycareCenters') || judgeRoleBtn('gradeProtect_rsHostCenterConf')">
          <i class="icon iconfont icon-oper"></i>
          托管中心配置
        </s-menu-item>
        <s-menu-item name="nodeIpStrategy" v-if="judgeRoleBtn('systemSet_nodeIpStrategy') || judgeRoleBtn('gradeProtect_rsNodeIPPolicy')">
          <i class="icon iconfont icon-config-ip"></i>
          节点IP策略
        </s-menu-item>
        <s-menu-item name="agentManagement" v-if="DbaFlag">
          <i class="icon iconfont icon-network"></i>
          DBA代理管理
        </s-menu-item>
        <!-- <s-menu-item name="businessSysCertification" v-if="judgeRoleBtn('systemSet_businessSysCertification')">
          <i class="icon iconfont icon-service-safe"></i>
          业务系统认证管理
        </s-menu-item> -->
        <s-menu-item name="workFlowAuth" v-if="judgeRoleBtn('systemSet_itilActivationManage')">
          <i class="icon iconfont icon--deblock-2"></i>
          流程模块激活管理
        </s-menu-item>
        <s-menu-item name="safetyAuth" v-if="judgeRoleBtn('systemSet_safetyActivationManage')">
          <i class="icon iconfont icon--deblock-2"></i>
          安全通报模块激活管理
        </s-menu-item>
        <s-menu-item name="SyslogSet">
          <i class="icon iconfont icon-set"></i>
          Syslog服务设置
        </s-menu-item>
        <s-menu-item name="DoubleHotBackup" v-if="judgeRoleBtn('systemSet_DoubleHotBackup') || judgeRoleBtn('gradeProtect_rsDHBSet')">
          <i class="icon iconfont icon-two-hot-ready"></i>
          双机热备设置
        </s-menu-item>
        <s-menu-item name="AppSet" v-if="judgeRoleBtn('systemSet_appSet') || judgeRoleBtn('gradeProtect_rsAppSet')">
          <i class="icon iconfont icon-app-set"></i>
          移动APP设置
        </s-menu-item>
        <s-menu-item name="CollectDownLoad" v-if="judgeRoleBtn('systemSet_logCollector') || judgeRoleBtn('gradeProtect_rsLogCollectDownload')">
          <i class="icon iconfont icon-download"></i>
          日志采集器下载
        </s-menu-item>

      </s-menu>
    </s-col>
    <s-col span="20">
      <component :is="currentView" :activeTab="currentView" style="padding-top:16px;padding-left:20px;"></component>
    </s-col>
  </section>
</template>
<script>
  import pane1 from './dialog/EmailServer.vue';
  import pane2 from './dialog/messageServer.vue';
  import wechatServer from './dialog/wechatServer.vue';
  import ftpServer from './dialog/ftpServer.vue';
  import daycareCenters from './dialog/daycareCenters.vue';
  import nodeIpStrategy from './dialog/nodeIpStrategy.vue';
  import agentManagement from './dialog/agentManagement.vue';
  import businessSysCertification from './dialog/businessSysCertification.vue';
  import workFlowAuth from './dialog/workFlowAuth.vue';
  import safetyAuth from './dialog/SafetyAuth.vue'
  import authCheck from '@/common/mixins/auth.js'
  import DoubleHotBackup from '@/pages/SysManage_DoubleHotBackup/DoubleHotBackup'
  import AppSet from '@/pages/SysManage_AppSet/AppSet'
  import CollectDownLoad from '@/pages/SysManage_CollectorDownLoad/CollectDownLoad';
  import SyslogSet from './dialog/SyslogSet.vue'
  export default {
    mixins: [authCheck],
    components: {
      pane1, // 邮件
      pane2, // 短信
      wechatServer,
      ftpServer,
      daycareCenters,
      nodeIpStrategy,
      agentManagement,
      businessSysCertification,
      workFlowAuth,
      DoubleHotBackup,
      AppSet,
      CollectDownLoad,
      safetyAuth,
      SyslogSet
    },
    data() {
      return {
        currentView: 'pane1',
        userUuid: this.$store.state.userData.uuid,
        DbaFlag: false
      }
    },
    methods: {
      selection(key) {
        this.currentView = key
      }
    },
    created() {
      if (this.$store.state.userData.registerModelList.includes('DBA')) {
        this.DbaFlag = true
      }
    }
  }
</script>
