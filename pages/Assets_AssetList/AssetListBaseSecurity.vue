/**
* Created by songyf on 2019/12/31.
*/
<template>
  <section style="margin: 20px">
    <component :is="currentView" :ref="currentView"></component>
  </section>
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
