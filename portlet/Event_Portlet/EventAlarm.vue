<template>
  <!--告警事件统计-->
  <div class="event-alarm">
    <s-card-diy
      title="告警事件统计"
      :more-click="moreClick">
      <div>
        <s-charts :chart="chart3" v-if="Object.keys(chart3.data).length"></s-charts>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {

    data() {
      return {
        chart3: {
          el: 'chart3',
          type: 'yBarChart',
          width: '100%',
          height: '260px',
          data: {},
          opt: {
            series: {
              itemStyle: {
                normal: {
                  color: '#60ACFC',
                  label: {
                    show: true,
                    position: 'right'
                  }
                }
              }
            },
            xAxis: {
              axisLabel: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(0,0,0,.1)',
                  width: 1,
                  type: 'dashed'
                }
              }
            },
            yAxis:
              {
                axisLine: {show: false}
              }
          }
        }
      }
    },

    created() {
      // 告警事件统计
      $axios.get('/eventCount/getAlarmCountByType').then((res) => {
        if (res.data && res.data instanceof Array) {
          this.chart3.data = this.resetData(res.data);
          console.log(this.chart3.data);
        }
      });
    },

    methods: {
      resetData(data) {
        let _data = {};
        for (let i = 0; i < data.length; i++) {
          _data[data[i].name] = data[i].value;
        }
        return _data;
      },

      moreClick() {
        this.$router.push('/EventCenter/event_alarmcenter');
      }
    }
  }
</script>
