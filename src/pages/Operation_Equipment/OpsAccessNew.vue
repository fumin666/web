<!--
 * @Author: songyf
 * @Date: 2019-12-5
 * @LastEditors: songyf
 * @Description: 运维中心-运维访问（new）
 -->
<template>
  <div class="opsAccess-box">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :model="searchForm" ref="searchForm" :rules="ruleRules" label-width="120px" class="searchForm" @submit.native.prevent>
        <s-form-item label="协议名称" prop="protocluuid">
          <s-select v-model="searchForm.protocluuid" filterable clearable @change="changeProtocl">
            <s-option v-for="item in opsProtocolOptions" :label="item.protocolName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="端口" prop="port">
          <s-input v-model="searchForm.port"></s-input>
        </s-form-item>

        <!--动态模块-->
        <s-form-item label="密码方式" prop="passwordType" v-if="loginTypeShow">
          <s-select v-model="searchForm.passwordType" @change="selectChangePassType">
            <s-option label="口令" :value=0 ></s-option>
            <s-option label="密钥" :value=1></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-if="userShow" label="资产账号名称" prop="accountName">
          <s-col span="20" >
            <s-input v-model="searchForm.accountName"></s-input>
          </s-col>
        </s-form-item>
        <div  v-if="!isKeyFileShow">
          <s-form-item v-if="pwdShow" label="密码" prop="accountPwd">
            <s-col span="20" >
              <s-input type="password" v-model="searchForm.accountPwd"></s-input>
            </s-col>
          </s-form-item>
        </div>
        <s-form-item label="私钥文件" v-if="isKeyFileShow">
          <s-upload class="upload"
                    :action="uploadUrl"
                    multiple
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-remove="uploadRemove"
                    :with-credentials="true"
                    :file-list="fileList">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
        <s-form-item v-if="isKeyFileShow" label="私钥密码">
          <s-col span="20" >
            <s-input type="password" v-model="searchForm.strKeyPasswd"></s-input>
          </s-col>
        </s-form-item>
        <s-form-item v-if="dbShow" label="数据库/实例名" prop="dbname">
          <s-col span="20">
            <s-input type="text" v-model="searchForm.dbname"></s-input>
          </s-col>
        </s-form-item>

        <template v-if="browserFlag">
          <s-form-item label="相对路径" prop="subpath">
            <s-col span="20" >
              <s-input type="text" v-model="searchForm.subpath"></s-input>
            </s-col>
          </s-form-item>
          <s-form-item label="浏览器">
            <s-col span="8">
              <s-select v-model="searchForm.browser" placeholder="请选择分辨率">
                <s-option label="Internet Explorer" :value=0 ></s-option>
                <s-option label="FireFox" :value=1></s-option>
              </s-select>
            </s-col>
          </s-form-item>
          <s-form-item label="提交方式">
            <s-col span="8">
              <s-select v-model="searchForm.submitType" placeholder="请选择分辨率">
                <s-option label="按钮" :value=0></s-option>
                <s-option label="链接" :value=1></s-option>
                <s-option label="不代填" :value=2></s-option>
                <s-option label="不提交" :value=3></s-option>
              </s-select>
            </s-col>
          </s-form-item>
          <s-form-item label="代填用户控件名" prop="userLableName">
            <s-col span="20" >
              <s-input type="text" v-model="searchForm.userLableName"></s-input>
            </s-col>
          </s-form-item>
          <s-form-item label="代填密码控件名" prop="pwdLableName">
            <s-col span="20" >
              <s-input type="text" v-model="searchForm.pwdLableName"></s-input>
            </s-col>
          </s-form-item>
        </template>

        <template v-if="screenShow">
          <s-form-item label="屏幕分辨率" prop="resolution">
            <s-col span="8">
              <s-select v-model="searchForm.resolution" placeholder="请选择分辨率">
                <s-option v-for="(val, key) in resolution" :key="key" :label="val" :value="key"></s-option>
              </s-select>
            </s-col>
          </s-form-item>
          <s-form-item label="颜色深度" prop="colorDepth">
            <s-col span="8">
              <s-select v-model="searchForm.colorDepth" placeholder="请选择颜色深度">
                <s-option v-for="(val, key) in colorDepth" :key="key" :label="val" :value="key"></s-option>
              </s-select>
            </s-col>
          </s-form-item>
        </template>
        <s-form-item v-if="consoleShow" label="console" prop="rdpConsole">
          <s-col span="8" >
            <s-select v-model="searchForm.rdpConsole" placeholder="请选择console">
              <s-option v-for="(val, key) in rdpConsole" :key="key" :label="val" :value="key"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
      </s-form>
      <div v-if="isOpen === 1 && (userShow || pwdShow)">
        <span style="margin-right: 44px;">半自动代填</span>
        <s-radio-group v-model="searchForm.isAutoRecord">
          <s-radio :label="1">开启</s-radio>
          <s-radio :label="0">关闭</s-radio>
        </s-radio-group>
      </div>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  const defaultProtocolName = '00000000000000000000000000000072'  // ssh
  export default {
    props: {
      isOpen: {
        type: Number
      },
      rowData: {
        type: Object,
        require: true,
        default: {}
      }
    },
    components: {
    },
    data() {
      let checkPort = (rule, value, callback) => {  // 校验端口号
        if (value > 65535) {
          callback(new Error('端口号不能大于65535！'));
        } else {
          callback()
        }
      };
      return {
        isEdit: false,
        showModel: 0,
        opsProtocolOptions: [],
        isKeyFileShow: false,
        loginTypeShow: false,
        userShow: false,
        pwdShow: false,
        dbShow: false,
        screenShow: false,
        consoleShow: false,
        browserFlag: false,
        uploadUrl: `${$axios.basePath()}/assetsAccountInfo/tempImportSshKey`,
        fileList: [],
        searchForm: {
          itcompUuid: this.rowData.itcompUuid,
          accountName: '',
          passwordType: 0,
          strKeyPasswd: '',
          diskMapping: '',
          operationuuid: this.rowData.uuid,
          oprationIp: '',
          portuuid: '',
          accountPwd: '',
          clipboard: '',
          colorDepth: '',
          rdpConsole: '',
          dbname: '',
          resolution: '',
          strKeyPath: '',
          isAutoRecord: 1,
          orderOperationNumber: '',
          protocluuid: '',
          port: '',
          subpath: '',
          browser: 0,
          submitType: 0,
          userLableName: '',
          pwdLableName: ''
        },
        colorDepth: {},
        rdpConsole: {},
        resolution: {},
        ruleRules: {
          protocluuid: [Validaters.SelectValNotNull],
          port: [
            Validaters.NotNull,
            Validaters.Number,
            {validator: checkPort, trigger: 'blur'}
          ],
          name: [Validaters.NotNull, Validaters.Max(50)],
          password: [Validaters.NotNull, Validaters.Max(50)],
          accountName: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          accountPwd: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          strKeyPasswd: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          colorDepth: [
            Validaters.SelectValNotNull
          ],
          rdpConsole: [
            Validaters.SelectValNotNull
          ],
          dbname: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          resolution: [
            Validaters.SelectValNotNull
          ],
          subpath: [
            Validaters.NotNull,
            Validaters.Max(255)
          ],
          userLableName: [
            Validaters.Max(50)
          ],
          pwdLableName: [
            Validaters.Max(50)
          ]
        }
      }
    },
    watch: {
      // 'searchForm.protocluuid': {
      //   immediate: true,
      //   handler(val) {
      //     this.opsProtocolOptions.map(v => {
      //       if (v.uuid === val) {
      //         this.searchForm.port = v.protocolPort;
      //         this.getShowModel(v.uuid);
      //       }
      //     })
      //   }
      // }
    },
    created() {
      this.init();
      this.getInitOptions();
    },
    methods: {
      changeProtocl(val) {
        this.opsProtocolOptions.map(v => {
          if (v.uuid === val) {
            this.searchForm.port = v.protocolPort;
            this.searchForm.passwordType = 0
            this.getShowModel(v.uuid);
            this.initState(); // 初始化状态
          }
        })
      },
      getOpsProtocolOptions() { // 获取协议下拉框
        $axios.post('/basicOperation/getOperationProtocolList').then((res) => {
          if (res.data) {
            this.opsProtocolOptions = res.data
            this.getIsEdit()
          }
        });
      },
      getIsEdit() {
        $axios.get(`basicOperation/getAccountByMaintain/${this.rowData.uuid}/1`).then((res) => {
          if (res.data.isAutoRecord === 1) {
            this.isEdit = true
            this.getEditData();
          } else {
            this.searchForm.protocluuid = defaultProtocolName;
            this.changeProtocl(this.searchForm.protocluuid)
          }
        })
      },
      getEditData() {
        let vm = this;
        if (this.isEdit && vm.isOpen === 1) {
          $axios.get(`/basicOperation/getAccountByMaintain/${vm.rowData.uuid}/1`).then((res) => {
            vm.searchForm.isAutoRecord = res.data.isAutoRecord === null ? 1 : res.data.isAutoRecord;
            vm.searchForm.protocluuid = res.data.protocluuid || defaultProtocolName
            vm.changeProtocl(vm.searchForm.protocluuid)
            vm.searchForm.passwordType = res.data.passwordType;
            vm.searchForm.port = res.data.port || 22
            vm.searchForm.subpath = res.data.subpath
            vm.searchForm.browser = res.data.browser === null ? 0 : res.data.browser
            vm.searchForm.submitType = res.data.submitType === null ? 0 : res.data.submitType
            vm.searchForm.userLableName = res.data.userLableName
            vm.searchForm.pwdLableName = res.data.pwdLableName
            if (res.data.isAutoRecord === 0) {
              vm.searchForm.passwordType = 0
            }
            if (res.data.passwordType === 0) {
              vm.fileList = []
              vm.searchForm.strKeyPath = null
              vm.searchForm.strKeyPasswd = null
              vm.searchForm.accountPwd = res.data.accountPass;
              vm.searchForm.accountName = res.data.accountName;
              vm.isKeyFileShow = false
            } else if (res.data.passwordType === 1) {
              vm.fileList = [{name: res.data.strKeyPath.split('/')[res.data.strKeyPath.split('/').length - 1], response: {errormsg: res.data.strKeyPath}}]
              vm.searchForm.strKeyPath = res.data.strKeyPath
              vm.searchForm.strKeyPasswd = res.data.strKeyPasswd
              vm.searchForm.accountName = res.data.accountName;
              vm.searchForm.accountPwd = null;
              vm.isKeyFileShow = true
            } else {
              vm.isKeyFileShow = false
              vm.searchForm.passwordType = 0
              vm.searchForm.accountName = res.data.accountName;
              vm.searchForm.accountPwd = res.data.accountPass;
            }
            if (vm.rowData.accountUuid !== 'noneaccount000000000000000000000') {
              vm.searchForm.accountuuid = vm.rowData.accountUuid
            }
            vm.searchForm.diskMapping = vm.rowData.disk_mappingNum
            vm.searchForm.orderOperationNumber = vm.rowData.orderOperationNumber
            vm.searchForm.oprationIp = vm.rowData.device_ip
            vm.searchForm.operationuuid = vm.rowData.uuid
            vm.searchForm.portuuid = vm.rowData.portUuid
            vm.searchForm.clipboard = vm.rowData.clipboardNum

            if (vm.rowData.dbName !== null || this.rowData.dbServerName !== null) {
              vm.searchForm.dbname = vm.rowData.dbName
            }
          })
        } else {
          this.searchForm.protocluuid = defaultProtocolName;
          this.searchForm.isAutoRecord = 0;
          this.changeProtocl(this.searchForm.protocluuid)
        }
      },
      getShowModel(protocolUuid) {  // 获取showModel类型
        $axios.get(`/basicOperation/getOperatonDialog/${protocolUuid}`).then(({data}) => {
          if (data) {
            this.showModel = data.showModel
            this.changeShowModel()
          }
        });
      },
      getInitOptions() { // 获取初始状态的options
        $axios.get('/basicOperation/getOperationBoxParams').then(({data}) => {
          this.colorDepth = data.colorDepth;
          this.rdpConsole = data.rdpConsole;
          this.resolution = data.resolution;
          this.searchForm.colorDepth = Object.keys(this.colorDepth)[0]
          this.searchForm.rdpConsole = Object.keys(this.rdpConsole)[0]
          this.searchForm.resolution = Object.keys(this.resolution)[0]
        });
      },
      init() { // 回显数据
        this.getOpsProtocolOptions();
      },
      changeShowModel() {
        switch (this.showModel) {
          case 1 :
            this.userShow = true;
            this.pwdShow = true;
            break;
          case 2 :
            this.dbShow = true;
            break;
          case 3 :
            this.userShow = true;
            this.pwdShow = true;
            this.dbShow = true;
            break;
          case 4 :
            this.screenShow = true;
            this.consoleShow = true;
            break;
          case 5 :
            this.userShow = true;
            this.pwdShow = true;
            this.screenShow = true;
            this.consoleShow = true;
            break;
          case 6 :
            this.screenShow = true;
            break;
          case 7 :
            this.pwdShow = true;
            this.screenShow = true;
            break;
          case 8 :
            this.loginTypeShow = true;
            this.userShow = true;
            this.pwdShow = true;
            break;
          case 9 :
            this.userShow = true;
            this.pwdShow = true;
            this.browserFlag = true;
            this.screenShow = true;
            this.consoleShow = true;
            break;
        }
      },
      initState() {
        this.isKeyFileShow = false;
        this.loginTypeShow = false;
        this.userShow = false;
        this.pwdShow = false;
        this.dbShow = false;
        this.screenShow = false;
        this.browserFlag = false;
        this.consoleShow = false;

        this.searchForm.accountPwd = '';
        this.searchForm.accountName = '';
      },
      selectChangePassType (val) { // 密码方式
        if (val === 1) {
          this.isKeyFileShow = true
        } else {
          this.isKeyFileShow = false
        }
      },
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        this.$message({type: 'success', message: '上传成功'});
        this.fileList = fileList;
        this.searchForm.strKeyPath = res.errormsg
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
        this.searchForm.strKeyPath = ''
      },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      }
    }
  }
</script>
<style>
  .opsAccess-box .s-select, .opsAccess-box .s-input{
    width: 250px;
  }
</style>

