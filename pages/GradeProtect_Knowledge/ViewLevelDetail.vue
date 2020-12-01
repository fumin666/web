/**
* Created by alex on 2019/2/20.
*/
<template>
  <s-row id="ViewSource">
    <s-col :span="4">
      <div class="grid-content bg-purple">等保分类</div>
    </s-col>
    <s-col :span="20">
      <div class="grid-content bg-purple-light">{{data.cateName}}</div>
    </s-col>
    <s-col :span="4">
      <div class="grid-content bg-purple">等保指标</div>
    </s-col>
    <s-col :span="20">
      <div class="grid-content bg-purple-light">{{data.keyName}}</div>
    </s-col>
    <s-col :span="4">
      <div class="grid-content bg-purple">要求项</div>
    </s-col>
    <s-col :span="20">
      <div>
        <s-table :data="tableList" :show-header="false">
          <s-table-column prop="index" width="45"></s-table-column>
          <s-table-column prop="name"></s-table-column>
        </s-table>
      </div>
    </s-col>
  </s-row>
</template>

<script>
  export default {
    created() {
    },
    computed: {
      tableList() {
        const list = Object.values(this.data.targetMap)
        return list.map((item, index) => {
          return {name: item, index: (index + 1)}
        })
      }
    },
    props: {
      data: {
        type: Object
      }
    }
  }
</script>
<style lang="stylus">
  #ViewSource
    .s-col
      margin-bottom 5px
</style>
