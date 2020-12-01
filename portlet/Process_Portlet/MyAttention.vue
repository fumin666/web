<template>
  <!--自定义首页 我的关注-->
  <div class="diy-process-myAttention">
    <s-card-diy
      title="我的关注"
      :show-more="false"
      show-scrollbar
    >
      <MyAttention></MyAttention>
    </s-card-diy>
  </div>
</template>

<script>
  import MyAttention from '@/pages/Process_MyOther/MyAttention'

  export default {
    name: 'process-myAttention',

    components: {
      MyAttention
    }
  }
</script>
