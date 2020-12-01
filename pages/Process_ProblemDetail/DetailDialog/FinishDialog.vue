/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="问题完成" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <div v-if="problemReason">已填写“根本原因描述”信息，确定保存？</div>
      <div v-else style="margin-bottom: 40px">未填写“根本原因描述”信息，请返回重新填写</div>
    </s-row>
    <template v-if="problemReason" slot="footer" class="dialog-footer">
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
          problemReason: ''
        },
        rules: {
          problemReason: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: String,
      problemReason: {
        type: String,
        default: ''
      }
    },
    methods: {
      dialogOk() {
        $axios.post('/itilProblemOrder/finishItilProblemOrder', {
          uuid: this.uuid,
          problemReason: this.problemReason
        }).then(({data}) => {
          this.$emit('submit', 'getData')
          this.dialogFlag = false
          if (data.state === true) {
            this.$message.success(data.data)
            //  操作
          } else {
            this.$message.error(data.data)
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
