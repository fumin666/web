<template>
  <section>
    <s-scrollbar wrap-style="height: 400px;">
      <s-form class="issueOrderDiolog" :model="form" :rules="rules" ref="Form" label-width="120px">
        <s-form-item label="变更单号:" prop="serialCode">
          <span>{{form.serialCode}}</span>
        </s-form-item>
        <s-form-item label="简要描述:" prop="briefDesc">
          <s-input v-model="form.briefDesc" :maxlength="100"></s-input>
        </s-form-item>
        <s-form-item label="详细描述:" prop="detailDesc">
          <s-input type="textarea" :maxlength="300" v-model="form.detailDesc" :rows="3" placeholder="请输入内容"></s-input>
        </s-form-item>
        <s-form-item label="变更模板:">
          <s-input disabled v-model="template.templateName"></s-input>
          <i class="iconfont icon-enlarge" style="margin-left: 8px;cursor: pointer;" @click="showTemplateDialog"></i>
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
          <s-select v-model="form.categorySecond" @change="changeCategorySecond">
            <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="分类三级:" prop="categoryThird">
          <s-select v-model="form.categoryThird" clearable>
            <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="风险等级:" prop="riskLevel">
          <s-input disabled v-model="riskTemplate.riskLevel">
          </s-input>
          <i class="iconfont icon-help" style="margin-left: 8px;cursor:pointer; " @click="showRiskTemplate"></i>
        </s-form-item>
        <s-form-item label="变更路径:" prop="changePath">
          <s-input disabled v-model="riskTemplate.changePath"></s-input>
        </s-form-item>
        <s-form-item label="变更动作:" prop="changeAction">
          <s-select v-model="form.changeAction">
            <s-option v-for="(value, key, index) in options.changeActionMap" :label="value" :value="key - 0"  :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更环境:" prop="changeEnvironment">
          <s-select v-model="form.changeEnvironment">
            <s-option v-for="(value, key, index) in options.changeEnvironmentMap" :label="value" :value="key - 0"  :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更经理组:" prop="managerGroup" >
          <s-select v-model="form.managerGroup" @change="changeManager">
            <s-option v-for="item in ItilSupportGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更经理:" prop="managerUser">
          <s-select v-model="form.managerUser">
            <s-option v-for="item in changeManagerList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更管理员组:" prop="adminGroup">
          <s-select v-model="form.adminGroup" @change="getGroupMember" clearable>
            <s-option v-for="item in changeAdminGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="变更管理员:" prop="adminUser">
          <s-select v-model="form.adminUser" clearable>
            <s-option v-for="item in changeAdminUserList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="受影响单位:" prop="companyAndOrganization">
          <s-select v-model="form.effectOrgnizition" clearable>
            <s-option v-for="item in options.effectOrgnizitionList" :label="item.departName" :value="item.uuid"  :key="item.uuid"></s-option>
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
  import $axios from 'sunflower-ajax';
  import Bus from '@/plugins/eventBus';
  import {Validaters} from 'sunflower-common-utils';
  // import changeRiskQuestionDialog from './ChangeRiskQuestionDialog.vue';
  export default {
    data() {
      return {
        form: {
          serialCode: '',
          endUser: '',
          briefDesc: '',
          detailDesc: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          incidentSource: '',
          criticality: '',
          effect: '',
          priority: '',
          assignUser: '',
          companyUuid: '',
          templateUuid: '',
          managerGroup: '', // 变更经理组
          managerUser: '',  // 变更经理
          adminGroup: '',  // 变更管理员组
          adminUser: '',   // 变更管理员
          changeAction: '',
          changeEnvironment: '',
          effectOrgnizition: '',
          changePath: '',
          riskLevel: ''
        },
        rules: {
          briefDesc: [Validaters.NotNull],
          categoryFirst: [Validaters.NotNull],
          categorySecond: [Validaters.NotNull],
          changePath: [Validaters.NotNull],
          changeAction: [Validaters.NotNull],
          changeEnvironment: [Validaters.NotNull],
          managerGroup: [Validaters.NotNull],
          managerUser: [Validaters.NotNull]
        },
        topCategory: [],
        secondary: [],
        thirdary: [],
        options: {
          changeActionMap: {},
          changeEnvironmentMap: {},
          effectOrgnizitionList: []
        },
        ItilSupportGroupList: [],
        changeAdminGroupList: [],
        changeAdminUserList: [],
        changeManagerList: [],
        baseUrl: $axios.basePath(),
        fileList: [],
        template: {},
        riskTemplate: {},
        initManagerUser: '',
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
      // changeRiskQuestionDialog
    },
    props: {
      changePath: {
        type: Number
      },
      riskLevel: {
        type: Number
      }
    },
    methods: {
      getData() {
        $axios.post('/itilChangeOrder/getChangeOrderSelectData').then(res => {
            this.form.serialCode = res.data.serialCode;
            for (let i in this.options) {
              this.options[i] = res.data[i];
            }
            for (let i in this.options) {
              if (i !== 'effectOrgnizitionList') {
                this.initSelOption(i);
              }
            }
          this.options.effectOrgnizitionList = res.data.companyAndOrganizationList; // 受影响单位
        })
      },
      initSelOption(field) { // 下拉框默认选中第一项
        let formField = field.slice(0, field.indexOf('Map'));
        if (Object.keys(this.options[field]).length > 0) {
          let key = Object.keys(this.options[field])[0];
          this.form[formField] = key - 0;
        }
      },
      // 获取所有变更经理组
      getChangeMangerGroup(val) {
        $axios.get('/itilChangeOrder/getAllChangeMangerGroup/' + val).then(res => {
            this.ItilSupportGroupList = res.data;
            this.form.managerGroup = this.ItilSupportGroupList[0].uuid;
            this.axiosFirstGroupMember(this.form.managerGroup);
        })
      },
      getChangeAdminGroup(val) {
        $axios.get('/itilChangeOrder/getAllChangeAdminGroup/' + val).then(res => {
            this.changeAdminGroupList = res.data;
        })
      },
      changeManager(msg) {
        this.form.managerUser = '';
        this.changeManagerList = [];
        $axios.get('/itilChangeOrder/getAllChangeMangerUserByGroup/' + msg).then(res => {
            this.changeManagerList = res.data;
        })
      },
      axiosManager(msg) {
        if (msg) {
          $axios.get('/itilChangeOrder/getAllChangeMangerUserByGroup/' + msg).then(res => {
            this.changeManagerList = res.data;
          })
        }
      },
      getGroupMember(msg) {
        this.form.adminUser = '';
        this.changeAdminUserList = [];
        $axios.get('/itilChangeOrder/getAllChangeAdminUserByGroup/' + msg).then(res => {
            this.changeAdminUserList = res.data;
        })
      },
      axiosGroupMember(msg) {
        if (msg) {
          $axios.get('/itilChangeOrder/getAllChangeAdminUserByGroup/' + msg).then(res => {
            this.changeAdminUserList = res.data;
          })
        }
      },
      axiosFirstGroupMember(msg) {
        $axios.get('/itilChangeOrder/getAllChangeMangerUserByGroup/' + msg).then(res => {
          this.changeManagerList = res.data;
          this.form.managerUser = this.changeManagerList[0].uuid;
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
      showRiskTemplate() {
        this.$emit('show-riskTemplate', this.riskTemplate);
      },
      showTemplateDialog() {
        this.$emit('show-template', this.template);
      },
      getCategoryFirst(val) {
        if (val !== '') {
          let obj = {
            ownerType: 2,
            companyUuid: this.form.companyUuid,
            categoryFirst: val
          }
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
            this.secondary = res.data;
            this.form.categorySecond = this.secondary[0].uuid;
            this.axiosCategoryThird(this.form.categorySecond);
          })
        }
      },
      axiosCategoryFirst(val) {
        if (val !== '') {
            let obj = {
              ownerType: 2,
              companyUuid: this.form.companyUuid,
              categoryFirst: val
            }
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
              this.secondary = res.data;
            })
          }
      },
      axiosCategorySecond(val) {
        if (val !== '') {
            let obj = {
              ownerType: 2,
              companyUuid: this.form.companyUuid,
              categoryFirst: this.form.categoryFirst,
              categorySecond: val
            }
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
              this.thirdary = res.data
            })
        }
      },
      changeCategorySecond(val) {
        if (val !== '') {
          let obj = {
            ownerType: 2,
            companyUuid: this.form.companyUuid,
            categoryFirst: this.form.categoryFirst,
            categorySecond: val
          }
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
            this.thirdary = res.data
          })
        }
      },
      temDialogCB(selTemplate) {
        this.template = selTemplate;
        this.companyCategoryValue = [selTemplate.companyUuid, selTemplate.categoryFirst];
        for (let i in selTemplate) {
          if (selTemplate.briefDesc === '') {
            if (this.form.hasOwnProperty(i) && i !== 'serialCode' && i !== 'briefDesc') {
              this.form[i] = selTemplate[i];
            }
          } else {
            if (this.form.hasOwnProperty(i) && i !== 'serialCode') {
              this.form[i] = selTemplate[i];
            }
          }
        }
        this.axiosManager(this.form.managerGroup);
        // 判断一级分类是否存在
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 2).then(res => {
          if (res.data.length > 0) {
            let uuidArr = [];
            for (let item in res.data) {
              for (let j in res.data[item].childrenList) {
                uuidArr.push(res.data[item].childrenList[j].uuid);
              }
            }
            if (uuidArr.indexOf(this.form.categoryFirst) === -1) {
              this.form.categoryFirst = '';
              this.form.categorySecond = '';
              this.form.categoryThird = '';
            }
          } else {
            this.form.categoryFirst = '';
            this.form.categorySecond = '';
            this.form.categoryThird = '';
          }
        });
        // 判断变更经理组是否存在
        $axios.get('/itilChangeOrder/getAllChangeMangerGroup/' + this.form.companyUuid).then(res => {
          if (res.data.length > 0) {
            let companyUuidArr = [];
            for (let i in res.data) {
              companyUuidArr.push(res.data[i].uuid);
            }
            if (companyUuidArr.indexOf(this.form.managerGroup) === -1) {
              this.form.managerGroup = '';
            }
            if (this.form.managerGroup !== '') {
              // 判断变更经理是否存在
              $axios.get('/itilChangeOrder/getAllChangeMangerUserByGroup/' + this.form.managerGroup).then(res => {
                if (res.data.length > 0) {
                  this.changeManagerList = res.data;
                  let managerUserUuidArr = [];
                  for (let i in res.data) {
                    managerUserUuidArr.push(res.data[i].uuid);
                  }
                  if (managerUserUuidArr.indexOf(this.form.managerUser) === -1) {
                    this.form.managerUser = ''
                  }
                } else {
                  this.form.managerUser = ''
                }
              });
            }
          } else {
            this.form.managerGroup = '';
          }
        });
        // 判断变更管理员组是否存在
        $axios.get('/itilChangeOrder/getAllChangeAdminGroup/' + this.form.companyUuid).then(res => {
          if (res.data.length > 0) {
            let adminGroupUuidArr = [];
            for (let i in res.data) {
              adminGroupUuidArr.push(res.data[i].uuid);
            }
            if (adminGroupUuidArr.indexOf(this.form.adminGroup) === -1) {
              this.form.adminGroup = '';
            }
            if (this.form.adminGroup !== '') {
              // 判断变更管理员是否存在
              $axios.get('/itilChangeOrder/getAllChangeAdminUserByGroup/' + this.form.adminGroup).then(res => {
                this.changeAdminUserList = res.data;
                if (res.data.length > 0) {
                  let adminUserUuidArr = [];
                  for (let i in res.data) {
                    adminUserUuidArr.push(res.data[i].uuid);
                  }
                  if (adminUserUuidArr.indexOf(this.form.adminUser) === -1) {
                    this.form.adminUser = ''
                  }
                } else {
                  this.form.adminUser = ''
                }
              })
            }
          } else {
            this.form.adminGroup = '';
            this.form.adminUser = ''
          }
        })
      },
      temDialogRisk(selTemplate) {
        this.filterRiskLevel(selTemplate);
        this.riskTemplate = selTemplate;
      },
      filterRiskLevel(val) {
        if (val.riskLevel) {
          this.form.riskLevel = val.riskLevel
          switch (val.riskLevel) {
            case 1:
              val.riskLevel = 'level1';
              break;
            case 2:
              val.riskLevel = 'level2';
              break;
            case 3:
              val.riskLevel = 'level3';
              break;
            case 4:
              val.riskLevel = 'level4';
              break;
          }
        }
        if (val.changePath) {
          this.form.changePath = val.changePath
          switch (val.changePath) {
            case 1:
              val.changePath = '紧急变更';
              break;
            case 2:
              val.changePath = '重大变更';
              break;
            case 3:
              val.changePath = '标准变更';
              break;
            case 4:
              val.changePath = '一般变更';
              break;
          }
        }
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
          let param = {
            ownerType: 2,
            companyUuid: this.form.companyUuid,
            categoryFirst: this.form.categoryFirst
          }
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          this.secondary = [];
          this.thirdary = [];
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            if (res.status === 200) {
              this.secondary = res.data;
            }
          })
        }
      },
      axiosCategoryThird(val) {
        if (val !== '') {
            let obj = {
              ownerType: 2,
              companyUuid: this.form.companyUuid,
              categoryFirst: this.form.categoryFirst,
              categorySecond: val
            }
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', obj).then((res) => {
              this.thirdary = res.data
            })
        }
      }
    },
    created() {
      this.getData();
      $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 2).then(res => {
        this.companyAndCategoryList = res.data;
        if (this.companyAndCategoryList.length > 0) {
          this.form.changePath = 1;
          this.form.riskLevel = 4;
          this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
          this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
          this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
          this.form.companyUuid = this.companyAndCategoryList[0].uuid;
          this.getChangeMangerGroup(this.form.companyUuid);
          this.getChangeAdminGroup(this.form.companyUuid);
          this.getCategoryFirst(this.form.categoryFirst);
        }
      })
      Bus.$on('finish', this.temDialogCB); // 变更模板选择的回调
      Bus.$on('finish0', this.temDialogRisk);
    },
    beforeDestroy() {
      Bus.$off('finish', this.temDialogCB);
      Bus.$off('finish0', this.temDialogRisk);
    },
    watch: {
      'form.riskLevel': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            switch (val) {
              case 1:
                this.riskTemplate.riskLevel = 'level1';
                break;
              case 2:
                this.riskTemplate.riskLevel = 'level2';
                break;
              case 3:
                this.riskTemplate.riskLevel = 'level3';
                break;
              case 4:
                this.riskTemplate.riskLevel = 'level4';
                break;
            }
          }
        }
      },
      'form.changePath': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            switch (val) {
              case 1:
                this.riskTemplate.changePath = '紧急变更';
                break;
              case 2:
                this.riskTemplate.changePath = '重大变更';
                break;
              case 3:
                this.riskTemplate.changePath = '标准变更';
                break;
              case 4:
                this.riskTemplate.changePath = '一般变更';
                break;
            }
          }
        }
      }
    }
  }
</script>
