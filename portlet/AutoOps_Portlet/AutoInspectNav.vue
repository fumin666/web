<template>
  <div id="diy-auto-inspect-nav">
    <s-card-diy
      title="自动化巡检"
      :show-more="false"
      show-scrollbar>
      <asset-polling></asset-polling>
    </s-card-diy>
  </div>
</template>

<script type="text/babel">
  import AssetPolling from '@/pages/Assets_Polling/AssetPolling';

  export default{
    data() {
      return {}
    },
    components: {
      AssetPolling
    },
    methods: {},
    created() {
    }
  }
</script>
