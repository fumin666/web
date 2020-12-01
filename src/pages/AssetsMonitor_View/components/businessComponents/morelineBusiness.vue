<!--
 * @Author: 高建鹏
 * @Description: 多条折线的折线图业务
 * @Position:
 * @Date: 2019-08-08 13:41:41
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
  <div v-if="data.length" key="moreline">
    <s-col :span="24">
      <v-moreline :chart='data[0]'></v-moreline>
    </s-col>
  </div>
  <div v-else v-nodata="data.length === 0" style="height:300px;">
  </div>
  </transition>
</div>
</template>

<script>
import vMoreline from '../vMoreline.vue'
export default {
  components: {
    vMoreline
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
