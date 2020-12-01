<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理列表
 * @Description:查看关联人员
 * @Position:资产管理列表-》操作栏查看关联人员
 * @Date: 2019-11-01 09:48:38
 * @LastEditors  : mybells
 -->
<template>
  <s-dialog v-model="checkRelationDialog" title="查看关联人员" width="700px" :before-close="close" class="checkRelationDialog">
    <s-table-page :data="listData" :header-search='getUserSearchDef()' max-height="600">
      <s-table-column label="真实姓名" prop="realName"></s-table-column>
      <s-table-column label="账号名称" prop="userLoginName"></s-table-column>
      <s-table-column label="协议" prop="protocolName"></s-table-column>
      <s-table-column label="端口" prop="protocolPort"></s-table-column>
      <s-table-column label="资产账号" prop="assetAccount"></s-table-column>
      <s-table-column label="账号角色" prop="assetAccountRole"></s-table-column>
      <s-table-column label="授权清单" prop="authName"></s-table-column>
    </s-table-page>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    components: {
    },
    data() {
      return {
        listData: []
      }
    },
    props: {
      checkRelationDialog: {
        type: Boolean,
        default: false
      },
      assetUuid: {
        type: String,
        require: true
      }
    },
    created() {
      $axios.get(`/operationAuth//getAssetAuthUserList/${this.assetUuid}`).then(({data}) => {
        this.listData = data || [];
      });
    },
    methods: {
      close() {
        this.$emit('update:checkRelationDialog', false)
      },
      getUserSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['realName', 'assetAccount', 'protocolName', 'protocolPort', 'assetAccountRole', 'authName'] // can be string or Array
        }
      }
    }
  }
</script>
