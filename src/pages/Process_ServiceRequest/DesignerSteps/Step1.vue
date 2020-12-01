<template>
  <section id="serviceCatalog">
    <s-row :gutter="20">
      <s-col :span="12">
        <s-row class="step-title">配置服务目录</s-row>
        <s-row>
          <s-col :span="16">
            <span class="company-name">公司名称：</span>
            <s-select v-model="serviceCatalogForm.orgUuid" @change="changeDepartment">
              <s-option
                v-for="list in departmentLists"
                :label="list.departName"
                :value="list.uuid"
                :key="list.uuid">
              </s-option>
            </s-select>
          </s-col>
          <s-col :span="8">
            <s-button
              icon="plus" title="添加一级目录"
              @click="addFirstCatalog()"
              v-if="!(editDesigner)">添加</s-button>
          </s-col>
        </s-row>
        <s-scrollbar wrap-class="max-tree-height">
          <s-tree
            ref="serviceCatalogTree"
            :data="serviceCatalogTree"
            node-key="uuid"
            default-expand-all
            :props="{children:'childrenList'}"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="clickTreeNode">
            <span class="custom-tree-node" slot-scope="{ node, data }"> 
              <!--二级节点选中时的对勾icon和是否在线圆点标志-->
              <span v-if="data.parentId || (data.hasOwnProperty('parent') && data.parent!=='thetopuuid0000000000000000000000')">
                <!--选中时的对勾icon-->
                <span :class="!(data.hasOwnProperty('uuid'))||!!(editDesigner)?'showChecked':'notShowChecked'">
                  <i class="iconfont icon-correct-bold"></i>
                </span>

                <!--在线/下线圆点标志-->
                <span
                  class="online-offline"
                  :class="!data.hasOwnProperty('node') || (data.hasOwnProperty('node') && data.node.status)===0?'online':'offline'"
                  :title="!data.hasOwnProperty('node') || (data.hasOwnProperty('node') && data.node.status)===0?'在线':'已下线'"></span>
              </span>

              <!--一、二级节点展示文字-->
              <span class="tree-node-label">{{ data.name }}</span>

              <!--一、二级节点右侧工具栏tool-bar-->
              <span class="tree-tool-bar"><!--v-if="!(editDesigner)"-->
                <!--一级节点tool-bar-->
                <span
                  v-if="data.parentId===null || data.parent==='thetopuuid0000000000000000000000'">
                  <i v-if="!(editDesigner)&&inlayarr.indexOf(data.uuid)===-1"
                     class="iconfont icon-add" title="添加二级目录" @click.stop="addSecondCatalog(data)"></i>
                  <i class="iconfont icon-edit" title="编辑一级目录"  @click.stop="addFirstCatalog(data)" v-if="inlayarr.indexOf(data.uuid)===-1"></i>
                  <i class="iconfont icon-delete" title="删除一级目录"
                     :class="{'not-delete': calFirstCatalogDelete(data)}"
                     @click.stop="deleteFirstCatalog(data, calFirstCatalogDelete(data))" v-if="inlayarr.indexOf(data.uuid)===-1"></i>
                </span>

                <!--二级节点tool-bar-->
                <span
                  v-if="data.parentId || (data.hasOwnProperty('parent') && data.parent!=='thetopuuid0000000000000000000000')">
                  <i class="iconfont icon-edit" title="编辑二级目录"  @click.stop="editSecondCatalog(data)" v-if="inlayarr.indexOf(data.uuid)===-1"></i>
                  <i class="iconfont icon-delete" title="删除二级目录"  v-if="inlayarr.indexOf(data.uuid)===-1"
                     :class="{'not-delete': data.hasOwnProperty('node') && data.node.isDelete===0}"
                     @click.stop="deleteSecondCatalog(data)"></i>
                </span>
              </span>
            </span>
          </s-tree>
        </s-scrollbar>
      </s-col>
      <s-col :span="12">
        <s-row class="step-title">详细信息</s-row>
        <s-row class="form-ctn">
          <s-form
            ref="serviceCatalogForm"
            :model="serviceCatalogForm"
            :rules="serviceCatalogFormRules"
            label-width="120px">
            <s-form-item label="目录一级：" prop="firstCatalog">
              <s-input v-model="serviceCatalogForm.firstCatalog" :disabled="true" :maxlength="30"></s-input>
            </s-form-item>
            <s-form-item label="目录二级：" prop="secondCatalog">
              <s-input v-model="serviceCatalogForm.secondCatalog" :disabled="inlayarr.indexOf(serviceCatalogForm.nodeId)!=-1" :maxlength="30"></s-input>
            </s-form-item>
            <s-form-item label="请求名称：" prop="requestName">
              <s-input v-model="serviceCatalogForm.requestName" :disabled="inlayarr.indexOf(serviceCatalogForm.nodeId)!=-1" :maxlength="30"></s-input>
            </s-form-item>
            <s-form-item label="服务描述：" prop="desc">
              <s-input v-model="serviceCatalogForm.desc" :disabled="inlayarr.indexOf(serviceCatalogForm.nodeId)!=-1" type="textarea" :rows="5" resize="none" :maxlength="120"></s-input>
            </s-form-item>
            <s-form-item>
              <!--v-if="!(editDesigner)"-->
              <!--:disabled="editSecondSaveDisabled || editDesigner"-->
              <s-button
                :disabled="editSecondSaveDisabled||inlayarr.indexOf(serviceCatalogForm.nodeId)!=-1"
                @click="saveEditSecond">保存</s-button>
            </s-form-item>
          </s-form>
        </s-row>
      </s-col>
    </s-row>

    <!--添加一级目录弹框-->
    <s-dialog
      v-if="addFirstCatalogDialog"
      v-model="addFirstCatalogDialog"
      title="添加一级目录"
      key="addFirstCatalogDialog">
      <add-first-catalog
        ref="firstCatalog" :companyName="companyName" :editData="editCatalogData">
      </add-first-catalog>
      <template slot="footer">
        <s-button @click="saveAddFirstCatalog">确定</s-button>
        <s-button type="cancel" @click="addFirstCatalogDialog=false">取消</s-button>
      </template>
    </s-dialog>

    <!--添加二级目录弹框-->
    <s-dialog
      v-if="addSecondCatalogDialog"
      v-model="addSecondCatalogDialog"
      title="添加二级目录"
      key="addSecondCatalogDialog">
      <add-second-catalog
        ref="secondCatalog"
        :showData="secondCatalogShowData">
      </add-second-catalog>
      <template slot="footer">
        <s-button @click="saveAddSecondCatalog">确定</s-button>
        <s-button type="cancel" @click="addSecondCatalogDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import addFirstCatalog from '../DesignerDialog/AddFirstCatalog';
  import addSecondCatalog from '../DesignerDialog/AddSecondCatalog';

  export default {
    data() {
      return {
        departmentLists: [],              // 公司机构下拉选项列表
        serviceCatalogTree: [],           // 服务目录树
        addFirstCatalogDialog: false,     // 添加一级目录弹框
        addSecondCatalogDialog: false,    // 添加二集目录弹框
        companyName: '',                  // 公司名称(弹框中置灰展示)
        editCatalogData: {},              // 当前编辑的目录数据
        secondCatalogShowData: {},        // 添加二级目录时{公司名称，一级目录名称}
        // 右侧二级目录编辑表单
        serviceCatalogForm: {
          orgUuid: '',
          requestName: '',
          desc: ''
        },
        // 右侧二级目录编辑表单验证规则
        serviceCatalogFormRules: {
          secondCatalog: [{required: true, message: '不能为空', blur: 'trigger'}],
          requestName: [{required: true, message: '不能为空', blur: 'trigger'}]
        },
        editSecondSaveDisabled: true,     // 右侧二级目录编辑表单保存按钮是否可用
        addFirstCounter: 0,               // 新添加的一级目录个数(用来判断一次只能新增一个一级)
        addSecondCounter: 0               // 新添加的二级目录个数(用来判断一次只能新增一个二级)
      }
    },
    components: {
      addFirstCatalog,
      addSecondCatalog
    },
    computed: {
      editDesigner() {
        return this.$store.state.serviceRequest.editDesigner
      },
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      }
    },
    watch: {
      /**
       * 监听目录树
       * 当有新增的一/二级目录时，
       * 改变addFirstCounter/addSecondCounter
       */
      serviceCatalogTree: {
        deep: true,
        handler(val) {
          // 重置计数
          this.addFirstCounter = this.addSecondCounter = 0;
          val.forEach(item => {
            if (item.hasOwnProperty('nodeId') && item.nodeId.includes('firstCatalog')) {
              this.addFirstCounter += 1;
            }
            item.childrenList.forEach(list => {
              if (list.hasOwnProperty('nodeId') && list.nodeId.includes('secondCatalog')) {
                this.addSecondCounter += 1;
              }
            });
          });
        }
      }
    },
    methods: {
      // 获取公司机构下拉选项列表
      getDepartmentLists() {
        return new Promise((resolve, reject) => {
          $axios.get('/itilWorkflowConfig/getAllCompanyList').then(({data}) => {
            if (data && data instanceof Array) {
              this.departmentLists = data;
              resolve();
            } else {
              reject();
            }
          });
        });
      },
      // 公司名称下拉选项改变
      changeDepartment(val) {
        this.companyName = this.departmentLists.find(item => item.uuid === val).departName;
        this.$store.commit('setCompanyData', {
          companyName: this.companyName,
          companyUuid: val
        });
        // this.serviceCatalogTree = [];
        // 获取当前公司已添加的服务目录树
        (this.addSecondCounter === 0 || this.editDesigner) && this.getCatalogTreeData(val);
      },
      // 获取已添加的服务目录树
      getCatalogTreeData(companyUuid) {
        $axios.get(`/itilServiceRequest/getDesignerOffLineAndOnLineByOrgUuid/${companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.serviceCatalogTree = data;
            // 当从step1-修改跳转至本页面，设置当前选中节点为step1弹框中所选设计器
            if (this.editDesigner) {
              this.$nextTick(() => {
                this.$refs.serviceCatalogTree.setCurrentKey(this.editDesigner.uuid);
              })
            }
          }
        });
      },
      // 判断在"创建"功能中点击的是否是已经保存的设计器
      clickTreeNode(data) {
        if (this.editDesigner) { // 编辑修改设计器
          // 点击选择其他设计器时，重置回step1中所选的要编辑的设计器
          this.$refs.serviceCatalogTree.setCurrentKey(this.editDesigner.uuid);
        } else { // 创建设计器
          if (data.hasOwnProperty('parent') && data.parent !== 'thetopuuid0000000000000000000000' && data.uuid) {
            this.$refs.serviceCatalogTree.setCurrentKey(null);
          }
        }
        if (data.parentId || (data.hasOwnProperty('parent') && data.parent !== 'thetopuuid0000000000000000000000')) {
          // 如果点击的是二级目录节点
          this.editSecondCatalog(data);   // 给左侧编辑表单赋值
        }
      },
      // 打开弹框，添加一级目录
      addFirstCatalog(data) {
        if (!data) { // 新增
          if (this.addSecondCounter === 0 && this.addFirstCounter === 0) {
            this.editCatalogData = {};
            if (!this.serviceCatalogForm.orgUuid) {
              this.$message.warning('请先选择公司！');
              return
            }
            this.addFirstCatalogDialog = true;
          } else {
            this.$message.warning('一次只可创建一个设计器');
          }
        } else { // 编辑
          this.editCatalogData = data;
          this.addFirstCatalogDialog = true;
        }
      },
      // 保存添加/编辑一级目录
      saveAddFirstCatalog() {
        this.$refs.firstCatalog.$refs.firstCatalog.validate(valid => {
          if (valid) {
            // 目录一级是否重名校验
            let repeatFlag = this.serviceCatalogTree.find((item, idx) => {
              return item.name === this.$refs.firstCatalog.firstCatalogForm.firstCatalog
            });
            if (repeatFlag) {
              this.$message.warning('已存在相同的一级目录名，请勿重复添加！');
              return
            }
            if (this.$refs.firstCatalog.firstCatalogForm.editData) { // 编辑
              if (this.$refs.firstCatalog.firstCatalogForm.editData.uuid) { // 编辑已入库的一级目录
                let updateData = {
                  uuid: this.$refs.firstCatalog.firstCatalogForm.editData.uuid, // 二级目录uuid
                  name: this.$refs.firstCatalog.firstCatalogForm.firstCatalog,  // 修改后的二级目录名
                  oldName: this.$refs.firstCatalog.firstCatalogForm.editData.name // 联动用
                }
                $axios.post('/itilServiceRequest/updateDesigner', updateData).then(({data}) => {
                  if (data === true) {
                    // 手动刷新修改的节点
                    this.serviceCatalogTree.forEach((item, idx) => {
                      if (item.uuid === this.$refs.firstCatalog.firstCatalogForm.editData.uuid) {
                        this.serviceCatalogTree[idx].name = this.$refs.firstCatalog.firstCatalogForm.firstCatalog;
                      }
                    });
                    this.$message.success('编辑成功！');
                    this.addFirstCatalogDialog = false;
                  } else {
                    this.$message.error('编辑失败，请重试！');
                  }
                });
              } else { // 编辑新增(未入库)的二级目录节点
                // 采用自生成ID匹配
                this.serviceCatalogTree.forEach((item, idx) => {
                  if (item.nodeId === this.$refs.firstCatalog.firstCatalogForm.editData.nodeId) {
                    this.serviceCatalogTree[idx].name = this.$refs.firstCatalog.firstCatalogForm.firstCatalog;
                  }
                });
                this.addFirstCatalogDialog = false;
                this.$message.success('编辑成功！');
              }
            } else {
              // 新增
              this.serviceCatalogTree.push({
                name: this.$refs.firstCatalog.firstCatalogForm.firstCatalog,
                nodeId: `firstCatalog-${new Date().getTime()}`,    // 前端自生成id
                parentId: null,
                childrenList: []
              });
              this.addFirstCatalogDialog = false;
              this.$message.success('添加成功！');
            }
          } else {
            return false
          }
        })
      },
      // 判断一级节点是否可以删除
      calFirstCatalogDelete(nodeData) {
        let notDelete = false;
        if (nodeData.childrenList instanceof Array) {
          notDelete = nodeData.childrenList.some(child => {
            return (child.hasOwnProperty('node') && child.node.isDelete === 0)
          });
        }
        return notDelete;
      },
      // 删除一级目录
      deleteFirstCatalog(nodeData, notDelete) {
        if (notDelete) return;
        // 删除已入库节点数据
        if (nodeData.uuid) {
          $axios.get(`/itilServiceRequest/delete/${nodeData.uuid}`).then(({data}) => {
            if (data === true) {
              this.serviceCatalogTree = this.serviceCatalogTree.filter(item => item.uuid !== nodeData.uuid);
              this.$message.success('删除成功！');
              // 若在右侧编辑成功，又在左侧树中删除对应的节点，此时需要清空右侧表单
              this.$refs.serviceCatalogForm.resetFields();
            } else {
              this.$message.error('删除失败，请重试！');
            }
          });
        } else {
          this.serviceCatalogTree = this.serviceCatalogTree.filter(item => item.nodeId !== nodeData.nodeId);
          this.$message.success('删除成功！');
          this.$refs.serviceCatalogForm.resetFields();
        }
      },
      // 打开弹框，添加二级目录
      addSecondCatalog(nodeData) {
        if (this.addSecondCounter === 0) {
          if (this.addFirstCounter === 0) {
            this.secondCatalogShowData = {
              companyName: this.companyName,
              firstCatalog: nodeData.name,
              firstCatalogId: nodeData.nodeId || nodeData.uuid
            }
            this.addSecondCatalogDialog = true;
          } else {
            if (nodeData.hasOwnProperty('uuid')) {
              this.$message.warning('请为新建一的级目录添加二级目录！');
            } else {
              this.secondCatalogShowData = {
                companyName: this.companyName,
                firstCatalog: nodeData.name,
                firstCatalogId: nodeData.nodeId || nodeData.uuid
              }
              this.addSecondCatalogDialog = true;
            }
          }
        } else {
          this.$message.warning('一次只可创建一个设计器');
        }
      },
      // 保存添加二级目录
      saveAddSecondCatalog() {
        // 新增二级目录
        this.$refs.secondCatalog.$refs.secondCatalog.validate(valid => {
          if (valid) {
            /* ***验证二级目录是否重名*** */
            // 找到父级节点
            let parentNode = this.serviceCatalogTree.find(item => {
              // 一级目录可能是新增的/也可能是已入库的
              return item.nodeId === this.$refs.secondCatalog.secondCatalogForm.firstCatalogId || item.uuid === this.$refs.secondCatalog.secondCatalogForm.firstCatalogId;
            });
            if (!parentNode) return;
            // 查找是否存在重名项
            let repeatFlag = parentNode.childrenList.find(list => {
              // 排除自身和自身比较
              let sameId = true;
              if (list.hasOwnProperty('uuid')) {
                sameId = list.uuid !== this.$refs.secondCatalog.secondCatalogForm.firstCatalogId;
              } else {
                sameId = list.nodeId !== this.$refs.secondCatalog.secondCatalogForm.firstCatalogId;
              }
              return list.name === this.$refs.secondCatalog.secondCatalogForm.secondCatalog && sameId;
            });
            if (repeatFlag) {
              this.$message.warning('已存在同名的二级目录！');
              return
            }
            /* ***构造新增数据，添加至目录树*** */
            this.serviceCatalogTree.find(item => {
              let id = item.nodeId || item.uuid
              if (id === this.$refs.secondCatalog.secondCatalogForm.firstCatalogId) {
                let addNodeData = {
                  name: this.$refs.secondCatalog.secondCatalogForm.secondCatalog,   // 目录二级名称
                  requestName: this.$refs.secondCatalog.secondCatalogForm.requestName,
                  desc: this.$refs.secondCatalog.secondCatalogForm.desc,
                  nodeId: `secondCatalog-${new Date().getTime()}`,   // 当前新增目录二级节点前端生成id
                  // 当前新增的node节点的父节点id，tree组件判断叶子节点时所需字段
                  parentId: this.$refs.secondCatalog.secondCatalogForm.firstCatalogId,
                  childrenList: []
                };
                item.childrenList.push(addNodeData);
                this.$message.success('添加成功！');
                // 将新添加的二级目录默认选中，因为只能添加一个设计器，所以后面只能配置这个新添加的设计器
                this.$refs.serviceCatalogTree.setCurrentKey(addNodeData.nodeId);
              }
            });
            this.addSecondCatalogDialog = false;
          } else {
            return false
          }
        })
      },
      // 编辑二级目录，向右侧表单字段赋值
      editSecondCatalog(nodeData) {
        this.editSecondSaveDisabled = true;
        this.serviceCatalogForm.oldName = nodeData.name;      // 联动用
        this.serviceCatalogForm.secondCatalog = nodeData.name;
        this.serviceCatalogForm.requestName = nodeData.requestName || nodeData.node.requestName;
        /* 新增节点取nodeData.desc，已入库节点取nodeData.node.desc */
        if (nodeData.hasOwnProperty('desc')) {
          this.serviceCatalogForm.desc = nodeData.desc
        } else {
          if (nodeData.hasOwnProperty('node')) {
            this.serviceCatalogForm.desc = nodeData.node.desc;
          }
        }
        // 查找匹配一级目录特殊处理
        if (nodeData.uuid) { // 编辑已入库的二级(一级一定已入库)
          this.serviceCatalogForm.firstCatalog = this.serviceCatalogTree.find(item => item.uuid === nodeData.parent).name;
          // 以下两个id，在右侧编辑完成，saveEditSecond()函数保存时用来更改tree数组中的对应数据
          this.$set(this.serviceCatalogForm, 'parentId', nodeData.parent);    // 父节点id
          this.$set(this.serviceCatalogForm, 'nodeId', nodeData.uuid);        // 二级目录自身id
        } else { // 编辑新增的二级
          this.serviceCatalogForm.firstCatalog = this.serviceCatalogTree.find(item => (item.uuid === nodeData.parentId || item.nodeId === nodeData.parentId)).name
          // 以下两个id，在右侧编辑完成，saveEditSecond()函数保存时用来更改tree数组中的对应数据
          this.$set(this.serviceCatalogForm, 'parentId', nodeData.parentId);    // 父节点id
          this.$set(this.serviceCatalogForm, 'nodeId', nodeData.nodeId);        // 二级目录自身id
        }
        // 只能编辑在线的二级目录，已下线的二级目录不能编辑
        if (!(nodeData.hasOwnProperty('node') && nodeData.node.status === 1)) {
          this.editSecondSaveDisabled = false;
        }
      },
      // 保存右侧编辑二级目录表单
      saveEditSecond() {
        this.$refs.serviceCatalogForm.validate(valid => {
          if (valid) {
            /* ***验证二级目录是否重名*** */
            // 找到父级节点
            let parentNode = this.serviceCatalogTree.find(item => {
              // 一级目录可能是新增的/也可能是已入库的
              return item.nodeId === this.serviceCatalogForm.parentId || item.uuid === this.serviceCatalogForm.parentId;
            });
            if (!parentNode) return;
            // 查找是否存在重名项
            let repeatFlag = parentNode.childrenList.find(list => {
              // 排除自身和自身比较
              let sameId = true;
              if (list.hasOwnProperty('uuid')) {
                sameId = list.uuid !== this.serviceCatalogForm.nodeId;
              } else {
                sameId = list.nodeId !== this.serviceCatalogForm.nodeId;
              }
              return list.name === this.serviceCatalogForm.secondCatalog && sameId;
            });
            if (repeatFlag) {
              this.$message.warning('已存在同名的二级目录！');
              return
            }
            // 编辑的是已入库的二级目录
            if (this.serviceCatalogForm.nodeId.indexOf('secondCatalog') === -1) {
              let updateData = {
                uuid: this.serviceCatalogForm.nodeId,
                name: this.serviceCatalogForm.secondCatalog,
                oldName: this.serviceCatalogForm.oldName,      // 联动用
                requestName: this.serviceCatalogForm.requestName,
                desc: this.serviceCatalogForm.desc
              }
              $axios.post('/itilServiceRequest/updateDesigner', updateData).then(({data}) => {
                if (data === true) {
                  // 后台更新成功后，手动更新页面目录树
                  this.serviceCatalogTree.forEach(item => {
                    // 找到二级目录父级(一级)目录
                    if (item.nodeId === this.serviceCatalogForm.parentId || item.uuid === this.serviceCatalogForm.parentId) {
                      // 找到对应当前编辑的二级目录
                      item.childrenList.forEach(list => {
                        // 修改数据
                        if (list.nodeId === this.serviceCatalogForm.nodeId || list.uuid === this.serviceCatalogForm.nodeId) {
                          list.name = this.serviceCatalogForm.secondCatalog;
                          list.requestName = this.serviceCatalogForm.requestName;
                          list.desc = this.serviceCatalogForm.desc;
                        }
                      });
                      this.$message.success('编辑成功！');
                    }
                  })
                } else {
                  this.$message.error('编辑失败，请重试！');
                }
              });
            } else { // 编辑未入库的(刚新增的)二级目录
              this.serviceCatalogTree.forEach(item => {
                // 找到二级目录父级(一级)目录
                if (item.nodeId === this.serviceCatalogForm.parentId || item.uuid === this.serviceCatalogForm.parentId) {
                  // 找到对应当前编辑的二级目录
                  item.childrenList.forEach(list => {
                    // 修改数据
                    if (list.nodeId === this.serviceCatalogForm.nodeId) {
                      list.name = this.serviceCatalogForm.secondCatalog;
                      list.requestName = this.serviceCatalogForm.requestName;
                      list.desc = this.serviceCatalogForm.desc;
                    }
                  });
                  this.$message.success('编辑成功！');
                }
              })
            }
          } else {
            return false
          }
        });
      },
      // 删除二级目录
      deleteSecondCatalog(nodeData) {
        if (nodeData.hasOwnProperty('node') && nodeData.node.isDelete === 0) return;
        // 删除已入库节点数据
        if (nodeData.uuid) {
          $axios.get(`/itilServiceRequest/delete/${nodeData.uuid}`).then(({data}) => {
            if (data === true) {
              let freshArr = [];  // 手动刷新后的一级目录
              // 删除成功后不能请求接口刷新树，手动删除刚已删除数据
              this.serviceCatalogTree.forEach(item => {
                // 找到二级目录父级(一级)目录
                if (item.uuid === nodeData.parent) {
                  // 找到对应当前编辑的二级目录
                  item.childrenList = item.childrenList.filter(list => list.uuid !== nodeData.uuid);
                  this.$message.success('删除成功！');
                  // 若在右侧编辑成功，又在左侧树中删除对应的节点，此时需要清空右侧表单
                  this.$refs.serviceCatalogForm.resetFields();
                  /* 一级目录下的所有二级被删除，同时手动删除该一级目录 */
                  if (item.childrenList.length === 0) {
                    freshArr = this.serviceCatalogTree.filter(i => i.uuid !== item.uuid);
                  } else {
                    freshArr = this.serviceCatalogTree;
                  }
                }
              });
              this.serviceCatalogTree = freshArr;
            }
          });
        } else {
          // 删除前台临时数据(删除原理同上)
          this.serviceCatalogTree.forEach(item => {
            let key = item.hasOwnProperty('uuid') ? 'uuid' : 'nodeId';
            if (item[key] === nodeData.parentId) {
              item.childrenList = item.childrenList.filter(list => list.nodeId !== nodeData.nodeId);
              this.$message.success('删除成功！');
              this.$refs.serviceCatalogForm.resetFields();
            }
          });
        }
      }
    },
    created() {},
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      /* ***当进入step1编辑了二级目录，右侧表单有数据后，前往前/后一步，再返回时，清空右侧表单*** */
      this.editSecondSaveDisabled = true;
      this.$refs.serviceCatalogForm.resetFields();
      /* ***以下代码解决当先选择编辑进入step1后，又返回step0选择创建进入step1，此时需要清空编辑时设置的currentNode*** */
      let currentNode = this.$refs.serviceCatalogTree.getCurrentNode();
      (currentNode && currentNode.hasOwnProperty('uuid')) && this.$refs.serviceCatalogTree.setCurrentKey(null);
      // 获取公司机构下拉选项列表
      this.getDepartmentLists().then(() => {
        let state = this.$store.state.serviceRequest;
        if (!state.editDesigner) {
          // 创建设计器时，公司名称默认第一个下拉选项
          this.serviceCatalogForm.orgUuid = this.departmentLists[0].uuid;
        } else {
          // 编辑设计器
          this.serviceCatalogForm.orgUuid = state.editDesigner.editData.itilRequestDesigner.orgUuid;
        }
        this.changeDepartment(this.serviceCatalogForm.orgUuid);
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #serviceCatalog
    .company-name
      font-size 15px
    .max-tree-height
      max-height calc(100vh - 400px)
    .s-tree
      .s-tree-node-content
        font-size 15px
        line-height 32px
        .custom-tree-node
          .showChecked,.notShowChecked
            margin-right 8px
            .icon-correct-bold
              font-size 18px
              opacity 0
          .online-offline
            display inline-block
            width 6px
            height 6px
            border-radius 50%
            position relative
            top -2px
            right 5px
          .tree-node-label
            font-size 15px
          .tree-tool-bar
            float right
            padding-right 20px
            display none
            .iconfont
              font-size 18px
              margin-left 10px
            .not-delete
              cursor not-allowed
        &:hover .tree-tool-bar
          display block
      .s-tree-node-children
        .is-current
          .showChecked .icon-correct-bold
            opacity 1
</style>
