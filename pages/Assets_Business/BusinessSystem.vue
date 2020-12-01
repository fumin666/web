<!--
 * @Description: In User Settings Edit
 * @Author: tong b b
 * @LastEditors: 高建鹏
 * @Date: 2019-05-07 15:12:21
 * @LastEditTime: 2019-06-19 14:06:55
 -->

<template>
  <div class="assetProtocol">
    <s-row class="topRow">
      <s-button @click="add" >添加</s-button>
      <s-button @click="del" >批量删除</s-button>
    </s-row>
    <s-table-page :data="businessList"
                 :header-search="searchDef()"
                 @selection-change='selection'>
      <!-- <s-table-column type="index" width="45" align="center"></s-table-column>-->
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="业务名称" prop='name'></s-table-column>
      <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="eyeEdit(scope.row)" title="查看" ></i>
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑" ></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除" ></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 添加 -->
    <s-dialog v-model="addDialogFlag" title='添加业务系统' width="600px" class="protocolAddDialog" v-if='addDialogFlag' :show-close='false'>
      <s-form :model="businnessForm" :rules="businnessRules" ref="businnessForm" label-width="120px">
        <s-form-item label='业务名称' prop='name'>
          <s-input v-model.trim="businnessForm.name"></s-input>
        </s-form-item>
        <s-form-item label='备注' prop='remark'>
          <s-input v-model="businnessForm.remark" type="textarea" :rows="4"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk('businnessForm')">确定</s-button>
        <s-button type="cancel" @click="undialogOk">取消</s-button>
      </template>
    </s-dialog>
    <!-- 查看 -->
    <s-dialog v-model="eyeDialogFlag" title='查看业务系统' width="600px" class="protocolAddDialog">
      <s-form :model="businnessForm" :rules="businnessRules" ref="businnessForm" label-width="120px">
        <s-form-item label='业务名称' prop='name'>
          <s-input v-model="businnessForm.name" :disabled="true"></s-input>
        </s-form-item>
        <s-form-item label='备注' prop='remark'>
          <s-input v-model="businnessForm.remark" type="textarea" :rows="4" :disabled="true"></s-input>
        </s-form-item>
      </s-form>
    </s-dialog>
    <!-- 编辑 -->
    <s-dialog v-model="editDialogFlag" title='编辑业务系统' width="600px" class="protocolAddDialog">
      <s-form :model="businnessForm" :rules="businnessRules" ref="businnessFormEdit" label-width="120px">
        <s-form-item label='业务名称' prop='name'>
          <s-input v-model.trim="businnessForm.name"></s-input>
        </s-form-item>
        <s-form-item label='备注' prop='remark'>
          <s-input v-model="businnessForm.remark" type="textarea" :rows="4"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editdialogOk('businnessFormEdit')">确定</s-button>
        <s-button type="cancel" @click="editDialogFlag=false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash'

  export default {
    data() {
      let checkRepeatName = (rule, value, callback) => {  // 校验重复名称
        if (this.editDialogFlag && value !== this.currentRow.name || this.addDialogFlag) {
            $axios.get(`/iamBusinessSystem/checkBusinessSystemName/${value}`).then((res) => {
              if (res.data.state === false) {
                callback(new Error(res.data.errormsg));
              } else {
                callback()
              }
            })
        } else {
          callback()
        }
      };
      return {
        addDialogFlag: false,
        eyeDialogFlag: false,
        editDialogFlag: false,
        businessList: [],
        businnessRules: {
          name: [
            Validaters.NotNull,
            Validaters.Max(50),
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          remark: [
            Validaters.Max(100)
          ]
        },
        businnessForm: {
          name: '',
          remark: ''
        },
        currentRow: null,
        deluuid: []
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      off() {
        this.addDialogFlag = false;
        this.businnessForm = {}
      },
      checking() {

      },
      searchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入关键字',
          searchProps: ['name', 'remark']
        }
      },
      selection(val) {
        val.forEach(item => {
          this.deluuid.push(item.uuid)
        })
      },
      axiosList() {
        $axios.get(`/iamBusinessSystem/list`).then(({data}) => {
          this.businessList = data;
        });
      },
      undialogOk() {
        this.addDialogFlag = false;
        this.businnessForm = {}
      },
      dialogOk(businnessForm) {
        this.$refs[businnessForm].validate((valid) => {
          if (valid) {
              $axios.post(`/iamBusinessSystem/add`, this.businnessForm).then(res => {
                if (res.data.state === true) {
                  this.addDialogFlag = false
                  this.$message({message: '添加成功', type: 'success'})
                  this.axiosList()
                  this.businnessForm = {}
                }
              })
            }
          })
        },
      add() {
        this.addDialogFlag = true;
        this.businnessForm = {
          name: '',
          remark: ''
        };
      },
      del() {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post(`/iamBusinessSystem/delete`, this.deluuid).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '删除成功!', type: 'success'});
              this.axiosList();
            } else {
              this.$message({message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      },
      eyeEdit(row) {
        this.eyeDialogFlag = true
        this.businnessForm = cloneDeep(row)
      },
      rowEdit(row) {
        this.businnessForm = cloneDeep(row);
        this.currentRow = row;
        this.editDialogFlag = true;
      },
      editdialogOk(businnessForm) {
        this.$refs[businnessForm].validate((valid) => {
          if (valid) {
              $axios.post(`/iamBusinessSystem/update`, this.businnessForm).then(res => {
                if (res.data.state === true) {
                  this.editDialogFlag = false
                  this.$message({message: '编辑成功', type: 'success'})
                  this.axiosList();
                }
              })
            }
          })
      },
      rowDel(row) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          this.deluuid.push(row.uuid)
          $axios.post(`/iamBusinessSystem/delete`, this.deluuid).then(({data}) => {
            if (data.state === true) {
              this.$message({message: '删除成功!', type: 'success'});
              this.axiosList();
            } else {
              this.$message({message: '删除失败!', type: 'error'});
            }
          });
        }).catch(() => {});
      }
    }
  }
</script>

<style lang="stylus">
/* .assetProtocol
    padding 15px
    .topRow
      margin-bottom -36px
    .protocolName
      color: #34c3f2
      cursor default
      &:hover
        text-decoration underline */
</style>

