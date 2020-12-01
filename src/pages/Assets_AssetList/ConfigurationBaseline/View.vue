/*
create by YOU
*/
<template>
  <div v-loading="loading" style="margin-bottom: 30px;">
    <s-card class="box-card no-border-bottom" style="border: none;">
      <div slot="header">
        <span class="card-title">
          <i class="iconfont icon-tag"></i>
            通用属性
        </span>
        <span style="float: right;">
          <span v-show="!editable">
            <s-button icon="edit" @click="doEdit"></s-button>
            <s-button icon="arrow-left" title="返回" @click="goBack"></s-button>
          </span>
          <span v-show="editable">
            <s-button icon="plus" @click="doAdd"></s-button>
            <s-button @click="saveEdit">保存</s-button>
            <s-button @click="cancelEdit" type="cancel">取消</s-button>
          </span>
        </span>
      </div>
      <s-form label-width="120px" ref="baseForm" :model="baseForm" :rules="rules">
        <waterfall-form ref="waterfall" :editable="editable" :data="baseForm">
          <s-form-item label="资产名称" prop="itcompName">
            <s-input v-model="baseForm.itcompName"></s-input>
          </s-form-item>
          <s-form-item label="IP地址" prop="controlAdderss">
            <s-input v-model="baseForm.controlAdderss"></s-input>
          </s-form-item>
          <s-form-item label="资产分类" prop="category">
            <s-cascader
              style="width: 100%;"
              placeholder="请选择设备的三级分类"
              :options="citypeList"
              v-model="baseForm.category">
            </s-cascader>
          </s-form-item>
          <s-form-item label="资产描述" prop="descr">
            <s-input v-model="baseForm.descr" type="textarea" :rows="3" resize="none" :maxlength="500"></s-input>
          </s-form-item>
          <s-form-item label="厂商" prop="manufact">
            <s-select v-model="baseForm.manufact">
              <s-option
                v-for="(item, $index) in manufactOptions"
                :label="item.caption"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="型号" prop="modelNumber">
            <s-select v-model="baseForm.modelNumber">
              <s-option
                v-for="(item, $index) in productOptions"
                :label="item.caption"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="资产状态" prop="assetStatus">
            <s-select v-model="baseForm.assetStatus" style="width: 100%;">
              <s-option
                v-for="(item, $index) in assetStatusLists"
                :label="item.assetstatusName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="配置管理员机构" prop="operationDepartment">
            <s-select v-model="baseForm.operationDepartment" style="width: 100%;">
              <s-option
                v-for="(item, $index) in operationOrgList"
                :label="item.departName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="配置管理员" prop="maintenanceStaffuuid">
            <s-select v-model="baseForm.maintenanceStaffuuid" style="width: 100%;">
              <s-option
                v-for="(item, $index) in configManagerList"
                :label="item.realNameAndEmail"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="公司名称" prop="firmName">
            <s-select v-model="baseForm.firmName" style="width: 100%;">
              <s-option
                v-for="(item, index) in companyLists"
                :label="item.departName"
                :value="item.uuid"
                :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="使用部门" prop="cmdbOrgName">
            <s-select v-model="baseForm.cmdbOrgName" style="width: 100%;">
              <s-option
                v-for="(item, index) in departOrgLists"
                :label="item.departName"
                :value="item.uuid"
                :key="index"></s-option>
            </s-select>
          </s-form-item>
          <!-- 内置已开启应用属性（可以关闭应用的内置属性） -->
          <s-form-item label="资产重要程度" prop="important" v-if="'important' in baseForm">
            <s-select v-model="baseForm.important" style="width: 100%;">
            <s-option label="很高" :value="2">很高</s-option>
            <s-option label="高" :value="3">高</s-option>
            <s-option label="中等" :value="4">中等</s-option>
            <s-option label="低" :value="5">低</s-option>
            <s-option label="很低" :value="6">很低</s-option>
          </s-select>
          </s-form-item>
          <s-form-item label="是否禁ping" prop="isForbidPing" v-if="'isForbidPing' in baseForm">
            <s-radio-group v-model="baseForm.isForbidPing">
              <s-radio class="radio" :label="1">是</s-radio>
              <s-radio class="radio" :label="0">否</s-radio>
            </s-radio-group>
            <!-- <s-select v-model="baseForm.isForbidPing" style="width: 100%;">
              <s-option label="否" :value="0"></s-option>
              <s-option label="是" :value="1"></s-option>
            </s-select> -->
          </s-form-item>
          <s-form-item label="所在机柜" prop="atCabinetNumber" v-if="'atCabinetNumber' in baseForm">
            <s-input v-model="baseForm.atCabinetNumber" :disabled="showThreeD"></s-input>
          </s-form-item>
          <s-form-item label="面板" prop="panel" v-if="'panel' in baseForm">
            <s-input v-model="baseForm.panel">
              <s-upload slot='suffix' ref="upload" :action="upLoadUrl" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :show-file-list="false">
                <s-button size='mini' id="s-upload-button">上传</s-button>
              </s-upload>
            </s-input>
          </s-form-item>
          <s-form-item label="尺寸(U)" prop="uAmount" v-if="'uAmount' in baseForm">
            <s-input v-model="baseForm.uAmount"></s-input>
          </s-form-item>
          <s-form-item label="资产编码" prop="ciCode" v-if="'ciCode' in baseForm">
            <s-input v-model="baseForm.ciCode"></s-input>
          </s-form-item>
          <s-form-item label="序列号" prop="assetSeries" v-if="'assetSeries' in baseForm">
            <s-input v-model="baseForm.assetSeries"></s-input>
          </s-form-item>
          <s-form-item label="维护人" prop="takeUser" v-if="'takeUser' in baseForm">
            <s-select v-model="baseForm.takeUser">
              <s-option
                v-for="(item, $index) in takeUserLists"
                :label="item.userLoginName ? item.userLoginName : item.userRealName" :value="item.uuid" :key="$index">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="服务方式" prop="serviceMode" v-if="'serviceMode' in baseForm">
            <s-input v-model="baseForm.serviceMode"></s-input>
          </s-form-item>
          <s-form-item label="环境类型" prop="environment" v-if="'environment' in baseForm">
            <s-select v-model="baseForm.environment" style="width: 100%;">
              <s-option
                v-for="(item, $index) in environmentTypeLists"
                :label="item.environmentName"
                :value="item.uuid"
                :key="$index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="CPU型号" prop="cpuModle" v-if="'cpuModle' in baseForm">
            <s-input v-model="baseForm.cpuModle"></s-input>
          </s-form-item>
          <s-form-item label="光驱" prop="driver" v-if="'driver' in baseForm">
            <s-input v-model="baseForm.driver"></s-input>
          </s-form-item>
          <s-form-item label="显示器" prop="manufacturerName" v-if="'manufacturerName' in baseForm">
            <s-input v-model="baseForm.manufacturerName"></s-input>
          </s-form-item>
          <s-form-item label="内存(MB)" prop="memory" v-if="'memory' in baseForm">
            <s-input v-model="baseForm.memory"></s-input>
          </s-form-item>
          <s-form-item label="磁盘(MB)" prop="capacity" v-if="'capacity' in baseForm">
            <s-input v-model="baseForm.capacity"></s-input>
          </s-form-item>
          <s-form-item label="价格(RMB)" prop="orderingCost" v-if="'orderingCost' in baseForm">
            <s-input v-model="baseForm.orderingCost" type="number"></s-input>
          </s-form-item>
          <s-form-item label="购买日期" prop="purchaseDate" v-if="'purchaseDate' in baseForm">
            <s-date-picker
              v-model="baseForm.purchaseDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:dd"
              style="width: 100%"
              placeholder="选择日期">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="服务到期日" prop="guaranteeDate" v-if="'guaranteeDate' in baseForm">
            <s-date-picker
              v-model="baseForm.guaranteeDate"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:dd"
              style="width: 100%"
              :picker-options="pickerOptions0"
              placeholder="选择日期">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="关联合同号" prop="contract" v-if="'contract' in baseForm">
            <s-input v-model="baseForm.contract"></s-input>
          </s-form-item>
          <!-- <s-form-item label="资产型号" prop="modelNumber">
            <s-input v-model="baseForm.modelNumber"
                     readonly icon="plus"
                     class="inputDialog"
                     ref="modelInput"></s-input>
          </s-form-item> -->


          <s-form-item
            v-for="(tem, index) in baseForm.commonForm"
            :label="baseForm.commonForm[index].label"
            :key="index"
            :prop="`commonForm.${index}.value`"
            style="cursor: pointer">
            <s-row>
              <s-col :span="21">
                <s-select v-if="listFormItems.indexOf(index) !== -1" v-model="baseForm.commonForm[index].value"
                          style="width: 100%;">
                  <s-option v-for="option in selectField[index]" :value="option.listvalues" :label="option.listvalues"
                            :key="option.listvalues"></s-option>
                </s-select>
                <s-input v-else-if="textareaFormItems.indexOf(index) !== -1" v-model="baseForm.commonForm[index].value"
                         type="text" :rows="3" resize="none"></s-input>
                <s-date-picker
                  v-else-if="dateFormItems.indexOf(index) !== -1"
                  v-model="baseForm.commonForm[index].value"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                  placeholder="选择日期">
                </s-date-picker>
                <s-input v-else-if="intFormItems.indexOf(index) !== -1" type="number"
                         v-model="baseForm.commonForm[index].value"></s-input>
                <s-input v-else v-model="baseForm.commonForm[index].value"></s-input>
              </s-col>
              <s-col :span="3" style="text-align: center">
                <i v-if="index !== '11'" class="iconfont icon-error-bold icon-delete-item"
                   style="color: rgb(231, 60, 61);cursor: pointer;"
                   title="删除当前项"
                   @click="removeItem(index, baseForm.commonForm)"></i>
              </s-col>
            </s-row>
          </s-form-item>
        </waterfall-form>
      </s-form>
    </s-card>
    <s-card class="box-card no-border-bottom" style="border: none;">
      <div slot="header">
        <span class="card-title">
          <i class="iconfont icon-source"></i>
            特殊属性
        </span>
      </div>
      <s-form label-width="120px" ref="specialForm" :model="specialForm" :rules="rules">
        <waterfall-form ref="waterfallSpecial" :data="specialForm" :editable="editable">
          <s-form-item v-for="(item, index) in specialForm" :label="specialForm[index].label" :key="index" :prop="`${index}.value`"
                       style="cursor: pointer">
            <s-row>
              <s-col :span="21">
                <s-select v-if="listFormItems.indexOf(index) !== -1" v-model="specialForm[index].value"
                          style="width: 100%;">
                  <s-option v-for="option in selectField[index]" :value="option.listvalues" :label="option.listvalues"
                            :key="option.listvalues"></s-option>
                </s-select>
                <s-input v-else-if="textareaFormItems.indexOf(index) !== -1" v-model="specialForm[index].value"
                         type="text"
                         :rows="3" resize="none"></s-input>
                <s-date-picker
                  v-else-if="dateFormItems.indexOf(index) !== -1"
                  v-model="specialForm[index].value"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%"
                  placeholder="选择日期">
                </s-date-picker>
                <s-input v-else-if="intFormItems.indexOf(index) !== -1" type="number"
                         v-model="specialForm[index].value"></s-input>
                <s-input v-else v-model="specialForm[index].value"></s-input>
              </s-col>
              <s-col :span="3" style="text-align: center">
                <i v-if="index !== '11'" class="iconfont icon-error-bold icon-delete-item"
                   style="color: rgb(231, 60, 61);cursor: pointer;"
                   title="删除当前项"
                   @click="removeItem(index, specialForm)"></i>
              </s-col>
            </s-row>
          </s-form-item>
        </waterfall-form>
      </s-form>
    </s-card>
    <!-- icon-source icon-backup -->
    <s-dialog v-model="addDialog" v-if="addDialog" title="添加属性">
      <s-scrollbar wrap-style="max-height:500px;">
        <add-attribute
          ref="addAttribute"
          :commonNameList="addDialog_RestcommonStatusList"
          :baselineUuid="baselineUuid"
          :itcompUuid="$route.params.id">
        </add-attribute>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitAttributes">确定</s-button>
        <s-button type="cancel" @click="addDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  import {cloneDeep, indexOf} from 'lodash'
  import {Validaters} from 'sunflower-common-utils'
  import WaterfallForm from './Waterfall.vue'
  import AddAttribute from './AddAttribute.vue'
  import $axios from 'sunflower-ajax'
  export default {
    components: {
      WaterfallForm,
      AddAttribute
    },
    data() {
      // 验证资产编码重复性
      let validateCiCode = (rule, value, callback) => {
        if (value) {
          let editExistAsset = this.originForm.ciCode === this.baseForm.ciCode
          if (editExistAsset) {
            callback()
          } else {
            $axios.post('/resourcemanager/assetmanager/itasset/ciCodeValidate', {data: value}).then(({data}) => {
              if (data) {
                if (parseInt(data) === 0) {
                  callback()
                } else if (parseInt(data) !== 0) {
                  callback(new Error('该资产编码已存在！'))
                }
              } else {
                callback(new Error('重复性验证失败！'))
              }
            })
          }
        } else {
          callback()
        }
      };
      // 检测资产价格
      let checkOrderingCost = (rule, value, callback) => {
        if (!value && value !== 0) {
          callback()
        } else {
          let reg = /^\d+(\.{0,1}\d+){0,1}$/
          if (!reg.test(value)) {
            callback(new Error('请输入数字'))
          } else {
            if (value > 2147483647) {
              callback(new Error('最大值为：2147483647'))
            } else {
              callback()
            }
          }
        }
      };
      return {
        baselineUuid: '',
        upLoadUrl: '',
        loading: false,
        isCurrent: true,
        editable: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        // 表单
        baseForm: {commonForm: {}},
        specialForm: {},
        rules: {
          /* 内置默认开启属性 */
          'itcompName': [{ required: true, message: '不能为空', trigger: 'blur' }, Validaters.Max(30)],
          'controlAdderss': [Validaters.IP],
          'category': [{ type: 'array', required: true, message: '不能为空', trigger: 'blur' }],
          'descr': [{ max: 500, message: '最大长度为500个字符', trigger: 'blur' }],
          'assetStatus': [{ required: true, message: '不能为空', trigger: 'change' }],
          'operationDepartment': [{required: true, message: '不能为空', trigger: 'change'}],
          'maintenanceStaffuuid': [{required: true, message: '不能为空', trigger: 'change'}],
          /* 内置可以修改属性 */
          // 'important': [{required: true}],
          'atCabinetNumber': [{ max: 50, message: '字符长度不能大于50', trigger: 'blur' }],
          'serviceMode': [{ max: 50, message: '字符长度不能大于50', trigger: 'blur' }],
          'takeUser': [{max: 50, message: '字符长度不能大于50', trigger: 'blur'}, Validaters.Name],
          'ciCode': [{ validator: validateCiCode, trigger: 'blur' }],
          'capacity': [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
          'memory': [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
          'uAmount': [{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数', trigger: 'blur'}],
          'orderingCost': [{ validator: checkOrderingCost, trigger: 'blur' }]
        },
        // 表单项类型记录, 区分下拉列表和文本框
        listFormItems: [],
        textareaFormItems: [],
        dateFormItems: [],
        intFormItems: [],
        // 通用属性和特殊属性下拉列表
        selectField: {},
        companyLists: [],  // 公司名称列表
        departOrgLists: [], // 组织部门列表
        manufactOptions: [], // 厂商
        productOptions: [], // 型号
        citypeList: [], // 三级分类列表
        uuidNameArr: [], // 三级分类拼数据的时候用了这个
        takeUserLists: [], // 维护人下拉列表
        // 环境类型下拉选项
        environmentTypeLists: [{
          environmentName: '开发环境',
          uuid: 4
        }, {
          environmentName: '测试环境',
          uuid: 1
        }, {
          environmentName: '生产环境',
          uuid: 0
        }, {
          environmentName: '灾备环境',
          uuid: 2
        }, {
          environmentName: '其他',
          uuid: 3
        }],
        assetStatusLists: [],         // 资产状态下拉选项
        operationOrgList: [],          // 运维责任机构列表
        configManagerList: [],        // 配置管理员列表
        textAreas: ['配置项编码', '14'],
        // 数据中转
        originData: [],
        tmpData: [],                  // 临时存储新加的属性
        originForm: {},
        originCommonForm: {},
        originSpecialForm: {},
        deletedList: [],
        addDialog: false,
        addDialog_RestcommonStatusList: [],
        assetModelDialog: false,
        showThreeD: false
      }
    },
    watch: {
      editable(val) {
        if (val) {
          // 记录表单数据，取消编辑时重置表单
          this.originForm = cloneDeep(this.baseForm)
          // this.originCommonForm = cloneDeep(this.commonForm)
          this.originSpecialForm = cloneDeep(this.specialForm)
          this.deletedList = []
        }
      },
      // "厂商"改变 -> 获取厂商下的"型号"
      'baseForm.manufact'(val, oldVal) {
        if (val) {
          this.getProductLists(val)
          if (oldVal) {
            this.baseForm.modelNumber = ''
          }
        }
      },
      'baseForm.firmName': function (val, oldVal) {
        if (val) {
          this.getDepartOrgLists(val)
          if (oldVal) {
            this.baseForm.cmdbOrgName = ''
          }
        }
      },
      // "运维责任机构"改变 -> 获取"配置管理员"
      'baseForm.operationDepartment'(newVal, oldVal) {
        if (newVal) {
          this.getConfigManagerLists(newVal)
          if (oldVal) {
            this.baseForm.maintenanceStaffuuid = ''
          }
        }
      },
      // "配置管理员"改变 -> 获取"配置管理员ID"
      'baseForm.maintenanceStaffuuid'(newVal) {
        if (newVal) {
          this.configManagerList.forEach((item, index) => {
            if (newVal === item.uuid) {
              this.baseForm.maintenanceStaffid = item.userId
            }
          })
        }
      }
    },
    created() {
      this.upLoadUrl = $axios.basePath() + '/threeDimensionalAssetRoom/assetPanelUpload'
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('THREED') !== -1) {
        this.showThreeD = true
      }
      if (this.$route.params.histroyId) {
        this.isCurrent = false
      }
      this.init()
      this.getData()
    },
    methods: {
      handleAvatarSuccess(res, file) {
        if (res.state === true) {
          this.baseForm.panel = file.name
          this.$message.success('上传成功！')
        } else {
          this.$message.error(res.errormsg)
        }
      },
      beforeAvatarUpload(file) {
        const Image = ['image/jpg', 'image/jpeg', 'image/png', 'image/bmp']
        const isLt2M = file.size / 1024 / 1024 < 2;
        let isJPG
        indexOf(Image, file.type) < 0 ? isJPG = false : isJPG = true;
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg,jpeg,png,bmp 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      init() {
        this.getCompanyLists()
        this.getCitypeTreeList()
        this.getSelectOptions()
        this.getManufactLists()
      },
      getData() {
        let url = `/baseline/getBaselineValByConfUuid/${this.$route.params.histroyId}`
        if (this.isCurrent) {
          url = `/baseline/getCurBaselineVals/${this.$route.params.id}`
        }
        this.loading = true
        this.baseForm = {commonForm: {}}
        this.specialForm = {}
        $axios.get(url).then(({data}) => {
          if (data && data instanceof Array) {
            // data = data.filter((item) => { return item.applicationStatus })
            this.originData = data
            this.baselineUuid = this.originData[0].confUuid;
            data.forEach(item => {
              if (item.attrType === 1) {
                if (item.attrId === 'category') {
                  this.$set(this.baseForm, item.attrId, item.attrVal ? item.attrVal.split('/') : [])
                } else if (item.htmlType === 5) {
                  this.$set(this.baseForm, item.attrId, parseInt(item.attrVal)) // 将返回的attrVal转换成整数
                } else {
                  this.$set(this.baseForm, item.attrId, item.htmlType === 3 ? item.attrVal : item.attrValStr)
                  if (item.attrId === 'isForbidPing' || item.attrId === 'environment') {
                    this.$set(this.baseForm, item.attrId, parseInt(item.attrVal)) // 将返回的attrVal转换成整数
                  }
                }
              } else if (item.attrType === 2) { // 通用属性
                this.$set(this.baseForm.commonForm, item.uuid, {
                  label: item.attrName,
                  value: item.htmlType === 3 ? item.attrVal : item.attrValStr
                })
                // 处理自定义属性
                // 添加资产时，获取通用属性的默认值
                // 校验数字
                let checkNum = (rule, value, callback) => {
                  let reg = /^-?\d+(\.{0,1}\d+){0,1}$/
                  if (value) {
                    if (!reg.test(value)) {
                      callback(new Error('请输入数值'))
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
                let v = [];
                if (item.htmlType === 2) {
                  if (item.requireType) {
                    v = [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }]
                  } else {
                    v = [{ validator: checkNum, trigger: 'blur' }]
                  }
                } else if (item.htmlType === 3) {
                  if (item.requireType) {
                    v = [Validaters.SelectValNotNull]
                  }
                } else {
                  if (item.htmlType === 1) {
                    if (item.requireType) {
                      v = [Validaters.NotNull, { max: 30, message: '不能超过30个字符', trigger: 'blur' }]
                    }
                  } else {
                    if (item.requireType) {
                      v = [Validaters.NotNull]
                    }
                  }
                }
                this.$set(this.rules, `commonForm.${item.uuid}.value`, v)
                // this.$nextTick(() => {
                //   this.$refs.addAssetForm.clearValidate()
                // })
              } else if (item.attrType === 3) {
                this.$set(this.specialForm, item.uuid, {
                  label: item.attrName,
                  value: item.htmlType === 3 ? item.attrVal : item.attrValStr
                })
                // 处理自定义属性
                // 添加资产时，获取通用属性的默认值
                // 校验数字
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
                let v = [];
                if (item.htmlType === 2) {
                  if (item.requireType) {
                    v = [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }]
                  } else {
                    v = [{ validator: checkNum, trigger: 'blur' }]
                  }
                } else if (item.htmlType === 3) {
                  if (item.requireType) {
                    v = [Validaters.SelectValNotNull]
                  }
                } else {
                  if (item.requireType) {
                    v = [Validaters.NotNull]
                  }
                }
                this.$set(this.rules, `${item.uuid}.value`, v)
              }
              // 分类
              if (item.htmlType === 1) {
//                this.textareaFormItems.push(item.uuid)
              } else if (item.htmlType === 2) {
                this.intFormItems.push(item.uuid)
              } else if (item.htmlType === 3) {
                this.listFormItems.push(item.uuid)
                this.selectField[item.uuid] = item.attrLists || []
              } else if (item.htmlType === 4) {
                this.dateFormItems.push(item.uuid)
              }
            })
            // console.log(this.baseForm)
            // console.log(this.commonForm)
            // console.log(this.specialForm)
            this.loading = false
          }
        })
      },
      /**
       * 获取下拉框选项列表
       * —资产状态/运维责任机构
       */
      getSelectOptions() {
        return new Promise((resolve, reject) => {
          $axios.get('/resourcemanager/assetmanager/itasset/findAddSelect').then(({data}) => {
            if (data) {
              this.assetStatusLists = data.assetStatusList ? data.assetStatusList : []
              this.operationOrgList = data.cmdbOrgList ? data.cmdbOrgList : []
              this.takeUserLists = data.sysUserList ? data.sysUserList : []
              this.commonPropList = data.assetAtachColumn ? data.assetAtachColumn : []
              !!this.$route.query.addType && this.commonPropList.forEach((item, index) => {
                this.$set(this.commonPropValueList, item.columnName, item.defaultValue)
              })
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      // 获取公司名称
      getCompanyLists() {
        return new Promise((resolve, reject) => {
          $axios.get('/itilWorkflowConfig/getAllCompanyList').then(({data}) => {
            if (data && data instanceof Array) {
              this.companyLists = data
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      // 获取组织部门下拉选项
      getDepartOrgLists(companyUuid) {
        $axios.get(`/departmentInfo/getAllOrganizationByCompanyUuid/${companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.departOrgLists = data
          }
        })
      },
      // 获取厂商下拉列表
      getManufactLists() {
        return new Promise((resolve, reject) => {
          $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getAllManufact`).then((res) => {
            if (res.data && res.data instanceof Array) {
              this.manufactOptions = res.data || [];
              resolve()
            } else {
              reject()
            }
          });
        })
      },
      // 获取厂商对应下的型号下拉列表
      getProductLists(manufact) {
        if (manufact) {
          $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getProductByManufact/${manufact}`).then((res) => {
            this.productOptions = res.data || [];
          });
        } else {
          this.productOptions = [];
        }
      },
      // 三级分类数据封装
      circleGetOptions(arr) {
        return {
          uuidName: this.uuidNameArr,
          tree: arr.map(item => {
            let obj = {
              value: item.uuid,
              label: item.name
            };
            this.uuidNameArr.push({
              uuid: item.uuid,
              name: item.name
            })
            if (item.childrenList && item.childrenList.length > 0) {
              obj.children = this.circleGetOptions(item.childrenList).tree
            }
            return obj;
          })
        }
      },
      // 获取设备三级分类树
      getCitypeTreeList() {
        return new Promise((resolve, reject) => {
          $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({data}) => {
            if (data && data instanceof Array) {
              this.citypeList = this.circleGetOptions(data).tree
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      // 获取当前运维责任机构下的配置管理员信息
      getConfigManagerLists(val) {
        let sendData = {
          departUuid: val,
          isUser: 1
        }
        $axios.post(`/departmentInfo/viewDepartIncludeUsers`, sendData).then(({data}) => {
          if (data && data instanceof Object) {
            this.configManagerList = data.userList ? data.userList : []
          }
        })
      },
      // 返回上一层
      goBack() {
        if (this.isCurrent) {
          this.$router.push(this.$route.path.replace(/\/[\w]+$/, ''))
        } else {
          this.$router.push(this.$route.path.replace(/\/[\w]+$/, '').replace(/\/[\w]+$/, ''))
        }
      },
      // 移除表单元素
      removeItem(key, target) {
        this.$delete(target, key)
        this.deletedList.push(key)
        this.$nextTick(() => {
          this.$refs.waterfall.resetWaterfall()
        })
      },
      // 改变编辑模式
      doEdit() {
        // 置空临时数据存储数组
        this.tmpData = []
        this.editable = true
      },
      doAdd() {
        // 获取剩余通用属性列表
        $axios.get('/baseline/getPublicAttrNames').then(({data}) => {
          this.addDialog_RestcommonStatusList = data || []
          this.addDialog = true
        })
      },
      // 保存属性值
      submitAttributes() {
        let component = this.$refs.addAttribute
        component.validate(valid => {
          if (valid) {
            // 保存数据
            let attributes = component.getForm()
            $axios.post('/baseline/saveMulAttrs', attributes).then(({data}) => {
              if (data.state === true) {
                // 保存成功
                this.$message.success('添加成功')
                // this.getData()
                this.addDialog = false
                let type = attributes.attrType
                let id = data.data;
                let label = attributes.attrName
                let value = attributes.defaultVal
                attributes.uuid = id || null;

                this.originData.push(attributes)
                this.tmpData.push(attributes)
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
                let v = [];
                if (attributes.htmlType === 2) {
                  if (attributes.requireType) {
                    v = [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }]
                  } else {
                    v = [{ validator: checkNum, trigger: 'blur' }]
                  }
                } else if (attributes.htmlType === 3) {
                  if (attributes.requireType) {
                    v = [Validaters.SelectValNotNull]
                  }
                } else {
                  if (attributes.requireType) {
                    v = [Validaters.NotNull]
                  }
                }

                // 分类
                if (attributes.htmlType === 1) {
  //                this.textareaFormItems.push(attributes.uuid)
                } else if (attributes.htmlType === 2) {
                  this.intFormItems.push(attributes.uuid)
                } else if (attributes.htmlType === 3) {
                  this.listFormItems.push(attributes.uuid)
                  this.selectField[attributes.uuid] = attributes.attrLists || []
                } else if (attributes.htmlType === 4) {
                  this.dateFormItems.push(attributes.uuid)
                }

                // 向表单添加
                if (type === 3) {
                  this.$set(this.specialForm, id, {
                    label,
                    value
                  })
                  this.$set(this.rules, `${id}.value`, v)
                  this.$nextTick(() => {
                    this.$refs.waterfallSpecial.resetWaterfall()
                  })
                } else {
                  this.$set(this.baseForm.commonForm, id, {
                    label,
                    value
                  })
                  this.$set(this.rules, `commonForm.${id}.value`, v)
                  this.$nextTick(() => {
                    this.$refs.waterfall.resetWaterfall()
                  })
                }
              } else {
                // 保存失败
                this.$message.error('添加失败')
              }
            })
          } else {
            this.$message('请填写完整表单')
          }
        })
      },
      // 取消编辑
      cancelEdit() {
        this.$confirm('确定放弃更改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '继续编辑',
          type: 'warning'
        }).then(() => {
          // 重置表单，取消所有修改
          this.$set(this, 'baseForm', this.originForm)
          // this.$set(this, 'commonForm', this.originCommonForm)
          this.$set(this, 'specialForm', this.originSpecialForm)
          this.tmpData.forEach(item => {
            let i = this.originData.indexOf(item)
            if (i !== -1) {
              this.originData.splice(i, 1)
            }
          })
          this.editable = false
        }).catch((e) => {
        })
      },
      // 保存
      saveEdit() {
        this.$refs.baseForm.validate(valid => {
          if (valid) {
            this.$refs.specialForm.validate(valid2 => {
              if (!valid2) {
                this.$message.warning('请完成表单填写')
                return;
              }
              this.$confirm('确定应用更改？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.originData = this.originData.map(item => {
                  item.attrLists = null
                  if (item.attrId && this.baseForm[item.attrId] !== undefined) {
                    if (item.attrId === 'category') {
                      item.attrVal = this.baseForm[item.attrId] ? this.baseForm[item.attrId].join('/') : ''
                    } else if (item.htmlType === 5) {
                      item.attrVal = this.baseForm[item.attrId].toString()
                    } else {
                      if (item.htmlType === 3) { // list使用uuid
                        if (item.attrId === 'isForbidPing' || item.attrId === 'environment') {
                          item.attrVal = this.baseForm[item.attrId].toString() // 将选择的ID转换成字符串
                        } else {
                          item.attrVal = this.baseForm[item.attrId]
                        }
                      } else {
                        item.attrValStr = this.baseForm[item.attrId]
                      }
                    }
                  } else if (item.uuid && this.specialForm[item.uuid] !== undefined) {
                    if (item.htmlType === 3) { // list使用uuid
                      item.attrVal = this.specialForm[item.uuid].value
                    } else {
                      item.attrValStr = this.specialForm[item.uuid].value
                    }
                  } else if (item.uuid && this.baseForm.commonForm[item.uuid] !== undefined) {
                    if (item.htmlType === 3) { // list使用uuid
                      item.attrVal = this.baseForm.commonForm[item.uuid].value
                    } else {
                      item.attrValStr = this.baseForm.commonForm[item.uuid].value
                    }
                  }
                  // if (item.uuid && item.uuid.indexOf('attributes_') !== -1) {
                  //   item.uuid = null
                  // }
                  if (this.deletedList.indexOf(item.uuid) !== -1) {
                    item.delFlag = 1
                  }
                  return item
                }).filter(item => item)
                $axios.post('/baseline/uptBaselineVals', this.originData, {
                  data: [{controlAdderss: this.originData[1].attrValStr, itcompName: this.originData[0].attrValStr}],
                  logTemplate: '编辑|资产(#controlAdderss#/#itcompName#)>配置基准'
                }).then(({data}) => {
                  if (data.state === true) {
                    this.editable = false
                    this.$message.success('保存成功')
                    this.getData()
                  } else {
                    this.$message.success('保存失败')
                  }
                })
              }).catch((e) => {
              })
            })
          } else {
            this.$message.warning('请完成表单填写')
          }
        })
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .no-border-bottom
    .liSty{
      margin-top: 5px;
      margin-left: -8px;
    }
    .s-card-header
      margin-top 10px
      border-bottom none
    // .s-form
    //   .common-property-form-item
    //     overflow hidden
    //     white-space nowrap
    //     text-overflow ellipsis

  .s-form-item
    .icon-delete-item
      opacity 0
      transition all .3s
    &:hover
      .icon-delete-item
        opacity 1
.waterfall{
  // gap:10px 30px;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  .waterfall-panel{
      height: 100%;
    .s-form-item{
      margin-bottom:0;
      .s-select, .s-date-editor{
        width 100%
      }
    }
  }
  .waterfall-tall-panel{
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
}
</style>
