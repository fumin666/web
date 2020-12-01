<template>
  <div class="importChangePassCtn">
    <s-upload
      :action="actionUrl"
      ref="ChangePassUpload"
      :multiple="false"
      :auto-upload="false"
      accept=".xls"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :file-list="fileList">
      <s-button slot="trigger">浏览</s-button>
      <s-button @click="uploadChangePass">上传</s-button>
    </s-upload>
    <p class="underLine" @click="downLoadTemplate">点击下载“批量改密任务导入模板”</p>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        fileList: [],
        actionUrl: `${$axios.basePath()}/tPasswdChangeTask/importPasswordTask`
      }
    },
    methods: {
      // 上传
      uploadChangePass() {
        this.$refs['ChangePassUpload'].submit()
      },
      // 上传成功钩子
      uploadSuccess(res, file) {
        if (res) {
          this.$emit('importChangePassSuccess')
          this.$message({
            type: 'info',
            message: `成功${res.successNum}个，失败${res.failNum}个`
          });
        }
        if (res.failNum > 0) {
          $axios.log({
            data: [file],
            logTemplate: `导入改密结果|改密任务列表>改密任务(${this.$refs.ChangePassUpload.uploadFiles[0].name})`,
            result: '失败'
          });
        } else {
          if (res.successNum > 0 || res.jobUuid) {
            $axios.log({
              data: [file],
              logTemplate: `导入改密结果|改密任务列表>改密任务(${this.$refs.ChangePassUpload.uploadFiles[0].name})`,
              result: '成功'
            });
          } else {
            $axios.log({
              data: [file],
              logTemplate: `导入改密结果|改密任务列表>改密任务(${this.$refs.ChangePassUpload.uploadFiles[0].name})`,
              result: '失败'
            });
          }
        }
        this.$refs.ChangePassUpload.uploadFiles = []
      },
      // 上传失败钩子
      uploadError() {
        this.$message({
          type: 'error',
          message: '上传失败'
        });
        this.$refs.ChangePassUpload.uploadFiles = []
      },
      // 下载模板
      downLoadTemplate() {
       Download('/tPasswdChangeTask/exportPasswordTaskTemplate')
      }
    }
  }
</script>
