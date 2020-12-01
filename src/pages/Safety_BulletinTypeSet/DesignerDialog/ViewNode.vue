<!--
 * @Author: songyf
 * @Date: 2020-2-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器-查看结点
 -->
<template>
  <s-dialog v-model="dialogFlag" title='查看结点' width="800px" append-to-body class="">
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">结点名称</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light" v-text="rowData.nodeName"></div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple">结点类型</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light">
            <span v-if="rowData.nodeType === 1">普通结点</span>
            <span v-else>判断结点</span>
          </div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">是否开始结点</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light">
            <span v-if="rowData.startNode === 1">是</span>
            <span v-else>否</span>
          </div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple">是否结束结点</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light">
            <span v-if="rowData.endNode === 1">是</span>
            <span v-else>否</span>
          </div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">上一结点名称</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light" v-text="rowData.parentNodeName ? rowData.parentNodeName : '--'"></div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple">拒绝跳转结点</div>
        </s-col>
        <s-col :span="6">
          <div class="grid-content bg-purple-light" v-text="rowData.refulseNodeName ? rowData.refulseNodeName : '--'"></div>
        </s-col>
      </s-row>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogFlag=false">确定</s-button>
    </template>
  </s-dialog>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        dialogFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
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
      }
    },
    created() {
    },
    mounted() {
      console.log(this.rowData);
    },
    methods: {
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">

</style>

