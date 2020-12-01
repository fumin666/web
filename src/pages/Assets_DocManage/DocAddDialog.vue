<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑文档' : '添加文档'" width="600px" class="docAddDialog">
    <s-tab :animated="false">
      <s-tab-pane label="文档明细">
        <s-scrollbar wrap-class="docAddScrollbar">
          <s-form :model="docForm" :rules="docRule" ref="docForm" label-width="120px">
            <s-form-item label="文档名称" prop="docName">
              <s-input v-model="docForm.docName"></s-input>
            </s-form-item>
            <s-form-item label="创建者" prop="createrUuid">
              <select-dialog
                v-model="docForm.createrUuid"
                :options="getActiveUser(selectOptionsObj.sysUserList)"
                :config="userCol"
                valueProp="uuid"
                title="选择创建者"
              >
                <s-option :label="item.userRealName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.sysUserList" :key="index"></s-option>
              </select-dialog>
            </s-form-item>
            <s-form-item label="创建时间" prop="createTime">
              <s-date-picker v-model="docForm.createTime" type="datetime" placeholder="请选择日期时间"
                             :picker-options="createTimeOption">
              </s-date-picker>
            </s-form-item>
            <s-form-item label="关键字" prop="keywords" tip="多个关键字以英文逗号隔开">
              <s-input v-model="docForm.keywords"></s-input>
            </s-form-item>
            <s-form-item label="组织机构" prop="departmentUuid">
              <select-dialog
                v-model="docForm.departmentUuid"
                :options="selectOptionsObj.cmdbOrgList"
                :config="orgCol"
                valueProp="uuid"
                title="选择组织机构"
              >
                <s-option :label="item.departName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.cmdbOrgList" :key="index"></s-option>
              </select-dialog>
            </s-form-item>
            <s-form-item label="维护人" prop="maintenceUuid">
              <select-dialog
                v-model="docForm.maintenceUuid"
                :options="getDepartUser(selectOptionsObj.sysUserList)"
                :config="userCol"
                valueProp="uuid"
                title="选择维护人"
              >
                <s-option :label="item.userRealName" :value="item.uuid" v-for="(item,index) in selectOptionsObj.sysUserList" :key="index"></s-option>
              </select-dialog>
            </s-form-item>
            <s-form-item label="复查状态">
              <s-select v-model="docForm.checkstatus">
                <s-option label="通过" :value="1"></s-option>
                <s-option label="不通过" :value="0"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="文档类型">
              <s-select v-model="docForm.docType">
                <s-option label="文本文件" :value="1"></s-option>
                <s-option label="声音文件" :value="2"></s-option>
                <s-option label="视频文件" :value="3"></s-option>
                <s-option label="动画文件" :value="4"></s-option>
                <s-option label="演示文件" :value="5"></s-option>
                <s-option label="网页文件" :value="6"></s-option>
                <s-option label="电子表格文件" :value="7"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="文档状态">
              <s-select v-model="docForm.docStatus">
                <s-option label="可读" :value="1"></s-option>
                <s-option label="可写" :value="2"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="发布时间" prop="releaseTime">
              <s-date-picker v-model="docForm.releaseTime" type="datetime" placeholder="请选择日期时间"
                             :picker-options="releaseTimeOption">
              </s-date-picker>
            </s-form-item>
            <s-form-item label="用途" prop="use">
              <s-input v-model="docForm.use"></s-input>
            </s-form-item>
            <s-form-item label="描述" prop="docDesc">
              <s-input v-model="docForm.docDesc" type="textarea" :rows="3"></s-input>
            </s-form-item>
          </s-form>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="上传附件">
        <s-alert title="单个文档大小<=100M" type="info" :closable="false"></s-alert>
        <s-upload class="docUpload"
          :action="baseUrl + '/documentmanager/document/uploadDocattach'"
          ref="upload"
          multiple
          :before-upload="beforeUpload"
          :on-progress="uploadProgress"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :with-credentials="true"
          :show-file-list="false">
          <s-button slot="trigger">浏览</s-button>
          <s-button @click="fileDel">删除</s-button>
        </s-upload>
        <s-table-page :data="docFiles" :max-height="330"  @selection-change="selectionChange">
          <s-table-column type="selection"></s-table-column>
          <s-table-column label="附件名称" prop="fileName" show-overflow-tooltip></s-table-column>
          <s-table-column label="大小(Byte)" prop="fileSize"></s-table-column>
        </s-table-page>
      </s-tab-pane>
      <div class="s-loading-mask loadingClass" v-if="showLoading">
        <div class="s-loading-spinner">
          <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
          <p class="s-loading-text">正在上传{{uploadProcess.fileName}}...</p>
          <p class="s-loading-text">{{uploadProcess.percent}}%</p>
        </div>
      </div>
    </s-tab>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import SelectDialog from '@/components/selectDialog'

  export default {
    data() {
      let checkCreateTime = (rule, value, callback) => {
        if (parseInt(new Date(value).getTime() / 1000) > 2147483647) {
          callback(new Error('所选时间超出范围，请重新选择'))
        } else if (parseInt(new Date(value).getTime() / 1000) < -2147483648) {
          callback(new Error('所选时间超出范围，请重新选择'))
        } else {
          callback()
        }
      }
      return {
        baseUrl: '',
        data: [],
        dialogFlag: false,
        authOptions: [],
        docForm: {
          docName: '',
          createrUuid: '',
          createTime: '',
          keywords: '',
          departmentUuid: '',
          maintenceUuid: '',
          checkstatus: 1,
          docType: 1,
          docStatus: 1,
          releaseTime: '',
          use: '',
          docDesc: ''
        },
        docRule: {
          docName: [
            Validaters.NotNull,
            Validaters.Max(30)
          ],
          createrUuid: [{ required: true, message: '不能为空', trigger: 'change' }],
          createTime: [Validaters.NotNull, {validator: checkCreateTime, trigger: 'change'}],
          keywords: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          departmentUuid: [{ required: true, message: '不能为空', trigger: 'change' }],
          maintenceUuid: [{ required: true, message: '不能为空', trigger: 'change' }],
          releaseTime: [Validaters.NotNull, {validator: checkCreateTime, trigger: 'change'}],
          use: [Validaters.Max(50)],
          docDesc: [Validaters.Max(100)]
        },
        docFiles: [],
        showLoading: false,
        uploadProcess: {
          fileName: '',
          percent: 0
        },
        selections: [],
        selectOptionsObj: {
          sysUserList: [], // 创建者、维护人
          cmdbOrgList: [] // 组织机构
        },
        userCol: [
          {name: '账号名称', value: 'userLoginName'},
          {name: '真实姓名', value: 'userRealName'},
          {name: '所属机构', value: 'departName'},
          {name: '角色', value: 'roleName'},
          {name: '状态', value: 'statusName'}
        ],
        orgCol: [
          {name: '机构名称', value: 'departName'},
          {name: '机构编号', value: 'departCode'},
          {name: '上级机构', value: 'departParentName'},
          {name: '机构负责人', value: 'departLeaderName'}
        ],
        createTimeOption: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curDoc: {
        type: Object
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.curDoc).length > 0;
      },
      releaseTimeOption() {
        let _this = this;
        return {
          disabledDate(time) {
            return time.getTime() < new Date(_this.docForm.createTime).getTime();
          }
        }
      }
    },
    created() {
      this.baseUrl = $axios.basePath();
      $axios.post('/resourcemanager/assetmanager/itasset/findAddSelect').then(({data}) => {
        this.selectOptionsObj = data;
        this.returnSysUserList(data.sysUserList);
        // this.selectOptionsObj.sysUserList = arr;
      });
      if (this.isEdit) {
        for (let i in this.docForm) {
          this.docForm[i] = this.curDoc[i];
        }
        this.docForm.checkstatus = this.docForm.checkstatus === '通过' ? 1 : 0;
        switch (this.docForm.docType) {
          case '声音文件': this.docForm.docType = 2; break;
          case '视频文件': this.docForm.docType = 3; break;
          case '动画文件': this.docForm.docType = 4; break;
          case '演示文件': this.docForm.docType = 5; break;
          case '网页文件': this.docForm.docType = 6; break;
          case '电子表格文件': this.docForm.docType = 7; break;
          default: this.docForm.docType = 1; break;
        }
        this.docForm.docStatus = this.docForm.docStatus === '可读' ? 1 : 2;
        this.docFiles = this.curDoc.documentAttachmentList.map((item, index) => {
          return {
            uuid: item.uuid,
            fileName: item.attacthmentName,
            fileSize: item.attacthmentSize,
            absolutePath: item.absolutePath,
            index: index
          }
        });
      }
    },
    methods: {
      returnSysUserList(list) {
        list.map((item, index) => {
          if (index > 0) {
            if (list[index].userLoginName === list[index - 1].userLoginName) {
              list[index - 1].roleName += `、${list[index].roleName}`;
              list.splice(index, 1);
              return this.returnSysUserList(list)
            }
          }
        })
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      beforeUpload(file) {
        if (file.size > 100 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过100M!'});
          return false;
        }
        if (this.docFiles.find(item => item.fileName === file.name && (item.fileSize - 0) === file.size)) {
          this.$message({type: 'error', message: '此文件您已经上传过，不可重复上传！'});
          return false;
        }
      },
      uploadProgress(event, file, fileList) {
        this.showLoading = true;
        this.uploadProcess.fileName = file.name;
        this.uploadProcess.percent = Number.parseInt(event.percent);
      },
      uploadSuccess(res) {
        this.showLoading = false;
        this.uploadProcess.percent = 0;
        if (res.state === 'true') {
          res.index = this.docFiles.length;
          this.docFiles.push(res);
        } else {
          this.$message({type: 'error', message: res.errormsg});
        }
      },
      uploadError (err, file) {
        this.showLoading = false;
        this.uploadProcess.percent = 0;
        this.$message({type: 'error', message: file.name + '上传失败'});
        throw err;
      },
      fileDel() {
        if (this.selections.length === 0) {
          this.$message({type: 'error', message: '请选择附件'});
        } else {
          this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            this.selections.forEach(item => {
              let index = this.docFiles.findIndex(docFile => item.index === docFile.index);
              this.docFiles.splice(index, 1);
            });
          }).catch(() => {});
        }
      },
      getActiveUser(userArr) {
        return userArr.filter(item => {
          return item.userStatus === 1
        });
      },
      getDepartUser(userArr) {
        if (!this.docForm.departmentUuid) return userArr;
        return userArr.filter(item => {
          return item.departUuid === this.docForm.departmentUuid;
        });
      },
      dialogOk() {
        this.$refs.docForm.validate(valid => {
          if (!valid) {
            this.$message({type: 'warning', message: '请检查您的表单填写！'})
            return;
          }
          if (this.docFiles.length <= 0) {
            this.$message({type: 'warning', message: '请至少上传一个附件！'})
            return;
          }
          let param = Object.assign({}, this.docForm);
          param.documentAttachmentList = this.docFiles.map(item => {
            let obj = {
              attacthmentName: item.fileName,
              attacthmentSize: item.fileSize,
              absolutePath: item.absolutePath
            };
            item.uuid && (obj.uuid = item.uuid);
            return obj;
          });
          param.createTime = parseInt(new Date(param.createTime).getTime() / 1000);
          param.releaseTime = parseInt(new Date(param.releaseTime).getTime() / 1000);
          let urlTail = 'saveDocumentInfo';
          if (this.isEdit) {
            urlTail = 'updateDocumentInfo';
            param.uuid = this.curDoc.uuid;
          }
          let obj = {
            data: [],
            logTemplate: this.isEdit ? `编辑|文档管理(${this.docForm.docName})` : `添加|文档管理(${this.docForm.docName})`
          }
          $axios.post(`/documentmanager/document/${urlTail}`, param, obj).then(({data}) => {
            if (data) {
              this.$message({showClose: true, message: '保存成功', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败', type: 'error'});
            }
          });
        });
      }
    },
    watch: {
      'docForm.departmentUuid': {
        handler(val) { // 维护人必须是对应组织机构下的维护人
          if (this.isEdit && this.curDoc.departmentUuid === val) return;
          this.docForm.maintenceUuid = '';
        }
      },
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
    components: {
      SelectDialog
    }
  }
</script>
