<template>
  <s-table-page
    ref="multipleTable"
    :data="dataList"
    style="width:100%"
  >
    <s-table-column prop="importanceName" label="程度"></s-table-column>
    <s-table-column prop="importanceDesc" label="描述"></s-table-column>
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        dataList: []
      }
    },
    components: {},
    methods: {
    },
    mounted() {
      $axios.get('/resourcemanager/configurationmanage/importance/getAll').then(res => {
        this.dataList = res.data
      })
    }
  }
</script>
