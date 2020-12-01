<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-产品注册
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div class="product_register">
    <p class="font_color word">{{ wordStr }}</p>
    <s-scrollbar wrap-style="max-height:320px;padding-right:10px;">
      <s-form :rules="rules" ref="productRegister" label-width="110px" :model="map">
        <s-form-item class="indent" label="请求码：" prop="requestCode">
          <s-input v-model="map.requestCode" :disabled="true" type="textarea" :rows="2" resize="none"></s-input>
        </s-form-item>
        <s-form-item label="序列号：" prop="serialNumber">
          <s-input v-model="map.serialNumber" placeholder="根据注册系统实际值填写"></s-input>
        </s-form-item>
        <s-form-item label="激活码：" prop="activationCode">
          <s-input v-model="map.activationCode" type="textarea" placeholder="根据注册系统实际值填写"></s-input>
        </s-form-item>
        <s-form-item label="客户名称：" prop="customerName">
          <s-input v-model="map.customerName" placeholder="根据注册系统实际值填写"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { Validaters, getConfig } from 'sunflower-common-utils';
  import {debounce} from 'lodash'

  export default {
    data() {
      return {
        map: {
          requestCode: '',
          serialNumber: '',
          activationCode: '',
          customerName: ''
        },
        wordStr: '您是第一次使用' + getConfig('systemKeyword') + '平台，您必须注册才能使用',
        rules: {
          serialNumber: [
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
          activationCode: [
            {required: true, message: '请输入激活码', trigger: 'blur'},
            {
              pattern: /^([\dA-Z]{5}-){49}[\dA-Z]{5}$/,
              message: '请填写正确格式的序列号(5个字母数字组合一组,共50组，中间用\' - \'隔开)',
              trigger: 'blur'
            }
          ],
          customerName: [
            {required: true, message: '请输入客户名称', trigger: 'blur'},
            Validaters.Max(30)
          ]
        }
      }
    },
    created() {
      this.getCode();
    },
    computed: {
      activeStep: {
        get() {
          return this.$store.state.configGuide.activeStep;
        },
        set(val) {
          this.$store.commit('configGuide/SET_ACTIVESTEP', val);
        }
      },
      step2: {
        get() {
          return this.$store.state.configGuide.step2;
        },
        set(val) {
          this.$store.commit('configGuide/SET_STEP2', val);
        }
      }
    },
    methods: {
      getCode() {
        $axios.get('systemmanager/systemsetting/getRequestCode').then((res) => {
          if (res.status === 200) {
            this.map.requestCode = res.data;
          }
        })
      },
      submitForm: debounce(function() {
        this.$refs['productRegister'].validate((valid) => {
          if (valid) {
            $axios.post('/firstUsageWizard/registerProduct', this.map).then((res) => {
              if (res.data.state) {
                this.$alert('产品注册激活成功', '', {
                  customClass: 'product_register_alert',
                  confirmButtonText: '确定',
                  type: 'success',
                  callback: action => {
                    this.step2 = this.map;
                    this.activeStep++;
                  }
                });
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.errormsg
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
          }
        });
      }, 100)
    }
  }
</script>

<style lang="stylus">
.product_register{
  .word{
    margin:20px 0 30px 0;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  .indent{
    .s-form-item-label{
      padding-left: 10px;
    }
  }
}
</style>
