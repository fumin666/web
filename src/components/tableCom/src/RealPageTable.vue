<!--
 * @Author: 高建鹏
 * @Date: 2019-07-11 10:19:33
 * @LastEditors: mybells
 * @Description: 真分页，点一页请求一次接口
 -->
<template>
<div>
  <s-row class="handler-btns" type="flex" justify="between">
    <s-col>
      <s-checkbox
          v-model="showSelection"
          v-if="showHeaderCheckbox"
          @change="handleCheckboxChange"
          style="margin-top: 6px; margin-bottom: 12px;" >显示已选</s-checkbox>
      <slot name="leftBtn"></slot>
    </s-col>
    <s-col>
      <slot name="rightBtn"></slot>
    </s-col>
  </s-row>
  <s-table ref="stable"
    :height="heightSize"
    :row-height="rowHeight"
    :use-row-key="useRowKey"
    :excess-rows="excessRows"
    :useVirtual="useVirtual"
    :key="keyid" :stripe="stripe" :data="totalData"  @filter-change="handleFilterChange" v-loading="loading" :element-loading-text="loadingText" :max-height="maxHeight" style="width: 100%;" @row-click="rowClick" :row-class-name="rowClassName" @select="selectionChange" @select-all="selectAllChange">
    <slot></slot>
  </s-table>
  <s-pagination :total="formInline.totalCount" :pager-count="5" :current-page="formInline.currentPage" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="formInline.pageSize" :layout=layout style="margin-top: 15px">
  </s-pagination>
</div>
</template>

<script>
import $axios from 'sunflower-ajax';
import {cloneDeep, remove, unionBy, pullAllBy, chunk} from 'lodash';

