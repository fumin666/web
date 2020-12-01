<template>
  <div class="childTopo">
    <div class="tree-top-panel">
      <s-input placeholder="输入关键字进行过滤" v-model="filterText"></s-input>
    </div>
    <s-scrollbar wrap-class="tree-manage-height" key="step2scrollbar">
      <s-tree
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :current-node-key="currentNode"
        @node-click="nodeClick"
        :highlight-current="true"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        ref="tree">
      </s-tree>
    </s-scrollbar>
  </div>
</template>
<script>
  import TopologyAjax from './module/topology.ajax'
  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data() {
      return {
        status: 0, // 0 过滤 1 添加子拓扑 2 添加类别 3 修改
        filterText: '',
        nodeName: '',
        currentNode: 1,
        currentData: {},
        defaultProps: {
          children: 'childrenList',
          label: 'name',
          type: 'type',
          id: 'uuid'
        }
      }
    },
    props: {
      treeData: {
        type: Array,
        required: true
      }
    },
    methods: {
      nodeClick(nodeData, node) {
        this.currentData = nodeData;
      },
      judegHadSubTopo(graph) {
        let allSubTopology = this.getAllSubTopology(graph) || [];
        for (let i = 0; i < allSubTopology.length; i++) {
          if (allSubTopology[i].busnessName === this.currentData.name) {
            return true;
          }
        }
        return false;
      },
      getAllSubTopology(graph) {
        var parent = graph.getDefaultParent();
        var cellArr = [];

        /**
         * 迭代方法 根据父节点查找出所有子拓扑存于obj中
         * @inner
         * @param {mxCell} parent 待遍历父节点
         */
        function _getAllSubTopoCell(parentCell) {
          var cells = graph.getChildVertices(parentCell);
          if (cells && cells.length !== 0) {
            for (var i = 0; i < cells.length; i++) {
              if (cells[i].isSubTopoCell()) {
                cellArr.push(cells[i]);
              }
              var style = cells[i].getStyle();
              if (style.indexOf('group') !== -1) {
                _getAllSubTopoCell(cells[i]);
              }
            }
          }
        }
        _getAllSubTopoCell(parent);
        return cellArr;
      },
      submit(callback) {
        if (this.currentData.node.type === 2) {
          if (window.paramSubTopo === this.currentData.uuid) {
            this.$message({message: '不能选择当前拓扑图节点做为子拓扑！', type: 'warning'});
          } else {
            var graph = window.TopologyGraph.getGraph();
            var cells = window.TopologyGraph.getGraphVm().customCells;
            var flag = this.judegHadSubTopo(graph);
            if (!flag) {
              var cell = cells[0];
              graph.refresh(cell);
              var geo = {
                width: cell.geometry.width,
                height: cell.geometry.height,
                x: cell.geometry.x,
                y: cell.geometry.y
              };
              var param = {
                typeUuid: this.currentData.uuid,
                type: '3', // 子拓扑为3
                hostIp: this.currentData.name,
                busnessName: this.currentData.name,
                parent: window.TopologyGraph.getParent(cell), // 不在区域时为-1,在区域时为区域的id
                style: cell.style,
                geo: JSON.stringify(geo),
                topoviewInfoUuid: window.paramSubTopo
              };
              TopologyAjax.ajaxAddNode(param, null, (response) => {
                graph.removeCells(cells);// 删除默认拖拽的节点,使用下面的方法生成
                if (response.uuid) {
                  graph.getModel().beginUpdate();
                  window.TopologyGraph.addVertex(response, false);
                  graph.getModel().endUpdate();
                  if (typeof callback !== 'undefined') {
                    callback();
                  }
                } else {
                  this.$message.error('添加子拓扑失败!');
                }
              });
              return true;
            } else {
              this.$message({message: '该子拓扑操作前已存在于图中,请重新选择！', type: 'warning'});
              return false;
            }
          }
        } else {
          this.$message({message: '请选择子拓扑节点！', type: 'warning'});
          return false;
        }
      },
      renderContent(h, { node, data, store }) {
        let classNameStr = 'icon iconfont icon-picture';
        if (data.node.type === 1) {
          classNameStr = 'icon iconfont icon-folder';
        }
        var __icon = h('i', {
          domProps: {
            className: classNameStr
          }
        });
        return (
          <span>
           <span>{__icon} {node.label} </span>
          </span>
        );
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
  };
</script>
<style>
  .childTopo .tree-manage-height {
    max-height: 450px;
  }
  .childTopo .tree-top-panel{
    margin-bottom: 5px;
  }
</style>
