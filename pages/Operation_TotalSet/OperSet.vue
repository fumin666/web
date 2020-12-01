<!--
 * @Author: songyf
 * @Date: 2019-11-25
 * @LastEditors: songyf
 * @Description: 运维中心-参数配置-运维设置.
 -->
<template>
  <section id="sys-oper-set">
    <div>
      <div>
        <s-row>
          <s-col>
            <div class="title oper-suppage-title">
              <i class="iconfont icon-tag"></i>
              运维端口设置
            </div>
          </s-col>
          <s-col>
            <s-form ref="portforms" :model="portform" :rules="rules" label-width="150px">
              <s-form-item label="起始端口:" prop="minPort">
                <s-col span="20" >
                  <s-input v-model="portform.minPort"></s-input>
                </s-col>
              </s-form-item>
              <s-form-item label="终止端口:" prop="maxPort">
                <s-col span="20" >
                  <s-input v-model="portform.maxPort"></s-input>
                </s-col>
              </s-form-item>
              <s-form-item>
                <s-button @click="submitPortSet">保存</s-button>
              </s-form-item>
            </s-form>
          </s-col>
        </s-row>
      </div>
      <div>
        <s-row>
          <s-col>
            <div class="title oper-suppage-title">
              <i class="iconfont icon-tag"></i>
              复核超时设置
            </div>
          </s-col>
          <s-col>
            <s-form ref="tab3Form3" :model="tab3Form3" :rules="tab3Rule3" label-width="150px">
              <s-form-item label="复核超时(0-120秒)" prop="timeout">
                <s-col span="20">
                  <s-input v-model="tab3Form3.timeout" min="0" max="120"></s-input>
                </s-col>
              </s-form-item>
              <s-form-item>
                <s-button @click="saveDoubleCoopTimeout">保存</s-button>
              </s-form-item>
            </s-form>
          </s-col>
        </s-row>
      </div>
      <div>
        <s-col>
          <div class="title oper-suppage-title">
            <i class="iconfont icon-tag"></i>
            批量执行设置
          </div>
        </s-col>
        <s-col>
          <s-form :model="setMidManForm" label-width="150px">
            <s-form-item>
              <s-checkbox-group v-model="setMidManForm.approverUuid">
                <s-checkbox v-for="item in approvers" :key="item.approveAuthId" :label="item.uuid">{{item.approveAuthName}}</s-checkbox>
              </s-checkbox-group>
            </s-form-item>
            <s-form-item>
              <s-button @click="saveMidMan">保存</s-button>
            </s-form-item>
          </s-form>
        </s-col>
      </div>
    </div>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {intersectObj} from 'sunflower-common-utils'
  import _ from 'lodash';
  export default {
    data() {
      let validateMin = (rule, value, callback) => {
        if (value > 39999 || value < 30000) {
          callback(new Error('请输入介于30000到39999之间的整数值,包含边界值'));
        } else {
          callback()
        }
      }
      let validateMax = (rule, value, callback) => {
        if (value > 40000 || value < 30001) {
          callback(new Error('请输入介于30001到40000之间的整数值,包含边界值'));
        } else if (this.portform.minPort > value) {
          callback(new Error('起始端口要小于终止端口'))
        } else {
          callback()
        }
      }
      let checkOperaTimeout = function (rule, value, callback) {
        if (value === '' || value === null) {
          callback(new Error('不能为空'))
        } else {
          if (value < 0 || value > 120) callback(new Error('请输入0~120之间的正整数'))
          else {
            let reg = /^\+?[1-9]\d*$/
            if (reg.test(value)) callback()
            else callback(new Error('请输入0~120之间的正整数'))
          }
        }
      }
      return {
        setMidManForm: {
          approverUuid: []
        },
        portform: {
          minPort: '',
          maxPort: ''
        },
        tab3Form3: {
          timeout: '',
          uuid: ''
        },
        approvers: {},
        tab3Rule3: {
          timeout: [{
            required: true, message: '不能为空', trigger: 'blur'}, {
            validator: checkOperaTimeout, trigger: 'blur'
          }]
        },
        rules: {
          maxPort: [
            { pattern: /^[0-9]+$/, message: '请输入数字', trigger: 'blur' },
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateMax, trigger: 'blur' }
          ],
          minPort: [
            { pattern: /^[0-9]+$/, message: '请输入数字', trigger: 'blur' },
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: validateMin, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitPortSet() {
        this.$refs['portforms'].validate(valid => {
          if (!valid) return;
          $axios.post('/operationSettings/saveOperatePortInfo', this.portform, {
            logTemplate: '编辑|运维设置>运维端口设置'
          }).then((res) => {
            if (res.data === true) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              this.getPostSet();
            } else {
              this.$message({
                type: 'error',
                message: '保存失败，请重试！'
              })
            }
          })
        })
      },
      // 保存"复核超时设置"
      saveDoubleCoopTimeout() {
        this.$refs['tab3Form3'].validate((valid) => {
          if (valid) {
            $axios.post('sysTimeout/saveDoubleCoopTimeout', this.tab3Form3, {
              data: [],
              logTemplate: '编辑|运维设置>复核超时设置'
            }).then((res) => {
              let resData = res.data
              if (resData === 'success') {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.initTimeOutForm()
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
              }
            })
          }
        })
      },
      saveMidMan() {
        if (_.isEmpty(this.setMidManForm.approverUuid)) {
          this.$message({
            message: '请至少勾选一个',
            type: 'error'
          });
          return false
        }
        $axios.post('/operationSettings/updateBatchExeMidAuth', this.setMidManForm.approverUuid, {
          logTemplate: '编辑|运维设置>批量执行设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        })
      },
      getPostSet() {
        $axios.post('/operationSettings/operatePortInfo', this.portform).then((res) => {
          this.portform = intersectObj(this.portform, res.data)
          this.portform.minPort = this.portform.minPort.toString()
          this.portform.maxPort = this.portform.maxPort.toString()
        })
      },
      // 获取"复核超时设置"数据
      initTimeOutForm() {
        $axios.get('/sysTimeout/getSysTimeout').then((res) => {
          let data = res.data
          if (data.doubleTimeoutMap !== null) {
            this.tab3Form3.timeout = data.doubleTimeoutMap.timeout.toString()
            this.tab3Form3.uuid = data.doubleTimeoutMap.uuid
          }
        })
      },
      getApprovers() {
        let that = this
        $axios.get('/operationSettings/getBatchExeMidAuth').then(response => {
          that.approvers = response.data;
          for (let i of that.approvers) {
            if (i.status === 1) {
              that.setMidManForm.approverUuid.push(i.uuid)
            }
          }
        })
      }
    },
    created() {
      this.getPostSet();
      this.initTimeOutForm();
      this.getApprovers();
    }
  }
</script>
<style lang="stylus">
  #sys-oper-set
    .title
      margin-bottom 15px
    .setDataPage
      .s-input-number
        display block
</style>
