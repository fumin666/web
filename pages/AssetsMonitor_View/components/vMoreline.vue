<!--
 * @Author: 高建鹏
 * @Description: 多层折线
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: mybells
 *      chart:  {
          name: 'idxxx',
          unit:'℃',
          xAxis:['9:30', '9:40', '9:50', '10:00', '10:10', '10:20'],
          data: [
            {data: [20, 15, 25, 5, 10, 30],ipAddr: "192.168.212.52",itcompName: "IBM硬件"},
            {},
            {},
          ]
        }
 -->
<template>
<div :id="chart.name" :style="size" :key="chart.name"></div>
</template>

<script>
export default {
  props: {
    chart: {
      type: Object
    }
  },
  data() {
    return {
      myChart: null,
      theme: 'fanta',
      chartInstance: null
    }
  },
  computed: {
    size() {
      let style = {};
      style.width = '100%';
      style.height = '300px';
      return style;
    },
    option() {
      let vm = this;
      return {
        legend: {
          bottom: 5,
          textStyle: {
            color: this.theme === 'dark' ? '#fff' : '#000'
          },
          data: []
        },
        grid: {
          top: '15',
          left: '60',
          right: '40',
          bottom: '90',
          containLabel: false
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket) {
            return params.seriesName + '<br>' + vm.chart.data[params.seriesIndex].itcompName + '<br><span style="font-size:20px">' + params.value + vm.chart.unit + '</span>';
          }
        },
        xAxis: {
          boundaryGap: false, // x轴从0开始到结束显示
          nameTextStyle: {
            color: this.theme === 'dark' ? '#fff' : '#000'
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: [this.theme === 'dark' ? '#1F3146' : '#D6D6D6']
            }
          },
          axisLabel: {
            textStyle: {
                color: this.theme === 'dark' ? '#fff' : '#000'
            }
          },
          data: this.chart.xAxis
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: [this.theme === 'dark' ? '#1F3146' : '#D6D6D6']
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
                color: this.theme === 'dark' ? '#fff' : '#000'
            }
          }
        },
        series: []
      }
    }
  },
  created() {
    this.theme = window.localStorage.theme;
    window.addEventListener('resize', this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler);
  },
  methods: {
    resizeHandler() {
      this.chartInstance.resize();
    },
    drewChart() {
      this.option.legend.data = this.chart.data.map(item => item.ipAddr);
      let arr = []
      this.chart.data.map((item, index) => {
        let obj = {
          type: 'line',
          data: item.data,
          name: item.ipAddr,
          title: item.itcompName,
          symbolSize: 7
        }
        arr.push(obj)
      })
      this.option.series = arr;
      if (this.myChart) {
        // eslint-disable-next-line no-undef
        echarts.dispose(this.myChart)
      }
        // eslint-disable-next-line no-undef
        this.myChart = echarts.init(document.getElementById(this.chart.name));
      // eslint-disable-next-line no-undef
      this.myChart.setOption(this.option, true);
      this.chartInstance = this.myChart;
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      // eslint-disable-next-line no-undef
      echarts.dispose(this.myChart)
    }
  },
  watch: {
    chart: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$nextTick(() => {
          this.drewChart();
        });
      }
    },
    '$store.state.theme': function (val) {
      this.theme = val;
      this.drewChart();
    }
  }
}
</script>

<style scoped>
</style>
