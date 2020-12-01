<template>
  <s-table-page :data="orderList">
    <s-table-column label="漏洞类型" prop="departName"></s-table-column>
    <s-table-column label="漏洞描述" prop="cmdName"></s-table-column>
  </s-table-page>
</template>

<script>
    export default {
      data() {
        return {
          orderList: []
        }
      }
    }
</script>

<style scoped>

</style>
