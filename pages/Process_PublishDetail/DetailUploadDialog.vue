<template>
  <s-dialog v-model="dialogFlag" title="附件上传" width="600px" class="">
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-row class="uploadBox">
        <s-col :span="24">
          <s-upload class="upload"
                    ref="upload"
                    :action="uploadUrl"
                    multiple
                    :on-success="uploadSuccess"
                    :on-remove="uploadRemove"
                    :before-upload="beforeUpload"
                    :file-list="fileListUpload"
                    :with-credentials="true">
            <s-button slot="trigger" icon="export">选择附件</s-button>
            <span :span="16">注：单个附件不超过10M！</span>
          </s-upload>
        </s-col>
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
        fileListUpload: [],
        file: '',
        orderUuid: this.$route.params.uuid,  // 路由跳转时获取工单的uuid
        dialogFlag: false
      }
    },
    computed: {
      uploadUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      uploadSuccess(res) {
        this.fileList.push(res)
      },
      uploadError() {
      },
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      onChangeHandler() {},
      uploadRemove(file) {
        this.fileList.forEach((itemFile, indexFile) => {
          if (itemFile.attachuuid === file.response.attachuuid) {
            this.fileList.splice(indexFile, 1)
          }
        })
        $axios.post(`/ItilCommonWorkflow/itilOrderFileDelete/`, [file.response.attachuuid]).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败！'
            })
          }
        })
      },
      dialogOk() {
        if (this.fileList.length > 0) {
          let uuid = this.fileList.map((item) => {
            return item.attachuuid
          })
          $axios.get(`/fileUpload/saveAttachmentRelation/${this.orderUuid}/2/${uuid.join(',')}`).then(({data}) => {
            if (data.state === true) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.fileList = []  // 添加工作信息的uuid参数
              this.fileListUpload = []  // 上传显示列表绑定的List
              this.$emit('getWorkInfo')
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
            this.dialogFlag = false
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先添加附件！'
          })
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
  .uploadBox
    line-height: 30px
    width: 400px
    margin: 20px auto 0
    .upload
      width: 100%
</style>
