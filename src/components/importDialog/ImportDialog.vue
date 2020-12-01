<template>
  <s-dialog v-model="dialogFlag" title="导入" append-to-body class="dialogImport">
    <slot></slot>
    <div class="importContainer">
      <s-upload v-if="dialogFlag" :action="baseUrl + uploadObj.url" ref="upload" :auto-upload="false" :on-success="uploadSuccess" :on-change="onChangeHandler" :on-remove="uploadRemove" :on-error="uploadError" :with-credentials="true" :file-list="fileList">
        <s-button icon="folder" slot="trigger">浏览</s-button>
        <div class="s-upload s-upload--text">
          <s-button icon="cloud" @click="upload" :disabled="uploadBtnFlag">点击上传</s-button>
        </div>
        <p class="underLine" @click="downloadTemplate" v-if="hasDownload">
          点击此处下载"{{downObj.text || downText}}"
        </p>
      </s-upload>
    </div>
    <s-row style="margin-top: 10px">
      <s-col :span="8">
        <div class="grid-content bg-purple">导入成功</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{successData.successNum || '--'}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="8">
        <div class="grid-content bg-purple">导入失败</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">
          {{successData.failNum || '--'}}
          <span>{{successData.licenseStatus ? `(${successData.licenseStatus})` : ''}}</span>
        </div>
      </s-col>
    </s-row>
    <s-row v-if="successData.fileName.length>0">
      <s-col :span="8">
        <div class="grid-content bg-purple">失败记录下载</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">
          <span>导入失败的记录下载</span>
          <span style="cursor: pointer;margin-left: 15px"><i @click="failFileDown()" class="iconfont icon-download"></i></span>
        </div>
      </s-col>
    </s-row>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Download} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      baseUrl: '',
      fileList: [],
      hasDownload: false,
      axiosType: 'get',
      downText: '模板',
      successData: {
        failNum: '',
        successNum: '',
        fileName: [],
        licenseStatus: ''
      },
      uploadBtnFlag: false
    }
  },
  props: {
    uploadObj: {
      type: Object,
      require: true
    },
    downObj: {
      type: Object,
      default() {
        return {
          text: '模板',
          type: 'get'
        }
      }
    },
    saveLog: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    fileTypes: {
      type: Array
    },
    modelName: {
      type: String,
      default: '文件'
    }
  },
  created() {
    this.baseUrl = $axios.basePath();
    if (Object.keys(this.downObj).length !== 0) {
      this.hasDownload = true;
    }
    if (this.uploadObj.hasOwnProperty('type')) {
      this.axiosType = this.uploadObj['type'];
    }
  },
  methods: {
    upload() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          type: 'info',
          message: `请至少上传一个文件`
        });
      } else {
        this.uploadBtnFlag = true;
        this.$refs.upload.submit();
      }
    },
    onChangeHandler(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (this.fileTypes) {
        let type = file.name.split('.').pop();
        let message = `请选择${this.fileTypes.toString()}类型的文件`;
        if (this.fileTypes.indexOf(type) === -1) {
          this.$message({
            type: 'error',
            message: message
          });
          fileList.pop()
        }
      }
    },
    uploadRemove(data) {
      console.log(data)
    },
    failFileDown() {
      Download(this.successData.fileName[0]);
    },
    uploadSuccess(res, file) {
      this.uploadBtnFlag = false;
      if (!res.checkTemplate) {
        this.$message({type: 'error', message: '模板不正确，请下载最新模板！'});
        return
      }
      // if (this.saveLog) {
        let result = res.successNum > 0 ? '成功' : '失败';
        $axios.log({
          data: [file],
          logTemplate: `导入|${this.modelName}(${file.name})`,
          result: `${result}`
        });
      // }
      this.successData.failNum = res.failNum
      this.successData.successNum = res.successNum
      this.successData.fileName = res.fileName || []
      this.successData.licenseStatus = res.licenseStatus || ''
      this.$refs.upload.uploadFiles = [];
      this.$emit('reload');
    },
    uploadError() {
      this.uploadBtnFlag = false;
      this.$message({
        type: 'error',
        message: '上传失败'
      });
    },
    downloadTemplate() {
      if (this.downObj.type === 'post') {
        Download(this.downObj.url, {type: 'post', data: this.downObj.params});
      } if (this.downObj.type === 'check') { // 是不是需要校验
        let obj = this.downObj.check();
        if (obj.state) {
          Download(this.downObj.url, {type: 'checkpost', data: obj.params});
        } else {
          this.$message({showClose: true, message: obj.message, type: 'error'});
        }
      } else {
        Download(this.downObj.url);
      }
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

<style lang="stylus">
.underLine {
  float: right;
  text-decoration: underline;
  margin-top: 10px;
  cursor: pointer;
}
</style>
