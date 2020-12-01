<template>
  <s-dialog v-model="dialogFlag" title="修改规则" width="700px" class="changeThresholdDialog">
    <s-scrollbar wrap-class="changeThresholdScrollbar">
      <s-row class="topHandleRow">
        <!--<s-button icon="plus" @click="add">添加规则</s-button>-->
        <s-button icon="delete" @click="del">删除规则</s-button>
      </s-row>
      <s-checkbox-group v-model="selections">
        <s-row v-for="(value,key) in thresholdData" :key="key">
          <s-checkbox :label="deal(key)[0]" class="checkRow">{{deal(key)[1]}}</s-checkbox>
          <s-table
            :data="value"
            border
            style="width:95%;margin-left: 25px;"
          >
            <s-table-column label="规则组名称" prop="ruleName"></s-table-column>
            <s-table-column label="规则" prop="desc" show-overflow-tooltip></s-table-column>
            <s-table-column label="级别" prop="levelName" width="100"></s-table-column>
          </s-table>
        </s-row>
      </s-checkbox-group>
    </s-scrollbar>
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
        thresholdData: {},
        selections: []
      }
    },
    props: {
      curMonitor: {
        type: Object
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      $axios.post(`/resourcemanager/assetmanage/assetRuning/showThreshold/${this.curMonitor.id}`).then(({data}) => {
        this.thresholdData = data;
      })
    },
    methods: {
      add() {
        this.$emit('show-threshold-add', this.thresholdData);
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择要删除的规则!', type: 'warning'});
          return;
        }
        let param = {
          outItemId: this.curMonitor.id + '',
          thresholdIds: this.selections
        }
        $axios.post('/resourcemanager/assetmanage/assetRuning/deleteThreshold', param).then(({data}) => {
          if (data) {
            let obj = JSON.parse(JSON.stringify(this.thresholdData));
            this.selections.forEach(item => {
              for (let i in obj) {
                if (item === this.deal(i)[0]) {
                  delete obj[i];
                }
              }
            });
            this.thresholdData = obj;
          } else {
            this.$message({showClose: true, message: '删除失败!', type: 'error'});
          }
        });
      },
      dialogOk() {
        let param = [];
        for (let i in this.thresholdData) {
          param.push(this.deal(i)[0])
        }
        let logParam = {};
        if (this.$route.name === 'AssetsMonitor_info') {
          logParam.data = [Object.assign({}, this.$parent.comp, {monitorType: this.curMonitor.monitorType, monitorName: this.curMonitor.monitorName})];
          logParam.logTemplate = '编辑规则|资产(#controlAdderss#/#itcompName#)>IP信息>运行信息>资产信息>监控项管理>监控项(#monitorType#)>监控项名称(#monitorName#)';
        }
        $axios.post(`/resourcemanager/assetmanage/assetRuning/updateCiThreshold/${this.curMonitor.id}`, param, logParam).then(({data}) => {
          if (data) {
            this.dialogFlag = false;
            this.$message({showClose: true, message: '修改成功!', type: 'success'});
          } else {
            this.$message({showClose: true, message: '修改失败!', type: 'error'});
          }
        })
      },
      deal(str) {
        return str.split('_');
      },
      addThreshold(obj) { // 供外部调用
        this.thresholdData = Object.assign({}, this.thresholdData, obj);
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
