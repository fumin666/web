/*
create by YOU
*/


<template>
  <div class="select-dialog-wrapper">
    <s-dialog
      v-model="value"
      width="dialogWidth"
      :title="title.length > 0 ? title : (multiple?'多选表格':'单选表格')">
      <s-scrollbar wrap-class="scrollClassSelectDialog">
        <data-table
          :class="multiple ? '' : 'select-dialog-circle' "
          :paginationShow="true"
          :pagination-def="getPaginationDef()"
          :singleLineActionShow="true"
          :search-def="searchDef"
          :hasActionCol="false"
          :data="options"
          ref="selectTable"
          @selection-change="onSelectionChange"
          @current-change="onPageChange"
          @select="onSelect"
          style="width: 100%">
          <s-table-column
            type="selection"
            :selectable="selectable"
            width="45">
          </s-table-column>
          <s-table-column
            v-for="(item, index) in config"
            :prop="item.value"
            :label="item.name"
            :key="index">
          </s-table-column>
        </data-table>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="submitSelected">确定</s-button>
        <s-button @click="value = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  import DataTable from '@/components/tableCom/src/DataTable'
  export default {
    components: {
      DataTable
    },
    data () {
      return {
        value: false,
        dialogWidth: '500px',
        options: [],
        config: [],
        multiple: false,
        valueProp: 'uuid',
        selection: [],
        title: '',
        selectable: function () {
          return true
        }
      }
    },
    computed: {
      searchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入搜索条件',
          props: this.searchColumns
        }
      }
    },
    watch: {
      value (val) {
        if (val) {
          if (!this.multiple) {
            this.$nextTick(() => {
              this.$refs.selectTable.$el.querySelector('.s-table-header-wrapper .s-checkbox').style.display = 'none'
            })
          }
        }
      }
    },
    methods: {
      changeSelected (data) {
        let _self = this
        this.$nextTick(() => {
          if (!_self.multiple) {
            data = [data]
          }
          if (_self.$refs.selectTable) {
            _self.options.map(function (item) {
              if (data.indexOf(item[_self.valueProp]) !== -1) {
                _self.$refs.selectTable.toggleRowSelection(item, true)
              } else {
                _self.$refs.selectTable.toggleRowSelection(item, false)
              }
            })
          }
        })
      },
      submitSelected () {
        let _self = this
        let data = null
        if (this.selection.length > 0) {
          if (this.multiple) {
            data = this.selection.map(function (item) {
              return item[_self.valueProp]
            })
          } else {
            data = this.selection[0][this.valueProp] ? this.selection[0][this.valueProp] : ''
          }
          this.$emit('submit', data)
          this.value = false
        } else {
          this.$message.error('请选择数据')
        }
      },
      onSelectionChange (selection) {
        this.selection = selection
      },
      onSelect (selection, row) {
        let selectTable = this.$refs.selectTable;
        if (!this.multiple) {
          selection.map(function (item) {
            if (item !== row) {
              selectTable.toggleRowSelection(item)
            }
          })
        }
      },
      onPageChange(currentPage) {
        if (!this.multiple) {
          let selectTable = this.$refs.selectTable;
          selectTable.clearSelection();
        }
      },
      getPaginationDef() {
        return {
          layout: 'prev, pager, next'
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .scrollClassSelectDialog
    max-height: 500px

  .select-dialog-circle
    .s-checkbox-inner
      border-radius: 100% !important
</style>
