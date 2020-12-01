<template>
  <section>
    <s-row class="title">
      <i class="iconfont icon-approve"></i>
      <span>自动识别</span>
    </s-row>
    <s-form ref="autoCheckOidFrom" :model="autoCheckOidFrom" :rules="autoCheckOidFromRules" label-width="120px">
      <s-form-item label="资产IP:" prop="ip">
        <s-input @keyup.enter.native="checkOid" v-model="autoCheckOidFrom.ip"></s-input>
      </s-form-item>
    </s-form>
    <s-row class="footerRow">
      <s-button type="cancel" @click="cancelCheckOid">取消</s-button>
      <s-button @click="checkOid">识别</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import {Validaters} from 'sunflower-common-utils'

  export default{
    data() {
      return {
        autoCheckOidFrom: {
          ip: ''
        },
        autoCheckOidFromRules: {
          ip: [
            {required: true, message: '不能为空', trigger: 'blur'},
            Validaters.IP
          ]
        }
      }
    },
    methods: {
      checkOid() {
        this.$refs['autoCheckOidFrom'].validate((valid) => {
          if (valid) {
            let messageVm = this.$message({
              type: 'info',
              duration: 0,
              showClose: true,
              message: '识别中，请稍候...'
            })
            $axios.post('/systemmanager/mibtool/autoIdentifyOid', {'ip': this.autoCheckOidFrom.ip}).then((res) => {
              let resData = res.data
              if (typeof (resData) === 'string' && resData !== '') {
                Bus.$emit('autoCheckOidOver', resData)
                messageVm.close()
                this.$message({
                  type: 'success',
                  message: '识别成功！'
                })
              } else {
                messageVm.close()
                this.$message({
                  type: 'error',
                  message: '识别失败，请重试！'
                })
              }
            })
          }
        })
      },
      cancelCheckOid() {
        Bus.$emit('autoCheckOidOver')
      }
    }
  }
</script>

