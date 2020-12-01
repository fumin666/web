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
            <s-select v-model="form.categorySecond" style="width: 100%" @change="changeCategorySecond">
              <s-option v-for="opt in categorySecondName" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="categoryThird" label="分类三级 :">
            <s-select v-model="form.categoryThird" style="width: 100%" clearable>
              <s-option v-for="opt in categoryThirdName" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item prop="departmentUuid" label="组织名称 :">
            <s-select v-model="form.departmentUuid" style="width: 100%" @change="changeDepartment" :anonLabel="form.organizaitonName">
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
  import { intersectObj, Validaters } from 'sunflower-common-utils';
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
          uuid: '',
          companyName: '',
          companyUuid: '',
          organizaitonName: ''
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
        id: '',
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
        companyName: '',
        companyNameList: [],
        department: [],
        groupName: [],
        companyAndCategoryList: [],
        cascaderConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        companyCategoryValue: [],
        isFirst: true
      }
    },
    props: {
      changeData: {
        type: Object
      }
    },
    methods: {
      axiosCategoryFirst(val) {
        if (val !== '') {
          $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + val).then((res) => {
            if (res.status === 200) {
              this.companyAndCategoryList = res.data;
            }
          })
        }
      },
      axiosCategorySecond(val) {
        let ItilCategory = {
          ownerType: this.form.ownerType,
          categoryFirst: val
        };
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
          if (res.status === 200) {
            this.categorySecondName = res.data;
          }
        })
      },
      axiosCategoryThird(val) {
        let ItilCategory = {
          ownerType: this.form.ownerType,
          categoryFirst: this.form.categoryFirst,
          categorySecond: val
        };
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
          if (res.status === 200) {
            this.categoryThirdName = res.data;
          }
        })
      },
      axiosDepartment(val) {
        $axios.get('/itilWorkflowConfig/getAllOrganizationByCompanyUuid/' + val).then((res) => {
          if (res.status === 200) {
            this.department = res.data;
          }
        })
      },
      axiosCompanyName() {
        $axios.post('/itilWorkflowConfig/getAllCompanyInfo').then((res) => {
          if (res.status === 200) {
            this.companyNameList = res.data;
          }
        })
      },
      axiosGroupName(val) {
        $axios.get('/itilWorkflowConfig//getAllItilSupportGroupByDepartUuid/' + val).then((res) => {
          if (res.status === 200) {
            this.groupName = res.data;
          }
        })
      },
      changeOrderType(val) {
        if (val !== '') {
          this.form.categoryFirst = '';
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          this.categorySecondName = [];
          this.categoryThirdName = [];
          this.form.departmentUuid = '';
          this.form.groupUuid = '';
          this.department = [];
          this.groupName = [];
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
          this.categorySecondName = [];
          this.categoryThirdName = [];
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
            console.log(res);
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
      changeCompanyName(val) {
        if (val !== '') {
          let uuid = val;
          $axios.get('/itilWorkflowConfig/getAllOrganizationByCompanyUuid/' + uuid).then((res) => {
            if (res.status === 200) {
              this.department = res.data;
              this.form.departmentUuid = '';
              this.form.groupUuid = '';
            }
          })
        }
      },
      changeDepartment(val) {
        if (val !== '') {
          let uuid = val;
          $axios.get('/itilWorkflowConfig//getAllItilSupportGroupByDepartUuid/' + uuid).then((res) => {
            if (res.status === 200) {
              this.groupName = res.data;
              this.form.groupUuid = '';
            }
          })
        }
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
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          this.categorySecondName = [];
          this.categoryThirdName = [];
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(res => {
            console.log(res);
            if (res.status === 200) {
              this.categorySecondName = res.data;
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
      if (this.changeData !== undefined) {
        this.form = intersectObj(this.form, this.changeData);
        this.axiosCategoryFirst(this.form.ownerType);
        this.companyCategoryValue[0] = this.form.companyUuid;
        this.companyCategoryValue[1] = this.form.categoryFirst;
        this.axiosCategorySecond(this.form.categoryFirst);
        this.axiosCategoryThird(this.form.categorySecond);
        this.axiosCompanyName();
        this.getAscription();
        this.axiosDepartment(this.form.companyUuid);
        this.axiosGroupName(this.form.departmentUuid);
      }
    },
    watch: {
      'form.categoryFirst': {
        deep: true,
        handler: function (val) {
          if (val !== '' && this.form.ownerType !== '' && this.form.categorySecond === '' && this.form.categoryThird === '') {
            let ItilCategory = {
              ownerType: this.form.ownerType,
              categoryFirst: val
            };
            this.form.categorySecond = '';
            this.form.categoryThird = '';
            this.categorySecondName = [];
            this.categoryThirdName = [];
            $axios.post('/ItilCommonWorkflow/getItilCategorySelect', ItilCategory).then((res) => {
              console.log(res);
              if (res.status === 200) {
                this.categorySecondName = res.data;
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
                if (this.isFirst === true) {
                  this.isFirst = false;
                } else {
                  this.form.departmentUuid = '';
                  this.form.groupUuid = '';
                }
              }
            })
          }
        }
      }
    }
  }
</script>
