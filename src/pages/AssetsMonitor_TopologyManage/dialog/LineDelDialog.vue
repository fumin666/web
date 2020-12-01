<template>
  <s-dialog v-model="dialogFlag" title="提示" width="380px" class="lineDelDialog">
    <s-radio-group v-model="delFlag">
      <s-radio label="1">删除所有拓扑连线</s-radio>
      <s-radio label="2">删除当前拓扑连线</s-radio>
    </s-radio-group>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import { deleteLineList } from '../api/topology_api'

  export default {
    data() {
      return {
        dialogFlag: false,
        delFlag: '1'
      }
    },
    props: {
      delEdgeIdArr: {
        type: Array
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      dealTab(flag) {
        if (flag === 'line') {
          window.TopologyGraph.getGraphVm().initLinkTabData();
        }
      },
      dialogOk() {
        let graph = window.TopologyGraph.getGraph();
        let delCells = graph.getSelectionCells();
        deleteLineList(this.delFlag, this.delEdgeIdArr).then(data => {
          if (data) {
            this.dealTab('line');
            this.$message({showClose: true, message: '删除连线成功!', type: 'success'});
            graph.removeCells(delCells);
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '删除连线失败!', type: 'error'});
          }
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

