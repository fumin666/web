<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-通报类型定义
 -->
<template>
  <section class="design-step2">
    <s-row :gutter="20">
      <s-row class="step-title">通报类型定义</s-row>
      <s-row class="form-ctn">
        <s-form :model="stepForm1" ref="stepForm1" :rules="stepRules" label-width="125px" class="ruleForm">
          <s-form-item label="通报类型名称" prop="bulletinName">
            <s-input v-model="stepForm1.bulletinName"></s-input>
          </s-form-item>
          <s-form-item label="是否需要走流程" prop="needItil">
            <s-radio-group v-model="stepForm1.needItil">
              <s-radio :label="1">是</s-radio>
              <s-radio :label="0">否</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="备注" prop="remark">
            <s-input type="textarea" :rows="6" v-model="stepForm1.remark" placeholder="不能超过120个字符"></s-input>
          </s-form-item>
        </s-form>
      </s-row>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import { intersectObj, Validaters } from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      let checkRepeatName = (rule, value, callback) => {  // 校验重复
        if (value !== this.editTypeName) {
          if (value) {
            $axios.get(`/safetyPlatform/safetyBulletin/checkBulletinName/${value}`).then((res) => {
              if (res.data.state === false) {
                callback(new Error('该名称已经存在！'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
      return {
        bulletinState: null,
        stepForm1: {
          bulletinName: '',
          needItil: 1,
          remark: ''
        },
        stepRules: {
          bulletinName: [
            {required: true, message: '请输入通报类型名称', trigger: 'blur'},
            Validaters.Name,
            {validator: checkRepeatName, trigger: 'blur'},
            Validaters.Max(50)
          ],
          remark: [Validaters.Max(120)]
        },
        editTypeName: ''
      }
    },
    components: {
    },
    computed: {
    },
    props: {
      bulletinUuid: {
        type: String,
        default() {
          return '';
        }
      }
    },
    watch: {
    },
    created() {
      this.bulletinState = this.$store.state.safetyBulletin.editDesigner;
      if (this.bulletinState !== null) { // 如果存在就是编辑
        this.stepForm1 = intersectObj(this.stepForm1, this.bulletinState.safeType)
        this.editTypeName = this.bulletinState.safeType.bulletinName
      }
    },
    methods: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
