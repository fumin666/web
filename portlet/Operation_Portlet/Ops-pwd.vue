* Created by alex on 2018/12/4.
*/
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="密码会同"
      show-scrollbar
      :show-more="false">
      <diy-model></diy-model>
    </s-card-diy>
  </div>
</template>

<script>
  import diyModel from '@/pages/Operation_PwdHuitong/Password';

  export default {
    components: {
      diyModel
    }
  }
</script>
