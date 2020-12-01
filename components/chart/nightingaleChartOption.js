/*
 * @Author: 高建鹏
 * @Description:Q4玫瑰图option（一级页面资产管理）
 * @Position:
 * @Date: 2019-10-22 09:28:40
 * @LastEditors: 高建鹏
 */

import { colorlist } from '@/common/utils/chartColor.js'
export default {
  light: {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      orient: 'vertical',
      right: '30px',
      left: null,
      top: null,
      bottom: '30px',
      icon: 'circle',
      data: [],
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(0, 0, 0, 0.85)'
      }
    },
    calculable: true,
    series: [{
      type: 'pie',
      center: ['50%', '50%'],
      roseType: 'radius',
      label: {
        normal: {
          formatter: ['{a|{b}}', '{a|{d}% ({c})}'].join('\n'),
          rich: {
            a: {
              color: 'rgba(0, 0, 0, 0.85)',
              fontSize: 14
            }
          }
        }
      },
      itemStyle: {
        normal: {
          color: function (params) {
            return colorlist[params.dataIndex]
          }
        }
      },
      data: []
    }]
  },
  dark: {
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    legend: {
      itemHeight: 8,
      itemWidth: 8,
      orient: 'vertical',
      right: '30px',
      left: null,
      top: null,
      bottom: '30px',
      icon: 'circle',
      data: [],
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: 'rgba(255, 255, 255, 0.45)'
      }
    },
    calculable: true,
    series: [{
      type: 'pie',
      center: ['50%', '50%'],
      roseType: 'radius',
      label: {
        normal: {
          formatter: ['{a|{b}}', '{a|{d}% ({c})}'].join('\n'),
          rich: {
            a: {
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: 14
            }
          }
        }
      },
      itemStyle: {
        normal: {
          color: function (params) {
            return colorlist[params.dataIndex]
          }
        }
      },
      data: []
    }]
  }
}