<!--
 * @Author: 高建鹏
 * @Version: //Q4资产添加/编辑
 * @Description:资产添加编辑页面表单
 * @Position:资产列表-》添加/编辑
 * @Date: 2019-09-27 21:28:25
 * @LastEditors: mybells
 -->

<template>
  <section id="addAssetFormCtn">
    <s-form ref="addAssetForm" :model="addAssetForm" :rules="addAssetFormRules" label-width="130px">
      <div class="wrapper">
        <!-- 内置不能关闭应用属性 -->
        <div class="panel">
          <s-form-item label="资产名称" prop="monitorItcomp.itcompName">
            <s-input v-model="addAssetForm.monitorItcomp.itcompName"></s-input>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="IP地址" prop="monitorItcomp.controlAdderss">
            <s-input v-model="addAssetForm.monitorItcomp.controlAdderss" :class="{controlAdderss:!isApplication && permission}">
                <s-button slot="suffix" size="mini" title="IP地址分配" @click="allocationIP" v-if="!isApplication && permission">分配IP</s-button>
            </s-input>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="资产分类" prop="monitorItcomp.citypeUuid">
            <s-cascader
              style="width: 100%;"
              placeholder="请选择设备的三级分类"
              :options="citypeList"
              v-model="addAssetForm.monitorItcomp.citypeUuid"
              @change="selectTreeChange">
            </s-cascader>
          </s-form-item>
        </div>
        <div class="panel tall-panel" id="descr">
          <s-form-item label="资产描述">
            <s-input type="textarea" v-model="addAssetForm.monitorItcomp.descr" :maxlength="500"></s-input>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="厂商" prop="monitorItcomp.manufactUuid">
            <s-select v-model="addAssetForm.monitorItcomp.manufactUuid" @clear="emptyManufact" filterable clearable>
              <s-option
                v-for="(item, $index) in manufactOptions"
                :label="item.caption"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="型号" prop="monitorItcomp.productUuid">
            <s-select v-model="addAssetForm.monitorItcomp.productUuid" @clear="emptyProduct" @change="productChange" filterable clearable>
              <s-option
                v-for="(item, $index) in productOptions"
                :label="item.caption"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="资产状态" prop="monitorItcomp.cmdbAssetinfo.assetStatus">
            <s-select v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.assetStatus">
              <s-option
                v-for="(item, $index) in assetStatusLists"
                :label="item.assetstatusName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="配置管理员机构" prop="monitorItcomp.operationOrguuid">
            <s-select
              v-model="addAssetForm.monitorItcomp.operationOrguuid"
              @change="handleOperationOrgChange" filterable clearable>
              <s-option
                v-for="(item, $index) in operationOrgList"
                :label="item.departName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="配置管理员" prop="monitorItcomp.maintenanceStaffuuid">
            <s-select v-model="addAssetForm.monitorItcomp.maintenanceStaffuuid" filterable clearable>
              <s-option
                v-for="(item, $index) in configManagerList"
                :label="item.realNameAndEmail"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="公司名称" prop="monitorItcomp.firmUuid">
            <s-select v-model="addAssetForm.monitorItcomp.firmUuid" @clear="emptyFirmUuid" filterable clearable>
              <s-option
                v-for="(item, $index) in companyLists"
                :label="item.departName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel">
          <s-form-item label="使用部门" prop="monitorItcomp.cmdbOrguuid">
            <s-select v-model="addAssetForm.monitorItcomp.cmdbOrguuid" @clear="emptyCmdbOrguuid" filterable clearable>
              <s-option
                v-for="(item, $index) in departOrgLists"
                :label="item.departName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <!-- 内置已开启应用属性（可以关闭应用的内置属性） -->
        <div class="panel" v-if="inDataObj['是否禁ping']">
          <s-form-item label="是否禁ping" prop="monitorItcomp.isForbidPing">
            <s-radio class="radio" v-model="addAssetForm.monitorItcomp.isForbidPing" :label="1">是</s-radio>
            <s-radio class="radio" v-model="addAssetForm.monitorItcomp.isForbidPing" :label="0">否</s-radio>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['所在机柜']">
          <s-form-item label="所在机柜" prop="monitorItcomp.atCabinetNumber">
            <s-input v-model="addAssetForm.monitorItcomp.atCabinetNumber" :disabled="Threed"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['面板']">
          <s-form-item label="面板" prop="monitorItcomp.panel">
              <s-input v-model="addAssetForm.monitorItcomp.panel" >
                <s-upload slot='suffix' ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                  <s-button size='mini' id="s-upload-button">上传</s-button>
                </s-upload>
              </s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['尺寸']">
          <s-form-item label="尺寸(U)" prop="monitorItcomp.uAmount">
            <s-input v-model="addAssetForm.monitorItcomp.uAmount"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['资产编码']">
          <s-form-item label="资产编码" prop="monitorItcomp.ciCode">
            <s-input v-model="addAssetForm.monitorItcomp.ciCode"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['序列号']">
          <s-form-item label="序列号" prop="monitorItcomp.cmdbAssetinfo.assetSeries">
            <s-input v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.assetSeries"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['维护人']">
          <s-form-item label="维护人" prop="monitorItcomp.takeUser">
            <s-select v-model="addAssetForm.monitorItcomp.takeUser">
              <s-option
                v-for="(item, $index) in takeUserLists"
                :label="item.userRealName ? item.userRealName : item.userLoginName" :value="item.uuid" :key="$index">
              </s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['服务方式']">
          <s-form-item label="服务方式" prop="monitorItcomp.cmdbAssetinfo.serviceMode">
            <s-input v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.serviceMode"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['环境类型']">
          <s-form-item label="环境类型" prop="monitorItcomp.cmdbAssetinfo.environment">
            <s-select v-model.number="addAssetForm.monitorItcomp.cmdbAssetinfo.environment">
              <s-option
                v-for="(item, $index) in environmentTypeLists"
                :label="item.environmentName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['CPU型号']">
          <s-form-item label="CPU型号" prop="monitorItcomp.itcompServerProcessorList[0].cpuModle">
            <s-input v-model="addAssetForm.monitorItcomp.itcompServerProcessorList[0].cpuModle"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['光驱']">
          <s-form-item label="光驱" prop="monitorItcomp.cmdbAssetinfo.driver">
            <s-input v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.driver"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['显示器']">
          <s-form-item label="显示器" prop="monitorItcomp.itcompServerPeripheralList[0].manufacturerName">
            <s-input v-model="addAssetForm.monitorItcomp.itcompServerPeripheralList[0].manufacturerName"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['内存(MB)']">
          <s-form-item label="内存(MB)" prop="monitorItcomp.memory">
            <s-input v-model="addAssetForm.monitorItcomp.memory"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['磁盘(MB)']">
          <s-form-item  label="磁盘(MB)" prop="monitorItcomp.itcompServerHarddiskList[0].capacity">
            <s-input v-model="addAssetForm.monitorItcomp.itcompServerHarddiskList[0].capacity"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['价格(RMB)']">
          <s-form-item label="价格(RMB)" prop="monitorItcomp.cmdbAssetinfo.orderingCost">
            <s-input v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.orderingCost"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['购买日期']">
          <s-form-item label="购买日期" prop="monitorItcomp.cmdbAssetinfo.purchaseDate">
            <s-date-picker
              id="purchaseDate"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.purchaseDate"
              type="datetime"
              placeholder="请选择购买日期"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['服务到期日']">
          <s-form-item label="服务到期日" prop="monitorItcomp.cmdbAssetinfo.guaranteeDate">
            <s-date-picker
              id="guaranteeDate"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.guaranteeDate"
              type="datetime"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions0"
              placeholder="请选择服务到期日">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['关联合同号']">
          <s-form-item label="关联合同号" prop="monitorItcomp.cmdbAssetinfo.contract">
            <s-input v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.contract"></s-input>
          </s-form-item>
        </div>
        <div class="panel" v-if="inDataObj['资产重要程度']">
          <s-form-item label="资产重要程度" prop="monitorItcomp.important">
            <s-select v-model="addAssetForm.monitorItcomp.important" style="width: 100%;">
              <s-option label="很高" :value="2">很高</s-option>
              <s-option label="高" :value="3">高</s-option>
              <s-option label="中等" :value="4">中等</s-option>
              <s-option label="低" :value="5">低</s-option>
              <s-option label="很低" :value="6">很低</s-option>
            </s-select>
          </s-form-item>
        </div>
        <!-- 自定义属性（应用已开启） -->
        <div class="panel" v-for="(item, $idx) in customDataObj" :key="$idx">
          <s-form-item
            class="common-property-form-item"
            :prop="`monitorItcomp.cmdbAssetinfo.commonPropValueList.${item.colnumName}`">
            <label :title="item.colnumName" slot="label" :for="`monitorItcomp.cmdbAssetinfo.commonPropValueList.${item.colnumName}`">{{item.colnumName}}</label>
            <s-input
              v-if="item.htmlType==='udf_long'"
              placeholder="请输入数值"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList[item.colnumName]"></s-input>
            <s-select
              :clearable="true"
              placeholder="请选择通用属性值"
              v-else-if="item.htmlType==='udf_char_list'"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList[item.colnumName]">
              <s-option
                v-for="(option, index) in item.dropDownOptionList"
                :label="option.listvalues"
                :value="option.listvalues"
                :key="index"></s-option>
            </s-select>
            <s-date-picker
              v-else-if="item.htmlType==='udf_date'"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList[item.colnumName]"
              type="datetime"
              :editable="false"
              :clearable="false"
              placeholder="请选择通用属性日期">
            </s-date-picker>
            <s-input
              v-else
              placeholder="请输入通用属性值"
              v-model="addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList[item.colnumName]"></s-input>
          </s-form-item>
        </div>
      </div>
    </s-form>
    <s-row class="btn" v-if="permission">
      <!--通过详情页的"数字链接"跳转至编辑页面，判断是否禁用"保存"按钮-->
      <s-button @click="saveAssetAdd" :disabled="saveDisabled">保 存
      </s-button>
      <s-button @click="resetAssetAdd">重 置
      </s-button>
    </s-row>

    <!--ip分配选择弹框-->
    <ip-allocation-dialog v-model="allocationDialog" v-if="allocationDialog" @allocation="changeip"></ip-allocation-dialog>
  </section>
