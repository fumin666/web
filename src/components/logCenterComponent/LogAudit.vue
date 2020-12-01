/*
* @Author: 付敏
* @Description:Q4报表中心日志审计
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 8px;">
    <s-chart v-if="logAudit.data.length" :chart="logAudit"></s-chart>
    <div v-nodata="logAudit.data.length === 0" v-else :style="'height: ' + boxCardItemHeight + 'px;'"></div>
  </s-col>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import pieChartOption from '@/components/chart/pieChartOption.js'
    export default {
      data() {
        return {
          logAudit: {
            name: 'logAudit',
            type: 'pieChart',
            width: '100%',
            height: '300px',
            data: [],
            option: {
              title: {
                text: '全网日志级别数量统计图(最近24小时)',
                x: 'center'
              },
              legend: {
                left: '85%',
                top: 'center',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              },
              color: ['#60ACFC', '#A89FEC', '#EE85FF', '#FF7C7C', '#FEB64D', '#D4DE63', '#BBC1D1', '#32D3EB', '#5BC49F'],
              series: [{
                type: 'pie',
                radius: '55%'
              }]
            }
          },
          boxCardItemHeight: 200
        }
      },
      methods: {
        getTheme(val) {
          var option = {
            legend: {
              orient: 'vertical'
            },
            title: {
              textStyle: {
                fontSize: '16'
              }
            },
            series: [{
              radius: '50%',
              center: ['50%', '50%'],
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
            this.logAudit.option = merge({}, this.logAudit.option, pieChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.logAudit.option = merge({}, this.logAudit.option, pieChartOption.light, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
          this.boxCardItemHeight = boxCardItemHeight
          this.logAudit.height = boxCardItemHeight + 'px';
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        $axios.get(`/syslogReport/countLogLevelFor24Hours`).then((res) => {
          let data = []
          for (let key in res.data) {
            for (let i in res.data[key]) {
              data.push({name: key, value: i})
            }
          }
          this.logAudit.data = data
        });
      },
      watch: {
        '$store.state.theme': function(val) {
          this.getTheme(val)
        }
      },
      destroyed() {
        window.removeEventListener('resize', this.initDivHeight);
      }
    }
</script>

<style scoped>
</style>
