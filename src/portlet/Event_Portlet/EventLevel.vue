<template>
  <!--事件级别统计-->
  <div class="diy-event-level">
    <s-card-diy
      title="事件级别统计"
      :more-click="moreClick">
      <s-charts :chart="chart1" v-if="Object.keys(chart1.data).length"></s-charts>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {reverseObj} from 'sunflower-common-utils'
  const colorlist = ['#FFB851', '#FB8032', '#F3608D', '#E7493E'];
  export default {
    name: 'event-level',

    data() {
      return {
        chart1: {
          el: 'chart1',
          type: 'yBarChart',
          width: '100%',
          height: '150px',
          data: {},
          opt: {
            series: {
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colorlist[params.dataIndex]
                  },
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
      this.getData();
    },

    methods: {
      getData() {
        // 事件级别统计
        let vm = this;
        $axios.get('eventCount/getEventCountByLevel').then((res) => {
          if (res.data && res.data instanceof Array) {
            let arr = res.data.slice(0, 4);
            vm.chart1.data = reverseObj(vm.resetData(arr))
          }
        });
      },
      resetData(data) {
        let _data = {};
        for (let i = 0; i < data.length; i++) {
          _data[data[i].name] = data[i].value;
        }
        return _data;
      },
      moreClick() {
        this.$router.push('/EventCenter/event_level');
      }
    }
  }
</script>