</template>

<script type="text/babel">
  import {cloneDeep} from 'lodash'
  import $axios from 'sunflower-ajax'
  import mixinAssetAddForm from './mixins/mixinAssetAddForm'
  import { constructor } from './api/propertyConstructor'

  export default{
    mixins: [mixinAssetAddForm],
    props: {
      assetUuidProp: {
        type: String,
        default: ''
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      }
    },
    methods: {
      // 保存资产新增
      saveAssetAdd() {
        if (this.$route.query.disEdit === '1') return
        this.validAssetAddForm(() => {
          this.saveDisabled = true;
          let saveData = cloneDeep(this.addAssetForm);
          /**
           * 添加配置项管理>通用属性字段
           */
          saveData.monitorItcomp.cmdbAssetinfo.generalPropertiesValueList = [];
          for (let key in saveData.monitorItcomp.cmdbAssetinfo.commonPropValueList) {
            let value = saveData.monitorItcomp.cmdbAssetinfo.commonPropValueList[key]
            let htmlType = this.customDataObj[key].htmlType;
            // 当通用属性某个字段没有值时
            if (!value) {
              // 如果字段是Date类型，置为null
              if (htmlType === 'udf_date') {
                value = null;
              } else if (htmlType === 'udf_long') {
                // 如果字段是数值类型且值不为0，置为null
                if (value !== 0) {
                  value = null;
                }
              } else {
                // 如果字段为下拉框或者input类型时，置为空字符串。
                value = '';
              }
            } else {
              if (htmlType === 'udf_date') {
                value = this.formatDate(value);
              }
              if (htmlType === 'udf_long') {
                value = parseFloat(value);
              }
            }

            this.customDataObj[key].propertyValue = value;
            saveData.monitorItcomp.cmdbAssetinfo.generalPropertiesValueList.push(this.customDataObj[key]);
          }

          // "购买时间"字段有值时，将Date转换为格式化的字符串
          saveData.monitorItcomp.cmdbAssetinfo.purchaseDate = saveData.monitorItcomp.cmdbAssetinfo.purchaseDate
            ? this.formatDate(new Date(saveData.monitorItcomp.cmdbAssetinfo.purchaseDate).getTime())
            : null;
          // "服务到期日"字段有值时，将Date转换为格式化的字符串
          saveData.monitorItcomp.cmdbAssetinfo.guaranteeDate = saveData.monitorItcomp.cmdbAssetinfo.guaranteeDate
            ? this.formatDate(new Date(saveData.monitorItcomp.cmdbAssetinfo.guaranteeDate).getTime())
            : null;

          /**
           * 设备三级分类，citypeUuid v-model的值为数组，
           * 上传时获取最后一级的uuid赋值给citypeUuid
           */
          saveData.monitorItcomp.citypeUuid = saveData.monitorItcomp.citypeUuid.concat([]).reverse()[0];
          if (saveData.monitorItcomp.citypeUuid === 'customcmdbcitype0000000000000000') {
            saveData.monitorItcomp.deviceTypeUuid = 'tdevicetypeinit00000000000000099'
          } else if (saveData.monitorItcomp.modelNumber !== '') {
            saveData.monitorItcomp.deviceTypeUuid = this.modelSelectDeviceTypeUuid;
          } else {
            saveData.monitorItcomp.deviceTypeUuid = '';
          }

          let {query, params} = this.$route;
          if (query.addType && !this.saveAssetUuid) {
            let option = {
              data: [{name: saveData.monitorItcomp.controlAdderss ? (saveData.monitorItcomp.controlAdderss + '/' + saveData.monitorItcomp.itcompName) : saveData.monitorItcomp.itcompName}],
              logTemplate: '添加|资产(#name#)'
            }
            $axios.post('/resourcemanager/assetmanager/itasset/save', saveData, option).then(({data}) => {
              if (typeof data === 'string') {
                if (data.indexOf('success') !== -1) {
                  this.$message.success('保存成功！')
                  this.saveAssetUuid = data.slice(7)
                  this.$emit('getAssetSaveUuid', data.slice(7))
                  this.getDetailData(this.saveAssetUuid, true)
                  this.$router.push({
                    path: `assetEdit/${this.saveAssetUuid}/0`
                  })
                } else {
                  if (data.indexOf('failcount') !== -1) {
                    this.$message.error('资产点数达到上限，添加失败！')
                  } else if (data.indexOf('fail') !== -1) {
                    this.$message.error('资产IP已存在，请勿重复添加！')
                  }
                  this.saveDisabled = false;
                }
              } else {
                this.$message.error('保存失败，请重试！')
              }
            })
          } else if (params.assetUuid || (this.saveAssetUuid && this.saveAssetUuid.length > 0)) {
            // 编辑保存时，上传资产uuid
            saveData.monitorItcomp.uuid = params.assetUuid || this.saveAssetUuid;

            // "组织部门"为空时，上传值改为null
            if (!saveData.monitorItcomp.cmdbOrguuid) saveData.monitorItcomp.cmdbOrguuid = null;

            /**
             * 编辑时，比较当前"资产IP"值和上次入库的值是否一致
             * 有更改：monitorUpdate = 0
             * 没改动：monitorUpdate = 1
             */
            saveData.monitorItcomp.monitorUpdate = saveData.monitorItcomp.controlAdderss === this.originData.controlAdderss ? 1 : 0;
            let option = {
              data: [{name: saveData.monitorItcomp.controlAdderss ? (saveData.monitorItcomp.controlAdderss + '/' + saveData.monitorItcomp.itcompName) : saveData.monitorItcomp.itcompName}],
              logTemplate: '编辑|资产(#name#)'
            };
            $axios.post('/resourcemanager/assetmanager/itasset/update', saveData, option).then(({data}) => {
              if (typeof data === 'string' && data.indexOf('success') !== -1) {
                this.$message.success('编辑成功！')
                // 自动巡检接口（传与初始值不同的key-value对象）
                this.autoPolling(saveData);
                this.getDetailData(saveData.monitorItcomp.uuid, true)
              } else {
                this.$message.error('编辑失败！')
              }
            })
          }
        }, false)
      },
      // 关闭资产新增
      resetAssetAdd() {
        if (this.$route.query.disEdit === '1') return
        if (this.$route.query.addType && !this.saveAssetUuid) {
          let formObj = {}
          for (let key in this.applicationProperty) {
            let obj = this.applicationProperty[key];
            this.$set(
              formObj,
              obj.colnumName, obj.defaultValue
            )
            if (obj.colnumName === '资产重要程度' || obj.colnumName === '是否禁ping' || obj.colnumName === '环境类型') {
              this.$set(
                formObj,
                obj.colnumName, parseInt(obj.defaultValue)
              )
            }
          }
          for (let key in formObj) {
            for (let item in constructor) {
              if (key === constructor[item]) {
                if (this.addAssetForm.monitorItcomp.cmdbAssetinfo.hasOwnProperty(item)) {
                  this.addAssetForm.monitorItcomp.cmdbAssetinfo[item] = formObj[key]
                } else {
                  this.addAssetForm.monitorItcomp[item] = formObj[key]
                }
              }
            }
          }
          for (let key in this.customDataObj) {
            let obj = this.customDataObj[key];
            this.$set(
              this.addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList,
              obj.colnumName, obj.defaultValue
            )
          }
          // "新增"操作
          this.addAssetForm.monitorItcomp.citypeUuid = this.$route.query.addType;
          // init资产分类默认值
          this.selectTreeChange(this.$route.query.addType);
        } else if (this.$route.params.assetUuid || this.saveAssetUuid) {
          this.getDetailData(this.$route.params.assetUuid || this.saveAssetUuid, false)
        }
      },
      // 获取资产详情（编辑）
      getDetailData(assetUuid, isEditPage = true) {
        $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${assetUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            // 给tab传的值
            if (isEditPage) {
              this.$emit('getAttrvalueView', data.attributeMap);
            }
            this.$emit('getCitypeUuid', data.citypeUuid);
            // this.saveAssetUuid = data.uuid
            // 上次入库"配置项编码"记录，用于编辑时重复性验证
            this.originData.ciCode = data.cmdbCi.ciCode;
            // 上次入库的"资产IP"，用于判断编辑时是否更改了设备IP，从而确定monitorUpdate字段
            this.originData.controlAdderss = data.controlAdderss;

            /**
             * 编辑时，将"设备类型"自身deviceTypeUuid保存。
             * 用于当用户取消"自定义"checkbox时，重新赋值为"设备类型"自身deviceTypeUuid
             */
            this.modelSelectDeviceTypeUuid = data.deviceTypeUuidOld ? data.deviceTypeUuidOld : '';

            let tempForm = {
              'IP地址': data.controlAdderss,
              monitorItcomp: {
                itcompName: data.itcompName,
                controlAdderss: data.controlAdderss,
                citypeUuid: [],
                descr: data.descr,
                manufactUuid: data.manufactUuid,
                productUuid: data.productUuid,
                cmdbAssetinfo: {
                  assetStatus: data.cmdbAssetinfo.assetStatus,
                  assetSeries: data.cmdbAssetinfo.assetSeries,
                  environment: data.cmdbAssetinfo.environment,
                  serviceMode: data.cmdbAssetinfo.serviceMode,
                  driver: data.cmdbAssetinfo.driver,
                  orderingCost: data.cmdbAssetinfo.orderingCost,
                  purchaseDate: data.cmdbAssetinfo.purchaseDate ? new Date(data.cmdbAssetinfo.purchaseDate) : null,
                  guaranteeDate: data.cmdbAssetinfo.guaranteeDate ? new Date(data.cmdbAssetinfo.guaranteeDate) : null,
                  contract: data.cmdbAssetinfo.contract,
                  id: data.cmdbAssetinfo.id,
                  commonPropValueList: {}
                },
                maintenanceStaffuuid: data.operationOrguuid ? data.maintenanceStaffuuid : null,
                operationOrguuid: data.operationOrguuid ? data.operationOrguuid : null,
                firmUuid: data.firmUuid ? data.firmUuid : null,
                cmdbOrguuid: data.cmdbOrganization ? data.cmdbOrganization.uuid : null,
                important: data.important ? data.important : 4,
                isForbidPing: data.isForbidPing,
                atCabinetNumber: data.atCabinetNumber,
                panel: data.panel,
                uAmount: data.uAmount,
                ciCode: data.cmdbCi.ciCode,
                takeUser: data.takeUser,
                itcompServerProcessorList: data.itcompServerProcessorList.length > 0
                  ? data.itcompServerProcessorList : [{cpuModle: null}],    // CPU型号
                itcompServerPeripheralList: data.itcompServerPeripheralList.length > 0
                  ? data.itcompServerPeripheralList : [{manufacturerName: null}],     // 外设-显示器
                memory: data.memory,
                itcompServerHarddiskList: data.itcompServerHarddiskList.length > 0
                  ? data.itcompServerHarddiskList : [{capacity: null}],     // 硬盘容量
                // 资产型号选择回显为: 厂商(型号)
                modelNumber: `${data.manufactCaption ? data.manufactCaption : ''}${data.productCaption ? `(${data.productCaption})` : ''}`,
                /* 编辑赋初值时，因选择"设备型号弹框"select事件无法触发，手动从接口返回值补充上传参数 */
                deviceTypeUuid: data.deviceTypeUuid,
                defCompId: data.defCompId// 协议设置凭证检测需要这个字段
              }
            };

            // 一级分类是应用的话分配ip按钮屏蔽
            if (data.fristTypeUuid === 'fdc689052311432f8efa5cb7416d5f10') {
              this.isApplication = true;
            } else {
              this.isApplication = false;
            }
            // 设备三级分类数据处理
            if (data.fristTypeUuid && data.secondTypeUuid) {
              if (data.threeTypeUuid) {
                // 一二三级都存在
                tempForm.monitorItcomp.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid, data.threeTypeUuid]
              } else {
                // 只存在一二级
                tempForm.monitorItcomp.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid]
              }
            }

            // 获取自定义通用属性值列表(input v-model的变量)
            if (data.cmdbAssetinfo.assetAtachAttr && Object.keys(data.cmdbAssetinfo.assetAtachAttr).length > 0) {
              for (let i in this.customDataObj) {
                let item = this.customDataObj[i];
                for (let key in data.cmdbAssetinfo.assetAtachAttr) {
                  if (item.colnumName === key) {
                    this.$set(
                      tempForm.monitorItcomp.cmdbAssetinfo.commonPropValueList,
                      item.colnumName,
                      data.cmdbAssetinfo.assetAtachAttr[key]
                    )
                  }
                }
              }
            }
            this.oldTempForm = this.saveOldData(tempForm);
            this.addAssetForm = tempForm;
            this.saveDisabled = false;// 保存按钮可以点击
            this.$nextTick(() => {
              this.addAssetForm.monitorItcomp.productUuid = data.productUuid;
            })
          }
        })
      }
    },
    created() {
      // 获取厂商下拉列表
      this.addType = this.$route.query.addType;
      if (this.$store.state.userData.registerModelList.includes('THREED')) {
        this.Threed = true
      }
      this.getInitData().then(() => {
        let {query, params} = this.$route
        // 解决添加页面一进入表单已验证的问题
        if (query.addType) {
          this.addFlag = true;
          for (let key in this.customDataObj) {
            let obj = this.customDataObj[key];
            this.$set(
              this.addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList,
              obj.colnumName, obj.defaultValue
            )
          }
          this.applicationProperty = this.applicationProperty.reduce((monitor, item) => {
            monitor[item.colnumName] = item;
            return monitor;
          }, {})
          let formObj = {}
          for (let key in this.applicationProperty) {
            let obj = this.applicationProperty[key];
            this.$set(
              formObj,
              obj.colnumName, obj.defaultValue
            )
            if (obj.colnumName === '资产重要程度' || obj.colnumName === '是否禁ping' || obj.colnumName === '环境类型') {
              this.$set(
                formObj,
                obj.colnumName, parseInt(obj.defaultValue)
              )
            }
          }
          for (let key in formObj) {
            for (let item in constructor) {
              if (key === constructor[item]) {
                if (this.addAssetForm.monitorItcomp.cmdbAssetinfo.hasOwnProperty(item)) {
                  this.addAssetForm.monitorItcomp.cmdbAssetinfo[item] = formObj[key]
                } else {
                  this.addAssetForm.monitorItcomp[item] = formObj[key]
                }
              }
            }
          }
          // "新增"操作
          this.addAssetForm.monitorItcomp.citypeUuid = query.addType;
          // init资产分类默认值
          this.selectTreeChange(query.addType);
        } else if (params.assetUuid) {
          // "编辑"操作
          this.getDetailData(params.assetUuid);
        }
        // this.$refs.addAssetForm.clearValidate()
      }).catch(() => {
        this.$message.error('获取数据失败，请刷新重试！')
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #addAssetFormCtn{
    .btn{
      text-align: left;
      padding:20px 0 20px 130px;
    }
    .wrapper{
      gap:10px 30px;
      display:grid;
      grid-template-columns:repeat(4,1fr);
      .panel{
        .controlAdderss .s-input-inner {
          padding-right:70px;
        }
        // border:1px solid;
        .s-form-item{
          margin-bottom:0;
          .s-select, .s-date-editor{
            width 100%
          }
        }
        .common-property-form-item{
          .s-form-item-label{
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
          }
        }
        #asset-ordering-cost{
          .s-form-item-error{
            display none
          }
          #asset-ordering-cost-error-tip{
            color #fa5555
            font-size 12px
            line-height 1
            padding-top 4px
            position absolute
            top 100%
            left 0
          }
        }
      }
      .tall-panel{
        grid-row:1/4;
        grid-column:4/5;
        .s-form-item{
          height:100%;
          .s-form-item-content{
            height:calc(100% - 10px);
            margin-top:5px
          }
          .s-textarea,.s-textarea-inner{
            height:100%;
          }
        }
      }
  .liSty{
    margin-top: 5px;
  }
    }
  }
</style>
