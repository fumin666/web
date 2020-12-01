/*
* @Author: 付敏
* @Description:Q4报表中心基础通用
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 20px;">
    <s-row>
      <s-col v-if="OmaAuth" :span="12">
        <s-chart v-if="onlineOperate.data.length" :chart="onlineOperate"></s-chart>
        <div v-else v-nodata="onlineOperate.data.length === 0" :style="'height: ' + boxCardItemHeight + 'px;'"></div>
      </s-col>
      <s-col :span="!OmaAuth ? 24 : 12">
        <s-chart v-if="baseOnline.data.length" :chart="baseOnline"></s-chart>
        <div v-else v-nodata="baseOnline.data.length === 0" :style="'height: ' + boxCardItemHeight + 'px;'"></div>
      </s-col>
    </s-row>
  </s-col>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash'
  import pieChartOption from '@/components/chart/pieChartOption.js'
  import authCheck from '@/common/mixins/auth.js'
    export default {
      mixins: [authCheck],
      data() {
        return {
          onlineOperate: {
            name: 'onlineOperate',
            type: 'pieChart',
            width: '100%',
            height: '300px',
            data: [],
            option: {
              title: {
                text: '在线运维用户数量统计'
              },
              legend: {
                left: '35%',
                top: '85%',
                orient: 'vertical',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 10,             // 图例图形宽度
                itemHeight: 10
              },
              series: [
                {
                  type: 'pie',
                  label: {
                    normal: {
                      show: true,
                      formatter: function(params) {
                        var str = '';
                        switch (params.name) {
                          case '在线运维用户':str = '在线运维用户\n' + params.percent + '%' + ' (' + params.value + ')'; break;
                          case '在线未运维用户':str = '在线未运维用户\n' + params.percent + '%' + ' (' + params.value + ')'; break;
                        }
                        return str
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: true,
                      length2: 20
                    }
                  }
                }
              ]
            }
          },
          baseOnline: {
            name: 'baseOnline',
            type: 'pieChart',
            width: '100%',
            height: '300px',
            data: [],
            option: {
              title: {
                text: '在线用户数量统计'
              },
              color: ['#71B3FA', '#FEB64D'],
              legend: {
                left: '35%',
                top: '85%',
                orient: 'vertical',
                icon: 'circle',
                padding: [5, 20],
                itemGap: 10,
                itemWidth: 8,             // 图例图形宽度
                itemHeight: 8
              },
              series: [{
                type: 'pie',
                label: {
                  normal: {
                    show: true,
                    formatter: function(params) {
                      var str = '';
                      switch (params.name) {
                        case '在线用户':str = '在线用户\n' + params.percent + '%' + ' (' + params.value + ')'; break;
                        case '离线用户':str = '离线用户\n' + params.percent + '%' + ' (' + params.value + ')'; break;
                      }
                      return str
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: true,
                    length2: 20
                  }
                }
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
              orient: 'vertical',
              bottom: '10%'
            },
            title: {
              textStyle: {
                fontSize: '16',
                color: '#fff',
                opacity: '0.85'
              }
            },
            series: [{
              radius: '50%',
              center: ['50%', '45%'],
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    color: 'rgba(255, 255, 255, 0.65)'
                  }
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
            option.series[0].label.normal.textStyle.color = 'rgba(255, 255, 255, 0.65)';
            option.title.textStyle.color = 'rgba(255, 255, 255, 0.65)'
            this.onlineOperate.option = merge({}, this.onlineOperate.option, pieChartOption.dark, option)
            this.baseOnline.option = merge({}, this.baseOnline.option, option)
          } else {
            option.series[0].itemStyle.normal.borderColor = '#fff';
            option.series[0].label.normal.textStyle.color = 'rgba(0, 0, 0, 0.65)';
            option.title.textStyle.color = 'rgba(0, 0, 0, 0.8)'
            this.onlineOperate.option = merge({}, this.onlineOperate.option, pieChartOption.light, option)
            this.baseOnline.option = merge({}, this.baseOnline.option, option)
          }
        },
        initDivHeight () {
          var boxCardItemHeight = document.getElementById('boxCardItem').offsetHeight;
          this.boxCardItemHeight = boxCardItemHeight
          this.onlineOperate.height = boxCardItemHeight + 'px';
          this.baseOnline.height = boxCardItemHeight + 'px';
        }
      },
      mounted() {
        let mainTheme = localStorage.getItem('theme');
        this.getTheme(mainTheme)
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
        $axios.get('/logCenterIndex/onlineOperate').then((res) => { // 在线运维用户数量统计
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: res.data[key]})
          }
          this.onlineOperate.data = data
        });
        $axios.get('/logCenterIndex/baseOnline').then((res) => { // 平台在线用户数量统计
          let data = []
          for (let key in res.data) {
            data.push({name: key, value: res.data[key]})
          }
          this.baseOnline.data = data
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
