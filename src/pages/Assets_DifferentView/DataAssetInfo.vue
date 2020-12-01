/**
* Created by liushupeng on 2019/2/27.
*/
<template>
  <div id="dataAssetInfo">
    <AssetDetailConstructor>
      <db-assets :dbUuid="dbUuid" v-if="show" style="padding:5px 10px;"></db-assets>
    </AssetDetailConstructor>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import DbAssets from '@/pages/Assets_AssetList/components/DbAssets.vue';
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        /* 基础信息参数 */
        assetUuid: this.$route.params.assetUuid,
        dbUuid: '',
        show: false
      }
    },
    components: {
      AssetDetailConstructor,
      DbAssets
    },
    created() {
      this.getDbAssetsData();
    },
    methods: {
      // 获取数据库资产数据
      getDbAssetsData() {
        $axios.get(`/resourcemanager/assetmanage/databaseasset/getDbaItcomp/${this.assetUuid}`).then(({data}) => {
          if (data && Object.keys(data).length > 0) {
            this.dbUuid = data.dbiUuid;
          }
          this.show = true;
        });
      }
    }
  }
</script>

<style>
</style>
