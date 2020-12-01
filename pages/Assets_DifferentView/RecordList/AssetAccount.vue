/**
* Created by liushupeng on 2019/2/21.
*/
<template>
  <!--资产账号-->
  <s-table-page
    style="margin-bottom: 20px;"
    :data="filterAccountList"
    :header-search="getHeaderSearch()
">
    <s-table-column label="账号名称" prop="accountName" />
    <s-table-column label="账号角色" prop="accountTypeStr" />
    <s-table-column label="账号类型" prop="attributeName" />
    <s-table-column label="是否AD域账号">
      <template slot-scope="scope">
        <span v-if="scope.row.isAd === 1">是</span>
        <span v-else>否</span>
      </template>
    </s-table-column>
    <s-table-column label="状态" prop="statusName" />
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        accountList: [],
        uuid: this.$route.params.assetUuid
      }
    },
    computed: {
      filterAccountList() {
        return this.accountList.filter(item => {
          return !(item.snmpCWordOr || item.snmpCWordRw);
        }).map(item => {
          item.attribute = item.attribute ? item.attribute + '' : '1';
          item.isBund = item.isBund ? item.isBund + '' : '0';
          return item;
        });
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入账号名称、账号角色、账号类型、状态进行查询',
          searchProps: ['accountName', 'accountTypeStr', 'attributeName', 'attributeName', 'statusName']
        }
      },
      getList() {
        let vm = this
        $axios.get(`/assetsAccountInfo//viewAssetsAccountInfo/${this.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.accountList = res.data;
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
