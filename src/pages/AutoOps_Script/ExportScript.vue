<template>
    <div>
      <h3 style="font-weight: 600;margin: 12px 0;">选择脚本库</h3>
      <input-tree :data="leftMenu" :props="categoryConfig" @select-change="changeData1" :hasDelIcon="false"></input-tree>
      <h3 style="font-weight: 600;margin: 12px 0;">选择脚本</h3>
      <s-table-page
        :data="tableData"
        :header-search="getHeaderSearch()"
        :show-header-checkbox="true"
        @selection-change="handleSelectionChange">
        <s-table-column type="selection"></s-table-column>
        <s-table-column label="脚本名称" prop="scriptName"></s-table-column>
        <s-table-column
          label="脚本类型"
          prop="scriptFileSuffix"
          :filters="[{text: '.sh', value: '.sh'},{text: '.ps1', value: '.ps1'}, {text: '.py', value: '.py'}, {text: '.sql', value: '.sql'}]"
          :filter-method="filterTag"
        ></s-table-column>
        <s-table-column label="提交人" prop="createUserName"></s-table-column>
        <s-table-column label="提交时间" prop="createTime"></s-table-column>
      </s-table-page>
    </div>
</template>

<script>
  import InputTree from '@/components/inputTree/InputTree'
  import $axios from 'sunflower-ajax'
    export default {
      data() {
        return {
          scriptName: '',
          tableData: [],
          selections: [],
          leftMenu: [],
          uuid: '', // 选中脚本库的最后一级uuid
          categoryConfig: {
            label: 'name',
            value: 'uuid',
            children: 'childrenList'
          }
        }
      },
      components: {
        InputTree
      },
      mounted() {
        $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
          if (res.data) {
            this.leftMenu = res.data
          } else {
            return false
          }
        })
      },
      methods: {
        changeData1(node) {
          this.uuid = node.uuid;
          this.getData(this.uuid)
        },
        handleSelectionChange(val) {
          this.selections = val
          this.$emit('export', val)
        },
        getData(uuid) {
          $axios.get(`/scriptConsole/getScriptByLibUuid/${uuid}`).then((res) => {
            if (res.data instanceof Array) {
              this.tableData = res.data
            }
          })
        },
        getHeaderSearch() {
          return {
            width: 10,
            placeholder: '请输入脚本名称，提交人',
            searchProps: ['scriptName', 'createUserName']
          }
        },
        filterTag(value, row) {
          return row.scriptFileSuffix === value;
        }
      }
    }
</script>

<style scoped>

</style>
