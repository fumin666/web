<template>
  <section class="oper-subpage-margin">
    <h1 class="oper-table-header">本周审核情况统计</h1>
    <s-table :data="dataList">
      <s-table-column label="运维类型" prop="specialoperTypeName"></s-table-column>
      <s-table-column label="记录数" prop="sessionNum"></s-table-column>
      <s-table-column label="未审核数" prop="notAudit"></s-table-column>
      <s-table-column label="合规数" prop="complianceNum"></s-table-column>
      <s-table-column label="违规数" prop="notComplianceNum"></s-table-column>
    </s-table>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dataList: []
      }
    },
    created() {
      $axios.get('/statisticalReport/getPersonalCheckInfoByweek').then((res) => {
        this.dataList = res.data
      });
    }
  }
</script>

