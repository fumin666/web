/**
 * @author fumin
 * @date 2019/7/18
 * @Description: 【事件中心】→【规则配置】→【运维审计规则】
*/
<template>
  <div class="rules-operation">
    <s-table-page
      :data="list"
      :header-actions="getActionsDef()"
      @selection-change="handleOListChange"
      :header-search="getSearchDef()"
      key="rulesOpe">
      <s-table-column type="selection" width="45" :selectable="getDisabled"></s-table-column>
      <s-table-column label="规则名称" prop="bwName" show-overflow-tooltip></s-table-column>
      <s-table-column label="名单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{type[scope.row.bwType]}}
        </template>
      </s-table-column>
      <s-table-column label="描述" prop="remark" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="view(scope.row)"> </i>
          <i class="iconfont icon-edit" title="编辑" v-if="scope.row.bwType === 3" @click="edit(scope.row)"> </i>
          <i class="iconfont icon-edit" title="修改" v-if="scope.row.bwType !== 3" @click="modify(scope.row)"> </i>
          <i class="iconfont icon-delete" title="删除" v-if="scope.row.bwType !== 3" @click="del(scope.row)"> </i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加"
      width="900px"
      key="rulesOperationAdd">
      <rules-operation-add
        ref="add"
        @showCmd="showCmdDialog"
        @ok="post"
        @setCurrentStep="setCurrentStep"
        @typeChange="typeChange"
        :current-step="currentStep">
      </rules-operation-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="next" v-show="currentStep < typePageMax">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === typePageMax">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!--命令-->
    <s-dialog
      v-model="bloomNew"
      v-if="bloomNew"
      title="命令"
      width="900px">
      <rules-operation-new ref="new" :selectedData="selectCmd" :checkKeys="checkKeys" :mode="mode"></rules-operation-new>
      <template slot="footer">
        <s-button @click="newOk">确定</s-button>
        <s-button type="cancel" @click="bloomNew = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="bloomModify"
      v-if="bloomModify"
      title="编辑"
      width="900px">
      <rules-operation-add
        ref="modify"
        :data="currentRule"
        :current-step="currentStep"
        @showCmd="showCmdDialog"
        @modifyOk="modifyOk"
        @setCurrentStep="setCurrentStep"
        @typeChange="typeChange">
      </rules-operation-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="editNext" v-show="currentStep < typePageMax">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === typePageMax" :disabled='flag'>确定</s-button>
        <s-button type="cancel" @click="bloomModify = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="importantEdit"
      v-if="importantEdit"
      title="编辑"
      width="800px">
      <s-form :model="form" :rules="ruleForm">
        <s-form-item label="应用规则的资产重要程度" prop="importances">
          <s-checkbox-group v-model="form.importances">
            <s-checkbox :label="2">很高</s-checkbox>
            <s-checkbox :label="3">高</s-checkbox>
            <s-checkbox :label="4">中等</s-checkbox>
            <s-checkbox :label="5">低</s-checkbox>
            <s-checkbox :label="6">很低</s-checkbox>
          </s-checkbox-group>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="importantSave(form)">保存</s-button>
        <s-button type="cancel" @click="importantEdit = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看-->
    <s-dialog
      v-model="bloomView"
      v-if="bloomView"
      title="查看"
      width="800px">
      <rules-operation-view ref="view" :data="currentRule"></rules-operation-view>
    </s-dialog>
    <s-dialog
      v-model="importantView"
      v-if="importantView"
      title="查看"
      width="800px">
      <important-operation-view ref="view" :data="currentRow"></important-operation-view>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import RulesOperationAdd from './RulesOperationAdd'
  import RulesOperationNew from './RulesOperationNew'
  import RulesOperationView from './RulesOperationView'
  import ImportantOperationView from './ImportantOperationView'
  import {batchUuid} from 'sunflower-common-utils'
  export default {
    components: {

      RulesOperationAdd,
      RulesOperationNew,
      RulesOperationView,
      ImportantOperationView
    },
    data() {
      return {
        list: [],
        checkKeys: [],
        flag: false,
        bloomAdd: false,
        bloomNew: false,
        bloomModify: false,
        bloomView: false,
        importantView: false,
        importantEdit: false,
        importancesObj: {},
        type: ['', '白名单', '黑名单', '登录重要资产'],
        selectedRules: [],
        form: {
          importances: []
        },
        ruleForm: {
          importances: [{type: 'array', required: true, message: '备注内容不能为空', trigger: 'blur'}]
        },
        currentRule: null,
        currentStep: 0,
        typePageMax: 2,
        selectCmd: [],
        mode: 0
      }
    },
    watch: {
      bloomAdd: function (val) {
        if (val === false) {
          this.typePageMax = 2;
          this.currentStep = 0;
        }
      },
      bloomModify: function (val) {
        if (val === false) {
          this.typePageMax = 2;
          this.currentStep = 0;
        }
      }
    },
    methods: {
      getDisabled(row) {
        if (row.bwType === 3) {
          return false
        } else {
          return true
        }
      },
      showCmdDialog(selectCmd, mode) {
        this.selectCmd = selectCmd;
        this.mode = mode;
        this.bloomNew = true;
      },
      getList() {
        $axios.post('/bwInfo/bwInfoList', {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.list = res.data;
            this.form.importances = res.data[0].importanceList
            this.addIndex();
          }
        });
      },
      addIndex() {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].index = (i + 1);
        }
      },
      getActionsDef() {
        let vm = this;
        return {
          width: 12,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              vm.currentRule = null;
              vm.currentStep = 0;
              vm.checkKeys = []
              vm.bloomAdd = true;
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              if (vm.selectedRules.length > 0) {
                vm.batchDel();
              } else {
                vm.$message({type: 'warning', message: '请选择要删除的数据'});
              }
            }
          }/*, {
            name: '导入',
            icon: 'import',
            click() {}
          }, {
            name: '导出',
            icon: 'export',
            click() {}
          } */]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入查询内容',
          searchProps: ['bwName', 'remark']
        }
      },
      addOk() {
        if (this.currentRule) {
          this.$refs.modify.beforeAdd();
        } else {
          this.$refs.add.beforeAdd();
        }
      },
      newOk() {
        let newArr = this.$refs.new.selectedList;
        let currentCmdMode = '';
        let oldArr = [];
        if (this.currentRule) {
          currentCmdMode = this.$refs.modify.currentCmdMode;
          oldArr = this.$refs.modify.cmdList;
          oldArr = oldArr.filter((item) => {
            return item.cmdType !== currentCmdMode;
          });
          for (let i = 0; i < newArr.length; i++) {
            newArr[i].cmdType = currentCmdMode;
            let tmp = true;
            for (let j = 0; j < oldArr.length; j++) {
              if (newArr[i].uuid === oldArr[j].uuid) {
                oldArr.splice(j, 1, newArr[i]);
                tmp = false;
                break;
              }
            }
            if (tmp) {
              oldArr.push(newArr[i]);
            }
          }
          this.$refs.modify.cmdList = oldArr;
        } else {
          currentCmdMode = this.$refs.add.currentCmdMode;
          oldArr = this.$refs.add.cmdList;
          oldArr = oldArr.filter((item) => {
            return item.cmdType !== currentCmdMode;
          });
          for (var i = 0; i < newArr.length; i++) {
            newArr[i].cmdType = currentCmdMode;
            var tmp = true;
            for (var j = 0; j < oldArr.length; j++) {
              if (newArr[i].uuid === oldArr[j].uuid) {
                oldArr.splice(j, 1, newArr[i]);
                tmp = false;
                break;
              }
            }
            if (tmp) {
              oldArr.push(newArr[i]);
            }
          }
          this.$refs.add.cmdList = oldArr;
        }
        this.bloomNew = false;
      },
      post(data) {
        $axios.post('/bwInfo/saveBwInfo', data, {
          data: [{name: data.bwName}],
          logTemplate: '添加|运维审计规则(#name#)'
        }).then((res) => {
          this.flag = true
          console.log(this.flag)
          if (res.data && res.data === true) {
            this.flag = false
            console.log(this.flag)
            this.$message({type: 'success', message: '添加成功'});
            this.getList();
            this.bloomAdd = false;
          } else {
            this.$message({type: 'error', message: '添加失败'});
          }
        });
      },
      modifyOk(data) {
        $axios.post('/bwInfo/uptBwInfo', data, {
          data: [{name: data.bwName}],
          logTemplate: '编辑|运维审计规则(#name#)'
        }).then((res) => {
          if (res.data && res.data === true) {
            this.$message({type: 'success', message: '编辑成功'});
            this.getList();
            this.bloomModify = false;
          } else {
            this.$message({type: 'error', message: '编辑失败'});
          }
        });
      },
      del(row) {
        this.$confirm('此操作将永久删除该条数据，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [row.uuid];
          $axios.post('/bwInfo/deleteBwInfos/', data, {
            data: [{name: row.bwName}],
            logTemplate: '删除|运维审计规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除成功'});
              this.getList();
            }
          });
        }).catch(() => {});
      },
      batchDel() {
        this.$confirm('此操作将永久删除选中的数据，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          for (let i = 0; i < this.selectedRules.length; i++) {
            if (this.selectedRules[i].isBuiltin === 1) {
              this.selectedRules.splice(i, 1);
              i--;
            }
          }
          let data = batchUuid('uuid', this.selectedRules);
          $axios.post('/bwInfo/deleteBwInfos/', data, {
            data: this.selectedRules,
            logTemplate: '删除|运维审计规则(#bwName#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除成功'});
              this.getList();
            }
          });
        }).catch(() => {});
      },
      handleOListChange(val) {
        this.selectedRules = val;
      },
      modify(row) {
        $axios.get(`/bwInfo/getBwInfoByUuid/${row.uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.currentRule = res.data;
            this.checkKeys = res.data.cmdTemplateUuidList
            this.bloomModify = true;
          }
        });
      },
      edit(row) {
        this.importancesObj = row
        this.importantEdit = true;
      },
      importantSave(form) {
        $axios.post('/bwInfo/updateMajorAssetValue', {importances: form.importances, uuid: this.importancesObj.uuid}, {
          data: [this.importancesObj],
          logTemplate: '编辑|运维审计规则(#name#)'
        }).then((res) => {
          if (res.data && res.data.state === true) {
            this.$message({type: 'success', message: '编辑成功'});
            this.importantEdit = false;
            this.getList();
          } else {
            this.$message({type: 'error', message: '编辑失败'});
          }
        });
      },
      view(row) {
        if (row.bwType === 3) {
          $axios.get(`/bwInfo/getMajorAssetStraInfo/${row.uuid}`).then((res) => {
            if (res.data && typeof res.data === 'object') {
              this.currentRow = res.data;
              this.importantView = true;
            }
          });
        } else {
          $axios.get(`/bwInfo/getBwInfoByUuid/${row.uuid}`).then((res) => {
            if (res.data && typeof res.data === 'object') {
              this.currentRule = res.data;
              this.bloomView = true;
            }
          });
        }
      },
      setCurrentStep(val) {
        this.currentStep = val;
      },
      typeChange(val) {
        if (val === 1) { // 白名单
          this.typePageMax = 2;
        } else { // 黑名单
          this.typePageMax = 3;
        }
      },
      next () {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/bwInfo/judgeBwinfoName', {
            bwName: that.$refs.add.addForm.bwName
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep ++;
            }
          });
        } else {
          that.currentStep ++;
        }
      },
      editNext () {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/bwInfo/judgeBwinfoName', {
            bwName: that.$refs.modify.addForm.bwName,
            uuid: that.$refs.modify.addForm.uuid
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep ++;
            }
          });
        } else {
          that.currentStep ++;
        }
      }
    },
    created() {
      this.getList();
    }
  }
</script>
