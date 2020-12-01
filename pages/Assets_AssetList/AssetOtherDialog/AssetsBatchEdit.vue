<!--
  @Author: caoLiXin
  @Date: 2019/1/25
  @Desc: 2019-Q1需求，资产批量编辑
 -->
<template>
  <section id="assets-batch-edit">
    <s-scrollbar wrap-style="max-height:450px;">
      <s-form ref="batchEditForm" :model="batchEditForm" :rules="batchEditFormRules" label-width="130px">
        <s-checkbox-group v-model="formItemCheckList" @change="changeItemCheckList">
          <!-- 内置固定属性不可修改开启应用、开启批量编辑属性 -->
          <s-row>
            <s-col :span="2"><s-checkbox label="citypeUuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="资产分类" prop="citypeUuid" style="margin-right: 12px;">
                <s-cascader
                  style="width: 100%;"
                  placeholder="请选择设备的三级分类"
                  :options="citypeList"
                  v-model="batchEditForm.citypeUuid"
                  @change="selectTreeChange">
                </s-cascader>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="manufactUuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="厂商" prop="manufactUuid">
                <s-select v-model="batchEditForm.manufactUuid" @clear="emptyManufact" filterable>
                  <s-option
                    v-for="(item, $index) in manufactOptions"
                    :label="item.caption" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="productUuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="型号" prop="productUuid">
                <s-select v-model="batchEditForm.productUuid" @clear="emptyProduct" @change="productChange" filterable>
                  <s-option
                    v-for="(item, $index) in productOptions"
                    :label="item.caption" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="assetStatus">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="资产状态" prop="assetStatus">
                <s-select v-model="batchEditForm.assetStatus">
                  <s-option
                    v-for="(item, $index) in assetStatusLists"
                    :label="item.assetstatusName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="operationOrguuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="配置管理员机构" prop="operationOrguuid">
                <s-select v-model="batchEditForm.operationOrguuid" clearable>
                  <s-option
                    v-for="(item, $index) in operationOrgList"
                    :label="item.departName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="maintenanceStaffuuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="配置管理员" prop="maintenanceStaffuuid">
                <s-select v-model="batchEditForm.maintenanceStaffuuid">
                  <s-option
                    v-for="(item, $index) in configManagerList"
                    :label="item.realNameAndEmail" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="firmUuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="公司名称" prop="firmUuid">
                <s-select v-model="batchEditForm.firmUuid">
                  <s-option
                    v-for="(item, $index) in companyLists"
                    :label="item.departName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="2"><s-checkbox label="cmdbOrguuid">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="使用部门" prop="cmdbOrguuid">
                <s-select v-model="batchEditForm.cmdbOrguuid">
                  <s-option
                    v-for="(item, $index) in departOrgLists"
                    :label="item.departName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <!-- 内置可以修改开启应用、开启批量编辑属性 -->
          <s-row v-if="inDataObj['important']">
            <s-col :span="2"><s-checkbox label="important">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="资产重要程度" prop="important">
                <s-select v-model="batchEditForm.important" style="width: 100%;">
                  <s-option label="很高" :value="2">很高</s-option>
                  <s-option label="高" :value="3">高</s-option>
                  <s-option label="中等" :value="4">中等</s-option>
                  <s-option label="低" :value="5">低</s-option>
                  <s-option label="很低" :value="6">很低</s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['isForbidPing']">
            <s-col :span="2"><s-checkbox label="isForbidPing">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="是否禁ping" prop="isForbidPing">
                <s-radio class="radio" v-model="batchEditForm.isForbidPing" :label="1">是</s-radio>
                <s-radio class="radio" v-model="batchEditForm.isForbidPing" :label="0">否</s-radio>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['atCabinetNumber']">
            <s-col :span="2"><s-checkbox label="atCabinetNumber">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="所在机柜" prop="atCabinetNumber">
                <s-input v-model="batchEditForm.atCabinetNumber"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['panel']">
            <s-col :span="2"><s-checkbox label="panel">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="面板" prop="panel">
                <s-input v-model="batchEditForm.panel" >
                  <s-upload slot='suffix' ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                    <s-button size='mini' id="s-upload-button">上传</s-button>
                  </s-upload>
                </s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['uAmount']">
            <s-col :span="2"><s-checkbox label="uAmount">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="尺寸" prop="uAmount">
                <s-input v-model="batchEditForm.uAmount"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['ciCode']">
            <s-col :span="2"><s-checkbox label="ciCode">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="资产编码" prop="ciCode">
                <s-input v-model="batchEditForm.ciCode"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['assetSeries']">
            <s-col :span="2"><s-checkbox label="assetSeries">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="序列号" prop="assetSeries">
                <s-input v-model="batchEditForm.assetSeries"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['takeUser']">
            <s-col :span="2"><s-checkbox label="takeUser">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="维护人" prop="takeUser">
                <s-select v-model="batchEditForm.takeUser">
                  <s-option
                    v-for="(item, $index) in takeUserLists"
                    :label="item.userRealName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['serviceMode']">
            <s-col :span="2"><s-checkbox label="serviceMode">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="服务方式" prop="serviceMode">
                <s-input v-model="batchEditForm.serviceMode"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['environment']">
            <s-col :span="2"><s-checkbox label="environment">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="环境类型" prop="environment">
                <s-select v-model="batchEditForm.environment">
                  <s-option
                    v-for="(item, $index) in environmentTypeLists"
                    :label="item.environmentName" :value="item.uuid" :key="$index">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['cpuModle']">
            <s-col :span="2"><s-checkbox label="cpuModle">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="CPU型号" prop="cpuModle">
                <s-input v-model="batchEditForm.cpuModle"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['driver']">
            <s-col :span="2"><s-checkbox label="driver">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="光驱" prop="driver">
                <s-input v-model="batchEditForm.driver"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['manufacturerName']">
            <s-col :span="2"><s-checkbox label="manufacturerName">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="显示器" prop="manufacturerName">
                <s-input v-model="batchEditForm.manufacturerName"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['memory']">
            <s-col :span="2"><s-checkbox label="memory">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="内存(MB)" prop="memory">
                <s-input v-model="batchEditForm.memory"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['capacity']">
            <s-col :span="2"><s-checkbox label="capacity">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="磁盘(MB)" prop="capacity">
                <s-input v-model="batchEditForm.capacity"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['orderingCost']">
            <s-col :span="2"><s-checkbox label="orderingCost">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="价格(RMB)" prop="orderingCost">
                <s-input v-model="batchEditForm.orderingCost"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['purchaseDate']">
            <s-col :span="2"><s-checkbox label="purchaseDate">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="购买日期" prop="purchaseDate">
                <s-date-picker v-model="batchEditForm.purchaseDate" type="datetime" value-format="yyyy-MM-dd HH:mm:dd" format="yyyy-MM-dd HH:mm:dd"></s-date-picker>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['guaranteeDate']">
            <s-col :span="2"><s-checkbox label="guaranteeDate">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="服务到期日" prop="guaranteeDate">
                <s-date-picker v-model="batchEditForm.guaranteeDate" type="datetime" value-format="yyyy-MM-dd HH:mm:dd" format="yyyy-MM-dd HH:mm:dd" :picker-options="pickerOptions0"></s-date-picker>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="inDataObj['contract']">
            <s-col :span="2"><s-checkbox label="contract">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item label="关联合同号" prop="contract">
                <s-input v-model="batchEditForm.contract"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
          <!-- 自定义开启应用、开启批量编辑属性 -->
          <s-row v-for="(item, $idx) in customDataObj" :key="$idx">
            <s-col :span="2"><s-checkbox :label="item.colnumName">&nbsp;</s-checkbox></s-col>
            <s-col :span="22">
              <s-form-item :label="item.colnumName" :title="item.colnumName" :prop="item.colnumName">
                <s-input
                  placeholder="请输入数值"
                  v-if="item.htmlType==='udf_long'"
                  v-model="batchEditForm[item.colnumName]"></s-input>
                <s-select
                  :clearable="true"
                  placeholder="请选择通用属性值"
                  v-else-if="item.htmlType==='udf_char_list'"
                  v-model="batchEditForm[item.colnumName]">
                  <s-option
                    v-for="(option, index) in item.dropDownOptionList"
                    :label="option.listvalues"
                    :value="option.listvalues"
                    :key="index"></s-option>
                </s-select>
                <s-date-picker
                  v-else-if="item.htmlType==='udf_date'"
                  v-model="batchEditForm[item.colnumName]"
                  type="datetime"
                  placeholder="请选择通用属性日期">
                </s-date-picker>
                <s-input
                  v-else
                  placeholder="请输入通用属性值"
                  v-model="batchEditForm[item.colnumName]"></s-input>
              </s-form-item>
            </s-col>
          </s-row>
        </s-checkbox-group>
      </s-form>
    </s-scrollbar>
    <s-row class="footer">
      <s-button @click="saveAssetsBatchEdit">保存</s-button>
      <s-button type="cancel" @click="cancelAssetsBatchEdit">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
