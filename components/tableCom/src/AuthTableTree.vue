<!--
 * @Author: songyf
 * @Date: 2019-11-5
 * @LastEditors: LaMando
 * @Description: 针对授权策略的特殊要求单独编写tableTree
 -->
<template>
  <section class="auth-tree-box">
    <s-row class="handler-btns" type="flex" justify="between">
      <s-col>
        <s-checkbox
          v-model="showSelection"
          v-if="showHeaderCheckbox"
          @change="handleCheckboxChange"
          style="margin-top: 6px; margin-bottom: 12px;" >显示已选</s-checkbox>
      </s-col>
      <s-col>
        <slot name="rightBtn"></slot>
      </s-col>
    </s-row>
    <div>
      <slot name="allSet"></slot>
    </div>
    <s-table
      ref="treeTable"
      class="s-tree-table auth"
      :data="treeArray"
      highlight-current-row
      :cell-class-name="cellClassName"
      @current-change="handleCurrentChange"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      :row-style="rowStyle">
      <s-table-column
        :selectable="isSelectable"
        type="selection"
        width="34">
      </s-table-column>
      <s-table-column
        show-overflow-tooltip
        v-for="(value, index) in config"
        :key="index"
        :class-name="(index + 1) === treeIndex ? 's-tree-index-col' : 's-tree-noindex-col' "
        :label="value.title"
        :min-width="60"
        :width="value.width">
        <template slot-scope="scope">
        <span @click="toggleChildren(scope.row)"
              v-if="!showSelection"
              :class="'s-tree-col-icon iconfont tabletree-color ' + (scope.row.children.length !== 0 ? (scope.row.__open ? 'icon-bottom' : 'icon-right') : 'icon-empty')"
              :style="'margin-left:' + (scope.row.__level * 24) + 'px'"></span>
          {{ scope.row[value.property] }}
        </template>
      </s-table-column>
      <slot></slot>
    </s-table>
  </section>
</template>

<script type="text/babel">
  import Vue from 'vue'
  import {cloneDeep} from 'lodash';
  export default {
    name: 'authTableTree',
    data() {
      return {
        showSelection: false,
        currentRow: null,
        treeArray: []
      }
    },
    mounted() {
    },
    watch: {
      data: {
        handler(val) {
          this.showSelection = false;
          this.getTreeData();
        }
      }
    },
    methods: {
      getTreeData() {
        if (!this.showSelection) {
          this.treeArray = this.parseTreeToArray(this.data)
        } else {
          this.treeArray = cloneDeep(this.selections)
        }
        if (this.selections.length) {
          this.setCheck(this.selections);
        }
      },
      parseTreeToArray(parent, level) {
        let array = []
        let tree = parent.children === undefined ? parent : parent.children
        if (!level) {
          level = 0
        }
        for (let i = 0; i < tree.length; i++) {
          Vue.set(tree[i], '__level', level)
          Vue.set(tree[i], '__show', this.defaultExpand)
          if (parent !== tree) {
            Vue.set(tree[i], '__parent', parent)
          }
          array.push(tree[i])
          if (tree[i].children) {
            if (tree[i]['__open'] === false) {
              Vue.set(tree[i], '__open', false)
            } else {
              Vue.set(tree[i], '__open', this.defaultExpand)
              this.parseTreeToArray(tree[i], level + 1).map(function (value) {
                array.push(value)
              })
            }
          }
        }
        return array;
      },
      setCheck(data) { // 勾选选中项
        let uuidList = data.map(item => item.uuid)
        this.$nextTick(() => {
          this.treeArray.map(item => {
            if (uuidList.includes(item.uuid)) {
              this.$refs.treeTable.toggleRowSelection(item, true)
            }
          })
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        this.$emit('current-change', val)
      },
      toggleChildren(val) {
        val.__open = !val.__open
      },
      rowStyle(row, index) {
        let display = '';
        row.__show = row.__parent ? (row.__parent.__show && row.__parent.__open) : true
        display = row.__show ? '' : 'display: none;';
        return display;
      },
      // 选中时不选根节点
      handleSelectAll(selection) {
        this.$emit('select-all', selection)
      },
      handleSelectionChange(selection) {
        this.$emit('selection-change', selection);
      },
      handleCheckboxChange(val) { // 显示已选
        this.getTreeData();
        if (val) {
          this.$emit('selection-change', this.selections);
        }
      },
      cellClassName(item) { // 隐藏复选框
        if (item.row.haveCheckbox === false) {
          return 'no-checkbox'
        }
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        row.select ? flag = true : flag = false
        return flag
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      },
      showHeaderCheckbox: {
        type: Boolean,
        default: true
      },
      useVirtual: {
        type: Boolean,
        default: false
      },
      height: [String, Number],
      rowHeight: {
        type: Number,
        default: 48
      },
      excessRows: {
        type: Number,
        default: 5
      },
      config: {
        type: Array,
        default: () => {
          return []
        }
      },
      treeIndex: {
        type: Number,
        default: 1
      },
      // 是否默认展开
      defaultExpand: {
        type: Boolean,
        default: true
      },
      selections: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style lang="stylus">
  .s-tree-table .s-table-row{
    line-height: 30.5px;
  }
  .s-tree-table .s-tree-col-icon{
    margin-right: 0;
  }
  .s-tree-table .s-tree-col-icon:before {
    display: inline-block!important;
    vertical-align: bottom!important;
    line-height: 24px!important;
  }
  .s-tree-table .s-tree-col-icon.icon-emptys:before{
    box-sizing: border-box;
    display: block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
  }
  .s-tree-table .s-tree-col-icon .s-checkbox-inner{
    border-radius: 50%;
  }
  .s-tree-table .s-tree-col-icon .s-checkbox{
  }
  .s-tree-table .data-wrapper{
    float: none!important;
  }
  .s-tree-table .cell .iconfont{
    line-height: 25px!important;
    margin-right: 10px!important;
  }
  .s-tree-table.auth .s-checkbox-inner:after{
    top: 2px;
    height: 8px!important;
  }
  .auth-tree-box
    .no-checkbox
      .s-checkbox
        display none
</style>

