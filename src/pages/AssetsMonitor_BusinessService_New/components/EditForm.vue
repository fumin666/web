/*
create by YOU
*/
<template>
  <s-scrollbar wrap-style="height: 320px;" key="scroll0">
  <s-form :model="defaultData" ref="form" :rules="rules" label-width="120px" class="form">
    <s-form-item label="业务服务名称" prop="name">
      <s-input v-model="defaultData.name"></s-input>
    </s-form-item>
    <s-form-item label="关键度" prop="criticality">
      <s-select v-model="defaultData.criticality" placeholder="选择关键程度">
        <s-option v-for="(val, key, index) in config.bsCriticalityConstMap"
                  :label="val" :value="key" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="影响度" prop="effect">
      <s-select v-model="defaultData.effect" placeholder="选择影响度">
        <s-option v-for="(val, key, index) in config.bsEffectConstMap" :label="val"
                  :value="key" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="责任人" prop="maintenance">
      <s-select v-model="defaultData.maintenance" placeholder="选择责任人">
        <s-option v-for="(item, index) in config.sysUserList" :label="item.userRealName"
                  :value="item.uuid" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="监控频率(分钟)" prop="frequency">
      <s-input v-model="defaultData.frequency"></s-input>
    </s-form-item>
    <s-form-item label="描述" prop="decription">
      <s-input type="textarea" v-model="defaultData.decription"></s-input>
    </s-form-item>
  </s-form>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  export default {
    data () {
      let _self = this
      let validatorFrequency = function (rule, value, callback) {
        if (value === null || value.trim().length < 1 || isNaN(Number.parseInt(value))) {
          _self.defaultData.frequency = null
          callback(new Error('请输入大于或等于3的整数'))
        } else if (Number.parseInt(value) < 3) {
          callback(new Error('频率必须大于或等于3分钟'))
        } else {
          _self.defaultData.frequency = Number.parseInt(value) + ''
          callback()
        }
      }
      let validatorCriticality = function (rule, value, callback) {
        if (value === null || value.length < 1) {
          callback(new Error('请选择关键程度'))
        } else {
          callback()
        }
      }
      let validatorEffect = function (rule, value, callback) {
        if (value === null || value.length < 1) {
          callback(new Error('请选择关键程度'))
        } else {
          callback()
        }
      }
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editDefaultName) {
          if (value) {
            $axios.post(`/businessservice/isUniqueBusinessName`, {name: value}).then((res) => {
              let isRepeat = res.data
              if (isRepeat === true) {
                callback(new Error('该名称已经存在'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      }
      return {
        uuid: '',
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\.]{1,30}$/,
              message: '名称不能大于30个字符，只能包含中文、字母、数字、符号[_-.]',
              trigger: 'blur'
            },
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          criticality: [
            {required: true, message: '请输入名称', trigger: 'change'},
            {validator: validatorCriticality, trigger: 'change'}
          ],
          effect: [
            {required: true, message: '请输入名称', trigger: 'change'},
            {validator: validatorEffect, trigger: 'change'}
          ],
          frequency: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validatorFrequency, trigger: 'blur'}
          ]
        },
        config: {},
        defaultData: {
          name: '',
          criticality: '',
          effect: '',
          frequency: '',
          maintenance: '',
          decription: ''
        },
        editDefaultName: ''
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    mounted() {
      if (this.editData !== undefined && this.editData !== null) {
        this.defaultData = intersectObj(this.defaultData, this.editData, true)
        this.editDefaultName = this.defaultData.name
      }
      $axios.get(`/businessservice/getBusinessServiceInfoSelectData`).then((res) => {
        this.config = res.data
      });
    }
  };
</script>
