/*
 * @Author: 高建鹏
 * @Description: 获取每个card卡片中数据并处理成需要的数据
 * @Position:
 * @Date: 2019-08-23 22:55:05
 * @LastEditors: 高建鹏
 */
import $axios from 'sunflower-ajax'
import {chunk, ceil, max} from 'lodash'
import * as relation from './relation.js';

export default {
  props: {
    setData: {// 获取数据
      type: Object
    }
  },
  data() {
    return {
      timeInterval: null
    }
  },
  watch: {
    chunkData: {
      handler: function(val, old) {
        if (val.length === 0) {
          return;
        }
        let vm = this;
        function settime() {
          let arr = val.flat().map(item => {
            let viewName = relation[vm.name][item.viewName];
            if (viewName) {
              if (viewName.componentId === 'sigleProcessBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, isBlue: viewName.isBlue, unit: viewName.unit, notext1: viewName.notext1, data: [], unitisinline: viewName.unitisinline}
              } else if (viewName.componentId === 'moreProcessBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, isBlue: viewName.isBlue, unit: viewName.unit, notext1: viewName.notext1, data: [], unitisinline: viewName.unitisinline}
              } else if (viewName.componentId === 'statusBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, status: viewName, data: []}
              } else if (viewName.componentId === 'morelineBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, unit: viewName.unit, data: []}
              } else if (viewName.componentId === 'circlarBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, isTagName: viewName.isTagName, data: []}
              } else if (viewName.componentId === 'moreCirclarBusiness') {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, isTagName: viewName.isTagName, data: []}
              } else {
                return {title: item.viewName, eNames: item.eNames, tabs: item.tabs, componentId: viewName.componentId, data: []}
              }
            }
          }).filter(item => item)
          vm.frameworkData = arr;
          arr.map(item => {
            let url = vm.getUrl(item.componentId);
            let params = {
              monitorCiypeuuid: vm.monitorCiypeuuid,
              monitorDynamicViewName: item.eNames[0]
            }
            $axios.post(url, params).then((res) => {
              if (item.componentId === 'sigleProcessBusiness') {
                let chart = [];
                if (item.isBlue) {
                  let maxVal = max(res.data.map((obj, index) => { return obj.dataVal }))
                  let y = ceil(maxVal, -((maxVal + '').length - 2))
                  res.data.map((obj, index) => {
                    chart.push({
                      process: obj.dataVal ? ((obj.dataVal / y) * 100) : 0,
                      value: item.unitisinline ? (obj.dataVal + item.unit) : obj.dataVal,
                      unit: item.unitisinline ? null : item.unit,
                      text1: item.notext1 ? null : obj.tagName, // notext1为true是不显示前面接口名称
                      text2: obj.monitorItcompName,
                      ip: obj.ipAddr,
                      isBlue: true
                    })
                  })
                } else {
                  res.data.map((obj, index) => {
                    chart.push({
                      process: obj.dataVal,
                      value: obj.dataVal + '%',
                      text1: item.notext1 ? null : obj.tagName,
                      text2: obj.monitorItcompName,
                      ip: obj.ipAddr,
                      isBlue: false
                    })
                  })
                }
                item.data = chart;
              } else if (item.componentId === 'moreProcessBusiness') {
                let chart = [];
                if (item.isBlue) {
                  let maxVal = max(res.data.map((obj, index) => { return obj.dataVal }))
                  let y = ceil(maxVal, -((parseInt(maxVal) + '').length - 2))
                  res.data.map((obj, index) => {
                    chart.push({
                      process: obj.dataVal ? ((obj.dataVal / y) * 100) : 0,
                      value: item.unitisinline ? (obj.dataVal + item.unit) : obj.dataVal,
                      unit: item.unitisinline ? null : (Array.isArray(item.unit) ? (item.unit)[0] : item.unit),
                      text1: item.notext1 ? null : obj.tagName, // notext1为true是不显示前面接口名称
                      text2: obj.monitorItcompName,
                      ip: obj.ipAddr,
                      isBlue: true
                    })
                  })
                } else {
                  res.data.map((obj, index) => {
                    chart.push({
                      process: obj.dataVal,
                      value: obj.dataVal + '%',
                      text1: item.notext1 ? null : obj.tagName, // notext1为true是不显示前面接口名称
                      text2: obj.monitorItcompName,
                      ip: obj.ipAddr,
                      isBlue: false
                    })
                  })
                }
                let lastdata = []
                if (chart.length) {
                  if (item.tabs.length === 0) {
                    lastdata.push({title: '', data: chart})
                  } else {
                    item.tabs.map((name, index) => {
                      if (!index) {
                        lastdata.push({title: name, monitorCiypeuuid: vm.monitorCiypeuuid, eNames: item.eNames[index], isBlue: item.isBlue, unit: item.unit, unitisinline: item.unitisinline, notext1: item.notext1, data: chart})
                      } else {
                        lastdata.push({title: name, monitorCiypeuuid: vm.monitorCiypeuuid, eNames: item.eNames[index], isBlue: item.isBlue, unit: item.unit, unitisinline: item.unitisinline, notext1: item.notext1, data: []})
                      }
                    })
                  }
                }
                item.data = lastdata;
              } else if (item.componentId === 'circlarBusiness') {
                let chart = [];
                res.data.map((obj, index) => {
                  chart.push({
                    name: item.eNames[0] + index,
                    width: '100%',
                    height: '100%',
                    value: obj.dataVal,
                    text: obj.monitorItcompName,
                    isTagName: item.isTagName ? obj.tagName : null, // isTagName为true展示表空间名称
                    ip: obj.ipAddr
                  })
                })
                item.data = chunk(chart, 3);
              } else if (item.componentId === 'moreCirclarBusiness') {
                let chart = [];
                res.data.map((obj, index) => {
                  chart.push({
                    name: item.eNames[0] + index,
                    width: '100%',
                    height: '100%',
                    value: obj.dataVal,
                    text: obj.monitorItcompName,
                    isTagName: item.isTagName ? obj.tagName : null, // isTagName为true展示表空间名称
                    ip: obj.ipAddr
                  })
                })
                let lastdata = []
                if (chart.length) {
                  if (item.tabs.length === 0) {
                    lastdata.push({title: '', data: chunk(chart, 3)})
                  } else {
                    item.tabs.map((name, index) => {
                      if (!index) {
                        lastdata.push({title: name, monitorCiypeuuid: vm.monitorCiypeuuid, isTagName: item.isTagName, eNames: item.eNames[index], data: chunk(chart, 3)})
                      } else {
                        lastdata.push({title: name, monitorCiypeuuid: vm.monitorCiypeuuid, isTagName: item.isTagName, eNames: item.eNames[index], data: []})
                      }
                    })
                  }
                }
                item.data = lastdata;
              } else if (item.componentId === 'liquidfillBusiness') {
                let chart = [];
                res.data.map((obj, index) => {
                  chart.push({
                    name: item.eNames[0] + index,
                    width: '100%',
                    height: '100%',
                    value: obj.dataVal,
                    text: obj.monitorItcompName,
                    tagName: obj.tagName,
                    ip: obj.ipAddr
                  })
                })
                item.data = chunk(chart, 3);
              } else if (item.componentId === 'statusBusiness') {
                let chart = []
                if (Object.keys(res.data).length) {
                  for (let i in res.data) {
                    chart.push({value: res.data[i], text: i, img: item.status[i]})
                  }
                }
                item.data = chart;
              } else if (item.componentId === 'lineBusiness') {
                let chart = []
                res.data.map((obj, index) => {
                  chart.push({
                    name: item.eNames[0] + index,
                    width: '100%',
                    height: '100%',
                    value: obj.instantData,
                    // value: obj.data[0],
                    text: obj.itcompName,
                    ip: obj.ipAddr,
                    data: obj.data.reverse()
                  })
                })
                item.data = chunk(chart, 3);
              } else if (item.componentId === 'morelineBusiness') {
                if (res.data && res.data.length) {
                  let lastdata = {
                    name: item.eNames[0],
                    unit: item.unit,
                    xAxis: res.data[0].data,
                    data: res.data
                  }
                  item.data = [lastdata];
                } else {
                  item.data = []
                }
              }
            });
          })
        }
        if (vm.timeInterval) {
          clearInterval(vm.timeInterval);
        }
        settime();
        if (vm.setData.refreshPeriod) {
          vm.timeInterval = setInterval(() => {
            settime()
          }, vm.setData.refreshPeriod * 1000);
        }
      },
      immediate: true
    }
  },
  methods: {
    getUrl(name) {
      if (name === 'circlarBusiness' || name === 'liquidfillBusiness' || name === 'sigleProcessBusiness' || name === 'moreProcessBusiness' || name === 'moreCirclarBusiness') {
        // 列表
        return '/monitorSenceStatics/getSenceStaticsListObj';
      } else if (name === 'statusBusiness') {
        // 状态
        return '/monitorSenceStatics/getSenceStaticsMapObj';
      } else if (name === 'lineBusiness' || name === 'morelineBusiness') {
        // 折线
        return '/monitorSenceStatics/getSenceStaticsBrokenLine';
      }
    }
  },
  beforeDestroy() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }
}