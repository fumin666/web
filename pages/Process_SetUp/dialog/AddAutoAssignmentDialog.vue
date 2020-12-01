<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="100px">
    <div style="padding-left: 50px;">
      <s-row>
        <s-col span="18">
          <s-form-item prop="ruletype" label="分派规则 :">
            <s-select v-model="form.ruletype" style="width: 100%">
              <s-option v-for="opt in ruletype" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="ownerType" label="归属流程 :">
            <s-select v-model="form.ownerType" style="width: 100%">
              <s-option v-for="(value, key, index) in ownerTypeList" :key="index" :value="parseInt(key)"
                        :label="value"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="categoryFirst" label="分类一级 :">
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
          <s-form-item prop="categorySecond" label="分类二级 :">
            <s-select v-model="form.categorySecond" style="width: 100%">
              <s-option v-for="opt in categorySecondName" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="categoryThird" label="分类三级 :">
            <s-select v-model="form.categoryThird" style="width: 100%" clearable>
              <s-option v-for="opt in categoryThirdName" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="departmentUuid" label="组织名称 :">
            <s-select v-model="form.departmentUuid" style="width: 100%">
              <s-option v-for="opt in department" :label="opt.departName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="groupUuid" label="支持组名称 :">
            <s-select v-model="form.groupUuid" style="width: 100%">
              <s-option v-for="opt in groupName" :label="opt.groupName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="activeStatus" label="状态 :">
            <s-select v-model="form.activeStatus" style="width: 100%">
              <s-option v-for="opt in activeStatus" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        form: {
          activeStatus: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          departmentUuid: '',
          groupUuid: '',
          ownerType: '',
          ruletype: '',
          companyUuid: ''
        },
        rules: {
          ruletype: [Validaters.NotNull],
          ownerType: [Validaters.NotNull],
          categoryFirst: [Validaters.NotNull],
          categorySecond: [Validaters.NotNull],
          companyName: [Validaters.NotNull],
          departmentUuid: [Validaters.NotNull],
          groupUuid: [Validaters.NotNull],
          activeStatus: [Validaters.NotNull]
        },
        ownerTypeList: {},
        categoryFirstName: [],
        categorySecondName: [],
        categoryThirdName: [],
        ruletype: [
          {
            value: '随机分派',
            uuid: 1
          },
          {
            value: '未完成工单最少',
            uuid: 2
          }
        ],
        activeStatus: [
          {
            value: '启用',
            uuid: 1
          },
          {
            value: '禁用',
            uuid: 0
          }
        ],
        companyNameList: [],
        department: [],
        groupName: [],
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: []
      }
    },
    methods: {
      changeOwnerType(val) {
        if (val !== '') {
          this.form.categoryFirst = '';
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + val).then((res) => {
            if (res.status === 200) {
//              this.categoryFirstName = res.data;
              this.companyAndCategoryList = res.data;
              this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
              this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
              this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
              this.form.companyUuid = this.companyAndCategoryList[0].uuid;
            }
          })
        }
      },
      changeCategoryFirst(val) {
        if (val !== '' && this.form.ownerType !== '') {
          let ItilCategory = {
            ownerType: this.form.ownerType,
            categoryFirst: val
          };
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
            if (res.status === 200) {
              this.categorySecondName = res.data;
            }
          })
        }
      },
      changeCategorySecond(val) {
        if (val !== '' && this.form.ownerType !== '' && this.form.categoryFirst !== '') {
          let ItilCategory = {
            ownerType: this.form.ownerType,
            categoryFirst: this.form.categoryFirst,
            categorySecond: val
          };
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
            if (res.status === 200) {
              this.categoryThirdName = res.data;
            }
          })
        }
      },
      axiosCategoryFirst(val) {
        let ItilCategory = {
          ownerType: val
        };
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
          if (res.status === 200) {
            this.categoryFirstName = res.data;
          }
        })
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
          let param = {
            ownerType: this.form.ownerType,
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
      },
      getAscription() {
        $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.ownerTypeList = res.data;
        })
      }
    },
    created() {
      $axios.post('/itilWorkflowConfig/getAllCompanyInfo').then((res) => {
        if (res.status === 200) {
          this.companyNameList = res.data;
        }
      })
      this.form.ruletype = 1;
      this.form.ownerType = 0;
      this.axiosCategoryFirst(this.form.ownerType);
      this.form.activeStatus = 1;
      this.getAscription(); // 获取归属流程
    },
    watch: {
      'form.ownerType': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            this.form.categoryFirst = '';
            this.form.categorySecond = '';
            this.form.categoryThird = '';
            $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + val).then((res) => {
              if (res.status === 200) {
//              this.categoryFirstName = res.data;
                this.companyAndCategoryList = res.data;
                this.companyCategoryValue[0] = this.companyAndCategoryList[0].uuid;
                this.companyCategoryValue[1] = this.companyAndCategoryList[0].childrenList[0].uuid;
                this.form.categoryFirst = this.companyAndCategoryList[0].childrenList[0].uuid;
                this.form.companyUuid = this.companyAndCategoryList[0].uuid;
              }
            })
          }
        }
      },
      'form.categoryFirst': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.ownerType !== '') {
            let ItilCategory = {
              ownerType: this.form.ownerType,
              categoryFirst: val
            };
            this.form.categorySecond = '';
            this.form.categoryThird = '';
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
              if (res.status === 200) {
                this.categorySecondName = res.data;
                if (this.categorySecondName.length > 0) {
                  this.form.categorySecond = this.categorySecondName[0].uuid;
                }
              }
            })
          }
        }
      },
      'form.categorySecond': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.ownerType !== '' && this.form.categoryFirst !== '') {
            let ItilCategory = {
              ownerType: this.form.ownerType,
              categoryFirst: this.form.categoryFirst,
              categorySecond: val
            };
            this.form.categoryThird = '';
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
              if (res.status === 200) {
                this.categoryThirdName = res.data;
                if (this.categoryThirdName.length > 0) {
                  this.form.categoryThird = res.data[0].uuid;
                }
              }
            })
          }
        }
      },
      'form.companyUuid': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            let uuid = val;
            $axios.get('/itilWorkflowConfig/getAllOrganizationByCompanyUuid/' + uuid).then((res) => {
              if (res.status === 200) {
                this.department = res.data;
              }
            })
          }
        }
      },
      'form.departmentUuid': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            let uuid = val;
            $axios.get('/itilWorkflowConfig//getAllItilSupportGroupByDepartUuid/' + uuid).then((res) => {
              if (res.status === 200) {
                this.groupName = res.data;
              }
            })
          }
        }
      }
    }
  }
</script>
