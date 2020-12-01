<template>
  <section class="logSelectHost">
    <s-scrollbar wrap-class="myScrollHeight">
      <s-table-page
        :data="List"
        :header-search="getSearchDef()"
        :hasActionCol = false
        :pagination-show = false
        @selection-change="handleSelectionChange"
        key="SessionList"
        ref="hostTable">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
        <s-table-column label="IP地址" prop="controlAdderss" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产类别" prop="citypeName" show-overflow-tooltip></s-table-column>
        <s-table-column label="使用部门" prop="cmdbOrganization.departName" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>

  export default {
    components: {

    },
    props: ['List'],
    data() {
      return {
        hostSelection: [],
        departName: [],
        selection: []
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'cmdbOrganization.departName']
        }
      },
      handleSelectionChange(val) {
        var vm = this;
        vm.hostSelection = [];
        vm.departName = [];
        vm.selection = [];
        val.map(function(item) {
          vm.hostSelection.push(item.uuid);
          vm.departName.push(item.itcompName);
          vm.List.map((itemList, indexList) => {
            if (item.uuid === itemList.uuid) {
              vm.selection.push(indexList);
            }
          });
        });
        this.$emit('usersUuid', vm.hostSelection, vm.departName.toString(), vm.selection);
      }
    }
  }
</script>

<style>
  .logSelectHost .right {
    margin-left: 350px;
  }
  .logSelectHost .myScrollHeight {
    max-height: 350px;
  }
</style>
