<template>
  <section id="versionRecords">
    <s-table-page
      :data="versionRecords"
      :header-search="defSearch()"
      :row-actions="defRowActions()"
      actionColWidth="30px">
      <s-table-column label="版本号" prop="knowledgeVersion" width="80"></s-table-column>
      <s-table-column label="更新时间" prop="createTime"></s-table-column>
      <s-table-column label="更新人" prop="createUserName"></s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{

    data() {
      return {
        uuid: this.$route.params.uuid,
        versionRecords: []
      }
    },
    props: {
      isFreshTable: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isFreshTable(newVal) {
        if (newVal) {
          this.getVersionRecords();     // 获取版本记录列表
        }
      }
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['knowledgeVersion', 'createTime', 'createUserName']
        }
      },
      // 行内操作初始化
      defRowActions() {
        let _this = this;
        return [{
          name: '查看',
          icon: 'eye',
          click(row) {
            _this.$emit('viewRecords', row.itilKnowledgeOrder);
          }
        }]
      },
      // 获取版本记录列表
      getVersionRecords() {
        $axios.get(`/itilKnowledgeOrder/getKnowledgeVersionList/${this.uuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.versionRecords = data;
          }
        });
      }
    },
    created() {
      this.getVersionRecords();     // 获取版本记录列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
