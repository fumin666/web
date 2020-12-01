/**
* Created by dgunzi on 2019/02/20.
* 监控视角
*/
<template>
  <div class="OperationViewContent">
    <div class="perspectives-row">
      <AssetDetailConstructor>
        <div class="right-content monitorDetail" style="padding:5px 10px;">
          <!--资产运行信息-->
          <host :comp="comp"></host>
        </div>
      </AssetDetailConstructor>
    </div>
  </div>
</template>

<script>
    import AssetDetailConstructor from './common_components/AssetDetailConstructor';
    import $axios from 'sunflower-ajax';
    import host from '@/pages/AssetsMonitor_List/components/TheHost'
    export default {
        name: 'AssetsMonitorView',
        data() {
            return {
              comp: {},
              assetUuid: this.$route.params.assetUuid
            }
        },
        created() {
            this.getComp()
        },
        components: {
          host,
          AssetDetailConstructor
        },
        methods: {
          getComp() {
            $axios.post(`/resourcemanager/assetmanager/itasset/getMonitorItcompDetailParams/${this.assetUuid}`).then(({data}) => {
              this.comp = data;
            });
          }
        }
    }
</script>

<style scoped>
</style>
