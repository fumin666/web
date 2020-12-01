<template>
  <s-form :model="form" :rules="rules" ref="Form" label-width="100px">
    <s-form-item prop="ownerType" label="归属流程:">
      <s-select v-model="form.ownerType" style="width: 100%">
        <s-option v-for="(value, key, index) in ascription" :key="index" :value="parseInt(key)"
                  :label="value"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="companyUuid" label="公司名称:">
      <s-select v-model="form.companyUuid" style="width: 100%" placeholder="请选择流程">
        <s-option v-for="opt in departNameList" :label="opt.departName" :value="opt.uuid" :key="opt.uuid"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="categoryFirstName" label="分类一级:">
      <s-select
        v-model="form.categoryFirstName"
        filterable
        allow-create
        placeholder="请选择分类一级"
        style="width: 100%">
        <s-option
          v-for="item in firstCategory"
          :key="item.uuid"
          :label="item.categoryName"
          :value="item.categoryName">
        </s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="categorySecondName" label="分类二级:">
      <s-select
        v-model="form.categorySecondName"
        filterable
        allow-create
        style="width: 100%"
        placeholder="请选择分类二级">
        <s-option
          v-for="item in secondCategory"
          :key="item.uuid"
          :label="item.categoryName"
          :value="item.categoryName">
        </s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="categoryThirdName" label="分类三级:">
      <s-select
        v-model="form.categoryThirdName"
        filterable
        allow-create
        placeholder="请选择分类三级"
        style="width: 100%">
        <s-option
          v-for="item in thirdCategory"
          :key="item.uuid"
          :label="item.categoryName"
          :value="item.categoryName">
        </s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="activeStatus" label="状态:">
      <s-select v-model="form.activeStatus" style="width: 100%" placeholder="请选择状态">
        <s-option v-for="opt in status" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
      </s-select>
    </s-form-item>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data () {
      return {
        form: {
          categoryFirstName: '',
          categorySecondName: '',
          categoryThirdName: '',
          ownerType: 0,
          activeStatus: 1,
          companyUuid: ''
        },
        rules: {
          ownerType: [Validaters.NotNull],
          companyUuid: [Validaters.NotNull],
          categoryFirstName: [Validaters.NotNull, Validaters.Max(50)],
          categorySecondName: [Validaters.NotNull, Validaters.Max(50)],
          categoryThirdName: [Validaters.Max(50)],
          activeStatus: [Validaters.NotNull]
        },
        status: [
          {
            uuid: 1,
            value: '启用'
          },
          {
            uuid: 0,
            value: '禁用'
          }
        ],
        ascription: {},
        firstCategory: [],
        secondCategory: [],
        thirdCategory: [],
        departNameList: []
      }
    },
    methods: {
      getCompanyName() {
        $axios.get('itilWorkflowConfig/getAllCompanyList').then((res) => {
          this.departNameList = res.data;
        })
      },
      getAscription() {
        $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.ascription = res.data;
          delete this.ascription[6];
        })
      }
    },
    created() {
      this.getCompanyName();
      this.getAscription(); // 获取归属流程
    },
    watch: {
      'form.ownerType': {
        handler: function(val) {
          if (val !== '' && this.form.companyUuid !== '') {
            this.form.categoryFirstName = '';
            this.form.categorySecondName = '';
            this.form.categoryThirdName = '';
            let obj = {
              companyUuid: this.form.companyUuid,
              ownerType: val
            }
            $axios.post('/itilWorkflowConfig/getCategoryByOwnerTypeAndName', obj).then((res) => {
              this.firstCategory = res.data
            })
          }
        },
        deep: true
      },
      'form.companyUuid': {
        handler: function(val) {
          if (val !== '' && this.form.ownerType !== '') {
            this.form.categoryFirstName = '';
            this.form.categorySecondName = '';
            this.form.categoryThirdName = '';
            let obj = {
              companyUuid: val,
              ownerType: this.form.ownerType
            }
            $axios.post('/itilWorkflowConfig/getCategoryByOwnerTypeAndName', obj).then((res) => {
              this.firstCategory = res.data
            })
          }
        },
        deep: true
      },
      'form.categoryFirstName': {
        handler: function(val) {
          if (val !== '' && this.form.ownerType !== '' && this.form.companyUuid !== '') {
            let obj = {
              ownerType: this.form.ownerType,
              companyUuid: this.form.companyUuid,
              categoryFirstName: val
            }
            $axios.post('/itilWorkflowConfig/getCategoryByOwnerTypeAndName', obj).then((res) => {
              this.secondCategory = res.data
            })
          }
        },
        deep: true
      },
      'form.categorySecondName': {
        handler: function(val) {
          if (val !== '' && this.form.ownerType !== '' && this.form.companyUuid !== '' && this.form.categoryFirstName !== '') {
            let obj = {
              ownerType: this.form.ownerType,
              companyUuid: this.form.companyUuid,
              categoryFirstName: this.form.categoryFirstName,
              categorySecondName: val
            }
            $axios.post('/itilWorkflowConfig/getCategoryByOwnerTypeAndName', obj).then((res) => {
              this.thirdCategory = res.data
            })
          }
        },
        deep: true
      }
    }
  }
</script>
