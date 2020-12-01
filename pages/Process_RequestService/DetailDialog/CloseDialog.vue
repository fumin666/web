<template>
  <s-dialog v-model="dialogFlag" title="关单" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" label-width="120px">
        <s-form-item prop="" label="关闭代码：">
          <s-select v-model="form.closeCode">
            <s-option label="成功解决" :value="0"></s-option>
            <s-option label="变更解决" :value="1"></s-option>
            <s-option label="不成功" :value="2"></s-option>
            <s-option label="转交开发" :value="3"></s-option>
            <s-option label="误报" :value="4"></s-option>
            <s-option label="用户撤销" :value="5"></s-option>
            <s-option label="自动关闭" :value="6"></s-option>
            <s-option label="其他" :value="7"></s-option>
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

  export default {
    data() {
      return {
        dialogFlag: false,
        form: {
          closeCode: 0
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
        $axios.get(`/itilServiceRequest/closedOrder/${this.$route.params.uuid}/${this.form.closeCode}`).then(({data}) => {
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
