<template>
  <section id="createKnow">
    <s-scrollbar wrap-class="scrollMaxheight">
      <s-form :model="knowledgeForm" :rules="rules1" ref="knowledgeForm" label-width="130px">
        <s-form-item label="知识库文章编号" prop="serialCode">
          <s-input v-model="knowledgeForm.serialCode" disabled style="width: 500px"></s-input>
        </s-form-item>
        <s-form-item label="标题" prop="briefDesc">
          <s-input v-model="knowledgeForm.briefDesc" type="textarea" :rows="3" placeholder="请输入标题" style="width: 500px"></s-input>
        </s-form-item>
        <s-form-item label="问题描述" prop="detailDesc">
          <s-input v-model="knowledgeForm.detailDesc" type="textarea" :rows="3" placeholder="请输入问题描述" style="width: 500px"></s-input>
        </s-form-item>
        <s-form-item label="解决方案" prop="solutionContent">
          <!--<s-input v-model="knowledgeForm.solutionText" type="textarea" :rows="3" placeholder="请输入解决方案" style="width: 500px"></s-input>-->
          <!-- bidirectional data binding（双向数据绑定） -->
          <quill-editor v-model="knowledgeForm.solutionContent"
                        ref="myQuillEditor"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
          </quill-editor>
        </s-form-item>
        <s-form-item label="知识库类别" prop="knowledgeType">
          <s-select
            v-model="knowledgeForm.knowledgeType"
            placeholder="请选择"
            style="width: 300px"
            clearable>
            <s-option
              v-for="(item, index) in itilKnowledgeTypeSelect"
              :label="item.name"
              :value="item.value"
              :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识分类一级" prop="categoryFirst">
          <s-cascader
            :options="categoryFirstList"
            :props="cascaderConfig"
            :value="companyCategoryValue"
            expand-trigger="hover"
            @change="changeCompanyAndCategory"
            :show-all-levels="false"
            style="width: 300px"
          >
          </s-cascader>
        </s-form-item>
        <s-form-item label="知识分类二级" prop="categorySecond">
          <s-select
            v-model="knowledgeForm.categorySecond"
            @change="changeCategorySecond"
            placeholder="请选择"
            style="width: 300px">
            <s-option
              v-for="(item, index) in categorySecondList"
              :label="item.categoryName"
              :value="item.uuid"
              :key="'knowledge' + index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识分类三级" prop="categoryThird">
          <s-select
            v-model="knowledgeForm.categoryThird"
            placeholder="请选择"
            style="width: 300px"
            clearable>
            <s-option
              v-for="(item, index) in categoryThirdList"
              :label="item.categoryName"
              :value="item.uuid"
              :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="应用系统名称" prop="appSystemName">
          <s-input v-model="knowledgeForm.appSystemName" placeholder="请输入编号、标题或者关键字进行搜索" style="width: 500px"></s-input>
        </s-form-item>
        <s-form-item label="关键字" prop="keyword">
          <s-input v-model="knowledgeForm.keyword" placeholder="请输入编号、标题或者关键字进行搜索" style="width: 500px"></s-input>
        </s-form-item>
        <s-form-item label="知识库管理员组:" prop="adminGroup">
          <s-select v-model="knowledgeForm.adminGroup" @change="getAdminUser" style="width: 300px" clearable>
            <s-option v-for="item in adminGroupSelect" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识库管理员" prop="adminUser">
          <s-select v-model="knowledgeForm.adminUser" style="width: 300px" clearable>
            <s-option v-for="item in adminUserSelect" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识所属组:" prop="knowledgeGroup">
          <s-select v-model="knowledgeForm.knowledgeGroup" @change="getKnowledgeUser" style="width: 300px">
            <s-option v-for="item in knowledgeGroupSelect" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="知识拥有者" prop="knowledgeUser">
          <s-select v-model="knowledgeForm.knowledgeUser" style="width: 300px">
            <s-option v-for="item in knowledgeUserSelect" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="IT内部运维使用" prop="isItOperation">
          <s-switch v-model="knowledgeForm.isItOperation" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
        <s-form-item label="附件信息">
          <s-upload class="upload"
                    ref="upload"
                    :action="workInfoUrl"
                    multiple
                    :on-success="uploadSuccess"
                    :on-remove="uploadRemove"
                    :file-list="fileListUpload"
                    :with-credentials="true">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
 import $axios from 'sunflower-ajax';
 import { quillEditor } from 'vue-quill-editor'
 import 'quill/dist/quill.core.css'
 import 'quill/dist/quill.snow.css'
 import 'quill/dist/quill.bubble.css'
  export default {
    components: {
      quillEditor
    },
    data () {
      return {
        editorOption: {
          // some quill options
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
//               [{ 'header': 1 }, { 'header': 2 }],
//              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
//              [{ 'indent': '-1' }, { 'indent': '+1' }],
//              [{ 'direction': 'rtl' }],
//              [{ 'size': ['small', false, 'large', 'huge'] }],
//             [{ 'font': [] }],
//              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
//             ['clean'],
//              ['link', 'image', 'video']
              ['image'],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }]
            ]
          }
        },
        knowledgeForm: {
          serialCode: '',
          knowledgeType: '',
          detailDesc: '',
          solutionText: '',
          solutionContent: '',
          companyUuid: '',
          keyword: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          adminGroup: '',
          adminUser: '',
          knowledgeGroup: '',
          knowledgeUser: '',
          appSystemName: '',
          briefDesc: '',
          isItOperation: 0,
          attachuuid: ''
        },
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: [],
        categoryFirstList: [],    // 一级列表
        categorySecondList: [],   // 二级列表
        categoryThirdList: [],    // 三级列表
        adminUserSelect: [],
        adminGroupSelect: [],
        knowledgeGroupSelect: [],
        knowledgeUserSelect: [],
        itilKnowledgeTypeSelect: {},
        rules1: {
          serialCode: [
            {required: true, message: '', trigger: 'blur'}
          ],
          briefDesc: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1-100的字符', trigger: 'blur'}
          ],
          detailDesc: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 500, message: '长度为1-500的字符', trigger: 'blur'}
          ],
          solutionContent: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          knowledgeType: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          categoryFirst: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          categorySecond: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          companyUuid: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          keyword: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1-100的字符', trigger: 'blur'}
          ],
          appSystemName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1-100的字符', trigger: 'blur'}
          ],
          knowledgeGroup: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          knowledgeUser: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        workInfoUrl: `${$axios.basePath()}/fileUpload/uploadItilattach`, // 附件列表上传地址
        fileList: [],
        fileListUpload: []
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      onEditorBlur(quill) {
        // console.log('editor blur!', this.knowledgeForm.solutionContent)
        let reg = /<.+?>/ig;
        this.knowledgeForm.solutionText = this.knowledgeForm.solutionContent.replace(reg, '')  // 纯文本
      },
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.knowledgeForm.companyUuid = val[0];
          this.knowledgeForm.categoryFirst = val[1];
          let param = {
            ownerType: 4,
            companyUuid: this.knowledgeForm.companyUuid,
            categoryFirst: this.knowledgeForm.categoryFirst
          }
          this.knowledgeForm.categorySecond = '';
          this.knowledgeForm.categoryThird = '';
          this.categorySecondList = [];
          this.categoryThirdList = [];
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            if (res.status === 200) {
              this.categorySecondList = res.data;
            }
          })
        }
      },
      getCategoryFirst(val) {
        if (val !== '') {
          let obj = {
            ownerType: 4,
            companyUuid: this.knowledgeForm.companyUuid,
            categoryFirst: val
          }
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
            if (res.data && res.data.length > 0) {
              this.categorySecondList = res.data;
              this.knowledgeForm.categorySecond = this.categorySecondList[0].uuid;
              this.axiosCategoryThird(this.knowledgeForm.categorySecond);
            }
          })
        }
      },
      changeCategorySecond(val) {
        if (val !== '') {
          let obj = {
            ownerType: 4,
            companyUuid: this.knowledgeForm.companyUuid,
            categoryFirst: this.knowledgeForm.categoryFirst,
            categorySecond: val
          }
          this.knowledgeForm.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
            this.categoryThirdList = res.data
          })
        }
      },
      axiosCategoryThird(val) {
        if (val !== '') {
          let obj = {
            ownerType: 4,
            companyUuid: this.knowledgeForm.companyUuid,
            categoryFirst: this.knowledgeForm.categoryFirst,
            categorySecond: val
          }
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
            this.categoryThirdList = res.data
          })
        }
      },
      getAdminGroup(val) {
        $axios.get('/itilKnowledgeOrder/getAllKnowledgeAdminGroup/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.adminGroupSelect = res.data;
            // this.knowledgeForm.adminGroup = this.adminGroupSelect[0].uuid;
            // this.getAdminUser(this.knowledgeForm.adminGroup);
          }
        })
      },
      getAdminUser(val) {
        $axios.get('/itilKnowledgeOrder/getAllKnowledgeaAdminUserByGroup/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.adminUserSelect = res.data;
            // this.knowledgeForm.adminUser = this.adminUserSelect[0].uuid;
          }
        })
      },
      getKnowledgeGroup(val) {
        $axios.get('/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.knowledgeGroupSelect = res.data;
            this.knowledgeForm.knowledgeGroup = this.knowledgeGroupSelect[0].uuid;
            this.getKnowledgeUser(this.knowledgeForm.knowledgeGroup);
          }
        })
      },
      getKnowledgeUser(val) {
        $axios.get('/itilWorkflowConfig/getIamUserInfoListByGroupUuid/' + val).then(res => {
          if (res.data && res.data.length > 0) {
            this.knowledgeUserSelect = res.data;
            this.knowledgeForm.knowledgeUser = this.knowledgeUserSelect[0].uuid;
          }
        })
      },
      // 工单信息以及下拉框
      getData() {
        $axios.get('/itilKnowledgeOrder/getKnowledgeOrderSelectDate').then(res => {
          this.knowledgeForm.serialCode = res.data.serialCode;
          this.itilKnowledgeTypeSelect = res.data.itilKnowledgeTypeSelect; // 知识工单类型
          this.knowledgeForm.knowledgeType = this.itilKnowledgeTypeSelect[0].value
        })
      },
      // 附件信息文件上传成功回调
      uploadSuccess(res, file, fileList) {
        this.fileList.push(res)
        let arr = this.fileList.map((item) => {
          return item.attachuuid
        })
        this.knowledgeForm.attachuuid = arr.join(',')
      },
      // 移除上传对列
      uploadRemove(file, fileList) {
        this.fileList.forEach((itemFile, indexFile) => {
          if (itemFile.attachuuid === file.response.attachuuid) {
            this.fileList.splice(indexFile, 1)
          }
        })
        this.deleteFile([file.response.attachuuid])
      },
      // 删除附件接口
      deleteFile(deleteUuid) {
        $axios.post(`/ItilCommonWorkflow/itilOrderFileDelete/`, deleteUuid).then(({data}) => {
          if (data.state === true) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，请重试！'
            })
          }
        })
      },
      // 附件信息文件上传失败回调
      uploadError() {}
    },
    created() {
      let vm = this
      vm.getData()
      $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 4).then(res => {
        if (res.data && res.data.length > 0) {
          vm.categoryFirstList = res.data;
          // vm.knowledgeForm.categoryFirst = []
          vm.companyCategoryValue[0] = vm.categoryFirstList[0].uuid
          vm.companyCategoryValue[1] = vm.categoryFirstList[0].childrenList[0].uuid
          vm.knowledgeForm.categoryFirst = vm.categoryFirstList[0].childrenList[0].uuid;
          vm.knowledgeForm.companyUuid = vm.categoryFirstList[0].uuid;
          vm.getCategoryFirst(vm.knowledgeForm.categoryFirst);
          vm.getAdminGroup(vm.knowledgeForm.companyUuid);
          vm.getKnowledgeGroup(vm.knowledgeForm.companyUuid);
        }
      })
    }
  }
</script>

<style>
</style>
