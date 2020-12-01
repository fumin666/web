<template>
  <section id="def-form-list">
    <s-form ref="listForm" :model="listForm" :rules="listFormRules" label-width="120px">
      <s-form-item prop="colnumName" label="属性名称：">
        <s-input v-model="listForm.colnumName" placeholder="最长输入30个字符"></s-input>
      </s-form-item>
      <s-form-item prop="attributeDesc" label="描述：">
        <s-input v-model="listForm.attributeDesc" type="textarea" :rows="3" resize="none" placeholder="最长输入120个字符"></s-input>
      </s-form-item>
      <s-form-item label="选项及默认值：" prop="listvalues">
        <s-input v-model.trim="optionAdd" style="width:86%;" placeholder="最长输入30个字符"></s-input>
        <s-button @click="addOption">添加</s-button>
        <ul style="border: 1px solid #ccc;padding-left:15px;min-height: 40px;">
          <s-scrollbar wrap-style="max-height:150px;">
            <li v-for="(item, index) in listForm.listvalues" :key="index">
              <s-checkbox class="s-radio treeicon ellipsis" v-model="autooption" @change="handlerChange(item)" :label="item.listvalues" title="设置为默认值">{{item.listvalues}}</s-checkbox>
              <i class="iconfont icon-delete" @click="deleteOption(item.listvalues)" style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
            </li>
          </s-scrollbar>
        </ul>
      </s-form-item>
      <s-form-item label="是否必填" required>
        <s-switch v-model="listForm.isRequired" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import {cloneDeep} from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      let checkOption = (rule, value, callback) => {
        if (value.length > 0) {
          callback()
        } else {
          callback(new Error('至少设置一个选项'));
        }
      };
      return {
        listForm: {
          colnumName: '',
          attributeDesc: '',
          listvalues: [],
          isRequired: 0,
          defaultValue: null,
          isSyetemAttribute: 0,
          htmlType: 'udf_char_list'
        },
        autooption: [],
        listFormRules: {
          colnumName: [Validaters.NotNull, Validaters.Max(30)],
          listvalues: [ Validaters.NotNull, {validator: checkOption, trigger: 'blur'} ],
          attributeDesc: [Validaters.Max(120)]
        },
        optionAdd: ''
      }
    },
    props: {
      editData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 添加列表默认选项
      addOption () {
        if (this.optionAdd) {
          if (this.optionAdd.length > 30) {
            this.$message({type: 'warning', message: '最长输入30个字符'});
          } else if (this.listForm.listvalues.map(val => val.listvalues).includes(this.optionAdd)) {
            this.$message({type: 'warning', message: '选项不能重复'});
            this.optionAdd = null
          } else {
            this.listForm.listvalues.push({listvalues: this.optionAdd});
            this.optionAdd = null
          }
        } else {
          this.$message({type: 'warning', message: '选项不能为空'});
        }
        this.$refs.listForm.validateField('listvalues')
      },
      // 删除列表默认选项
      deleteOption(val) {
        let index = this.listForm.listvalues.findIndex(item => item.listvalues === val);
        this.listForm.listvalues.splice(index, 1)
      },
      handlerChange(item) {
        this.autooption = this.autooption.includes(item.listvalues) ? [item.listvalues] : []
      }
    },
    created() {
      // 编辑回显
      if (Object.keys(this.editData).length > 0) {
        this.listForm = cloneDeep(this.editData);
        this.autooption = !this.editData.defaultValue ? [] : [this.editData.defaultValue]
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .treeicon .s-checkbox-inner{
    border-radius: 10px !important;
  }
  #def-form-list
    #optionAddLists
      min-height 120px
      .optionAddList
        position relative
        line-height 26px
        padding-left 20px
        margin-bottom 2px
        &:hover .tool-bar
         opacity 1
      .tool-bar
        position absolute
        right 30px
        opacity 0
        .iconfont
          cursor pointer
          font-size 18px
</style>
