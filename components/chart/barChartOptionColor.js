let colorList = ['#FD6D69', '#FEB64D', '#60ACFC', '#BBC1D1', '#9ADD7E', '#EB648D', '#FF9F63']
export default{
  light: {
    title: {
      textStyle: {
        color: 'rgba(0, 0, 0, 0.8)'
      }
    },
    grid: {
      y: 30,
      x: 10,
      x2: 10,
      y2: 50
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
        interval: 0,
        color: 'rgba(0,0,0,0.45)',
        formatter: function(value) {
          let ret = '';     // 拼接加\n返回的类目项
          let maxLength = 7;      // 每项显示文字个数
          let valLength = value.length;     // X轴类目项的文字个数
          let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
          // 如果类目项的文字大于3,
          if (rowN > 1) {
            for (let i = 0; i < rowN; i++) {
              let temp = '';      // 每次截取的字符串
              let start = i * maxLength;        // 开始截取的位置
              let end = start + maxLength;      // 结束截取的位置
              // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
              temp = value.substring(start, end) + '\n';
              ret += temp;      // 凭借最终的字符串
            }
            return ret;
          } else {
            return value;
          }
        }
      }
    }],
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
    series: [{
      type: 'bar',
      itemStyle: {
        normal: {
          color: function (params) {
            return colorList[params.dataIndex]
          },
          label: {
            color: 'rgba(0,0,0,0.65)',
            formatter: '{c}'
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
    grid: {
      y: 30,
      x: 10,
      x2: 10,
      y2: 50
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
        interval: 0,
        color: 'rgba(255,255,255,0.45)',
        formatter: function(value) {
          let ret = '';     // 拼接加\n返回的类目项
          let maxLength = 7;      // 每项显示文字个数
          let valLength = value.length;     // X轴类目项的文字个数
          let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
          // 如果类目项的文字大于3,
          if (rowN > 1) {
            for (let i = 0; i < rowN; i++) {
              let temp = '';      // 每次截取的字符串
              let start = i * maxLength;        // 开始截取的位置
              let end = start + maxLength;      // 结束截取的位置
              // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
              temp = value.substring(start, end) + '\n';
              ret += temp;      // 凭借最终的字符串
            }
            return ret;
          } else {
            return value;
          }
        }
      }
    }],
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
    series: [{
      type: 'bar',
      itemStyle: {
        normal: {
          color: function (params) {
            return colorList[params.dataIndex]
          },
          label: {
            color: 'rgba(255,255,255,0.65)',
            formatter: '{c}'
          }
        }
      }
    }]
  }
}
