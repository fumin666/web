<template>
  <div>
    <s-dialog v-model="dialogFlag" :title="title" id="assetAddDialog">
      <s-tab :animated="false">
        <s-tab-pane label="常规属性">
          <s-scrollbar wrap-class="assetDialogScrollbar">
            <s-form ref="tab1Form" :model="tab1Form" :rules="tab1Rules" label-width="120px">
              <s-form-item label="IP地址" prop="controlAdderss">
                <s-input v-model="tab1Form.controlAdderss"></s-input>
              </s-form-item>
              <s-form-item label="资产名称" prop="itcompName">
                <s-input v-model="tab1Form.itcompName"></s-input>
              </s-form-item>
              <s-form-item label="资产类型" prop="citypeUuid">
                <input-tree v-model="tab1Form.citypeUuid" name="uuid" :data="citypeOptions" :props="defaultProps" @select-change="inputTreeChange"></input-tree>
              </s-form-item>
              <s-form-item label="资产型号" prop="modelNumber">
                <s-input v-model="tab1Form.modelNumber" readonly icon="plus" @click="showModelNumDialog" class="inputDialog" ref="modelInput"></s-input>
                <s-checkbox class="modelNumFlag" v-model="tab1Form.deviceTypeUuid"
                            :true-label="fixedDevicetypeuuid" :false-label="deviceTypeUuidOld">自定义</s-checkbox>
              </s-form-item>
              <s-form-item label="业务名称" prop="businessName">
                <s-input v-model="tab1Form.businessName"></s-input>
              </s-form-item>
              <s-form-item label="MAC地址" prop="mac">
                <s-input v-model="tab1Form.mac"></s-input>
              </s-form-item>
              <s-form-item label="所属机构" prop="cmdbOrguuid">
                <!--<s-select v-model="tab1Form.cmdbOrguuid">
                  <s-option :label="item.departName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.cmdbOrgList" :key="index"></s-option>
                </s-select>-->
                <select-dialog
                  v-model="tab1Form.cmdbOrguuid"
                  :options="selectOptionsObj.cmdbOrgList"
                  :config="config"
                  valueProp="uuid"
                  title="选择所属机构"
                >
                  <s-option :label="item.departName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.cmdbOrgList" :key="index"></s-option>
                </select-dialog>
              </s-form-item>
              <s-form-item label="责任人" prop="maintenanceStaffuuid">
                <!--<s-select v-model="tab1Form.maintenanceStaffuuid">
                  <s-option :label="item.userLoginName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.sysUserList" :key="index"></s-option>
                </s-select>-->
                <select-dialog
                  v-model="tab1Form.maintenanceStaffuuid"
                  :options="selectOptionsObj.sysUserList"
                  :config="conf"
                  valueProp="uuid"
                  title="选择账号"
                >
                  <s-option :label="item.userRealName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.sysUserList" :key="index"></s-option>
                </select-dialog>
              </s-form-item>
              <s-form-item label="位置">
                <s-select v-model="tab1Form.location">
                  <s-option :label="item.name" :value="item.uuid" v-for="(item,index) in selectOptionsObj.locationList" :key="index"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="描述" prop="descr">
                <s-input type="textarea" v-model="tab1Form.descr"></s-input>
              </s-form-item>
            </s-form>
          </s-scrollbar>
        </s-tab-pane>
        <s-tab-pane label="管理配置">
          <manage-config ref="manageConfig"
                         :tab2Data.sync="tab2Data"
                         @add-proto="addProto"
          ></manage-config>
        </s-tab-pane>
        <s-tab-pane label="资产属性">
          <s-scrollbar wrap-class="assetDialogScrollbar">
          <div class="title">资产属性</div>
          <s-form :model="tab3Form" :rules='tab3Rules' ref="tab3Form" label-width="120px">
            <s-row :gutter="20">
              <s-col :span="12">
                <s-form-item label="资产状态">
                  <s-select v-model="tab3Form.assetStatus">
                    <s-option :label="item.assetstatusName" :value="item.uuid"
                              v-for="(item,index) in selectOptionsObj.assetStatusList" :key="index"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="序列号">
                  <s-input v-model="tab3Form.assetSeries"></s-input>
                </s-form-item>
                <s-form-item label="条形码">
                  <s-input v-model="tab3Form.barCode"></s-input>
                </s-form-item>
                <s-form-item label="购进日期">
                  <s-date-picker style="width:150px" v-model="tab3Form.purchaseDate" type="datetime" placeholder="选择日期"
                                 value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                </s-form-item>
              </s-col>
              <s-col :span="12">
                <s-form-item label="订购成本" prop="orderingCost">
                  <s-input v-model="tab3Form.orderingCost"></s-input>
                </s-form-item>
                <s-form-item label="资产标签">
                  <s-input v-model="tab3Form.assetTag"></s-input>
                </s-form-item>
                <s-form-item label="有效期">
                  <s-date-picker style="width:150px" class="dateStyle" v-model="tab3Form.effectiveDate" type="datetime"
                                 placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                </s-form-item>
                <s-form-item label="担保期">
                  <s-date-picker style="width:150px" v-model="tab3Form.guaranteeDate" type="datetime" placeholder="选择日期"
                                 value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                </s-form-item>
              </s-col>
            </s-row>
          </s-form>
          <div class="title" v-if="asset.length > 0">附加属性</div>
          <div>
            <s-row :gutter="20">
              <s-col :span="12" v-for="(item, index) in asset" :key="index" style="margin-top:10px">
                <s-row>
                  <s-col :span="10" style="padding-left:12px; line-height:36px">{{asset[index].aliasName}}</s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="asset[index].htmlColumnType === `udf_char_single_line`">
                    <s-input v-model='cmdvalue[asset[index].columnName]' v-if="isEdit && cmdvalue"></s-input>
                    <s-input v-model='asset[index].name' v-else></s-input>
                  </s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="asset[index].htmlColumnType === `udf_long`">
                    <s-input-number style="width: 100%;" v-model='cmdvalue[asset[index].columnName]' v-if="isEdit && cmdvalue" :min="0"></s-input-number>
                    <s-input-number style="width: 100%;" v-model='asset[index].name' v-else :min="0"></s-input-number>
                  </s-col>
                  <s-col :span="14" style="padding-left:12px;" v-if="asset[index].htmlColumnType === `udf_char_list`">
                    <s-select v-model='asset[index].sel' v-if="!isEdit||!cmdvalue">
                      <s-option v-for="(ite, inde) in asset[index].listvalues" :label="ite.listvalues"
                                :key="ite.listvalues" :value="ite.listvalues">
                      </s-option>
                    </s-select>
                    <s-select v-model='cmdvalue[asset[index].columnName]' v-if="isEdit && cmdvalue">
                      <s-option v-for="(ite, inde) in asset[index].listvalues" :label="ite.listvalues"
                                :key="ite.listvalues" :value="ite.listvalues">
                      </s-option>
                    </s-select>
                  </s-col>
                  <s-col :span="14" v-if="asset[index].htmlColumnType === `udf_date`" style="padding-left:12px">
                    <s-date-picker style="width:145px" v-model='asset[index].dat' type="datetime" placeholder="选择日期"
                                   v-if="!isEdit||!cmdvalue" value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                    <s-date-picker style="width:145px" v-model='cmdvalue[asset[index].columnName]' type="datetime"
                                   placeholder="选择日期" v-if="isEdit && cmdvalue"
                                   value-format="yyyy-MM-dd HH:mm:ss"></s-date-picker>
                  </s-col>
                </s-row>
              </s-col>
              <s-col :span="12" v-for="(item, index) in atach" :key="index" style="margin-top:10px">
                <s-row>
                  <s-col :span="10" style="padding-left:12px; line-height:36px">{{atach[index].aliasName}}</s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="atach[index].htmlColumnType === `udf_char_single_line`">
                    <s-input v-model='cmdvalue[atach[index].columnName]' v-if="isEdit && cmdvalue"></s-input>
                    <s-input v-model='atach[index].name' v-else></s-input>
                  </s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="atach[index].htmlColumnType === `udf_long`">
                    <s-input-number style="width: 100%;" v-model='cmdvalue[atach[index].columnName]' v-if="isEdit && cmdvalue"></s-input-number>
                    <s-input-number style="width: 100%;" v-model='atach[index].name' v-else></s-input-number>
                  </s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="atach[index].htmlColumnType === `udf_char_list`">
                    <s-select v-model="atach[index].sel" v-if="!isEdit||!cmdvalue">
                      <s-option v-for="(ite, inde) in atach[index].listvalues" :label="ite.listvalues"
                                :key="ite.listvalues" :value="ite.listvalues">
                      </s-option>
                    </s-select>
                    <s-select v-model="cmdvalue[atach[index].columnName]" v-if="isEdit && cmdvalue">
                      <s-option v-for="(ite, inde) in atach[index].listvalues" :label="ite.listvalues"
                                :key="ite.listvalues" :value="ite.listvalues">
                      </s-option>
                    </s-select>
                  </s-col>
                  <s-col :span="14" style="padding-left:12px" v-if="atach[index].htmlColumnType === `udf_date`">
                    <s-date-picker style="width:145px" type="datetime" v-if="!isEdit ||!cmdvalue" placeholder="选择日期"
                                   value-format="yyyy-MM-dd HH:mm:ss" v-model='atach[index].dat'></s-date-picker>
                    <s-date-picker style="width:145px" type="datetime" v-if="isEdit && cmdvalue" placeholder="选择日期"
                                   value-format="yyyy-MM-dd HH:mm:ss"
                                   v-model='cmdvalue[atach[index].columnName]'></s-date-picker>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
          </div>
          </s-scrollbar>
        </s-tab-pane>
        <s-tab-pane label="自定义属性" :vif="customAttrList.length > 0">
          <s-form label-width="120px" :model="tab4Form" :rules="tab4Rule" ref="tab4Form">
            <s-form-item v-for="(item, index) in customAttrList" :key="'custom' + index"
                         :label="item.colnumName" :prop="item.htmlType==='udf_long' ? item.colnumName : undefined">
              <s-input v-model="tab4Form[item.colnumName]" v-if="item.htmlType==='udf_char_single_line'">
              </s-input>
              <s-select v-model="tab4Form[item.colnumName]" v-else-if="item.htmlType==='udf_char_list'">
                <s-option v-for="(option,index) in item.listvalues" :key="item.colnumName + index" :value="option.listvalues">
                </s-option>
              </s-select>
              <s-input-number v-model.number="tab4Form[item.colnumName]" v-else-if="item.htmlType==='udf_long'" :max="inputNumMax" :min="0 - inputNumMax">
              </s-input-number>
              <s-date-picker style="width:150px" v-model="tab4Form[item.colnumName]" type="datetime" v-else-if="item.htmlType==='udf_date'"
                             value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择日期时间">
              </s-date-picker>
            </s-form-item>
          </s-form>
        </s-tab-pane>
      </s-tab>

      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogSave">保存</s-button>
        <s-button type="cancel" @click="dialogClose">取消</s-button>
      </template>
    </s-dialog>

    <model-number-dialog v-model="modelNumberDialogFlag" v-if="modelNumberDialogFlag" :citype-uuid="tab1Form.citypeUuid" @select-model="selectModel">
    </model-number-dialog>

    <config-add-dialog v-model="configDialogFlag" v-if="configDialogFlag" :options="selectOptionsObj" :data="configData"
         :asset-uuid="uuid"
         :already-proto-list="tab2Data"
         @config-save="tab2ConfigSave">
    </config-add-dialog>

  </div>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax'
  import inputTree from '@/components/inputTree/InputTree';
  import configAddDialog from './ConfigAddDialog';
  import modelNumberDialog from './ModelNumberDialog';
  import SelectDialog from '@/components/selectDialog'
  import manageConfig from './ManageConfig.vue';
  import ManageConfigMixin from './ManageConfigMixin';

  export default {
    mixins: [ManageConfigMixin],
    data() {
      return {
        columnName: '',
        assetAtach: [],
        asset: [],
        atach: [],
        sel: '',
        dat: '',
        ect: '',
        name: '',
        cmdvalue: {},
        dialogFlag: false,
        modelNumberDialogFlag: false,
        baseUrl: '',
        data: {},
        config: [
          {name: '机构名称', value: 'departName'},
          {name: '机构编号', value: 'departCode'},
          {name: '上级机构', value: 'departParentName'},
          {name: '机构主负责人', value: 'departLeaderName'}
        ],
        conf: [
          {name: '账号名称', value: 'userLoginName'},
          {name: '真实姓名', value: 'userRealName'},
          {name: '所属机构', value: 'departName'},
          {name: '角色', value: 'roleName'},
          {name: '状态', value: 'statusName'}
        ],
        selectOptionsObj: {
          cmdbOrgList: [], // 所属机构
          sysUserList: [], // 维护人
          locationList: [], // 位置
          protocolList: [], // 配置弹框中的协议名称
          accountType: [] // 配置弹框中的角色名称
        },
        tab1Form: {
          controlAdderss: '',
          itcompName: '',
          citypeUuid: '',
          defCompId: '',
          businessName: '',
          mac: '',
          cmdbOrguuid: '',
          maintenanceStaffuuid: '',
          location: '',
          descr: '',
          cateUuid: '',
          modelNumber: '',
          itcompTemplate: '',
          manufactUuid: '',
          productUuid: '',
          deviceTypeUuid: ''
        },
        tab1Rules: {
          controlAdderss: [Validaters.IP],
          itcompName: [Validaters.NotNull, Validaters.Max(50)],
          citypeUuid: [Validaters.NotNull],
          modelNumber: [Validaters.NotNull],
          businessName: [Validaters.Max(50)],
          mac: [Validaters.Mac],
          cmdbOrguuid: [Validaters.NotNull],
          maintenanceStaffuuid: [Validaters.NotNull],
          descr: [Validaters.Max(1000)]
        },
        citypeOptions: [], // 资产类型下拉树数据
        cascaderData: {},
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        deviceTypeUuidOld: '',
        fixedDevicetypeuuid: 'tdevicetypeinit00000000000000099',
        tab3Form: {
          assetStatus: '',
          assetSeries: '',
          barCode: '',
          purchaseDate: '',
          orderingCost: '',
          assetTag: '',
          effectiveDate: '',
          guaranteeDate: ''
        },
        tab3Rules: {
          orderingCost: [Validaters.Number]
        },
        tab4Form: {}, // 自定义属性表单
        tab4Rule: {},
        customAttrList: [],
        inputNumMax: 99999999999999999999
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: {
        type: String,
        default: ''
      }
    },
    computed: {
      isEdit() {
        return this.uuid.length > 0;
      },
      title() {
        return this.isEdit ? '编辑' : '添加';
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
      // 所属机构，维护人，位置，协议名称，资产状态，自定义属性下拉框，附件属性
      $axios.post('/resourcemanager/assetmanager/itasset/findAddSelect').then(({data}) => {
        this.assetAtach = data.assetAtachColumn
        this.assetAtach.forEach((item, index) => {
          this.$set(item, 'dat', '')
          this.$set(item, 'sel', '')
          this.$set(item, 'name', item.defaultValue || '')
          if (index % 2 === 0) {
            this.asset.push(this.assetAtach[index])
            this.asset.forEach((item, ind) => {
              if (this.asset[ind].listvalues) {
                this.asset[ind].sel = this.asset[ind].listvalues[0].listvalues
                // this.cmdvalue[this.asset[ind].columnName] = this.asset[ind].listvalues[0].listvalues
              }
            })
          } else {
            this.atach.push(this.assetAtach[index])
            this.atach.forEach((item, inde) => {
              if (this.atach[inde].listvalues) {
                this.atach[inde].sel = this.atach[inde].listvalues[0].listvalues
                // this.cmdvalue[this.atach[inde].columnName] = this.atach[inde].listvalues[0].listvalues
              }
            })
          }
        })
        this.selectOptionsObj = data;
        if (!this.isEdit) {
          this.selectOptionsObj.locationList[0] && (this.tab1Form.location = this.selectOptionsObj.locationList[0].uuid);
          this.tab3Form.assetStatus = this.selectOptionsObj.assetStatusList[0].uuid;
        }
      });
      if (this.isEdit) {
        $axios.get('/resourcemanager/assetmanager/itasset/getitAsset/' + this.uuid).then(({data}) => {
          this.cmdvalue = data.cmdbAssetinfo.cmdbPublicattributevalue || null;
          this.data = data;
          this.bindvalue(this.tab1Form, this.data);
          this.bindvalue(this.tab3Form, this.data.cmdbAssetinfo);
          this.$set(this.tab1Form, 'uuid', this.data.uuid);
          this.$set(this.tab1Form, 'id', this.data.id);
          this.deviceTypeUuidOld = this.data.deviceTypeUuidOld;
          this.$set(this.tab3Form, 'ciuuid', this.data.cmdbAssetinfo.ciuuid);
          this.$set(this.tab3Form, 'id', this.data.cmdbAssetinfo.id);
          this.docList = this.data.documentInfo || [];
          this.axiosCitypeTree(); // 放在里面是为了inputTree默认选中值不出现bug
        });
        // 获取配置管理列表
        this.axiosConfigList(this.uuid);
      } else {
        this.axiosCitypeTree();
      }
    },
    methods: {
      bindvalue(formObj, dataObj) { // 处理编辑时传过来的数据
        for (let i in formObj) {
          if (dataObj.hasOwnProperty(i)) {
            formObj[i] = dataObj[i];
          }
        }
      },
      getItemOfAttr(uuid, arr) { // 获取编辑时自定义属性对应的item
        let obj = arr.filter(item => {
          return uuid === item.attributeUuid;
        })[0];
        return obj;
      },
      validLength(rule, value, callback) {
        if (!value) {
          callback();
          return;
        };
        if ((value + '').length > 20) {
          callback(new Error(`最大长度为20`));
        }
        callback();
      },
      inputTreeChange(nodeData) {
        this.tab1Form.cateUuid = nodeData.node.catogeryUuid;
        if (nodeData.node.typeAttributeList.length > 0) {
          this.customAttrList = JSON.parse(JSON.stringify(nodeData.node.typeAttributeList));
          if (!this.isEdit) {
            this.customAttrList.forEach(item => {
              this.$set(item, 'value', '');
            });
          } else {
            this.customAttrList.forEach((item, index) => {
              Object.assign(item, this.getItemOfAttr(item.uuid, this.data.attrvalueView));
            });
          }
          this.tab4Form = {};
          this.tab4Rule = {};
          this.customAttrList.forEach(item => {
            this.$set(this.tab4Form, item.colnumName, item.value);
            if (item.htmlType === 'udf_long') {
              this.$set(this.tab4Rule, item.colnumName, [{ type: 'number', validator: this.validLength, trigger: 'blur' }]);
            }
          });
        }
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
        this.tab1Form.deviceTypeUuid = model.devicetypeuuid;
        this.deviceTypeUuidOld = model.devicetypeuuid;
        this.$refs.tab1Form.validateField('modelNumber');
      },
      validForm(callback) {
        let validForm = [this.$refs.tab1Form, this.$refs.tab3Form];
        this.$refs.tab4Form && Object.keys(this.tab4Rule).length > 0 && validForm.push(this.$refs.tab4Form);
        let promises = validForm.map(item => {
          return new Promise((resolve, reject) => {
            item.validate(valid => {
              if (!valid) {
                this.$message({showClose: true, message: '请检查填写的内容!', type: 'warning'});
                reject();
              }
              resolve();
            })
          })
        });
        Promise.all(promises).then(() => {
          callback()
        });
      },
      dialogSave() {
        this.validForm(() => {
          let param = {
            monitorItcomp: {
              cmdbAssetinfo: {}
            },
            credenceList: [],
            batchDeleteIdList: this.tab2Data.filter(item => item.id).map(item => item.id),
            batchDeleteIdLists: this.$refs.manageConfig.tab2DeledList.map(item => {
              return item.id;
            }).concat(this.repeatIdArr)
          };
          for (let i in this.tab1Form) {
            param.monitorItcomp[i] = this.tab1Form[i];
          }
          let dateArr = ['effectiveDate', 'guaranteeDate', 'purchaseDate'];
          for (let i in this.tab3Form) {
            if (dateArr.indexOf(i) === -1 || this.tab3Form[i]) {
              param.monitorItcomp.cmdbAssetinfo[i] = this.tab3Form[i];
            }
          }
          this.tab2Data.forEach(item => {
            param.credenceList.push(this.filterConfigParam(item));
          });
          this.delRepeatPro(param.credenceList);
          this.delRepeatAccount(param.credenceList);
          // 自定义属性
          param.monitorItcomp.cmdbAttributeValueList = [];
          this.customAttrList.forEach(item => {
            param.monitorItcomp.cmdbAttributeValueList.push({
              attributeUuid: item.uuid,
              attributeValue: this.tab4Form[item.colnumName],
              ciUuid: this.uuid
            });
          });
          // 附加字段
          param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue = {};
          this.assetAtach.forEach((item, index) => {
            if (item.htmlColumnType === `udf_long` || item.htmlColumnType === `udf_char_single_line`) {
              param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue[item.columnName] = this.isEdit && this.cmdvalue ? this.cmdvalue[item.columnName] : item.name
            }
            if (item.htmlColumnType === `udf_date`) {
              param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue[item.columnName] = this.isEdit && this.cmdvalue ? this.cmdvalue[item.columnName] : item.dat
            }
            if (item.htmlColumnType === `udf_char_list`) {
              param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue[item.columnName] = this.isEdit && this.cmdvalue ? this.cmdvalue[item.columnName] : item.sel
            }
          });
          if (this.data.cmdbAssetinfo && this.data.cmdbAssetinfo.cmdbPublicattributevalue) { // 新增时不进入
            param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue.uuid = this.data.cmdbAssetinfo.cmdbPublicattributevalue.uuid;
          }
          for (let i in param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue) {
            if (param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue[i] === '') {
              param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue[i] = null
            }
          }
          if (Object.keys(param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue).length === 0) {
            param.monitorItcomp.cmdbAssetinfo.cmdbPublicattributevalue = null; // 为匹配接口
          }
          // 关联文档
          param.monitorItcomp.documentList = this.docList.map(item => {
            return {
              docuuid: item.uuid,
              relavencetype: this.getDocType(item.docType)
            }
          });
          this.isEdit && (param.monitorItcomp.updateFlag = param.monitorItcomp.controlAdderss);
          let urlTail = this.isEdit ? 'update' : 'save';
          let logParam = {
            data: [Object.assign({}, this.tab1Form)],
            logTemplate: (this.isEdit ? '编辑' : '添加') + '|资产(#controlAdderss#/#itcompName#)'
          };
          $axios.post('/resourcemanager/assetmanager/itasset/' + urlTail, param, logParam).then(({data}) => {
            if (data === 'success') {
              this.dialogFlag = false;
              this.isEdit ? this.$emit('reload') : this.$emit('reload', true);
            }
            this.$message({
              showClose: true,
              message: data === 'success' ? '操作成功' : (this.isEdit ? '更新失败' : (data === 'failcount' ? '资产点数达到上限，添加失败' : '资产已经存在，操作失败')),
              type: data === 'success' ? 'success' : 'error'
            });
          });
        })
      },
      dialogClose() {
        this.dialogFlag = false;
      },
      axiosCitypeTree() {
        // 选项卡1：资产类型下拉树
        $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then(({data}) => {
          this.citypeOptions = data;
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
      configAddDialog,
      modelNumberDialog,
      SelectDialog,
      manageConfig
    }
  }
</script>

<style lang="stylus">
 /* #assetAddDialog
    .left-float
      float left
    .right-float
      float: right
    .assetDialogScrollbar
      padding-right 17px
      max-height 500px
    .title
      color: #2db0fb;
      height: 36px;
      line-height: 36px;
      padding-left: 10px;
      margin-bottom: 10px;
    .s-date-editor,.s-cascader,.inputDialog
      width: 50%
    .s-form
      padding-bottom 0
      border-bottom 0
    .s-dialog-body
      padding-bottom 0
    .tabTable
      margin-top: 10px
      .s-table-body-wrapper
        overflow-x hidden
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
    .modelNumFlag
      margin-left 30px
       width:160px */

</style>
