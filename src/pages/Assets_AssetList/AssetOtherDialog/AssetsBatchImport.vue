<!--
  @Author: caoLiXin
  @Date: 2019/2/20
  @Desc: 2019-Q1需求，资产批量导入
 -->
<template>
  <s-dialog v-model="dialogFlag" title="导入">
    <div class="importContainer">
      <s-upload
        v-if="dialogFlag" ref="upload"
        :action="`${baseUrl}resourcemanager/assetmanager/itasset/importasset`"
        :auto-upload="false" :with-credentials="true"
        :on-success="uploadSuccess" :on-change="onChangeHandler"
        :on-remove="uploadRemove" :on-error="uploadError"
        :file-list="fileList">
        <s-cascader
          id="template-download-cascade"
          :options="assetTypeOptions" @change="downloadTemplate">
        </s-cascader>
        <s-button icon="folder" slot="trigger" @click="scan">浏览</s-button>
        <div class="s-upload s-upload--text">
          <s-button icon="cloud" @click="upload">点击上传</s-button>
        </div>
        <p class="underLine" @click="showCascade">
          点击此处下载"资产导入模板"
        </p>
      </s-upload>
    </div>
    <s-row style="margin-top: 10px">
      <s-col :span="24" v-if="importAsset">
        <div class="fontcolor85">资产正在导入，请勿操作{{dotText}}</div>
      </s-col>
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
        importAsset: false,
        dot: ['.', '..', '...'],
        dotText: '...',
        dialogFlag: false,
        assetType: [],            // 下载模板-资产类型级联选择器最终选择值
        baseUrl: '',
        fileList: [],
        successData: {
          failNum: '',
          successNum: '',
          fileName: [],
          licenseStatus: ''
        }
      }
    },
    props: {
      // 下载模板-资产类型级联选择器初始化数据
      assetTypeOptions: {
        type: Array,
        required: true
      },
      value: {
        type: Boolean,
        default: false
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
    methods: {
      // 点击"导入模板下载"按钮，显示级联选择器
      showCascade() {
        document.querySelector('#template-download-cascade').click();
      },
      // 下载上传模板
      downloadTemplate(assetType) {
        if (assetType.length === 2) {
          Download(`/resourcemanager/assetmanager/itasset/importassetTemplate/${assetType[0]}/${assetType[1]}/null`);
        } else {
          Download(`/resourcemanager/assetmanager/itasset/importassetTemplate/${assetType[0]}/${assetType[1]}/${assetType[2]}`);
        }
      },
      // 上传
      upload() {
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message.info('请至少上传一个文件！');
        } else {
          this.importAsset = true;
          let i = 0;
          let _this = this;
          _this.immediate = setInterval(() => {
            if (i > 3) {
              i = 0;
            }
            _this.dotText = _this.dot[i]
            i++;
          }, 600);
          this.$refs.upload.submit();
        }
      },
      clearSet() {
        if (this.immediate) {
          clearInterval(this.immediate);
        }
      },
      scan() {
        this.successData.failNum = ''
        this.successData.successNum = ''
        this.successData.fileName = []
      },
      // 有新文件被选择时触发
      onChangeHandler(file, fileList) {
        if (fileList.length > 1) {
          fileList.shift()
        }
        let type = file.name.split('.').pop();
        if (['xls', 'xlsx'].indexOf(type) === -1) {
          this.$message.warning('请选择.xls/.xlsx类型的文件！');
          fileList.pop()
        }
      },
      // 移除已选文件回调
      uploadRemove(data) {
        this.$message.info('文件已移除！');
      },
      // 失败文件下载
      failFileDown() {
        Download(this.successData.fileName[0]);
      },
      // 上传成功回调
      uploadSuccess(res, file) {
        this.importAsset = false;
        this.clearSet()
        if (!res.checkTemplate) {
          this.$refs.upload.uploadFiles = [];
          this.$message.error('模板不正确，请下载最新模板！');
          return
        }
        let result = res.successNum > 0 ? '成功' : '失败';
        $axios.log({
          data: [file],
          logTemplate: `资产导入|资产(${file.name})`,
          result: `${result}`
        });
        this.successData.failNum = res.failNum
        this.successData.successNum = res.successNum
        this.successData.fileName = res.fileName || []
        this.successData.licenseStatus = res.licenseStatus || ''
        this.$refs.upload.uploadFiles = [];
        this.$emit('reload');
      },
      // 上传失败回调
      uploadError() {
        this.clearSet()
        this.importAsset = false;
        this.$message.error('上传失败！');
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
    },
    beforeDestroy() {
      this.clearSet()
    }
  }
</script>

<style lang="stylus">
  #template-download
    float left
    margin-right 4px
  #template-download-cascade
    visibility hidden
    position absolute
    right 19px
    top 12px
  .underLine {
    float: right;
    text-decoration: underline;
    margin-top: 10px;
    cursor: pointer;
  }
</style>
