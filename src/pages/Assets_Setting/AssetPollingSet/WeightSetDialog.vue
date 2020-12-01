<template>
  <s-dialog v-model="dialogFlag" :title="`设置关键指标(${score.cmdbTypeName})`" width="600px" class="weightSetDialog">
    <s-table style="width: 100%;" :data="score.controlList" max-height="300">
      <s-table-column prop="controlname" label="指标名称"></s-table-column>
      <s-table-column label="权重">
        <template slot-scope="scope">
          <s-input-number v-model="scope.row.kpiWeight" :step="0.01" :min="0" :max="1"></s-input-number>
        </template>
      </s-table-column>
    </s-table>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

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
      score: {
        type: Object,
        default: () => {
          return {
            controlList: []
          }
        }
      }
    },
    methods: {
      dialogOk() {
        let sum = 0;
        for (let obj of this.score.controlList) {
          if (typeof obj.kpiWeight !== 'number') {
            this.$message({message: '请填写指标权重！', type: 'warning'})
            return;
          }
        }
        this.score.controlList.forEach(item => {
          sum += item.kpiWeight.toFixed(10) - 0;
        });
        sum = Number.parseFloat(sum.toFixed(2))
        if (sum > 1) {
          this.$message({message: '当前权重之和大于1，请修改！', type: 'warning'})
          return;
        }
        if (sum < 1) {
          this.$message({message: '当前权重之和小于1，请修改！', type: 'warning'})
          return;
        }
        let param = this.score.controlList.map(item => {
          return {
            uuid: item.uuid,
            kpiWeight: item.kpiWeight
          }
        });
        let obj = {
          data: this.score.controlList,
          logTemplate: '编辑|资产巡检打分设置>设置权重(#controlname#)'
        }
        $axios.post('/kpi/updateKpiAssetinspectControlWeight', param, obj).then(({data}) => {
          if (data) {
            this.$message({message: '更新成功', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({message: '更新失败', type: 'error'});
          }
        });
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
  .weightSetDialog
    .s-input-number
      vertical-align middle
</style>
