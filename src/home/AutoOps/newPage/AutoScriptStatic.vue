<!--
 * @Author: 高建鹏
 * @Description:近30天脚本执行状况统计
 * @Position:
 * @Date: 2019-10-18 13:40:26
 * @LastEditors: mybells
 -->

<template>
  <section class="autoScriptStatic" style="height:40%;">
    <s-card class="box-card card-line" style="height:100%;">
      <div slot="header" class="clearfix">
        <span class="card-title">{{ cardConfig.title }}</span>
        <div class="card-enter more-info" @click="handleMore('dayInspection?tab=periodicTasks')">{{ cardConfig.moreText }}</div>
      </div>
      <div style="padding-bottom:70px;height:100%;box-sizing: border-box;">
        <s-chart v-if="chartData.data.length" :chart="chartData"></s-chart>
        <div v-nodata="!chartData.data.length"></div>
      </div>
    </s-card>
  </section>
</template>
<script type="text/babel">
  import { merge } from 'lodash'
  import stackBarChartOption from '@/components/chart/stackBarChartOption.js'
  import $axios from 'sunflower-ajax';
  export default {
    name: 'autoScriptStatic',
    data () {
      return {
        cardConfig: {
          title: '近30天脚本执行状况统计',
          moreText: '更多'
        },
        chartData: {
          name: 'scriptstatic',
          type: 'stackBarChart',
          width: '100%',
          height: '100%',
          data: [],
          option: {}
        }
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      $axios.get(`/autoMateCount/scriptExecutionThirtyDays`).then(({data}) => {
        let dataSort = data || [];
        let arr = dataSort.map(item => {
          return {'stack': item.dayNum, '成功': item.successCount, '失败': item.failureCount}
        })
        this.chartData.data = arr;
      })
    },
    methods: {
      handleMore(path) {
        this.$router.push('/AutoOpsCenter/' + path)
      },
      getTheme(val) {
        if (val === 'dark') {
          this.chartData.option = merge({}, this.chartData.option, stackBarChartOption.dark)
        } else {
          this.chartData.option = merge({}, this.chartData.option, stackBarChartOption.light)
        }
      }
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
