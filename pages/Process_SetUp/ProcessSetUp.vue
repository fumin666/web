<template>
  <div class="high-level-set left-menu-box" style="margin:0;">
    <s-row>
      <s-col span="4" style="margin-left: -20px;">
        <s-menu active-name="personnelData" @on-select="selection" style="padding-top:16px;font-size:14px">
          <s-menu-item name="personnelData" title="人员数据">
            <i class="icon iconfont icon-nav-account-manage"></i>
            人员数据
          </s-menu-item>
          <s-menu-item name="roleInformation" title="ITSM角色">
            <i class="icon iconfont icon-staff"></i>
            ITSM角色
          </s-menu-item>
          <s-menu-item name="supportGroupInfo" title="支持组信息">
            <i class="iconfont icon-shequdongtai"></i>
            支持组信息
          </s-menu-item>
          <s-menu-item name="threeReclassify" title="三级分类">
            <i class="iconfont icon-info"></i>
            三级分类
          </s-menu-item>
          <s-menu-item name="automaticAssignment" title="自动分派规则">
            <i class="iconfont icon-pick-up"></i>
            自动分派规则
          </s-menu-item>
          <s-menu-item name="approvalMapping" title="审批映射">
            <i class="iconfont icon-log-audit"></i>
            审批映射
          </s-menu-item>
          <s-menu-item name="templateMaintenance" v-if="EventAuth || ChangeAuth" title="模板维护">
            <i class="iconfont icon-backup"></i>
            模板维护
          </s-menu-item>
          <s-menu-item name="riskQuestion" v-if="ChangeAuth" title="人员数据">
            <i class="iconfont icon-file"></i>
            变更风险问卷维护
          </s-menu-item>
          <s-menu-item name="mailNoticeRule" title="邮件通知规则配置">
            <i class="iconfont icon-email"></i>
            邮件通知规则配置
          </s-menu-item>
          <s-menu-item name="mailHistoryQuery" title="邮件历史查询">
            <i class="iconfont icon-view-history"></i>
            邮件历史查询
          </s-menu-item>
          <s-menu-item name="ReleaseConfig" v-if="PublishAuth" title="发布分级和阶段审批设置">
            <i class="iconfont icon-publish"></i>
            发布分级和阶段审批设置
          </s-menu-item>
          <s-menu-item name="SatisfactionSurvey" v-if="EventAuth || ServiceAuth" title="满意度调查">
            <i class="iconfont icon-like"></i>
            满意度调查
          </s-menu-item>
          <s-menu-item name="ServiceLevelAgreement" v-if="(EventAuth || ServiceAuth) && flag" title="服务级别协议SLA">
            <i class="iconfont icon-protocol"></i>
            服务级别协议SLA
          </s-menu-item>
        </s-menu>
      </s-col>
      <s-col span="20">
        <component :is="currentView" :activeTab="currentView" style="padding-top:16px;padding-left:20px;"></component>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import personnelData from './components/PersonnelData.vue';
  import roleInformation from './components/ItsmRoleInfo.vue';
  import permissionsInfo from './components/PermissionsInfo.vue';
  import supportGroupInfo from './components/SupportGroupInfo.vue';
  import automaticAssignment from './components/AutomaticAssignment.vue';
  import threeReclassify from './components/ThreeReclassify.vue';
  import approvalMapping from './components/ApprovalMapping.vue';
  import templateMaintenance from './components/TemplateMaintenance.vue';
  import riskQuestion from './components/RiskQuestion.vue';
  import mailNoticeRule from './components/MailNoticeRules.vue';
  import mailHistoryQuery from './components/MailHistoryQuery.vue';
  import ReleaseConfig from './components/ReleaseConfig.vue';
  import ServiceLevelAgreement from './components/ServiceLevelAgreement.vue';
  import SatisfactionSurvey from './components/SatisfactionSurvey';
  // import authCheck from '@/common/mixins/auth.js'
  import $axios from 'sunflower-ajax';
  import { getPrivilege } from 'sunflower-common-utils'
  export default {
    // mixins: [authCheck],
    data() {
      return {
        currentView: 'personnelData',
        flag: true,
        EventAuth: false, // 事件单权限
        ProblemAuth: false, // 问题单权限
        ChangeAuth: false, // 变更单权限
        TaskAuth: false, // 任务单权限
        KnowledgeAuth: false, // 知识单权限
        PublishAuth: false, // 发布单权限
        ServiceAuth: false // 服务请求权限
      }
    },
    mounted() {
      $axios.get('/ItilCommonWorkflow/getOrderType').then(res => {
        let data = []
        for (let i in res.data) {
          data.push(res.data[i])
        }
        this.EventAuth = getPrivilege(['事件'], data)
        this.ProblemAuth = getPrivilege(['问题'], data)
        this.ChangeAuth = getPrivilege(['变更'], data)
        this.TaskAuth = getPrivilege(['任务'], data)
        this.KnowledgeAuth = getPrivilege(['知识'], data)
        this.PublishAuth = getPrivilege(['发布'], data)
        this.ServiceAuth = getPrivilege(['服务请求'], data)
      })
      if (this.$route.name === 'diy') {
        this.flag = false
      }
    },
    methods: {
      selection(key) {
        this.currentView = key
        let userData = this.$store.getters.userData;
        let firstMenu = this.$store.getters.firstMenu;
        let secondMenu = this.$store.getters.secondMenu;
        let firstMenuPc = firstMenu.filter(item => { // 是否注册流程
          return item.keyWord === 'processCenter';
        });
        if (this.currentView === 'ServiceLevelAgreement') {
          if (userData.roleUuidsStr.indexOf('tsecondroleinfo00000000000000015') !== -1 &&
            firstMenuPc.length > 0 && secondMenu.f10adc3949ba59abbe56e057f20f8812.length === 1 &&
            secondMenu.f10adc3949ba59abbe56e057f20f8812[0].keyWord === 'processCenter_workflowConfig') { // 是否是配置管理员
            this.gotoProcess('ServiceLevelAgreement')
          } else {
            this.goto('ServiceLevelAgreement')
          }
        }
      },
      gotoProcess(path) {
        this.$router.push('/ProcessCenter/' + path)
      },
      goto(path) {
        this.$router.push('Process_setup/' + path)
      }
    },
    components: {
      personnelData,
      roleInformation,
      permissionsInfo,
      supportGroupInfo,
      automaticAssignment,
      threeReclassify,
      approvalMapping,
      templateMaintenance,
      riskQuestion,
      mailNoticeRule,
      mailHistoryQuery,
      ReleaseConfig,
      ServiceLevelAgreement,
      SatisfactionSurvey
    }
  }
</script>
<style lang="stylus">
  .left-menu-box
     .s-menu-item
       overflow hidden
       text-overflow ellipsis
       white-space nowrap
</style>
