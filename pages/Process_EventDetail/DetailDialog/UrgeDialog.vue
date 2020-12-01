<template>
  <s-dialog v-model="dialogFlag" title="催办" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" :rules="rules" ref="form" label-width="120px">
        <s-form-item prop="sendType" label="催办类型：">
          <s-checkbox-group v-model="form.sendType">
            <s-checkbox label="0">邮件</s-checkbox>
            <s-checkbox label="1">短信</s-checkbox>
          </s-checkbox-group>
        </s-form-item>
        <s-form-item prop="message" label="催办消息：">
          <s-input v-model="form.message" type="textarea" :rows="3"></s-input>
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
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        form: {
          sendType: [],
          message: ''
        },
        rules: {
          sendType: { type: 'array', required: true, message: '请至少选择一个催办类型', trigger: 'change' },
          message: Validaters.NotNull
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (!valid) return;
          let sendType = this.form.sendType.length > 1 ? '2' : this.form.sendType[0];
          let param = {
            orderUuid: this.$route.params.orderUuid,
            sendType: sendType,
            message: this.form.message
          }
          $axios.post('/itilIncidentCenter/pressIncidentOrder', param).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: '催办成功！'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({type: 'error', message: data.errormsg !== '-1' ? data.errormsg : '短信催办失败！'});
            }
          })
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
