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
          <s-select v-model="form.managerGroup" @change="changeManager" :anonLabel="form.managerGroupName">
            <s-option v-for="item in ItilSupportGroupList" :label="item.groupName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类二级:">
          <s-select v-model="form.categorySecond" :anonLabel="form.categorySecondName" @change="changeCategorySecond">
            <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更经理:">
          <s-select v-model="form.managerUser" :anonLabel="form.managerUserName">
            <s-option v-for="item in changeManagerList" :label="item.userRealName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="分类三级:">
          <s-select v-model="form.categoryThird" :anonLabel="form.categoryThirdName">
            <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="变更管理员组:">
          <s-select v-model="form.adminGroup" @change="getGroupMember" :anonLabel="form.adminGroupName">
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
          <s-select v-model="form.adminUser" :anonLabel="form.adminUserName">
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
            <s-option v-for="(value, key, index) in options.changeEnvironmentMap" :label="value" :value="key-0"  :key="index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

    <s-row>
      <s-col span="10">
        <s-form-item label="变更动作 :">
          <s-select v-model="form.changeAction">
            <s-option v-for="(value, key, index) in options.changeActionMap" :label="value" :value="key-0"  :key="index"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
      <s-col span="10" style="margin-left: 30px;">
        <s-form-item label="受影响单位 :">
          <s-select v-model="form.effectOrgnizition" :anonLabel="form.effectOrgnizitionName">
            <s-option v-for="item in effectOrgnizitionList" :label="item.departName" :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>

  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils';
  import Bus from '@/plugins/eventBus';
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
          uuid: '',
          categoryFirstName: '',
          categorySecondName: '',
          categoryThirdName: '',
          managerGroupName: '',
          managerUserName: '',
          adminGroupName: '',
          adminUserName: '',
          effectOrgnizitionName: '',
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
        riskTemplate: {
          changePath: '',
          riskLevel: ''
        },
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: [],
        isFirstCate: true,
        isFirstGroup: true,
        isFirstManager: true
      }
    },
    props: {
      editChangeData: {
        type: Object
      }
    },
    methods: {
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
      getOptions() {
        $axios.get('/itilChangeOrder/getChangeOrderSelectData').then((res) => {
          this.options.changeActionMap = res.data.changeActionMap;
          this.options.changeEnvironmentMap = res.data.changeEnvironmentMap;
          this.effectOrgnizitionList = res.data.companyAndOrganizationList;
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
      axiosManager(msg) {
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
      axiosGroupMember(msg) {
        $axios.get('/itilChangeOrder/getAllChangeAdminUserByGroup/' + msg).then(res => {
          this.changeAdminUserList = res.data;
        })
      },
      showRiskTemplate() {
        this.$emit('show-riskTemplate', this.riskTemplate);
      },
      temDialogRisk(selTemplate) {
        this.riskTemplate = Object.assign({}, selTemplate);
        if (this.riskTemplate.riskLevel) {
          this.form.riskLevel = this.riskTemplate.riskLevel;
          switch (this.riskTemplate.riskLevel) {
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
        if (this.riskTemplate.changePath) {
          this.form.changePath = this.riskTemplate.changePath;
          switch (this.riskTemplate.changePath) {
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
      },
      axiosCategory() {
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/2').then((res) => {
          if (res.status === 200) {
            this.companyAndCategoryList = res.data;
            this.companyCategoryValue[0] = this.form.companyUuid;
            this.companyCategoryValue[1] = this.form.categoryFirst;
          }
        })
      },
      axiosSecondary() {
        let param = {
          ownerType: 2,
          companyUuid: this.form.companyUuid,
          categoryFirst: this.form.categoryFirst
        }
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
          if (res.status === 200) {
            this.secondary = res.data;
          }
        })
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
      },
      axiosThirdary() {
        let ItilCategory = {
          ownerType: 2,
          categoryFirst: this.form.categoryFirst,
          categorySecond: this.form.categorySecond
        }
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
          if (res.status === 200) {
            this.thirdary = res.data;
          }
        })
      }
    },
    created() {
      this.form = intersectObj(this.form, this.editChangeData);
      this.riskTemplate.riskLevel = this.editChangeData.riskLevel;
      if (this.riskTemplate.riskLevel) {
        switch (this.riskTemplate.riskLevel) {
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
      this.riskTemplate.changePath = this.editChangeData.changePath;
      if (this.riskTemplate.changePath) {
        switch (this.riskTemplate.changePath) {
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
      this.getOptions();
      this.getChangeMangerGroup(this.editChangeData.companyUuid);
      this.getChangeAdminGroup(this.editChangeData.companyUuid);
      this.axiosCategory();
      this.axiosSecondary();
      this.axiosThirdary();
      if (this.form.managerGroup) {
        this.axiosManager(this.form.managerGroup);
      }
      if (this.form.adminGroup) {
        this.axiosGroupMember(this.form.adminGroup);
      }
      Bus.$on('finish0', this.temDialogRisk);
    }
  }
</script>
