<template>
  <section id="divideGroupForm">
    <s-form ref="groupForm" :model="groupForm" :rules="groupFormRules" label-width="100px">
      <s-form-item label="一级分组" prop="parentUuid">
        <s-select v-if="!addFlag" :disabled="flag" v-model="groupForm.parentUuid" filterable allow-create style="width: 100%;">
          <s-option
            v-for="i in firstLevelGroups"
            :label="i.groupName"
            :value="i.uuid"
            :key="i.uuid"></s-option>
        </s-select>
        <s-input v-else :disabled="flag" v-model="groupForm.parentUuid"></s-input>
      </s-form-item>
      <s-form-item v-if="showFirstLevelGroups" label="二级分组">
        <s-input v-model="groupForm.groupName" :minlenght="2" :maxlength="30"></s-input>
      </s-form-item>
      <s-form-item label="备注" prop="descption">
        <s-input type="textarea" v-model="groupForm.descption" :minlenght="2" :maxlength="256"></s-input>
      </s-form-item>
    </s-form>
    <s-row style="text-align: right;">
      <s-button @click="saveDivideGroup">确定</s-button>
      <s-button type="cancel" @click="cancelDivideGroup">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data() {
      return {
        firstLevelGroups: [],
        flag: false,
        addFlag: false,
        groupForm: {
          parentUuid: '',
          groupName: '',
          descption: '',
          status: ''
        },
        groupFormRules: {
          parentUuid: [{required: true, message: '不能为空', trigger: 'blur'},
            {min: 1, max: 100, message: '长度为1 - 100个字符', trigger: 'blur'}],
          groupName: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            min: 2, max: 30, message: '长度为2 - 30个字符', trigger: 'blur'
          }],
          descption: [{min: 2, max: 256, message: '长度为2 - 256个字符', trigger: 'blur'}]
        }
      }
    },
    props: {
      type: {
        type: String,
        required: true
      },
      currentNodeData: {
        type: Object,
        required: true
      }
    },
    computed: {
      showFirstLevelGroups() {
        return this.type === 'add'
          ? !(this.currentNodeData.parent === 'TOP')
          : !!(this.currentNodeData.parent)
      }
    },
    methods: {
      // 获取一级分组
      getFirstLevelGroup() {
        return new Promise((resolve, reject) => {
          $axios.get('/autoMateItcomp/getFirstGroup').then(({data}) => {
            if (data && data instanceof Array) {
              this.firstLevelGroups = data;
              resolve();
            } else {
              reject();
            }
          })
        })
      },
      // 保存
      saveDivideGroup() {
        this.$refs.groupForm.validate(valid => {
          if (valid) {
            let option = this.type === 'add'
              ? {url: '/autoMateItcomp/addGroup', type: '新增'}
              : {url: '/autoMateItcomp/editGroupInfo', type: '编辑'};
              if (this.type === 'add' && this.currentNodeData.parent === 'TOP') {
                this.groupForm.groupName = this.groupForm.parentUuid
                this.groupForm.parentUuid = ''
              }
              if (this.type === 'edit' && this.currentNodeData.parent === '') {
                this.groupForm.groupName = this.groupForm.parentUuid
                this.groupForm.parentUuid = ''
              }
            let obj = {
                data: [this.groupForm],
                logTemplate: this.type === 'add' ? '添加|分组(#groupName#)' : '编辑|分组(#groupName#)'
              }
              $axios.post(option.url, this.groupForm, obj).then(({data}) => {
                if (data.state) {
                  this.$message.success(`${option.type}成功！`);
                  this.$emit('success', this.type);
                } else {
                  this.$message.error(`${option.type}失败，${data.errormsg}！`);
                }
              })
          } else {
            return false
          }
        })
      },
      // 取消/关闭
      cancelDivideGroup() {
        this.$emit('cancel');
      }
    },
    created() {
      if (this.currentNodeData.parent === 'TOP' || (this.type === 'edit' && this.currentNodeData.parent === '')) {
        this.addFlag = true
      }
      if (this.type === 'edit' && this.currentNodeData.parent !== '') {
        this.flag = true
      }
      this.getFirstLevelGroup().then(() => {
        // 添加（只可添加一级/二级分组）
        if (this.type === 'add') {
          if (!this.currentNodeData.parent) {
            this.groupForm.parentUuid = this.currentNodeData.node.uuid;
          } else if (this.currentNodeData.parent === 'TOP') {
            // this.$delete(this.groupFormRules, 'parentUuid');
            this.groupForm.parentUuid = '';
            this.$nextTick(() => {
              this.$refs.groupForm.resetFields();
            })
          }
        } else { // 编辑
          // 编辑一级分组
          if (!this.currentNodeData.parent) {
            // this.$delete(this.groupFormRules, 'parentUuid');
            this.groupForm.parentUuid = this.currentNodeData.node.groupName;
          } else {
            // 编辑二级分组
            this.groupForm.parentUuid = this.currentNodeData.parent;
          }
          this.groupForm.uuid = this.currentNodeData.node.uuid;
          this.groupForm.groupName = this.currentNodeData.node.groupName;
          this.groupForm.descption = this.currentNodeData.node.descption;
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
