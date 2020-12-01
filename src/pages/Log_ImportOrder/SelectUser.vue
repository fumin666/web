<template>
  <section class="logSelectUser">
      <s-table-page
        :data="List"
        :header-search="getSearchDef()"
        @selection-change="handleSelectionChange"
        key="SessionList"
        ref="table"
        :show-header-checkbox="true"
        height="400">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="账号名称" prop="userLoginName" show-overflow-tooltip></s-table-column>
        <s-table-column label="真实姓名" prop="userRealName" show-overflow-tooltip></s-table-column>
        <s-table-column label="创建时间" prop="createDateStr" width="180px"></s-table-column>
        <s-table-column label="创建人" prop="createUserName" show-overflow-tooltip></s-table-column>
        <s-table-column label="组织机构" prop="departName"></s-table-column>
        <s-table-column label="角色" prop="roleName" show-overflow-tooltip></s-table-column>
        <s-table-column label="状态" prop="statusName"></s-table-column>
      </s-table-page>
  </section>
</template>

<script>
  export default {
    props: ['List'],
    data() {
      return {
        userSelection: [],
        nameSelection: [],
        selection: []
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['createDateStr', 'createUserName', 'roleName', 'statusName', 'userLoginName', 'userRealName']
        }
      },
      handleSelectionChange(val) {
        var vm = this;
        vm.userSelection = [];
        vm.nameSelection = [];
        vm.selection = [];
        val.map(function(item) {
          vm.userSelection.push(item.uuid);
          vm.nameSelection.push(item.userLoginName);
          vm.List.map((itemList, indexList) => {
            if (item.uuid === itemList.uuid) {
              vm.selection.push(indexList);
            }
          });
        });
        this.$emit('usersUuid', vm.userSelection, vm.nameSelection.toString(), vm.selection);
      }
    }
  }
</script>
