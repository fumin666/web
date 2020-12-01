<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="100px">
    <s-form-item prop="ownerType" label="归属流程:">
      <s-select v-model="form.ownerType" style="width: 100%">
        <s-option v-for="(value, key, index) in ascription" :key="index" :value="parseInt(key)"
                  :label="value"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="companyUuid" label="公司名称:">
      <s-select v-model="form.companyUuid" style="width: 100%" placeholder="请选择流程" :anonLabel="form.companyName">
        <s-option v-for="opt in departNameList" :label="opt.departName" :value="opt.uuid" :key="opt.uuid"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item prop="categoryFirstName" label="分类一级:">
      <s-input v-model="form.categoryFirstName"></s-input>
    </s-form-item>
    <s-form-item prop="categorySecondName" label="分类二级:">
      <s-input v-model="form.categorySecondName"></s-input>
    </s-form-item>
    <s-form-item prop="categoryThirdName" label="分类三级:">
      <s-input v-model="form.categoryThirdName"></s-input>
    </s-form-item>
    <s-form-item prop="activeStatus" label="状态:">
      <s-select v-model="form.activeStatus" style="width: 100%" placeholder="请选择流程">
        <s-option v-for="opt in status" :label="opt.value" :value="opt.uuid" :key="opt.uuid"></s-option>
      </s-select>
    </s-form-item>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils';
  export default {
    data () {
      return {
        form: {
          categoryFirstName: '',
          categoryFirst: '',
          categorySecondName: '',
          categorySecond: '',
          categoryThirdName: '',
          categoryThird: '',
          ownerType: '',
          activeStatus: '',
          companyUuid: '',
          id: '',
          uuid: '',
          companyName: ''
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
    props: {
      changeMsg: {
        type: Object
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
        })
      }
    },
    created() {
      if (this.changeMsg !== undefined) {
        this.form = intersectObj(this.form, this.changeMsg);
      }
      this.getCompanyName();
      this.getAscription(); // 获取归属流程
    }
  }
</script>
