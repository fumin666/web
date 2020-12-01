/**
* Created by dgunzi on 2019/07/19.
*/
<template>
  <component :is="currentView" :ref="currentView"></component>
</template>

<script>
  import AssetList from './AssetList'
  import AssetListOnePorject from './AssetListOnePorject'

  export default {
        name: 'AssetListBase',
        data() {
            return {
              currentView: ''
            }
        },
        created() {
          this.currentView = 'asset-list';
          let userData = this.$store.getters.userData;
          // 单注册OMA
          if (userData && userData.registerModelList.length === 1 && userData.registerModelList[0] === 'OMA') {
            this.currentView = 'asset-list-one-porject';
          }
        },
        components: {
          AssetList,
          AssetListOnePorject
        }
    }
</script>

<style scoped>

</style>
