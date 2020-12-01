<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:40
 * @LastEditTime: 2019-08-30 14:05:34
 * @LastEditors: Please set LastEditors
 -->
/**
* Created by dgunzi on 2019/02/27.
* 产品注册表单
*/
<template>
  <s-form :model="register" :rules="registerRules" ref="registerForm" label-width="120px">
    <s-form-item label="序列号" prop="serailNum">
      <s-input type="text" v-model="register.serailNum"></s-input>
    </s-form-item>
    <s-form-item label="请求码" prop="requestCode">
      <div style="box-sizing: border-box;border: solid 1px #344458; border-radius:4px; height:36px; padding:0 10px;">
        {{ register.requestCode ? register.requestCode : '' }}
      </div>
    </s-form-item>
    <s-form-item label="激活码" prop="activeCode">
      <s-input type="textarea" v-model="register.activeCode"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
    import $axios from 'sunflower-ajax'
    export default {
        name: 'ProductRegistration',
        data() {
            return {
              register: {
                serailNum: '',
                requestCode: '',
                activeCode: ''
              },
              registerRules: {
                serailNum: [
                  {required: true, message: '请输入序列号', trigger: 'blur'},
                  {
                    pattern: /^([\dA-Z]{5}-){4}[\dA-Z]{5}$/,
                    message: '请填写正确格式的序列号(5个字母数字组合一组,共5组，中间用\' - \'隔开)',
                    trigger: 'blur'
                  }
                ],
                requestCode: [
                  {required: true, message: '服务端错误，未获取到请求码', trigger: 'blur'}
                ],
                activeCode: [
                  {required: true, message: '请输入激活码', trigger: 'blur'},
                  {
                    pattern: /^([\dA-Z]{5}-){49}[\dA-Z]{5}$/,
                    message: '请填写正确格式的序列号(5个字母数字组合一组,共50组，中间用\' - \'隔开)',
                    trigger: 'blur'
                  }
                ]
              }
            }
        },
        created() {
          this.initCode();
        },
        methods: {
          initCode() {
            $axios.get('/configcenter/license/getRequestCode').then(({data}) => {
              this.register.requestCode = data
            })
          }
        }
    }
</script>

<style scoped>

</style>
