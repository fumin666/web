/**
* Created by alex on 2019/2/20.
*/
<template>
  <s-row id="ViewSource">
    <s-col :span="4">
      <div class="grid-content bg-purple">所属类型：</div>
    </s-col>
    <s-col :span="20">
      <div class="grid-content bg-purple-light">{{data.cateName}}</div>
    </s-col>
    <s-col :span="4">
      <div class="grid-content bg-purple">规则名称：</div>
    </s-col>
    <s-col :span="20">
      <div class="grid-content bg-purple-light">{{data.keyName}}</div>
    </s-col>
    <s-col :span="4">
      <div class="grid-content bg-purple">规则内容：</div>
    </s-col>
    <s-col :span="20">
      <div>
        <s-table :data="tableList">
          <s-table-column label="序号" type="index" width="80"></s-table-column>
          <s-table-column label="内容" prop="name"></s-table-column>
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
        return list.map(item => {
          return {name: item}
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
