<template>
  <section>
    <s-row class="title">
      <i class="iconfont icon-approve"></i>
      <span>自动识别</span>
    </s-row>
    <s-form
      ref="distingushManufactForm"
      :model="distingushManufactForm"
      :rules="distingushManufactRules"
      label-width="120px">
      <s-row>
        <s-col span="20">
          <s-form-item label="资产IP:" prop="ip">
            <s-input v-model="distingushManufactForm.ip"></s-input>
          </s-form-item>
        </s-col>
      </s-row>

      <s-row>
        <s-col span="20">
          <s-form-item label="企业OID:" prop="oid" tip="最大长度为100个字符">
            <s-input v-model="distingushManufactForm.oid" :maxlength="100"></s-input>
          </s-form-item>
        </s-col>
        <s-col span="4" class="autoCheck">
          <s-button @click="autoCheckOid">自动识别OID</s-button>
        </s-col>
      </s-row>

      <s-row>
        <s-col span="20">
          <s-form-item label="厂商(中文名):" prop="chinese" tip="最大长度为20个字符">
            <s-input v-model="distingushManufactForm.chinese" :maxlength="20"></s-input>
          </s-form-item>
        </s-col>
        <s-col span="4" class="autoCheck">
          <s-button @click="autoCheckManufact">自动识别厂商</s-button>
        </s-col>
      </s-row>

      <s-row>
        <s-col span="20">
          <s-form-item label="厂商(英文名):" prop="english">
            <s-input v-model="distingushManufactForm.english" :maxlength="20" placeholder="最大长度为20个字符"></s-input>
          </s-form-item>
        </s-col>
      </s-row>
    </s-form>
    <s-row class="footerRow">
      <s-button type="cancel" @click="cancelDistingushManufactForm">取消</s-button>
      <s-button @click="confirmDistingushManufactForm">保存</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import {Validaters} from 'sunflower-common-utils';

  export default{
    data() {
      return {
        distingushManufactForm: {
          ip: '',
          oid: '',
          chinese: '',
          english: ''
        },
        distingushManufactRules: {
          ip: [
            {required: true, message: '不能为空', trigger: 'blur'},
            Validaters.IP
          ],
          oid: [{
            required: true, message: '不能为空', trigger: 'change'
          }, {
            max: 100, message: '最大长度为100个字符', trigger: 'change'
          }, {
            pattern: /^(\d+\.)+\d+$/, message: '格式不正确', trigger: 'change'
          }],
          chinese: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          english: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      autoCheckOid() {
        let ip = this.distingushManufactForm.ip
        if (!ip) {
          this.$message({
            type: 'warning',
            message: '请输入资产IP'
          })
        } else {
          let regIpv4 = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/g;
          let regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
          if (!regIpv4.test(ip) && !regIpv6.test(ip)) {
            this.$message({
              type: 'warning',
              message: '请输入合法的资产IP'
            })
          } else {
            this.distingushManufactForm.oid = ''
            let messageVm = this.$message({
              type: 'info',
              showClose: true,
              duration: 0,
              message: '识别中，请稍候...'
            })
            $axios.post('/systemmanager/mibtool/autoIdentifyOid/', {'ip': ip}).then((res) => {
              let resData = res.data
              if (typeof (resData) === 'string' && resData !== '') {
                this.distingushManufactForm.oid = resData
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
            }).catch(() => {
              messageVm.close()
              this.$message({
                type: 'error',
                message: '识别失败，请重试！'
              })
            })
          }
        }
      },
      autoCheckManufact() {
        let oid = this.distingushManufactForm.oid
        if (!oid) {
          this.$message({
            type: 'warning',
            message: '请输入/识别企业OID'
          })
        } else {
          this.distingushManufactForm.chinese = ''
          this.distingushManufactForm.english = ''
          let messageVm = this.$message({
            type: 'info',
            duration: 0,
            showClose: true,
            message: '识别中，请稍候...'
          })
          $axios.post('/systemmanager/mibtool/autoIdentifyManufact/', {'oid': oid}).then((res) => {
            let resData = res.data
            if (resData.length !== 0) {
              this.distingushManufactForm.chinese = resData[1]
              this.distingushManufactForm.english = resData[0]
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
          }).catch(() => {
            messageVm.close()
            this.$message({
              type: 'error',
              message: '识别失败，请重试！'
            })
          })
        }
      },
      confirmDistingushManufactForm() {
        this.$refs['distingushManufactForm'].validate((valid) => {
          if (valid) {
            Bus.$emit('confirmDistingushManufact', this.distingushManufactForm)
          }
        })
      },
      cancelDistingushManufactForm() {
        Bus.$emit('confirmDistingushManufact')
      }
    }
  }
</script>

