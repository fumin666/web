<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <s-table-page :data="baselineData">
      <s-table-column label="配置项名称" width="100" prop="attrName"></s-table-column>
      <s-table-column label="变更形式" width="100" prop="typeStr"></s-table-column>
      <s-table-column label="变更内容" width="300" prop="content"></s-table-column>
      <s-table-column label="变更人" width="110" prop="userName"></s-table-column>
      <s-table-column label="变更时间" prop="updateTimeStr"></s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script>
    export default {
      data() {
        return {
        }
      },
      props: ['baselineData']
    }
</script>

<style scoped>

</style>
