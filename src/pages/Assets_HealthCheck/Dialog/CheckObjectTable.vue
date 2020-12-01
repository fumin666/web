<template>
  <section id="checkObjectTable">
    <s-table-page
      ref="allAssetsListTable"
      :data="allAssetsList"
      :header-search="defHeaderSearch()"
      :show-header-checkbox="true"
      height="360"
      >
      <s-table-column type="selection" width="45" align="center"></s-table-column>
      <s-table-column label="资产名称" prop="itcompName"></s-table-column>
      <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
      <s-table-column label="资产类型" prop="modelNumber"></s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data() {
      return {
        allAssetsList: []     // 所有设备资产列表
      }
    },

    methods: {
      // 初始化表头查询
      defHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入资产名称、类型、IP地址查询',
          searchProps: ['itcompName', 'controlAdderss', 'modelNumber']
        }
      },
      // 获取所有设备资产
      getAllAssets() {
        $axios.get('/monitorItcomp/list').then(({data}) => {
          if (data && data instanceof Array) {
            this.allAssetsList = data;          // 所有设备资产列表
          }
        })
      }
    },
    created() {
      this.getAllAssets();    // 获取所有设备资产列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
