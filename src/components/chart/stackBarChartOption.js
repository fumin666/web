/*
 * @Author: 高建鹏
 * @Description:Q4柱状图option
 * @Position:
 * @Date: 2019-10-22 09:28:40
 * @LastEditors: mybells
 */

export default{
  light: {
    color: ['#54DAAC', '#F5764E', '#FEC534'],
    grid: {
      top: 50,
      bottom: 50,
      right: 20,
      left: 20
    },
    legend: {
      x: null,
      left: null,
      y: null,
      right: 20,
      top: 10,
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(0, 0, 0, 0.85)'
      }
    },
    xAxis: [{
      splitArea: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#D6D6D6'
        }
      },
      axisLabel: {
        color: 'rgba(0,0,0,0.45)'
      }
    }],
    yAxis: [{
      show: true,
      splitLine: {
        show: true,
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
        show: false
      }
    }],
    series: [
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        }
      },
      {
        type: 'bar',
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        }
      }
    ]
  },
  dark: {
    color: ['#54DAAC', '#F5764E', '#FEC534'],
    grid: {
      top: 50,
      bottom: 50,
      right: 20,
      left: 20
    },
    legend: {
      x: null,
      left: null,
      y: null,
      right: 20,
      top: 10,
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(255, 255, 255, 0.65)'
      }
    },
    xAxis: [{
      splitArea: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.45)'
      }
    }],
    yAxis: [{
      show: true,
      splitLine: {
        show: true,
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
        show: false
      }
    }],
    series: [
      {
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        }
      },
      {
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        }
      }
    ]
  }
}
