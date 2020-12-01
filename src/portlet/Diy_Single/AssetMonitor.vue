<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-06-10 09:05:18
 * @LastEditTime: 2019-09-20 11:03:20
 * @LastEditors: Please set LastEditors
 -->
/**
* Created by zhengx
*/
<template>
  <div class="diy-single-asset-monitor">
    <s-card-diy
      title="资产监控"
      :more-click="moreClick">
      <data-dashboard
        :data="statData"
        url="assetsMonitor_list" />
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import DataDashboard from '@/components/dataDashboard/DataDashboard';

  export default {
    components: {
      DataDashboard
    },

    data() {
      return {
        statData: []
      }
    },

    created() {
      this.getData();
    },

    methods: {
      getData() {
        $axios.get('/monitorcitype/getStatCountCitype').then((res) => {
          this.statData = res.data
        });
      },

      moreClick() {
        this.$router.push('/AssetsMonitor/assetsMonitor_topo');
      }
    }
  }
</script>

<style>
  .diy-single-asset-monitor {
    width: 100%;
    height: 100%;
  }
  .diy-single-asset-monitor .s-card-diy-body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
