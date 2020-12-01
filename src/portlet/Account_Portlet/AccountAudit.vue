/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'资产账号稽核'"
      show-scrollbar
      :show-more="false">
      <Audit></Audit>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import Audit from '@/pages/Account_TimedTask/Audit'
  export default {
    data() {
      return {
      }
    },
    components: {
      Audit
    },
    created() {
    },
    methods: {
    }
  }
</script>
