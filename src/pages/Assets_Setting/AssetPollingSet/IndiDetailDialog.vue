<template>
  <s-dialog v-model="dialogFlag" title="指标详情" width="550px">
    <s-row>
      <s-col span="10">
        <div class="grid-content bg-purple">控制点名称</div>
      </s-col>
      <s-col span="14">
        <div class="grid-content bg-purple-light">{{indi.controlname}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col span="10">
        <div class="grid-content bg-purple">等级</div>
      </s-col>
      <s-col span="14">
        <div class="grid-content bg-purple-light">{{indi.level}}</div>
      </s-col>
    </s-row>
    <s-table style="widtt: 100%;" :data="indi.testitemList" max-height="300">
      <s-table-column label="测评项" prop="testitemName" show-overflow-tooltip></s-table-column>
    </s-table>
  </s-dialog>
</template>

<script>
  export default {
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
      indi: {
        type: Object
      }
    },
    methods: {
      dialogOk() {}
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
