/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="取消" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" :rules="rules" ref="form" label-width="120px">
        <s-form-item prop="reason" label="取消原因：">
          <s-input v-model="form.reason" type="textarea" :rows="3" :maxlength="500"></s-input>
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
          reason: ''
        },
        rules: {
          reason: [Validaters.NotNull, Validaters.Max(150)]
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
          let param = {
            incidentOrderUuid: this.$route.params.orderUuid,
            ...this.form
          }
          $axios.post('/itilIncidentCenter/incidentOrderCancle', param).then(({data}) => {
            this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
            if (data.state) {
              this.$emit('finish');
              this.dialogFlag = false;
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
