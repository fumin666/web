<template>
  <div class="treeManage">
    <div v-if="status === 0" class="tree-top-panel">
      <s-input placeholder="输入关键字进行过滤" v-model="filterText"></s-input>
    </div>
    <div v-if="status === 1 || status === 4" class="tree-top-panel">
      拓扑图名称 <s-input placeholder="请输入拓扑名称" v-model="nodeName" style="width: 320px;margin-left: 10px;"></s-input>
      <s-button title="确定" @click="okAction">确定</s-button>
      <s-button type="cancel" @click="cancelAction" title="取消">取消</s-button>
    </div>
    <div v-if="status === 2 || status === 3" class="tree-top-panel">
      分类名称 <s-input placeholder="请输入分类名称" v-model="nodeName" style="width: 320px;margin-left: 10px;"></s-input>
      <s-button title="确定" @click="okAction">确定</s-button>
      <s-button type="cancel" @click="cancelAction" title="取消">取消</s-button>
    </div>
    <s-scrollbar wrap-class="tree-manage-height" key="step2scrollbar">
      <s-tree
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :current-node-key="currentNode"
        :highlight-current="true"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :filter-node-method="filterNode"
        ref="tree2">
      </s-tree>
    </s-scrollbar>
  </div>
</template>
<script>
  // let id = 1000;
  import {
    getTopologyTree,
    saveTopo,
    saveTopoType,
    renameTopo,
    renameTopoType,
    delTopo,
    delTopoType
  } from './api/topology_api';

  export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data() {
      return {
        status: 0, // 0 过滤 1 添加子拓扑 2 添加类别 3 修改类别名称 4 修改拓扑名称
        treeData: [],
        filterText: '',
        nodeName: '',
        currentNode: 1,
        defaultProps: {
          children: 'childrenList',
          label: 'name',
          type: 'type',
          id: 'uuid'
        },
        curNodeData: {}
      }
    },
    created() {
      this.initTree();
    },
    methods: {
      initTree() {
        getTopologyTree().then(({data}) => {
          this.treeData = data;
        })
      },
      okAction() {
        if (!this.nodeName) {
          this.$message({showClose: true, message: '请输入名称!', type: 'success'});
          return;
        }
        let cb1 = ({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '新增成功!', type: 'success'});
            this.initTree();
            this.status = 0;
          } else {
            this.$message({showClose: true, message: '新增失败!', type: 'error'});
          }
        };
        let cb2 = ({data}) => {
          if (data === true) {
            this.curNodeData.name = this.nodeName;
            this.initTree();
            this.status = 0;
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        };
        let param = {
          name: this.nodeName
        };
        switch (this.status) {
          case 1: // 新增子拓扑
            param.parentUuid = this.curNodeData.uuid;
            saveTopo(param).then(cb1);
            break;
          case 2: // 新增类别
            param.parentUuid = this.curNodeData.uuid;
            saveTopoType(param).then(cb1);
            break;
          case 3: // 类别改名
            param.uuid = this.curNodeData.uuid;
            renameTopoType(param).then(cb2);
            break;
          case 4: // 子拓扑改名
            param.uuid = this.curNodeData.uuid;
            renameTopo(param).then(cb2);
            break;
        }
      },
      cancelAction() {
        this.status = 0;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      append(store, data) { // 添加拓扑
        this.curNodeData = data;
        this.nodeName = '';
        this.status = 1;
      },
      appendCategory(store, data) { // 添加分类
        this.curNodeData = data;
        this.nodeName = '';
        this.status = 2;
      },
      modify(store, data) {
        this.curNodeData = data;
        this.nodeName = data.name;
        if (data.node.type === 2) { // 2为子拓扑，1为类别
          this.status = 4;
        } else {
          this.status = 3;
        }
      },
      remove(node, nodeData) {
        if (nodeData.childrenList.length > 0) {
          this.$message({type: 'warning', message: '当前分类下有子分类或子拓扑，不可删除！'});
          return;
        }
        this.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let cb = ({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '删除成功!', type: 'success'});
              this.initTree();
              if (nodeData.type !== 0 && this.$route.params.id === nodeData.uuid) { // 若删除了当前拓扑节点
                this.$emit('change-route');
              }
            } else {
              this.$message({showClose: true, message: '删除失败!', type: 'error'});
            }
          };
          if (nodeData.type === 0) {
            delTopoType(nodeData.uuid).then(cb);
          } else {
            delTopo(nodeData.uuid).then(cb);
          }
        }).catch(() => {});
      },
      renderContent(h, { node, data, store }) {
        let classNameStr = 'icon iconfont icon-picture';
        var __appendBtn = h();
        var __appendCategory = h();
        if (data.node.type === 2) { // 2为子拓扑，1为类别
          classNameStr = 'icon iconfont icon-picture';
        } else {
          __appendBtn = h('s-button', {
            props: {
              type: 'transparent',
              title: '添加子拓扑',
              size: 'mini'
            },
            domProps: {
              innerHTML: '<i class="iconfont icon-add"></i>\n<span>子拓扑</span>'
            },
            on: {
              click: () => {
                this.append(store, data)
              }
            }
          });
          __appendCategory = h('s-button', {
            props: {
              type: 'transparent',
              title: '添加分类',
              size: 'mini'
            },
            domProps: {
              innerHTML: '<i class="iconfont icon-batch-add"></i>\n<span>分类</span>'
            },
            on: {
              click: () => {
                this.appendCategory(store, data)
              }
            }
          });
        }
        var __icon = h('i', {
          domProps: {
            className: classNameStr
          }
        });
        let __otherObt = (
          <span style="float: right; margin-right: 15px">
            {__appendCategory}
            {__appendBtn}
            <s-button type="transparent" icon="pencil" title="修改" size="mini" on-click={ () => this.modify(store, data) }>修改</s-button>
            <s-button type="transparent" icon="delete" title="删除" size="mini" on-click={ () => this.remove(store, data) }>删除</s-button>
          </span>
        );
        if (data.uuid === 'topoviewtypedefaultuuid0000000000000' || data.uuid === 'topoviewinfodefaultuuid000000000') {
          __otherObt = (
            <span style="float: right; margin-right: 15px">
              {__appendCategory}
              {__appendBtn}
              <s-button type="transparent" icon="pencil" title="修改" size="mini" on-click={ () => this.modify(store, data) }>修改</s-button>
            </span>
          );
        }
        return (
          <span class="treeBtn">
            <span>{__icon} {node.label} </span>
            {__otherObt}
          </span>
        );
      }
    }
  };
</script>
<style lang="stylus">
  .treeManage
    .tree-manage-height
      max-height: 450px
    .tree-top-panel
      margin-bottom: 5px
    .treeBtn
      white-space: normal
</style>
