<!--
 * @Author: 高建鹏
 * @Description:横向柱状图（样子是Q4一级页面资产管理资产分布模块）
 * @Position:
 * @Date: 2019-10-21 16:19:39
 * @LastEditors: 高建鹏
 chart:{
   name:'el',
   data:[
     {name:'上海上讯信息技术股份有限公司'，value:80},
     {name:'产品需求组'，value:62},
     {name:'产品研发组'，value:55},
     {name:'部门12345'，value:45},
     {name:'部门1234567'，value:38},
   ],
   option:{}
 }
 -->

<template>
<s-charts :chart="chartdata"></s-charts>
</template>

<script>
import { merge } from 'lodash'
export default {
  props: {
    chart: {
      type: Object
    }
  },
  data() {
    return {
      chartdata: {},
      options: {
        light: {
          title: {
            textStyle: {
              color: 'rgba(0, 0, 0, 0.8)'
            }
          },
          series: [{
            label: {
              normal: {
                textStyle: {
                  color: '#000'
                }
              }
            }
          },
          // 年份
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: 12,
                  color: '#333'
                }
              }
            }
          }]
        },
        dark: {
          title: {
            textStyle: {
              color: 'rgba(255, 255, 255, 0.65)'
            }
          },
          series: [{
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255,255,255,0.65)'
                }
              }
            }
          },
          // 年份
          {
            label: {
              normal: {
                textStyle: {
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.65)'
                }
              }
            }
          }]
        }
      }
    }
  },
  created() {
    this.createChart();
  },
  methods: {
    getTheme(val) {
      if (val === 'dark') {
        this.chartdata.opt = merge({}, this.chartdata.opt, this.options.dark)
      } else {
        this.chartdata.opt = merge({}, this.chartdata.opt, this.options.light)
      }
    },
    createChart() {
      let vm = this.chart;
      let valueArr = vm.data.map(item => item.value);
      let config = vm.option || {};
      let option = {
        grid: {
          left: '2%',
          right: '10%',
          bottom: '5%',
          top: '5%'
        },
        tooltip: {
          show: true,
          confine: true,
          formatter: function (data) {
            let value = vm.data[data.dataIndex].name
            let ret = '';     // 拼接加\n返回的类目项
            let maxLength = 15;      // 每项显示文字个数
            let valLength = value.length;     // X轴类目项的文字个数
            let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
            // 如果类目项的文字大于3,
            if (rowN > 1) {
              for (let i = 0; i < rowN; i++) {
                let temp = '';      // 每次截取的字符串
                let start = i * maxLength;        // 开始截取的位置
                let end = start + maxLength;      // 结束截取的位置
                // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                temp = value.substring(start, end) + '<br />';
                ret += temp;      // 凭借最终的字符串
              }
              return ret;
            } else {
              return value;
            }
          }
        },
        xAxis: [{
          type: 'value',
          // show: false
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
          {
            type: 'value',
            show: false
          }
        ],
        yAxis: {
          type: 'category',
          inverse: true,
          show: false
        },
        series: [
          {
            show: true,
            type: 'bar',
            barGap: '-100%',
            barWidth: '25%',
            z: 2,
            itemStyle: {
              normal: {
                color: '#60ACFC'
              }
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#000',
                  fontWeight: 'bold'
                },
                position: 'right',
                formatter: function (data) {
                  return (vm.data[data.dataIndex].value);
                }
              }
            },
            data: valueArr
          },
          // 年份
          {
            show: true,
            type: 'bar',
            xAxisIndex: 1, // 代表使用第二个X轴刻度
            barGap: '-100%',
            barWidth: '25%',
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            },
            label: {
              normal: {
                show: true,
                position: [0, '-20'],
                textStyle: {
                  fontSize: 14,
                  color: '#333'
                },
                formatter: function (data) {
                  // eslint-disable-next-line no-undef
                  let chart = echarts.getInstanceByDom(document.getElementById(vm.name));
                  let width = chart.getWidth();
                  let name = vm.data[data.dataIndex].name;
                  let len = name.length;
                  let fontwidth = 0;
                  let i = 0;
                  for (;i < len; i++) {
                    if (/[^\u4E00-\u9FA5]/.test(name.charAt(i))) {
                      fontwidth = fontwidth + 8;
                    } else {
                      fontwidth = fontwidth + 14;
                    }
                    if (fontwidth >= width) {
                      break;
                    }
                  }
                  if (vm.data[data.dataIndex].name.length > (i + 2)) {
                    return vm.data[data.dataIndex].name.substring(0, (i + 2)) + '...'
                  } else {
                    return vm.data[data.dataIndex].name;
                  }
                }
              }
            },
            data: Array(valueArr.length).fill(Math.max(...valueArr))
          }
        ]
      }

      let mainTheme = localStorage.getItem('theme');
      this.chartdata = {
        el: vm.name,
        type: 'baseChart',
        width: '100%',
        height: vm.height,
        opt: mainTheme === 'dark' ? merge({}, option, this.options.dark, config) : merge({}, option, this.options.light, config)
      }
    }
  },
  watch: {
    '$store.state.theme': function(val) {
      this.getTheme(val)
    },
    'chart': {
      handler(obj) {
        this.createChart();
      },
      deep: true
    }
  }
}
</script>
