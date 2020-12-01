<template>
  <section class="assetDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="asseDetailtLists"
        :header-search="{show: false}"
        :hasActionCol = false
        key="assetList"
        ref="assetTable">
        <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产类别" prop="citypeName" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产IP" prop="controlAdderss" show-overflow-tooltip></s-table-column>
        <s-table-column label="配置管理员机构" prop="operationOrgName" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产状态" prop="assetStatusName" show-overflow-tooltip></s-table-column>
      </s-table-page>
      <!--<s-table-->
        <!--:data="asseDetailtLists">-->
        <!--<s-table-column-->
          <!--label="资产名称"-->
          <!--prop="itcompName"-->
          <!--show-overflow-tooltip>-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="资产类别"-->
          <!--prop="cmdbCitype.citypeName">-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="资产IP"-->
          <!--prop="controlAdderss"-->
          <!--width="170px">-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="组织机构"-->
          <!--prop="cmdbOrganization.departName">-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="资产状态"-->
          <!--prop="cmdbAssetinfo.assetstatusView.assetstatusName">-->
        <!--</s-table-column>-->
      <!--</s-table>-->
    </s-scrollbar>
  </section>
</template>

<script>

  export default {
    components: {

    },
    data() {
      return {
      }
    },
    props: ['asseDetailtLists'],
    created() {

    }
  }
</script>
