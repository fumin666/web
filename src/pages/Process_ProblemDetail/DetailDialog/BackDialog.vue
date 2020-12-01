/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="回退" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item prop="" label-width="0">
          <span>确认将此问题工单回退至<span style="font-weight: 600"> {{statusMap[status]}} </span>状态？</span>
        </s-form-item>
        <s-form-item prop="backReason" label="回退理由：">
          <s-input v-model="form.backReason" type="textarea" placeholder=""></s-input>
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
          backReason: ''
        },
        rules: {
          backReason: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        statusMap: {
          1: '草稿',
          5: '已指派'
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      status: {
        type: Number,
        default: 1
      },
      uuid: String
    },
    created() {
      console.log('this.status::::::::::::::::::::::::', this.status)
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            $axios.get(`/itilProblemOrder/backItilProblemOrder/${this.uuid}/${this.form.backReason}`).then(({data}) => {
              this.$emit('submit', 'getData')
              this.dialogFlag = false
              if (data === true) {
                this.$message.success('回退成功')
              } else {
                this.$message.error('回退失败')
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
