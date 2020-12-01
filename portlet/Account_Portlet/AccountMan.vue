/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'组织机构管理'" :more-click="goto">
      <accountOrgGraph ref="accountGraph"></accountOrgGraph>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import accountOrgGraph from '@/pages/Account_Organization/AccountOrgGraph';
  export default {
    data() {
      return {}
    },
    components: {
      accountOrgGraph
    },
    methods: {
      goto() {
        this.$router.push('/AccountManage/orgTopo')
      }
    }
  }
</script>
