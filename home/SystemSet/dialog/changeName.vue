<!--
 * @Author: songyf
 * @Date: 2019-10-30
 * @LastEditors: songyf
 * @Description: 系统设置-系统设置面板-节点IP策略 - 修改节点名称
 -->
<template>
  <s-dialog v-model="dialogFlag" title="修改节点名称" width="500px" append-to-body class="">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :model="ruleForm" ref="ruleForm" :rules="ruleRules" label-width="120px" class="ruleForm">
        <s-form-item label="节点名称" prop="name">
          <s-input  v-model="ruleForm.name" placeholder="请输入内容"></s-input>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils';
  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false,
        ruleForm: {
          name: ''
        },
        ruleRules: {
          name: [Validaters.NotNull, Validaters.Max(20)]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      nodeData: {
        type: Object,
        default: null
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
    mounted() {
      this.ruleForm.name = this.nodeData.nodeName
    },
    methods: {
      saveData() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            $axios.get(`/configcenter/nodeserver/setServerNodeName/${this.nodeData.nodeId}/${this.ruleForm.name} `).then(({data}) => {
              if (data.result) {
                this.$emit('updataName', this.ruleForm.name, this.nodeData)
                this.dialogFlag = false;
                this.$message.success(data.errormsg);
              } else {
                this.$message.warning(data.errormsg);
              }
            });
          }
        })
      }
    }
  }
</script>
<style>
</style>

