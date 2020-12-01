<!--
 * @Author: 高建鹏
 * @Description: 水球图业务
 * @Position:
 * @Date: 2019-08-08 11:02:55
 * @LastEditors: 高建鹏
 -->
<template>
<div v-if="flag">
  <transition name="component-fade" mode="out-in">
    <div v-if="data.length" key="liquidfill">
      <s-row class="vrowstyle" v-for="(item, index) in data" :key="index">
        <s-col :span="8" v-for="(obj, key) in item" :key="key">
          <v-liquidfill :chart='obj'></v-liquidfill>
        </s-col>
      </s-row>
    </div>
    <div v-else v-nodata="data.length === 0" style="height:300px;">
    </div>
  </transition>
</div>
</template>

<script>
import vLiquidfill from '../vLiquidfill.vue'
import {loadScript} from 'sunflower-common-utils';
export default {
  components: {
    vLiquidfill
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      flag: false
    }
  },
  created() {
    loadScript('../../static/js/echarts-liquidfill.js', () => {
      this.flag = true;
    });
  }
}
</script>

<style scoped>

</style>
