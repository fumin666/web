* Created by alex on 2018/12/4.
*/
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="授权策略管理"
      show-scrollbar>
      <diy-model></diy-model>
    </s-card-diy>
  </div>
</template>

<script>
  import diyModel from '@/pages/Account_Auth/Auth';

  export default {
    components: {
      diyModel
    }
  }
</script>
