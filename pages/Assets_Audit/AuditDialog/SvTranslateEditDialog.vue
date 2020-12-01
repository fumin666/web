<template>
  <s-dialog v-model="dialogFlag" :title="type === 'edit' ? '编辑业务属性' : '克隆业务属性'" width="600px" class="translateEditDialog">
    <s-form :model="transForm" label-width="120px">
      <s-form-item label="业务名称">
        <span>{{transForm.patName}}</span>
      </s-form-item>
      <s-form-item label="翻译名称">
        <s-input v-model="transForm.remarks"></s-input>
      </s-form-item>
      <s-form-item label="参数">
        <s-input v-model="transForm.patParam" type="textarea" :rows="3"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        transForm: {
          patName: '',
          remarks: '',
          patParam: ''
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curTrans: {
        type: Object
      },
      type: String
    },
    created() {
      Object.assign(this.transForm, this.curTrans);
    },
    methods: {
      dialogOk() {
        let param = Object.assign({}, this.transForm);
        let url = '/sysDbauditBusiness/saveTranslate';
        if (this.type === 'clone') {
          delete param.appId;
          delete param.patHash;
          delete param.patName;
          url = '/sysDbauditBusiness/cloneTranslate';
        }
        $axios.post(url, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        });
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
