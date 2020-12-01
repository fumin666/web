<template>
  <!--自定义首页 本周工作量统计-->
  <div class="diy-process-weeklyWorkload">
    <s-card-diy
      title="本周工作量统计"
      :show-more="false">
      <s-charts :chart="chart2" v-if="Object.keys(chart2.data).length" :click-fun="goWeekWorkAccount"></s-charts>
      <div v-nodata="true" v-else style="height: 250px"></div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { merge } from 'lodash';
  import barChartOption from '@/components/chart/barChartOptionY.js'
  export default {
    name: 'process-weeklyWorkload',

    data() {
      return {
        chart2: {
          el: 'chartWeeklyWorkload',
          type: 'yBarChart',
          width: '100%',
          height: '100%',
          data: {},
          opt: {
            xAxis: {
              axisLine: {
                show: false // 坐标轴轴线不显示
              },
              axisLabel: {
                show: false // 坐标轴刻度不显示
              },
              splitLine: {
                show: true, // 坐标轴在区域中的分隔线
                lineStyle: {
                  type: 'dashed'
                }
              }
            },
            yAxis: {
              axisLine: {
                lineStyle: {
                  color: '#000',
                  opacity: 0.2
                }
              }
            },
            color: ['#60ACFC'],
            series: [{
              type: 'bar',
              data: [],
              barWidth: 12,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              }
            }]
          }
        }
      }
    },

    created() {
      this.getData();
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
    },

    methods: {
      getTheme(val) {
        if (val === 'dark') {
          this.chart2.option = merge({}, this.chart2.option, barChartOption.dark)
        } else {
          this.chart2.option = merge({}, this.chart2.option, barChartOption.light)
        }
      },
      getData() {
        let _this = this
        $axios.get('/itilWorkflowCenter/orderWorksStat/2').then(res => {
          if (res) {
            var data = [];
            // var order = _this.chartSerialize(res.data.order, 2)
            var order = res.data.order
            for (let key in order) {
              var param = {
                value: 0,
                name: ''
              };
              param.name = order[key];
              param.value = res.data.group[0].data[key];
              data.push(param)
            }
            if (data.length > 0) {
              let msg = {};
              for (let item in data) {
                msg[data[item].name] = parseInt(data[item].value);
                _this.chart2.opt.series[0].data.push(data[item].value)
              }
              _this.chart2.data = msg
            }
          }
        });
      },
      chartSerialize(data, stopnum) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          if (this.strlen(data[i]) >= stopnum) {
            arr.push(data[i].substring(0, stopnum));
          } else {
            arr.push(data[i]);
          }
        }
        return arr;
      },
      goWeekWorkAccount(data) {
        let orderType = data.name;
        this.goto('ProcessCenter/WeekWorkAccount/2/' + orderType);
      },
      goto(path) {
        this.$router.push(path)
      },
      strlen(str) {
        if (str == null) return 0;
        if (typeof str !== 'string') {
          str += '';
        }
        return str.replace(/[^\x00-\xff]/g, '01').length
      }
    }
  }
</script>
