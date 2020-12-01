/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="待决" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" label-width="120px">
        <s-form-item prop="" label="待决原因：">
          <s-select v-model="form.pendens">
            <s-option label="等待用户提供进一步的信息" :value="0"></s-option>
            <s-option label="等待其他厂商/供应商处理" :value="1"></s-option>
            <s-option label="等待问题管理" :value="2"></s-option>
            <s-option label="等待变更实施" :value="3"></s-option>
            <s-option label="其他" :value="4"></s-option>
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
          pendens: 0
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
        let param = {
          incidentOrderUuid: this.$route.params.orderUuid,
          ...this.form
        };
        $axios.post(`/itilIncidentCenter/incidentOrderPendens`, param).then(({data}) => {
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
          if (data.state) {
            this.$emit('finish');
            this.dialogFlag = false;
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
