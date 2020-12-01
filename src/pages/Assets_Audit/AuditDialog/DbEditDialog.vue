<template>
  <s-dialog v-model="dialogFlag" title="配置" width="600px" class="dbEditDialog">
    <s-scrollbar wrap-class="">
      <s-form :model="dbForm" :rules="dbRules" ref="dbForm" label-width="120px">
        <s-form-item label="数据库类型">
          <span>{{dbForm.protocolName}}</span>
        </s-form-item>
        <s-form-item label="重定向" v-if="curDb.protocolName !== 'SQL SERVER'">
          <s-radio-group v-model="dbForm.redir">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <template v-if="curDb.protocolName === 'SQL SERVER'">
          <s-form-item label="SSL">
            <s-radio-group v-model="dbForm.sslEnabled">
              <s-radio :label="0">否</s-radio>
              <s-radio :label="1">是</s-radio>
            </s-radio-group>
          </s-form-item>
          <template v-if="dbForm.sslEnabled === 1">
            <s-form-item label="文件类型">
              <s-radio-group v-model="dbForm.isPfx">
                <s-radio :label="0">pem</s-radio>
                <s-radio :label="1">pfx</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-form-item label="密钥文件">
              <s-upload
                ref="upload"
                :action="upLoadUrl"
                :on-success="uploadSuccess"
                :before-upload="beforeUpload"
                :on-remove="uploadRemove"
                :on-error="uploadError"
                :file-list="fileList">
                <s-button slot="trigger">点击上传</s-button>
              </s-upload>
            </s-form-item>
            <s-form-item label="文件密码" prop="privatekeyPasswd">
              <s-input v-model="dbForm.privatekeyPasswd"></s-input>
            </s-form-item>
          </template>
        </template>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        dbForm: {
          protocolName: '',
          redir: '', // 重定向
          sslEnabled: 0,
          isPfx: 0,
          privatekeyPath: '', // 上传文件之后返回的文件路径
          privatekeyPasswd: ''
        },
        dbRules: {
          privatekeyPasswd: [Validaters.Max(16)]
        },
        upLoadUrl: '',
        fileList: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curDb: {
        type: Object
      }
    },
    computed: {
      isPortFixed() {
        if (this.dbForm.redir === 0) {
          return 1;
        } else if (this.dbForm.redir === 1) {
          return 0;
        }
        return '';
      }
    },
    created() {
      this.upLoadUrl = $axios.basePath() + '/sysDbauditObject/uploadSslFile';
      for (let i in this.dbForm) {
        if (this.curDb.hasOwnProperty(i)) {
          if (i !== 'privatekeyPath') {
            this.dbForm[i] = this.curDb[i];
          } else {
            let fileArr = this.curDb.privatekeyPath.split('/');
            this.fileList = [{name: fileArr[fileArr.length - 1]}]
          }
        }
      }
    },
    methods: {
      beforeUpload(file) {
        if (this.fileList.length === 1) {
          this.$message({showClose: true, message: '只能上传一个密钥文件', type: 'error'});
//          this.$refs.upload.uploadFiles.pop();
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        fileList[0].name = res.fileName;
        this.fileList = fileList;
    },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      axiosSaveSqlserver(param, logParam) {
        $axios.post(`/sysDbauditObject/changeSqlServer`, param, logParam).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        });
      },
      dialogOk() {
        this.$refs.dbForm.validate(valid => {
          if (!valid) return;
          let param = {
            assetUuid: this.curDb.assetUuid,
            id: this.curDb.dbiId,
            portUuid: this.curDb.portUuid
          };
          let logParam = {
            data: [this.curDb],
            logTemplate: '编辑|数据库配置(#dbiName#)'
          };
          if (this.dbForm.sslEnabled === 1) {
            if (this.fileList.length < 1) {
              this.$message({showClose: true, message: '最少上传一个密钥文件', type: 'error'});
              return
            }
          }
          if (this.curDb.protocolName !== 'SQL SERVER') { // 只变更重定向
            param.isPortFixed = this.isPortFixed;
            $axios.post(`/sysDbauditObject/changeRedirect`, param, logParam).then(({data}) => {
              if (data === true) {
                this.$message({showClose: true, message: '保存成功!', type: 'success'});
                this.$emit('reload');
                this.dialogFlag = false;
              } else {
                this.$message({showClose: true, message: '保存失败!', type: 'error'});
              }
            });
          } else { // 上传文件之后再保存sql server配置
            for (let i in this.dbForm) {
              if (i !== 'protocolName' && i !== 'redir') {
                param[i] = this.dbForm[i];
              }
            }
            this.axiosSaveSqlserver(param, logParam);
          }
        })
      }
    },
    watch: {
      fileList: {
        deep: true,
        handler(val) {
          this.dbForm.privatekeyPath = val[0] ? val[0].name : '';
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      'dbForm.isPfx': function(val) {
        if (val === 1) {
            this.dbRules.privatekeyPasswd = [Validaters.NotNull]
        } else {
            this.dbRules.privatekeyPasswd = []
        }
      }
    }
  }
</script>

<style lang="stylus">
  .dbEditDialog
    .s-form-item-content
      & > .s-radio-group
        width 100%
        .s-radio
          width: 50%
        .s-radio + .s-radio
          margin-left 0
      .filePath
        margin-left: 5px
      .s-upload-list__item-name
        margin-right 0
</style>
