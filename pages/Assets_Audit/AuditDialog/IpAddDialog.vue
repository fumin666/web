<template>
  <s-dialog v-model="dialogFlag" title="添加IP" width="600px" class="ipAddDialog">
    <s-radio-group v-model="ipFlag">
      <s-form :model="ipForm1" :rules="ipRules1" ref="ipForm1" label-width="120px">
        <s-row class="ipRadio">
          <s-radio :label="0">单个或多个IP</s-radio>
        </s-row>
        <s-form-item label="IP地址" prop="ip">
          <s-input v-model="ipForm1.ip" :disabled="ipFlag===1"></s-input>
        </s-form-item>
      </s-form>
      <s-form :model="ipForm2" :rules="ipRules2" ref="ipForm2" label-width="120px">
        <s-row class="ipRadio">
          <s-radio :label="1">指定IP段</s-radio>
        </s-row>
        <s-form-item label="起始IP" prop="startIp">
          <s-input v-model="ipForm2.startIp" :disabled="ipFlag===0"></s-input>
        </s-form-item>
        <s-form-item label="结束IP" prop="endIp">
          <s-input v-model="ipForm2.endIp" :disabled="ipFlag===0"></s-input>
        </s-form-item>
      </s-form>
    </s-radio-group>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  //  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        ipFlag: 0,
        ipForm1: {
          ip: ''
        },
        ipRules1: {
          ip: [Validaters.IP]
        },
        ipForm2: {
          startIp: '',
          endIp: ''
        },
        ipRules2: {
          startIp: [Validaters.IP],
          endIp: [Validaters.IP]
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
        if (this.ipFlag === 0) {
          this.$refs.ipForm1.validate(valid => {
            if (!valid) {
              return;
            }
            this.$emit('finish', this.ipForm1.ip);
            this.dialogFlag = false;
          });
        } else {
          this.$refs.ipForm2.validate(valid => {
            if (!valid) {
              return;
            }
            this.$emit('finish', this.ipForm2.startIp + '-' + this.ipForm2.endIp);
            this.dialogFlag = false;
          });
        }
      }
    },
    watch: {
      ipFlag(val) {
        if (val === 0) {
          this.$refs.ipForm2.resetFields();
        } else {
          this.$refs.ipForm1.resetFields();
        }
      },
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
  .ipAddDialog
    .s-radio-group
      width: 100%
      .ipRadio
        height: 36px
        line-height 36px
        .s-radio__inner
          vertical-align middle
</style>
