<template>
  <section class="cmd-list">
    <s-row :gutter="15">
      <s-col :span="4" style="position: relative;">
        <i class="iconfont icon-plus cmd-iconfont" title="添加命令" @click="createCmd" style="position: absolute;right:20px;top:10px;z-index:10;cursor: pointer;"></i>
        <s-tab>
          <s-tab-pane label="命令模板">
            <s-scrollbar wrap-style="maxHeight:calc(100vh - 225px);" key="it" ref="treeScrollbar">
              <div ref="menuTree">
                <s-tree id="itAssetsTree" ref="itAssetsTree"
                  :data="cmdTreeData" :props="defaultProps"
                  @node-click="handleNodeClick"
                  :highlight-current="true"
                  :default-expand-all="defaultexpandall"
                  node-key="uuid"
                  :current-node-key="currentLeftTreeUuid"
                  :render-content="renderContent"
                  :expand-on-click-node="false">
                </s-tree>
              </div>
            </s-scrollbar>
          </s-tab-pane>
        </s-tab>
      </s-col>
      <s-col :span="20">
        <s-scrollbar wrap-style="maxHeight:calc(100vh - 190px);">
          <div class="listChunk" style="min-height:550px;padding-right:10px;">
            <div class="btn-box" style="margin-bottom: 10px;">
              <s-button icon="plus" @click="bloomAdd=true">添加</s-button>
              <s-button icon="batch-del" @click="deleteList">批量删除</s-button>
              <s-button icon="export" @click="cmdExport">命令导出</s-button>
              <s-button icon="import" @click="cmdImport">命令导入</s-button>
              <s-input placeholder="请输入搜索内容" v-model="searchKey" class="real-search-input" icon="magnifier" @input="getList"></s-input>
            </div>
            <RealPageTable :ajax-obj="ajaxObj"
               ref="cmdTable"
               :showHeaderCheckbox="false"
               @selection-change="handleCmdSelectionChange">
              <s-table-column
                type="selection"
                width="45">
              </s-table-column>
              <s-table-column
                width="110"
                label="匹配类型"
                prop="type">
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 0">精确匹配</span>
                  <span v-else-if="scope.row.type === 1">模糊匹配</span>
                  <span v-else-if="scope.row.type === 2">任意匹配</span>
                </template>
              </s-table-column>
              <s-table-column
                label="命令"
                prop="commandName"
                show-overflow-tooltip>
              </s-table-column>
              <s-table-column
                label="参数"
                prop="commandPara"
                show-overflow-tooltip>
              </s-table-column>
              <s-table-column
                width="110"
                label="事件级别"
                prop="commandRisk">
                <template slot-scope="scope">
                  <span v-if="scope.row.commandRisk === 0">未知</span>
                  <span v-else-if="scope.row.commandRisk === 1">正常</span>
                  <span v-else-if="scope.row.commandRisk === 2">提示</span>
                  <span v-else-if="scope.row.commandRisk === 3">警告</span>
                  <span v-else-if="scope.row.commandRisk === 4">次要</span>
                  <span v-else-if="scope.row.commandRisk === 5">主要</span>
                  <span v-else-if="scope.row.commandRisk === 6">严重</span>
                </template>
              </s-table-column>
              <s-table-column
                width="110"
                label="风险级别"
                prop="commandRiskNew">
                <template slot-scope="scope">
                  <span v-if="scope.row.commandRiskNew === 0">低</span>
                  <span v-else-if="scope.row.commandRiskNew === 1">较低</span>
                  <span v-else-if="scope.row.commandRiskNew === 2">中</span>
                  <span v-else-if="scope.row.commandRiskNew === 3">较高</span>
                  <span v-else-if="scope.row.commandRiskNew === 4">高</span>
                </template>
              </s-table-column>
              <s-table-column
                label="备注"
                prop="remark"
                show-overflow-tooltip>
              </s-table-column>
              <s-table-column
                label="命令模板"
                prop="templateName"
                show-overflow-tooltip>
              </s-table-column>
              <s-table-column
                width="100"
                label="操作">
                <template slot-scope="scope">
                  <i class="iconfont icon-edit" title="修改" @click="currentCmd=scope.row,bloomEdit=true"></i>
                  <i class="iconfont icon-delete" title="删除" @click="deleteCmd(scope.row)"></i>
                </template>
              </s-table-column>
            </RealPageTable>
          </div>
        </s-scrollbar>
      </s-col>
    </s-row>
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加"
      key="bloomAdd">
      <cmd-add ref="cmdAdd"></cmd-add>
      <template slot="footer">
        <s-button @click="addAgain">继续添加</s-button>
        <s-button @click="save">保存</s-button>
        <s-button @click="cancelAdd" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomEdit"
      v-if="bloomEdit"
      title="修改命令"
      key="bloomEdit">
      <cmd-add ref="cmdEdit" :current-cmd="currentCmd"></cmd-add>
      <template slot="footer">
        <s-button @click="edit">保存</s-button>
        <s-button @click="cancelEdit" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--添加命令模板-->
    <s-dialog
      v-model="createCmdFlag"
      v-if="createCmdFlag"
      title="添加"
      key="createCmdFlag">
      <create-cmd ref="createCmd"></create-cmd>
      <template slot="footer">
        <s-button @click="createCmdSave">保存</s-button>
        <s-button @click="createCmdFlag=false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑命令模板-->
    <s-dialog
      v-model="editCmdFlag"
      v-if="editCmdFlag"
      title="编辑"
      key="editCmdFlag">
      <create-cmd ref="editCmd" :cmdData="cmdData"></create-cmd>
      <template slot="footer">
        <s-button @click="editCmdSave">保存</s-button>
        <s-button @click="editCmdFlag=false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--导入-->
    <import-dialog v-model="bloomImport" v-if="bloomImport" :uploadObj="uploadObj" :downObj="downObj" @reload="getList"></import-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { Download, batchUuid } from 'sunflower-common-utils'
  import CmdAdd from './Add'
  import CreateCmd from './CreateCmd'
  import ImportDialog from '@/components/importDialog/ImportDialog'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    components: {
      CmdAdd,
      CreateCmd,
      ImportDialog,
      RealPageTable
    },
    data() {
      return {
        defaultexpandall: true,
        cmdTreeData: [],
        currentLeftTreeUuid: '',
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        createCmdFlag: false,
        editCmdFlag: false,
        cmdData: {},
        bloomAdd: false,
        bloomEdit: false,
        bloomImport: false,
        currentCmd: {},
        selectedCmd: [],
        uploadObj: {
          url: '/commandInfo/importCommand',
          type: 'get'
        },
        downObj: {
          url: '/commandInfo/importCommandTemplate',
          text: '命令批量导入模版'
        },
        searchKey: '',
        ajaxObj: {
          type: 'post',
          url: '/commandInfo/getCommandByTemplateCriteria',
          params: {
            currentPage: 1,
            pageSize: 10,
            condition: {
              templateUuid: '',
              searchKey: ''
            }
          }
        }
      }
    },
    methods: {
      getCmdTreeData(callback = () => {
      }) {
        $axios.get('/commandTemplate/getCommandTemplateTree').then(res => {
          if (res.data) {
            this.cmdTreeData = res.data[0].childrenList
            if (this.currentLeftTreeUuid === '') {
              this.$nextTick(function() {
                this.currentLeftTreeUuid = this.cmdTreeData[0].uuid
                this.$refs.itAssetsTree.setCurrentKey(this.cmdTreeData[0].uuid)
              })
            } else {
              this.$nextTick(function() {
                this.$refs.itAssetsTree.setCurrentKey(this.currentLeftTreeUuid)
              })
            }
            callback()
          }
        })
      },
      handleNodeClick(nodeData) {
        this.currentLeftTreeUuid = nodeData.uuid; // 保证tree刷新后高亮
        this.getList()
      },
      getallUuidArr(nodeData) {
        let uuidArr = [];
        function loop(data) {
          uuidArr.push(data.uuid);
          var arr = data.childrenList;
          if (arr && arr.length) {
            arr.forEach(item => { loop(item) })
          }
        }
        loop(nodeData);
        return uuidArr;
      },
      renderContent(h, {node}) {
        let img = '';
        if (node.level !== 1) {
          img = '../../../static/images/asseticon/mingling.png'
        } else {
          img = '../../../static/images/asseticon/files.png'
        }
        var __appendCategory = h();
        var __appendCategory1 = h();
        if (node.data.node.isDefault !== 1) {
          __appendCategory = h('span', {
            domProps: {
              innerHTML: '<i class="iconfont icon-edit" title="编辑"></i>'
            },
            on: {
              click: () => {
                this.editCmd(node.data.node)
              }
            }
          });
          __appendCategory1 = h('span', {
            domProps: {
              innerHTML: '<i class="iconfont icon-delete" title="删除"></i>'
            },
            on: {
              click: () => {
                this.deleteCmdTemplate(node.data.node)
              }
            }
          });
        }
        return (
          <span class="custom-tree-node">
            <span style = "vertical-align: middle;">
              <img style="margin-right: 4px;width: 14px;height:14px;" src={img}></img>
            </span>
            <span style="font-size:14px" class="treeNodeLabel" title={node.label}> {node.label}</span>
            <span class="treeNodeToolBar">
              {__appendCategory}
              {__appendCategory1}
            </span>
        </span>)
      },
      // 添加命令模板
      createCmd() {
        this.createCmdFlag = true
      },
      createCmdSave() {
        this.$refs.createCmd.$refs.addForm.validate(valid => {
          if (valid) {
            let params = {
              uuid: '',
              templateName: this.$refs.createCmd.cmdAddFormData.templateName,
              parentUuid: this.cmdTreeData[1].uuid
            }
            $axios.post('/commandTemplate/saveOrUpdateCommandTemplate', params).then(res => {
              if (res.data.state) {
                this.getCmdTreeData()
                this.createCmdFlag = false
              } else {
                this.$message.error('添加失败！')
              }
            })
          } else {
            this.$message.info('请完成表单填写！')
          }
        })
      },
      // 编辑命令模板
      editCmd(node) {
        this.cmdData = node
        this.editCmdFlag = true
      },
      editCmdSave() {
        this.$refs.editCmd.$refs.addForm.validate(valid => {
          if (valid) {
            let params = {
              uuid: this.cmdData.uuid,
              templateName: this.$refs.editCmd.cmdAddFormData.templateName,
              parentUuid: this.cmdTreeData[1].uuid
            }
            $axios.post('/commandTemplate/saveOrUpdateCommandTemplate', params).then(res => {
              if (res.data.state) {
                this.getCmdTreeData()
                this.editCmdFlag = false
              } else {
                this.$message.error('编辑失败！')
              }
            })
          } else {
            this.$message.info('请完成表单填写！')
          }
        })
      },
      // 删除命令模板
      deleteCmdTemplate(node) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.get(`/commandTemplate/deleteCommandTemplate/${node.uuid}`).then(res => {
            if (res.data) {
              this.getCmdTreeData()
              this.$message.success('删除成功！')
            } else {
              this.$message.error('删除失败！')
            }
          })
        }).catch(() => {});
      },
      getList() {
        let params = {
          templateUuid: this.currentLeftTreeUuid ? this.currentLeftTreeUuid : this.cmdTreeData[0].uuid,
          searchKey: this.searchKey
        }
        this.ajaxObj.params.condition = params;
      },
      handleCmdSelectionChange(val) {
        this.selectedCmd = val;
      },
      save() {
        this.emitData(() => {
          this.bloomAdd = false;
        });
      },
      addAgain() {
        this.emitData(() => {
          for (let i in this.$refs['cmdAdd'].cmdAddFormData) {
            if (i !== 'templateUuid') { // 命令模板为上次选择的，其他都恢复初始值
              this.$refs['cmdAdd'].cmdAddFormData[i] = null;
            }
          }
          this.$refs['cmdAdd'].cmdAddFormData.type = 0
          this.$refs['cmdAdd'].isRequired = true
          this.$refs['cmdAdd'].isShowPara = true
          this.$refs['cmdAdd'].cmdAddFormData.commandRisk = 0
          this.$refs['cmdAdd'].cmdAddFormData.commandRiskNew = 0
        });
      },
      emitData(callback) {
        let vm = this;
        this.$refs['cmdTable'].searchKey = '';
        let refAdd = vm.$refs['cmdAdd'];
        if (refAdd.cmdAddFormData.type === 0) {
          if (refAdd.cmdAddFormData.commandPara === '' || refAdd.cmdAddFormData.commandPara === null) {
            refAdd.isShowError = true;
            refAdd.showErrorMsg = '请输入参数';
            return false;
          } else if (refAdd.cmdAddFormData.commandPara.indexOf(' ') !== -1) {
            refAdd.isShowError = true;
            refAdd.showErrorMsg = '参数不能包含空格';
            return false;
          } else if (refAdd.cmdAddFormData.commandPara.length && refAdd.cmdAddFormData.commandPara.length > 36) {
            refAdd.isShowError = true;
            refAdd.showErrorMsg = '参数长度不能超过36';
            return false;
          } else {
            refAdd.isShowError = false;
          }
        } else {
          refAdd.isShowError = false;
        }
        vm.$refs['cmdAdd'].$refs['addForm'].validate((valid) => {
          if (valid) {
            let _data = vm.$refs['cmdAdd'].cmdAddFormData;
            $axios.post('/commandInfo/saveCommandInfo', _data, {
              data: [{name: _data.commandName}],
              logTemplate: '添加|命令集管理(#name#)'
            }).then((res) => {
              if (res.data === true) {
                vm.$message({
                  type: 'success',
                  message: '添加命令成功'
                });
                vm.getList();
              } else if (res.data === false) {
                vm.$message({type: 'error', message: '该命令参数已存在，请勿重复添加'});
              }
              callback();
            });
          } else {
            return false;
          }
        });
      },
      edit() {
        let vm = this;
        let refEdit = vm.$refs['cmdEdit'];
        if (refEdit.cmdAddFormData.type === 0) {
          if (refEdit.cmdAddFormData.commandPara === '' || refEdit.cmdAddFormData.commandPara.length === null) {
            refEdit.isShowError = true;
            refEdit.showErrorMsg = '请输入参数';
            return false;
          } else if (refEdit.cmdAddFormData.commandPara.indexOf(' ') !== -1) {
            refEdit.isShowError = true;
            refEdit.showErrorMsg = '参数不能包含空格';
            return false;
          } else if (refEdit.cmdAddFormData.commandPara.length && refEdit.cmdAddFormData.commandPara.length > 36) {
            refEdit.isShowError = true;
            refEdit.showErrorMsg = '参数长度不能超过36';
            return false;
          } else {
            refEdit.isShowError = false;
          }
        } else {
          refEdit.isShowError = false;
        }
        vm.$refs['cmdEdit'].$refs['addForm'].validate((valid) => {
          if (valid) {
            let _data = vm.$refs['cmdEdit'].cmdAddFormData;
            $axios.post('/commandInfo/uptCommandInfo', _data, {
              data: [{name: _data.commandName}],
              logTemplate: '编辑|命令集管理(#name#)'
            }).then((res) => {
              if (res.data === true) {
                vm.$message({
                  type: 'success',
                  message: '修改命令成功'
                });
                vm.getList();
                vm.bloomEdit = false;
              } else if (res.data === false) {
                vm.$message({type: 'error', message: '该命令参数已存在，请勿重复添加'});
              }
            });
          } else {
            return false;
          }
        });
      },
      deleteCmd(row) {
        let vm = this;
        vm.$confirm('此操作将永久删除该命令，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/commandInfo/delCommandInfoByUuid/${row.uuid}`, '', {
            data: [{name: row.commandName}],
            logTemplate: '删除|命令集管理(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              vm.$message({
                type: 'success',
                message: '删除命令成功'
              });
              vm.getList();
            }
          });
        }).catch(() => {});
      },
      deleteList() {
        let vm = this;
        let _data = batchUuid('uuid', vm.selectedCmd);
        if (_data.length < 1) {
          vm.$message({
            type: 'error',
            message: '请选择需要批量删除的命令'
          });
          return;
        }
        vm.$confirm('此操作将永久删除该命令，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/commandInfo/batchDelCommandInfos', _data, {
            data: vm.selectedCmd,
            logTemplate: '删除|命令集管理(#commandName#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              vm.$message({
                type: 'success',
                message: '批量删除成功'
              });
              vm.getList();
            }
          });
        }).catch(() => {});
      },
      cancelAdd() {
        this.bloomAdd = false;
      },
      cancelEdit() {
        this.bloomEdit = false;
      },
      cmdImport() {
        this.bloomImport = true;
      },
      cmdExport() {
        if (this.selectedCmd.length > 0) {
          this.$confirm('确定导出命令？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let _data = batchUuid('uuid', this.selectedCmd).toString();
            Download(`/commandInfo/exportCommand/${_data}`, {
              data: [],
              logTemplate: '导出|命令集管理(CommandInfo.xls)'
            });
          }).catch(() => {});
        } else {
          this.$message({type: 'warning', message: '请选择要导出的命令'});
        }
      },
      upload() {}
    },
    mounted() {
      this.getCmdTreeData(() => {
        this.getList();
      })
    }
  }
</script>

<style>
  .cmd-list {
    margin: 20px 0 0 0;
  }
  .cmd-list .tool-bar .s-button + .s-button {
    margin-left: 10px;
  }
  .cmd-list .treeNodeToolBar {
    opacity: 0;
    color: #2296ff;
    position: absolute;
    right: 20px;
  }
  .s-tree-node-content:hover .treeNodeToolBar {
    opacity: 1;
  }
</style>
