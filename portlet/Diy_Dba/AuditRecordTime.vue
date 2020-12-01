/**
* Created by liushupeng on 2019/1/24.
*/
<template>
  <div class="diy-dba-audit-record-time">
    <s-card-diy
      title="审计记录时间走势（近24小时）"
      :show-more="false">
      <div style="width: 100%; height: 100%;">
        <s-chart :chart="chart"></s-chart>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        chart: {
          name: 'diy-dba-audit-record-time',
          type: 'areaChart',
          width: '100%',
          height: '240px',
          unit: '个',
          data: {}
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        let startTime = new Date(new Date().toLocaleDateString()).getTime() / 1000;
        let endTime = new Date(new Date().toLocaleDateString()).getTime() / 1000 + 24 * 60 * 60 - 1;
        let param = {
          startTime: startTime,
          endTime: endTime,
          timeType: 1
        }
        $axios.post('/dbauditReport/auditDB', param).then(res => {
          this.chart.data = Object.assign({}, res.data);
        })
      }
    }
  }
</script>

<style>
  .diy-dba-audit-record-time {
    width: 100%;
    height: 100%;
  }
</style>
