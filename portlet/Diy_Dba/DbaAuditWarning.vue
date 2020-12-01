/**
* Created by liushupeng on 2019/1/24.
*/
<template>
  <div class="diy-dba-audit-warning">
    <s-card-diy
      title="数据库审计告警统计"
      :more-click="goto">
      <div class="s-card-diy-title" style="padding-left: 10px;">
        总数：{{ total }}
      </div>
      <div style="width:80%;height: 100%;margin-left: 5%">
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
          el: 'dba-audit-warning-chart',
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
      goto() {
        this.$router.push({path: '/EventCenter/event_alarmcenter', query: {eventLevel: {name: '1', value: '审计'}}});
      },
      getData() {
        $axios.get('/dataAlarmLog/getEventAlarmCountByAlarmType/1').then(res => {
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
  .diy-dba-audit-warning{
    width: 100%;
    height: 100%;
  }
</style>
