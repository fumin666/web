<!--
 * @Author: 高建鹏
 * @Description: 没有分页的进度条
 * @Position:
 * @Date: 2019-08-08 13:41:40
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
  <div v-if="data.length" key="sigleProcess">
    <div style="height:35px;"></div>
    <v-process :chart="item" v-for="(item, index) in data" :key="index"></v-process>
  </div>
  <div v-else v-nodata="data.length === 0" style="height:300px;">
  </div>
  </transition>
</div>
</template>

<script>
import vProcess from '../vProcess.vue'
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
    return {}
  },
  created() {
  }
}
</script>
