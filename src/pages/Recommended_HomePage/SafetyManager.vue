<!--
 * @Description: ipam->ipamDetails
 * @Author: 仝希博
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-18 17:56:39
 * @LastEditTime: 2019-09-06 10:24:17
 -->

<template>
  <s-collapse accordion class="asset">
    <s-collapse-item title="资产账号自动改密" name="1">
      <AutomaticEncryption></AutomaticEncryption>
    </s-collapse-item>
    <s-collapse-item title="资产账号手动改密" name="2">
      <Manual-encryption></Manual-encryption>
    </s-collapse-item>
    <s-collapse-item title="安全配置" name="3">
      <s-tab v-model="activeTab">
        <s-tab-pane label="登录安全设置" name="1" class="tab1">
          <login-security-set v-if="activeTab==='1'"></login-security-set>
        </s-tab-pane>
        <s-tab-pane label="密码策略配置" name="2" class="tab2">
          <s-row v-if="activeTab==='2'" >
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
    </s-collapse-item>
</s-collapse>
</template>
<script>

import AutomaticEncryption from '@/pages/Account_TimedTask/ChangePass'
import ManualEncryption from './SafetyDialog/ManualEncryption'
import simpleMenu from '@/pages/Account_SecuritySet//SimpleMenu.vue'
import LoginSecuritySet from '@/pages/Account_SecuritySet/LoginSecuritySet.vue'
import PwdPolicySet from './SafetyDialog/PwdPolicySet.vue'
// import $axios from 'sunflower-ajax'
export default {
  components: {
      AutomaticEncryption,
      simpleMenu,
      LoginSecuritySet,
      PwdPolicySet,
      ManualEncryption
    },
  data() {
      return {
        pwdPolicyMenuActive: 1,
        activeTab: '1',
        pwdPolicyMenu: {
          click: this.selectPwdPolicyMenu,
          list: [
            {name: '低安全等级'},
            {name: '中安全等级'},
            {name: '高安全等级'}
          ]
        }

      }
    },
  methods: {
      selectPwdPolicyMenu(index) {
        this.pwdPolicyMenuActive = index;
      }
    // judge(value, row) {
    //   if (value.timeDuration.indexOf('now') === -1) {
    //     return value.prevStatusStr
    //   } else {
    //     return value.statusStr
    //   }
    // }
  },
  created() {
  }
}
</script>
<style lang="stylus">
.asset .s-collapse-item-header{
    height: 40px;
    line-height: 40px;
    font-size :14px;
    padding 0 20px;
    border none;
    margin-top 20px;
}
.asset .s-collapse-item-content {
  padding : 10px 20px;
}
.asset .s-collapse-item-header .iconfont.icon-right {
  float : right
}
.asset .tabbox .title {
    color: #392c28;
    font-weight: 600;
    margin-left: 3px;
    margin-bottom 10px;
}
</style>

