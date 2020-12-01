/*
 * @Author: 高建鹏
 * @Version: //Q4资产添加/编辑
 * @Description:资产添加编辑页面表单
 * @Position:资产列表-》添加/编辑
 * @Date: 2019-11-12 14:52:22
 * @LastEditors: mybells
 */
import { cloneDeep, indexOf } from 'lodash'
import $axios from 'sunflower-ajax'
import {Validaters} from 'sunflower-common-utils'
import selectTree from '@/components/selectTree/SelectTree'
import ipAllocationDialog from '../AssetAddDialog/IpAllocationDialog.vue'
import {noDefaultConstructor, constructor} from '../api/propertyConstructor.js'
export default {
  components: {
    selectTree,
    ipAllocationDialog
  },
  data() {
    // 验证资产编码重复性
    let validateCiCode = (rule, value, callback) => {
      if (value) {
        /**
         * 以下两种情况"资产编码"不做重复性校验
         * 1. 编辑资产时，与上次入库值一致，不做校验
         * 2. 在"添加"页面已经成功保存，再点击保存(视为编辑刚保存的资产)，不做校验
         */
        let editExistAsset = !!(this.assetUuid) && this.addAssetForm.monitorItcomp.ciCode === this.originData.ciCode
        let savedToEditFlag = !!(this.saveAssetUuid) && this.saveAssetUuid.length > 0
        if (editExistAsset || savedToEditFlag) {
          callback()
        } else {
          $axios.post('/resourcemanager/assetmanager/itasset/ciCodeValidate', { data: value }).then(({ data }) => {
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
        // callback(new Error('不能为空！'))
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
      saveDisabled: false,
      Threed: false, // 注册了3d机柜置灰
      addType: null,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      assetUuid: this.$route.params.assetUuid,
      oldTempForm: {}, // 编辑的初始值。
      applicationProperty: [], // 所有应用属性
      inDataObj: {}, // 内置已开启应用属性（可以关闭应用的内置属性）
      customDataObj: {}, // 自定义已开启应用属性// 资产首页>配置项管理>自定义通用属性列表
      manufactOptions: [], // 厂商下拉列表
      productOptions: [], // 厂商对应型号下拉列表
      upLoadUrl: '',
      cabinettype: ['jpg', 'png', 'gif', 'svg'],
      isApplication: false, // 一级分类是应用的话屏蔽资产ip中分配ip按钮
      allocationDialog: false, // IP地址分配
      // 上次已入库数据
      originData: {
        ciCode: '', // 配置项编码
        controlAdderss: '' // 资产IP
      },
      citypeName: '', // 资产类型名(返回"资产列表"二级页面时使用)
      citypeList: [], // 设备三级分类树
      uuidNameArr: [], // 设备三级分类uuid->name对应关系
      saveAssetUuid: '',
      companyLists: [], // 公司名称下拉选项
      departOrgLists: [], // 组织部门下拉选项
      // productList: [],              // 设备型号下拉选项
      assetStatusLists: [], // 资产状态下拉选项
      operationOrgList: [], // 运维组织机构下拉选项
      configManagerList: [], // 配置管理员下拉选项
      takeUserLists: [], // 配置管理员下拉选项
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
      modelSelectDeviceTypeUuid: '', // 从设备类型弹框选择到的设备uuid
      // customDeviceTypeUuid: 'tdevicetypeinit00000000000000099',         // "自定义"设备类型默认uuid
      disableAfterToday: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      disableBeforeToday: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      // 新增资产表单
      addAssetForm: {
        monitorItcomp: {
          itcompName: null,
          controlAdderss: null,
          citypeUuid: [], // 设备三级分类
          descr: null,
          manufactUuid: null,
          productUuid: null,
          // 设备基本属性
          cmdbAssetinfo: {
            assetStatus: null,
            assetSeries: null, // 序列号
            environment: null, // 环境类型
            serviceMode: null,
            driver: null,
            orderingCost: null,
            purchaseDate: new Date(),
            guaranteeDate: null,
            contract: null,
            commonPropValueList: {} // 自定义通用属性值列表(input v-model的变量)
          },
          maintenanceStaffuuid: null, // 配置管理员
          operationOrguuid: null, // 配置管理员机构
          firmUuid: null,
          cmdbOrguuid: null,
          important: null, // 资产重要程度
          isForbidPing: null,
          atCabinetNumber: null, // 所在机柜
          panel: null,
          uAmount: null, // 尺寸
          ciCode: null,
          takeUser: null,
          itcompServerProcessorList: [{ cpuModle: null }], // CPU型号
          itcompServerPeripheralList: [{ // 外设-显示器
            peripheralType: 3,
            manufacturerName: null
          }],
          memory: null,
          itcompServerHarddiskList: [{ capacity: null }], // 硬盘容量
          deviceTypeUuid: null // 设备型号
        }
      },
      // 新增资产表单校验
      addAssetFormRules: {
        /* 内置默认开启属性 */
        'monitorItcomp.itcompName': [{ required: true, message: '不能为空', trigger: 'blur' }, Validaters.Max(30)],
        'monitorItcomp.controlAdderss': [Validaters.IP],
        'monitorItcomp.citypeUuid': [{ type: 'array', required: true, message: '不能为空', trigger: 'blur' }],
        'monitorItcomp.descr': [{ max: 500, message: '最大长度为500个字符', trigger: 'blur' }],
        'monitorItcomp.cmdbAssetinfo.assetStatus': [{ required: true, message: '不能为空', trigger: 'change' }],
        'monitorItcomp.operationOrguuid': [{ required: true, message: '不能为空', trigger: 'change' }],
        'monitorItcomp.maintenanceStaffuuid': [{ required: true, message: '不能为空', trigger: 'change' }],
        'monitorItcomp.manufactUuid': [{ required: true, message: '不能为空', trigger: 'change' }],
        'monitorItcomp.productUuid': [{ required: true, message: '不能为空', trigger: 'change' }],
        /* 内置可以修改属性 */
        // 'important': [{required: true}],
        'monitorItcomp.cmdbAssetinfo.contract': [{ max: 30, message: '字符长度不能大于30', trigger: 'blur' }],
        'monitorItcomp.atCabinetNumber': [{ max: 50, message: '字符长度不能大于50', trigger: 'blur' }],
        'monitorItcomp.cmdbAssetinfo.serviceMode': [{ max: 50, message: '字符长度不能大于50', trigger: 'blur' }],
        'monitorItcomp.takeUser': [
          { max: 50, message: '字符长度不能大于50', trigger: 'blur' },
          Validaters.Name
        ],
        'monitorItcomp.ciCode': [{ validator: validateCiCode, trigger: 'blur' }],
        'monitorItcomp.itcompServerHarddiskList[0].capacity': [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
        'monitorItcomp.memory': [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
        'monitorItcomp.uAmount': [{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数', trigger: 'blur'}],
        'monitorItcomp.cmdbAssetinfo.orderingCost': [{ validator: checkOrderingCost, trigger: 'blur' }, {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}]
      },
      addFlag: true
    }
  },
  mounted() {
    this.upLoadUrl = $axios.basePath() + '/threeDimensionalAssetRoom/assetPanelUpload'
  },
  watch: {
    addAssetForm: {
      deep: true,
      handler(val) {
        this.$emit('getAssetData', cloneDeep(val))
      }
    },
    // "公司名称"改变 -> 获取公司下的"组织部门"
    'addAssetForm.monitorItcomp.firmUuid'(newVal) {
      if (newVal) {
        this.getDepartOrgLists(newVal)
      }
    },
    // "配置管理员机构"改变 -> 获取"配置管理员"
    'addAssetForm.monitorItcomp.operationOrguuid'(newVal) {
      if (newVal) {
        this.getConfigManagerLists(newVal)
      }
    },
    // "厂商"改变 -> 获取厂商下的"型号"
    'addAssetForm.monitorItcomp.manufactUuid'(newVal) {
      if (newVal) {
        this.getProductLists(newVal)
      }
    }
  },
  methods: {
    saveOldData(tempForm) {
      let data = cloneDeep(tempForm.monitorItcomp);
      let obj = {};
      obj.itcompName = data.itcompName;
      obj.controlAdderss = data.controlAdderss;
      obj.citypeUuid = typeof data.citypeUuid === 'string' ? data.citypeUuid : data.citypeUuid.concat([]).reverse()[0];
      obj.descr = data.descr;
      obj.manufactUuid = data.manufactUuid;
      obj.productUuid = data.productUuid;
      obj.assetStatus = data.cmdbAssetinfo.assetStatus;
      obj.assetStatus = data.cmdbAssetinfo.assetStatus;
      obj.assetSeries = data.cmdbAssetinfo.assetSeries;
      obj.environment = data.cmdbAssetinfo.environment;
      obj.driver = data.cmdbAssetinfo.driver;
      obj.orderingCost = data.cmdbAssetinfo.orderingCost;
      obj.purchaseDate = typeof data.cmdbAssetinfo.purchaseDate !== 'string' ? this.formatDate(new Date(data.cmdbAssetinfo.purchaseDate).getTime()) : data.cmdbAssetinfo.purchaseDate;
      obj.guaranteeDate = typeof data.cmdbAssetinfo.guaranteeDate !== 'string' ? this.formatDate(new Date(data.cmdbAssetinfo.guaranteeDate).getTime()) : data.cmdbAssetinfo.guaranteeDate;
      obj.contract = data.cmdbAssetinfo.contract;
      obj.maintenanceStaffuuid = data.maintenanceStaffuuid;
      obj.operationOrguuid = data.operationOrguuid;
      obj.firmUuid = data.firmUuid;
      obj.cmdbOrguuid = data.cmdbOrguuid;
      obj.important = data.important;
      obj.isForbidPing = data.isForbidPing;
      obj.atCabinetNumber = data.atCabinetNumber;
      obj.panel = data.panel;
      obj.uAmount = data.uAmount;
      obj.ciCode = data.ciCode;
      obj.takeUser = data.takeUser;
      obj.serviceMode = data.cmdbAssetinfo.serviceMode;
      obj.cpuModle = data.itcompServerProcessorList[0].cpuModle;
      obj.manufacturerName = data.itcompServerPeripheralList[0].manufacturerName;
      obj.capacity = data.itcompServerHarddiskList[0].capacity;
      for (let key in data.cmdbAssetinfo.commonPropValueList) {
        obj[key] = data.cmdbAssetinfo.commonPropValueList[key];
      }
      return obj;
    },
    // 自动巡检接口（传与初始值不同的key-value对象）
    autoPolling(tempForm) {
      let newTempForm = this.saveOldData(tempForm);
      let oldTempForm = this.oldTempForm;
      let difference = {};
      for (let key in newTempForm) {
        if (newTempForm[key] !== oldTempForm[key]) {
          difference[constructor[key] ? constructor[key] : key] = newTempForm[key];
        }
      }
      difference.uuid = this.assetUuid;
      $axios.post('/resourcemanager/assetmanager/itasset/saveAllChangedAttributes', difference).then((res) => {})
    },
    // ip地址分配Q2需求
    allocationIP() {
      this.allocationDialog = true;
    },
    changeip(val) {
      this.addAssetForm.monitorItcomp.controlAdderss = val
    },
    // "新增资产"表单验证
    validAssetAddForm(callback, uuidRequired = true) {
      if (uuidRequired) {
        if (this.assetUuid) {
          callback()
        } else {
          this.$refs.addAssetForm.validate(valid => {
            if (valid) {
              if (this.saveAssetUuid) {
                callback()
              } else {
                this.$message.warning('请先保存已填写的资产信息！')
              }
            } else {
              this.$message.warning('请完成表单填写')
            }
          })
        }
      } else {
        this.$refs.addAssetForm.validate(valid => {
          if (valid) {
            callback()
          } else {
            this.$message.warning('请完成表单填写')
          }
        })
      }
    },
    /* 面板操作上传 */
    handleAvatarSuccess(res, file) {
      if (res.state === true) {
        this.addAssetForm.monitorItcomp.panel = file.name
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
    // 获取公司名称下拉选项
    getCompanyLists() {
      return new Promise((resolve, reject) => {
        $axios.get('/itilWorkflowConfig/getAllCompanyList').then(({ data }) => {
          if (data && data instanceof Array) {
            this.companyLists = data;
            // 因为系统中只有一个公司，所以是取第一条记录的uuid
            // this.addAssetForm.monitorItcomp.firmUuid = data[0].uuid;
            // 直接取使用部门的数据
            // this.getDepartOrgLists(data[0].uuid);
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    // 获取组织部门下拉选项
    getDepartOrgLists(companyUuid) {
      $axios.get(`/departmentInfo/getAllOrganizationByCompanyUuid/${companyUuid}`).then(({ data }) => {
        if (data && data instanceof Array) {
          // 当"公司名称"变化时，需要将"组织部门"中与选中的"公司名称"的值相同的下拉项过滤掉
          this.departOrgLists = data.filter(i => i.uuid !== companyUuid);
        }
      })
    },
    // 清空当前选择公司
    emptyFirmUuid() {
      this.addAssetForm.monitorItcomp.firmUuid = null;
      this.departOrgLists = [];
      this.addAssetForm.monitorItcomp.cmdbOrguuid = null
    },
    // 清空当前选择部门
    emptyCmdbOrguuid() {
      this.addAssetForm.monitorItcomp.cmdbOrguuid = null
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
    getProductLists(manufactUuid) {
      if (!this.addFlag) {
        this.addAssetForm.monitorItcomp.productUuid = '';
      } else {
        this.addFlag = false;
      }
      if (manufactUuid) {
        $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getProductByManufact/${manufactUuid}`).then((res) => {
          this.productOptions = res.data || [];
        });
      } else {
        this.productOptions = [];
      }
    },
    // 型号改变
    productChange(productUuid) {
      let model = this.productOptions.find(item => {
        return item.uuid === productUuid;
      })
      // 资产型号选择回显为: 厂商(型号)
      this.addAssetForm.monitorItcomp.modelNumber = `${model.manufactName}(${model.caption})`
      this.addAssetForm.monitorItcomp.deviceTypeUuid = model.deviceTypeUuid || ''
      this.modelSelectDeviceTypeUuid = model.deviceTypeUuid || ''
    },
    // 清空当前选择厂商
    emptyManufact() {
      this.addAssetForm.monitorItcomp.manufactUuid = null;
      this.productOptions = [];
      this.addAssetForm.monitorItcomp.productUuid = null
      this.addAssetForm.monitorItcomp.modelNumber = '';
      this.addAssetForm.monitorItcomp.deviceTypeUuid = ''
      this.modelSelectDeviceTypeUuid = ''
    },
    // 清空当前选择型号
    emptyProduct() {
      this.addAssetForm.monitorItcomp.productUuid = null
      this.addAssetForm.monitorItcomp.modelNumber = '';
      this.addAssetForm.monitorItcomp.deviceTypeUuid = ''
      this.modelSelectDeviceTypeUuid = ''
    },
    // 获取当前运维责任机构下的配置管理员信息
    getConfigManagerLists(val) {
      let sendData = {
        departUuid: val,
        isUser: 1
      }
      $axios.post(`/departmentInfo/viewDepartIncludeUsers`, sendData).then(({ data }) => {
        if (data && data instanceof Object) {
          this.configManagerList = data.userList ? data.userList : []
        }
      })
    },
    // 重新选择"配置管理员机构"时，清空上次"配置管理员"的值
    handleOperationOrgChange() {
      this.addAssetForm.monitorItcomp.maintenanceStaffuuid = '';
    },
    // (ms -> yyyy-MM-dd HH:mm:ss)
    formatDate(x) {
      let date = new Date(x)
      let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
      return dateStr
    },
    formatNowDate() {
      let date = new Date()
      let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
      let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
      return dateStr
    },

    /**
     * 递归修改设备三级分类树返回数据格式
     * childrenList --> children
     * 去除最后一级的childrenList:[] 为空数组引起的bug
     */
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
    // 获取设备三级分类树/资产分类
    getCitypeTreeList() {
      return new Promise((resolve, reject) => {
        $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({ data }) => {
          if (data && data instanceof Array) {
            this.citypeList = this.circleGetOptions(data).tree
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    // 设备三级分类树选择改变事件 --> 获取node节点附加属性值
    selectTreeChange(val) {
      if (val instanceof Array) {
        if (val[0] === 'fdc689052311432f8efa5cb7416d5f10') {
          this.isApplication = true;
        } else {
          this.isApplication = false;
        }
      }
      this.uuidNameArr.forEach((item) => {
        if (val.concat([]).reverse()[0] === item.uuid) {
          this.citypeName = item.name
        }
      })
    },
    // 获取所有应用属性（内置默认属性，内置修改属性，自定义属性）
    getApplicationProperty() {
      return new Promise((resolve, reject) => {
        $axios.get('/resourcemanager/configurationmanage/generalProperty/getApplicationProperty').then(({ data }) => {
          if (data && data instanceof Array) {
            this.applicationProperty = data;
            this.dealProperty();
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    /**
     * 获取下拉框选项列表
     * —资产状态/运维责任机构
     */
    getSelectOptions() {
      return new Promise((resolve, reject) => {
        $axios.get('/resourcemanager/assetmanager/itasset/findAddSelect').then(({ data }) => {
          if (data) {
            this.assetStatusLists = data.assetStatusList ? data.assetStatusList : []
            this.operationOrgList = data.cmdbOrgList ? data.cmdbOrgList : []
            this.takeUserLists = data.sysUserList ? data.sysUserList : []
            // 添加时资产状态默认为"使用"
            // if (this.addType) {
            //   this.addAssetForm.monitorItcomp.cmdbAssetinfo.assetStatus = this.assetStatusLists[0].uuid
            // }
            resolve()
          } else {
            reject()
          }
        })
      })
    },
    // 获取初始化数据
    getInitData() {
      return Promise.all([this.getManufactLists(), this.getSelectOptions(), this.getCompanyLists(), this.getCitypeTreeList(), this.getApplicationProperty()])
    },
    // 处理应用属性
    dealProperty() {
      // let defaultInData = this.applicationProperty.filter(item => !(item.colnumName in noDefaultConstructor) && item.defaultStatus);
      let inDataArr = this.applicationProperty.filter(item => (item.colnumName in noDefaultConstructor) && item.defaultStatus);
      let customDataArr = this.applicationProperty.filter(item => !(item.colnumName in noDefaultConstructor) && !item.defaultStatus);
      // 数组转换为对象
      this.inDataObj = inDataArr.reduce((monitor, item) => {
        monitor[item.colnumName] = item;
        return monitor;
      }, {})
      this.customDataObj = customDataArr.reduce((monitor, item) => {
        monitor[item.colnumName] = item;
        return monitor;
      }, {})

      // 添加内置属性必填校验
      for (let key in this.inDataObj) {
        let obj = this.inDataObj[key];
        let path = noDefaultConstructor[key].path;
        let validate = this.addAssetFormRules[path];
        if (obj.requiredStatus) { // 必填项
          if (validate) {
            if (obj.htmlType === 'udf_char_list') {
              validate.unshift(Validaters.SelectValNotNull)
            } else {
              // 校验存在
              validate.unshift(Validaters.NotNull)
            }
          } else {
            if (obj.htmlType === 'udf_char_list') {
              this.$set(this.addAssetFormRules, path, [Validaters.SelectValNotNull])
            } else {
              this.$set(this.addAssetFormRules, path, [Validaters.NotNull])
            }
          }
        }
      }
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
      for (let key in this.customDataObj) {
        let obj = this.customDataObj[key];
        this.$set(
          this.addAssetForm.monitorItcomp.cmdbAssetinfo.commonPropValueList,
          obj.colnumName, obj.propertyValue
        )
        let v = [];
        if (obj.htmlType === 'udf_long') {
          if (obj.requiredStatus) {
            v = [Validaters.NotNull, { validator: checkNum, trigger: 'blur' }]
          } else {
            v = [{ validator: checkNum, trigger: 'blur' }]
          }
        } else if (obj.htmlType === 'udf_char_list') {
          if (obj.requiredStatus) {
            v = [Validaters.SelectValNotNull]
          }
        } else {
          if (obj.requiredStatus) {
            v = [Validaters.NotNull]
          }
        }
        this.$set(this.addAssetFormRules, `monitorItcomp.cmdbAssetinfo.commonPropValueList.${obj.colnumName}`, v)
      }
      this.$nextTick(() => {
        this.$refs.addAssetForm.clearValidate()
      })
    }
  }
}
