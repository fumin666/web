<template>
  <section>
    <s-scrollbar wrap-style="max-height: 450px;">
      <s-table-page
        style="width: 98%;"
        :data="detailList"

        :header-search="getSearchDef()"

        :hasActionCol = false
        key="detailList">
        <s-table-column label="账号名称" prop="assetAccountName" show-overflow-tooltip></s-table-column>
        <s-table-column label="账号角色" prop="assetAccountRole" show-overflow-tooltip></s-table-column>
        <s-table-column label="账号分类" prop="assetAccountClassify" show-overflow-tooltip></s-table-column>
        <s-table-column label="是否是AD域账号类型" show-overflow-tooltip>
          <template  slot-scope="scope">
            <div v-if="scope.row.assetAccountIsAd">是</div>
            <div v-else>否</div>
          </template>
        </s-table-column>
        <s-table-column label="未使用天数" prop="unUsedDay" show-overflow-tooltip></s-table-column>
        <s-table-column label="最近一天使用时间" prop="usedLastTime" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>

  import $axios from 'sunflower-ajax';
  export default {

    props: {
      repeatAssetAccountUuid: {
        type: Array
      }
    },
    data() {
      return {
        detailList: []
      }
    },
    created() {
      this.getDetailList();
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['assetAccountName', 'assetAccountRole', 'assetAccountClassify', 'assetAccountIsAd', 'unUsedDay', 'usedLastTime']
        }
      },
      getDetailList() {
        let params = {
            condition: {
              assetAccountUuids: this.repeatAssetAccountUuid
            }
        };
        $axios.post('/assetAccount/viewRepeatAssetAccount', params).then((res) => {
          this.detailList = res.data;
        });
      }
    }
  }
</script>
