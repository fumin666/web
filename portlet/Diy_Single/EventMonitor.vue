/**
* Created by zhengx
*/
<template>
  <div class="diy-single-event-monitor">
    <s-card-diy
      title="监控事件统计"
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
          name: 'diySingleEventMonitor',
          type: 'colorfulBarChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {
            legend: {
              orient: 'horizontal'
            }
          }
        }
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getList() {
        $axios.get('/eventCount/getEventCountByEventType/1/1').then(({data}) => {
          this.chart.data = this.map2Arr(data);
        });
      },

      map2Arr(map) {
        let arr = [];
        for (let key in map) {
          arr.push({ name: key, value: map[key] });
        }
        return arr;
      },

      moreClick() {
        this.$router.push('/EventCenter/event_list/0/0/0');
      }
    }
  }
</script>

<style>
  .diy-single-event-monitor {
    width: 100%;
    height: 100%;
  }
</style>
