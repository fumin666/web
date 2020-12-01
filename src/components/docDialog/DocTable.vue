<template>
  <s-table-page
    ref="docListTable"
    :data="docList"
    :header-search="getSearchDef()"
    @selection-change="handleSelectionChange">
    <s-table-column
      type="selection"
      width="45">
    </s-table-column>
    <s-table-column
      label="文档名称"
      prop="docName">
    </s-table-column>
    <s-table-column
      label="创建者"
      prop="createrUser.userRealName">
    </s-table-column>
    <s-table-column
      label="创建时间"
      prop="createTime">
    </s-table-column>
    <s-table-column
      label="文档类型"
      prop="docType">
    </s-table-column>
  </s-table-page>

</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        docList: []
      }
    },
    components: {
    },
    props: {
      selectedData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    methods: {
      getSearchDef() {
        return {
          width: 12,
          offset: 12,
          placeholder: '请输入文档名称、文档类型查询',
          searchProps: ['docName', 'docType']
        }
      },
      handleSelectionChange(val) {
        this.$emit('upTransDocList', val)
      }
    },
    /* watch: {
     value: {
     immediate: true,
     handler(val) {
     // this.addDocDialog = val
     }
     },
     addDocDialog(val) {
     this.$emit('input', val);
     }
     }, */
    created() {
      $axios.get('/documentmanager/document/doclist').then(({data}) => {
        if (data && data instanceof Array) {
          this.docList = data
          if (this.selectedData.length > 0) {
            let targetList = []
            this.$nextTick(() => {
              this.selectedData.forEach((list) => {
                this.docList.forEach((item) => {
                  if (list.uuid === item.uuid) {
                    targetList.push(item)
                  }
                })
              })
              targetList.forEach((list) => {
                this.docList.forEach((item) => {
                  if (list.uuid === item.uuid) {
                    this.$refs.docListTable.toggleRowSelection(item)
                  }
                })
              })
            })
          }
        }
      })
    }
  }
</script>
