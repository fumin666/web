/**
* Created by alex on 2018/12/4.
*/
<template>
  <div>
    <s-card-diy :title="'资产账号改密'"
      show-scrollbar
      :show-more="false">
      <Change-Pass></Change-Pass>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import ChangePass from '@/pages/Account_TimedTask/ChangePass'
  export default {
    data() {
      return {
      }
    },
    components: {
      ChangePass
    },
    created() {
    },
    methods: {
    }
  }
</script>
