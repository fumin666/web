<template>
  <div class="textAttrDialog">
    <s-form ref="sysAttrform" :model="attrForm" :rules="sysAttrRule" label-width="100px">
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
      <s-form-item label="默认值" v-if="attrForm.dataType === '1'" prop="defaultValue" class="AssetsAttr_option">
        <s-input placeholder="最长输入30个字符" v-model.trim="attrForm.defaultValue"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attrForm.dataType === '3'" prop="defaultValueNum" class="AssetsAttr_option">
        <s-input placeholder="请输入数值" v-model="attrForm.defaultValueNum"></s-input>
      </s-form-item>
      <s-form-item label="默认值" v-else-if="attrForm.dataType === '4'" class="AssetsAttr_option">
        <s-date-picker
          style="width: 100%;"
          type="datetime"
          placeholder="选择时间"
          v-model="attrForm.defaultValueDate"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="描述" prop="desc">
        <s-input type="textarea" v-model="attrForm.desc" :rows="3" placeholder="不能超过120个字符" resize="none"></s-input>
      </s-form-item>
      <s-form-item label="是否必填" required>
        <s-switch v-model="attrForm.isRequired" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
    <div class="labelForm">
      <drag-template :divId="divId" :uid="uid" :attrTag="attrForm.attrTag" :options="attrForm.options" :value="value" :select="false"></drag-template>
    </div>
  </div>
</template>
<script>
  import { uniqueId } from 'lodash'
  import dragTemplate from './dragTemplate'
  import $axios from 'sunflower-ajax';
  let $ = window.$;
  export default {
    props: {
      attrVal: {
        type: Object,
        default: function() {
          return {}
        }
      },
      currentType: {
        type: String,
        default: '1'
      },
      dragData: {
        type: Object,
        default: {}
      }
    },
    mounted() {
      this.attrForm.dataType = this.currentType
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
        let reg = /^-?\d+(\.{0,1}\d+){0,1}$/
        if (value) {
          if (!reg.test(value)) {
            callback(new Error('请输入数值'))
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
        attrName: [],
        attrForm: {
          attrTag: '',
          dataType: '1',
          desc: '',
          isRequired: 0,
          options: [],
          defaultValue: '',
          defaultValueNum: null,
          defaultValueDate: null
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
          defaultValue: [ {max: 30, message: '最大长度为30', trigger: 'blur'} ],
          defaultValueNum: [ {validator: checkNum}, {pattern: /^(\-|\+)?\d+(\.\d{1,2})?$/, message: '最多可包含小数点后两位', trigger: 'blur'} ],
          desc: [{max: 120, message: '最大长度为120', trigger: 'blur'}]
        },
        uid: 'attrpre_0',
        attr: {},
        value: ''
      }
    },
    components: {
      dragTemplate
    },
    methods: {
      getUniqueId () {
        return uniqueId('attrpre_');
      },
      submitForm (editOrAdd, type, callback) {
        if (editOrAdd === 0) {
          this.uid = this.getUniqueId();
        }
        this.attr.uuid = this.uid;
        this.attr.isSyetemAttribute = 0;
        switch (type) {
          case '1':
            this.attr.isSyetemAttribute = 0;
            this.attr.htmlType = 'udf_char_single_line';
            break;
          case '3':
            this.attr.isSyetemAttribute = 0;
            this.attr.htmlType = 'udf_long';
            break;
          case '4':
            this.attr.isSyetemAttribute = 0;
            this.attr.htmlType = 'udf_date';
            break;
        }
        this.attr.dataType = this.attrForm.dataType;
        this.attr.colnumName = this.attrForm.attrTag;
        this.attr.attributeDesc = this.attrForm.desc;
        this.attr.isRequired = this.attrForm.isRequired;
        this.attr.listvalues = []
        this.attr.defaultValue = this.attrForm.defaultValue ? this.attrForm.defaultValue : this.attrForm.defaultValueNum ? this.attrForm.defaultValueNum : this.attrForm.defaultValueDate ? this.attrForm.defaultValueDate : null;
        this.value = this.attr.defaultValue
        this.$nextTick(function () {
          var htmlStr = $('.textAttrDialog .labelForm').html();
          if (editOrAdd === 0) {
            $('.field-outer-container-action').replaceWith(htmlStr);
          } else {
            $('#Attribute_' + this.uid).replaceWith(htmlStr);
          }
          this.attrForm.attrTag = '';
          this.attrForm.desc = '';
          this.attrForm.defaultValue = null;
          this.attrForm.defaultValueNum = null;
          this.attrForm.defaultValueDate = null;
          callback();
        });
      },
      cancelForm () {
        this.attrForm.attrTag = '';
        this.attrForm.desc = '';
        this.attrForm.defaultValue = null;
        this.attrForm.defaultValueNum = null;
        this.attrForm.defaultValueDate = null;
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
<style scoped>
  .textAttrDialog .labelForm{
    display: none;
  }
  .title-item {
    text-align: right;
  }
  .grid-content {
    padding: 5px;
  }
  .desc-item{
    height: 120px;
  }
  .heightstyle {
    /* height: 80px; */
    line-height: 43px
  }
</style>
