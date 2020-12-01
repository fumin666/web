<template>
  <s-form :model="form" ref="Form" :rules="rules"  label-width="90px">
    <s-row>
      <span style="font-size: 18px;">审批映射条件</span>
    </s-row>
    <div style="border: solid 1px #6da0cb">
      <s-row>
        <s-col span="16" style="margin-top: 35px;">
          <s-col span="9">
              <s-form-item prop="ownerType" label="归属流程:">
                <s-select v-model="form.ownerType" style="width: 100%" @change="changeOwnerType">
                  <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="key"
                            :label="value"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item prop="approveType" label="审批类型:">
                <s-select v-model="form.approveType" style="width: 100%" @change="changeApproveType">
                  <s-option v-for="item in approveType" :label="item.name" :value="item.value" :key="item.value"></s-option>
                </s-select>
              </s-form-item>
          </s-col>
          <s-col span="9" style="margin-left: 10px;">
            <s-form-item prop="approveLink" label="审批阶段:">
              <s-select v-model="form.approveLink" style="width: 100%">
                <s-option v-for="item in approveLink" :label="item.name" :value="item.value" :key="item.value"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item prop="approveSort" label="审批顺序:">
              <s-input-number :min="0" :max="10000" v-model="form.approveSort" @change="handleChange"></s-input-number>
            </s-form-item>
          </s-col>
        </s-col>
        <s-col span="8">
          <s-col span="20">
            <s-form-item prop="departmentUuid" label="公司名称:">
              <s-select v-model="form.departmentUuid" style="width: 100%" @change="changeDepartment" :anonLabel="form.companyName">
                <s-option v-for="item in companyName" :label="item.departName" :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item prop="categoryFirst" label="分类一级:">
              <s-select v-model="form.categoryFirst" style="width: 100%" clearable @change="changeCategoryFirst">
                <s-option v-for="item in topCategory" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item prop="categorySecond" label="分类二级:">
              <s-select v-model="form.categorySecond" style="width: 100%" clearable @change="changeCategorySecond">
                <s-option v-for="item in secondary" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item prop="categoryThird" label="分类三级:">
              <s-select v-model="form.categoryThird" style="width: 100%" clearable>
                <s-option v-for="item in thirdary" :label="item.categoryName" :value="item.uuid" :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
        </s-col>
      </s-row>
    </div>


    <s-row style="margin-top: 15px;">
      <span style="font-size: 18px;">审批人映射条件</span>
    </s-row>
    <div style="border: solid 1px #6da0cb">
      <s-row type='flex' justify='between'>
        <s-col span="6">
          <s-form-item prop="userUuid" label="姓名:">
            <s-select v-model="form.userUuid" style="width: 100%" filterable :anonLabel="form.realNameAndEmail">
              <s-option v-for="item in userLoginName" :label="item.realNameAndEmail" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
        <s-col span="6">
          <s-form-item prop="departmentUuid" label="公司名称:">
            <s-select v-model="form.departmentUuid" style="width: 100%" clearable @change="changeDepartment" :anonLabel="form.companyName">
              <s-option v-for="item in companyName" :label="item.departName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
        <s-col span="6">
          <s-form-item prop="userRoleName" label="角色:">
            <s-select v-model="form.roleUuid" style="width: 100%" clearable>
              <s-option v-for="item in userRoleNameList" :label="item.roleName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
      <s-row type='flex' justify='between'>
        <s-col span="6"></s-col>
        <s-col span="6">
          <s-form-item prop="groupUuid" label="支持组:">
            <s-select v-model="form.groupUuid" style="width: 100%" filterable clearable :anonLabel="form.groupName">
              <s-option v-for="item in groupName" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
        <s-col span="6"></s-col>
      </s-row>
    </div>

    <s-row style="margin-top: 15px;">
      <span style="font-size: 18px;">审批映射可用性</span>
    </s-row>
    <div style="border: solid 1px #6da0cb">
      <s-row>
        <s-col span="6" style="margin-top: 10px;">
          <s-form-item prop="activeStatus" label="状态:">
            <s-select v-model="form.activeStatus" style="width: 100%">
              <s-option v-for="item in activeStatus" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  export default {
    data() {
      return {
        form: {
          id: '',
          uuid: '',
          approveSort: '',
          ownerType: '',
          userUuid: '',
          departmentUuid: '',
          activeStatus: 1,
          approveLink: '',
          groupUuid: '',
          approveType: '',
          categoryFirst: '',
          categorySecond: '',
          categoryThird: '',
          roleUuid: '',
          companyName: '',
          groupName: '',
          userLoginName: ''
        },
        rules: {
          ownerType: [Validaters.NotNull],
          approveType: [Validaters.NotNull],
          approveLink: [Validaters.NotNull],
          approveSort: [Validaters.NotNull],
          userUuid: [Validaters.NotNull],
          activeStatus: [Validaters.NotNull]
        },
        approveType: [],
        approveLink: [],
        companyName: [],
        topCategory: [],
        secondary: [],
        thirdary: [],
        orderTypeMap: {},
        groupName: [],
        userLoginName: [],
        userRoleNameList: [],
        activeStatus: [
          {
            value: '启用',
            uuid: 1
          },
          {
            value: '禁用',
            uuid: 0
          }
        ]
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    methods: {
      getOrderType() {
        return $axios.get('/ItilCommonWorkflow/getApproveMappingOrderType').then(res => {
          this.orderTypeMap = res.data;
          delete this.orderTypeMap['6'];
          return this.orderTypeMap;
        })
      },
      handleChange(value) {
        this.form.approveSort = value;
      },
      axiosUserInfo() {
        $axios.post('/iamUserInfo/getIamUserInfoListForItil').then((res) => {
          this.userLoginName = res.data;
        })
      },
      axiosRoleList() {
        $axios.post('/itilWorkflowConfig/getItilRoleList').then((res) => {
          this.userRoleNameList = res.data;
        })
      },
      // 查询所有包含组织的公司信息
      getAllCompanyInfo() {
        $axios.post('/itilWorkflowConfig/getAllCompanyInfo').then((res) => {
          if (res.status === 200) {
            this.companyName = res.data;
          }
        })
      },
      // 获取三级分类下拉框内容
      axiosCategory(level = 1) {
        let param = {
          ownerType: this.form.ownerType,
          companyUuid: this.form.departmentUuid
        }
        if (level >= 2) {
          param.categoryFirst = this.form.categoryFirst;
        }
        if (level >= 3) {
          param.categorySecond = this.form.categorySecond;
        }
        $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
          switch (level) {
            case 1: this.topCategory = data; break;
            case 2: this.secondary = data; break;
            case 3: this.thirdary = data; break;
          }
        })
      },
      changeCategoryFirst(val) {
        if (val !== '') {
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          this.axiosCategory(2);
        }
      },
      changeCategorySecond(val) {
        if (val !== '') {
          this.form.categoryThird = '';
          this.axiosCategory(3);
        }
      },
      changeDepartment(val) {
        if (val !== '') {
          this.form.groupUuid = '';
          this.form.categoryFirst = '';
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          $axios.post('/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/' + val).then((res) => {
            this.groupName = res.data;
          })
          this.axiosCategory();
        } else {
          this.form.groupUuid = '';
          this.form.categoryFirst = '';
          this.form.categorySecond = '';
          this.form.categoryThird = '';
        }
      },
      axiosGroupName(val) {
        $axios.post('/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/' + val).then((res) => {
          this.groupName = res.data;
        })
      },
      changeOwnerType(val) {
        if (val !== '') {
          this.axiosCategory();
          $axios.get('/itilWorkflowConfig/getApproveTypeByOwnerType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveType = res.data;
              this.form.approveType = res.data[0].value;
              this.axiosApproveLink(this.form.approveType)
            }
          })
        }
      },
      axiosApproveType(val, type) {
        if (type === 'edit') {
          $axios.get('/itilWorkflowConfig/getApproveTypeByOwnerType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveType = res.data;
              this.axiosApproveLink(this.form.approveType, 'edit');
            }
          })
        } else {
          $axios.get('/itilWorkflowConfig/getApproveTypeByOwnerType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveType = res.data;
              this.form.approveType = this.approveType[0].value;
              this.axiosApproveLink(this.form.approveType);
            }
          })
        }
      },
      axiosApproveLink(val, type) {
        if (type === 'edit') {
          $axios.get('/itilWorkflowConfig/getApproveLinkStatusByApproveType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveLink = res.data;
            }
          })
        } else {
          $axios.get('/itilWorkflowConfig/getApproveLinkStatusByApproveType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveLink = res.data;
              this.form.approveLink = this.approveLink[0].value;
            }
          })
        }
      },
      changeApproveType(val) {
        if (val !== '' && this.form.ownerType !== '') {
          this.form.approveLink = '';
          $axios.get('/itilWorkflowConfig/getApproveLinkStatusByApproveType/' + val).then((res) => {
            if (res.status === 200) {
              this.approveLink = res.data;
            }
          })
        }
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.getOrderType().then(() => {
          this.form = intersectObj(this.form, this.editData);
          this.form.ownerType = this.form.ownerType.toString();
          this.axiosCategory(1);
          this.axiosCategory(2);
          this.axiosCategory(3);
          this.axiosApproveType(this.form.ownerType, 'edit');
          if (this.form.departmentUuid !== '') {
            this.axiosGroupName(this.form.departmentUuid);
          }
          this.getAllCompanyInfo();
          this.axiosUserInfo();
          this.axiosRoleList();
        })
      } else {
        this.getOrderType().then(() => {
          this.form.ownerType = Object.keys(this.orderTypeMap)[0];
          this.axiosApproveType(this.form.ownerType);
        })
        this.getAllCompanyInfo();
        this.axiosUserInfo();
        this.axiosRoleList();
      }
    }
  }
</script>
