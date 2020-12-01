<template>
  <section class="selectInstitution">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="selectList"
        :header-search="getSearchDef()"
        :hasActionCol = false
        :pagination-show = false
        @selection-change="handleSelectionChange"
        key="SessionList"
        ref="table">
        <s-table-column type="selection" width="45" reserve-selection></s-table-column>
        <s-table-column label="机构名称" prop="name"></s-table-column>
        <s-table-column label="机构编号" prop="remark"></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>

  export default {
    data() {
      return {
        selection: [],
        institutionSelection: [],
        departName: []
      }
    },
    props: {
      selectList: {
        type: Array
      }
    },
    methods: {
      handleSelectionChange(val) {
        var vm = this;
        vm.institutionSelection = [];
        vm.selection = [];
        vm.departName = [];
        val.map(function(item) {
          vm.institutionSelection.push(item.uuid);
          vm.departName.push(item.name);
          vm.selectList.map((itemList, indexList) => {
            if (item.uuid === itemList.uuid) {
              vm.selection.push(indexList);
            }
          });
        });
        this.$emit('institutionsUuid', vm.institutionSelection, vm.departName.toString(), vm.selection);
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'remark']
        }
      }
    }
  }
</script>
