<template>
  <section>
    <s-row class="title">
      <i class="iconfont icon-approve"></i>
      <span>模板检测</span>
    </s-row>
    <s-form
      ref="templateCheckForm"
      :model="templateCheckForm"
      :rules="templateCheckFormRules"
      label-width="100px">
      <s-row>
        <s-col span="18">
          <s-form-item label="资产IP:" prop="ip">
            <s-input v-model="templateCheckForm.ip"></s-input>
          </s-form-item>
        </s-col>
        <s-col span="6" class="autoCheck">
          <s-button @click="templateDistinguish">模板检测</s-button>
        </s-col>
      </s-row>
    </s-form>

    <s-row>
      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span> 监控项</span>
      </s-row>
      <s-row class="checkResult">
        {{resultStr}}
      </s-row>
    </s-row>

    <s-row class="footerRow">
      <s-button @click="closeDistinguishDialog">取消</s-button>
    </s-row>

  </section>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'

  export default{
    data () {
      return {
        templateCheckForm: {
          ip: '',
          templateUuid: ''
        },
        resultStr: '',
        templateCheckFormRules: {
          ip: [
            Validaters.IP,
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    props: {
      templateUuid: {
        type: String,
        default: ''
      }
    },
    methods: {
      templateDistinguish() {
        this.$refs['templateCheckForm'].validate((valid) => {
          if (valid) {
            let ipStr = this.templateCheckForm.ip
            let templateUuid = this.templateCheckForm.templateUuid
            $axios.get(`/systemmanager/mibtool/getTemplateData/${ipStr}/${templateUuid}`).then((res) => {
              let resData = res.data
              if (resData.length !== 0) {
                this.resultStr = '检测到的监控项有：'
                resData.forEach((item) => {
                  this.resultStr += `${item}、`
                })
                this.resultStr = this.resultStr.substring(0, this.resultStr.length - 1)
              } else {
                this.resultStr = '当前模板没有扫描到监控项，请检查模板是否选择正确、资产是否开启SNMP协议'
              }
            })
          }
        })
      },
      closeDistinguishDialog() {
        Bus.$emit('closeAutoDistinguishTemplate')
      }
    },
    mounted() {
      this.templateCheckForm.templateUuid = this.templateUuid
    }
  }
</script>
