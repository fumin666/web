<template>
  <section>
    <s-scrollbar wrap-class="dynamicColSetScroll">
      <s-checkbox
        v-model="checkAll"
        value-key="uuid"
        :indeterminate="isIndeterminate"
        @change="checkAllChange">全选</s-checkbox>
      <div class="checkAllDivide"></div>
      <s-checkbox-group
        v-model="checkedCols"
        @change="checkedColsChange">
        <s-checkbox
          v-for="col in cols"
          :label="col.colName"
          :key="col.uuid">
        </s-checkbox>
      </s-checkbox-group>
      <s-row class="dynamicColSetFooter">
        <s-button @click="saveDynamicColSet">确定</s-button>
        <s-button type="cancel" @click="cancelDynamicColSet">取消</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default{
    data() {
      return {
        checkAll: false,
        isIndeterminate: false,
        cols: [],              // 可设置的动态列
        checkedCols: []        // 选中的动态列
      }
    },
    props: {
      eventType: {
        type: Number,
        required: true
      }
    },
    methods: {
      checkAllChange(val) {
        this.checkedCols = val ? this.cols.map(item => {
          return item.colName
        }) : [];
        this.isIndeterminate = false;
      },
      checkedColsChange(value) {
        this.checkedCols = []
        this.checkedCols = value
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cols.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cols.length;
      },
      // 取消动态列设置
      cancelDynamicColSet() {
        this.$emit('closeDynColSet')
      },
      /**
       * 保存动态列设置
       */
      saveDynamicColSet() {
        if (this.checkedCols.length < 1) {
          this.$message({
            type: 'warning',
            message: '至少需要展示一列信息！'
          })
          return
        }
        // 构造上传参数uuidList字段(即未选选项)
        let colUuids = this.cols.filter(item => {
          return this.checkedCols.indexOf(item.colName) === -1
        }).map(item => {
          return item.uuid
        })
        // 上传参数
        let sendData = {
          type: this.eventType,
          uuidList: colUuids
        }
        // 保存动态列设置请求
        $axios.post('/eventColSet/update', sendData).then(({data}) => {
          if (data) {
            // 构造$emit负载参数(勾选选项)
            let emitData = []
            this.cols.forEach(item => {
              if (this.checkedCols.indexOf(item.colName) !== -1) {
                emitData.push(item)
              }
            })
            this.$emit('closeDynColSet', emitData)
          }
        })
      }
    },
    created() {
      /**
       * 获取动态列所有可选项并初始化已选选项
       */
      $axios.get(`/eventColSet/getAllByType/${this.eventType}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.cols = data
          // 默认勾选已选选项
          data.forEach((item) => {
            if (item.status === 1) {
              this.checkedCols.push(item.colName)
            }
          })
          // 处理初始全选按钮状态
          let checkedColsLength = this.checkedCols.length
          let colsLength = this.cols.length
          if (checkedColsLength === this.cols.length) {
            this.checkAll = true
          } else {
            this.isIndeterminate = checkedColsLength > 0 && checkedColsLength < colsLength;
          }
        }
      })
    }
  }
</script>
