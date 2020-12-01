/**
* Created by alex on 2017/5/27.
 */

<template>
  <section>
    <s-table-page
      :data="visibleTableData"
      :header-search ='SearchCondition()'
      @selection-change="handleSelectionChange">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="账号名称" prop="userLoginName"></s-table-column>
      <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
      <s-table-column label="组织机构" prop="departName"></s-table-column>
      <s-table-column label="角色" prop="roleName"></s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {batchUuid} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        roleTableData: [],
        levelVisibleForm: {
          setting: 0
        },
        visibleTableData: [],
        uuids: [],
        multipleSelection: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.uuids = batchUuid('uuid', this.multipleSelection)
      },
      SearchCondition() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['userLoginName', 'userRealName', 'roleName', 'departName'] // can be string or Array
        }
      },
      getRoleMultiActions() {
        return [
          {name: '角色名称'},
          {name: '备注'}
        ]
      },
      getData () {
        $axios.get('/sysDicPrivilege/getSysDicPrivilege').then((res) => {
          this.visibleTableData = res.data
        })
      }
    }
  }
</script>
