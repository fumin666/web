<template>
  <s-scrollbar wrap-style="max-height:450px;">
    <s-form :model="form" :rules="rules" ref="createTaskForm" label-width="120px">
      <s-form-item label="任务ID" prop="name">
        <s-input v-model="form.serialCode" disabled></s-input>
      </s-form-item>
      <s-form-item label="任务标题" prop="title">
        <s-input v-model="form.title" type="textarea" :rows="3"></s-input>
      </s-form-item>
      <s-form-item label="任务描述" prop="detailDesc">
        <s-input v-model="form.detailDesc" type="textarea" :rows="3"></s-input>
      </s-form-item>
      <s-form-item label="分类一级" prop="categoryFirst">
        <s-cascader
          :options="companyAndCategoryList"
          :props="cascaderConfig"
          :value="companyCategoryValue"
          expand-trigger="hover"
          @change="changeCompanyAndCategory"
          :show-all-levels= "false"
          style="width: 100%;"
        >
        </s-cascader>
        <!--<s-select v-model="form.categoryFirst" style="width: 100%">-->
          <!--<s-option v-for="item in categoryFirstList" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>-->
        <!--</s-select>-->
      </s-form-item>
      <s-form-item label="分类二级" prop="categorySecond">
        <s-select v-model="form.categorySecond" style="width: 100%">
          <s-option v-for="item in categorySecondList" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="分类三级" prop="">
        <s-select v-model="form.categoryThird" clearable style="width: 100%">
          <s-option v-for="item in categoryThirdList" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="任务来源" prop="taskSource">
        <s-select v-model="form.taskSource" style="width: 100%">
          <s-option v-for="(value, key, index) in taskOrigin.taskSourceMap" :label="value" :value="key"  :key="index"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="紧急程度" prop="criticality">
        <s-select v-model="form.criticality" style="width: 100%">
          <s-option v-for="(value, key, index) in taskOrigin.taskCriticalityMap" :label="value" :value="key"  :key="index"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="紧急程度说明" prop="criticalityDesc">
        <s-input v-model="form.criticalityDesc" type="textarea" :rows="3"></s-input>
      </s-form-item>
      <s-form-item label="受派组" prop="assignGroup">
        <s-select v-model="form.assignGroup" clearable style="width: 100%">
          <s-option v-for="item in assignGroupList" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="受派者" prop="assignUser">
        <s-select v-model="form.assignUser" clearable @focus="assignUser()" style="width: 100%">
          <s-option v-for="item in assignUserList" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="附件信息">
        <s-upload
          class="upload"
          :action="uploadUrl"
          multiple
          :on-success="uploadSuccess"
          :on-change="onChangeHandler"
          :on-remove="uploadRemove"
          :on-error="uploadError"
          :file-list="fileList">
          <s-button slot="trigger">上传</s-button>
        </s-upload>
      </s-form-item>
    </s-form>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import detailMixin from '../ModifyDetailMixin';

  export default {
    name: 'CreateTask',
    mixins: [detailMixin],
    data () {
      return {
        form: {
          serialCode: '',
          title: '',
          detailDesc: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          taskSource: '',
          criticality: '',
          criticalityDesc: '',
          assignGroup: '',
          assignUser: '',
          attachuuid: '',
          companyUuid: ''
        },
        rules: {
          title: [{
            required: true, message: '不能为空', trigger: 'blur'
          }, {
            max: 15, message: '最大长度15个字符', trigger: 'blur'
          }],
          categoryFirst: [{required: true, message: '不能为空', trigger: 'blur'}],
          categorySecond: [{required: true, message: '不能为空', trigger: 'blur'}],
          taskSource: [{required: true, message: '不能为空', trigger: 'blur'}],
          criticality: [{required: true, message: '不能为空', trigger: 'blur'}],
          assignGroup: [{required: true, message: '不能为空', trigger: 'blur'}],
          assignUser: [{required: true, message: '不能为空', trigger: 'blur'}],
          detailDesc: [{max: 300, message: '最大长度300个字符', trigger: 'blur'}],
          criticalityDesc: [{max: 100, message: '最大长度100个字符', trigger: 'blur'}]
        },
        fileList: [],            // 上传文件列表
        categoryFirstList: [],   // 一级列表
        categorySecondList: [],  // 二级列表
        categoryThirdList: [],    // 三级列表
        taskOrigin: {},           // 任务来源与紧急程度
        assignGroupList: [],      // 受派组
        assignUserList: [],        // 受派者
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: []
      }
    },
    components: {
    },
    computed: {
      uploadUrl() {
        return `${$axios.basePath()}/fileUpload/uploadItilattach`
      }
    },
    methods: {
      uploadSuccess(res, file, fileList) {
        this.form.attachuuid = res.attachuuid
      },
      uploadError() {},
      onChangeHandler() {},
      uploadRemove() {},
      // 紧急程度与任务来源
      getOrigin() {
        $axios.get('/itilChangeOrder/getChangeTaskSelectData').then((res) => {
          if (res.data) {
            this.taskOrigin = res.data
            this.form.serialCode = res.data.serialCode
            // 设置默认值
            this.form.criticality = '1'
            this.form.taskSource = '1'
          }
        })
      },
      // 受派组
      assignGroup() {
        return $axios.get('/itilChangeOrder/getAllChangeTaskAssignGroup/' + this.form.companyUuid).then((res) => {
          if (res.data instanceof Array && res.data.length > 0) {
            this.assignGroupList = res.data
            this.form.assignGroup = this.assignGroupList[0].uuid
          }
        })
      },
      // 受派者
      assignUser() {
        if (this.form.assignGroup && this.assignGroupList.length > 0) {
          $axios.get(`/itilChangeOrder/getAllChangeChangeTaskAssignUserByGroup/${this.form.assignGroup}`).then((res) => {
            if (res.data instanceof Array && res.data.length > 0) {
              this.assignUserList = res.data
              this.form.assignUser = this.assignUserList[0].uuid
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择受派者！'
          });
          this.form.assignUser = ''
          this.assignUserList = []
        }
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.orderForm.companyUuid = val[0];
          this.orderForm.categoryFirst = val[1];
          this.getSecondCategory(3, this.orderForm.companyUuid, this.orderForm.categoryFirst)
        }
      }
    },
    created() {
      $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 3).then(res => {
        this.companyAndCategoryList = res.data;
        this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
        this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
        this.form.companyUuid = this.companyAndCategoryList[0].uuid;
        this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
        this.getOrigin()
//      this.getItilCategory(3).then(() => {
//        this.form.categoryFirst = this.categoryFirstList[0].uuid
//      }) // 一级分类select
        this.assignGroup()
      })
    },
    watch: {
      'form.categoryFirst': {
        deep: true,
        handler(val) {
          this.getSecondCategory(3, this.form.companyUuid, val).then(() => {
            this.categoryThirdList = []
            this.form.categorySecond = this.categorySecondList[0].uuid
            this.form.categoryThird = ''
          })
        }
      },
      'form.categorySecond': {
        deep: true,
        handler(val) {
          this.getThirdCategory(3, this.form.companyUuid, this.form.categoryFirst, val).then(() => {
            this.form.categoryThird = ''
          })
        }
      },
      'form.assignGroup': {
        deep: true,
        handler() {
          this.assignUser()
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
