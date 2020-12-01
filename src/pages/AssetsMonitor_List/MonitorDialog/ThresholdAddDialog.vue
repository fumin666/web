<template>
  <s-dialog v-model="dialogFlag" title="添加规则" width="700px" class="thresholdAddDialog">
    <s-scrollbar wrap-class="thresholdAddScrollbar">
      <s-row class="topHandleRow">
        <s-button @click="selectAll">全选</s-button>
      </s-row>
      <s-checkbox-group v-model="selections" v-if="Object.keys(filterThresholdData).length !== 0">
        <s-row v-for="(value,key) in filterThresholdData" :key="key">
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
      <s-row class="noData" v-else>暂无数据</s-row>
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
      showedThresholdData: {
        type: Object
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      filterThresholdData() {
        let obj = {};
        for (let i in this.thresholdData) {
          if (!this.showedThresholdData.hasOwnProperty(i)) {
            obj[i] = this.thresholdData[i];
          }
        }
        return obj;
      }
    },
    created() {
      $axios.post(`/resourcemanager/assetmanage/assetRuning/showNeedAddThreshold/${this.curMonitor.monitorType}`).then(({data}) => {
        this.thresholdData = data;
      })
    },
    methods: {
      selectAll() {
        for (let i in this.filterThresholdData) {
          this.selections.push(this.deal(i)[0]);
        }
      },
      dialogOk() {
        let obj = {};
        this.selections.forEach(item => {
          for (let i in this.filterThresholdData) {
            if (item === this.deal(i)[0]) {
              obj[i] = this.filterThresholdData[i];
            }
          }
        });
        this.$emit('threshold-add', obj);
        this.dialogFlag = false;
      },
      deal(str) {
        return str.split('_');
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
