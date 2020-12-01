<template>
  <div class="rules-db">
    <s-table-page
      :data="list"
      :header-actions="getHeadActionDef()"
      :row-actions="getRowActionDef()"
      :header-search="getSearchDef()"
      :row-class-name="tableRowClassName"
      @selection-change="handleDbListChange"
      key="rulesDb">
      <s-table-column type="selection" width="45"></s-table-column>
      <s-table-column label="规则名称" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column label="规则内容" prop="ruleDesc" show-overflow-tooltip></s-table-column>
      <s-table-column label="描述" prop="remarks" show-overflow-tooltip></s-table-column>
      <s-table-column label="禁止/启动" prop="isOpen">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isEnabled" size="small" @change="rowOpenChange(scope.row)" :active-value="1" :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加"
      width="800px"
      key="rulesDbAdd">
      <rules-db-add
        ref="add"
        @showRuleNew="showRuleNew"
        @ok="post"
        @setCurrentStep="setCurrentStep"
        :cmd-options="cmdOptions"
        :current-step="currentStep">
      </rules-db-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="next" v-show="currentStep < 3">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === 3">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!--添加规则-->
    <s-dialog
      v-model="bloomNew"
      v-if="bloomNew"
      title="添加">
      <rules-db-new ref="new" @newBeforeOk="newBeforeOk" :cmd-options="cmdOptions"></rules-db-new>
      <template slot="footer">
        <s-button @click="newOk">确定</s-button>
        <s-button type="cancel" @click="bloomNew = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看规则-->
    <s-dialog
      v-model="bloomView"
      v-if="bloomView"
      title="查看"
      width="800px">
      <rules-db-view ref="view" :data="currentRuleInfo" :cmd-options="cmdOptions"></rules-db-view>
    </s-dialog>
    <!--编辑规则-->
    <s-dialog
      v-model="bloomModify"
      v-if="bloomModify"
      title="编辑"
      width="800px"
      key="modifyDialog">
      <rules-db-add
        ref="modify"
        :data="currentRuleInfo"
        :cmd-options="cmdOptions"
        :current-step="currentStep"
        @showRuleNew="bloomNew = true"
        @ok="modifyPost"
        @setCurrentStep="setCurrentStep">
      </rules-db-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="editNext" v-show="currentStep < 3">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === 3">确定</s-button>
        <s-button type="cancel" @click="bloomModify = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import RulesDbAdd from './RulesDbAdd'
  import RulesDbNew from './RulesDbNew'
  import RulesDbView from './RulesDbView'
  import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {
      RulesDbAdd,
      RulesDbNew,
      RulesDbView
    },
    data() {
      return {
        list: [],
        bloomAdd: false,
        bloomNew: false,
        bloomView: false,
        bloomModify: false,
        currentRuleInfo: {},
        selectedRules: [],
        cmdOptions: [],
        currentStep: 0
      }
    },
    methods: {
      getList() {
        $axios.get('/auditPolicyRule/auditPolicyList/1').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.list = res.data;
            this.addIndex();
          }
        });
      },
      addIndex() {
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].index = (i + 1);
        }
      },
      getHeadActionDef() {
        let vm = this;
        return {
          width: 12,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              vm.currentRuleInfo = {};
              vm.currentStep = 0;
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
          }]
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'ruleDesc', 'remarks']
        }
      },
      getRowActionDef() {
        let vm = this;
        return [{
          icon: 'eye',
          name: '查看',
          click(row) {
            vm.view(row.uuid)
          }
        }, {
          icon: 'edit',
          name: '修改',
          click(row) {
            vm.currentStep = 0;
            vm.modify(row.uuid);
          }
        }, {
          icon: 'delete',
          name: '删除',
          click(row) {
            vm.del(row)
          }
        }]
      },
      addOk() {
        if (this.currentRuleInfo.uuid) {
          this.$refs.modify.beforeAdd();
        } else {
          this.$refs.add.beforeAdd();
        }
      },
      newOk() {
        this.$refs.new.beforeOk();
      },
      newBeforeOk(rule) {
        if (this.$refs.add) {
          this.$refs.add.typeArr = this.$refs.new.typeArr;
          this.$refs.add.logicArr = this.$refs.new.logicArr;
          this.$refs.add.compareArr = this.$refs.new.compareArr;
          this.$refs.add.addForm.auditPolicyRuleList.push(rule);
        } else {
          this.$refs.modify.typeArr = this.$refs.new.typeArr;
          this.$refs.modify.logicArr = this.$refs.new.logicArr;
          this.$refs.modify.compareArr = this.$refs.new.compareArr;
          this.$refs.modify.addForm.auditPolicyRuleList.push(rule);
        }
        this.bloomNew = false;
      },
      post(data) {
        data.objectType = 1;
        $axios.post('/auditPolicyRule/saveAuditPolicy', data, {
          data: [{name: data.name}],
          logTemplate: '添加|数据库审计规则(#name#)'
        }).then((res) => {
          if (res.data && res.data === true) {
            this.$message({type: 'success', message: '添加成功'});
            this.getList();
            this.bloomAdd = false;
          }
        });
      },
      modifyPost(data) {
        data.objectType = 1;
        $axios.post('/auditPolicyRule/uptAuditPolicy', data, {
          data: [{name: data.name}],
          logTemplate: '编辑|数据库审计规则(#name#)'
        }).then((res) => {
          if (res.data && res.data === true) {
            this.$message({type: 'success', message: '编辑成功'});
            this.getList();
            this.bloomModify = false;
          }
        });
      },
      rowOpenChange(row) {
        $axios.post(`/auditPolicyRule/uptAuditPolicyEnabledByUuid/${row.uuid}/${row.isEnabled}`).then((res) => {
          if (res.data && res.data === true) {
            this.$message({type: 'success', message: '设置成功'});
            this.getList();
          } else {
            this.$message({type: 'error', message: '设置失败'});
            row.isEnabled = !row.isEnabled;
          }
        });
      },
      view(uuid) {
        $axios.get(`/auditPolicyRule/getAuditPolicyByUuid/${uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.currentRuleInfo = res.data;
            this.bloomView = true;
          }
        });
      },
      modify(uuid) {
        $axios.get(`/auditPolicyRule/getAuditPolicyByUuid/${uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.currentRuleInfo = res.data;
            this.bloomModify = true;
          }
        });
      },
      del(row) {
        this.$confirm('确定删除该条数据？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/auditPolicyRule/deleteAuditPolicyByUuid/${row.uuid}`, {
            data: [{name: row.name}],
            logTemplate: '删除|数据库审计规则(#name#)'
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
          $axios.post('/auditPolicyRule/deleteAuditPolicyByUuidList/', data, {
            data: this.selectedRules,
            logTemplate: '删除|数据库审计规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除成功'});
              this.getList();
            }
          });
        }).catch(() => {});
      },
      tableRowClassName(row) {
        if (row.isBuiltin === 1) {
          return 'is-builtin';
        }
      },
      handleDbListChange(val) {
        this.selectedRules = val;
      },
      showRuleNew() {
        this.bloomNew = true;
      },
      getCmdOptions() {
        $axios.get('/sessionCmd/getObjectListByTableName/t_dic_dbaudit_dboperation').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.cmdOptions = res.data;
          }
        });
      },
      setCurrentStep(val) {
        this.currentStep = val;
      },
      next () {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/auditPolicyRule/judgeAuditName', {
            name: that.$refs.add.addForm.name,
            objectType: 1
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
          $axios.post('/auditPolicyRule/judgeAuditName', {
            name: that.$refs.modify.addForm.name,
            objectType: 1,
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
    mounted() {
      this.getList();
      this.getCmdOptions();
    }
  }
</script>

<style>
  .rules-db .s-steps {
    margin-bottom: 20px;
  }
</style>
