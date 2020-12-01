/**
* Created by liushupeng on 2019/1/24.
*/
<template>
  <div class="diy-dba-warning-record-time">
    <s-card-diy
      title="告警记录时间走势"
      :show-more="false">
      <div style="width: 100%;height: 100%;">
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
          name: 'diy-dba-warning-record-time',
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
        $axios.post('/dbauditReport/alarmAudit', param).then(res => {
          this.chart.data = Object.assign({}, res.data);
        })
      }
    }
  }
</script>

<style>
  .diy-dba-warning-record-time{
    width: 100%;
    height: 100%;
  }
</style>
