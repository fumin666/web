<template>
  <div>
    <s-dialog v-model="dialogFlag" title="批量编辑" class="monitorAddDialog">
      <s-tab :animated="false" @on-click="switchTab">
        <s-tab-pane label="常规属性">
          <s-scrollbar wrap-class="monitorDialogScrollbar">
            <s-form ref="tab1Form" :model="tab1Form" :rules="tab1Rules" label-width="120px">
              <s-form-item label="资产类型" prop="citypeUuid">
                <input-tree v-model="tab1Form.citypeUuid" name="uuid" :data="citypeOptions" :props="defaultProps" @select-change="inputTreeChange"></input-tree>
              </s-form-item>
              <s-form-item label="资产型号" prop="modelNumber">
                <s-input v-model="tab1Form.modelNumber" readonly icon="plus" @click="showModelNumDialog" class="inputDialog" ref="modelInput"></s-input>
              </s-form-item>
              <s-form-item label="所属机构">
                <!--<s-select v-model="tab1Form.cmdbOrguuid">
                  <s-option :label="item.departName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.cmdbOrgList" :key="index"></s-option>
                </s-select>-->
                <select-dialog
                  v-model="tab1Form.cmdbOrguuid"
                  :options="selectOptionsObj.cmdbOrgList"
                  :config="config"
                  valueProp="uuid"
                  title="选择机构"
                >
                  <s-option :label="item.departName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.cmdbOrgList" :key="index"></s-option>
                </select-dialog>
              </s-form-item>
              <s-form-item label="维护人">
                <s-select v-model="tab1Form.maintenanceStaffuuid">
                  <s-option :label="item.userRealName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.sysUserList" :key="index"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="位置">
                <s-select v-model="tab1Form.location">
                  <s-option :label="item.name" :value="item.uuid" v-for="(item,index) in selectOptionsObj.locationList" :key="index"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="开机时间" v-if="isMonitor">
                <s-date-picker v-model="tab1Form.sysItcompRuntime.tempDate" type="datetime" placeholder="选择日期"
                               value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
              </s-form-item>
            </s-form>
          </s-scrollbar>
        </s-tab-pane>
      </s-tab>

      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogSave">保存</s-button>
        <s-button type="cancel" @click="dialogClose">取消</s-button>
      </template>
    </s-dialog>

    <model-number-dialog v-model="modelNumberDialogFlag" v-if="modelNumberDialogFlag" :citype-uuid="tab1Form.citypeUuid" @select-model="selectModel">
    </model-number-dialog>

  </div>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax'
  import inputTree from '@/components/inputTree/InputTree';
  import modelNumberDialog from '@/pages/Assets_AssetList/AssetAddDialog/ModelNumberDialog'
  import SelectDialog from '@/components/selectDialog'
  export default {
    data() {
      return {
        dialogFlag: false,
        modelNumberDialogFlag: false,
        configDialogFlag: false,
        data: {},
        selectOptionsObj: {
          cmdbOrgList: [], // 所属机构
          sysUserList: [], // 维护人
          locationList: [], // 位置
          protocolList: [], // 配置弹框中的协议名称
          accountType: [] // 配置弹框中的角色名称
        },
        tab1Form: {
          citypeUuid: '',
          defCompId: '',
          cmdbOrguuid: '',
          maintenanceStaffuuid: '',
          location: '',
          cateUuid: '',
          modelNumber: '',
          itcompTemplate: '',
          manufactUuid: '',
          productUuid: '',
          sysItcompRuntime: {
            uuid: '',
            tempDate: ''
          }
        },
        config: [
          {name: '机构', value: 'departName'}
        ],
        tab1Rules: {
          controlAdderss: [Validaters.IP],
          itcompName: [Validaters.NotNull],
          citypeUuid: [Validaters.NotNull],
          modelNumber: [Validaters.NotNull],
          mac: [Validaters.Mac]
        },
        citypeOptions: [], // 资产类型下拉树数据
        cascaderData: {},
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        tab2SearchValue: '',
        tab2Data: [],
        tab2Selections: [],
        configData: {}
      }
    },
    props: {
      isMonitor: {
        type: Boolean,
        default: true
      },
      batchArr: {
        type: Array
      },
      value: {
        type: Boolean,
        default: false
      },
      uuid: {
        type: String,
        default: ''
      }
    },
    created() {
      // 所属机构，维护人，位置，协议名称，资产状态，自定义属性下拉框
      $axios.post('/resourcemanager/assetmanager/itasset/findAddSelect').then(({data}) => {
        this.selectOptionsObj = data;
        this.tab1Form.cmdbOrguuid = this.selectOptionsObj.cmdbOrgList[0] ? this.selectOptionsObj.cmdbOrgList[0].uuid : '';
        this.tab1Form.maintenanceStaffuuid = this.selectOptionsObj.sysUserList[0] ? this.selectOptionsObj.sysUserList[0].uuid : '';
        this.tab1Form.location = this.selectOptionsObj.locationList[0] ? this.selectOptionsObj.locationList[0].uuid : '';
      });
      this.axiosCitypeTree();
    },
    methods: {
      switchTab(index) {
        if (index === 1) {
          // 新增的时候不需要调，因为新增时数据为空
        }
      },
      bindvalue(formObj, dataObj) { // 处理编辑时传过来的数据
        for (let i in formObj) {
          if (dataObj.hasOwnProperty(i) && dataObj[i]) {
            if (i === 'sysItcompRuntime') {
              formObj[i].uuid = dataObj[i].uuid;
              formObj[i].tempDate = dataObj[i].tempDate;
            } else {
              formObj[i] = dataObj[i];
            }
          }
        }
      },
      inputTreeChange(nodeData) {
        this.tab1Form.cateUuid = nodeData.node.catogeryUuid;
      },
      showModelNumDialog() {
        if (!this.tab1Form.citypeUuid) {
          this.$message({showClose: true, message: '请先选择资产类型', type: 'error'});
          return;
        }
        this.modelNumberDialogFlag = true;
      },
      selectModel(model) {
        this.tab1Form.defCompId = model.uuid;
        this.tab1Form.modelNumber = model.productName;
        this.tab1Form.itcompTemplate = model.template;
        this.tab1Form.manufactUuid = model.manufactUuid;
        this.tab1Form.productUuid = model.productUuid;
        // 下面的代码是为了修复验证
        this.$refs.tab1Form.validateField('modelNumber');
      },
      filterConfigParam(configObj) {
        let param = {
          assetsAccountInfo: {},
          assetsPortInfo: {}
        };
        for (let i in configObj) {
          if (configObj[i]) {
            if (i === 'userName') {
              param.assetsAccountInfo.accountName = configObj[i];
            } else if (i === 'userPossword') {
              param.assetsAccountInfo.accountPasswd = configObj[i];
            } else if (i === 'snmpCWordOr' || i === 'snmpCWordRw') {
              param.assetsAccountInfo[i] = configObj[i]
            } else if (i === 'accountType') {
              param.assetsAccountInfo.accountRoleUuid = configObj.accountType;
            } else if (i === 'protocol_uuid') {
              param.assetsPortInfo.protocolUuid = configObj[i];
            } else if (i !== 'accountName' && i !== 'accountPasswd' && i !== 'protocol') {
              param.assetsPortInfo[i] = configObj[i];
            }
          }
        }
        return param;
      },
      dialogSave() {
        this.$refs.tab1Form.validate(valid => {
          if (!valid) {
            return;
          }
          let param = {
            batchUpdateUuidList: [],
            monitorItcomp: {}
          };
          param.batchUpdateUuidList = this.batchArr.map(item => {
            return item.uuid;
          });
          for (let i in this.tab1Form) {
            if (i !== 'sysItcompRuntime') {
              if (this.tab1Form[i] !== '') {
                param.monitorItcomp[i] = this.tab1Form[i];
              }
            } else {
              if (this.tab1Form.sysItcompRuntime && Object.keys(this.tab1Form.sysItcompRuntime).length > 0) {
                param.monitorItcomp.sysItcompRuntime = {};
                for (let j in this.tab1Form.sysItcompRuntime) {
                  if (this.tab1Form.sysItcompRuntime[j] !== '') {
                    param.monitorItcomp.sysItcompRuntime[j] = this.tab1Form.sysItcompRuntime[j];
                  }
                }
              }
            }
          }
          if (Object.keys(param.monitorItcomp.sysItcompRuntime).length === 0) {
            delete param.monitorItcomp.sysItcompRuntime;
          }
          if (!this.isMonitor) { // 资产的批量编辑没有开机时间
            delete param.sysItcompRuntime;
          }
          let logParam = {
            data: JSON.parse(JSON.stringify(this.batchArr)),
            logTemplate: '编辑|资产(#IP地址#/#资产名称#)'
          };
          $axios.post('/resourcemanager/assetmanager/itasset/assetBatchUpdate', param, logParam).then(({data}) => {
            this.$message({showClose: true, message: data === 'true' ? '操作成功' : '资产已经存在，操作失败', type: data === 'true' ? 'success' : 'error'});
            if (data === 'true') {
              this.dialogFlag = false;
              this.$emit('reload', true);
            }
          });
        });
      },
      dialogClose() {
        this.dialogFlag = false;
      },
      axiosCitypeTree() {
        // 选项卡1：资产类型下拉树
        $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
          this.citypeOptions = data;
          this.tab1Form.citypeUuid = this.citypeOptions[0].uuid;
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    components: {
      inputTree,
      modelNumberDialog,
      SelectDialog
    }
  }
</script>

<style lang="stylus">
  .left-float
    float left
  .right-float
    float: right
  .monitorDialogScrollbar
    padding-right 17px
    max-height 500px

  .monitorAddDialog
    .s-date-editor,.s-cascader,.inputDialog
      width: 50%
    .s-form
      padding-bottom 0
      border-bottom 0
    .s-dialog-body
      padding-bottom 0
    .tabTable
      margin-top: 10px
      .cell
        white-space nowrap
        padding-left 10px
        padding-right 10px
        i
          margin-right: 5px
          &:last-child
            margin-right 0
    .s-cascader-label
      z-index 1

</style>
