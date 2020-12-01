<template>
  <div>
    <s-table-page
      :data="viewData"

      style="width:90%;margin:20px auto"

      :header-search="getSearchDef()"
    >
      <s-table-column prop="citypeName" label="资产类别"></s-table-column>
      <s-table-column prop="controlAdderss" label="IP地址"></s-table-column>
      <s-table-column prop="descr" label="距离过期时间"></s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/ecmascript-6">

  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        viewData: []
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        $axios.post('/resourcemanager/assetmanager/itasset/getDeadLineItcomp').then((res) => {
          this.viewData = res.data
          // console.log(this.viewData)
        })
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['citypeName', 'controlAdderss', 'descr']
        }
      }
    }
  }
</script>

