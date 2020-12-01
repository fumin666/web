/**
* Created by fumin on 2019/4/4.
* 资产管理详情-协议设置-关联弹窗-添加弹窗
*/
<template>
  <div class="AgreeAssociateForm">
    <s-form :model="AgreeAssociateForm" ref="AgreeAssociateForm" :rules="AgreeAssociateRules" label-width="120px">
      <s-form-item label="数据库/实例名" prop="dbname">
        <s-input v-model="AgreeAssociateForm.dbname"></s-input>
      </s-form-item>
      <s-form-item label="TNS信息" prop="tnsInfo">
        <s-input type="textarea" v-model="AgreeAssociateForm.tnsInfo" :rows="6" ></s-input>
      </s-form-item>
      <s-form-item label="备注">
        <s-input type="textarea" v-model="AgreeAssociateForm.remark" :rows="6" :maxlength=120></s-input>
        <p>备注信息所允许的最大长度为 120 个字符</p>
      </s-form-item>
      <s-row class="footerRow">
        <s-button @click="saveAgree('AgreeAssociateForm')">保存</s-button>
        <s-button type="cancel" @click="cancelAgree">取消</s-button>
      </s-row>
    </s-form>

  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  const ORACLE = '00000000000000000000000000000080';
  const plsql = '00000000000000000000000000000114';
  const toadoracle = '00000000000000000000000000000120';
  const tns = '(DESCRIPTION = \n' +
    '  (ADDRESS_LIST = \n' +
    '    (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.213.76)(PORT = 1521))\n' +
    '  )\n' +
    '  (CONNECT_DATA = \n' +
    '    (SID = imptest)\n' +
    '  )\n' +
    ')'
  function validHasMark(rule, value, callback) {
    let reg = /^.*[\,，\'‘].*$/;
    if (reg.test(value)) {
      callback(new Error(`数据库实例名不能输入英文逗号`));
    }
    callback();
  }
  export default {
    data() {
      return {
        AgreeAssociateForm: {
          dbname: '',
          tnsInfo: tns,
          remark: ''
        },
        isNullTns: false,
        AgreeAssociateRules: {
          dbname: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validHasMark, trigger: 'blur'}
          ],
          tnsInfo: []
        }
      }
    },
    watch: {
      isEdit() {
        console.log(Object.keys(this.currentRow).length);
        return Object.keys(this.currentRow).length > 0
      }
    },
    created() {
      console.log(this.agreeAssociated);
      if (this.agreeAssociated.protocolUuid === ORACLE || this.agreeAssociated.protocolUuid === plsql || this.agreeAssociated.protocolUuid === toadoracle) {
        this.isNullTns = true;
        this.AgreeAssociateRules.tnsInfo = [{required: true, message: '不能为空', trigger: 'blur'}]
      } else {
        this.isNullTns = false;
        this.AgreeAssociateRules.tnsInfo = []
      }
      this.getEditData() // 获取编辑数据
    },
    methods: {
      saveAgree(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var param = {
              dbname: this.AgreeAssociateForm.dbname,
              tnsInfo: this.AgreeAssociateForm.tnsInfo,
              remark: this.AgreeAssociateForm.remark,
              portUuid: this.agreeAssociated.uuid,
              deviceUuid: this.agreeAssociated.assetsUuid
            };
            let url = '/databaseDbname/saveDbNameInfo';
            let obj = {
              data: [],
              logTemplate: `添加|资产(${this.curAsset.controlAdderss}/${this.curAsset.itcompName})资产协议(${this.agreeAssociated.protocolName}/${this.agreeAssociated.port})数据库实例(${this.AgreeAssociateForm.dbname})`
            }
            if (this.isEdit) {
              param.uuid = this.currentRow.uuid;
              url = '/databaseDbname/updateDatabaseDbname'; // 编辑
              obj = {}
            }
            $axios.post(url, param, obj).then((res) => {
              if (res.data.state === true) {
                this.$emit('closeAddAgree')
                this.$message({showClose: true, message: '保存成功', type: 'success'});
              } else {
                this.$emit('closeAddAgree')
                this.$message({showClose: true, message: '只能存在一条实例', type: 'error'});
              }
            });
          }
        });
      },
      cancelAgree() {
        this.$emit('closeAddAgree')
      },
      getEditData () {
        if (this.isEdit) {
          this.AgreeAssociateForm.dbname = this.currentRow.dbname;
          this.AgreeAssociateForm.tnsInfo = this.currentRow.tnsInfo;
          this.AgreeAssociateForm.remark = this.currentRow.remark;
        } else {
          this.AgreeAssociateForm.dbname = '';
          this.AgreeAssociateForm.tnsInfo = tns;
          this.AgreeAssociateForm.remark = '';
        }
      }
    },
    props: {
      agreeAssociated: {
        type: Object,
        required: true
      },
      currentRow: {
        type: Object,
        required: false
      },
      isEdit: {
        type: Boolean,
        required: false
      },
      curAsset: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style scoped>
  .AgreeAssociateForm
  .footerRow {
    text-align: right;
    margin: 15px 0 5px 0
  }
</style>
