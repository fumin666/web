/**
* Created by songyf on 2019/9/9.
*/
<template>
  <div>
    <s-card-diy :title="'密码过期账号'" :more-click="goto">
      <account-pwd-overdue></account-pwd-overdue>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import AccountPwdOverdue from '@/home/Account/AccountPwdOverdue';
  export default {
    data() {
      return {}
    },
    components: {
      AccountPwdOverdue
    },
    methods: {
      goto() {
        this.$router.push('/AccountManage/accountManage_passwordExpiration/3')
      }
    }
  }
</script>
