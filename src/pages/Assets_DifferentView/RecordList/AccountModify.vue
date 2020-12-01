/**
* Created by liushupeng on 2019/2/21.
*/
<template>
  <!--账号改密-->
  <s-table-page
    style="margin-bottom: 20px;"
    :data="modifyList"
    :header-search="getHeaderSearch()">
    <s-table-column label="账号名称" prop="accountName" />
    <s-table-column label="账号角色" prop="accountTypeName" />
    <s-table-column label="账号类型" prop="accountAttributeName" />
    <s-table-column label="是否AD域账号">
      <template slot-scope="scope">
        <span v-if="scope.row.isAd === 1">是</span>
        <span v-else>否</span>
      </template>
    </s-table-column>
    <s-table-column label="任务名称" prop="taskName" />
    <s-table-column label="改密时间" prop="createDate" />
    <s-table-column label="状态" prop="resultStr" />
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        modifyList: [],
        uuid: this.$route.params.assetUuid
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['accountName', 'accountTypeName', 'accountAttributeName', 'isAd', 'taskName', 'createDate', 'resultStr']
        }
      },
      getList() {
        let vm = this
        $axios.get(`/assetsRelationPage/getAccountPasswdChangeHisByItcomp/${this.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.modifyList = res.data;
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
