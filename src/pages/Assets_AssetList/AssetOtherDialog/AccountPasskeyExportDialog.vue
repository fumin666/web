
<template>
  <s-dialog v-model="dialogFlag" :title="'密钥文件导出附件密码设置'" width="660px" class="remoteRecDialog">
    <s-form :model="form" :rules="rules" ref="passwordForm" label-width="130px">
      <s-form-item label="附件密码" prop="password">
        <s-input v-model="form.password" type="password" placeholder="请输入附件密码"></s-input>
      </s-form-item>
      <s-form-item label="确认密码" prop="repassword">
        <s-input v-model="form.repassword" type="password" placeholder="请再输入一次附件密码"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      form: {
        password: '',
        repassword: ''
      },
      rules: {
        password: [Validaters.NotNull, Validaters.Max(999)],
        repassword: [Validaters.NotNull, Validaters.Max(999)]
      },
      ftpList: [] // 远程服务器列表
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    // 获取备份服务器列表
    dialogOk() {
      let vm = this;
      let form = vm.$refs['passwordForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let form = {...this.form};
        this.$emit('exportAccountPassKeyOk', form)
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
  },
  components: {
  }
}
</script>

<style lang="stylus">

.remoteRecDialog-checkbox {
  float: left;

  .remoteRecDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
