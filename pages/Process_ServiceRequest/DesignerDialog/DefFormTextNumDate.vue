<template>
  <section id="def-form-text-num-date">
    <s-form ref="textNumDateForm" :model="textNumDateForm" :rules="textNumDateFormRules" label-width="120px">
      <s-form-item label="属性名称：" prop="colnumName">
        <s-input v-model="textNumDateForm.colnumName" placeholder="最长输入30个字符"></s-input>
      </s-form-item>
      <s-form-item label="描述：" prop="attributeDesc">
        <s-input v-model="textNumDateForm.attributeDesc" placeholder="最长输入120个字符" type="textarea" :rows="3" resize="none" pla></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-if="dialogTitle === '文本'" prop="defaultValue">
        <s-input placeholder="最长输入30个字符" v-model.trim="textNumDateForm.defaultValue"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="dialogTitle === '数值'" prop="attrValueNum" >
        <s-input placeholder="请输入数值" v-model="textNumDateForm.attrValueNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="dialogTitle === '日期'">
        <s-date-picker
          style="width: 100%;"
          type="datetime"
          placeholder="选择时间"
          v-model="textNumDateForm.defaultValue"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="是否必填" required>
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
      let checkNum = (rule, value, callback) => {
        let reg = /^(\-|\+)?\d+(\.\d{1,2})?$/
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('最多可包含小数点后两位'))
          } else {
            let x = -2147483648;
            let y = 2147483648;
            if (parseFloat(value) <= y && parseFloat(value) >= x) {
              callback()
            } else {
              callback(new Error('请输入(-2147483648~2147483648)范围内的数值'))
            }
          }
        } else {
          callback()
        }
      };
      return {
        textNumDateForm: {
          colnumName: '',
          attributeDesc: '',
          isInherent: 1,
          isRequired: 0,
          defaultValue: null,
          isSyetemAttribute: 0,
          attrValueNum: null
        },
        textNumDateFormRules: {
          colnumName: [Validaters.NotNull, Validaters.Max(30)],
          attributeDesc: [Validaters.Max(120)],
          defaultValue: [Validaters.Max(30)],
          attrValueNum: [{validator: checkNum, trigger: 'blur'}]
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
        if (this.textNumDateForm.htmlType === 'udf_long') { // 数值赋值给defaultValue
          this.textNumDateForm.defaultValue = this.textNumDateForm.attrValueNum
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
