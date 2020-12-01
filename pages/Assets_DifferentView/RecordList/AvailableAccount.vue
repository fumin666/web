/**
* Created by liushupeng on 2019/2/20.
*/
<template>
  <!--运维视角-可使用账号-->
  <div>
    <s-table-page
      style="margin-bottom: 20px;"
      :data="dataList"
      :header-search="getHeaderSearch()">
      <s-table-column label="账号名称" prop="userName" />
      <s-table-column label="账号角色" prop="accountTypeName"></s-table-column>
      <s-table-column label="账号类型" prop="accountAttributeName" />
      <s-table-column label="是否AD域账号" prop="isAd" >
        <template slot-scope="scope">
          <span v-if="scope.row.isAd === 1">是</span>
          <span v-else>否</span>
        </template>
      </s-table-column>
      <s-table-column label="协议名称" prop="protocolName" />
      <s-table-column label="端口" prop="port" />
    </s-table-page>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dataList: []
      }
    },
    props: {
      uuid: {
        type: String,
        default: ''
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入账号名称、账号角色、协议名称进行查询',
          searchProps: ['userName', 'accountAttributeName', 'protocolName']
        }
      },
      getData() {
        $axios.get('/assetsAccountInfo/getAllAccountForOperationByItcomp/' + this.uuid).then(res => {
          this.dataList = res.data;
        })
      }
    }
  }
</script>

<style>
</style>
