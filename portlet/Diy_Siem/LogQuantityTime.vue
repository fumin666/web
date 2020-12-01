<!--
 * @Description: In User Settings Edit
 * @Author: txb
 * @Date: 2019-06-10 09:05:18
 * @LastEditTime: 2019-09-20 17:32:17
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-siem-log-quantity-time">
    <s-card-diy
      title="全网日志数量时间分布图"
      :more-click="moreClick">
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
          name: 'quantity-time-chart',
          type: 'lineChart',
          width: '100%',
          height: '100%',
          data: []
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      moreClick() {
        this.$router.push({path: '/LogCenter/log_siem', query: {activeTab: 'pane1'}});
      },
      getData() {
        $axios.get('/syslogReport/logSourceNumFor24Hours').then(res => {
          this.chart.data = res.data.reverse();
        })
      }
    }
  }
</script>

<style>
  .diy-siem-log-quantity-time{
    width:100%;
    height:100%;
  }
</style>
