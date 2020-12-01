/*
 * @Author: 高建鹏
 * @Description:Q4饼图option
 * @Position:
 * @Date: 2019-10-22 09:28:40
 * @LastEditors: 高建鹏
 */

import {colorlist} from '@/common/utils/chartColor.js'
export default{
  light: {
    title: {
      textStyle: {
        color: 'rgba(0, 0, 0, 0.8)'
      }
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      orient: 'horizontal',
      x: 'center',
      bottom: '10px',
      icon: 'circle',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(0, 0, 0, 0.65)'
      }
    },
    series: [{
      type: 'pie',
      radius: '50%',
      center: ['50%', '40%'],
      label: {
        normal: {
          show: true,
          position: 'outside',
          textStyle: {
            color: 'rgba(0, 0, 0, 0.65)'
          }
        }
      },
      itemStyle: {
        normal: {
          color: function (params) {
            return colorlist[params.dataIndex]
          },
          borderColor: '#fff',
          borderWidth: 2
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
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      orient: 'horizontal',
      x: 'center',
      bottom: '10px',
      icon: 'circle',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(255, 255, 255, 0.45)'
      }
    },
    series: [{
      type: 'pie',
      radius: '50%',
      center: ['50%', '40%'],
      label: {
        normal: {
          show: true,
          position: 'outside',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.65)'
          }
        }
      },
      itemStyle: {
        normal: {
          color: function (params) {
            return colorlist[params.dataIndex]
          },
          borderWidth: 2,
          borderColor: '#1E2732'
        }
      }
    }]
  }
}
