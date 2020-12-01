<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-10 09:05:18
 * @LastEditTime: 2019-09-23 18:15:28
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-potential-hazards">
    <s-card-diy
      title="潜在危害分析"
      :more-click="goto">
      <div style="width: 100%; height: 100%">
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
          name: 'potential-hazards-chart',
          type: 'stackBarChart',
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
      goto() {
        this.$router.push({path: '/LogCenter/log_siem', query: {activeTab: 'pane1'}});
      },
      getData() {
        $axios.get('/syslogReport/getHazardCountFor7Day').then(res => {
          if (res.data.order.length > 0) {
            let arr = [];
            for (let i in res.data.order) {
              let newObject = {
                'stack': res.data.order[i]
              }
              for (let j in res.data.group) {
                newObject[res.data.group[j].name] = Number(res.data.group[j].data[i])
              }
              arr.push(newObject);
            }
            this.chart.data = arr;
          }
        })
      }
    }
  }
</script>

<style>
  .diy-potential-hazards{
    width: 100%;
    height: 100%;
  }
</style>