export default {
  name: 'sRealPageTable',
  components: {},
  data() {
    return {
      tempHeight: 0,
      heightSize: 0,
      totalData: [],
      showSelection: false,
      total: 0,
      loading: false,
      selections: [],
      copySelections: [], // 用于显示已选用
      form: { // 根据分页、查询条件查询列表的参数
        condition: {},
        currentPage: 1,
        pageSize: 10,
        totalCount: 0
      }
    };
  },
  props: {
    keyid: {
      type: [String, Number]
    },
    useVirtual: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 48
    },
    useRowKey: {
      type: Boolean,
      default: false
    },
    excessRows: {
      type: Number,
      default: 5
    },
    callback: {
      type: Function
    },
    fit: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      tyle: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: ''
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    showHeaderCheckbox: {
      type: Boolean,
      default: false
    },
    isBatchLoading: {
      type: Boolean,
      default: false
    },
    height: [String, Number],
    maxHeight: [String, Number],
    rowClassName: {},
    ajaxObj: {
      type: Object,
      required: true,
      default: function () {
        return {
          type: 'post',
          url: '/infinitePagination',
          params: {},
          checkedUuidArr: []// 控制是否回显，没有这个就不会回显
        };
      }
    }
  },
  computed: {
    formInline() {
      return Object.assign(this.form, this.ajaxObj.params);
    }
  },
  methods: {
    handleFilterChange(filters) {
      this.$emit('filter-change', filters)
    },
    handleCheckboxChange(val) {
      this.form.currentPage = 1;
      this.getTableData(this.callback, true);
      if (val) {
        this.$emit('selection-change', this.selections);
      }
    },
    selectAllChange(selections) {
      if (this.$refs.stable.store.states.isAllSelected) { // 点击时全选是选中的状态，就是取消全选
        this.selections = pullAllBy(this.selections, this.totalData, 'uuid')
      } else {
        this.selections = unionBy(selections, this.selections, 'uuid')
      }
      this.$emit('selection-change', this.selections);
    },
    selectionChange(selections, row) {
      let uuidArr = this.selections.map(item => item.uuid);
      if (uuidArr.includes(row.uuid)) {
        remove(this.selections, (item) => { return item.uuid === row.uuid })
      } else {
        this.selections.push(row);
      }
      this.$emit('selection-change', this.selections);
    },
    rowClick(row) {
      this.$emit('row-click', row);
    },
    /* 页码 */
    handleSizeChange(curPageSize) {
      this.formInline.currentPage = 1;
      this.formInline.pageSize = curPageSize;
      this.getTableData(this.callback);
    },
    /* 分页 */
    handleCurrentChange(current) {
      if (current === this.formInline.currentPage) return;
      this.formInline.currentPage = current;
      this.getTableData(this.callback);
    },
    getTableData(callback, flag) {
      if (!this.showSelection) {
        let params = Object.assign({}, this.formInline);
        params.totalCount = 0
        this.loading = true;
        $axios[this.ajaxObj.type](this.ajaxObj.url, params).then(({data}) => {
          let resData = [];
          if (typeof callback === 'function') {
            resData = callback(data);
          } else {
            resData = data.pageList;
          }
          if (this.useVirtual) {
            if (!resData.length) {
              this.heightSize = 105
            } else if ((resData.length + 1) * parseInt(this.rowHeight) < parseInt(this.height)) {
              this.heightSize = (resData.length + 1) * parseInt(this.rowHeight);
            } else {
              this.heightSize = this.tempHeight;
            }
          }
          if (this.isBatchLoading) {
            this.totalData = []
            let chunkArr = chunk(resData, 10);
            let i = 0;
            let that = this;
            let s = requestAnimationFrame(function fn() {
              if (chunkArr.length) {
                that.totalData.push(...chunkArr[i])
                if (that.loading) {
                  that.loading = false;
                }
                }
                i++;
                if (i < chunkArr.length) {
                  requestAnimationFrame(fn)
                } else {
                  window.cancelAnimationFrame(s);
                  that.formInline.totalCount = data.totalCount;
                  that.$emit('load-callback', that.totalData);// 表格加载的数据
                  that.$emit('res-callback', data);// 请求回来的数据
                  that.$emit('successFun', true);// 请求成功的标识
                  // 回显选中项
                  if (that.selections.length) {
                    that.setCheck(that.selections);
                  }
                }
            })
          } else {
            this.totalData = resData;
            this.loading = false;
            this.formInline.totalCount = data.totalCount;
            this.$emit('load-callback', this.totalData);// 表格加载的数据
            this.$emit('res-callback', data);// 请求回来的数据
            this.$emit('successFun', true);// 请求成功的标识
            // 回显选中项
            if (this.selections.length) {
              this.setCheck(this.selections);
            }
          }
        });
      } else {
        if (flag) {
          this.copySelections = cloneDeep(this.selections);
        }
        let total = this.copySelections.length;// 总数
        this.formInline.totalCount = total;
        let curentToltal = this.formInline.pageSize;// 每批加载数目
        this.totalData = this.copySelections.slice((this.formInline.currentPage - 1) * curentToltal, this.formInline.currentPage * curentToltal);
        if (this.selections.length) {
          this.setCheck(this.selections);
        }
      }
    },
    setCheck(data) {
      let uuidList = data.map(item => item.uuid)
      this.$nextTick(() => {
        this.totalData.map(item => {
          if (uuidList.includes(item.uuid)) {
            this.$refs.stable.toggleRowSelection(item, true)
          }
        })
      })
    },
    init() {   // 用于选中默认已经选中的记录
      this.getTableData(this.callback);
      if (this.ajaxObj.checkedUuidArr && this.ajaxObj.checkedUuidArr.length) {
        this.selections = cloneDeep(this.ajaxObj.checkedUuidArr);
      } else {
        this.selections = [];
        this.$refs.stable.clearSelection();
      }
    }
  },
  watch: {
    ajaxObj: {
      // immediate: true,
      deep: true,
      handler(val) {
        this.showSelection = false;
        this.form.currentPage = 1;
        this.getTableData(this.callback);
        if (val.checkedUuidArr && val.checkedUuidArr.length) {
          this.selections = cloneDeep(val.checkedUuidArr);
        } else {
          this.selections = [];
          this.$refs.stable.clearSelection();
        }
        if (this.useVirtual) {
          if (!this.height) {
            this.heightSize = 600;
          } else {
            this.heightSize = parseInt(this.height);
          }
          this.tempHeight = parseInt(this.heightSize);
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.s-pagination
  margin-bottom: 20px
</style>
