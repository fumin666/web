<template>
  <s-dialog
    v-if="addDocDialog"
    v-model="addDocDialog"
    width="700px"
    title="添加文档"
    key="addDocDialog"
    @close="closeDocDialog"
    append-to-body>
    <doc-table :selectedData="selectedData" @upTransDocList="receiveDocList"></doc-table>
    <template slot="footer">
      <s-button @click="cfmDoc">确定</s-button>
      <s-button @click="cancelDoc">取消</s-button>
    </template>
  </s-dialog>
</template>

<script type="text/babel">
  import docTable from './DocTable.vue'

  export default{
    data() {
      return {
        multiSelection: []
      }
    },
    components: {
      docTable
    },
    props: {
      selectedData: {
        type: Array,
        default() {
          return []
        }
      }
    },
    computed: {
      addDocDialog() {
        return this.$store.state.docData.isShow
      }
    },
    methods: {
      receiveDocList(val) {
        this.multiSelection = val
      },
      cfmDoc() {
        this.$emit('getSelection', this.multiSelection)
        this.$store.commit('getDocList', this.multiSelection)
        this.$store.commit('openDocDialog', false)
      },
      closeDocDialog() {
        this.$store.commit('openDocDialog', false)
      },
      cancelDoc() {
        this.$store.commit('openDocDialog', false)
      }
    },
    created() {
    }
  }
</script>
