<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-添加结点
 -->
<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑结点' : '添加结点'" width="600px" append-to-body class="senior-box">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-form :model="ruleForm" ref="ruleForm" :rules="ruleRules" label-width="120px" class="ruleForm">
        <s-form-item label="结点名称" prop="nodeName">
          <s-input v-model="ruleForm.nodeName"></s-input>
        </s-form-item>
        <s-form-item label="是否开始结点" prop="startNode" tip="待添加的结点是否开始结点">
          <s-radio-group v-model="ruleForm.startNode">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item label="是否结束结点" prop="endNode" tip="待添加的结点是否结束结点">
          <s-radio-group v-model="ruleForm.endNode" :disabled="isEndNode">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item label="结点类型" prop="nodeType">
          <s-select v-model="ruleForm.nodeType" :disabled="isNodeType">
            <s-option label="普通节点" :value="1"></s-option>
            <s-option label="判断节点" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="上一结点名称" prop="parentNodeUuid" v-if="parentNodeUuidFlag">
          <s-select v-model="ruleForm.parentNodeUuid" clearable>
            <s-option v-for="item in parentNodeData" :label="item.nodeName" :value="item.uuid"
                      :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="拒绝跳转结点" prop="refulseNodeUuid">
          <s-select v-model="ruleForm.refulseNodeUuid" clearable :disabled="refulseNodeUuidFlag">
            <s-option v-for="item in nodeData" :label="item.nodeName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  import { intersectObj, Validaters } from 'sunflower-common-utils';

  export default {
    components: {},
    data() {
      let checkRepeatName = (rule, value, callback) => {  // 校验重复邮箱
        if (value !== this.editNodeName) {
          if (value) {
            $axios.get(`/safetyPlatform/safetyBulletin/checkItilNodeName/${value}/${this.bulletinUuid}`).then((res) => {
              if (res.data.state === false) {
                callback(new Error('该名称已经存在！'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
      return {
        dialogFlag: false,
        ruleForm: {
          nodeName: '',
          startNode: 1,
          endNode: 0,
          nodeType: 1,
          parentNodeUuid: '',
          refulseNodeUuid: ''
        },
        editNodeName: '',
        isEndNode: false,
        isNodeType: false,
        parentNodeUuidFlag: true, // 上一结点名称
        refulseNodeUuidFlag: true,
        ruleRules: {
          nodeName: [
            Validaters.NotNull,
            Validaters.Name,
            Validaters.Max(50),
            {validator: checkRepeatName, trigger: 'blur'}
          ],
          nodeType: [
            {type: 'number', required: true, message: '请选择', trigger: 'change'}
          ],
          parentNodeUuid: [
            {required: true, message: '请选择', trigger: 'change'}
          ],
          refulseNodeUuid: [
            {required: false, message: '请选择', trigger: 'change'}
          ]
        },
        parentNodeData: [], // 上一结点options
        nodeData: [],
        axiosUrl: '/safetyPlatform/safetyBulletin/saveItilNode'  // 添加
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      bulletinUuid: {
        type: String,
        default() {
          return '';
        }
      },
      rowData: {
        type: Object,
        default: {}
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
      },
      'ruleForm.startNode': {
        immediate: true,
        handler(val) {
          if (val === 1) {
            this.ruleForm.endNode = 0;
            this.ruleForm.nodeType = 1;
            this.isEndNode = true;
            this.isNodeType = true;
            this.parentNodeUuidFlag = false;
          } else {
            this.isEndNode = false;
            this.isNodeType = false;
            this.parentNodeUuidFlag = true;
          }
        }
      },
      'ruleForm.endNode': {
        handler(val) {
          if (val === 1) {
            this.ruleForm.nodeType = 1;
            this.isNodeType = true;
          } else {
            this.isNodeType = false;
          }
        }
      },
      'ruleForm.nodeType': {
        handler(val) {
          if (val === 1) {
            this.ruleForm.refulseNodeUuid = ''
            this.refulseNodeUuidFlag = true;
            this.$set(this.ruleRules.refulseNodeUuid[0], 'required', false)
            if (this.$refs.ruleForm) {
              this.$refs.ruleForm.clearValidate('refulseNodeUuid');
            }
          } else {
            this.refulseNodeUuidFlag = false;
            this.$set(this.ruleRules.refulseNodeUuid[0], 'required', true)
          }
        }
      }
    },
    created() {
      if (Object.keys(this.rowData).length !== 0) { // 判断是否为编辑
        this.ruleForm = intersectObj(this.ruleForm, this.rowData)
        this.editNodeName = this.rowData.nodeName
      }
    },
    mounted() {
      this.getNodeData();
      this.getParentNodeData();
    },
    methods: {
      getParentNodeData() {
        $axios.get(`/safetyPlatform/safetyBulletin/getLastItilNodeList/${this.bulletinUuid}`).then(({data}) => {
          this.parentNodeData = data;
        })
      },
      getNodeData() { // 获取节点数据
        let vm = this;
        $axios.get(`/safetyPlatform/safetyBulletin/getAllItilNode/${vm.bulletinUuid}`).then(({data}) => {
          vm.nodeData = data;
        })
      },
      saveData() {
        let params = cloneDeep(this.ruleForm);
        params.typeUuid = this.bulletinUuid
        this.$refs.ruleForm.validate(valid => {
          if (!valid) {
            this.$message({type: 'error', message: '请正确填写信息'});
            return
          }
          if (this.isEdit) {
            this.axiosUrl = '/safetyPlatform/safetyBulletin/updateItilNode'
            params.uuid = this.rowData.uuid
          }
          $axios.post(this.axiosUrl, params).then(({data}) => {
            if (data.state) {
              this.$emit('updateProcess')
              this.$message({type: 'success', message: data.errormsg});
              this.dialogFlag = false;
            } else {
              this.$message({type: 'error', message: data.errormsg})
            }
          });
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>

