<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <s-table-page :data="scanSafetyData">
      <s-table-column label="执行时间" prop="createTime"></s-table-column>
      <s-table-column label="加固检查项" prop="fastenItemName"></s-table-column>
      <s-table-column label="描述" prop="fastenItemDescription"></s-table-column>
      <s-table-column label="结果" prop="isSuccess"></s-table-column>
      <s-table-column label="加固建议" prop="repairSuggest"></s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script>
    export default {
      data() {
        return {
        }
      },
      props: ['scanSafetyData']
    }
</script>

<style scoped>

</style>
