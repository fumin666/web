<template>
  <div class="importContainer">
    <s-upload
      :action="actionUrl"
      ref="upload"
      accept=".zip"
      :limit="1"
      :auto-upload="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :file-list="fileList">
      <s-button slot="trigger">浏览</s-button>
      <s-button @click="upload">上传</s-button>
    </s-upload>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'

  export default {
    data() {
      return {
        fileList: [],
        actionUrl: `${$axios.basePath()}webcert/uploadCert`
      }
    },
    methods: {
      // 上传
      upload() {
        let suffix = this.$refs.upload.uploadFiles[0].name.split('.').pop()
        suffix !== 'zip' ? this.$message.warning('请上传.zip格式的文件！') : this.$refs['upload'].submit()
      },
      // 上传成功钩子
      uploadSuccess(res) {
        if (res === true) {
          this.$message({
            type: 'success',
            message: '导入成功！'
          })
          Bus.$emit('closeUploadCerDialog', this.$refs.upload.uploadFiles[0].name)
        } else {
          this.$message({
            type: 'error',
            message: '导入失败,请重试！'
          })
        }
        this.$refs.upload.uploadFiles = []
      },
      // 上传失败钩子
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
        this.$refs.upload.uploadFiles = []
      }
    }
  }
</script>

<style scoped lang="stylus">
  .underLine
    text-decoration underline
    cursor pointer
</style>
