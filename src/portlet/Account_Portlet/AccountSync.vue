/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'资产账号同步'"
      show-scrollbar
      :show-more="false">
      <Assets-Sync></Assets-Sync>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import AssetsSync from '@/pages/Account_TimedTask/AssetsSync'
  export default {
    data() {
      return {
      }
    },
    components: {
      AssetsSync
    },
    created() {
    },
    methods: {
    }
  }
</script>
