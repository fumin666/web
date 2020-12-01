<template>
  <div class="rules-monitor">
    <div>
      <s-form
        class="search_form" style="margin:10px 0" label-width='75px'
        ref="searchForm" :model="searchForm" :rules="searchFormRules" :inline="true">
        <div>
          <s-form-item label="规则名称：">
            <s-input v-model="searchForm.ruleName" @keyup.enter.native="searchAction"></s-input>
          </s-form-item>
          <s-form-item label="规则类型：">
            <s-select v-model="searchForm.ruleType" @change="changeRoleType" clearable>
              <s-option label="监控项" :value="1"></s-option>
              <s-option label="PING" :value="2"></s-option>
              <s-option label="凭证检测" :value="3"></s-option>
              <s-option label="运行时间" :value="4"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="资产类型：" v-if="searchForm.ruleType===1">
            <input-tree v-model="searchForm.ciTypeUuid" name="uuid" :data="searchOptions"
                        :props="defaultProps" :hasDelIcon="true"></input-tree>
          </s-form-item>
          <s-form-item label="CI类型：" v-if="searchForm.ruleType===1">
            <s-select v-model="searchForm.itemType" clearable>
              <s-option v-for="item in ciTypeList" :label="item.name" :value="item.value" :key="item.value"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="资产名称：">
            <s-input v-model="searchForm.itcompName" @keyup.enter.native="searchAction"></s-input>
          </s-form-item>
          <s-form-item label="IP地址：" prop="ip">
            <s-input v-model="searchForm.ip" @keyup.enter.native="searchAction"></s-input>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button title="查询" icon='magnifier' @click="searchAction">查询</s-button>
        </div>
      </s-form>
    </div>
    <s-table-page
      :data="list"
      :header-actions="getActionsDef()"
      :header-search="{show:false}"
      @selection-change="handleMListChange"
      key="rulesMonitor">
      <s-table-column type="selection" width="45" :selectable="isSelectable"></s-table-column>
      <s-table-column label="规则名称" prop="name" show-overflow-tooltip></s-table-column>
      <s-table-column label="规则类型" prop="typeStr" show-overflow-tooltip></s-table-column>
      <s-table-column label="CI类型" prop="miTypeName" show-overflow-tooltip></s-table-column>
      <s-table-column label="描述" prop="decription" show-overflow-tooltip></s-table-column>
      <s-table-column label="禁止/启动" prop="isOpen">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isOpen" size="small" @change="rowOpenChange(scope.row)" :active-value="1"
                    :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="view(scope.row.uuid)" title="查看"></i>
          <i class="iconfont icon-edit" @click="currentStep=0; modify(scope.row)" title="修改"></i>
          <i class="iconfont icon-delete" v-if="scope.row.isBuiltin === 1" @click="del(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      title="添加"
      width="800px"
      key="rulesMonitorAdd">
      <rules-monitor-add
        ref="add"
        @showRulesMonitorNew="showRulesMonitorNew"
        @modifyGroup="modifyGroup"
        @setCurrentStep="setCurrentStep"
        :current-step="currentStep">
      </rules-monitor-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="next" v-show="currentStep < 3">下一步</s-button>
        <s-button @click="addOk" v-show="currentStep === 3">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!--添加规则组-->
    <s-dialog
      v-model="bloomNew"
      v-if="bloomNew"
      title="增加规则"
      width="800px">
      <rules-monitor-new :data="currentMiType" :device="currentDeviceArr" ref="new"
                         :currentType="currentType"></rules-monitor-new>
      <template slot="footer">
        <s-button @click="newRuleOk">确定</s-button>
        <s-button type="cancel" @click="bloomNew = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑规则组-->
    <s-dialog
      v-model="bloomNewModify"
      v-if="bloomNewModify"
      title="编辑规则"
      width="800px">
      <rules-monitor-new ref="newModify" :data="currentMiType" :device="currentDeviceArr" :currentRow="currentRow"
                         :currentType="currentType"
                         :group="currentGroup"></rules-monitor-new>
      <template slot="footer">
        <s-button @click="modifyGroupOk">确定</s-button>
        <s-button type="cancel" @click="bloomNewModify = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑规则-->
    <s-dialog
      v-model="bloomModify"
      v-if="bloomModify"
      title="修改规则"
      width="800px">
      <rules-monitor-add
        ref="modify"
        :data="currentRuleInfo"
        :current-step="currentStep"
        @showRulesMonitorNew="showRulesMonitorNew"
        @modifyGroup="modifyGroup"
        @setCurrentStep="setCurrentStep">
      </rules-monitor-add>
      <template slot="footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="editNext" v-show="currentStep < 3">下一步</s-button>
        <s-button @click="modifyRuleOk" v-show="currentStep === 3">确定</s-button>
        <s-button type="cancel" @click="bloomModify = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!--查看规则-->
    <s-dialog
      v-model="bloomView"
      v-if="bloomView"
      title="查看规则"
      width="800px">
      <rules-monitor-view ref="view" :data="currentRuleInfo"></rules-monitor-view>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import inputTree from '@/components/inputTree/InputTree';
  import RulesMonitorAdd from './RulesMonitorAdd'
  import RulesMonitorNew from './RulesMonitorNew'
  import RulesMonitorView from './RulesMonitorView'
  import {batchUuid} from 'sunflower-common-utils'
  // import {Validaters} from 'sunflower-common-utils'

  export default {
    components: {
      inputTree,
      RulesMonitorAdd,
      RulesMonitorNew,
      RulesMonitorView
    },
    data() {
      return {
        searchOptions: [],
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        ciTypeList: [],
        searchForm: {
          ruleName: '',
          ruleType: null,
          itemType: '',
          ciTypeUuid: '',
          itcompName: '',
          ip: ''
        },
        searchFormRules: {
          ip: []
        },
        list: [],
        bloomAdd: false,
        bloomNew: false,
        bloomNewModify: false,
        bloomModify: false,
        bloomView: false,
        selectedRules: [],
        currentDeviceArr: [],
        currentType: '',
        currentMiType: '',
        currentRuleInfo: {},
        currentGroup: '',
        currentStep: 0,
        currentRow: {}
      }
    },
    watch: {
      'searchForm.ciTypeUuid': {
        deep: true,
        handler(val) {
          this.ciTypeList = [];
          this.searchForm.itemType = '';
          $axios.get(`/thresholdInfo/getMiTypeSelectByMonitorCiTypeUuid/${val}`).then(({data}) => {
            if (data && data instanceof Array) {
              this.ciTypeList = data;
            }
          });
        }
      }
    },
    methods: {
      clearTree(val) {
        this.searchForm.ciTypeUuid = val
      },
      // 规则类型改变
      changeRoleType(val) {
        if (val === 2) {
          this.searchForm.itemType = '';
        }
      },
      // 顶部搜索功能-搜索查询
      searchAction() {
        let form = this.searchForm;
        if (form.roleType === 1 && (form.itcompName || form.ip)) {
          if (!form.ciTypeUuid) this.$message.warning('请选择资产类型！');
          else if (!form.itemType) this.$message.warning('请选择CI类型！');
          else {
            this.searchPost();
          }
        } else {
          this.searchPost();
        }
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        row.isBuiltin === 0 ? flag = false : flag = true
        return flag
      },
      // 查询请求
      searchPost() {
        $axios.post('/thresholdInfo/list', this.searchForm).then(({data}) => {
          if (data && data instanceof Array) {
            this.list = data;
          } else {
            this.$message.error('查询失败，请重试！');
          }
        });
      },
      rowOpenChange(row) {
        $axios.post(`/thresholdInfo/updateIsOpen/${row.uuid}/${row.isOpen}`).then((res) => {
          if (res.data && res.data === true) {
            this.$message({type: 'success', message: '设置成功'});
            this.searchPost();
          } else {
            this.$message({type: 'error', message: '设置失败'});
            row.isOpen = !row.isOpen;
          }
        });
      },
      addOk() {
        let tmp = this.$refs.add;
        this.validData(tmp, () => {
          $axios.post('/thresholdInfo/save', tmp.addForm, {
            data: [{name: tmp.addForm.name}],
            logTemplate: '添加|监控规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '添加监控规则成功！'});
              this.searchPost();
              this.bloomAdd = false;
            }
          });
        });
      },
      getActionsDef() {
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
                vm.$message({type: 'warning', message: '请选择要删除的数据！'});
              }
            }
          }]
        }
      },
      batchDel() {
        this.$confirm('此操作将永久删除选中的数据，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          let data = batchUuid('uuid', this.selectedRules);
          $axios.post('/thresholdInfo/delThresholdInfoByUuidArray/', data, {
            data: this.selectedRules,
            logTemplate: '删除|监控规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除成功！'});
              this.searchPost();
            }
          });
        }).catch(() => {
        });
      },
      del(row) {
        this.$confirm('此操作将永久删除该条数据，确定继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [row.uuid];
          $axios.post('/thresholdInfo/delThresholdInfoByUuidArray/', data, {
            data: [{name: row.name}],
            logTemplate: '删除|监控规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除成功！'});
              this.searchPost();
            }
          });
        }).catch(() => {
        });
      },
      // getRowActionDef() {
      //   let vm = this;
      //   return [{
      //     icon: 'eye',
      //     name: '查看',
      //     click(row) {
      //       vm.view(row.uuid)
      //     }
      //   }, {
      //     type: 'pencil',
      //     name: '修改',
      //     click(row) {
      //       vm.currentStep = 0;
      //       vm.modify(row);
      //     }
      //   }, {
      //     icon: 'delete',
      //     name: '删除',
      //     click(row) {
      //       vm.del(row)
      //     }
      //   }]
      // },
      newRuleOk() {
        let example = this.$refs.new.example;
        let desc = this.$refs.new.exampleDesc;
        let rule = this.$refs.new.ruleInfo;
        if (example.length > 0) {
          if (example.length > 255) {
            this.$message({type: 'error', message: '事件格式不能超过255个字符！'});
            return false;
          } else {
            this.bloomNew = false;
            if (this.currentRuleInfo.uuid) {
              this.$refs.modify.setGroupList(example, desc, rule);
            } else {
              this.$refs.add.setGroupList(example, desc, rule);
            }
          }
        } else {
          this.$message({type: 'error', message: '请生成事件模板！'});
        }
      },
      showRulesMonitorNew(val, arr, type) {
        this.currentMiType = val;
        this.currentDeviceArr = arr;
        this.currentType = type;
        this.bloomNew = true;
      },
      handleMListChange(val) {
        this.selectedRules = val;
      },
      modify(row) {
        this.currentRow = row;
        this.currentType = row.type;
        $axios.get(`/thresholdInfo/getThresholdInfoByUuid/${row.uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.currentRuleInfo = res.data;
            this.currentMiType = res.data.miType || '';
            this.bloomModify = true;
          }
        });
      },
      modifyRuleOk() {
        let tmp = this.$refs.modify;
        this.validData(tmp, () => {
          $axios.post('/thresholdInfo/upt/', tmp.addForm, {
            data: [{name: tmp.addForm.name}],
            logTemplate: '编辑|监控规则(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '更新成功！'});
              this.searchPost();
              this.bloomModify = false;
            }
          });
        });
      },
      modifyGroup(row) {
        this.currentGroup = row;
        this.bloomNewModify = true;
      },
      modifyGroupOk() {
        let example = this.$refs.newModify.example;
        let desc = this.$refs.newModify.exampleDesc;
        let rule = this.$refs.newModify.ruleInfo;
        if (example.length > 0) {
          this.bloomNewModify = false;
          if (this.currentRuleInfo.uuid) {
            this.$refs.modify.setGroupList(example, desc, rule);
          } else {
            this.$refs.add.setGroupList(example, desc, rule);
          }
        } else {
          this.$message({type: 'error', message: '请生成事件模板！'});
        }
      },
      view(uuid) {
        $axios.get(`/thresholdInfo/getThresholdInfoByUuid/${uuid}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.currentRuleInfo = res.data;
            this.bloomView = true;
          }
        });
      },
      validData(page, callback) {
        let tmp = page.addForm;
        page.$refs.propForm.validate((valid) => {
          if (valid) {
            if ((tmp.type === 1 && tmp.ciType && tmp.miType) || tmp.type === 2 || tmp.type === 3 || tmp.type === 4) {
              if (tmp.groupList.length === 0) {
                this.currentStep = 1;
                this.$message({type: 'error', message: '请添加规则组！'});
                return false;
              } else {
                for (let i = 0; i < tmp.groupList.length; i++) {
                  if (tmp.groupList[i].isNeedSend) {
                    if (tmp.isNeedSend) {
                      break;
                    } else {
                      this.currentStep = 3;
                      this.$message({type: 'error', message: '请开启事件告警！'});
                      return false;
                    }
                  }
                }
                if (tmp.isNeedSend) {
                  if (page.selectedAlarm.length === 0) {
                    this.$message({type: 'error', message: '请至少选择一项告警方式！'});
                    return false;
                  } else {
                    tmp.infoSendUuids = batchUuid('uuid', page.selectedAlarm).toString();
                  }
                  let __tmp = tmp.groupList.some(function (item) {
                    return item.isNeedSend === 1;
                  });
                  if (!__tmp) {
                    this.currentStep = 1;
                    this.$message({type: 'error', message: '请开启事件告警！'});
                    return false;
                  }
                }
                // 没有选择资产的规则是不能建立成功的 错误#56611
                if (page.selectedDeviceList.length > 0) {
                  if (tmp.type === 1) {
                    tmp.monitorItemUuids = batchUuid('uuid', page.selectedDeviceList).toString();
                  } else {
                    tmp.assetUuids = batchUuid('uuid', page.selectedDeviceList).toString();
                  }
                } else {
                  this.currentStep = 0;
                  this.$message({type: 'error', message: '请至少选择一项资产！'});
                  return false;
                }
                if (!tmp.isNeedSend) {
                  tmp.infoSendUuids = '';
                }
                callback();
              }
            } else {
              this.$message({type: 'error', message: '请选择监控项！'});
              this.currentStep = 0;
              return false;
            }
          } else {
            this.currentStep = 0;
            return false;
          }
        });
      },
      setCurrentStep(val) {
        this.currentStep = val;
      },
      next() {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/thresholdInfo/judgeThresholdName', {
            name: that.$refs.add.addForm.name
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep++;
            }
          });
        } else {
          that.currentStep++;
        }
      },
      editNext() {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/thresholdInfo/judgeThresholdName', {
            name: that.$refs.modify.addForm.name,
            uuid: that.$refs.modify.addForm.uuid
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep++;
            }
          });
        } else {
          that.currentStep++;
        }
      }
    },
    mounted() {
      this.searchPost();
      // 获取搜索栏资产类型选项
      $axios.get('/monitorcitype/getCitypeTree').then(({data}) => {
        this.searchOptions = data;
      });
    }
  }
</script>
<style rel="stylesheet/stylus" lang="stylus">
</style>
