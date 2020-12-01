<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑协议' : '添加协议'" width="600px" class="protocolAddDialog">
    <s-scrollbar wrap-class="protocolAddScrollbar">
      <s-form :model="protocolForm" :rules="protocolRule" ref="protocolForm" label-width="120px">
        <s-form-item label="协议名称" prop="protocolName">
          <s-input v-model="protocolForm.protocolName"></s-input>
        </s-form-item>
        <s-form-item label="默认端口" prop="protocolPort">
          <s-input v-model="protocolForm.protocolPort"></s-input>
        </s-form-item>
        <s-form-item label="权限">
          <s-select v-model="protocolForm.protocolAuthUuid">
            <s-option v-for="(item, index) in authOptions" :key="'auth' + index" :label="item.protocolAuthName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="协议类型">
          <s-select v-model="protocolForm.protocolTypeSub">
            <s-option label="非数据库类型" value="1"></s-option>
            <s-option label="数据库类型" value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="启动程序" prop="realReplayProgram">
          <s-input v-model="protocolForm.realReplayProgram"></s-input>
        </s-form-item>
        <s-form-item label="程序工作目录" prop="realReplayPath">
          <s-input v-model="protocolForm.realReplayPath"></s-input>
        </s-form-item>
        <s-form-item label="参数" prop="realReplayPara">
          <s-input v-model="protocolForm.realReplayPara"></s-input>
        </s-form-item>
        <s-form-item label="备注" prop="remark">
          <s-input v-model="protocolForm.remark" type="textarea"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      data: [],
      dialogFlag: false,
      allowAdd: true,
      authOptions: [],
      protocolForm: {
        protocolName: '',
        protocolPort: '',
        protocolAuthUuid: '',
        protocolTypeSub: '1',
        realReplayProgram: '',
        realReplayPath: '',
        realReplayPara: '',
        remark: ''
      },
      protocolRule: {
        protocolName: [
          Validaters.NotNull,
          {pattern: /^[\u4e00-\u9fa5|\w|\-|\.|\(|\)]+$/, message: '由中文、字母、数字、符号[ _ - . ( )]组成', trigger: 'blur'},
          Validaters.Max(30)
        ],
        protocolPort: [
          Validaters.NotNull,
          Validaters.Port
        ],
        realReplayProgram: [Validaters.Max(64)],
        realReplayPath: [Validaters.Max(64)],
        realReplayPara: [Validaters.Max(64)],
        remark: [Validaters.Max(120)]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    protocol: {
      type: Object
    },
    protocolList: {
      type: Array
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.protocol).length > 0;
    }
  },
  created() {
    if (this.isEdit) {
      $axios.get(`/protocolInfo/getProtocolInfoByUuid/${this.protocol.uuid}`).then(({data}) => {
        this.data = data
        this.data.protocolPort = String(data.protocolPort)
        this.data.protocolTypeSub = String(data.protocolTypeSub)
        this.data.protocolAuthUuid = data.protocolAuthUuid
        for (let i in this.protocolForm) {
          this.protocolForm[i] = this.data[i];
        }
      })
    }
    $axios.get(`/protocolInfo/getSelectData`).then(({data}) => {
      this.authOptions = data;
      if (!this.isEdit && data.length > 0) {
        this.protocolForm.protocolAuthUuid = data[0].uuid;
      }
    });
  },
  methods: {
    dialogOk() {
      let form = this.$refs['protocolForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let urlTail = 'saveProtocolInfo';
        let param = Object.assign({}, this.protocolForm);
        if (this.protocolList.length > 0) {
          if (this.isEdit) {
            urlTail = 'updateProtocolInfo';
            param.uuid = this.data.uuid
            param.protocolType = this.data.protocolType
            param.authToken = this.data.authToken
            param.status = this.data.status
            param.type = this.data.type
            param.protocolTypeSub = this.protocolForm.protocolTypeSub
            param.protocolTypeNme = this.data.protocolTypeNme
            let editArr = [];
            editArr = [].concat(this.protocolList);
            for (let i in editArr) {
              if (editArr[i].uuid === param.uuid) {
                editArr.splice(i, 1);
              }
            }
            for (let i in editArr) {
              if (editArr[i].protocolName.toLowerCase() === param.protocolName.toLowerCase()) {
                this.$message({
                  message: '协议名称不能重复',
                  type: 'error'
                })
                this.allowAdd = false;
                break;
              } else {
                this.allowAdd = true;
              }
            }
            if (this.allowAdd === true) {
              let logParam = {
                data: [param],
                logTemplate: (this.isEdit ? '编辑' : '添加') + '|协议设置>协议(#protocolName#)'
              };
              $axios.post(`/protocolInfo/${urlTail}`, param, logParam).then(({data}) => {
                if (data === '1') {
                  this.$message({showClose: true, message: '保存成功!', type: 'success'});
                  this.$emit('reload');
                  this.dialogFlag = false;
                } else {
                  this.$message({showClose: true, message: '保存失败!', type: 'error'});
                }
              });
            }
          } else {
            for (let i in this.protocolList) {
              if (this.protocolList[i].protocolName.toLowerCase() === param.protocolName.toLowerCase()) {
                this.$message({
                  message: '协议名称不能重复',
                  type: 'error'
                })
                this.allowAdd = false;
                break;
              } else {
                this.allowAdd = true;
              }
            }
            if (this.allowAdd === true) {
              let logParam = {
                data: [param],
                logTemplate: (this.isEdit ? '编辑' : '添加') + '|协议设置>协议(#protocolName#)'
              };
              param.defaultStatus = 2// 自定义添加协议
              $axios.post(`/protocolInfo/${urlTail}`, param, logParam).then(({data}) => {
                if (data === '1') {
                  this.$message({showClose: true, message: '保存成功!', type: 'success'});
                  this.$emit('reload');
                  this.dialogFlag = false;
                } else {
                  this.$message({showClose: true, message: '保存失败!', type: 'error'});
                }
              });
            }
          }
        } else {
          let logParam = {
            data: [param],
            logTemplate: (this.isEdit ? '编辑' : '添加') + '|协议设置>协议(#protocolName#)'
          };
          param.defaultStatus = 2// 自定义添加协议
          $axios.post(`/protocolInfo/${urlTail}`, param, logParam).then(({data}) => {
            if (data === '1') {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败!', type: 'error'});
            }
          });
        }
      })
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

<style lang="stylus">
.protocolAddDialog {
  .protocolAddScrollbar {
    padding-right: 17px;
    max-height: 500px;
  }
}
</style>
