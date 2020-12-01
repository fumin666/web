/**
* Created by zhengx
*/
<template>
  <div class="diy-single-monitor-alarm">
    <s-card-diy
      title="监控告警统计"
      :more-click="moreClick">
      <s-chart :chart="chart"></s-chart>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        chart: {
          name: 'diySingleMonitorAlarm',
          type: 'colorfulBarChart',
          width: '100%',
          height: '100%',
          data: []
        }
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        $axios.get('/dataAlarmLog//getEventAlarmCountByAlarmType/2').then(res => {
          this.chart.data = this.map2Arr(res.data);
        });
      },

      map2Arr(map) {
        let list = [];
        for (let key in map) {
          list.push({ name: key, value: map[key] });
        }
        return list;
      },

      moreClick() {
        this.$router.push('/EventCenter/event_alarmcenter');
      }
    }
  }
</script>

<style>
  .diy-single-monitor-alarm {
    width: 100%;
    height: 100%;
  }
</style>
