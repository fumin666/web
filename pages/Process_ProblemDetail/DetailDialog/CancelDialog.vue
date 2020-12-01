/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="取消" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item prop="cancelReason" label="取消原因：">
          <s-input v-model="form.cancelReason" type="textarea" placeholder=""></s-input>
        </s-form-item>
      </s-form>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
    import $axios from 'sunflower-ajax';
  //  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        form: {
          cancelReason: ''
        },
        rules: {
          cancelReason: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: String
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            $axios.post('/itilProblemOrder/cancelItilProblemOrder', {
              problemUuid: this.uuid,
              cancelReason: this.form.cancelReason
            }).then(({data}) => {
              this.$emit('submit', 'getData')
              this.dialogFlag = false
              if (data === true) {
                this.$message.success('取消成功')
              } else {
                this.$message.error('取消失败')
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

</style>
