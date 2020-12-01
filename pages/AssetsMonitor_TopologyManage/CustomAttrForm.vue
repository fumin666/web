<template>
    <s-form ref="cForm" :rules="vrules" :model="vform" label-width="80px">
      <s-form-item label="IP地址" prop="hostIp">
        <s-input v-model="vform.hostIp"></s-input>
      </s-form-item>
      <s-form-item label="资产名称" prop="busnessName">
        <s-input v-model="vform.busnessName"></s-input>
      </s-form-item>
    </s-form>
</template>
<script>
import TopologyAjax from './module/topology.ajax'
import {Validaters} from 'sunflower-common-utils'
export default {
  data () {
    return {
      vrules: {
        hostIp: [
          Validaters.NotNull, Validaters.IP
        ],
        busnessName: [
          { required: true, message: '请输入资产名称', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    tempCells: {
      type: Array,
      required: true
    },
    graph: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    },
    vform: {
      type: Object,
      default: function () {
        return { hostIp: '', busnessName: '' }
      }
    }
  },
  methods: {
    submit (callback) {
      this.$refs.cForm.validate((valid) => {
        var geo = this.tempCells[0].parseGeo();
        if (valid) {
          var param = {
            type: '2',
            hostIp: this.vform.hostIp,
            busnessName: this.vform.busnessName,
            parent: window.TopologyGraph.getParent(this.tempCells[0]), // 不在区域时为-1,在区域时为区域的id
            style: this.tempCells[0].style,
            geo: JSON.stringify(geo),
            funcType: this.tempCells[0].funcType,
            topoviewInfoUuid: window.paramSubTopo
          };
          TopologyAjax.ajaxAddNode(param, null, (response) => {
            this.graph.removeCells(this.tempCells); // 删除默认拖拽的节点,使用下面的方法生成
            if (response.uuid) {
              this.insertCell(response);
            } else {
              this.$message.error('添加虚节点失败!');
            }
            if (typeof callback !== 'undefined') {
              callback();
            }
          });
        } else {
          return false;
        }
      });
    },
    updateCell (callback) {
      this.$refs.cForm.validate((valid) => {
        if (valid) {
          var hostIp = this.vform.hostIp;
          var busnessName = this.vform.busnessName;
          var nodeArr = [];
          var node = {
            uuid: this.tempCells[0].uuid,
            hostIp: hostIp,
            busnessName: busnessName,
            topoviewInfoUuid: window.paramSubTopo
          };
          nodeArr.push(node);
          var param = {
            topoviewNode: JSON.stringify(nodeArr)
          };
          TopologyAjax.ajaxSaveOrUpdateTopo(param, () => {
            this.tempCells[0].value = window.TopologyGraph.getIconLabel({'hostIp': hostIp, 'busnessName': busnessName});
            this.tempCells[0].hostIp = hostIp;
            this.tempCells[0].busnessName = busnessName;
            window.TopologyGraph.getGraph().refresh(this.tempCells[0]);
            if (typeof callback !== 'undefined') {
              callback();
            }
          });
        } else {
          return false;
        }
      });
    },
    insertCell (response) { // 删除默认拖拽的节点，重新创建pointCell与iconCell组合的节点
      this.graph.getModel().beginUpdate();
      window.TopologyGraph.addVertex(response, false);
      this.graph.getModel().endUpdate();
    },
    removeCell () {
      if (!this.edit) {
        this.graph.removeCells(this.tempCells);
      }
      window.TopologyGraph.getGraphVm().customCells = [];
      this.vform.hostIp = '';
      this.vform.busnessName = '';
    }
  }
}
</script>

