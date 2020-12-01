<!--
 * @Author: 高建鹏
 * @Description: 圆环
 * @Position:
 * @Date: 2019-07-15 15:21:38
 * @LastEditors: mybells
 *      chart: {
          name: 'id',
          width: '200px',
          height: '200px',
          value: 30,
          text:'name',
          isTagName:'tagname'
          ip:'192.132.123.123'
        },
 -->
<template>
<div class="vcirclar">
  <div :id="chart.name" :style="size" :key="chart.name" class="abc"></div>
  <div class="nature">
    <div class="text text1" :title="chart.text">{{chart.text}}</div>
  </div>
  <div class="nature">
    <div class="text text2" :title="chart.ip">{{chart.ip}}</div>
  </div>
  <div class="nature" v-if="chart.isTagName">
    <div class="text text1" :title="chart.isTagName">{{chart.isTagName}}</div>
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
      return {
        min: 0,
        max: 100,
        series: [
          {
            type: 'gauge',
            radius: '90%',
            startAngle: 225,
            endAngle: -45,
            pointer: {show: false},
            detail: {show: false},
            data: [{
                value: 1
            }],
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [1, this.theme === 'dark' ? '#506986' : '#e7e7e7']
                ],
                width: 2,
                opacity: 0.7
              }
            },
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false}
          },
          {
          type: 'gauge',
          radius: '80%',
          startAngle: 245,
          endAngle: -65,
          axisLine: {
            show: true,
            lineStyle: {
              width: 5,
              color: [
                [this.chart.value / 100, this.chart.value < 70 ? '#57CA7E' : (this.chart.value < 90 ? '#FFA928' : '#FA5B5B')],
                [1, this.theme === 'dark' ? '#506986' : '#e7e7e7']
              ]
            }
          },
          splitLine: {show: false},
          axisTick: {show: false},
          axisLabel: {show: false},
          splitLabel: {show: false},
          pointer: {show: false},
          title: {
            offsetCenter: [0, '9%'],
            color: this.theme === 'dark' ? '#fff' : '#392C28',
            fontSize: 15,
            fontWeight: 'bold'
          },
          detail: {
            show: false
          },
          data: [{
            name: this.chart.value + '%'
          }]
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
.vcirclar .abc>div{
  margin:0 auto !important;
}
// .vcirclar
//   .nature
//     width: 100%;
//     text-align: center;
//     .text
//       text-overflow: ellipsis;
//       white-space: nowrap;
//       overflow: hidden;
//       padding: 0 34px;
//       font-family: PingFang SC;
//       font-size: 12px;
//     .text1
//       color: #9C9796;
//     .text2
//       color: #392C28;
</style>
