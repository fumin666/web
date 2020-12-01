/**
* Created by liushupeng on 2019/2/21.
*/
<template>
  <!--配置变更详情-->
  <div>
    <s-table-page
      ref="table5"
      :data="dataList"
      :header-search="getHeaderSearch()"
      :show-header-checkbox="false">
      <s-table-column prop="attrName" width="120" label="配置项名称"></s-table-column>
      <s-table-column prop="typeStr" width="120" label="变更形式"></s-table-column>
      <s-table-column prop="content" label="变更内容"></s-table-column>
      <s-table-column prop="updateTimeStr" width="190" label="变更时间"></s-table-column>
      <s-table-column prop="userName" width="110" label="变更人"></s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dataList: [],
        uuid: this.$route.params.assetUuid
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入配置项名称、变更形式、变更内容、变更时间, 变更人进行查询',
          searchProps: ['attrName', 'typeStr', 'content', 'updateTimeStr', 'userName']
        }
      },
      getList() {
        $axios.get(`/assetInspectHistory/viewBaselineHisByItcomp/${this.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.dataList = res.data;
          }
        })
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<style>
</style>
