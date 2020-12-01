<template>
  <div class="show">
    <span class="title titlespan">配置型类型</span>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple label">分类</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{lookList.cmdbCitypeCategory.categoryName}}</div>
      </s-col>
    </s-row>
    <s-row v-if="lookList.fatherCitype!==null">
      <s-col :span="10">
        <div class="grid-content bg-purple label" >上级配置项类型</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" >{{lookList.fatherCitype.citypeName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple label">配置项类型名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{lookList.citypeName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple label" style="overflow: hidden;text-overflow:ellipsis;white-space: nowrap; ">描述</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{lookList.citypeDescription}}</div>
      </s-col>
    </s-row>
   <div v-if="lookList.typeAttributeList.length !== 0"><span class="title titlespan">属性</span></div>
    <s-scrollbar wrap-class="myHeight">
    <s-row v-for="(item,index) in lookList.typeAttributeList" :key="index">
      <s-col>
        <div class="grid-content bg-purple typediv">{{item.colnumName}}</div>
      </s-col>
    </s-row>
    </s-scrollbar>
    <s-table
    :data="lookList.cmdbCitypeRelationships"
    style="margin: 15px 0;"
    max-height="150"
    >
      <s-table-column
      prop="relationName"
      label="关系"
      >
      </s-table-column>
      <s-table-column
        prop="citypeName"
        label="资产类型"
      >
      </s-table-column>
    </s-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  props: {
    lookList: {
      type: Object
    }
  }
}
</script>

<style lang="stylus">
.label
  text-align:right
.typediv
  test-align:center
.titlespan
  margin-left:30px
.myHeight
  max-height:250px
</style>
