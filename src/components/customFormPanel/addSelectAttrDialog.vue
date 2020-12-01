<template>
  <div class="selectAttrDialog">
    <s-form ref="sysAttrform" :model="attrForm" :rules="sysAttrRule" label-width="120px">
      <s-form-item label="属性类型" prop="dataType">
        <s-select v-model="attrForm.dataType" style="width: 100%;">
          <s-option label="文本" value="1"></s-option>
          <s-option label="列表" value="2"></s-option>
          <s-option label="数值" value="3"></s-option>
          <s-option label="日期" value="4"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="属性名称" prop="attrTag">
        <s-input v-model.trim="attrForm.attrTag"></s-input>
      </s-form-item>
      <s-form-item label="选项及默认值" prop="options" class="AssetsAttr_option">
        <s-input style="width:82%;" placeholder="最长输入30个字符" v-model.trim="attrForm.selectItem"></s-input>
        <s-button @click="addOption">添加</s-button>
        <ul style="border: 1px solid #ccc;padding-left:15px;min-height: 40px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in attrForm.options" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="attrForm.defaultValue" @change="handlerChange(item)" :label="item.value" title="设置为默认值">{{item.value}}</s-checkbox>
              <i @click="delOption(item.value)" class="iconfont icon-delete" style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="描述" prop="desc">
        <s-input type="textarea" v-model="attrForm.desc" :rows="3" resize="none"></s-input>
      </s-form-item>
      <s-form-item label="是否必填" required>
        <s-switch v-model="attrForm.isRequired" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
    <div class="labelForm">
      <drag-template :divId="divId" :uid="uid" :attrTag="attrForm.attrTag" :options="attrForm.options" :value="value5" :select="true"></drag-template>
    </div>
  </div>
</template>
<script>
  import { uniqueId } from 'lodash'
  import dragTemplate from './dragTemplate'
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  let $ = window.$;

  export default {
    props: {
      attrVal: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    mounted() {
      for (let i in this.attrVal) {
        this.attrName.push(this.attrVal[i].colnumName);
      }
    },
    data() {
      let vm = this;
      let checkSelfAttrNameRepeat = (rule, value, callback) => { // 校验重复的自身所有属性
        if (value) {
          if (vm.attrName.length) {
            if (vm.attrName.includes(value)) {
              callback(new Error('该属性名称已经存在！'));
            } else {
              callback()
            }
          } else {
            callback()
          }
        } else {
          callback()
        }
      };
      let checkCustomAttrNameRepeat = (rule, value, callback) => { // 校验重复工号
        if (value) {
          $axios.get(`/resourcemanager/assetmanager/itasset/duplicatedAttrNameCheck/${value}`).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该属性名称已经存在！'));
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      };
      let checkNum = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('至少添加一个选项'))
        } else {
          callback()
        }
      };
      return {
        attrName: [],
        attrForm: {
          attrTag: '',
          dataType: '2',
          desc: '',
          isRequired: 0,
          options: [],
          selectItem: '',
          defaultValue: []
        },
        sysAttrRule: {
          dataType: [{required: true, message: '不能为空', trigger: 'change'}],
          attrTag: [{required: true, message: '不能为空', trigger: 'blur'},
            {max: 10, message: '最大长度为10', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5|a-zA-Z|0-9]+$/, message: '由中文、字母、数字组成', trigger: 'blur' },
            // {pattern: new RegExp("^[^`~!%@#$^&*()=|{}':;',\\[\\]\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{1,}$"),
            //   message: '名称不能包含【`~!%@#$^&*()=|{}:;,\[].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？】等特殊字符'},
            {validator: checkSelfAttrNameRepeat, trigger: 'blur'},
            {validator: checkCustomAttrNameRepeat, trigger: 'blur'}
          ],
          desc: [{max: 120, message: '最大长度为120', trigger: 'blur'}],
          options: [ Validaters.NotNull, {validator: checkNum, trigger: 'blur'} ]
        },
        uid: 'attrpre_0',
        attr: {},
        value5: ''
      }
    },
    components: {
      dragTemplate
    },
    methods: {
      handlerChange(item) {
        this.attrForm.defaultValue = this.attrForm.defaultValue.includes(item.value) ? [item.value] : []
      },
      getUniqueId () {
        return uniqueId('attrpre_');
      },
      addOption () {
        if (this.attrForm.selectItem) {
          if (this.attrForm.selectItem.length > 30) {
            this.$message({type: 'warning', message: '最长输入30个字符'});
          } else if (this.attrForm.options.map(val => val.value).includes(this.attrForm.selectItem)) {
            this.$message({type: 'warning', message: '选项不能重复'});
            this.attrForm.selectItem = ''
          } else {
            this.attrForm.options.push({label: this.attrForm.selectItem, value: this.attrForm.selectItem});
            this.value5 = this.attrForm.options[0].value;
            this.attrForm.selectItem = ''
          }
        } else {
          this.$message({type: 'warning', message: '选项不能为空'});
        }
        this.$refs.sysAttrform.validateField('options')
      },
      delOption (value) {
        let index = 0;
        for (let i = 0, l = this.attrForm.options.length; i < l; i++) {
          if (this.attrForm.options[i].value === value) {
            index = i;
            break;
          }
        }
        this.attrForm.options.splice(index, 1);
        if (this.attrForm.options.length > 0) {
          this.value5 = this.attrForm.options[0].value
        } else {
          this.value5 = '';
        }
      },
      submitForm (editOrAdd, callback) {
        if (editOrAdd === 0) {
          this.uid = this.getUniqueId();
        }
        this.attr.uuid = this.uid;
        this.attr.isSyetemAttribute = 0;
        this.attr.htmlType = 'udf_char_list';
        this.attr.colnumName = this.attrForm.attrTag;
        this.attr.attributeDesc = this.attrForm.desc;
        this.attr.defaultValue = this.attrForm.defaultValue.length > 0 ? this.attrForm.defaultValue[0] : null;
        this.attr.isRequired = this.attrForm.isRequired;
        var optionlistvalues = [];
        if (this.attrForm.options.length > 0) {
          for (let i = 0, l = this.attrForm.options.length; i < l; i++) {
            var optionobj = {};
            optionobj.listvalues = this.attrForm.options[i].value;
            optionlistvalues.push(optionobj);
          }
          this.attr.listvalues = optionlistvalues;
        } else {
          this.attr.listvalues = [];
        }
        this.$nextTick(function () {
          var htmlStr = $('.selectAttrDialog .labelForm').html();
          if (editOrAdd === 0) {
            $('.field-outer-container-action').replaceWith(htmlStr);
          } else {
            $('#Attribute_' + this.uid).replaceWith(htmlStr);
          }
          this.attrForm.attrTag = '';
          this.attrForm.desc = '';
          this.attrForm.options = [];
          callback();
        });
      },
      cancelForm () {
        this.attrForm.attrTag = '';
        this.attrForm.desc = '';
        this.attrForm.options = [];
        $('.dotlayers').remove();
        $('.field-outer-container-action').remove();
      }
    },
    computed: {
      divId: function () {
        return 'Attribute_' + this.uid;
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .treeicon .s-checkbox-inner{
    border-radius: 10px !important;
  }
  .selectAttrDialog
    .labelForm
      display none
    .title-item
      text-align right
    .grid-content
      padding: 21px
    .desc-item
      height: 120px
    .selectOptions
      height: 138px
    .options-item
      line-height: 22px
      i
        cursor pointer
    .list-item
      height: 180px
    .s-button
      margin-left: 10px
    .myHeightH
      max-height 150px
    .heightstyle
      height: 56px;
      line-height: 43px
</style>
