<template>
    <s-dialog
      title="导入令牌种子"
      v-model="dialogFlag"
      v-if="dialogFlag"
      width="800px"
      append-to-body>
        <div class="importContainer">
          <s-form>
            <s-form-item>
              <s-upload
                :action="actionUrl"
                ref="upload"
                :multiple="false"
                :limit="1"
                :auto-upload="false"
                :on-exceed="onExceed"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :file-list="fileList"
                accept=".txt">
                <s-button slot="trigger">选择种子文件</s-button>
                <div slot="tip" class="s-upload__tip">只能上传.txt</div>
              </s-upload>
            </s-form-item>
            <s-form-item label='秘钥：'>
              <s-input style="width:250px" type='password' v-model="password"></s-input>
            </s-form-item>
          </s-form>
          <!--<p class="underLine" @click="downLoadTemplate">点击此处下载"批量导入用户模板"</p>-->
        </div>
        <template slot="footer" class="dialog-footer">
          <s-button @click="upload">上传</s-button>
          <s-button type="cancel" @click="dialogFlag = false">取消</s-button>
        </template>
    </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  // import {Download} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        fileList: [],
        dialogFlag: false,
        password: '',
        actionUrl: `${$axios.basePath()}systemmanager/sysInteriorTokenList/uploadSeedFile`
      }
    },
    props: {
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
      },
      password(val) {
        this.actionUrl = `${$axios.basePath()}systemmanager/sysInteriorTokenList/uploadSeedFile/${val}`
        // this.$nextTick(() => {
        //   this.$refs['upload'].submit()
        // })
      }
    },
    methods: {
      // 上传前钩子
      onExceed(file, fileList) {
        this.$message.warning('每次只可上传一个令牌种子文件！');
      },
      // 上传
      upload() {
        console.log(this.password)
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择文件后再上传！'
          })
          return
        }
        this.$refs['upload'].submit()
      },
      // 上传成功钩子
      uploadSuccess(res, file) {
        if (res === 'success') {
          this.$message({
            type: 'success',
            message: '导入成功！'
          })
          $axios.log({
            data: [file],
            logTemplate: '导入|登录认证配置>动态口令牌>令牌种子',
            result: '成功'
          });
          this.dialogFlag = false
          Bus.$emit('importDynTokenSuccess')
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
      // 下载模板
      /* downLoadTemplate() {
        Download('')
      } */
    }
  }
</script>
