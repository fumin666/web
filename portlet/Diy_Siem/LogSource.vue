<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-10 09:05:18
 * @LastEditTime: 2019-09-20 17:36:38
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-siem-log-source">
    <s-card-diy
      title="全网日志来源统计TOP10(最近24小时)"
      :more-click="moreClick">
      <div style="width: 100%;height: 100%;">
        <s-charts :chart="chart"></s-charts>
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
          el: 'log-source-chart',
          type: 'barChart',
          width: '100%',
          height: '90%',
          opt: {
            xAxis: {
              axisLabel: {
                show: true,
                interval: 0,
                rotate: 60
              }
            }
          },
          data: {}
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
        $axios.get('/syslogReport/top10LogSourceFor24Hours').then(res => {
          if (res.data.length > 0) {
            let param = {}
            for (let i in res.data) {
              param[res.data[i].name] = res.data[i].value
            }
            this.chart.data = Object.assign({}, param);
          }
        })
      }
    }
  }
</script>

<style>
  .diy-siem-log-source{
    width: 100%;
    height:100%;
  }
</style>
