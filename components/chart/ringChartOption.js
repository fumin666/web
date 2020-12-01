/*
 * @Author: 高建鹏
 * @Description:Q4圆环图option
 * @Position:
 * @Date: 2019-10-22 09:01:54
 * @LastEditors: mybells
 */

import {colorlist} from '@/common/utils/chartColor.js'
export default{
  light: {
    title: {
      x: '33.8%',
      y: '35%',
      icon: 'circle',
      textAlign: 'center',
      textStyle: {
        fontWeight: 'normal',
        color: ['rgba(0, 0, 0, 0.6)']
      },
      subtextStyle: {
        fontWeight: 'bold',
        verticalAlign: 'middle',
        align: 'center',
        width: '100%',
        color: 'rgba(0, 0, 0, 0.85)'
      }
    },
    color: colorlist,
    tooltip: {
      confine: true,
      formatter: function(obj) {
        let ret = '';     // 拼接加\n返回的类目项
        let maxLength = 10;      // 每项显示文字个数
        let valLength = obj.name.length;     // X轴类目项的文字个数
        let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
        // 如果类目项的文字大于3,
        if (rowN > 1) {
          for (let i = 0; i < rowN; i++) {
            let temp = '';      // 每次截取的字符串
            let start = i * maxLength;        // 开始截取的位置
            let end = start + maxLength;      // 结束截取的位置
            // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            if (i === rowN - 1) {
              temp = obj.name.substring(start, end);
            } else {
              temp = obj.name.substring(start, end) + '<br />';
            }
            ret += temp;      // 凭借最终的字符串
          }
          return ret + ' : ' + obj.value + '(' + obj.percent + '%)';
        } else {
          return obj.name + ' : ' + obj.value + '(' + obj.percent + '%)';
        }
      }
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      type: 'scroll',
      pageIconSize: [10, 10],
      x: null,
      y: null,
      right: 30,
      orient: 'vertical',
      icon: 'circle',
      pageTextStyle: {
        color: 'rgba(0, 0, 0, 0.85)'
      },
      textStyle: {
        color: ['rgba(0, 0, 0, 0.85)']
      },
      formatter: function(value) {
        let ret = '';     // 拼接加\n返回的类目项
        let valLength = value.length;     // X轴类目项的文字个数
        // 如果类目项的文字大于3,
        if (valLength > 10) {
          ret = value.substr(0, 10) + '...';
          return ret;
        } else {
          return value;
        }
      }
    },
    series: [{
      radius: ['50%', '72%'],
      center: ['35%', '50%'],
      label: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    }]
  },
  dark: {
    title: {
      x: '33.8%',
      y: '35%',
      icon: 'circle',
      textAlign: 'center',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: ['rgba(255, 255, 255, 0.45)']
      },
      subtextStyle: {
        fontWeight: 'bold',
        verticalAlign: 'middle',
        align: 'center',
        width: '100%',
        color: 'rgba(255, 255, 255, 0.85)'
      }
    },
    color: colorlist,
    tooltip: {
      confine: true,
      formatter: function(obj) {
        let ret = '';     // 拼接加\n返回的类目项
        let maxLength = 10;      // 每项显示文字个数
        let valLength = obj.name.length;     // X轴类目项的文字个数
        let rowN = Math.ceil(valLength / maxLength);      // 类目项需要换行的行数
        // 如果类目项的文字大于3,
        if (rowN > 1) {
          for (let i = 0; i < rowN; i++) {
            let temp = '';      // 每次截取的字符串
            let start = i * maxLength;        // 开始截取的位置
            let end = start + maxLength;      // 结束截取的位置
            // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
            if (i === rowN - 1) {
              temp = obj.name.substring(start, end);
            } else {
              temp = obj.name.substring(start, end) + '<br />';
            }
            ret += temp;      // 凭借最终的字符串
          }
          return ret + ' : ' + obj.value + '(' + obj.percent + '%)';
        } else {
          return obj.name + ' : ' + obj.value + '(' + obj.percent + '%)';
        }
      }
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      type: 'scroll',
      x: null,
      y: null,
      right: 50,
      orient: 'vertical',
      icon: 'circle',
      pageTextStyle: {
        color: 'rgba(255, 255, 255, 0.45)'
      },
      textStyle: {
        color: ['rgba(255, 255, 255, 0.45)']
      },
      formatter: function(value) {
        let ret = '';     // 拼接加\n返回的类目项
        let valLength = value.length;     // X轴类目项的文字个数
        // 如果类目项的文字大于3,
        if (valLength > 10) {
          ret = value.substr(0, 10) + '...';
          return ret;
        } else {
          return value;
        }
      }
    },
    series: [{
      radius: ['50%', '72%'],
      center: ['35%', '50%'],
      label: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          borderColor: '#1E2732',
          borderWidth: 2
        }
      }
    }]
  }
}
