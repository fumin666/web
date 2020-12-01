<!--
 * @Author: 高建鹏
 * @Description: Grid业务组件，为了展示架构.  data为本页面展示和排序的数据
  格式为[[{},{},{}],[{}]，是lodash的chunk(size=3)处理过的
 * @Date: 2019-08-08 10:25:33
 * @LastEditors: 高建鹏
 -->
<template>
<div>
  <s-grid direction="row" style="height: 370px; width: 100%;" v-for="(arr, index) in data" :key="index">
    <s-col :span="8" v-for="(obj, index) in arr" :key="index">
      <s-grid-item>
        <v-card :title=obj.title>
          <slot :name="obj.viewName"></slot>
        </v-card>
      </s-grid-item>
    </s-col>
  </s-grid>
</div>
</template>

<script>
import vCard from '../vCard.vue'
export default {
  components: {
    vCard
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  }
}
</script>

<style scoped>
</style>