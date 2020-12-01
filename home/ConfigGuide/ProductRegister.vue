<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-产品注册
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div>
    <ProductRegisterIng ref="reference" v-if="!register&&flag"></ProductRegisterIng>
    <ProductRegisterInfo ref="reference" v-if="register&&flag" :registerData="registerData"></ProductRegisterInfo>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import ProductRegisterIng from './ProductRegisterIng'
  import ProductRegisterInfo from './ProductRegisterInfo'
  export default {
    components: {
      ProductRegisterInfo,
      ProductRegisterIng
    },
    data() {
      return {
        flag: false,
        register: false,
        registerData: {}
      }
    },
    created() {
      this.isRegister();
    },
    computed: {
    },
    methods: {
      isRegister() {
        $axios.get('/systemmanager/systemsetting/getLicenseInfo').then(res => {
          this.flag = true;
          if (res.data && res.data.regStatus === '已激活') {
            this.register = true;
            this.registerData = res.data;
          } else {
            this.register = false;
          }
        })
      },
      submitForm() {
        this.$refs.reference.submitForm();
      }
    }
  }
</script>

<style lang="stylus">
</style>
