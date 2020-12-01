<template>
  <s-dialog v-model="dialogFlag" title="登录业务属性" width="600px" class="httpAddDialog">
    <s-form :model="deployForm" :rules="deployRules" ref="deployForm" label-width="120px">
      <s-form-item label="登录页面" class="alignRow" prop="bizPattern">
        <s-input v-model="deployForm.bizPattern"></s-input>
      </s-form-item>
      <s-form-item label="用户名域" prop="usernameKey" tip="用户名域可以为GET，POST或Cookie参数的键值名称">
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
          usernameKey: ''
        },
        deployRules: {
          bizPattern: [
            Validaters.Max(1024),
            // 此处要求url不能包含?
            { pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\?\s]+/, message: 'url格式不正确', trigger: 'blur' }
          ],
          usernameKey: [
            Validaters.NotNull,
            Validaters.Max(1024),
            { pattern: /[^=]+/, message: '不能包含?', trigger: 'blur' }
          ]
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
          $axios.post(`/sysDbauditBusiness/saveHttpBusiness`, param).then(({data}) => {
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

<style lang="stylus">
  .httpAddDialog
    .alignRow
      .s-form-item-content
        margin-right 50px
</style>
