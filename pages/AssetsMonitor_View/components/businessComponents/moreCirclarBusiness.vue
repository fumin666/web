<!--
 * @Author: 高建鹏
 * @Description: 有tab-pane分页的圆环图
 * @Position:
 * @Date: 2019-08-08 14:50:15
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
  <s-tab class="vpage" @tab-click="btn" v-if="data.length" key="moreCirclar">
    <s-tab-pane :label="obj.title" :name="index+''" v-for="(obj, index) in data" :key="index">
      <div v-if="obj.data.length">
        <s-row class="vrowstyle" v-for="(item, index1) in obj.data" :key="index1">
          <s-col :span="8" v-for="obj1 in item" :key="obj1.name">
            <v-circlar :chart='obj1'></v-circlar>
          </s-col>
        </s-row>
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
import $axios from 'sunflower-ajax'
import vCirclar from '../vCirclar.vue'
import {chunk} from 'lodash'
export default {
  components: {
    vCirclar
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
  watch: {
    data(val) {
      this.activeName = '0';
    }
  },
  created() {
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
            res.data.map((obj, index) => {
              chart.push({
                name: this.data[this.activeName].eNames + index,
                width: '100%',
                height: '100%',
                value: obj.dataVal,
                text: obj.monitorItcompName,
                isTagName: this.data[this.activeName].isTagName ? obj.tagName : null, // isTagName为true展示表空间名称
                ip: obj.ipAddr
              })
            })
            this.data[this.activeName].data = chunk(chart, 3);
          })
      }
    }
  }
}
</script>
