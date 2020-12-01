<template>
  <section class="login-set">
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
  </section>
</template>

<script type="text/babel">
  import simpleMenu from '../SimpleMenu.vue'
  import PwdPolicySet from '../PwdPolicySet.vue'
  export default{
    data () {
      return {
        pwdPolicyMenuActive: 1,
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
    components: {
      simpleMenu,
      PwdPolicySet
    },
    props: [],
    watch: {
    },
    computed: {
    },
    methods: {
      selectPwdPolicyMenu(index) {
        this.pwdPolicyMenuActive = index;
      }
    },
    mounted() {

    }
  }
</script>

