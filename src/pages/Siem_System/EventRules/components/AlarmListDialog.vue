<template>
  <s-table :data="warnListData" @selection-change="warningListSelectionChange">
    <s-table-column :selectable="selectable" type="selection" width="45" align="center"></s-table-column>
    <s-table-column show-overflow-tooltip label="名称" prop="alertName"></s-table-column>
    <s-table-column show-overflow-tooltip label="通知方式" prop="alertTypeStr"></s-table-column>
    <s-table-column show-overflow-tooltip label="描述" prop="remark"></s-table-column>
  </s-table>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        selectionList: [],
        selectedUuids: []
      }
    },
    mounted() {
      this.selectedUuids = this.selectedList.map(function (item) {
        return item.uuid
      })
    },
    methods: {
      warningListSelectionChange(selection) {
        this.selectionList = selection
      },
      selectable(row, index) {
        if (this.selectedUuids.indexOf(row.uuid) === -1) {
          return true
        }
      }
    },
    props: {
      warnListData: {
        type: Array,
        default() {
          return []
        }
      },
      selectedList: {
        type: Array,
        default() {
          return []
        }
      }
    }
  };
</script>
