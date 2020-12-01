<!--
 * @Author: 高建鹏
 * @Description: 球形波浪图
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: mybells
 *      chart: {
          name: 'id',
          width: '200px',
          height: '200px',
          value: 30,
          text:'name',
          tagName:'tagName',
          ip:'192.132.123.123'
        },
  使用时要先加载static\js\echarts-liquidfill.js插件，
 -->
<template>
<div class="vliquidfill">
  <div :id="chart.name" :style="size" :key="chart.name"></div>
  <div class="nature" style="display:flex;justify-content: center;">
    <div class="text text1" style="white-space: nowrap; text-overflow: ellipsis;overflow: hidden;" :title="chart.text">{{chart.text}}</div>
    <div class="text1" style="font-family: PingFang SC;font-size:12px;" v-if="chart.text">&nbsp;|&nbsp;</div>
    <div class="text1" style="white-space: nowrap;font-family: PingFang SC;font-size:12px;" :title="chart.tagName">{{chart.tagName}}</div>
  </div>
  <div class="nature">
    <div class="text text2" :title="chart.ip">{{chart.ip}}</div>
  </div>
</div>
</template>

<script>
export default {
  name: 's-liquidfill',
  props: {
    chart: {
      type: Object
    }
  },
  data() {
    return {
      myChart: null,
      chartInstance: null,
      theme: 'fanta',
      color: ['#392C28', '#fff'],
      background: ['#fff', '#0B1A2C'],
      outcolor: ['#EAEAEA', '#506986']
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
      let red = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: 'rgba(250, 91, 91, 0.4)'
          },
          {
            offset: 1,
            color: 'red'
          }
        ]
      );
      // eslint-disable-next-line no-undef
      let orange = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: 'rgba(255, 216, 117, 0.4)'
          },
          {
            offset: 1,
            color: '#D62525'
          }
        ]
      );
      // eslint-disable-next-line no-undef
      let green = new echarts.graphic.LinearGradient(
        0, 0, 0, 1,
        [{
            offset: 0,
            color: 'rgba(201, 255, 158, 0.47)'
          },
          {
            offset: 1,
            color: '#18D5A7'
          }
        ]
      );
      return {
        series: [{
          type: 'liquidFill',
          data: [{
            value: this.chart.value / 100,
            itemStyle: {
              color: this.chart.value < 70 ? green : (this.chart.value < 90 ? orange : red)
            }
          }, {
            value: this.chart.value / 100,
            itemStyle: {
              color: this.chart.value < 70 ? green : (this.chart.value < 90 ? orange : red)
            }
          }],
          silent: true,
          radius: '80%',
          animationDuration: 0,
          animationDurationUpdate: 0,
          itemStyle: {
            shadowBlur: 0
          },
          waveAnimation: true,
          backgroundStyle: {
            color: this.theme === 'dark' ? this.background[1] : this.background[0]
          },
          label: {
            show: true,
            normal: {
              formatter: function(param) {
                return (param.value * 100).toFixed(2) + '%';
              }
            },
            color: this.theme === 'dark' ? this.color[1] : this.color[0],
            insideColor: this.theme === 'dark' ? this.color[1] : this.color[0],
            fontSize: 15,
            fontWeight: 'bold'
          },
          outline: {
            show: true,
            borderDistance: 1,
            itemStyle: {
              color: this.theme === 'dark' ? this.outcolor[1] : this.outcolor[0],
              borderColor: this.theme === 'dark' ? this.outcolor[1] : this.outcolor[0],
              borderWidth: 0
            }
          }
        }]
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
      this.myChart.setOption(this.option);
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
// .vliquidfill
//   .nature
//     width: 100%;
//     text-align: center;
//     .text
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       overflow: hidden;
//       padding: 0 34px;
//       font-family: PingFang SC;
//       font-size:12px;
//     .text1
//       color:#9C9796;
//     .text2
//       color:#392C28;
</style>
