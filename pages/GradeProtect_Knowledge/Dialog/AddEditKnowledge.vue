<!--
 * @Author: mybells
 * @Version://Q1知识库
 * @Description:等保知识库->添加编辑src\home\ProcessCenter\ProcessCreatOrder\KnowDialog.vue
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="addEditDialog" :title="title" width="650px" :before-close="cancel" append-to-body>
    <s-scrollbar wrap-style="max-height:500px;padding-right:10px;">
      <s-form :model="form" :rules="rules" ref="form" label-width="80px">
        <s-form-item label="知识编号" prop="code">
          <s-input v-model="form.code" disabled></s-input>
        </s-form-item>
        <s-form-item label="标题" prop="title">
          <s-input v-model="form.title"></s-input>
        </s-form-item>
        <s-form-item label="关键字" prop="keyword">
          <s-input v-model="form.keyword"></s-input>
        </s-form-item>
        <s-form-item label="问题描述" prop="content">
          <s-input v-model="form.content" type="textarea"></s-input>
        </s-form-item>
        <s-form-item label="解决方案" prop="solution">
          <s-input v-model="form.solution" type="textarea"></s-input>
        </s-form-item>
        <s-form-item label="知识分类" prop="safeTypeUuid">
          <s-select
            v-model="form.safeTypeUuid"
            placeholder="请选择"
            style="width: 300px"
            clearable>
            <s-option
              v-for="(item) in knowledgeTypeSelect"
              :label="item.bulletinName"
              :value="item.uuid"
              :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识类别" prop="classify">
          <s-select
            v-model="form.classify"
            placeholder="请选择"
            style="width: 300px"
            clearable>
            <s-option
              v-for="(item) in knowledgeClassSelect"
              :label="item.name"
              :value="item.value"
              :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload class="upload"
                    ref="upload"
                    :action="workInfoUrl"
                    multiple
                    :limit=10
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-remove="uploadRemove"
                    :on-error="uploadError"
                    :on-exceed="uploadLimit"
                    :file-list="fileLists"
                    :with-credentials="true">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save">确 定</s-button>
      <s-button type="cancel" @click="cancel">取 消</s-button>
    </template>
  </s-dialog>

</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils'
  export default {
    props: {
      addEditDialog: Boolean,
      isAdd: Boolean,
      rowUuid: String
    },
    data() {
      return {
        form: {
          code: null,
          title: null,
          keyword: null,
          content: null,
          solution: null,
          safeTypeUuid: null,
          files: [],
          classify: null
        },
        fileLists: [],
        knowledgeTypeSelect: [],
        knowledgeClassSelect: [{name: '问题解决方案', value: 1}, {name: '操作指引', value: 2}],
        workInfoUrl: `${$axios.basePath()}/safetyPlatform/fileUpload/uploadKnowledgeAttachment`, // 附件列表上传地址
        rules: {
          title: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 50, message: '长度为1-50的字符', trigger: 'blur'}
          ],
          keyword: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 50, message: '长度为1-50的字符', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 500, message: '长度为1-500的字符', trigger: 'blur'}
          ],
          solution: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 500, message: '长度为1-500的字符', trigger: 'blur'}
          ],
          safeTypeUuid: [Validaters.SelectValNotNull],
          classify: [Validaters.SelectValNotNull]
        }
      }
    },
    computed: {
      title() {
        return this.isAdd ? '添加知识' : '编辑知识';
      }
    },
    created() {
      if (this.isAdd) {
        this.getNum();
      } else {
        this.getData();
      }
      this.getKnowledgeTypeList();// 获取分类
    },
    methods: {
      // 获取编号
      getNum() {
        $axios.get('/safetyPlatform/knowledge/getKnowledgeCode').then(res => {
          this.form.code = res.data;
        })
      },
      // 获取编辑数据
      getData() {
        $axios.get(`/safetyPlatform/knowledge/viewKnowledgeDetail/${this.rowUuid}`).then(res => {
          this.form = res.data;
          res.data.files.map(item => {
            item.url = item.filePath;
            item.name = item.fileName;
            item.response = {uuid: item.uuid};
          })
          this.form.files = res.data.files || []
          this.fileLists = res.data.files || []
        })
      },
      // 获取知识分类下拉框列表
      getKnowledgeTypeList() {
        $axios.get('safetyPlatform/safetyBulletin/getAll').then(res => {
          if (res.data.length > 0) {
            this.knowledgeTypeSelect = res.data.filter(item => {
              return (item.bulletinName === '等保工作-最佳实践') || (item.bulletinName === '等保工作-简化版');
            })
          }
        })
      },
      beforeUpload(file) {
        if (file.size > 100 * 1024 * 1024) {
          this.$message({type: 'warning', message: '单个文件大小不能超过100M！'});
          return false;
        }
      },
      // 附件信息文件上传成功回调
      uploadSuccess(res, file, fileLists) {
        this.fileLists = fileLists;
        if (res.state === 'false') {
          this.$message({message: res.errormsg, type: 'warning'});
          let i = this.fileLists.findIndex(item => item.response && item.response.state === 'false');
          this.fileLists.splice(i, 1);
        } else {
          res.url = res.filePath;
          res.name = res.fileName;
          this.form.files.push(res);
        }
      },
      // 移除上传对列
      uploadRemove(file, fileLists) {
        this.form.files.forEach((itemFile, indexFile) => {
          if (itemFile.uuid === file.response.uuid) {
            this.form.files.splice(indexFile, 1)
          }
        })
      },
      // 线上删除附件接口
      // deleteFile(uuid, filePath) {
      //   $axios.post(`/safetyPlatform/fileUpload/deleteKnowledgeAttachment`, {uuid, filePath}).then(({data}) => {
      //     if (data.state === true) {
      //       this.$message({
      //         type: 'success',
      //         message: '删除成功！'
      //       })
      //     } else {
      //       this.$message({
      //         type: 'error',
      //         message: data.errormsg
      //       })
      //     }
      //   })
      // },
      // 附件信息文件上传失败回调
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      uploadLimit(files, fileList) {
        if (files.length > 9 || fileList.length > 9 || (files.length + fileList.length) > 9) {
          this.$message({type: 'warning', message: '上传文件个数不能超过10个！'});
          return false;
        }
      },
      save() {
        if (this.isAdd) {
          let form = Object.assign({onlyGradeProtectShow: 1, createBy: this.$store.getters.userData.uuid}, this.form)
          this.$refs.form.validate(valid => {
            if (!valid) {
              return;
            }
            $axios.post(`/safetyPlatform/knowledge/saveKnowledge`, form, {
              data: [form],
              logTemplate: '添加|知识(#code#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$emit('update:addEditDialog', false)
                this.$emit('reload');
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          })
        } else {
          this.form.createTime = parseInt(new Date(this.form.createTime).getTime() / 1000)
          this.$refs.form.validate(valid => {
            if (!valid) {
              return;
            }
            $axios.post(`/safetyPlatform/knowledge/modifyKnowledge`, this.form, {
              data: [this.form],
              logTemplate: '编辑|知识(#code#)'
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                })
                this.$emit('update:addEditDialog', false)
                this.$emit('reload');
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          })
        }
      },
      cancel() {
        this.$emit('update:addEditDialog', false)
      }
    }
  }
</script>

<style scoped>

</style>
