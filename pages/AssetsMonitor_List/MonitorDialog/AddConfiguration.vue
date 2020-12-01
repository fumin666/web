<template>
  <s-dialog append-to-body :title="title" v-model="dialogFlag" width="600px" :before-close="uploadEdit" class="dbAddDialog">
    <s-form :model="dbForm" :rules="dbRules" ref="dbForm" label-width="120px">
      <s-form-item :label="portData.name === 'http协议' || type === 'http协议'?'URL':'端口'" prop="monitorName">
        <s-input v-model="dbForm.monitorName"></s-input>
      </s-form-item>
      <s-form-item v-if="portData.name === 'http协议' || type === 'http协议'" label="用户名:" prop="httpUser">
        <s-input v-model="dbForm.httpUser"></s-input>
      </s-form-item>
      <s-form-item v-if="portData.name === 'http协议' || type === 'http协议'" label="密码:" prop="httpPass">
        <s-input type='password' v-model="dbForm.httpPass"></s-input>
      </s-form-item>
      <s-form-item>
        <s-button @click="changePort">{{portData.name === 'http协议' || type === 'http协议'?'URL检测':'端口检测'}}</s-button>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData">确定</s-button>
      <s-button type="cancel" @click="uploadEdit">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import { cloneDeep } from 'lodash';

  export default {
    data() {
      return {
        dialogFlag: false,
        dbForm: {
          monitorName: '',
          httpUser: '',
          httpPass: ''
        },
        dbRules: {
          monitorName: [
            Validaters.NotNull,
            {max: 100, message: '长度不能超过100', trigger: 'blur'}
          ],
          httpUser: [{max: 100, message: '长度不能超过100', trigger: 'blur'}],
          httpPass: [{max: 100, message: '长度不能超过100', trigger: 'blur'}]
        },
        type: ''
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      compId: {
        type: String
      },
      portData: {
        type: Object
      }
    },
    created() {
      if (this.title === '添加') {
        this.dbForm = {
          monitorName: '',
          httpUser: '',
          httpPass: ''
        }
      } else {
        this.type = this.portData.type.name
        this.dbForm.monitorName = this.portData.monitorName
        this.dbForm.httpUser = this.portData.httpUser
        this.dbForm.httpPass = this.portData.httpPass
      }
    },
    methods: {
      changePort() {
        if (this.portData.name === 'http协议' || this.type === 'http协议') {
          let parms = {
            pathUrl: this.dbForm.monitorName,
            userName: this.dbForm.httpUser,
            password: this.dbForm.httpPass
          }
          $axios.post(`/resourcemanager/assetmanage/assetRuning/checkHttpUrl`, parms).then(({data}) => {
              if (data.state === true) {
                this.$message({showClose: true, message: data.errormsg, type: 'success'});
              } else {
                this.$message({showClose: true, message: data.errormsg, type: 'error'});
              }
            })
        } else {
          let type = ''
          if (this.portData.name === 'UDP协议') {
            type = 2
          } else if (this.portData.name === 'TCP协议') {
            type = 1
          }
          $axios.get(`/resourcemanager/assetmanage/assetRuning/checkPort/${this.compId}/${this.dbForm.monitorName}/${type}`).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: data.errormsg, type: 'success'});
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          })
        }
      },
      uploadEdit() {
        this.$emit('upload', true)
        this.dialogFlag = false
      },
      saveData() {
          let flag = false
          let parms = cloneDeep(this.dbForm)

          if (this.title === '添加') {
            parms.compId = this.compId
            if (this.portData.name === 'http协议') {
              parms.monitorType = 'httpPort'
            } else if (this.portData.name === 'TCP协议') {
              parms.monitorType = 'tcpPort'
            } else if (this.portData.name === 'UDP协议') {
              parms.monitorType = 'udpPort'
            }
            this.portData.list.map((val) => {
              if (val.monitorName === this.dbForm.monitorName) {
                flag = true
                this.$message({showClose: true, message: 'URL/端口已使用!', type: 'error'});
              }
            })
            if (this.portData.name !== 'http协议') {
              this.$refs['dbForm'].rules.monitorName.push(Validaters.Number)
            }
            if (flag === false) {
            this.$refs['dbForm'].validate(valid => {
                if (valid) {
                  $axios.post(`/resourcemanager/assetmanage/assetRuning/saveSelfDefineItems`, parms).then(({data}) => {
                    if (data !== null) {
                      this.$message({showClose: true, message: '保存成功', type: 'success'});
                      this.$emit('upload', true)
                      this.dialogFlag = false
                    }
                  });
                }
              })
          }
        } else {
            parms.uuid = this.portData.uuid
            if (this.portData.type.name === 'http协议') {
              parms.monitorType = 'httpPort'
            } else if (this.portData.type.name === 'TCP协议') {
              parms.monitorType = 'tcpPort'
            } else if (this.portData.type.name === 'UDP协议') {
              parms.monitorType = 'udpPort'
            }
            this.portData.edit.map((val, index) => {
              if (val.monitorName === this.portData.monitorName) {
                this.portData.edit.splice(index, 1)
              }
            })
            let arr = this.portData.edit
            if (arr.length > 0) {
              arr.map((val, index) => {
                if (val.monitorName === this.dbForm.monitorName) {
                  flag = true
                  this.$message({showClose: true, message: 'URL/端口已使用!', type: 'error'});
                }
              })
            }
            if (this.portData.type.name !== 'http协议') {
              this.$refs['dbForm'].rules.monitorName.push(Validaters.Number)
            }
            if (flag === false) {
              this.$refs['dbForm'].validate(valid => {
                if (valid) {
                  $axios.post(`/resourcemanager/assetmanage/assetRuning/updateSelfDefineItems`, parms).then(({data}) => {
                    if (data !== null) {
                      this.$message({showClose: true, message: '编辑成功', type: 'success'});
                      this.$emit('upload', true)
                      this.dialogFlag = false
                    }
                  });
                 }
              })
            }
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

