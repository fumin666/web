<template>
  <s-dialog v-model="dialogFlag" :title="passKeyTitle" id="selectUserDialog" width="700px" append-to-body>
   <div class="addAccountDialog">
     <s-row class="title">SSH密钥设置</s-row>
     <s-form :model="assetForm" :rules="assetRules" ref="assetForm" label-width="100px">
       <s-form-item label="密钥操作" prop="keyGenerate">
         <s-select v-model="assetForm.keyGenerate" @change="selectChangekeyGenerate">
           <s-option label="密钥导入" :value=0></s-option>
           <s-option label="密钥生成" :value=1></s-option>
         </s-select>
       </s-form-item>
       <s-form-item label="私钥文件" v-if="isPrivateKeyFile">
         <s-upload class="upload"
                   :action="uploadUrl"
                   :before-upload="beforeUpload"
                   :on-success="uploadSuccess"
                   :on-error="uploadError"
                   :on-remove="uploadRemove"
                   :with-credentials="true"
                   :file-list="assetForm.fileList">
           <s-button slot="trigger" icon="export">上传</s-button>
         </s-upload>
       </s-form-item>
       <s-form-item label="私钥加密" prop="privateKeyEncryption">
         <s-radio-group v-model="assetForm.privateKeyEncryption" @change="selectChangeprivateKey">
           <s-radio :label="1">是</s-radio>
           <s-radio :label="0">否</s-radio>
         </s-radio-group>
       </s-form-item>
       <s-form-item label="私钥密码" prop="privateKeyPasswd" v-if="isPrivateKeyPasswd">
         <s-input v-model="assetForm.privateKeyPasswd" type="password" :maxlength="30" :placeholder="isPrivateKeyFile ? '': '建议至少5个字符' "></s-input>
       </s-form-item>
     </s-form>
     <div slot="footer" class="dialog-footer" style="text-align: right">
       <s-button @click="dialogOk('again')" v-if="passKeyTitle === '密钥设置' ? false : true">继续添加</s-button>
       <s-button @click="dialogOk()">确定</s-button>
       <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
     </div>
   </div>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        baseUrl: $axios.basePath(),
        uploadUrl: '',
        dialogFlag: false,
        isPrivateKeyPasswd: true,
        isPrivateKeyFile: true,
        assetForm: {
          keyGenerate: 0,
          privateKeyEncryption: 1,
          privateKeyPasswd: '',
          fileList: []
        },
        assetRules: {
          keyGenerate: [
            Validaters.SelectNumNotNull
          ],
          privateKeyEncryption: [
            Validaters.NotNull
          ],
          privateKeyPasswd: [
            Validaters.NotNull
          ]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      accountUuid: String,
      passKeyTitle: String,
      accountRow: {
        type: Object,
        default: {}
      }
    },
    created() {
      this.uploadUrl = `${this.baseUrl}/assetsAccountInfo/uploadSshKey/${this.accountUuid}`;
      if (this.accountRow.uuid) {
        this.assetForm.keyGenerate = this.accountRow.keyType;
        this.assetForm.privateKeyEncryption = this.accountRow.secretKeyRegeneration;
        this.assetForm.privateKeyPasswd = this.accountRow.secretKeyPasswd;
        if (this.accountRow.keyFileName) {
          this.assetForm.fileList = [{name: this.accountRow.keyFileName}];
        } else {
          this.assetForm.fileList = []
        }
        this.selectChangekeyGenerate(this.assetForm.keyGenerate);
        this.selectChangeprivateKey(this.assetForm.privateKeyEncryption);
      }
    },
    methods: {
      dialogOk(again) {
        let vm = this;
        vm.$refs.assetForm.validate(valid => {
          if (!valid) return;
          if (vm.isPrivateKeyFile) {
            if (vm.assetForm.fileList.length <= 0) {
              vm.$message({showClose: true, message: '请上传文件', type: 'warning'});
              return
            }
          }
          let param = {
            accountUuid: vm.accountUuid,
            keyType: vm.assetForm.keyGenerate,
            secretKeyRegeneration: vm.assetForm.privateKeyEncryption,
            secretKeyPasswd: vm.assetForm.privateKeyPasswd
          };
          $axios.post(`/assetsAccountInfo/saveSshKey`, param).then(({data}) => {
            if (data.state === true) {
              vm.dialogFlag = false;
              vm.$message({showClose: true, message: data.errormsg, type: 'success'});
              vm.$emit('saveAsset', again);
            } else {
              vm.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        })
      },
      dialogCancel() {
        this.dialogFlag = false;
      },
      selectChangekeyGenerate (val) {
        if (val === 0) {
          this.isPrivateKeyFile = true;
        } else {
          this.isPrivateKeyFile = false;
        }
      },
      selectChangeprivateKey (val) {
        if (val === 0) {
          this.isPrivateKeyPasswd = false;
        } else {
          this.isPrivateKeyPasswd = true;
        }
      },
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
        if (this.assetForm.fileList.length > 0) {
          this.$message({type: 'error', message: '只允许上传一个文件!'});
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        if (res.state) {
          this.$message({type: 'success', message: res.errormsg});
          this.assetForm.fileList = fileList;
        } else {
          this.$message({type: 'error', message: res.errormsg});
          this.assetForm.fileList = [];
        }
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      uploadRemove(file, fileList) {
        this.assetForm.fileList = fileList;
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
    }
  }
</script>

<style>
</style>

