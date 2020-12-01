<template>
  <section id="certificateManagement">
    <s-row class="title">
      <i class="iconfont icon-approve"></i>
      <span>WEB证书管理</span>
    </s-row>
    <s-row>
      <s-col :span="6" style=" width:120px; padding-left:10px;">证书下载：</s-col>
      <s-col :span="18">
        <span style="color:#2db0fb;">sicap.zip</span>
        <s-button style="margin-left:15px;" @click="downloadCer">下载</s-button>
      </s-col>
    </s-row>

    <s-row class="title">
      <i class="iconfont icon-approve"></i>
      <span>CA证书管理</span>
    </s-row>
    <s-form
      ref="certificateForm"
      :model="certificateForm"
      :rules="certificateFormRules"
      label-width="120px">
      <s-form-item label="证书操作：">
        <s-select v-model="certificateForm.caCertModel">
          <s-option label="三方证书认证" :value="1"></s-option>
          <s-option label="签发证书" :value="2"></s-option>
        </s-select>
      </s-form-item>

      <div v-show="certificateForm.caCertModel===1">
        <s-form-item label="证书上传：">
          <s-button @click="uploadCertificate">点击上传</s-button>
          <span style="color:#2db0fb; margin-left:15px;">将所有证书打包为一个zip格式上传</span>
          <div>
            <span style="color:#778da0;">证书文件格式包括：.cer、.crt、.der</span>
          </div>
        </s-form-item>
      </div>

      <div v-if="certificateForm.caCertModel===2">
        <s-form-item label="国家（C）：" prop="caCertC">
          <s-input v-model="certificateForm.caCertC" placeholder="例如：CN，最大长度2个字符" :minlength="2" :maxlength="2"></s-input>
        </s-form-item>
        <s-form-item label="省份（S）：" prop="caCertS">
          <s-input v-model="certificateForm.caCertS" placeholder="例如：SX"></s-input>
        </s-form-item>
        <s-form-item label="城市（L）：" prop="caCertL">
          <s-input v-model="certificateForm.caCertL" placeholder="例如：XA"></s-input>
        </s-form-item>
        <s-form-item label="单位（O）：" prop="caCertO">
          <s-input v-model="certificateForm.caCertO" placeholder="例如：unit"></s-input>
        </s-form-item>
        <s-form-item label="组织机构（OU）：" prop="caCertOu">
          <s-input v-model="certificateForm.caCertOu" placeholder="例如：department"></s-input>
        </s-form-item>
        <s-form-item label="有效期：" prop="caCertDays">
          <s-input v-model="certificateForm.caCertDays" placeholder="请输入有效期（数字）" style="float:left; width:450px; margin-right: 10px;"></s-input>天
        </s-form-item>
      </div>

      <s-row class="footerRow">
        <s-button @click="saveForm">保存</s-button>
      </s-row>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import { Download, Validaters } from 'sunflower-common-utils'
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      let checkCountry = (rule, value, callback) => {
        if (value !== '' && value !== null) {
          if (value.length !== 2) {
            callback(new Error('长度须为2个字符'))
          } else {
            callback()
          }
        } else {
          callback(new Error('不能为空'))
        }
      };
      let checkDate = (rule, value, callback) => {
        if (value !== '') {
          let reg = /^\+?[1-9]\d*$/
          if (reg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入大于0的正整数'))
          }
        } else {
          callback()
        }
      };
      return {
        certificateForm: {
          caCertC: '',
          caCertS: '',
          caCertL: '',
          caCertO: '',
          caCertOu: '',
          caCertDays: '',
          caCertComment: null,
          caCertModel: 1,
          fileName: ''
        },
        certificateFormRules: {
          caCertC: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            validator: checkCountry, trigger: 'blur'
          }],
          caCertS: [{required: true, message: '不能为空', trigger: 'blur'}],
          caCertL: [{required: true, message: '不能为空', trigger: 'blur'}],
          caCertO: [{required: true, message: '不能为空', trigger: 'blur'}],
          caCertOu: [{required: true, message: '不能为空', trigger: 'blur'}],
          caCertDays: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            validator: checkDate, trigger: 'blur'
          }, Validaters.Max(10)]
        }
      }
    },
    methods: {
      downloadCer() {
        Download('webcert/downloadCert', {
          logTemplate: '下载|登录认证配置>证书管理>WEB证书'
        })
      },
      uploadCertificate() {
        this.$emit('openUploadCerDialog')
      },
      saveForm() {
        let vm = this
        if (vm.certificateForm.caCertModel === 1) {
          vm.savePost(vm.certificateForm)
        } else {
          vm.$refs['certificateForm'].validate(valid => {
            if (valid) {
              vm.savePost(vm.certificateForm)
            } else {
              return false
            }
          })
        }
      },
      // 证书管理->保存证书设置
      savePost(postData) {
        let vm = this
        $axios.post('/webcert/saveConf', postData, {
          data: [],
          logTemplate: '设置|登录认证配置>证书管理>CA证书'
        }).then(res => {
          let resData = res.data
          if (resData) {
            vm.$message({
              type: 'success',
              message: '保存成功！'
            })
          } else {
            vm.$message({
              type: 'error',
              message: '保存失败，请重试！'
            })
          }
        })
      }
    },
    created() {
    },
    mounted() {
      // 证书上传弹框关闭，获取文件名
      Bus.$on('closeUploadCerDialog', (val) => {
        this.certificateForm.fileName = val
      })
      $axios.get('/webcert/getConf').then(({data}) => {
        if (data) {
          this.certificateForm = Object.assign({}, this.certificateForm, data)
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #certificateManagement
    .footerRow
      text-align right
</style>
