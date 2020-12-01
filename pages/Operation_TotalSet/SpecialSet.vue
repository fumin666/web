<!--
 * @Author: songyf
 * @Date: 2019-11-25
 * @LastEditors: songyf
 * @Description: 运维中心-参数配置-特殊运维设置.
 -->
<template>
  <section id="sys-oper-set">
    <s-row class="title oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      层级范围设置
    </s-row>
    <s-form :model="specialform4" label-width="200px">
      <s-form-item label="审批领导层级:" prop="approvalDepartmentLevel">
        <s-col span="8">
          <s-select v-model="specialform4.approvalDepartmentLevel">
            <s-option label="本组织机构" :value="0"></s-option>
            <s-option label="上级组织机构" :value="1"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <s-form-item>
        <s-button @click="submitspecial4">保存</s-button>
      </s-form-item>
    </s-form>
    <s-row class="title oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      申请范围设置
    </s-row>
    <s-form :model="specialform1" label-width="200px">
      <s-form-item label="清单类型:" prop="listType">
        <s-col span="8">
          <s-select v-model="specialform1.listType">
            <s-option label="授权清单" :value="0"></s-option>
            <s-option label="申请清单" :value="1"></s-option>
            <s-option label="混合清单" :value="2"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <s-form-item>
        <s-button @click="submitspecial1">保存</s-button>
      </s-form-item>
    </s-form>
    <s-row class="title oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      特殊运维属性
    </s-row>
    <s-form :model="specialform2" label-width="200px">
      <s-form-item>
        <s-radio-group v-model="specialform2.sepOperType">
          <s-radio :label="1">动态口令牌</s-radio>
          <s-radio :label="2">Radius认证</s-radio>
          <s-radio :label="3">手机动态口令牌</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item>
        <s-button @click="submitspecial2">保存</s-button>
      </s-form-item>
    </s-form>
    <s-row class="title oper-suppage-title" style="margin-top: 12px">
      <i class="iconfont icon-tag"></i>
      申请默认类型设置
    </s-row>
    <s-form :model="specialform3" label-width="200px" class="set-radio-box">
      <s-form-item>
        <s-radio-group v-model="specialform3.specialoperTypeUuid">
          <s-radio v-for="item in tableData" :key="item.id" :label="item.uuid">{{item.specialoperTypeName}}</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item>
        <s-button @click="submitspecial3">保存</s-button>
      </s-form-item>
    </s-form>
    <s-row class="title oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      特殊运维自定义
    </s-row>
    <s-row style="margin: 12px 0">
      <s-col>
        <s-button @click="addDialog = true">添加</s-button>
      </s-col>
    </s-row>
    <s-table
      :data="tableData"
      style="width: 100%">
      <s-table-column
        prop="specialoperTypeName"
        label="名称">
      </s-table-column>
      <s-table-column
        prop="specialoperCategory"
        label="类型"
        :formatter="formatterType">
      </s-table-column>
      <s-table-column
        prop="remark"
        label="备注">
      </s-table-column>
      <s-table-column
        label="操作">
        <template slot-scope="scope">
          <i @click="editHandler(scope.$index, scope.row)" class="iconfont icon-edit"></i>
          <i @click="delHandler(scope.$index, scope.row)" class="iconfont icon-delete"></i>
        </template>
      </s-table-column>
    </s-table>
    <!--新增-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="700px"
      title="添加运维类型">
      <add-form ref="addFormDialog"></add-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">保存</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="700px"
      title="编辑运维类型">
      <add-form ref="editFormDialog" :editData="editData"></add-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">保存</s-button>
        <s-button type="cancel" @click="editCancel">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import addForm from './AddDialog'
  import $axios from 'sunflower-ajax';
  import {intersectObj} from 'sunflower-common-utils'
  import _ from 'lodash';

  export default {
    data() {
      return {
        specialform1: {
          listType: 0
        },
        specialform2: {
          sepOperType: ''
        },
        specialform3: {
          specialoperTypeUuid: ''
        },
        specialform4: {
          approvalDepartmentLevel: ''
        },
        setMidManForm: {
          approverUuid: []
        },
        tableData: [],
        auditData: [],
        multipleSelection: [],
        multiSelection: [],
        sysOperSet: {
          orderCol: '',
          orderType: ''
        },
        auditSet: {
          orderCol: '',
          orderType: ''
        },
        approvers: {},
        editData: {},
        addDialog: false,
        editDialog: false
      }
    },
    components: {
      addForm
    },
    props: {
      isCard: {
        type: String,
        default: 'card'
      }
    },
    methods: {
      handleSelectionAudit(val) {
        let noSelectVal = _.difference(this.auditData, val)
        noSelectVal.forEach(val => {
          val.status = 0
        })
        val.forEach(val => {
          val.status = 1
        })
        this.multiSelection = noSelectVal.concat(val);
      },
      saveSetForm() {
        let addForm = Object.assign({}, {sysOperList: this.multipleSelection}, {sysOperSet: this.sysOperSet})
        $axios.post('/operationSettings/saveSysOper', addForm, {
          logTemplate: '编辑|运维页面设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '请至少勾选一个',
              type: 'error'
            });
          }
        });
      },
      saveAuditSetForm() {
        let addForm = Object.assign({}, {sysAuditList: this.multiSelection}, {sysAuditSet: this.auditSet})
        $axios.post('/operationSettings/saveCheckPageSet', addForm, {
          logTemplate: '编辑|审核页面设置'
        }).then((res) => {
          if (res.data === true) {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '请至少勾选一个',
              type: 'error'
            });
          }
        });
      },
      getAuditForm() {
        let that = this
        let selected = []
        $axios.get('/operationSettings/listCheckPage').then((res) => {
          that.auditData = res.data.sysAuditList
          for (let i of that.auditData) {
            if (i.status === 1) {
              selected.push(i)
            }
          }
          that.auditSet = intersectObj(that.auditSet, res.data.sysAuditSet)
          that.$nextTick(() => {
            selected.forEach(row => {
              that.$refs.multiTable.toggleRowSelection(row);
            });
          })
        })
      },
      formatterType(item) {
        return item.specialoperCategory === 1 ? '在线审批' : '离岸审批';
      },
      getSpecialData1() {
        $axios.post('/operationSettings/getSysApply', this.portform).then((res) => {
          this.specialform1 = intersectObj(this.specialform1, res.data)
        })
      },
      getSpecialData2() {
        $axios.post('/operationSettings/getInteriorTokenType', this.portform).then((res) => {
          this.specialform2 = intersectObj(this.specialform2, res.data)
        })
      },
      getSpecialData4() {
        $axios.get('/operationSettings/getLevelSetting').then((res) => {
          this.specialform4 = intersectObj(this.specialform4, res.data)
        })
      },
      submitspecial1() {
        $axios.post('/operationSettings/saveSysApply', this.specialform1, {
          logTemplate: '编辑|特殊运维设置>申请范围设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      submitspecial2() {
        $axios.post('/operationSettings/saveInteriorTokenType', this.specialform2, {
          logTemplate: '编辑|特殊运维设置>特殊运维属性'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      submitspecial3() {
        $axios.get(`/operationSettings/saveDefaultType/${this.specialform3.specialoperTypeUuid}`, {
          logTemplate: '编辑|特殊运维设置>申请默认类型设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      submitspecial4() {
        $axios.get(`/operationSettings/saveLevelSetting/${this.specialform4.approvalDepartmentLevel}`, {
          logTemplate: '编辑|特殊运维设置>层级范围设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      },
      getSpecialList: function () {
        $axios.get('/operationSettings/listSpecialoperDefine').then((res) => {
          let vm = this
          vm.tableData = res.data
          for (let i of vm.tableData) {
            if (i.defaultType === 1) {
              vm.specialform3.specialoperTypeUuid = i.uuid
            }
          }
        })
      },
      addOk() {
        let form = this.$refs['addFormDialog'].$refs['addForm'];
        let addForm = this.$refs['addFormDialog'].form;
        form.validate((valid) => {
          if (!valid) return;
          $axios.post('/operationSettings/saveSpecialoperType', addForm, {
            data: [{name: addForm.specialoperTypeName, type: addForm.specialoperCategory}],
            logTemplate: '添加|特殊运维设置>特殊运维类型(#type#/#name#)'
          }).then((res) => {
            if (res.data.hasOwnProperty('success')) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getSpecialList();
              this.addDialog = false;
            } else {
              this.$message({
                message: res.data.existed || res.data.failure,
                type: 'error'
              });
            }
          });
        });
      },
      addCancel() {
        this.addDialog = false
      },
      editOk() {
        let form = this.$refs['editFormDialog'].$refs['addForm'];
        let addForm = this.$refs['editFormDialog'].form;
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/operationSettings/editSaveSpecialoperType', addForm, {
            data: [{name: addForm.specialoperTypeName, type: addForm.specialoperCategory}],
            logTemplate: '编辑|特殊运维设置>特殊运维类型(#type#/#name#)'
          }).then((res) => {
            if (res.data.hasOwnProperty('success')) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.getSpecialList();
              this.editDialog = false;
            } else {
              this.$message({
                message: res.data.existed || res.data.failure,
                type: 'error'
              });
            }
          });
        })
      },
      editCancel() {
        this.editDialog = false
      },
      editHandler(index, row) {
        $axios.get(`/operationSettings/editSpecialoperType/${row.uuid}`).then((res) => {
          this.editData = res.data
          this.editDialog = true
        });
      },
      delHandler(index, row) {
        let vm = this
        vm.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationSettings/deleteSpecialoperDefine/${row.uuid}`, {
            data: [{name: row.specialoperTypeName, type: row.specialoperCategory}],
            logTemplate: '删除|特殊运维设置>特殊运维类型(#type#/#name#)'
          }).then((res) => {
            if (res.data === 'success') {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });
              vm.getSpecialList();
            }
          });
        }).catch(() => {
        });
      }
    },
    created() {
      this.getSpecialData1();
      this.getSpecialData2();
      this.getSpecialData4();
      this.getSpecialList();
    }
  }
</script>
<style lang="stylus">
  #sys-oper-set
    .title
      margin-bottom 15px

    .setDataPage
      .s-input-number
        display block

    .set-radio-box
      .s-radio
        margin-left 0
        margin-bottom 10px
</style>
