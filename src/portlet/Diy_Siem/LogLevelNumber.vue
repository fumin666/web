<!--
 * @Description: In User Settings Edit
 * @Author:txb
 * @Date: 2019-06-10 09:05:18
 * @LastEditTime: 2019-09-20 17:36:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-siem-log-level">
    <s-card-diy
      title="全网日志级别数量统计图(近24小时)"
      :more-click="goto">
      <div style="width: 100%;height: 100%;">
        <s-chart :chart="auditChart"></s-chart>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        auditChart: {
          name: 'auditChart',
          type: 'pieChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {
            series: [{
              radius: '85%'
            }]
          }
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      goto() {
        this.$router.push({path: '/LogCenter/log_siem', query: {activeTab: 'pane1'}});
      },
      getData() {
        $axios.get('/syslogReport/countLogLevelFor24Hours').then(res => {
          if (Object.keys(res.data).length > 0) {
            let arr = [];
            for (let i in Object.keys(res.data)) {
              let msg = {
                name: Object.keys(res.data)[i],
                value: Object.keys(res.data[Object.keys(res.data)[i]])[0]
              }
              arr.push(msg);
            }
            this.auditChart.data = arr;
          }
        })
      }
    }
  }
</script>

<style>
  .diy-siem-log-level{
    width: 100%;
    height: 100%;
  }
</style>
