<template>
  <div class="sysAttrDialog">
    <s-row :gutter="30">
      <s-col span="6"><div class="heightstyle" style="text-align: right">系统属性</div></s-col>
      <s-col span="18">
        <div class="heightstyle">
          <s-select v-model="sysAttrSelect" placeholder="系统属性" style="width:350px">
            <s-option label="影响范围" :value="4"></s-option>
            <s-option label="品牌" :value="5"></s-option>
            <s-option label="用途" :value="10"></s-option>
          </s-select>
        </div>
      </s-col>
    </s-row>
    <s-row :gutter="30">
      <s-col span="6"><div class="heightstyle" style="text-align: right;height: 56px">属性名称</div></s-col>
      <s-col span="18">
        <div class="heightstyle">
            <s-form ref="sysAttrform" :model="this" :rules="sysAttrRule">
            <s-form-item label-width="0" prop="attrTag" style="margin-bottom: 0px">
              <s-input v-model.trim="attrTag" style="width:85%"></s-input>
            </s-form-item>
            </s-form>
         <!-- <s-input v-model="attrTag" style="width:240px"></s-input>-->
        </div>
      </s-col>
    </s-row>
    <s-row :gutter="30">
      <s-col span="6"><div class="heightstyle" style="text-align: right;height: 56px">描述</div></s-col>
      <s-col span="18">
        <div class="s-form-item desc-item heightstyle">
          <s-input type="textarea" v-model="desc" style="width:85%" :rows="3" resize="none"></s-input>
        </div>
      </s-col>
    </s-row>
    <div class="labelForm">
      <drag-template :divId="divId" :uid="uid" :attrTag="attrTag" :options="options" :value="value" :select="false"></drag-template>
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
      let checkCustomAttrNameRepeat = (rule, value, callback) => { // 校验重复的自定义属性
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
      return {
        attrName: [],
        sysAttrRule: {
          attrTag: [
          {required: true, message: '不能为空', trigger: 'blur'},
            {max: 10, message: '最大长度为10', trigger: 'blur'},
            { pattern: /^[\u4e00-\u9fa5|a-zA-Z|0-9]+$/, message: '由中文、字母、数字组成', trigger: 'blur' },
          //   {pattern: new RegExp("^[^`~!%@#$^&*()=|{}':;',\\[\\]\\\\.<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]{1,}$"),
          //  message: '名称不能包含【`~!%@#$^&*()=|{}:;,\[].<>/?~！@#￥……&*（）——|{}【】‘；：”“。，、？】等特殊字符'},
            {validator: checkSelfAttrNameRepeat, trigger: 'blur'},
            {validator: checkCustomAttrNameRepeat, trigger: 'blur'}
           ]
        },
        sysAttrSelect: 4,
        attrTag: '',
        uid: 'attrpre_0',
        attr: {},
        desc: '',
        options: [],
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
      submitForm (editOrAdd, callback) {
        if (editOrAdd === 0) {
          this.uid = this.getUniqueId();
        }
        this.attr.isSyetemAttribute = 1;
        this.attr.htmlType = 'udf_char_single_line';
        this.attr.colnumName = this.attrTag;
        this.attr.sysAttrSelect = this.sysAttrSelect;
        this.attr.attributeDesc = this.desc;
        this.$nextTick(function () {
          var htmlStr = $('.sysAttrDialog .labelForm').html();
          if (editOrAdd === 0) {
            $('.field-outer-container-action').replaceWith(htmlStr);
          } else {
            $('#Attribute_' + this.uid).replaceWith(htmlStr);
          }
          this.attrTag = '';
          this.desc = '';
          this.sysAttrSelect = 4;
          callback();
        })
      },
      cancelForm () {
        this.attrTag = '';
        this.desc = '';
        this.sysAttrSelect = 4;
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
<style>
.sysAttrDialog .labelForm{
  display: none;
}
.heightstyle {
  height: 56px;
  line-height: 43px
}
</style>
