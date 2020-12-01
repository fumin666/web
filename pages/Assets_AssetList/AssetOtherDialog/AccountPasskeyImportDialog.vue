
<template>
  <s-dialog v-model="dialogFlag" :title="'密钥文件导入'" width="660px" class="remoteRecDialog">
    <s-row>
      <s-col span="24">
        <div class="grid-content bg-purple" style="font-weight: 600"> <i class="iconfont icon-update"></i> 上传密钥文件</div>
      </s-col>
    </s-row>
    <s-form :model="form" ref="form" label-width="130px">
      <s-form-item label="密钥文件名">
        <s-upload class="upload"
                  :action="uploadUrl"
                  ref="upload"
                  :before-upload="beforeUpload"
                  :on-success="uploadSuccess"
                  :on-error="uploadError"
                  :on-remove="uploadRemove"
                  :with-credentials="true"
                  :file-list="fileList">
          <s-button slot="trigger" icon="export">上传</s-button>
        </s-upload>
      </s-form-item>
      <s-form-item label="附件密码">
        <s-input v-model="form.password" type="password" placeholder="请输入附件密码"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      uploadUrl: `${$axios.basePath()}/assetsAccountInfo/tempImportSshKey`,
      dialogFlag: false,
      fileList: [],
      form: {
        fileName: '',
        password: ''
      },
      ftpList: [] // 远程服务器列表
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    beforeUpload(file) {
      let arr = file.name.split('.')
      let num = arr.length - 1
      if (file.size > 10 * 1024 * 1024) {
        this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
        return false;
      }
      if (arr[num] !== 'zip') {
        this.$message.error('文件类型必须是zip');
        return false
      }
    },
    uploadSuccess(res, file, fileList) {
      if (res.state) {
        this.$message({type: 'success', message: '上传成功'});
        this.fileList = fileList;
        this.form.fileName = res.errormsg;
      } else {
        this.$message({type: 'error', message: '上传失败'});
        this.fileList = [];
        this.form.fileName = '';
      }
    },
    uploadError() {
      this.$message({type: 'error', message: '上传失败'});
      this.form.fileName = '';
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList;
    },
    dialogOk() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          type: 'warning',
          message: '请至少选择一个文件！'
        });
        return
      }
      let param = {
        path: this.form.fileName,
        password: this.form.password
      };
      $axios.post(`/assetsAccountInfo/importSshKeyFile`, param, {
        data: [],
        logTemplate: '密钥文件导入|密钥文件(SshKeyFile)'
      }).then(({data}) => {
        if (data.state === true) {
          this.dialogFlag = false;
          this.$message({showClose: true, message: '导入成功', type: 'success'});
        } else {
          this.$message({showClose: true, message: '导入失败', type: 'error'});
        }
      });
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
  },
  components: {
  }
}
</script>

<style lang="stylus">

.remoteRecDialog-checkbox {
  float: left;

  .remoteRecDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
