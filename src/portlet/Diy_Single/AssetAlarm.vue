/**
* Created by zhengx
*/
<template>
  <div class="diy-single-asset-alarm">
    <s-card-diy
      title="产生告警最多的资产统计Top10(最近24小时)"
      :show-scrollbar="true"
      :show-more="false">
      <s-table :data="list">
        <s-table-column
          prop="assetName"
          label="资产名称" />
        <s-table-column
          prop="assetIp"
          label="IP地址" />
        <s-table-column
          prop="assetCitypeName"
          label="资产类型" />
        <s-table-column
          prop="count"
          label="总数" />
      </s-table>
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

    methods: {
      getList() {
        $axios.get('/dataAlarmLog/getEventAlarmAssetCountTop10/2').then(res => {
          this.list = res.data;
        });
      }
    }
  }
</script>

<style>
  .diy-single-asset-alarm {
    width: 100%;
    height: 100%;
  }
</style>
