<template>
  <s-dialog v-model="dialogFlag" title="列" width="200px" class="interfaceDyColDialog">
    <s-scrollbar wrap-style="max-height: 450px;padding-right: 17px;">
      <s-checkbox-group v-model="checkList">
        <s-checkbox
          v-for="(item,index) in headList"
          :key="'head' + index"
          :label="item"
        ></s-checkbox>
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
        headList: [],
        checkList: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      allCols: {
        type: Array
      },
      useCols: {
        type: Array
      },
      citypeUuid: {
        type: String
      }
    },
    created() {
      this.headList = this.allCols[0].filter(item => item !== 'monitorId' && item !== 'monitorType');
      this.checkList = this.headList.filter(item => this.useCols.indexOf(item) !== -1);
      this.$nextTick(this.doLayout);
    },
    methods: {
      doLayout() {
        let scrollEle = document.querySelector('.sysScrollHeight.s-scrollbar-wrap');
        let tableHeight = document.querySelector('.listArea').clientHeight;
        this.$nextTick(() => {
          let dialogEle = document.querySelector('.interfaceDyColDialog > .s-dialog');
          if (scrollEle.offsetHeight - (scrollEle.scrollHeight - tableHeight - scrollEle.scrollTop) > 500 - 80) {
            // 35: header高度,32: 设置按钮高度
            dialogEle.style.top = scrollEle.scrollHeight - tableHeight - scrollEle.scrollTop + 35 + 32 + 'px';
          } else {
            let dialogHeight = dialogEle.offsetHeight;
            dialogEle.style.top = scrollEle.scrollHeight - tableHeight - scrollEle.scrollTop - dialogHeight + 'px';
          }
        })
      },
      dialogOk() {
        if (this.checkList.length === 0) {
          this.$message({showClose: true, message: '至少选中一个!', type: 'info'});
          return;
        }
        $axios.post(`/resourcemanager/assetmanage/assetRuning/setInterfaceTableHide/${this.citypeUuid}`, this.checkList).then(({data}) => {
          if (data === 'success') {
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({message: '保存失败!', type: 'warning'});
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

</style>
