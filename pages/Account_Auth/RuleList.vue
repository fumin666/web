<template>
  <section class="auth-rule-list">
    <s-table-page
      class="luck-table"
      :data="ruleListData"
      :header-actions="getActionsDef()"
      :header-search="getSearchDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectChange"
      actions-col-width="100">
      <s-table-column type="selection" width="45" :selectable="isSelectable"></s-table-column>
      <s-table-column label="规则名称" prop="ruleName" show-overflow-tooltip></s-table-column>
      <s-table-column label="规则类型" prop="ipTypeStr"></s-table-column>
      <s-table-column label="IP规则" prop="ipRule"></s-table-column>
      <s-table-column label="时间范围" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.startTime}}至{{scope.row.endTime}}
        </template>
      </s-table-column>
    </s-table-page>
    <!--新增-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      width="600px"
      title="添加">
      <rule-add-dialog ref="addRule"></rule-add-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk" :disabled="saveLoading">保存</s-button>
        <s-button type="cancel" @click="bloomAdd = false">取消</s-button>
      </template>
    </s-dialog>
    <!--修改-->
    <s-dialog
      v-model="bloomEdit"
      v-if="bloomEdit"
      width="700px"
      title="修改">
      <rule-add-dialog ref="editRule" :data="editRow"></rule-add-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk" :disabled="editLoading">保存</s-button>
        <s-button type="cancel" @click="bloomEdit = false">取消</s-button>
      </template>
    </s-dialog>
    <!--关联授权清单-->
    <s-dialog
      v-model="bloomLink"
      v-if="bloomLink"
      title="关联授权清单">
      <rule-link-auth ref="linkRule" :data="linkRow" @configA="bloomCfg = true"></rule-link-auth>
    </s-dialog>
    <!--设置关联-->
    <s-dialog
      v-model="bloomCfg"
      v-if="bloomCfg"
      title="关联授权清单"
      width="700px">
      <rule-cfg ref="cfgRule" :linkRow="linkRow"></rule-cfg>
      <template slot="footer" class="dialog-footer">
        <s-button @click="linkOk">保存</s-button>
        <s-button type="cancel" @click="bloomCfg = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看关联-->
    <s-dialog
      v-model="accessViewFlag"
      v-if="accessViewFlag"
      title="查看"
      width="700px">
      <s-scrollbar wrap-class="default-dialog-scroll">
        <access-view :rowData="viewRow"></access-view>
      </s-scrollbar>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import RuleAddDialog from './RuleAdd'
  import RuleLinkAuth from './RuleLinkAuth'
  import RuleCfg from './RuleCfg'
  import accessView from './AccessView'
  import {batchUuid} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        ruleListData: [],
        accessViewFlag: false,
        bloomAdd: false,
        bloomEdit: false,
        bloomLink: false,
        bloomCfg: false,
        delList: [],
        editRow: {},
        linkRow: {},
        viewRow: {},
        linkRowIdx: 0,
        saveLoading: false,
        editLoading: false
      }
    },
    components: {
      RuleAddDialog,
      RuleLinkAuth,
      RuleCfg,
      accessView
    },
    methods: {
      getRowActionsDef() {
        let vm = this;
        return [{
          icon: 'eye',
          name: '查看',
          click(row) {
            vm.accessViewFlag = true;
            vm.viewRow = row;
          }
        }, {
          icon: 'edit',
          name: '编辑',
          click(row) {
            vm.bloomEdit = true;
            vm.editRow = row;
          }
        }, {
          icon: 'link',
          name: '关联授权清单',
          click(row) {
            // vm.bloomLink = true;
            // vm.linkRow = row;
            // vm.linkRowIdx = vm.ruleListData.indexOf(row);
            vm.bloomCfg = true;
            vm.linkRow = row;
          }
        }, {
          icon: 'delete',
          name: '删除',
          show: this.showDeleteBtn,
          click(row) {
            vm.$confirm('确定删除该条数据？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              icon: 'warning'
            }).then(() => {
              $axios.get(`/loginRule/deleteLoginRuleInfo/${row.uuid}`, {
                data: [{ruleName: row.ruleName}],
                logTemplate: '删除|访问规则管理>访问规则(#ruleName#)'
              }).then((res) => {
                if (res.data && res.data === 'success') {
                  vm.$message({icon: 'success', message: '删除成功'});
                  vm.getList();
                }
              });
            }).catch(() => {});
          }
        }]
      },
      // 是否显示删除按钮
      showDeleteBtn(row) {
        return !(row.authInfoList.length > 0 || row.isDefault === 1);
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 6,
          placeholder: '可按规则名称、规则类型、ip规则查询',
          searchProps: ['ruleName', 'ipRule', 'ipTypeStr']
        }
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        (row.authInfoList.length > 0 || row.isDefault === 1) ? flag = false : flag = true
        return flag
      },
      getList() {
        $axios.post('/loginRule/getLoginRuleInfoList').then((res) => {
          if (res.data && res.data.ruleInfoList) {
            for (let i = 0; i < res.data.ruleInfoList.length; i++) {
              if (res.data.ruleInfoList[i].ipType === 0) {
                res.data.ruleInfoList[i].ipTypeStr = '禁止';
              } else {
                res.data.ruleInfoList[i].ipTypeStr = '允许';
              }
              if (res.data.ruleInfoList[i].isForever === 1) {
                res.data.ruleInfoList[i].endTime = '永不结束';
              }
            }
            this.ruleListData = res.data.ruleInfoList;
            if (this.bloomLink) {
              this.linkRow = this.ruleListData[this.linkRowIdx];
            }
          }
        });
      },
      addOk() {
        let vm = this;
        this.$refs['addRule'].$refs['addForm'].validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            $axios.post('/loginRule/checkRuleName', {ruleName: vm.$refs['addRule'].ruleAddForm.ruleName}).then((ress) => {
              if (ress.data && ress.data.errorReason) {
                vm.$message({icon: 'error', message: ress.data.errorReason});
                return false;
              } else {
                let data = vm.$refs['addRule'].ruleAddForm;
                delete data._starthour;
                delete data._endhour;
                delete data._weeks;
                $axios.post('loginRule/saveLoginRuleInfo', data, {
                  data: [{ruleName: vm.$refs['addRule'].ruleAddForm.ruleName}],
                  logTemplate: '添加|访问规则管理>访问规则(#ruleName#)'
                }).then((res) => {
                  if (res.data && res.data === 'success') {
                    vm.$message({icon: 'success', message: '添加访问规则成功'});
                    vm.getList();
                    vm.bloomAdd = false;
                  }
                  this.saveLoading = false;
                });
              }
            });
          } else {
            this.saveLoading = false;
            return false;
          }
        });
      },
      editOk() {
        this.editLoading = true;
        $axios.post('/loginRule/checkRuleName', {ruleName: this.$refs['editRule'].ruleAddForm.ruleName, uuid: this.$refs['editRule'].ruleAddForm.uuid}).then((ress) => {
          if (ress.data && ress.data.errorReason) {
            this.$message({icon: 'error', message: ress.data.errorReason});
            return false;
          } else {
            this.$refs['editRule'].$refs['addForm'].validate((valid) => {
              if (valid) {
                let _data = this.$refs['editRule'].ruleAddForm;
                delete _data._starthour;
                delete _data._endhour;
                delete _data._weeks;
                _data.uuid = this.editRow.uuid;
                $axios.post('/loginRule/updateLoginRuleInfo', _data, {
                  data: [{ruleName: this.$refs['editRule'].ruleAddForm.ruleName}],
                  logTemplate: '编辑|访问规则管理>访问规则(#ruleName#)'
                }).then((res) => {
                  if (res.data && res.data === 'success') {
                    this.$message({icon: 'success', message: '修改访问规则成功'});
                    this.getList();
                    this.bloomEdit = false;
                    this.editLoading = false;
                  }
                });
              } else {
                this.editLoading = false;
                return false;
              }
            });
          }
        });
      },
      linkOk() {
        let authList = this.$refs.cfgRule.selectedAlarm;
        let ruleUuid = this.linkRow.uuid;
        let _data = [];
        for (let i = 0; i < authList.length; i++) {
          _data.push({
            ruleUuid: ruleUuid,
            authUuid: authList[i].uuid
          });
        }
        let logData = []
        if (authList.length === 0) {
          _data.push({
            ruleUuid: ruleUuid
          });
          logData = [{ruleName: this.linkRow.ruleName, authName: null}]
        } else {
          logData = authList.map(item => {
            return {ruleName: this.linkRow.ruleName, authName: item.authName}
          })
        }
        $axios.post('/loginRule/batchSaveLoginRuleAuthinfoList', _data, {
          data: logData,
          logTemplate: '关联|访问规则管理>访问规则(#ruleName#)关联授权策略(#authName#)'
        }).then((res) => {
          if (res.data && res.data === true) {
            this.$message({icon: 'success', message: '关联授权清单成功'});
            this.bloomCfg = false;
            this.getList();
            Bus.$emit('getAuthList');
          }
        });
      },
      handleSelectChange(rows) {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].authInfoList.length === 0 && rows[i].isDefault !== 1) {
            this.delList.push(rows[i]);
          }
        }
        if (rows.length === 0) {
          this.delList = [];
        }
      },
      funDelList() {
        if (this.delList.length > 0) {
          let vm = this;
          this.$confirm('确定删除选中的数据？', '提示', {
            confirmButonText: '确定',
            cancelButtonText: '取消',
            icon: 'warning'
          }).then(() => {
            let _data = batchUuid('uuid', vm.delList);
            let logData = vm.delList.map(item => {
              return {ruleName: item.ruleName}
            })
            $axios.post('/loginRule/batchDelLoginRuleInfo', _data, {
              data: logData,
              logTemplate: '删除|访问规则管理>访问规则(#ruleName#)'
            }).then((res) => {
              if (res.data && res.data === 'success') {
                vm.$message({icon: 'success', message: '删除成功'});
                vm.getList();
              }
            });
          }).catch(() => {});
        } else {
          this.$message({icon: 'warning', message: '请选择要删除的数据'});
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
              vm.bloomAdd = true;
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              vm.funDelList();
            }
          }]
        }
      }
    },
    created() {
      this.getList();
      Bus.$on('getRuleList', () => {
        this.getList();
      });
    }
  }
</script>

<style>
  .auth-rule-list .luck-table .s-table-header-wrapper>table {
    width: 100% !important;
  }
</style>
