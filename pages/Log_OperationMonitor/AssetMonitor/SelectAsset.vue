<template>
  <section class="selectAsset">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="asset"
        :header-search="getSearchDef()"
        :hasActionCol = false
        max-height='600'
        @selection-change="handleSelectionChange"
        key="asset"
        ref="assetTable">
        <s-table-column
          type="selection"
          width="45">
        </s-table-column>
        <s-table-column
          label="资产名称"
          prop="itcompName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="IP地址"
          prop="controlAdderss">
        </s-table-column>
        <s-table-column
          label="资产类别"
          prop="citypeName">
        </s-table-column>
        <!--<s-table-column-->
          <!--label="业务名称"-->
          <!--prop="businessName">-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="所属机构"-->
          <!--prop="cmdbOrguuid">-->
        <!--</s-table-column>-->
        <!--<s-table-column-->
          <!--label="资产状态"-->
          <!--prop="status">-->
        <!--</s-table-column>-->
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>

  export default {
    components: {

    },
    props: ['asset'],
    data() {
      return {
        institutionSelection: [],
        itcompName: [],
        selection: []
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName']
        }
      },
      handleSelectionChange(val) {
        var vm = this;
        vm.institutionSelection = [];
        vm.itcompName = [];
        vm.selection = [];
        val.map(function(item) {
          vm.institutionSelection.push(item.uuid);
          vm.itcompName.push(item.itcompName);
          vm.asset.map((itemList, indexList) => {
            if (item.uuid === itemList.uuid) {
              vm.selection.push(indexList);
            }
          });
        });
        this.$emit('getAssetUuid', vm.institutionSelection, vm.itcompName.toString(), vm.selection);
      }
    }
  }
</script>
