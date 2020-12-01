<template>
  <!--自定义首页 我的审批-->
  <div class="diy-process-myApproval">
    <s-card-diy
      title="我的审批"
      :show-more="false"
      show-scrollbar
    >
      <MyApproval></MyApproval>
    </s-card-diy>
  </div>
</template>

<script>
  import MyApproval from '@/pages/Process_Components/MyApproval'

  export default {
    name: 'process-myApproval',

    components: {
      MyApproval
    }
  }
</script>
