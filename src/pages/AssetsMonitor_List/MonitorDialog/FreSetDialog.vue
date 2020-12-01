<template>
  <div style="width:90%">
    <s-dialog class="freSet-dialog" v-model="dialogFlag" title="监控频率设置" width="700px">
      <s-tab type="card" v-model="activeName" >
        <s-tab-pane label="监控频率设置" name="monitor">
        </s-tab-pane>
        <s-tab-pane label="可用性检测频率设置" name="available">
        </s-tab-pane>
      </s-tab>
      <template slot="footer" class="dialog-footer">
        <s-button type="cancel" @click="SetdialogClose">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>
<script>
  // import FreSetForm from '../components/FreSetForm.vue'
  // import availableForm from '../components/availableForm.vue'
  // import inputTree from '@/components/inputTree/InputTree';

  export default {
    data() {
      return {
        dialogFlag: false,
        activeName: 'monitor'
      }
    },
    props: {
      value: {
        type: Boolean
      }
    },
    components: {
      // inputTree,
      // FreSetForm,
      // availableForm
    },
    methods: {
      SetdialogClose() {
        this.dialogFlag = false;
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
<style>
  .monitor-tab .s-tabs-content{
    overflow: visible;
  }
</style>
