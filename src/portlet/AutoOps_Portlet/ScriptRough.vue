<template>
  <div class="auto-main-item" style="height:470px;">
    <div v-nodata="surveyChartData.data.length === 0">
      <s-chart :chart="surveyChartData"></s-chart>
    </div>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import barChartOption from '@/components/chart/barChartOption.js'
  export default{
    data() {
      return {
        surveyChartData: {
          name: 'surveyChartData',
          type: 'rainbowBarChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {}
        }
      }
    },
    methods: {
      getTheme(val) {
        var option = {
          series: [{
            radius: '70%',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#1E2732'
              }
            }
          }]
        }
        if (val === 'dark') {
          option.series[0].itemStyle.normal.borderColor = '#1E2732';
          this.surveyChartData.option = merge({}, this.surveyChartData.option, barChartOption.dark)
        } else {
          option.series[0].itemStyle.normal.borderColor = '#fff';
          this.surveyChartData.option = merge({}, this.surveyChartData.option, barChartOption.light)
        }
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      $axios.get(`/autoMateCount/getScriptLibCount`).then(({data}) => {
        this.surveyChartData.data = data || []
      })
    },
    watch: {
      '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
