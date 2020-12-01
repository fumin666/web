<template>
  <div>
    <s-tab v-model="activeTab">
      <s-tab-pane label="登录安全设置" name="pane1">
        <login-security-set v-if="activeTab==='pane1'"></login-security-set>
      </s-tab-pane>
      <s-tab-pane label="密码策略配置" name="pane2">
        <s-row v-if="activeTab==='pane2'">
          <s-col span="3">
            <simple-menu :menu="pwdPolicyMenu" :active-index="1"></simple-menu>
          </s-col>
          <s-col span="20" offset="1">
            <div class="tabbox" v-if="pwdPolicyMenuActive===0">
              <s-scrollbar wrap-class="scrollMaxH">
                <pwd-policy-set level="low"></pwd-policy-set>
              </s-scrollbar>
            </div>
            <div class="tabbox" v-if="pwdPolicyMenuActive===1">
              <s-scrollbar wrap-class="scrollMaxH">
                <pwd-policy-set level="middle"></pwd-policy-set>
              </s-scrollbar>
            </div>
            <div class="tabbox" v-if="pwdPolicyMenuActive===2">
              <s-scrollbar wrap-class="scrollMaxH">
                <pwd-policy-set level="upper"></pwd-policy-set>
              </s-scrollbar>
            </div>
          </s-col>
        </s-row>
      </s-tab-pane>
    </s-tab>
  </div>
</template>
<script>
  // import ChangePass from '../Account_TimedTask/ChangePass.vue'
  import LoginSecuritySet from './LoginSecuritySet.vue'
  import simpleMenu from './SimpleMenu.vue'
  import PwdPolicySet from './PwdPolicySet.vue'
  export default {
    data() {
        return {
          activeTab: 'pane1',
          pwdPolicyMenu: {
            click: this.selectPwdPolicyMenu,
            list: [
              {name: '低安全等级'},
              {name: '中安全等级'},
              {name: '高安全等级'}
            ]
          },
          pwdPolicyMenuActive: 1
        }
    },
    components: {
      // ChangePass,
      LoginSecuritySet,
      simpleMenu,
      PwdPolicySet
    },
    created() {
    },
    methods: {
      selectPwdPolicyMenu(index) {
        this.pwdPolicyMenuActive = index;
      }
    }
}

</script>

