<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑AD域' : '新建AD域'" width="600px" class="adDomainAddDialog">
    <s-scrollbar wrap-class="adDomainAddScrollbar">
      <s-form :model="adDomainForm" :rules="adDomainRule" ref="adDomainForm" label-width="120px">
        <p class="ad-domain-dialog-title">AD域认证服务器属性</p>
        <s-form-item label="域名" prop="adName">
          <s-input v-model="adDomainForm.adName"></s-input>
        </s-form-item>
        <s-form-item label="服务器地址" prop="ip">
          <s-input v-model="adDomainForm.ip"></s-input>
        </s-form-item>
        <s-form-item label="端口" prop="port">
          <s-input v-model="adDomainForm.port"></s-input>
        </s-form-item>
        <s-form-item label="适用范围">
          <s-select v-model="adDomainForm.rangeType">
            <s-option label="全局" value="1"></s-option>
            <s-option label="局部" value="2"></s-option>
          </s-select>
        </s-form-item>
        <p class="ad-domain-dialog-title">AD域导入设置</p>
        <s-form-item label="管理员账户" prop="adSelectAccount">
          <s-input v-model="adDomainForm.adSelectAccount"></s-input>
        </s-form-item>
        <s-form-item label="管理员密码" prop="adSelectPwd">
          <s-input type="password" v-model="adDomainForm.adSelectPwd"></s-input>
        </s-form-item>
        <s-form-item label="查询端口" prop="selectPort">
          <s-input v-model.number="adDomainForm.selectPort"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    let checkPort = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback()
      } else {
        let r = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
        if (r.test(value)) {
          callback()
        } else {
          callback(new Error('请输入合法的端口号:0~65535！'))
        }
      }
    };
    return {
      data: [],
      dialogFlag: false,
      allowAdd: true,
      authOptions: [],
      adNameLast: '',
      adDomainForm: {
        adName: '',
        ip: '',
        port: '',
        rangeType: '1',
        adSelectAccount: '',
        adSelectPwd: '',
        selectPort: '',
        uuid: null,
        status: null,
        lastUpdateDate: null,
        createDate: null,
        uniqueIdentifier: null,
        updateTime: null
      },
      adDomainRule: {
        adName: [
          Validaters.NotNull,
          Validaters.Name,
          Validaters.Max(30)
        ],
        ip: [
          Validaters.NotNull,
          Validaters.IP
        ],
        port: [
          Validaters.NotNull,
          Validaters.Port
        ],
        selectPort: [{validator: checkPort, trigger: 'blur'}],
        rangeType: [Validaters.NotNull]
      }
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    adRow: {
      type: Object
    },
    adList: {
      type: Array
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.adRow).length > 0;
    }
  },
  created() {
    if (this.isEdit) {
      $axios.get(`/tdeviceAdInfo/gettDeviceAdInfo/${this.adRow.uuid}`).then(({data}) => {
        this.data = {...data}
        for (let i in this.adDomainForm) {
          if (i === 'rangeType') {
            this.adDomainForm[i] = this.data[i].toString();
          } else {
            this.adDomainForm[i] = this.data[i];
          }
        }
        // 编辑时，保存一份ad域名上次已入库值的备份，编辑提交时需要先比较当前ad域名和上次入库值是否相同
        // 相同，不需要重名验证。不同，再进行重名验证。
        this.adNameLast = this.adDomainForm.adName;
      })
    }
  },
  methods: {
    dialogOk() {
      let form = this.$refs['adDomainForm'];
      form.validate((valid) => {
        if (!valid) return false;
        let params = {...this.adDomainForm, rangeType: parseInt(this.adDomainForm.rangeType)};
        if (this.isEdit) {
          // 编辑
          if (params.adName !== this.adNameLast) {
            // 当前提交的AD域名不等于上次入库值，需要做重名验证
            $axios.post('/tdeviceAdInfo/nameValidate', {name: params.adName}).then(({data}) => {
              if (data === false) { // 未重名
                let obj = {
                  data: [],
                  logTemplate: `编辑|AD域管理>AD域(${params.adName})`
                }
                $axios.post('/tdeviceAdInfo/updateTdeviceAdInfo', params, obj).then((res) => {
                  if (res.data.state === true) {
                    this.$message({showClose: true, message: '更新成功!', type: 'success'});
                    this.$emit('reload');
                    this.dialogFlag = false;
                  } else {
                    this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
                  }
                });
              } else {
                this.$message.warning('AD域名已存在！');
              }
            });
          } else {
            // 当前提交的AD域名等于上次入库值，不需要做重名验证，直接提交
            let obj = {
              data: [],
              logTemplate: `编辑|AD域管理>AD域(${params.adName})`
            }
            $axios.post('/tdeviceAdInfo/updateTdeviceAdInfo', params, obj).then((res) => {
              if (res.data.state === true) {
                this.$message({showClose: true, message: '更新成功!', type: 'success'});
                this.$emit('reload');
                this.dialogFlag = false;
              } else {
                this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
              }
            });
          }
        } else {
          // 新增
          let obj = {
            data: [],
            logTemplate: `添加|AD域管理>AD域(${params.adName})`
          }
          $axios.post('/tdeviceAdInfo/saveTdeviceAdInfo', params, obj).then((res) => {
            if (res.data.state === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
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
.adDomainAddDialog {
  .adDomainAddScrollbar {
    padding-right: 17px;
    max-height: 500px;
  }
}
</style>
