/**
* Created by liushupeng on 2019/1/21.
*/
<template>
  <div class="diy-siem-log-event">
    <s-card-diy
      title="日志审计事件统计"
      :more-click="moreClick">
      <div class="s-card-diy-title" style="padding-left: 10px;">
        总数：{{ total }}
      </div>
      <div style="width:80%;height: 100%;margin-left: 10%">
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
          el: 'log-event-chart',
          type: 'barChart',
          width: '100%',
          height: '100%',
          data: {}
        }
      }
    },
    created() {
      this.getData();
    },
    methods: {
      moreClick() {
        this.$router.push({path: '/EventCenter/event_list/0/0/0'});
      },
      getData() {
        $axios.get('/eventCount/getEventCountByEventType/5/1').then(res => {
          this.chart.data = Object.assign({}, res.data);
        })
      }
    },
    computed: {
      total() {
        let total = 0;
        if (Object.keys(this.chart.data).length > 0) {
          for (let i in this.chart.data) {
            total += this.chart.data[i]
          }
          return total
        } else {
          return total;
        }
      }
    }
  }
</script>

<style>
  .diy-siem-log-event{
    width: 100%;
    height: 100%;
  }
</style>
