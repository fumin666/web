<template>
  <s-dialog v-model="dialogFlag" title="附件上传" width="600px" class="">
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-row class="uploadBox">
        <s-upload
          ref="upload"
          class="upload"
          :action="actionUrl"
          multiple
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
          :on-error="uploadError"
          :with-credentials="true">
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
        fileList: [],
        file: '',
        dialogFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: ''
    },
    computed: {
      actionUrl() {
        return `${$axios.basePath()}fileUpload/uploadItilattach`
      }
    },
    methods: {
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      uploadSuccess(data) {
        this.fileList.push(data)
        this.$message.success('上传成功')
      },
      uploadError() {
        this.$message.error('上传出错')
      },
      handleRemove(file) {
        console.log(file)
        this.delFile([file.attachuuid]).then(() => {
          this.fileList.forEach((item, index) => {
            if (item.attachuuid === file.attachuuid) {
              this.fileList.splice(index, 1)
            }
          })
        })
      },
      // 添加工作信息
      dialogOk() {
        if (this.fileList.length > 0) {
          this.$confirm('确定添加?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let uuid = this.fileList.map((item) => {
              return item.attachuuid
            })
            let params = {
              orderUuid: this.uuid,
              orderType: 1,
              attachments: uuid.join(',')
            }
            this.fileList = []
            this.$refs.upload.clearFiles()
            $axios.get(`/fileUpload/saveAttachmentRelation/${params.orderUuid}/${params.orderType}/${params.attachments}`).then(({data}) => {
              this.dialogFlag = false
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '添加成功！'
                })
                this.$emit('submit')
              } else {
                this.$message({
                  type: 'error',
                  message: '添加失败！'
                })
              }
            })
          }).catch(() => {
          });
        } else {
          this.$message({
            type: 'error',
            message: '请先选择附件！'
          })
        }
      },
      delFile(fileUuidList) {
        return $axios.post('/ItilCommonWorkflow/itilOrderFileDelete', fileUuidList).then(({data}) => {
          if (data.state === true) {
            return data
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
