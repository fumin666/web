<!--
 * @Author: 高建鹏
 * @Description: 有tab-pane多页的进度条
 * @Position:
 * @Date: 2019-08-08 13:41:40
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
  <s-tab class="vpage" @tab-click="btn" v-if="data.length" key="moreProcess">
    <s-tab-pane :label="obj.title" :name="index+''" v-for="(obj, index) in data" :key="index">
      <div v-if="obj.data.length">
        <v-process :chart="item" v-for="(item, key) in obj.data" :key="key"></v-process>
      </div>
      <div v-else v-nodata="obj.data.length === 0" style="height:240px;">
      </div>
    </s-tab-pane>
  </s-tab>
  <div v-else v-nodata="data.length === 0" style="height:300px;"></div>
  </transition>
</div>
</template>

<script>
import vProcess from '../vProcess.vue'
import {ceil, max} from 'lodash'
import $axios from 'sunflower-ajax'
export default {
  components: {
    vProcess
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      activeName: '0'
    }
  },
  created() {
  },
  watch: {
    data(val) {
      this.activeName = '0';
    }
  },
  methods: {
    btn(com, event) {
      if (com.name === this.activeName) {
        return
      } else {
          this.activeName = com.name;
          let params = {
            monitorCiypeuuid: this.data[this.activeName].monitorCiypeuuid,
            monitorDynamicViewName: this.data[this.activeName].eNames
          }
          $axios.post('/monitorSenceStatics/getSenceStaticsListObj', params).then((res) => {
            let chart = [];
            if (this.data[this.activeName].isBlue) {
              let maxVal = max(res.data.map((obj, index) => { return obj.dataVal }))
              let y = ceil(maxVal, -((parseInt(maxVal) + '').length - 2))
              let item = this.data[this.activeName];
              res.data.map((obj, index) => {
                chart.push({
                  process: obj.dataVal ? ((obj.dataVal / y) * 100) : 0,
                  value: item.unitisinline ? (obj.dataVal + item.unit) : obj.dataVal,
                  unit: item.unitisinline ? null : (Array.isArray(item.unit) ? (item.unit)[this.activeName] : item.unit),
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
                  text1: this.data[this.activeName].notext1 ? null : obj.tagName, // notext1为true是不显示前面接口名称
                  text2: obj.monitorItcompName,
                  ip: obj.ipAddr,
                  isBlue: false
                })
              })
            }
            this.data[this.activeName].data = chart;
          })
      }
    }
  }
}
</script>
