<template>
  <s-dialog v-model="dialogFlag" :title="'SLA全局设置'" width="600px" class="SlaGlobalSetDialog">
    <s-scrollbar wrap-class="slaDirAddScrollbar">
      <s-form label-width="300px">
        <s-form-item label="启用事件管理流程SL">
          <s-radio class="radio" v-model="list[0].isEnable" :label="1">是</s-radio>
          <s-radio class="radio" v-model="list[0].isEnable" :label="0">否</s-radio>
        </s-form-item>
        <s-form-item label="事件单打开后是否允许重新计时？">
          <s-radio class="radio" v-model="list[0].isopenEnable" :label="1">是</s-radio>
          <s-radio class="radio" v-model="list[0].isopenEnable" :label="0">否</s-radio>
        </s-form-item>
        <s-form-item label="启用服务请求流程SLA">
          <s-radio class="radio" v-model="list[1].isEnable" :label="1">是</s-radio>
          <s-radio class="radio" v-model="list[1].isEnable" :label="0">否</s-radio>
        </s-form-item>
        <s-form-item label="服务请求单打开后是否允许重新计时？">
          <s-radio class="radio" v-model="list[1].isopenEnable" :label="1">是</s-radio>
          <s-radio class="radio" v-model="list[1].isopenEnable" :label="0">否</s-radio>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button :disabled="dialogDisabled" @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      list: [
        {isEnable: 0, isopenEnable: 0},
        {isEnable: 0, isopenEnable: 0}
      ],
      data: {},
      dialogFlag: false,
      dialogDisabled: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.axiosList();
  },
  methods: {
    axiosList() {
      $axios.get(`/itilSla/getItilSlaCommonsettingList`).then((res) => {
        if (res.status === 200) {
          this.list = res.data
        } else {
          this.$message({showClose: true, message: '获取状态失败!', type: 'error'});
        }
      })
    },
    dialogOk() {
      this.dialogDisabled = true;
      let params = [...this.list];
      $axios.post('/itilSla/updateItilSlaCommonsetting', params, {
        data: [params],
        logTemplate: '编辑|SLA全局设置'
      }).then((res) => {
        this.dialogDisabled = false;
        if (res.data.state === true) {
          this.$message({showClose: true, message: '保存成功!', type: 'success'});
          this.dialogFlag = false;
        } else {
          this.$message({showClose: true, message: '保存失败!', type: 'error'});
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
