* Created by alex on 2018/12/4.
*/
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="用户权限管理"
      show-scrollbar
      :show-more="false">
      <diy-model></diy-model>
    </s-card-diy>
  </div>
</template>

<script>
  import diyModel from '@/pages/Account_SysPrivilege/SysPrivilege';

  export default {
    components: {
      diyModel
    }
  }
</script>
