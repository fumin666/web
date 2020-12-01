/*
* @Author: 付敏
* @Description:Q4报表中心数据库审计
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 8px;">
    <s-chart v-if="sqlAudit.data.length" :chart="sqlAudit"></s-chart>
    <div v-else v-nodata="sqlAudit.data.length === 0" :style="'height: ' + boxCardItemHeight + 'px;'"></div>
  </s-col>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import pieChartOption from '@/components/chart/pieChartOption.js'
    export default {
      data() {
        return {
          sqlAudit: {
            name: 'sqlAudit',
            type: 'pieChart',
            width: '100%',
            height: '300px',
            data: [],
            option: {
              title: {
                text: '本月数据库账号使用次数统计',
                x: 'center'
              },
              legend: {
                left: '70%',
                top: 'center',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              },
              color: ['#60ACFC', '#32D3EB', '#BBC1D1', '#5BC49F', '#D4DE63', '#FEB64D', '#FF7C7C', '#EE85FF', '#A89FEC'],
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
            this.sqlAudit.option = merge({}, this.sqlAudit.option, pieChartOption.dark, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            this.sqlAudit.option = merge({}, this.sqlAudit.option, pieChartOption.light, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
          this.boxCardItemHeight = boxCardItemHeight
          this.sqlAudit.height = boxCardItemHeight + 'px';
        },
        getLastMonthYestdy(date) { // 获取当前时间的上个月这一天
          var daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          var strYear = date.getFullYear();
          var strDay = date.getDate();
          var strMonth = date.getMonth() + 1;
          var strHours = date.getHours();
          var strSeconds = date.getSeconds();
          var strMinutes = date.getMinutes();
          if (strYear % 4 === 0 && strYear % 100 !== 0) {
            daysInMonth[2] = 29;
          }
          if (strMonth - 1 === 0) {
            strYear -= 1;
            strMonth = 12;
          } else {
            strMonth -= 1;
          }
          strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
          if (strMonth < 10) {
            strMonth = '0' + strMonth;
          }
          if (strDay < 10) {
            strDay = '0' + strDay;
          }
          if (strHours < 10) {
            strHours = '0' + strHours;
          }
          if (strSeconds < 10) {
            strSeconds = '0' + strSeconds;
          }
          if (strMinutes < 10) {
            strMinutes = '0' + strMinutes;
          }
          let datastr = strYear + '-' + strMonth + '-' + strDay + ' ' + strHours + ':' + strMinutes + ':' + strSeconds;
          return datastr;
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        let form = {
          startTime: parseInt(new Date(this.getLastMonthYestdy(new Date())).getTime() / 1000),
          endTime: parseInt(new Date().getTime() / 1000),
          timeType: '3'
        }
        $axios.post('/logCenterIndex/dataBaseAccount', form).then((res) => {
          if (res.status === 200) {
            let data = []
            for (let key in res.data) {
              data.push({name: key, value: res.data[key]})
            }
            this.sqlAudit.data = data
          }
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
