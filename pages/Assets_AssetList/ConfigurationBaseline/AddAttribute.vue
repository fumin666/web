/*
create by YOU
*/
<template>
  <div>
    <s-form :model="form" :rules="ruleForm" ref="form" label-width="120px">
      <s-form-item label="属性类别" prop="attrType">
        <s-select v-model="form.attrType" style="width: 100%;">
          <s-option :value="2" label="通用属性" :disabled="clonedCommonNameList.length === 0"></s-option>
          <s-option :value="3" label="特殊属性"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="属性类型" prop="htmlType">
        <s-select v-model="form.htmlType" style="width: 100%;">
          <s-option label="文本" :value="1"></s-option>
          <s-option label="数值" :value="2"></s-option>
          <s-option label="列表" :value="3"></s-option>
          <s-option label="日期" :value="4"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="属性名称" prop="attrName">
        <s-input v-model="form.attrName"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-if="form.htmlType === 1" prop="defaultValueTxt" class="AssetsAttr_option">
        <s-input placeholder="最长输入30个字符" v-model.trim="form.defaultValueTxt"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="form.htmlType === 2" prop="defaultValueNum" class="AssetsAttr_option">
        <s-input placeholder="请输入数值" v-model="form.defaultValueNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="form.htmlType === 4" class="AssetsAttr_option">
        <s-date-picker
          style="width: 100%;"
          type="datetime"
          placeholder="选择时间"
          v-model="form.defaultValueDate"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="选项及默认值" v-else-if="form.htmlType === 3" prop="options" class="AssetsAttr_option">
        <s-input style="width:85%;" placeholder="最长输入30个字符" v-model.trim="form.selectItem"></s-input>
        <s-button @click="addOption">添加</s-button>
        <ul style="border: 1px solid #ccc;padding-left:15px;min-height: 40px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in form.options" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="form.defaultValue" @change="handlerChange(item)" :label="item.listvalues" title="设置为默认值">{{item.listvalues}}</s-checkbox>
              <i @click="delOption(item.listvalues)" class="iconfont icon-delete" style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="是否必填" required>
        <s-switch v-model="form.requireType" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
      <!--<s-form-item>-->
        <!--<i v-if="index === 0" class="iconfont icon-plus" style="cursor: pointer" @click="addItem"></i>-->
        <!--<i v-else class="iconfont icon-delete" style="cursor: pointer" @click="deleteItem(item, index)"></i>-->
      <!--</s-form-item>-->
    </s-form>
  </div>
</template>

<script type="text/babel">
  import {cloneDeep} from 'lodash'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    props: {
      itcompUuid: '',
      baselineUuid: String,
      commonNameList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      let checkOption = (rule, value, callback) => {
        if (value.length > 0) {
          callback()
        } else {
          callback(new Error('至少设置一个选项'));
        }
      };
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
        form: {
          lists: {},
          attrType: 2,
          htmlType: 1,
          attrName: '',
          selectItem: '',
          options: [],
          defaultValue: [],
          requireType: 0,
          defaultValueTxt: '',
          defaultValueNum: null,
          defaultValueDate: null
        },
        ruleForm: {
          attrType: [Validaters.NotNull],
          htmlType: [Validaters.NotNull],
          attrName: [Validaters.NotNull, {max: 50, message: '最大长度为50', trigger: 'blur'}],
          options: [ Validaters.NotNull, {validator: checkOption, trigger: 'blur'} ],
          defaultValueTxt: [ {max: 30, message: '最大长度为30', trigger: 'blur'} ],
          defaultValueNum: [ {validator: checkNum, trigger: 'blur'} ]
        },
        clonedCommonNameList: []
      }
    },
    watch: {
      'clonedCommonNameList'(val) {
      }
    },
    created() {
      this.clonedCommonNameList = cloneDeep(this.commonNameList)
    },
    methods: {
      addOption () {
        if (this.form.selectItem) {
          if (this.form.selectItem.length > 30) {
            this.$message({type: 'warning', message: '最长输入30个字符'});
          } else if (this.form.options.map(val => val.listvalues).includes(this.form.selectItem)) {
            this.$message({type: 'warning', message: '选项不能重复'});
          } else {
            this.form.options.push({listvalues: this.form.selectItem});
            this.form.selectItem = null
          }
        } else {
          this.$message({type: 'warning', message: '选项不能为空'});
        }
        this.$refs.form.validateField('options')
      },
      handlerChange(item) {
        this.form.defaultValue = this.form.defaultValue.includes(item.listvalues) ? [item.listvalues] : []
      },
      delOption (value) {
        let index = this.form.options.findIndex(item => item.listvalues === value);
        this.form.options.splice(index, 1)
      },
      validate(cb) {
        this.$refs.form.validate(valid => cb(valid))
      },
      getForm() {
        this.form.lists = {
          attrType: this.form.attrType,
          htmlType: this.form.htmlType,
          attrName: this.form.attrName,
          confUuid: this.baselineUuid,
          requireType: this.form.requireType,
          attrLists: this.form.options,
          attrValStr: this.form.defaultValueTxt ? this.form.defaultValueTxt : this.form.defaultValueNum ? this.form.defaultValueNum : this.form.defaultValueDate ? this.form.defaultValueDate : null,
          attrVal: this.form.defaultValue.length > 0 ? this.form.defaultValue[0] : null,
          defaultVal: this.form.defaultValueTxt ? this.form.defaultValueTxt : this.form.defaultValueNum ? this.form.defaultValueNum : this.form.defaultValueDate ? this.form.defaultValueDate : this.form.defaultValue.length > 0 ? this.form.defaultValue[0] : null
        }
        return this.form.lists
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .treeicon .s-checkbox-inner{
    border-radius: 10px !important;
  }
</style>
