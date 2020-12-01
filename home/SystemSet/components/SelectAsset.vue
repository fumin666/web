<template>
  <section class="selectInstitution">
      <s-table-page
        :data="asset"
        max-height='600'
        :header-search="getHeaderSearch()"
        :show-header-checkbox="true" ref="table">
        <s-table-column type="selection" width="45"/>
        <s-table-column label="资产名称" prop="itcompName"/>
        <s-table-column label="IP地址" prop="controlAdderss"/>
        <s-table-column label="资产类型" prop="citypeName"/>
      </s-table-page>
  </section>
</template>
<script>
  export default {
    props: ['asset'],
    data() {
      return {
      }
    },
    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName']
        }
      },
      getSelectedData() {
        return this.$refs['table'].getAllSelectedData();
      }
    }
  }
</script>

