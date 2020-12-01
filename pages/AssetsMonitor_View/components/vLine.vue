<!--
 * @Author: 高建鹏
 * @Description: 折线
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: mybells
 *      chart: {
          name: 'id',
          width: '200px',
          height: '200px',
          value: 30,
          text:'name',
          ip:'192.132.123.123',
          data:[]
        },
 -->
<template>
<div class="vline">
  <div :id="chart.name" :style="size" :key="chart.name"></div>
  <div class="nature">
    <div class="text text1" style="text-align:left" :title="chart.text">{{chart.text}}</div>
  </div>
  <div class="nature">
    <div class="text text2" style="text-align:left;" :title="chart.ip">{{chart.ip}}</div>
  </div>
</div>
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
      style.width = this.chart.width;
      style.height = this.chart.height;
      return style;
    },
    option() {
      // eslint-disable-next-line no-undef
      let orange = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: '#FFA928'
          },
          {
            offset: 1,
            color: this.theme === 'dark' ? '#0B1A2C' : '#fff'
          }
        ]
      );
      // eslint-disable-next-line no-undef
      let green = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: '#5CE7A4'
          },
          {
            offset: 1,
            color: this.theme === 'dark' ? '#0B1A2C' : '#fff'
          }
        ]
      );
      // eslint-disable-next-line no-undef
      let red = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: '#FA5B5B'
          },
          {
            offset: 1,
            color: this.theme === 'dark' ? '#0B1A2C' : '#fff'
          }
        ]
      );
      return {
        title: {
          text: this.chart.value + '%',
          right: 10,
          top: 10,
          z: 11,
          textStyle: {
            fontSize: 16,
            color: this.theme === 'dark' ? '#fff' : '#000'
          }
        },
        grid: {
          top: '10',
          left: '10',
          right: '10',
          bottom: '15',
          containLabel: false
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          boundaryGap: false, // x轴从0开始到结束显示
          data: this.chart.data,
          splitLine: {
            show: true,
            lineStyle: {
              color: [this.theme === 'dark' ? '#1F3146' : '#D6D6D6']
            }
          }, // 去除网格线
          splitArea: {
            show: false
          }, // 保留网格区域
          axisLabel: {
            show: false,
            interval: 0
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: [this.theme === 'dark' ? '#1F3146' : '#D6D6D6']
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          }, // 去除网格线
          splitArea: {
            show: false
          }, // 保留网格区域
          axisLine: {
            show: true,
            lineStyle: {
              color: [this.theme === 'dark' ? '#1F3146' : '#D6D6D6']
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          // For shadow
          {
            type: 'line',
            showSymbol: false, // 显示折线拐点
            itemStyle: {
              normal: {
                color: this.chart.value < 70 ? '#5CE7A4' : (this.chart.value < 90 ? '#D62525' : '#FA5B5B')
              }
            }, // 线条样式
            lineStyle: {
              normal: {
                color: this.chart.value < 70 ? '#5CE7A4' : (this.chart.value < 90 ? '#FFA928' : '#FA5B5B')
              }
            },
            areaStyle: {
              normal: {
                color: this.chart.value < 70 ? green : (this.chart.value < 90 ? orange : red)
              }
            },
            z: 10,
            animation: false,
            data: this.chart.data.map(val => {
              if (typeof parseInt(val) === 'number') {
                return parseInt(val);
              } else {
                return 0;
              }
            })
          }
        ]
        // visualMap: [
        //   {
        //     show: false,
        //     pieces: [{
        //       gt: 0,
        //       lt: 70,
        //       color: 'green',
        //     },{
        //       gte: 70,
        //       lt: 90,
        //       color: 'orange',
        //     }],
        //     outOfRange: {
        //       color: 'red',
        //     },
        //   },
        // ]
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

<style lang="stylus">
// .vline
//   .nature
//     width: 100%;
//     text-align: center;
//     .text
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       overflow: hidden;
//       padding-left: 15px;
//       font-family: PingFang SC;
//       font-size: 12px;
//     .text1
//       color: #9C9796;
//     .text2
//       color: #392C28;
</style>
