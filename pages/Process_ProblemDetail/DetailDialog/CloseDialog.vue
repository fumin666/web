/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="关单" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item prop="closeCode" label="关闭代码：">
          <s-select v-model="form.closeCode">
            <s-option v-for="(item, index) in config.closeCode" :key="index" :value="parseInt(item.value)"
                      :label="item.name"></s-option>
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
          closeCode: ''
        },
        rules: {
          closeCode: [{required: true, message: '不能为空', type: 'number', trigger: 'blur'}]
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
          return {
            closeCode: []
          }
        }
      }
    },
    created() {
      this.form.closeCode = this.config.closeCode[0].value
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            $axios.post('/itilProblemOrder/closeItilProblemOrder', {
              problemUuid: this.uuid,
              closeCode: this.form.closeCode
            }).then(({data}) => {
              this.$emit('submit', 'getData')
              this.dialogFlag = false
              if (data.state === true) {
                //  操作
                this.$message.success(data.data)
              } else {
                this.$message.error(data.data)
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
