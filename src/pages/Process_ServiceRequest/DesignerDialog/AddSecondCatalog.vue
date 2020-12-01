<template>
  <s-form
    ref="secondCatalog"
    :model="secondCatalogForm"
    :rules="secondCatalogFormRules"
    label-width="100px">
    <s-form-item label="公司名称：" prop="">
      <s-input v-model="secondCatalogForm.companyName" :disabled="true"></s-input>
    </s-form-item>
    <s-form-item label="目录一级：" prop="">
      <s-input v-model="secondCatalogForm.firstCatalog" :disabled="true" :maxlength="30"></s-input>
    </s-form-item>
    <s-form-item label="目录二级：" prop="secondCatalog">
      <s-input v-model="secondCatalogForm.secondCatalog" :maxlength="30"></s-input>
    </s-form-item>
    <s-form-item label="请求名称：" prop="requestName">
      <s-input v-model="secondCatalogForm.requestName" :maxlength="30"></s-input>
    </s-form-item>
    <s-form-item label="服务描述：" prop="">
      <s-input type="textarea" :rows="4" resize="none" v-model="secondCatalogForm.desc" :maxlength="120"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  export default{
    data() {
      return {
        secondCatalogForm: {
          companyName: '',
          firstCatalog: '',
          secondCatalog: '',
          requestName: '',
          desc: ''
        },
        secondCatalogFormRules: {
          secondCatalog: [{required: true, message: '不能为空', trigger: 'blur'}],
          requestName: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      showData: {
        type: Object,
        required: true
      }
    },
    methods: {},
    created() {
      this.secondCatalogForm = Object.assign({}, this.secondCatalogForm, this.showData);
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