import {Validaters} from 'sunflower-common-utils'
  import {batchUpdateMontior} from '../api/assetList_api'
  import mixinsAssetsBatchEdit from '../mixins/mixinsAssetsBatchEdit.js'

  export default{
    mixins: [mixinsAssetsBatchEdit],
    props: {
      batchEditAssets: {
        type: Array,
        required: true
      },
      ciTypeTreeData: {
        type: Array,
        required: true
      },
      batchEditSelect: { // 勾选的集合
        type: Array,
        required: true
      }
    },
    methods: {
      // 勾选的编辑项改变
      changeItemCheckList(arr) { // 动态添加表单验证却没有执行blur事件处理
        let checkNum = (rule, value, callback) => {
          let reg = /^(\-|\+)?\d+(\.\d{1,2})?$/
          if (value) {
            if (!reg.test(value)) {
              callback(new Error('最多可包含小数点后两位'))
            } else {
              let x = -2147483648;
              let y = 2147483648;
              if (parseFloat(value) <= y && parseFloat(value) >= x) {
                callback()
              } else {
                callback(new Error('请输入(-2147483648~2147483648)范围内的数值'))
              }
            }
          } else {
            callback()
          }
        };
        this.batchEditFormRules = {};
        for (let key of arr) {
          let obj = this.applicationPropertyObj[key];
          let validate = this.cloneBatchEditFormRules[key];
          if (obj.requiredStatus) { // 必填项
            if (validate) { // 校验存在
              if (key === 'citypeUuid') {
                this.$set(this.batchEditFormRules, 'citypeUuid', this.cloneBatchEditFormRules[key]);
              } else {
                this.$set(this.batchEditFormRules, key, [Validaters.NotNull, ...this.cloneBatchEditFormRules[key]])
              }
            } else {
              if (obj.htmlType === 'udf_long') {
                if (obj.defaultStatus) { // 内置属性
                  this.$set(this.batchEditFormRules, key, [Validaters.NotNull, {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}])
                } else { // 自定义属性
                  this.$set(this.batchEditFormRules, key, [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }])
                }
              } else if (obj.htmlType === 'udf_char_list') {
                this.$set(this.batchEditFormRules, key, [Validaters.SelectValNotNull])
              } else {
                this.$set(this.batchEditFormRules, key, [Validaters.NotNull])
              }
            }
          } else {
            if (obj.htmlType === 'udf_long') {
              if (obj.defaultStatus) { // 内置属性
                this.$set(this.batchEditFormRules, key, [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}])
              } else { // 自定义属性
                this.$set(this.batchEditFormRules, key, [{ validator: checkNum, trigger: 'blur' }])
              }
            } else if (validate) {
              this.$set(this.batchEditFormRules, key, validate);
            }
          }
        }
        this.$nextTick(() => {
          this.$refs['batchEditForm'].clearValidate();
        })
      },
      // 保存批量编辑
      saveAssetsBatchEdit() {
        this.$refs.batchEditForm.validate(valid => {
          if (valid) {
            let batchEditData = {
              uuids: this.batchEditAssets.map(item => item.uuid),
              property: {}
            };
            this.formItemCheckList.forEach(item => {
              batchEditData.property[item] = this.batchEditForm[item];
              if (this.customDataObj[item] && this.customDataObj[item].htmlType === 'udf_date') {
                batchEditData.property[item] = this.formatDate(new Date(this.batchEditForm[item]).getTime());
              }
            });
            if (batchEditData.property.maintenanceStaffuuid !== undefined || batchEditData.property.operationOrguuid !== undefined) {
              if (batchEditData.property.maintenanceStaffuuid === undefined || batchEditData.property.operationOrguuid === undefined) {
                this.$message({ message: '配置管理员机构和配置管理员若有一项被选，则两个都必须选择', type: 'warning' });
                return
              }
            }
            if (this.formItemCheckList.includes('productUuid')) {
              batchEditData.property.manufactUuid = this.batchEditForm.manufactUuid;
              batchEditData.property.productUuid = this.batchEditForm.productUuid;
              batchEditData.property.deviceTypeUuid = this.batchEditForm.deviceTypeUuid;
              if (this.formItemCheckList.includes('citypeUuid')) {
                this.batchEditForm.citypeUuid.map(item => {
                  if (item === 'customcmdbcitype0000000000000000') {
                    batchEditData.property.deviceTypeUuid = 'tdevicetypeinit00000000000000099'
                  }
                })
              }
            } else if (this.formItemCheckList.includes('citypeUuid')) {
              this.batchEditForm.citypeUuid.map(item => {
                if (item === 'customcmdbcitype0000000000000000') {
                  batchEditData.property.deviceTypeUuid = 'tdevicetypeinit00000000000000099'
                }
              })
            }
            let newArr = [];
            if (this.batchEditSelect.length > 0) {
              for (let i in this.batchEditSelect) {
                let param = {
                  name: this.batchEditSelect[i]['controlAdderss'] !== null ? this.batchEditSelect[i]['controlAdderss'] + '/' + this.batchEditSelect[i]['itcompName'] : this.batchEditSelect[i]['itcompName']
                };
                newArr.push(param);
              }
            }
            batchEditData.property.environment = Number(batchEditData.property.environment)
            batchUpdateMontior(batchEditData, {data: newArr, logTemplate: '批量编辑|资产(#name#)'}).then(({data}) => {
              if (data && data === 'success') {
                this.$emit('closeDialog', true);
                this.$nextTick(() => {
                  this.$message({ message: '编辑成功！', type: 'success' });
                })
              } else {
                this.$nextTick(() => {
                  this.$message({ message: '编辑失败，请重试！', type: 'error' });
                })
              }
            });
          } else {
            return false
          }
        });
      },
      // 取消批量编辑
      cancelAssetsBatchEdit() {
        this.$emit('closeDialog');
      }
    },
    created() {
      this.getApplicationProperty()// 获取所有开启应用、开启批量编辑的属性
      this.getManufactLists();// 厂商下拉选项
      this.getStatusOperations();   // 获取资产状态/配置管理员机构下拉选项
      this.getCompanyLists();       // 获取公司名称下拉选项
      this.getCitypeTreeList(); // 获取设备三级分类
      this.batchEditForm.orderingCostUnit = this.orderingCostUnitOption[0].value;
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #assets-batch-edit
    .s-form
      .s-col>.s-checkbox
        margin-top 10px
      .s-form-item .s-form-item-label
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      .s-form-item .s-form-item-content
        .inputTree
          width 96%
        .s-select,.s-date-editor
          width 96%
        > .s-input
          width 96%
      #custom-checkbox
        position absolute
        right 0
        top 122px
     .liSty{
       margin-top: 5px;
     }
    .footer
      text-align right
      width 98%
</style>
