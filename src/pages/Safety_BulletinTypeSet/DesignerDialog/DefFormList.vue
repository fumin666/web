<template>
  <section id="def-form-list">
    <s-form ref="listForm" :model="listForm" :rules="listFormRules" label-width="120px">
      <s-form-item prop="attrName" label="属性名称：">
        <s-input v-model="listForm.attrName" placeholder="最长输入30个字符"></s-input>
      </s-form-item>
      <s-form-item prop="attrDesc" label="描述：">
        <s-input v-model="listForm.attrDesc" type="textarea" :rows="3" resize="none" placeholder="最长输入120个字符"></s-input>
      </s-form-item>
      <s-form-item label="选项及默认值：">
        <s-input v-model="optionAdd" style="width:88%;" :maxlength="30"></s-input>
        <s-button size="mini" @click="addOption" style="margin-left:5px;">添加</s-button>
      </s-form-item>
      <s-form-item label=" ">
        <s-scrollbar wrap-style="max-height:150px;">
          <ul id="optionAddLists">
            <s-scrollbar wrap-style="max-height:150px;">
              <li
                class="optionAddList"
                v-for="(list, idx) in listForm.dropDownOptionList"
                :key="idx" style="line-height: 26px">
                <s-checkbox class="s-radio radio treeicon ellipsis" v-model="autooption" @change="handlerChange(list)"
                            :label="list.selectName" title="设置为默认值" style="display: inline-block; vertical-align: middle">{{list.selectName}}
                </s-checkbox>
                <i @click="deleteOption(list.uuid)" class="iconfont icon-delete"
                   style="color: #2296ff;margin-right: 15px;float: right; position: relative; top: 1px;"></i>
              </li>
            </s-scrollbar>
          </ul>
        </s-scrollbar>
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
      return {
        listForm: {
          attrName: '',
          attrDesc: '',
          isRequired: 0,
          isDefault: 0,
          attrValue: null,
          attrType: 3,
          isTheme: 0,
          dropDownOptionList: []
        },
        listFormRules: {
          attrName: [Validaters.NotNull, Validaters.Max(30)],
          attrDesc: [Validaters.Max(120)]
        },
        optionAdd: '',
        autooption: []
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
      addOption() {
        if (this.optionAdd) {
          if (this.optionAdd.length > 30) {
            this.$message({type: 'warning', message: '最长输入30个字符'});
          } else if (this.listForm.dropDownOptionList.map(val => val.selectName).includes(this.optionAdd)) {
            this.$message({type: 'warning', message: '选项不能重复'});
            this.optionAdd = null
          } else {
            this.listForm.dropDownOptionList.push({
              selectName: this.optionAdd,
              uuid: `option-${new Date().getTime()}`
            });
            this.optionAdd = null
          }
        } else {
          this.$message.warning('添加的选项不能为空！');
        }
      },
      // 删除列表默认选项
      deleteOption(uuid) {
        this.listForm.dropDownOptionList = this.listForm.dropDownOptionList.filter(item => item.uuid !== uuid);
      },
      handlerChange(item) {
        this.autooption = this.autooption.includes(item.selectName) ? [item.selectName] : []
      }
    },
    created() {
      // 编辑回显
      if (Object.keys(this.editData).length > 0) {
        this.listForm = cloneDeep(this.editData);
        this.autooption = this.listForm.attrValue !== null ? [this.listForm.attrValue] : []
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .treeicon .s-checkbox-inner {
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
