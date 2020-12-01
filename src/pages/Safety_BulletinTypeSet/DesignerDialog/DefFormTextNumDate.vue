<template>
  <section id="def-form-text-num-date">
    <s-form ref="textNumDateForm" :model="textNumDateForm" :rules="textNumDateFormRules" label-width="120px">
      <s-form-item label="属性名称：" prop="attrName">
        <s-input v-model="textNumDateForm.attrName" placeholder="最长输入30个字符"></s-input>
      </s-form-item>
      <s-form-item label="描述：" prop="attrDesc">
        <s-input v-model="textNumDateForm.attrDesc" placeholder="最长输入120个字符" type="textarea" :rows="3" resize="none" pla></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-if="dialogTitle === '文本' || dialogTitle === '多行文本'" prop="attrValue">
        <s-input placeholder="最长输入30个字符" v-model.trim="textNumDateForm.attrValue"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="dialogTitle === '数值'" prop="attrValueNum" >
        <s-input placeholder="请输入非负数" v-model="textNumDateForm.attrValueNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="dialogTitle === '日期'">
        <s-date-picker
          style="width: 100%;"
          type="datetime"
          placeholder="选择时间"
          v-model="textNumDateForm.attrValue"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="是否必填" required v-if="dialogTitle!=='附件'">
        <s-switch v-model="textNumDateForm.isRequired" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import { cloneDeep } from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  export default{
    data() {
      return {
        textNumDateForm: {
          attrName: '',
          attrDesc: '',
          isRequired: 0,
          isTheme: 0,
          isDefault: 0,
          attrValue: null,
          attrValueNum: null
        },
        textNumDateFormRules: {
          attrName: [Validaters.NotNull, Validaters.Max(30)],
          attrDesc: [Validaters.Max(120)],
          attrValue: [Validaters.Max(30)],
          attrValueNum: [Validaters.Max(30),
            {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '非负数，最多可包含小数点后两位', trigger: 'blur'}]
        }
      }
    },
    props: {
      editData: {
        type: Object,
        default() {
          return {}
        }
      },
      dialogTitle: {
        type: String,
        default() {
          return ''
        }
      }
    },
    methods: {},
    created() {
      // 编辑回显
      if (Object.keys(this.editData).length > 0) {
        this.textNumDateForm = cloneDeep(this.editData);
        if (this.textNumDateForm.attrType === 4) { // 数值赋值给attrValue
          this.textNumDateForm.attrValue = this.textNumDateForm.attrValueNum
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
