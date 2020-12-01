<!--
 * @Author: 高建鹏
 * @Description: 状态统计业务
 * @Position:
 * @Date: 2019-08-08 13:41:43
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
  <div v-if="data.length" key="status">
    <v-status :chart="data"></v-status>
  </div>
  <div v-else v-nodata="data.length === 0" style="height:300px;">
  </div>
  </transition>
</div>
</template>

<script>
import vStatus from '../vStatus.vue'
export default {
  components: {
    vStatus
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
