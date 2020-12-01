<!--
 * @Author: 高建鹏
 * @Description: 折线图业务
 * @Position:
 * @Date: 2019-08-08 13:41:39
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
    <div v-if="data.length" key="line">
      <s-row class="vrowstyle" v-for="(item, index) in data" :key="index">
        <s-col :span="8" v-for="(obj, key) in item" :key="key">
          <v-line :chart='obj'></v-line>
        </s-col>
      </s-row>
    </div>
    <div v-else v-nodata="data.length === 0" style="height:300px;">
    </div>
  </transition>
</div>
</template>

<script>
import vLine from '../vLine.vue'
export default {
  components: {
    vLine
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
