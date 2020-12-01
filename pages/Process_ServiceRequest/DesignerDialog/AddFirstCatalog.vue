<template>
  <s-form
  ref="firstCatalog"
  :model="firstCatalogForm"
  :rules="firstCatalogFormRules"
  label-width="100px">
  <s-form-item label="公司名称：" prop="">
    <s-input v-model="firstCatalogForm.companyName" :disabled="true"></s-input>
  </s-form-item>
  <s-form-item label="目录一级：" prop="firstCatalog">
    <s-input v-model="firstCatalogForm.firstCatalog" :maxlength="30"></s-input>
  </s-form-item>
</s-form>
</template>

<script type="text/babel">
  export default{
    data() {
      return {
        firstCatalogForm: {
          companyName: '',
          firstCatalog: ''
        },
        firstCatalogFormRules: {
          firstCatalog: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      companyName: {
        type: String,
        required: true
      },
      editData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {},
    created() {
      this.firstCatalogForm.companyName = this.companyName;
      if (Object.keys(this.editData).length > 0) {
        this.firstCatalogForm.firstCatalog = this.editData.name;
        this.$set(this.firstCatalogForm, 'editData', this.editData);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
