/**
* Created by alex on 2019/2/23.
*/
<template>
  <s-collapse v-model="activeName" id="edit-level-damage-rule">
    <s-collapse-item v-for="(item, index) in formData" :title="item.name" :name="index" :key="index">
      <ul class="item-list">
        <li v-for="(item, index) in item.children" :key="index">
          <span style="margin-left: 5px">{{ruleLevel[item.logLevel]}}>=</span>
          <s-input v-model="item.ruleValue" style="width: 65px"></s-input>
        </li>
      </ul>
    </s-collapse-item>
  </s-collapse>
</template>

<script type="text/babel">
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        activeName: [0, 1, 2, 3],
        ruleLevel: ['应急', '警报', '致命', '错误', '警告', '提示', '信息', '诊断', '未知'],
        formData: ''
      }
    },
    props: {
      currentData: {
        type: Array
      }
    },
    created() {
      this.formData = cloneDeep(this.currentData)
    }
  }
</script>
<style lang="stylus">
  #edit-level-damage-rule
    .item-list li
      float left
      margin-bottom 8px
</style>
