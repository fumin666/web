<template>
  <s-dialog v-model="dialogFlag" title="附件上传" width="600px" class="">
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-row class="uploadBox">
        <s-upload
          class="upload"
          :action="baseUrl +'/fileUpload/uploadItilattach'"
          multiple
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-remove="uploadRemove"
          :on-error="uploadError"
          :with-credentials="true"
          :file-list="fileList">
            <s-button slot="trigger">选择附件</s-button>
            <span style="margin-left: 10px;">注：单个附件不要超过10M！</span>
        </s-upload>
      </s-row>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  //  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        baseUrl: $axios.basePath(),
        fileList: [],
        file: '',
        dialogFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        this.fileList = fileList;
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      },
      dialogOk() {
        if (this.fileList.length === 0) {
          this.$message({type: 'warning', message: '您还没有选择附件！'});
          return;
        }
        let orderUuid = this.$route.params.orderUuid;
        let attachments = this.fileList.map(item => {
          return item.response.attachuuid;
        }).join(',');
        $axios.get(`/fileUpload/saveAttachmentRelation/${orderUuid}/0/${attachments}`).then(({data}) => {
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
          if (data.state) {
            this.$emit('finish');
            this.dialogFlag = false;
          }
        })
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
  .uploadBox
    line-height: 30px
    width: 400px
    margin: 20px auto 0
</style>
