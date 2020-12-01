/*
create by YOU
*/
<template>
  <s-table-page
    :data="config"
    @selection-change="onSelectionChange"

    :header-search="getSearchDef()"
    >
    <s-table-column type="selection"></s-table-column>
    <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
    <s-table-column label="资产名称" prop="itcompName"></s-table-column>
    <s-table-column label="资产类型" prop="cmdbCitype.citypeName"></s-table-column>
  </s-table-page>
</template>

<script type="text/babel">

  export default {
    data () {
      return {
        data: []
      }
    },
    mounted () {
      this.data = []
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['controlAdderss', 'itcompName', 'cmdbCitype.citypeName']
        }
      },
      onSelectionChange (selection) {
        this.data = selection
      },
      getRowActionsDef () {
        return {}
      }
    },
    props: {
      config: {
        type: Array,
        default: function () {
          return []
        }
      }
    }
  };
</script>
