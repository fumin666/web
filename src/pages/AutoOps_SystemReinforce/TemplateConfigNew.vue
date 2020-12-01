/**
* Created by alex on 2018/8/21.
*/
<template>
  <section>
    <s-row>
      <s-col :span="24">
        <s-row>
          <s-col :span="18">
            <s-button icon="plus" @click="addTemp">批量引用检查项</s-button>
            <s-button icon="export" @click="exportTemp">导出</s-button>
            <s-button icon="finish" @click="changeState(1)">批量开启</s-button>
            <s-button icon="cancel" @click="changeState(0)">批量禁用</s-button>
          </s-col>
          <s-col :span="6">
            <div class="inputWrap" style="position: relative;">
              <s-input v-model="searchKey" @keyup.enter.native="getTreeItemTable" placeholder="请输入内容" class="real-search-input" style="margin-bottom: 10px;"></s-input>
              <span class="realPageSearch" style="padding-top: 5px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getTreeItemTable"></i></span>
            </div>
          </s-col>
        </s-row>
        <RealPageTable
          :ajax-obj="ajaxObj"
          @selection-change="handleSelectChange"
          @filter-change="filterType"
          :callback="handleData">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="name"
            label="脚本名称">
          </s-table-column>
          <s-table-column
            prop="itemTypeName"
            label="加固项类型"
            width="120"
            column-key="itemTypeName"
            :filters="filtersitemType">
          </s-table-column>
          <s-table-column
            prop="templateName"
            label="模版名称"
            width="150">
          </s-table-column>
          <s-table-column
            prop="isOpen"
            label="状态"
            width="100"
            column-key="isOpen"
            :filters="filtersIsopen">
            <template slot-scope="scope">
              <s-switch v-model="scope.row.isOpen" size="small" :active-value="1" :inactive-value="0" @change="changeStateRow(scope.row.isOpen, scope.row.uuid)"></s-switch>
            </template>
          </s-table-column>
          <s-table-column
            prop="description"
            label="备注">
          </s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click="editHandler(scope.row)" title="编辑"></i>
              <i v-if="scope.row.isBuiltin === 0" class="iconfont icon-delete" @click="deleteHandler(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </s-col>
    </s-row>
    <!--新增-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="700px"
      title="批量引用检查项">
      <add-dialog ref="addItem" :checkSystemList="checkSystemList"></add-dialog>
      <template slot="footer">
        <s-button @click="saveHandler">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="700px"
      title="编辑系统加固脚本">
      <add-dialog ref="editItem" :editData="editData"></add-dialog>
      <template slot="footer">
        <s-button @click="editSave">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import addDialog from './components/AddTemplate'
  import {Download} from 'sunflower-common-utils'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    data () {
      return {
        checkSystemList: [],
        ajaxObj: {
          type: 'post',
          url: '/automateSystemFasten/getSystemFastenItemByTemplateByCriteria',
          params: {
            condition: {}
          }
        },
        searchKey: '',
        currentNodeValue: '',
        addDialog: false,
        editDialog: false,
        editData: '',
        currentUuid: -1,
        selectUuid: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        filtersitemType: [
          {text: '身份验证', value: '身份验证'},
          {text: '访问控制', value: '访问控制'},
          {text: '安全审计', value: '安全审计'},
          {text: '入侵防范', value: '入侵防范'},
          {text: '资源控制', value: '资源控制'},
          {text: '恶意代码防范', value: '恶意代码防范'},
          {text: '剩余信息保护', value: '剩余信息保护'},
          {text: '其他', value: '其他'}
        ],
        itemTypeNameList: ['身份验证', '访问控制', '安全审计', '入侵防范', '资源控制', '恶意代码防范', '剩余信息保护', '其他'],
        filtersIsopen: [
          {text: '开启', value: 1},
          {text: '禁用', value: 0}
        ],
        isOpenList: [1, 0]
      }
    },
    components: {
      addDialog,
      RealPageTable
    },
    mounted() {
      this.getTreeItemTable()
    },
    methods: {
      changeState(isOpen) {
        if (this.selectUuid.length <= 0) {
          if (isOpen === 1) {
            this.$message.info('至少选择一项开启')
          } else {
            this.$message.info('至少选择一项禁用')
          }
        } else {
          let params = {
            isOpen: isOpen,
            uuidList: this.selectUuid
          }
          $axios.post('/automateSystemFasten/enableOrDisableTemplates', params).then((res) => {
            if (res.status === 200) {
              if (params.isOpen === 0) {
                this.$message({
                  message: '禁用成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: '开启成功',
                  type: 'success'
                });
              }
              this.getTreeItemTable()
              this.selectUuid = []
            } else {
              this.$message({
                message: '开启/关闭失败',
                type: 'error'
              });
            }
          });
        }
      },
      changeStateRow(isOpen, uuid) {
          let params = {
            isOpen: isOpen,
            uuidList: [uuid]
          }
          $axios.post('/automateSystemFasten/enableOrDisableTemplates', params).then((res) => {
            if (res.status === 200) {
              if (params.isOpen === 0) {
                this.$message({
                  message: '禁用成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: '开启成功',
                  type: 'success'
                });
              }
              this.getTreeItemTable()
            } else {
              this.$message({
                message: '开启/关闭失败',
                type: 'error'
              });
            }
          });
      },
      filterType(obj) {
        this.isOpenList = obj.isOpen;
        this.itemTypeNameList = obj.itemTypeName
        this.getTreeItemTable();
      },
      handleSelectChange(val) {
        this.selectUuid = val.map(item => item.uuid)
      },
      getTreeItemTable() {
        let params = {
          searchKey: this.searchKey,
          isOpenList: this.isOpenList,
          itemTypeNameList: this.itemTypeNameList
        }
        this.ajaxObj.params.condition = Object.assign({}, params);
      },
      handleData(value) {
        this.checkSystemList = value.pageList
        return this.checkSystemList
      },
      renderContent (h, {node}) {
        let img = ''
        node.level === 1 ? img = 'static/images/asseticon/files.png' : img = 'static/images/asseticon/Server.png'
        return (
          <span>
          <span><img style="vertical-align: middle;margin-right: 3px" src={img}></img></span>
          <span style="font-size:14px">{node.label}</span>
        </span>)
      },
      editHandler (row) {
        this.editDialog = true
        this.editData = row
      },
      deleteHandler (row) {
        let arr = [row.uuid]
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/automateSystemFasten/batchDelSystemFastenItem', arr, {
            data: [row],
            logTemplate: '删除|模板配置>加固项(#itemTypeName#/#name#)'
          }).then((res) => {
            if (res.data) {
              this.$message.success('删除成功');
              this.getTreeItemTable()
            } else {
              this.$message.error('删除失败');
            }
          })
        }).catch(() => {});
      },
      saveHandler () {
        let form = this.$refs['addItem'].form
        let arr = []
        this.$refs['addItem'].multipleSelection.map(i => {
          arr.push({description: i.description, name: i.scriptName, isOpen: form.isOpen, itemTypeName: form.itemTypeName, itemTypeUuid: form.itemTypeUuid, scriptLibUuid: form.scriptLibUuid, scriptPath: form.scriptPath, scriptUuid: form.scriptUuid, templateName: form.templateName, templateUuid: form.templateUuid, uuid: form.uuid})
        })
        this.$refs['addItem'].$refs['AddForm'].validate(valid => {
          if (valid) {
            this.$refs['addItem'].$refs['AddForm1'].validate(valid1 => {
              if (valid1) {
                $axios.post('/automateSystemFasten/addSystemFastenItem', arr, {
                  data: arr,
                  logTemplate: '添加|模板配置>加固项(#itemTypeName#/#name#)'
                }).then((res) => {
                  if (res.data) {
                    this.addDialog = false
                    this.getTreeItemTable()
                    this.$message.success('保存成功')
                  } else {
                    this.$message.error('保存失败')
                  }
                })
              } else {
                this.$refs['addItem'].activeNames = 'selectScript'
                this.$message({
                  type: 'warning',
                  message: '请按要求填写'
                })
              }
            })
          } else {
            this.$refs['addItem'].activeNames = 'base'
            this.$message({
              type: 'warning',
              message: '请按要求填写'
            })
          }
        })
      },
      editSave() {
        let form = this.$refs['editItem'].form
        this.$refs['editItem'].$refs['AddForm'].validate(valid => {
          if (!valid) return
          $axios.post('/automateSystemFasten/editSystemFastenItem', form, {
            data: [this.editData],
            logTemplate: '编辑|模板配置>加固项(#itemTypeName#/#name#)'
          }).then((res) => {
            if (res.data) {
              this.editDialog = false
              this.getTreeItemTable()
              this.$message.success('编辑成功')
              this.getTree();
            } else {
              this.$message.error('编辑失败')
            }
          })
        })
      },
      addTemp() {
        this.addDialog = true
      },
      exportTemp() {
        if (this.selectUuid.length === 0) {
          this.$message.info('请至少选择一项导出')
          return
        }
        $axios.post('/automateSystemFasten/exportSystemFastenItem', this.selectUuid).then((res) => {
          Download(res.data)
        })
      }
    }
  }
</script>

