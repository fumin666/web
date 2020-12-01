<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:42
 * @LastEditTime: 2019-09-25 13:39:15
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section id="PwdPolicySet">
    <s-form ref="pwdPolicyForm" :model="pwdPolicyForm" :rules="pwdPolicyFormRules" label-width="25%">
      <s-alert :title="`${levelTip.txt}安全等级，符合等保${levelTip.levelNum}级要求`"  type="info" :closable="false"></s-alert>
      <div class="titleTip"></div>
      <s-row class="title">
        <i class="iconfont icon-set"></i>
        <span>口令策略设置</span>
      </s-row>
      <s-form-item label="口令最小长度：" prop="passwdLenth">
        <s-col span="10">
          <s-select v-model.number="pwdPolicyForm.passwdLenth">
            <s-option label="6" :value="6"></s-option>
            <s-option label="7" :value="7"></s-option>
            <s-option label="8" :value="8"></s-option>
            <s-option label="9" :value="9"></s-option>
            <s-option label="10" :value="10"></s-option>
            <s-option label="11" :value="11"></s-option>
            <s-option label="12" :value="12"></s-option>
            <s-option label="13" :value="13"></s-option>
            <s-option label="14" :value="14"></s-option>
            <s-option label="15" :value="15"></s-option>
            <s-option label="16" :value="16"></s-option>
            <s-option label="17" :value="17"></s-option>
            <s-option label="18" :value="18"></s-option>
            <s-option label="19" :value="19"></s-option>
            <s-option label="20" :value="20"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <s-form-item label="口令复杂度：">
        <s-checkbox label="必须包含数字" :true-label="1" :false-label="0"
                    v-model.number="pwdPolicyForm.passwdD"></s-checkbox>
        <s-checkbox label="必须包含小写字母" :true-label="1" :false-label="0"
                    v-model.number="pwdPolicyForm.passwdL"></s-checkbox>
        <s-checkbox label="必须包含大写字母" :true-label="1" :false-label="0"
                    v-model.number="pwdPolicyForm.passwdU"></s-checkbox>
        <s-checkbox label="必须包含特殊字符" :true-label="1" :false-label="0"
                    v-model.number="pwdPolicyForm.passwdS"></s-checkbox>
      </s-form-item>
      <s-form-item label="认证失败最大次数：" prop="passwdFailCnt">
        <s-col span="10">
          <s-select v-model.number="pwdPolicyForm.passwdFailCnt">
            <s-option label="3" :value="3"></s-option>
            <s-option label="4" :value="4"></s-option>
            <s-option label="5" :value="5"></s-option>
            <s-option label="无限制" :value="0"></s-option>
          </s-select>
        </s-col>
      </s-form-item>

      <s-row class="title">
        <i class="iconfont icon-set"></i>
        <span>页面超时设置</span>
      </s-row>
      <s-form-item label="页面超时(分钟)：" width='200px' prop="pageTimeout" tip="请输入大于0小于等于1440的正整数或无限制">
        <s-input v-model="pwdPolicyForm.pageTimeout"></s-input>
      </s-form-item>
    </s-form>
    <s-row type="flex" style="margin-left: 25%;">
      <s-button class="rightBtn" @click="savePwdPolicyForm">保存</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { intersectObj } from 'sunflower-common-utils';

  export default{
    data() {
      // let checkPageTimeout = function (rule, value, callback) {
      //   if (value === '' || value === null) {
      //     callback(new Error('不能为空'))
      //   } else {
      //     if (value === '无限制') {
      //       callback()
      //     } else {
      //       if (value <= 0 || value > 1440) callback(new Error('请输入大于0小于1440的正整数或无限制'))
      //       else {
      //         let reg = /^\+?[1-9]\d*$/
      //         if (reg.test(value)) callback()
      //         else callback(new Error('请输入大于0小于1440的正整数或无限制'))
      //       }
      //     }
      //   }
      // };
      return {
        lowLevel: {},       // 低安全等级默认数据
        middleLevel: {},    // 中安全等级默认数据
        upperLevel: {},     // 高安全等级默认数据
        // 密码策略表单
        pwdPolicyForm: {
          passwdLenth: '',
          passwdD: '',
          passwdL: '',
          passwdU: '',
          passwdS: '',
          passwdFailCnt: '',
          pageTimeout: '',
          uuid: ''
        },
        // 密码策略表单验证
        pwdPolicyFormRules: {
          passwdLenth: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
          passwdFailCnt: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
          pageTimeout: [
            {required: true, message: '不能为空', trigger: 'blur'}]
        },
        pageTimeoutOrigin: {}     // 已配置页面超时数据/默认值
      }
    },
    props: {
      level: String,
      default: 'middle'
    },
    computed: {
      levelTip() {
        switch (this.level) {
          case 'low': return {txt: '低', levelNum: 2}
          case 'middle': return {txt: '中', levelNum: 3}
          case 'upper': return {txt: '高', levelNum: 4}
          default: return {txt: '低', levelNum: 2}
        }
      }
    },
    watch: {
      level(newVal) {
        if (newVal) {
          // level改变(左侧simple-menu切换)，重新舒适化右侧表单
          this.pwdPolicyForm = intersectObj(this.pwdPolicyForm, this[`${newVal}Level`]);    // 密码策略
          let mapping = {'low': '0', 'middle': '1', 'upper': '2'};  // 映射
          this.$set(this.pwdPolicyForm, 'pageTimeout', this.pageTimeoutOrigin[mapping[newVal]]);    // 页面超时
        }
      }
    },
    methods: {
      // 初始化密码策略表单数据
      initPwdFormData() {
        $axios.get('/systemmanager/sysPasswdRule/listBySecurityLevel').then(({data}) => {
          if (data && data instanceof Object) {
            this.lowLevel = data[0];
            this.middleLevel = data[1];
            this.upperLevel = data[2];
            // 进入页面，密码策略表单初始化赋值(中安全等级)
            this.pwdPolicyForm = intersectObj(this.pwdPolicyForm, this[`${this.level}Level`]);
            this.initPageTimeoutData();   // 获取页面超时时间
          }
        })
      },
      // 初始化页面超时数据
      initPageTimeoutData() {
        $axios.get('/systemmanager/sysConfig/getSessionTimeOut').then(({data}) => {
          if (data && data instanceof Object) {
            this.pageTimeoutOrigin = data;
          console.log(this.pageTimeoutOrigin)
            let mapping = {'low': '0', 'middle': '1', 'upper': '2'};  // 映射
            // 进入页面，页面超时表单初始化赋值(中安全等级)
            this.$set(this.pwdPolicyForm, 'pageTimeout', data[mapping[this.level]]);
          }
        })
      },
      // 保存"密码策略"及"页面超时"
      savePwdPolicyForm() {
        let vm = this;
        vm.$refs['pwdPolicyForm'].validate(valid => {
          if (valid) {
            let reg = /^([1-9]\d*|[0]{1,1})$/;
            if (vm.pwdPolicyForm.pageTimeout === '无限制') {

            } else if (!reg.test(vm.pwdPolicyForm.pageTimeout) || vm.pwdPolicyForm.pageTimeout < 1 || vm.pwdPolicyForm.pageTimeout > 1440) {
              vm.$message.warning('请输入大于0小于等于1440的正整数或无限制');
              return;
            }
            let mapping = {'low': '0', 'middle': '1', 'upper': '2'};  // 映射
            // 保存"密码策略"
            let sendData = {};
            let temp = Object.assign({}, vm.pwdPolicyForm);
            delete temp.pageTimeout;
            sendData[mapping[this.level]] = temp;
            $axios.post('/systemmanager/sysPasswdRule/saveSysPwdRuleADSessionTODoubleCTO', sendData, {
              data: [],
              logTemplate: '设置|密码策略配置'
            }).then(({data}) => {
              if (data === 'success') {
                // 保存"页面超时"
                let timeout = {};
                if (vm.pwdPolicyForm.pageTimeout === '无限制') {
                  timeout[mapping[vm.level]] = vm.pwdPolicyForm.pageTimeout;
                } else {
                  if (isNaN(vm.pwdPolicyForm.pageTimeout)) {
                    vm.$message.warning('请输入大于0小于等于1440的正整数或无限制');
                    return;
                  } else {
                    timeout[mapping[vm.level]] = parseInt(vm.pwdPolicyForm.pageTimeout);
                  }
                }
                $axios.post('/systemmanager/sysConfig/saveSessionTimeOut', timeout).then(({data}) => {
                  if (data === 'success') {
                    vm.$message.success('保存成功！');
                    vm.initPwdFormData();
                  } else {
                    vm.$message.error('保存失败，请重试！');
                  }
                });
              } else {
                vm.$message.error('保存失败，请重试！');
              }
            })
          } else {
            return false
          }
        })
      }
    },
    created() {
      this.initPwdFormData();       // "口令策略"初始化
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #PwdPolicySet
    .titleTip
      font-size 15px
      font-weight bold
</style>
