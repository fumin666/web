<!--
 * @Author: 高建鹏
 * @Description: 圆环图业务
 * @Position:
 * @Date: 2019-08-08 13:41:38
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <transition name="component-fade" mode="out-in">
    <div v-if="data.length" key="circlar">
      <s-row class="vrowstyle" v-for="(item, index) in data" :key="index">
        <s-col :span="8" v-for="(obj, key) in item" :key="key">
          <v-circlar :chart='obj'></v-circlar>
        </s-col>
      </s-row>
    </div>
    <div v-else v-nodata="data.length === 0" style="height:300px;">
    </div>
  </transition>
</div>
</template>

<script>
import vCirclar from '../vCirclar.vue'
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
    return {}
  },
  created() {
  }
}
</script>