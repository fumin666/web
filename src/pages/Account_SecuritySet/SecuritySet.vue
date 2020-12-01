<template>
  <section>
    <s-dialog
      v-model="dialogFlag"
      title="安全配置"
      id="securitySetDialog"
      width=70% style="min-width:850px">
      <s-tab v-model="activeTab">
        <s-tab-pane label="登录认证设置" name="pane1" v-if="judgeRoleBtn('accountManage_loginCertificationSet')">
          <login-set v-if="activeTab==='pane1'"></login-set>
        </s-tab-pane>
        <s-tab-pane label="登录认证配置" name="pane2" v-if="judgeRoleBtn('accountManage_loginCertificationConf')">
          <login-config v-if="activeTab==='pane2'"></login-config>
        </s-tab-pane>
        <s-tab-pane label="登录安全设置" name="pane3" class="tab3" v-if="judgeRoleBtn('accountManage_loginSecuritySet')">
          <login-security-set v-if="activeTab==='pane3'"></login-security-set>
        </s-tab-pane>
        <s-tab-pane label="密码策略配置" name="pane4" class="tab5" v-if="judgeRoleBtn('accountManage_passwordPolicyConf')">
          <pwd-config v-if="activeTab==='pane4'"></pwd-config>
        </s-tab-pane>
        <s-tab-pane label="登录属性设置" name="pane5" v-if="judgeRoleBtn('accountManage_loginAttributeSet')">
          <login-property-set  v-if="activeTab==='pane5'"></login-property-set>
        </s-tab-pane>
      </s-tab>
    </s-dialog>


  </section>
</template>

<script>
  import addTokenUser from './AddTokenUser.vue'
  import sysToken from './SysToken.vue'
  import authCheck from '@/common/mixins/auth.js'
  import uploadCertificate from './UploadCertificate.vue'
  import LoginSet from './SecuritySetTab/LoginSet'
  import LoginConfig from './SecuritySetTab/LoginConfig'
  import PwdConfig from './SecuritySetTab/PwdConfig'
  import loginPropertySet from './LoginPropertySet.vue'
  import LoginSecuritySet from './LoginSecuritySet.vue'
  export default {
    mixins: [authCheck],
    components: {
      addTokenUser,
      sysToken,
      loginPropertySet,
      uploadCertificate,
      LoginSecuritySet,
      LoginSet,
      LoginConfig,
      PwdConfig
    },
    data() {
      return {
        tabNameArr: [
          'accountManage_loginCertificationSet',
          'accountManage_loginCertificationConf',
          'accountManage_loginSecuritySet',
          'accountManage_passwordPolicyConf',
          'accountManage_loginAttributeSet'], // 页签名字的集合
        activeTab: 'pane1',
        dialogFlag: false,
        doubleLoginType: [],
        doubleLoginType1: [],
        doubleLoginType2: [],
        tab2Url: '',
        approveType: '',
        approveType1: '',
        approveType2: '',
        phoneTokenUuid: '',
        certificateUuid: '',
        mixApproveUuid: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      approveType1(val) {
        this.doubleLoginType2 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType2.push(item);
        });
      },
      approveType2(val) {
        this.doubleLoginType1 = [];
        this.doubleLoginType.forEach((item) => {
          if (item.uuid !== val) this.doubleLoginType1.push(item);
        })
      }
    },
    computed: {
    },
    created() {
      this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    },
    mounted() {

    }
  }
</script>
