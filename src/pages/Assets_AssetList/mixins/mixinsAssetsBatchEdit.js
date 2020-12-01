import $axios from 'sunflower-ajax'
import { indexOf } from 'lodash'
import {Validaters} from 'sunflower-common-utils'
import inputTree from '@/components/inputTree/InputTree';
import {noDefaultConstructor, constructor} from '../api/propertyConstructor.js'
import {findAddSelect, getCitypeTree, viewDepartIncludeUsers, getAllCompanyList, getAllOrganizationByCompanyUuid} from '../api/assetList_api'
export default{
  data() {
    // 验证资产编码重复性
    let validateCiCode = (rule, value, callback) => {
      if (value) {
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
      } else {
        callback()
      }
    };
    // 检测资产价格
    let checkOrderingCost = (rule, value, callback) => {
      if (value && value !== 0) {
        let reg = /^\d+(\.{0,1}\d+){0,1}$/
        if (!reg.test(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (value > 2147483647) callback(new Error('最大值为：2147483647'));
          else callback();
        }
      } else {
        callback();
      }
    };
    return {
      applicationProperty: [], // 所有开启应用&&开启批量编辑的属性
      applicationPropertyObj: {},
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      inDataObj: {}, // 内置已开启应用&&开启批量编辑属性（可以关闭应用的内置属性）
      customDataObj: {}, // 自定义已开启应用&&开启批量编辑属性// 资产首页>配置项管理>自定义通用属性列表
      upLoadUrl: '',
      orderingCostUnitOption: [ // 价格单位
        {
          value: '1',
          label: '人民币'
        }, {
          value: '2',
          label: '美元'
        }
      ],
      manufactOptions: [], // 厂商下拉选项
      productOptions: [], // 型号下拉选项
      assetStatusLists: [],         // 资产状态下拉选项
      operationOrgList: [],         // 配置管理员机构下拉选项
      configManagerList: [],        // 配置管理员下拉选项
      companyLists: [],             // 公司名称下拉选项
      departOrgLists: [],           // 使用部门下拉选项
      takeUserLists: [],           // 使用部门下拉选项
      formItemCheckList: [],        // 所选中的要编辑的表单项
      // 环境类型下拉选项
      environmentTypeLists: [
        {environmentName: '开发环境', uuid: '4'},
        {environmentName: '测试环境', uuid: '1'},
        {environmentName: '生产环境', uuid: '0'},
        {environmentName: '灾备环境', uuid: '2'},
        {environmentName: '其他', uuid: '3'}
      ],
      modelSelectDeviceTypeUuid: '',  // 从资产型号弹框选中的资产型号uuid
      uuidNameArr: [],              // 设备三级分类uuid->name对应关系
      citypeList: [],               // 设备三级分类树
      batchEditForm: {
        /* 内置默认开启属性 */
        citypeUuid: [],             // 设备三级分类
        manufactUuid: null,           // 资产型号选中项-对应的厂商uuid
        productUuid: null,            // 型号uuid
        assetStatus: null,            // 资产状态
        operationOrguuid: null,       // 配置管理员机构
        maintenanceStaffuuid: null,   // 配置管理员
        firmUuid: null,               // 公司名称
        cmdbOrguuid: null,            // 使用部门
        /* 内置可以修改属性 */
        important: 4, // 是否重要资产
        isForbidPing: 0,
        atCabinetNumber: null, // 所在机柜
        panel: null,
        uAmount: null, // 尺寸
        ciCode: null,
        assetSeries: null, // 序列号
        takeUser: null,
        environment: null,            // 环境类型
        serviceMode: null,
        cpuModle: null,
        driver: null,
        manufacturerName: null,
        memory: null,
        capacity: null,
        orderingCost: null,           // 价格
        orderingCostUnit: null,       // 价格单位
        purchaseDate: null,           // 购买日期
        guaranteeDate: null,           // 报修到期日
        contract: null,
        modelNumber: null,            // 资产型号名称
        deviceTypeUuid: null         // 资产型号uuid
        // 自定义通用属性值
      },
      batchEditFormRules: {},
      cloneBatchEditFormRules: {
        /* 内置默认开启属性 */
        citypeUuid: [{required: true, type: 'array', message: '不能为空', trigger: 'change'}],
        // assetStatus: [{required: false, message: '不能为空', trigger: 'change'}],
        // operationOrguuid: [{required: false, message: '不能为空', trigger: 'change'}],
        // maintenanceStaffuuid: [{required: false, message: '不能为空', trigger: 'change'}],
        /* 内置可以修改属性 */
        contract: [{ max: 30, message: '字符长度不能大于30', trigger: 'blur' }],
        atCabinetNumber: [{ max: 50, message: '字符长度不能大于50', trigger: 'blur' }],
        takeUser: [{
          max: 50,
          message: '字符长度不能大于50',
          trigger: 'blur'
        }, Validaters.Name],
        ciCode: [{ validator: validateCiCode, trigger: 'blur' }],
        capacity: [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
        memory: [{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}],
        uAmount: [{pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入正整数', trigger: 'blur'}],
        orderingCost: [{validator: checkOrderingCost, trigger: 'blur'}]
      },
      addFlag: true
    }
  },
  components: {
    inputTree
  },
  mounted() {
    this.upLoadUrl = $axios.basePath() + '/threeDimensionalAssetRoom/assetPanelUpload'
    this.getTakeUserLists()
  },
  watch: {
    // "配置管理员机构"改变 -> 获取"配置管理员"下拉选项
    'batchEditForm.operationOrguuid'(val) {
      if (val) {
        this.getConfigManagerLists(val)
      }
    },
    // "公司名称"改变 -> 获取公司下的"组织部门"
    'batchEditForm.firmUuid'(val) {
      if (val) {
        this.getDepartOrgLists(val)
      }
    },
    // "厂商"改变 -> 获取厂商下的"型号"
    'batchEditForm.manufactUuid'(newVal) {
      if (newVal) {
        this.getProductLists(newVal)
      }
    }
  },
  methods: {
    /* 面板操作上传 */
    handleAvatarSuccess(res, file) {
      if (res.state === true) {
        this.batchEditForm.panel = file.name
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
    // 获取厂商下拉列表
    getManufactLists() {
      $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getAllManufact`).then((res) => {
        this.manufactOptions = res.data || [];
      });
    },
    // 获取厂商对应下的型号下拉列表
    getProductLists(manufactUuid) {
      if (!this.addFlag) {
        this.batchEditForm.productUuid = null;
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
      this.batchEditForm.modelNumber = `${model.parentCaption}(${model.caption})`
      this.batchEditForm.deviceTypeUuid = model.deviceTypeUuid || null
      this.modelSelectDeviceTypeUuid = model.deviceTypeUuid || null
    },
    // 清空当前选择厂商
    emptyManufact() {
      this.batchEditForm.manufactUuid = null;
      this.productOptions = [];
      this.batchEditForm.productUuid = null
      this.batchEditForm.modelNumber = null;
      this.batchEditForm.deviceTypeUuid = null
      this.modelSelectDeviceTypeUuid = null
    },
    // 清空当前选择型号
    emptyProduct() {
      this.batchEditForm.productUuid = null
      this.batchEditForm.modelNumber = null;
      this.batchEditForm.deviceTypeUuid = null
      this.modelSelectDeviceTypeUuid = null
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
    // 获取设备三级分类树
    getCitypeTreeList() {
      return new Promise((resolve, reject) => {
        getCitypeTree().then(({data}) => {
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
      this.uuidNameArr.forEach((item) => {
        if (val.concat([]).reverse()[0] === item.uuid) {
          this.citypeName = item.name
        }
      })
    },
    // 获取资产状态/配置管理员机构下拉选项
    getStatusOperations() {
      findAddSelect().then(({data}) => {
        if (data) {
          this.assetStatusLists = data.assetStatusList || [];
          this.operationOrgList = data.cmdbOrgList || [];
          this.assetStatusLists.forEach(item => {
            if (item.assetstatusName === '使用') {
              // 添加时资产状态默认为"使用"
              this.batchEditForm.assetStatus = this.assetStatusLists[0].uuid;
            }
          });
        }
      });
    },
    // 获取当前配置管理员机构下的配置管理员信息
    getConfigManagerLists(val) {
      viewDepartIncludeUsers({departUuid: val, isUser: 1}).then(({data}) => {
        if (data && data instanceof Object) {
          this.configManagerList = data.userList || [];
        }
      })
    },
    // 获取公司名称下拉选项
    getCompanyLists() {
      getAllCompanyList().then(({data}) => {
        if (data && data instanceof Array) {
          this.companyLists = data;
        }
      })
    },
    // 获取使用部门下拉选项
    getDepartOrgLists(companyUuid) {
      getAllOrganizationByCompanyUuid(companyUuid).then(({data}) => {
        if (data && data instanceof Array) {
          // 当"公司名称"变化时，需要将"使用部门"中与选中的"公司名称"的值相同的下拉项过滤掉
          this.departOrgLists = data.filter(i => i.uuid !== companyUuid);
        }
      })
    },
    // 获取维护人下拉选项
    getTakeUserLists() {
      $axios.get('/resourcemanager/assetmanager/itasset/findAddSelect').then(({ data }) => {
        if (data) {
          this.takeUserLists = data.sysUserList ? data.sysUserList : []
        }
      })
    },
    // 获取所有应用属性（内置默认属性，内置修改属性，自定义属性）
    getApplicationProperty() {
      $axios.get('/resourcemanager/configurationmanage/generalProperty/getApplicationProperty').then(({ data }) => {
        if (data && data instanceof Array) {
          this.applicationProperty = data.filter(item => item.supportEditing);
          this.dealProperty();
        }
      })
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
    // 处理应用属性
    dealProperty() {
      let obj = {};
      for (let i in constructor) {
        obj[constructor[i]] = i;
      }
      this.applicationPropertyObj = this.applicationProperty.reduce((monitor, item) => {
        monitor[obj[item.colnumName] ? obj[item.colnumName] : item.colnumName] = item;
        return monitor;
      }, {})
      for (let key in this.applicationPropertyObj) {
        for (let item in this.batchEditForm) {
          if (key === item) {
            this.batchEditForm[item] = this.applicationPropertyObj[key].defaultValue
            if (key === 'citypeUuid') { // 资产分类
              this.batchEditForm[item] = [this.applicationPropertyObj[key].defaultValue]
            }
            if (this.applicationPropertyObj[key].htmlType === 'udf_date') {
              this.batchEditForm[item] = this.applicationPropertyObj[key].defaultValue ? new Date(this.applicationPropertyObj[key].defaultValue) : null
            }
          }
        }
      }
      for (let key in this.batchEditForm) {
        if (key === 'important' || key === 'isForbidPing') {
          this.batchEditForm[key] = parseInt(this.batchEditForm[key])
        }
      }
      let inDataArr = this.applicationProperty.filter(item => (item.colnumName in noDefaultConstructor) && item.defaultStatus);
      let customDataArr = this.applicationProperty.filter(item => !(item.colnumName in noDefaultConstructor) && !item.defaultStatus);
      // 数组转换为对象
      this.inDataObj = inDataArr.reduce((monitor, item) => {
        monitor[obj[item.colnumName]] = item;
        return monitor;
      }, {})
      this.customDataObj = customDataArr.reduce((monitor, item) => {
        monitor[item.colnumName] = item;
        this.$set(this.batchEditForm, item.colnumName, item.defaultValue);
        return monitor;
      }, {})
    }
  }
}
