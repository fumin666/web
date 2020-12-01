<template>
  <section class="createScript">
    <s-scrollbar wrap-class="scroll-height-500px">
      <s-form :model="scriptForm" :rules="rules1" ref="scriptForm" label-width="100px">
        <s-form-item label="脚本名称" prop="scriptName" tip="长度为2-30字符">
          <s-input v-model="scriptForm.scriptName"></s-input>
        </s-form-item>
        <s-form-item label="备注" prop="description" tip="长度为0-256字符">
          <s-input v-model="scriptForm.description" type="textarea" :rows="3"></s-input>
        </s-form-item>
        <s-form-item label="脚本内容" prop="content" tip="不限字数">
          <s-input v-model="scriptForm.content" type="textarea" :rows="7"></s-input>
        </s-form-item>
        <s-form-item label="">
          <s-upload class="upload"
                    ref="upload"
                    :action="uploadUrl"
                    multiple
                    :on-success="uploadSuccess"
                    :on-remove="uploadRemove"
                    :before-upload="beforeUpload"
                    :file-list="fileListUpload"
                    :with-credentials="true"
                    :multiple="false">
            <s-button slot="trigger" icon="export">上传脚本文件</s-button>
          </s-upload>
        </s-form-item>
        <s-form-item label="脚本类型" prop="scriptFileSuffix">
          <s-select v-model="scriptForm.scriptFileSuffix">
            <s-option value=".sh" label=".sh" key=".sh"></s-option>
            <s-option value=".ps1" label=".ps1" key=".1"></s-option>
            <s-option value=".py" label=".py" key=".py"></s-option>
            <s-option value=".sql" label=".sql" key=".sql"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      var validatorName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('名称不能为空！'))
        }
        // 如果是编辑页面，并且命令集未改变则不判断是否重复
        if (this.current) {
          if (value !== this.exist_name) {
            $axios.get('/scriptConsole/scriptNameValidate/' + value).then((res) => {
              if (res.data.state) {
                callback(new Error('名称已存在！'));
              }
            });
          }
        } else {
          $axios.get('/scriptConsole/scriptNameValidate/' + value).then((res) => {
            if (res.data.state) {
              callback(new Error('名称已存在！'));
            }
          });
        }
        setTimeout(() => {
//      长度为2-256
          if (value.length < 2 || value.length > 30) {
            callback(new Error('长度为2-30字符！'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        scriptForm: {
          scriptName: '',
          description: '',
          content: '',
          scriptFileSuffix: '',
          scriptLibUuid: this.uuid
        },
        rules1: {
          scriptName: [
            {required: true, validator: validatorName, trigger: 'blur'}
          ],
          script: [
            { min: 0, max: 256, message: '长度不能大于 256 个字符！', trigger: 'blur' }
          ],
          content: [
            {required: true, message: '内容不能为空！', trigger: 'blur'}
          ],
          scriptFileSuffix: [
            {required: true, message: '不能为空！', trigger: 'blur'}
          ]
        },
        exist_name: '',
        fileListUpload: []
      };
    },
    computed: {
      uploadUrl() {
        return `${$axios.basePath()}/scriptConsole/uploadAndAnalScriptFile`
      }
    },
    props: {
      current: Object,
      uuid: String
    },
    mounted() {
      if (this.current) {
        this.scriptForm = this.current;
        this.exist_name = this.scriptForm.scriptName;
      }
    },
    methods: {
      uploadSuccess(res, file, fileList) {
        this.scriptForm.content = res.fileContent
        this.scriptForm.scriptFileSuffix = `.${res.fileName.split('.')[1]}`
        this.fileListUpload = fileList
      },
      beforeUpload(file) {
        if (this.fileListUpload.length === 1) {
          this.$message({showClose: true, message: '只能上传一个文件', type: 'error'});
          return false;
        }
      },
      uploadRemove(file, fileList) {
        this.fileListUpload = fileList;
        this.scriptForm.content = ''
        this.scriptForm.scriptFileSuffix = ''
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      }
    }
  }
</script>
<style>
  .createScript .scroll-height-500px {
    max-height: 500px
  }
</style>
