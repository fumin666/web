/**
* Created by alex on 2019/2/28.
*/
<template>
  <s-scrollbar wrap-style="max-height: 500px;">
    <s-table-page
      :data="freList"
      :header-search="{show: false}"
      :paginationShow="false"
    >
      <s-table-column label="日志源名称" prop="itcompName" show-overflow-tooltip></s-table-column>
      <s-table-column label="IP地址" prop="controlAdderss" show-overflow-tooltip width="200px">
      </s-table-column>
      <s-table-column label="频次" prop="frequency" show-overflow-tooltip width="80px">
      </s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script type="text/babel">

  export default {

    data() {
      return {
      }
    },
    props: {
      freList: {
        type: Array,
        default: []
      }
    }
  }
</script>

