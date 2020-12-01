<template>
  <!--自定义首页 快速搜索-->
  <div class="diy-process-speedSearch">
    <s-card-diy
      title="快速搜索"
      :show-more="false"
      show-scrollbar
    >
      <SpeedSearch></SpeedSearch>
    </s-card-diy>
  </div>
</template>

<script>
  import SpeedSearch from '@/pages/Process_MyOther/MyOther'

  export default {
    name: 'process-speedSearch',

    components: {
      SpeedSearch
    }
  }
</script>
