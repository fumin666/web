<template>
  <s-dialog v-model="dialogFlag" title="批量导入">
    <div class="importContainer">
      <s-upload
        :action="baseUrl + '/assetsAccountInfo/importAccountInfo'"
        ref="upload"
        multiple
        :auto-upload="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :on-remove="uploadRemove"
        :on-error="uploadError"
        :with-credentials="true"
        :file-list="fileList">
        <s-button slot="trigger">浏览</s-button>
        <s-button @click="upload">上传</s-button>
        <p class="underLine" @click="downloadTemplate">点击此处下载"资产账号模板"</p>
      </s-upload>
    </div>
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
        fileList: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
    },
    methods: {
      upload() {
        this.$refs.upload.submit();
      },
      beforeUpload() {
      },
      uploadRemove(data) {
        console.log(data)
      },
      uploadSuccess(res, file) {
        let result = res.successNum > 0 ? '成功' : '失败';
        $axios.log({
          data: [file],
          logTemplate: `导入|资产（${this.$parent.assetInfo.controlAdderss}/${this.$parent.assetInfo.itcompName}）>资产账号>账号(${file.name})`,
          result: `${result}`
        });
        this.$message(`失败个数:${res.failNum}, 成功个数:${res.successNum}`);
//        this.$refs.upload.uploadFiles = [];
        this.$emit('reload');
        this.dialogFlag = false;
      },
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
      },
      downloadTemplate() {
        Download('/assetsAccountInfo/importAccountInfoTemplate');
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
  .underLine
    text-decoration underline
    margin-top: 10px
    cursor: pointer
</style>
