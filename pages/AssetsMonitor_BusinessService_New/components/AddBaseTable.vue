/**
* Created by alex on 2018/5/30.
*/
<template>
  <s-scrollbar wrap-style="height: 320px;">
    <s-table-page
      ref="table"
      :data="tableData"
      @selection-change="seletChange"

      :header-search="searchStyle"

      :header-actions="getListActionsDef">
      <s-table-column type="selection"></s-table-column>
      <s-table-column label="资产名称" prop="资产名称"></s-table-column>
      <s-table-column label="IP地址" prop="IP地址"></s-table-column>
      <s-table-column label="型号" prop="型号"></s-table-column>
      <s-table-column label="配置管理员机构" prop="配置管理员机构"></s-table-column>
      <s-table-column label="配置管理员" prop="配置管理员"></s-table-column>
      <s-table-column label="资产状态" prop="资产状态"></s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script type="text/babel">

  export default {
    props: {
      tableData: {
        type: Array
      },
      searchStyle: {
        type: Object,
        default: function () {
          return {width: 6, offset: 18, placeholder: '请输入搜索条件'}
        }
      },
      getListActionsDef: {
        type: Object,
        default: function () {
          return {}
        }
      },
      needSelect: {
        type: Array
      }
    },

    methods: {
      seletChange(selection) {
        this.$emit('dropSelect', selection)
      }
    },
    watch: {
      needSelect(val) {
        if (val.length > 0) {
          this.$nextTick(function () {
            this.tableData.map((item) => {
              if (val.indexOf(item.uuid) !== -1) {
                this.$refs['table'].toggleRowSelection(item, true)
              }
            })
          })
        }
      }
    }
  }
</script>
