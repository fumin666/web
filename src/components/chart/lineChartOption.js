/*
 * @Author: 高建鹏
 * @Description:Q4柱状图option
 * @Position:
 * @Date: 2019-10-22 09:28:40
 * @LastEditors: 高建鹏
 */

export default{
  light: {
    title: {
      textStyle: {
        color: 'rgba(0, 0, 0, 0.8)'
      }
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        splitLine: {show: false},
        axisLine: {
          show: true,
          lineStyle: {
            color: '#60ACFC'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    yAxis: [{
      show: true,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#D6D6D6'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }],
    series: [
      {
        type: 'line',
        itemStyle: {
          normal: {
            color: function (params) {
              return '#60ACFC'
            },
            label: {
              color: 'rgba(0,0,0,0.65)',
              formatter: '{c}'
            }
          }
        }
      }
    ]
  },
  dark: {
    title: {
      textStyle: {
        color: 'rgba(255, 255, 255, 0.65)'
      }
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: true,
        splitLine: {show: false},
        axisLine: {
          show: true,
          lineStyle: {
            color: '#60ACFC'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }
    ],
    yAxis: [{
      show: true,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: 'rgba(255,255,255,0.1)'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      }
    }],
    series: [
      {
        type: 'line',
        itemStyle: {
          normal: {
            color: function (params) {
              return '#60ACFC'
            },
            label: {
              color: 'rgba(255,255,255,0.65)',
              formatter: '{c}'
            }
          }
        }
      }
    ]
  }
}
