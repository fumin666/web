<template>
  <div class="diy-asset-asset-list">
    <s-card-diy
      title="资产列表"
      :more-click="moreClick"
      show-scrollbar>
      <div style="width: 100%; height: 100%; padding: 10px;">
        <s-table
          :data="list">
          <s-table-column
            label="资产名称"
            prop="itcompName"/>
          <s-table-column
            label="IP地址"
            prop="controlAdderss"/>
          <s-table-column
            label="资产分类"
            prop="totalTypeName"/>
          <s-table-column
            label="型号"
            prop="productCaption"/>
          <s-table-column
            width="130"
            label="配置管理员机构"
            prop="operationOrgName"/>
          <s-table-column
            label="配置管理员"
            prop="maintenanceStaffName"/>
          <s-table-column
            label="资产状态"
            prop="assetstatusName"/>
        </s-table>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        list: []
      }
    },

    created() {
      this.getList();
    },
    computed: {
    },
    methods: {
      moreClick() {
        this.$router.push('/AssetsAll/assets_list?name=服务器&all=1');
      },

      getList() {
        let form = {
          condition: {},
          currentPage: 1,
          orderByClause: 'id',
          pageSize: 10
        };
        $axios.post('/assetDynamicColnum/getAssetListData', form).then((res) => {
          this.list = res.data.criteria.pageList;
        });
      }
    }
  }
</script>

<style>
  .diy-asset-asset-list {
    width: 100%;
    height: 100%;
  }
</style>
