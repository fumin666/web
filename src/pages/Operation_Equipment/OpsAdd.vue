<template>
  <section>
    <s-form ref="addForm" :model="form" :rules="rules" label-width="120px" class="accountAddForm" @submit.native.prevent>
      <s-form-item label="密码方式" prop="passwordType" v-if="loginTypeShow">
        <s-select v-model="form.passwordType" @change="selectChangePassType">
          <s-option label="口令" :value=0 ></s-option>
          <s-option label="密钥" :value=1></s-option>
        </s-select>
      </s-form-item>
      <s-form-item v-if="userShow" label="资产账号名称" prop="accountName">
        <s-col span="20" >
          <s-input v-model="form.accountName"></s-input>
        </s-col>
      </s-form-item>
      <div  v-if="!isKeyFileShow">
        <s-form-item v-if="pwdShow" label="密码" prop="accountPwd">
          <s-col span="20" >
            <s-input type="password" v-model="form.accountPwd"></s-input>
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
          <s-input type="password" v-model="form.strKeyPasswd"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item v-if="dbShow" label="数据库" prop="dbname">
        <s-col span="8">
          <s-select v-model="form.dbname" placeholder="请选择数据库">
            <s-option v-for="(val, key) in dbList" :key="key" :label="val" :value="val"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <template v-if="screenShow">
        <s-form-item label="屏幕分辨率" prop="resolution">
          <s-col span="8">
            <s-select v-model="form.resolution" placeholder="请选择分辨率">
              <s-option v-for="(val, key) in resolution" :key="key" :label="val" :value="key"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
        <s-form-item label="颜色深度" prop="colorDepth">
          <s-col span="8">
            <s-select v-model="form.colorDepth" placeholder="请选择颜色深度">
              <s-option v-for="(val, key) in colorDepth" :key="key" :label="val" :value="key"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
      </template>
      <s-form-item v-if="consoleShow" label="console" prop="rdpConsole">
        <s-col span="8" >
          <s-select v-model="form.rdpConsole" placeholder="请选择console">
            <s-option v-for="(val, key) in rdpConsole" :key="key" :label="val" :value="key"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
    </s-form>
    <div v-if="isOpen === 1 && (userShow || pwdShow)">
      <span style="margin-right: 44px;">半自动代填</span>
      <s-radio-group v-model="form.isAutoRecord">
        <s-radio :label="1">开启</s-radio>
        <s-radio :label="0">关闭</s-radio>
      </s-radio-group>
    </div>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        isKeyFileShow: false,
        loginTypeShow: false,
        userShow: false,
        pwdShow: false,
        dbShow: false,
        screenShow: false,
        consoleShow: false,
        uploadUrl: `${$axios.basePath()}/assetsAccountInfo/tempImportSshKey`,
        fileList: [],
        form: {
          accountName: '',
          passwordType: 0,
          strKeyPasswd: '',
          diskMapping: '',
          operationuuid: '',
          oprationIp: '',
          portuuid: '',
          protocluuid: '',
          accountPwd: '',
          clipboard: '',
          colorDepth: '',
          rdpConsole: '',
          dbname: '',
          resolution: '',
          strKeyPath: '',
          isAutoRecord: 1,
          orderOperationNumber: ''
        },
        rules: {
          accountName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          accountPwd: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          strKeyPasswd: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          colorDepth: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          rdpConsole: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          dbname: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          resolution: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        },
        colorDepth: {},
        rdpConsole: {},
        resolution: {},
        dbList: []
      }
    },
    props: {
      decisionData: {
        type: Object
      },
      showModel: {
        type: Number
      },
      isOpen: {
        type: Number
      }
    },
    mounted() {
      if (this.form.isAutoRecord === 1 && this.isOpen === 1) {
        $axios.get(`/basicOperation/getAccountByMaintain/${this.decisionData.uuid}/1`).then((res) => {
          this.form.isAutoRecord = res.data.isAutoRecord;
          this.form.passwordType = res.data.passwordType
          if (res.data.isAutoRecord === 0) {
            this.form.passwordType = 0
          }
          if (res.data.passwordType === 0) {
            this.fileList = []
            this.form.strKeyPath = null
            this.form.strKeyPasswd = null
            this.form.accountPwd = res.data.accountPass;
            this.form.accountName = res.data.accountName;
            this.isKeyFileShow = false
          } else if (res.data.passwordType === 1) {
            this.fileList = [{name: res.data.strKeyPath.split('/')[res.data.strKeyPath.split('/').length - 1], response: {errormsg: res.data.strKeyPath}}]
            this.form.strKeyPath = res.data.strKeyPath
            this.form.strKeyPasswd = res.data.strKeyPasswd
            this.form.accountName = res.data.accountName;
            this.form.accountPwd = null;
            this.isKeyFileShow = true
          } else {
            this.isKeyFileShow = false
            this.form.passwordType = 0
            this.form.accountName = res.data.accountName;
            this.form.accountPwd = res.data.accountPass;
          }
        })
      } else {
        this.form.isAutoRecord = 1
      }
      if (this.decisionData !== undefined) {
        if (this.decisionData.accountUuid !== 'noneaccount000000000000000000000') {
          this.form.accountuuid = this.decisionData.accountUuid
        }
        this.form.diskMapping = this.decisionData.disk_mappingNum
        this.form.orderOperationNumber = this.decisionData.orderOperationNumber
        this.form.oprationIp = this.decisionData.device_ip
        this.form.operationuuid = this.decisionData.uuid
        this.form.portuuid = this.decisionData.portUuid
        this.form.protocluuid = this.decisionData.protocolUuid
        this.form.clipboard = this.decisionData.clipboardNum
        if (this.decisionData.dbName !== null || this.decisionData.dbServerName !== null) {
          this.dbList = (this.decisionData.dbName || this.decisionData.dbServerName).split(',')
          this.form.dbname = this.dbList[0]
        }
      }
      $axios.get('/basicOperation/getOperationBoxParams').then(response => {
        this.colorDepth = response.data.colorDepth;
        this.rdpConsole = response.data.rdpConsole;
        this.resolution = response.data.resolution;
        this.form.colorDepth = Object.keys(this.colorDepth)[0]
        this.form.rdpConsole = Object.keys(this.rdpConsole)[0]
        this.form.resolution = Object.keys(this.resolution)[0]
      });
      switch (this.showModel) {
        case 1 : this.userShow = true;
          this.pwdShow = true;
          break;
        case 2 : this.dbShow = true;
          break;
        case 3 : this.userShow = true;
          this.pwdShow = true;
          this.dbShow = true;
          break;
        case 4 : this.screenShow = true;
          this.consoleShow = true;
          break;
        case 5 : this.userShow = true;
          this.pwdShow = true;
          this.screenShow = true;
          this.consoleShow = true;
          break;
        case 6 : this.screenShow = true;
          break;
        case 7 : this.pwdShow = true;
          this.screenShow = true;
          break;
        case 8 : this.loginTypeShow = true;
          this.userShow = true;
          this.pwdShow = true;
          break;
      }
    },
    methods: {
      selectChangePassType (val) {
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
        this.form.strKeyPath = res.errormsg
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
        this.form.strKeyPath = ''
      },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      }
    }
  }
</script>
