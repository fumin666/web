import $axios from 'sunflower-ajax'
import {cloneDeep} from 'lodash';

export default {
  data() {
    return {
      tab2Data: [],
      tableData: [],
      configDialogFlag: false,
      configData: {},
      tab2OriginList: [],
      repeatIdArr: [] // 去重后的配置的id数组
    }
  },
  methods: {
    addProto(configData) {
      this.configData = configData;
      this.configDialogFlag = true;
    },
    axiosConfigList(uuid) { // 获取管理配置列表
      $axios.get('/resourcemanager/assetmanager/itasset/getMonitorCredence/' + uuid).then(({data}) => {
        // this.delRepeat(data);
        this.tableData = data;
        this.tab2Data = data.map((item, index) => {
          let obj = {};
          this.divideAccountProto(obj, item);
          obj.index = index;
          obj.id = item.id;
          obj.uuid = item.uuid;
          return obj;
        });
        this.tab2OriginList = cloneDeep(this.tab2Data);
      });
    },
    delRepeat(arr) { // 同协议多个账号都被去除关联关系后(即同个协议，但是账号为空时)，列表需去重
      let delIndexObj = {};
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i].assetsAccountInfo || !arr[i].assetsAccountInfo.accountName) {
          let item = arr[i];
          for (let j = i + 1; j < arr.length; j++) {
            if ((!arr[j].assetsAccountInfo || !arr[j].assetsAccountInfo.accountName) &&
              item.protocolName === arr[j].protocolName) {
              delIndexObj[j] = true;
            }
          }
        }
      }
      let delIndexArr = [];
      for (let i in delIndexObj) {
        delIndexArr.push(i - 0);
      }
      delIndexArr.sort((a, b) => a < b);
      delIndexArr.forEach((item) => {
        this.repeatIdArr.push(arr[item].id);
        arr.splice(item, 1);
      });
    },
    divideAccountProto(newObj, oldObj) {
      newObj.id = oldObj.id;
      newObj.assetsAccountInfo = oldObj.assetsAccountInfo || {};
      newObj.assetsPortInfo = oldObj.assetsPortInfo || {};
      let accountFied = ['accountName', 'accountPasswd', 'accountRoleUuid', 'accountTypeName', 'snmpCWordOr', 'snmpCWordRw'];
      for (let i in oldObj) {
        if (oldObj[i] !== '' && typeof oldObj[i] !== 'object' && i !== 'uuid') {
          if (accountFied.some(item => { return item === i })) {
            newObj.assetsAccountInfo[i] = oldObj[i];
          } else if (newObj.assetsPortInfo.hasOwnProperty(i)) {
            if (i === 'port') {
              newObj.assetsPortInfo[i] = oldObj[i] + '';
            } else {
              newObj.assetsPortInfo[i] = oldObj[i];
            }
          }
        }
      }
    },
    // 编辑一个协议时，只要协议名称和端口一样，就视为同一个协议，协议实体里其他的属性就要同步更新
    syncProto(itemObj) {
      let target = cloneDeep(itemObj)
      this.tab2Data.forEach(item => {
        if (item.assetsPortInfo.protocolName === target.assetsPortInfo.protocolName &&
            item.assetsPortInfo.port === target.assetsPortInfo.port &&
            item.assetsPortInfo.subpath === target.assetsPortInfo.subpath &&
            item.index !== target.index) {
          for (let i in target.assetsPortInfo) {
            item.assetsPortInfo[i] = target.assetsPortInfo[i]
          }
        }
      })
    },
    tab2ConfigSave(itemObj, isEdit) { // 新增弹框的确定触发此方法
      let param = {
        'IP地址': this.curAsset['IP地址'] ? this.curAsset['IP地址'] + '/' + this.curAsset['资产名称'] : this.curAsset['资产名称'],
        '账号名称': itemObj.assetsAccountInfo.accountName,
        '协议名称': itemObj.assetsPortInfo.protocolName,
        '端口': itemObj.assetsPortInfo.port
      }
      let logParam = {
        data: [param]
      };
      if (param['账号名称'] === '') {
        logParam.logTemplate = '关联端口|资产(#IP地址#)>协议(#协议名称#/#端口#)'
      } else {
        logParam.logTemplate = '关联端口|资产(#IP地址#)>资产账号>账号(#账号名称#)>协议(#协议名称#/#端口#)'
      }
      if (isEdit) {
        $axios.post(`/resourcemanager/assetmanager/itasset/updateCredenceByItcomp`, itemObj, logParam).then(({data}) => {
          if (data.state) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosConfigList(this.curAsset.uuid);
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      } else {
        $axios.post(`/resourcemanager/assetmanager/itasset/saveCredenceByItcomp/${this.curAsset.uuid}`, itemObj, logParam).then(({data}) => {
          if (data.state) {
            this.$message({showClose: true, message: data.errormsg, type: 'success'});
            this.axiosConfigList(this.curAsset.uuid);
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      }
    },
    filterConfigParam(configObj) { // 最后保存时调用
      let param = {
        assetsAccountInfo: {},
        assetsPortInfo: {}
      };
      for (let i in configObj.assetsAccountInfo) {
        if (configObj.assetsAccountInfo[i] !== '' && i !== 'accountTypeName' && i !== 'relateAccountFlag') {
          param.assetsAccountInfo[i] = configObj.assetsAccountInfo[i];
        }
      }
      for (let i in configObj.assetsPortInfo) {
        if (configObj.assetsPortInfo[i] !== '') {
          param.assetsPortInfo[i] = configObj.assetsPortInfo[i];
        }
      }
      if (configObj.id) { // 已经存在的
        param.id = configObj.id;
        // let originPwd = this.tab2OriginList.find(item => {
        //   return item.id === configObj.id;
        // }).assetsAccountInfo.accountPasswd;
        param.assetsAccountInfo.createDateStr = parseInt(new Date(param.assetsAccountInfo.createDate).getTime() / 1000);
        param.assetsAccountInfo.updateDateStr = param.assetsAccountInfo.updateDate;
        param.assetsAccountInfo.changePswDateStr = param.assetsAccountInfo.changePswDate;
        param.assetsAccountInfo.createDate = null;
        param.assetsAccountInfo.updateDate = null;
        param.assetsAccountInfo.changePswDate = null;
      }
      // 不需要用户名的协议或者没有填写用户名，SNMPV1、SNMPV2除外
      if (param.assetsPortInfo.protocolName === 'VNC' ||
        (!param.assetsAccountInfo.accountName && param.assetsAccountInfo.accountName !== 0 &&
          param.assetsPortInfo.protocolName !== 'SNMPV1' && param.assetsPortInfo.protocolName !== 'SNMPV2'
        )) {
        delete param.assetsAccountInfo;
        param.assetsPortInfo.noneAccount = 1;
      }
      return param;
    },
    delRepeatPro(arr) { // 协议名称、协议端口相同则视为同一个协议，需要去重(web协议特殊，相对路径也相同时去重)
      let l = arr.length;
      for (let i = 0; i < l; i++) {
        for (let j = l - 1; j > i; j--) {
          if (arr[i].assetsPortInfo && arr[j].assetsPortInfo &&
              arr[i].assetsPortInfo.protocolName === arr[j].assetsPortInfo.protocolName &&
              arr[i].assetsPortInfo.port === arr[j].assetsPortInfo.port &&
              ((arr[i].assetsPortInfo.protocolName === 'web' &&
                arr[i].assetsPortInfo.subpath === arr[j].assetsPortInfo.subpath) ||
                arr[i].assetsPortInfo.protocolName !== 'web'
              )) {
            delete arr[j].assetsPortInfo;
            arr[i].assetsPortInfo.updateStemp = 1;
          }
        }
      }
    },
    delRepeatAccount(arr) { // 账号名称、账号角色相同则视为同一个账号，需要去重
      let l = arr.length;
      for (let i = 0; i < l; i++) {
        for (let j = l - 1; j > i; j--) {
          if (arr[i].assetsAccountInfo && arr[j].assetsAccountInfo &&
            arr[i].assetsAccountInfo.accountName === arr[j].assetsAccountInfo.accountName &&
            arr[i].assetsAccountInfo.accountRoleUuid === arr[j].assetsAccountInfo.accountRoleUuid) {
            delete arr[j].assetsAccountInfo;
            arr[i].assetsAccountInfo.updateStemp = 1;
          }
        }
      }
    }
  }
}
