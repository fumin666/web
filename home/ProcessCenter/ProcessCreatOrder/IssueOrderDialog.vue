<template>
  <section>
    <h3 class="orderTitle">创建问题单</h3>
    <s-scrollbar wrap-style="height: 400px;">
      <s-form class="issueOrderDiolog" :model="form" :rules="rules" ref="Form" label-width="100px">
        <s-form-item label="问题编号:" prop="serialCode">
          <span>{{form.serialCode}}</span>
        </s-form-item>
        <s-form-item label="简要描述:" prop="briefDesc">
          <s-input v-model="form.briefDesc" :maxlength="100"></s-input>
        </s-form-item>
        <s-form-item label="详细描述:" prop="detailDesc">
          <s-input type="textarea" v-model="form.detailDesc" :maxlength="300" :rows="3" placeholder="请输入内容"></s-input>
        </s-form-item>
        <s-form-item label="分类一级:" prop="categoryFirst">
          <s-cascader
            :options="companyAndCategoryList"
            :props="cascaderConfig"
            :value="companyCategoryValue"
            expand-trigger="hover"
            @change="changeCompanyAndCategory"
            :show-all-levels= "false"
            style="width: 89.6%;"
          >
          </s-cascader>
        </s-form-item>
        <s-form-item label="分类二级:" prop="categorySecond">
          <s-select v-model="form.categorySecond">
            <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级:" prop="categoryThird">
          <s-select v-model="form.categoryThird" clearable>
            <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题来源:" prop="problemSource">
          <s-select v-model="form.problemSource">
            <s-option v-for="item in problemSourceList" :label="item.name" :value="item.value"  :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="紧急性:" prop="criticality">
          <s-select v-model="form.criticality">
            <s-option v-for="item in criticalityList" :label="item.name" :value="item.value"  :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="影响度:" prop="effect">
          <s-select v-model="form.effect">
            <s-option v-for="item in effectList" :label="item.name" :value="item.value"  :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="优先级:" prop="priority">
          <s-input v-model="priority" disabled></s-input>
        </s-form-item>
        <s-form-item label="目标完成时间:" prop="expectTimeStr">
          <s-date-picker v-model="form.expectTimeStr" type="datetime" clearable :picker-options="disableAfterToday1"
                         placeholder="请选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="问题经理组:" prop="managerGroup" >
          <s-select v-model="form.managerGroup" clearable>
            <s-option v-for="item in managerGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题经理:" prop="managerUser" >
          <s-select v-model="form.managerUser" clearable>
            <s-option v-for="item in managerUserList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="附件信息:">
          <s-upload class="upload"
                    :action="baseUrl + '/fileUpload/uploadItilattach'"
                    multiple
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :on-remove="uploadRemove"
                    :with-credentials="true"
                    :file-list="fileList">
            <s-button slot="trigger" icon="export">上传</s-button>
          </s-upload>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        form: {
          serialCode: '',
          problemSource: '',
          criticality: '',
          effect: '',
          managerGroup: '',
          priority: '',
          managerUser: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          attachuuid: '',
          companyUuid: ''
        },
        rules: {
          briefDesc: [ Validaters.NotNull ],
          categoryFirst: [ Validaters.NotNull ],
          categorySecond: [ Validaters.NotNull ],
          problemSource: [ Validaters.NotNull ],
          criticality: [ Validaters.NotNull ],
          effect: [ Validaters.NotNull ],
          priority: [ Validaters.NotNull ]
        },
        topCategory: [],
        secondary: [],
        thirdary: [],
        problemSourceList: [],
        criticalityList: [],
        effectList: [],
        managerGroupList: [],
        managerUserList: [],
        baseUrl: $axios.basePath(),
        fileList: [],
        priority: '',
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: [],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() <= Date.now();
          }
        }
      }
    },
    methods: {
      getData() {
        $axios.post('/itilProblemOrder/getProblemOrderBasicData').then(res => {
          if (res.status === 200) {
            this.form.serialCode = res.data.serialCode;
            this.problemSourceList = res.data.problemSource;
            this.form.problemSource = this.problemSourceList[0].value;
            this.criticalityList = res.data.criticality;
            this.form.criticality = this.criticalityList[this.criticalityList.length - 1].value;
            this.effectList = res.data.effect;
            this.form.effect = this.effectList[this.effectList.length - 1].value;
            this.managerGroupList = res.data.managerGroup;
          }
        })
      },
      beforeUpload(file) {
        if (file.size > 10 * 1024 * 1024) {
          this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
          return false;
        }
      },
      uploadSuccess(res, file, fileList) {
        this.form.attachuuid = res.attachuuid;
        this.fileList = fileList;
        let uuidList = [];
        for (let i in this.fileList) {
          uuidList.push(this.fileList[i].response.attachuuid);
        }
        this.form.attachuuid = uuidList.join(',');
      },
      uploadError() {
        this.$message({type: 'error', message: '上传失败'});
      },
      uploadRemove(file, fileList) {
        this.fileList = fileList;
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
          let param = {
            ownerType: 1,
            companyUuid: this.form.companyUuid,
            categoryFirst: this.form.categoryFirst
          }
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            if (res.status === 200) {
              this.secondary = res.data;
              this.form.categorySecond = this.secondary[0].uuid;
            }
          })
        }
      }
    },
    created() {
      this.$set(this.form, 'expectTimeStr', '');
      this.getData();
      $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 1).then(res => {
        this.companyAndCategoryList = res.data;
        this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
        this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
        this.form.companyUuid = this.companyAndCategoryList[0].uuid;
        this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
        $axios.get('/itilProblemOrder/getProblemManagerList/' + this.form.companyUuid).then(res => {
          this.managerGroupList = res.data
        })
      })
    },
    watch: {
      'form.categoryFirst': {
        handler: function(val) {
          if (val !== '') {
            let obj = {
              ownerType: 1,
              companyUuid: this.form.companyUuid,
              categoryFirst: this.form.categoryFirst
            }
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
              this.secondary = res.data;
              this.form.categorySecond = this.secondary[0].uuid;
            })
          }
        },
        deep: true
      },
      'form.categorySecond': {
        handler: function(val) {
          if (val !== '') {
            let obj = {
              ownerType: 1,
              companyUuid: this.form.companyUuid,
              categoryFirst: this.form.categoryFirst,
              categorySecond: this.form.categorySecond
            }
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
              this.form.categoryThird = '';
              this.thirdary = res.data;
            })
          }
        },
        deep: true
      },
      'form.managerGroup': {
        handler: function (val) {
          if (val !== '') {
            $axios.get(`/itilProblemOrder/getProblemManagerByGroup/${val}`).then((res) => {
              this.form.managerUser = '';
              this.managerUserList = res.data
            })
          }
        },
        deep: true
      },
      'form.criticality': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.effect !== '') {
            $axios.post('/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/' + val + '/' + this.form.effect).then((res) => {
               if (res.status === 200) {
                 switch (res.data) {
                   case 1:
                     this.form.priority = 1;
                     this.priority = '重大';
                     break;
                   case 2:
                     this.form.priority = 2;
                     this.priority = '高';
                     break;
                   case 3:
                     this.form.priority = 3;
                     this.priority = '中';
                     break;
                   case 4:
                     this.form.priority = 4;
                     this.priority = '低';
                     break;
                 }
               }
            })
          }
        }
      },
      'form.effect': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.criticality !== '') {
            $axios.post('/ItilCommonWorkflow/getPriorityByCriticalityAndEffent/' + this.form.criticality + '/' + val).then((res) => {
              if (res.status === 200) {
                switch (res.data) {
                  case 1:
                    this.form.priority = 1;
                    this.priority = '重大';
                    break;
                  case 2:
                    this.form.priority = 2;
                    this.priority = '高';
                    break;
                  case 3:
                    this.form.priority = 3;
                    this.priority = '中';
                    break;
                  case 4:
                    this.form.priority = 4;
                    this.priority = '低';
                    break;
                }
              }
            })
          }
        }
      }
    }
  }
</script>
