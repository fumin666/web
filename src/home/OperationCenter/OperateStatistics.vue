<template>
  <section class="oper-subpage-margin">
    <h1 class="oper-table-header">本周运维量统计</h1>
    <s-table :data="dataList">
      <s-table-column label="时间" prop="weekDay"></s-table-column>
      <s-table-column label="资产数" prop="deviceNum"></s-table-column>
      <s-table-column label="运维数" prop="sessionNum"></s-table-column>
      <s-table-column label="运维时长" prop="timeLongCountView"></s-table-column>
      <s-table-column label="命令数" prop="cmdNumCount"></s-table-column>
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
      $axios.get('/statisticalReport/getOperationWorkloadList').then((res) => {
        this.dataList = res.data
      });
    }
  }
</script>
