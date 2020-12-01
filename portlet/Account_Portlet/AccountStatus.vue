<template>
  <div class="diy-account-status">
    <s-card-diy
      :show-more="false"
      title="账号状态统计">
      <s-chart :chart="chart1" v-if="Object.keys(chart1.data).length"></s-chart>
      <div v-nodata="true" v-else style="height: 300px"></div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import ringChartOption from '@/components/chart/ringChartOption.js'
  import { merge } from 'lodash'
  export default {

    data() {
      return {
        chart1: {
          name: 'chart',
          type: 'statRingChart',
          width: '100%',
          height: '300px',
          data: {},
          option: {
            title: {
              text: '账号总数',
              subtext: 0
            },
            legend: {
              orient: 'horizontal',
              y: 'bottom',
              icon: 'circle',
              padding: [5, 20],
              itemGap: 10,
              itemWidth: 10,             // 图例图形宽度
              itemHeight: 10
            }
          }
        },
        roundOption: {
          title: {
            x: '49%',
            y: '25%',
            textStyle: {
              fontSize: 14
            }
          },
          legend: {
            type: '',
            x: 'left',
            y: '65%',
            orient: 'horizontal'
          },
          series: [{
            radius: ['30%', '50%'],
            center: ['50%', '30%']
          }]
        }
      }
    },

    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme);
      this.getChart();
    },

    methods: {
      getChart() {
        $axios.get('iamUserInfo/getCountByStatus').then((res) => {
          this.chart1.data = res.data
          let accountNum = 0
          res.data.forEach(v => {
            accountNum += v.value
          })
          this.chart1.option.title.subtext = accountNum
        });
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.dark, this.roundOption)
        } else {
          this.chart1.option = merge({}, this.chart1.option, ringChartOption.light, this.roundOption)
        }
      }
    }
  }
</script>
