/**
* Created by liushupeng on 2019/1/24.
*/
<template>
  <div class="diy-dba-most-alarm">
    <s-card-diy
      title="产生告警最多的数据库统计Top10(最近24小时)"
      :show-more="false"
      :show-scrollbar="true">
      <s-table :data="list">
        <s-table-column
          prop="assetName"
          label="资产名称"></s-table-column>
        <s-table-column
          prop="assetIp"
          label="IP地址"></s-table-column>
        <s-table-column
          prop="assetCitypeName"
          label="资产类型" ></s-table-column>
        <s-table-column
          prop="count"
          label="总数" ></s-table-column>
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
      this.getData();
    },
    methods: {
      getData() {
        $axios.get('/dataAlarmLog/getEventAlarmAssetCountTop10/1').then(res => {
          this.list = res.data;
        })
      }
    }
  }
</script>

<style>
  .diy-dba-most-alarm{
    width: 100%;
    height: 100%;
  }
</style>
