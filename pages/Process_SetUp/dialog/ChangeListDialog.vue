<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="100px">
    <s-row>
      <s-col span="10">
        <s-form-item prop="serialCode" label="编号 :">
          <s-input v-model="form.serialCode" disabled></s-input>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item prop="templateName" label="模板名称 :">
          <s-input v-model="form.templateName" :maxlength="50"></s-input>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="简要描述:">
          <s-input type="textarea" v-model="form.briefDesc" :maxlength="100" :rows="3" placeholder="请输入内容"></s-input>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="详细描述:">
          <s-input type="textarea" v-model="form.detailDesc" :maxlength="300" :rows="3" placeholder="请输入内容"></s-input>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类一级:">
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
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更经理组:">
          <s-select v-model="form.managerGroup" @change="changeManager">
            <s-option v-for="item in ItilSupportGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类二级:">
          <s-select v-model="form.categorySecond" @change="changeCategorySecond">
            <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更经理:">
          <s-select v-model="form.managerUser">
            <s-option v-for="item in changeManagerList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类三级:">
          <s-select v-model="form.categoryThird">
            <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更管理员组:">
          <s-select v-model="form.adminGroup" @change="getGroupMember">
            <s-option v-for="item in changeAdminGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="风险等级:">
          <s-col span="16">
            <s-input v-model="riskTemplate.riskLevel" disabled></s-input>
          </s-col>
          <s-col span="8">
            <i class="iconfont icon-help" style="margin-left: 18px;cursor:pointer; " @click="showRiskTemplate"></i>
          </s-col>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更管理员:">
          <s-select v-model="form.adminUser">
            <s-option v-for="item in changeAdminUserList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="变更路径:">
          <s-input v-model="riskTemplate.changePath" disabled></s-input>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更环境:">
          <s-select v-model="form.changeEnvironment">
            <s-option v-for="(value, key, index) in options.changeEnvironmentMap" :label="value" :value="key"  :key="index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="变更动作 :">
          <s-select v-model="form.changeAction">
            <s-option v-for="(value, key, index) in options.changeActionMap" :label="value" :value="key"  :key="index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="受影响单位 :">
          <s-select v-model="form.effectOrgnizition">
            <s-option v-for="item in effectOrgnizitionList" :label="item.departName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import Bus from '@/plugins/eventBus';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        form: {
          serialCode: '',
          briefDesc: '',
          detailDesc: '',
          riskLevel: '',
          changePath: '',
          changeAction: '',
          changeEnvironment: '',
          adminGroup: '',
          effectOrgnizition: '',
          adminUser: '',
          managerUser: '',
          managerGroup: '',
          templateName: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          companyUuid: ''
        },
        rules: {
          templateName: [Validaters.NotNull]
        },
        topCategory: [],
        secondary: [],
        thirdary: [],
        ItilSupportGroupList: [],
        changeAdminGroupList: [],
        effectOrgnizitionList: [],
        changeAdminUserList: [],
        changeManagerList: [],
        options: { // 变更环境、变更动作下拉选项
          changeActionMap: {},
          changeEnvironmentMap: {}
        },
        riskTemplate: {},
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: []
      }
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
      initSelOption(field) { // 下拉框默认选中第一项
        let formField = field.slice(0, field.indexOf('Map'));
        if (Object.keys(this.options[field]).length > 0) {
          let key = Object.keys(this.options[field])[0];
          this.form[formField] = key;
        }
      },
      axiosOptions() {
        $axios.get('/itilChangeOrder/getChangeOrderSelectData').then(({data}) => {
          this.effectOrgnizitionList = data.companyAndOrganizationList;
          for (let i in this.options) {
            this.options[i] = data[i]
            if (i !== 'groupInfo') {
              this.initSelOption(i);
            }
          }
        })
      },
      getChangeMangerGroup(val) {
        $axios.get('/itilChangeOrder/getAllChangeMangerGroup/' + val).then(res => {
          this.ItilSupportGroupList = res.data;
        })
      },
      getChangeAdminGroup(val) {
        $axios.get('/itilChangeOrder/getAllChangeAdminGroup/' + val).then(res => {
          this.changeAdminGroupList = res.data;
        })
      },
      changeManager(msg) {
        this.form.managerUser = '';
        $axios.get('/itilChangeOrder/getAllChangeMangerUserByGroup/' + msg).then(res => {
          this.changeManagerList = res.data;
        })
      },
      getGroupMember(msg) {
        this.form.adminUser = '';
        $axios.get('/itilChangeOrder/getAllChangeAdminUserByGroup/' + msg).then(res => {
          this.changeAdminUserList = res.data;
        })
      },
      getChangeId() {
        $axios.post('/itilWorkflowConfig/getChangeTemplateSerialCode').then(res => {
          this.form.serialCode = res.data;
        })
      },
      showRiskTemplate() {
        this.$emit('show-riskTemplate', this.riskTemplate);
      },
      temDialogRisk(selTemplate) {
        this.riskTemplate = selTemplate;
      },
      axiosCategory() {
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/2').then((res) => {
          if (res.status === 200) {
            this.companyAndCategoryList = res.data;
            if (this.companyAndCategoryList.length > 0) {
              this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
              this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
              this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
              this.form.companyUuid = this.companyAndCategoryList[0].uuid;
              this.getChangeMangerGroup(this.form.companyUuid);
              this.getChangeAdminGroup(this.form.companyUuid);
            }
          }
        })
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
        }
      },
      changeCategorySecond(val) {
        if (val !== '' && this.form.ownerType !== '' && this.form.categoryFirst !== '') {
          let ItilCategory = {
            ownerType: 2,
            categoryFirst: this.form.categoryFirst,
            categorySecond: val
          };
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
            if (res.status === 200) {
              this.thirdary = res.data;
            }
          })
        }
      }
    },
    created() {
      this.getChangeId();
      this.axiosOptions();
      this.axiosCategory();
      this.form.riskLevel = 4;
      this.riskTemplate.riskLevel = 'level4';
      this.form.changePath = 1;
      this.riskTemplate.changePath = '紧急变更';
      Bus.$on('finish0', this.temDialogRisk);
    },
    watch: {
      'form.categoryFirst': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
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
        }
      },
      'riskTemplate.riskLevel': {
        handler: function (val) {
          this.form.riskLevel = val;
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
      },
      'riskTemplate.changePath': {
        handler: function (val) {
          this.form.changePath = val;
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
</script>
