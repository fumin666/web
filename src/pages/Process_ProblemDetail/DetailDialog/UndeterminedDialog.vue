/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="待决" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item prop="pendingReason" label="待决原因：">
          <s-select v-model="form.pendingReason" clearable>
            <s-option v-for="item in config.pendingReason" :label="item.name" :value="item.value" :key="item.value"></s-option>
          </s-select>
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
          pendingReason: ''
        },
        rules: {
          pendingReason: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: String,
      config: {
        type: Object,
        default() {
          return []
        }
      }
    },
    created() {
      this.form.pendingReason = this.config.pendingReason[0].value
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            $axios.post('/itilProblemOrder/pendingItilProblemOrder', {
              problemUuid: this.uuid,
              pendingReason: parseInt(this.form.pendingReason)
            }).then(({data}) => {
              this.$emit('submit', 'getData')
              this.dialogFlag = false
              if (data === true) {
                this.$message.success('操作成功')
              } else {
                this.$message.error('操作失败')
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
