/**
* Created by dgunzi on 2019/03/22.
* 资产管理列表 - 查看关系图
*/
<template>
  <div>
    <r-graph :comp-id="assetUuid"></r-graph>
  </div>

</template>

<script>
   import rGraph from '@/components/relationgraph/RGraph';
    export default {
        name: 'RelationalGraph',
        components: {
          rGraph
        },
        data() {
            return {
              assetUuid: this.$route.params.assetUuid
            }
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>
