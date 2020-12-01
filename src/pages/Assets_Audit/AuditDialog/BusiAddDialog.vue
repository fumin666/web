<template>
  <s-dialog v-model="dialogFlag" title="登录业务属性" width="600px" >
    <s-form :model="deployForm" :rules="deployRules" ref="deployForm" label-width="120px">
      <s-form-item label="登录业务模式">
        <s-input v-model="deployForm.bizPattern"></s-input>
      </s-form-item>
      <s-form-item label="用户名模式" prop="usernamePattern">
        <s-input v-model="deployForm.usernamePattern"></s-input>
      </s-form-item>
      <s-form-item label="用户名位置" prop="usernameKey">
        <s-input v-model="deployForm.usernameKey"></s-input>
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
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        deployForm: {
          apputDetailId: '',
          bizPattern: '',
          usernamePattern: '',
          usernameKey: ''
        },
        deployRules: {
          usernamePattern: [Validaters.NotNull],
          usernameKey: [Validaters.NotNull]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      current: {
        type: Object
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.current).length > 0;
      }
    },
    created() {
      if (this.isEdit) {
        for (let i in this.deployForm) {
          this.deployForm[i] = this.current[i];
        }
      }
    },
    methods: {
      dialogOk() {
        this.$refs['deployForm'].validate(valid => {
          if (!valid) {
            return;
          }
          let param = Object.assign({}, this.deployForm);
          param.appId = this.$route.params.appId;
          $axios.post(`/sysDbauditBusiness/addBusiness`, param).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败!', type: 'error'});
            }
          });
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
