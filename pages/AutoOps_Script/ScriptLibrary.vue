<template>
  <section class="content autoOps_script">
    <s-row :gutter="10">
      <s-col :span="4" style="border-right: 1px solid rgba(0, 0, 0, 0.15);padding-right: 12px;">
        <s-card class="box-card" id="box-card">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <div>
                <div style="display: inline-block"><i class="iconfont icon-console" style="margin-right: 6px;"></i>脚本库管理</div>
                <i class="iconfont icon-plus" @click="createScriptLib" style="float: right;"></i>
              </div>
            </span>
          </div>
          <s-scrollbar :wrap-style="[{'height':treeScrollHeight + 'px'}]" ref="treeScrollbar">
            <!--<div style="margin-top: 10px; cursor: pointer;">-->
              <!--<span class="s-tree-top"><i class="iconfont icon-config-commandnli"></i></span>-->
              <!--<span @click="goto('autoScriptTask')">任务管理</span>-->
            <!--</div>-->
            <!--<div style="margin-top: 10px; cursor: pointer;">-->
              <!--<span class="s-tree-top"><i class="iconfont icon-batch-export"></i></span>-->
              <!--<span @click="goto('uploadAistribute')">脚本上传与分发</span>-->
            <!--</div>-->
            <div ref="menuTree">
              <s-tree
                ref="tree"
                :data="leftMenu"
                :props="defaultProps"
                :default-expand-all="false"
                :expand-on-click-node="false"
                :default-expanded-keys="defaultExpandKeys"
                @node-click="handleNodeClick"
                :highlight-current="true"
                :current-node-key="curNodeUuid"
                node-key="uuid"
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span style="font-size:14px" class="treeNodeLabel" :title="node.label">{{ node.label }}</span>
                      <span class="treeNodeToolBar">
                        <span v-if="data.node.isDefault !== 1"><i class="iconfont icon-edit" title="编辑" :class="{disabledIcon: disabledIcon(data.node.createUser)}" @click.stop.prevent="editScript(node, data)"></i></span>
                        <span v-if="data.node.isDefault !== 1"><i class="iconfont icon-delete" title="删除" :class="{disabledIcon: disabledIcon(data.node.createUser)}" @click.stop.prevent="deleteScript(node, data)"></i></span>
                      </span>
                  </span>
              </s-tree>
            </div>
          </s-scrollbar>
        </s-card>
      </s-col>
      <s-col :span="20">
        <library :uuid="curNodeUuid" :leftMenu="leftMenu"></library>
      </s-col>
    </s-row>
    <s-dialog
      v-model="bloomCreateScriptLib"
      v-if="bloomCreateScriptLib"
      title="创建脚本库"
      key="bloomCreateScriptLib">
      <create-library ref="createscriptlibrary"></create-library>
      <template slot="footer">
        <s-button @click="createScriptLibOk">确定</s-button>
        <s-button @click="bloomCreateScriptLib = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomEditScriptLib"
      v-if="bloomEditScriptLib"
      title="编辑脚本库"
      key="bloomEditScriptLib">
      <create-library ref="editscriptlibrary" :current="current"></create-library>
      <template slot="footer">
        <s-button @click="bloomEditScriptLibOk">确定</s-button>
        <s-button @click="bloomEditScriptLib = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import createLibrary from './CreateLibrary.vue'
  // import editScript from './EditScript.vue'
  import library from './Library.vue'
  import Bus from '@/plugins/eventBus';
  export default {
    components: {
      createLibrary,
      // editScript,
      // Bus,
      library
    },
    data() {
      return {
        leftMenu: [
          {
            uuid: '',
            name: '',
            parent: null,
            node: {
              uuid: '',
              libName: '',
              description: '',
              isDelete: 0
            },
            childrenList: []
          }],
        treeScrollHeight: 500,
        defaultProps: {
          children: 'childrenList',
          label: 'name',
          uuid: 'uuid'
        },
        defaultExpandKeys: [],
        curNodeUuid: '',
        bloomCreateScriptLib: false,
        bloomEditScriptLib: false,
        current: '',  // 编辑脚本库
        options: [],
        currentUserUuid: this.$store.getters.userData.uuid
      }
    },
    methods: {
      goto(path) {
        this.$router.push('/AutoOpsCenter/script/' + path)
      },
      doLayout() {
        this.$nextTick(() => {
          let totalHeight = document.body.offsetHeight;
          let headHeight = document.querySelector('#headBar').offsetHeight;
          let footHeight = document.querySelector('.s-footer').offsetHeight;
          let bodyHeight = totalHeight - headHeight - footHeight;
          this.treeScrollHeight = bodyHeight - 20 - 35 - 15 - 20 + 17;
        })
      },
      disabledIcon(uuid) {
        if (uuid === this.currentUserUuid) {
          return false
        } else {
          return true
        }
      },
      // 根据node.parent判断是否是根元素
      handleNodeClick (node) {
        this.curNodeUuid = node.uuid;
      },
      // 创建脚本库弹窗
      createScriptLib() {
        this.bloomCreateScriptLib = true
      },
      IsUuid(data, uuid) {
        data = data.map(item => {
          return item.uuid
        })
        if (data.indexOf(uuid) !== -1) {
          return uuid
        } else {
          return null
        }
      },
      IscitypeName(data, uuid) {
        data = data.filter(item => {
          return item.uuid === uuid
        })
        return data[0].libName
      },
      // 创建脚本库
      createScriptLibOk() {
        this.$refs['createscriptlibrary'].$refs['libraryFormRef'].validate((valid) => {
          let _data = this.$refs['createscriptlibrary'].libraryForm;
          if (valid) {
            let options = this.$refs['createscriptlibrary'].options
            let data = Object.assign({},
              {firstLibUuid: this.IsUuid(options, _data.firstLibUuid)})
            let params = Object.assign({}, data,
              {parent: data.firstLibUuid === null ? null : _data.firstLibUuid},
              {description: _data.description},
              {firstLibName: data.firstLibUuid === null ? _data.firstLibUuid : this.IscitypeName(options, _data.firstLibUuid)},
              {secondLibName: _data.secondLibName}
            )
            let obj = {
              name: this.current.secondLibName ? params.firstLibName : this.current.secondLibName
            }
            $axios.post('/scriptConsole/saveScriptLib', params, {
              data: [obj],
              logTemplate: '添加|脚本库(#name#)'
            }).then((res) => {
              if (res.data.state) {
                this.$message({message: '创建成功', type: 'success'});
                this.bloomCreateScriptLib = false
                this.showScriptList(this.curNodeUuid)
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          } else {
            return false;
          }
        })
      },
      // 编辑脚本库
      bloomEditScriptLibOk() {
        this.$refs['editscriptlibrary'].$refs['libraryFormRef'].validate((valid) => {
          let _data = this.$refs['editscriptlibrary'].libraryForm;
          // let params = Object.assign({}, _data, {uuid: this.current.uuid})
          if (valid) {
            let options = this.$refs['editscriptlibrary'].options
            let data = Object.assign({},
              {firstLibUuid: this.IsUuid(options, _data.firstLibUuid)})
            let params = Object.assign({}, data,
              {parent: _data.parent},
              {uuid: _data.uuid},
              {description: _data.description},
              {firstLibName: data.firstLibUuid === null ? _data.firstLibUuid : this.IscitypeName(options, _data.firstLibUuid)},
              {secondLibName: _data.secondLibName}
            )
            let obj = {
              name: this.current.secondLibName ? params.firstLibName : this.current.secondLibName
            }
            $axios.post('/scriptConsole/updateScriptLib', params, {
              data: [obj],
              logTemplate: '编辑|脚本库(#name#)'
            }).then((res) => {
              if (res.data.state) {
                this.$message({message: '修改成功', type: 'success'});
                this.bloomEditScriptLib = false
                this.showScriptList(this.curNodeUuid)
              } else {
                this.$message({message: res.data.errormsg, type: 'error'});
              }
            })
          } else {
            return false;
          }
        })
      },
      // 编辑脚本库
      editScript(node, data) {
        // 创建者不是当前用户则不能操作
        if (data.node.createUser !== this.currentUserUuid) {
          return false
        }
        this.bloomEditScriptLib = true
        let {uuid, libName, firstLibName, secondLibName, description, parent} = data.node
        this.current = {uuid, libName, firstLibName, secondLibName, description, parent}
      },
      // 删除脚本库/脚本
      deleteScript(node, data) {
        // 创建者不是当前用户则不能操作
        if (data.node.createUser !== this.currentUserUuid) {
          return false
        }
        this.$confirm(data.node.parent === 'thetopuuid0000000000000000000000' ? '当前脚本库包含二级脚本库，是否继续删除?' : '确定删除该脚本库?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.get(`/scriptConsole/deleteScriptLib/${data.node.uuid}`, {
            data: [data],
            logTemplate: '删除|脚本库(#name#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: '删除脚本库成功', type: 'success'});
              this.showScriptList(this.curNodeUuid);
              // this.goto(`scriptControl`) // 删除脚本库后跳转到脚本执行页面
            } else {
              this.$message({showClose: true, message: '删除脚本库失败!', type: 'error'});
            }
          })
        }).catch(() => {});
      },
      // 获取leftMenu数据
      showScriptList(uuid) {
        return $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
          if (res.data) {
            this.leftMenu = res.data
            if (uuid === '') {
              this.$nextTick(function() {
                this.defaultExpandKeys = [this.leftMenu[0].uuid]
                this.curNodeUuid = this.leftMenu[0].uuid
                this.$refs.tree.setCurrentKey(this.leftMenu[0].uuid)
              })
            } else {
              this.$nextTick(function() {
                this.defaultExpandKeys = [uuid]
                this.curNodeUuid = uuid
                this.$refs.tree.setCurrentKey(uuid)
              })
            }
          } else {
            return false
          }
        })
      }
    },
    mounted() {
      this.doLayout();
      window.addEventListener('resize', this.doLayout);
    },
    destroyed() {
      window.removeEventListener('resize', this.doLayout);
    },
    created() {
      $axios.get('/scriptConsole/getAllFirstScriptLib').then(res => {
        this.options = res.data
      })
      this.showScriptList('').then(() => {
      })
      Bus.$on('updateLeftMenu', (uuid) => {
        this.showScriptList(uuid)
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .autoOps_script
    margin-top 0
    .treeNodeLabel
      display table-cell
      max-width 160px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .treeNodeToolBar
      position absolute
      right 20px
      opacity 0
    .s-tree-node-content
      &:hover
        .treeNodeToolBar
          opacity 1
  .autoOps_script #box-card .s-card-header {
    border: none;
  }
  @media screen and (max-width: 1400px)
    .autoOps_script
      .custom-tree-node
        .treeNodeLabel
          max-width: 100px;
</style>
