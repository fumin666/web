<!--
 * @Author: songyf
 * @Date: 2019-10-30
 * @LastEditors: songyf
 * @Description: 账号管理-授权策略管理-按运维责任授权
 -->
<template>
  <s-dialog v-model="dialogFlag" title="按运维责任组授权" width="750px" append-to-body>
    <s-scrollbar wrap-class="default-dialog-scroll">
      <div class="input-search">
        <s-input placeholder="请输入内容" v-model="searchKey" class="real-search-input"
                 @keyup.enter.native="searchHandle"></s-input>
        <i class="iconfont icon-magnifier search-btn" @click="searchHandle"></i>
      </div>
      <RealPageTable
        :ajax-obj="ajaxObj"
        :isChecked="true"
        :showHeaderCheckbox="true"
        @selection-change="selectionChange">
        <s-table-column type="selection" width="45" :reserve-selection="true">
        </s-table-column>
        <s-table-column prop="deviceGroupName" label="运维责任组名称" show-overflow-tooltip>
        </s-table-column>
        <s-table-column prop="remark" label="备注" show-overflow-tooltip>
        </s-table-column>
      </RealPageTable>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveData">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    components: {
      RealPageTable
    },
    data() {
      return {
        dialogFlag: false,
        searchKey: '',
        batchUuids: [], // 选中的uuid集合
        selections: [], // 选中的数据集合
        ajaxObj: {
          type: 'post',
          url: '/operationAuth/getItcompGroupForOperation',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            condition: {
              content: '',
              authUuid: '',
              tempUuid: ''
            }
          }
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      tempObj: {
        type: Object,
        require: true,
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
      this.getListSelected();
    },
    methods: {
      getList() {
        let params = {
          content: this.searchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = this.selections;
      },
      getListSelected() { // 获取选中的data
        let vm = this;
        $axios.post('/operationAuth/getSelectedDeviceGroups', {
          authUuid: vm.tempObj.uuid,
          tempUuid: vm.tempObj.tempUuid
        }).then(({data}) => {
          if (data.length) {
            vm.selections = data
          }
          vm.$nextTick(() => {
            vm.getList();
          })
        });
      },
      searchHandle() {
        this.getList()
      },
      selectionChange(selections) { // 选择的数据
        this.selections = selections;
      },
      saveData() {
        this.batchUuids = this.selections.map(item => item.uuid)
        let params = {
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid,
          relUuidList: this.batchUuids
        };
        $axios.post('/operationAuth/tempSaveGroup', params).then(({data}) => {
          if (data.state) {
            this.$message({type: 'success', message: data.errormsg});
            this.dialogFlag = false;
            this.$emit('assetsUpdate', data.data);
          } else {
            this.$message({type: 'error', message: data.errormsg})
          }
        });
      }
    }
  }
</script>
<style>
  .real-search-input {
    float: right;
    width: 250px;
  }
</style>
