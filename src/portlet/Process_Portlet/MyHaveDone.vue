<template>
  <!--自定义首页 我的已办-->
  <div class="diy-process-myHaveDone">
    <s-card-diy
      title="我的已办"
      :show-more="false"
      show-scrollbar
    >
      <MyHaveDone></MyHaveDone>
    </s-card-diy>
  </div>
</template>

<script>
  import MyHaveDone from '@/pages/Process_MyOther/MyHavedone'

  export default {
    name: 'process-myHaveDone',

    components: {
      MyHaveDone
    }
  }
</script>
