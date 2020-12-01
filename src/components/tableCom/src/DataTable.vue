<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 11:17:44
 * @LastEditTime : 2019-12-27 14:51:42
 * @LastEditors  : mybells
 -->
<template>
  <div class="sc-table">
    <s-row class="tool-bar" type="flex" v-if="singleLineActionShow">
      <s-col class="actions" :span="innerActionsDef.width" :offset="innerActionsDef.offset" v-if="actionsShow">
        <action-bar :actions="innerActionsDef.def"></action-bar>
        <checkbox-group  v-if="checkboxShow" :checks="innerCheckboxFilterDef.def" @checkChange="handleFilterChange"></checkbox-group>
      </s-col>
      <s-col class="search" :span="innerSearchDef.width" :offset="innerSearchDef.offset" v-if="searchShow">
        <s-input v-model.trim="searchKey" :placeholder="innerSearchDef.placeholder" icon="magnifier"></s-input>
      </s-col>
    </s-row>
    <!--<s-scrollbar :wrap-style="wrapStyle">-->
    <s-table :data="curTableData" @sort-change="handleSort" :border="border" :fit="fit" :stripe="stripe"
             :height="height"
             :max-height="maxHeight"
             :show-header="showHeader"
             @row-click="handleRowClick" @selection-change="handleSelectChange" @select="handleSelect" @filter-change="filterChange"
             @select-all="handleSelectAll" @current-change="handleCurrentRowChange" :row-class-name="rowClassName"
             :highlight-current-row="highlightCurrentRow" :default-sort="defaultSort" ref="sTable"
             style="width: 100%;">
      <slot></slot>
      <s-table-column
        :label="actionColLabel"
        prop="innerRowActions"
        v-if="hasActionCol"
        :min-width="actionColWidth"
        :show-overflow-tooltip="false"
        :show-tooltip-when-overflow="false">
        <template slot-scope="scope">
          <div class="action-list">
            <span v-for="action in rowActionDef">
              <span v-if="action.btnName ? judgeRoleBtn(action.btnName) : true">
                 <i v-if="action.hiddened ? action.hiddened(scope.row) : true" :class="`iconfont icon-${action.type}`" :title="action.name"
                    :style="action.disabled ? scope.row[action.disabled] ? '' : 'color: #7e848d; cursor: not-allowed' : ''"
                    @click="action.handler(scope.row)"></i>
              </span>
            </span>
          </div>
        </template>
      </s-table-column>
    </s-table>
    <!--</s-scrollbar>-->
    <div class="pagination-wrap" v-if="paginationShow">
      <s-pagination v-if="!simplePagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="innerPaginationDef.pageSizes"
                    :page-size="internalPageSize"
                    :layout="innerPaginationDef.layout" :total="total">
      </s-pagination>
      <s-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="total" v-if="simplePagination">
      </s-pagination>
    </div>
  </div>
</template>

<script type="text/babel">
  import ActionBar from './actionBar'
  import CheckboxGroup from './CheckboxGroup'
  // import SearchBox from './SearchBox'
  import {isEqual, cloneDeep} from 'lodash'
  export default {
    name: 'DataTables',
    components: {
      ActionBar,
      CheckboxGroup
    },
    created() {
      this.innerActionsDef = Object.assign({}, {
        def: [],
        width: 5,
        offset: 0
      }, this.actionsDef)

      this.innerCheckboxFilterDef = Object.assign({}, {
        props: undefined,
        def: [],
        width: 14,
        offset: 0,
        filterFunction: undefined
      }, this.checkboxFilterDef)

      this.innerSearchDef = Object.assign({}, {
        show: true,
        props: undefined,
        filterFunction: undefined,
        width: 5,
        placeholder: '',
        offset: 0
      }, this.searchDef)

      this.innerPaginationDef = Object.assign({}, {
        layout: 'total, sizes, prev, pager, next, jumper',
        pageSize: 10,
        pageSizes: [10, 20, 50, 100],
        currentPage: 1
      }, this.paginationDef)
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      fit: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: false
      },
      stripe: {
        type: Boolean,
        default: false
      },
      actionsDef: {
        type: Object,
        default() {
          return {}
        }
      },
      checkboxFilterDef: {
        type: Object,
        default() {
          return {}
        }
      },
      searchDef: {
        type: Object,
        default() {
          return {}
        }
      },
      rowActionDef: {
        type: Array,
        default() {
          return []
        }
      },
      actionColLabel: {
        type: String,
        default: '操作'
      },
      hasActionCol: {
        type: Boolean,
        default: true
      },
      actionColWidth: String,
      colNotRowClick: {
        type: Array,
        default() {
          return []
        }
      },
      paginationDef: {
        type: Object,
        default() {
          return {}
        }
      },
      singleLineActionShow: {
        type: Boolean,
        default: false
      },
      paginationShow: {
        type: Boolean,
        default: true
      },
      simplePagination: {
        type: Boolean,
        default: false
      },
      height: [String, Number],
      maxHeight: [String, Number],
      rowClassName: [String, Function],
      highlightCurrentRow: Boolean,
      defaultSort: Object,
      showHeader: {
        type: Boolean,
        default: true
      },
      wrapStyle: {
        type: String,
        default: 'max-height: 9999px;'
      }
    },
    data() {
      return {
        sortData: {},
        currentPage: 1,
        internalPageSize: 20,
        searchKey: '',
        checkedFilters: [],
        innerActionsDef: {},
        innerCheckboxFilterDef: {},
        innerSearchDef: {},
        innerPaginationDef: {},
        oldSelectionList: [],
        selectionList: [],
        memorySelection: [],
        lastSeed: '000',
        seed: '000'
      }
    },
    computed: {
      innerColNotRowClick() {
        return this.colNotRowClick.concat(['innerRowActions'])
      },
      tableData() {
        let newData = this.data.slice()

        let doFilter = function (defaultFilterFunction, filter, value) {
          let filterFunction = filter.filterFunction || defaultFilterFunction

          newData = newData.filter(el => {
            return filterFunction(el, filter)
          })
        }

        this.filters.forEach((filter) => {
          let val = filter.val
          if (!val || val.length === 0) {
            return true
          }
          let defaultFilterFunction
          if (filter.props) {
            // the filter is for some special column
            if (!(val instanceof Array)) {
              // filter value is not list
              defaultFilterFunction = function (el, filter) {
                return filter.props.some(prop => {
                  // 提供嵌套字段搜索，如：a.b
                  let result = '';
                  if (prop.indexOf('.') !== -1) {
                    let propArr = prop.split('.');
                    result = el[propArr[0]];
                    if (result instanceof Object) {
                      for (let i = 1, length = propArr.length; i < length; i++) {
                        result = result[propArr[i]];
                      }
                    }
                  } else {
                    result = el[prop];
                  }
                  if (result !== null) {
                    let field = (result instanceof String) ? result : (result + '');
                    return field.toLowerCase().indexOf(filter.val.toLowerCase()) > -1
                  }
                })
              }
            } else if (val instanceof Array && val.length > 0) {
              // filter value is list, at the same time not empty
              defaultFilterFunction = function (el, filter) {
                return filter.props.some(prop => {
                  return filter.val.indexOf(el[prop].toLowerCase()) > -1
                })
              }
            }
          } else {
            // filter is for all column
            defaultFilterFunction = function (el, filter) {
              return Object.keys(el).some(key => {
                return String(el[key]).toLowerCase().indexOf(filter.val.toLowerCase()) > -1
              })
            }
          }
          doFilter(defaultFilterFunction, filter)
        })

        if (this.sortData.order) {
          let order = this.sortData.order
          let prop = this.sortData.prop
          let isDescending = order === 'descending'

          newData.sort(function (a, b) {
            if (a[prop] > b[prop]) {
              return 1
            } else if (a[prop] < b[prop]) {
              return -1
            } else {
              return 0
            }
          })
          if (isDescending) {
            newData.reverse()
          }
        }
        this.$emit('filtered-data', newData)
        this.seed = Math.random()
        return newData
      },
      curTableData() {
        let data = []
        if (this.paginationShow) {
          let from = this.internalPageSize * (this.currentPage - 1)
          let to = from + this.internalPageSize
          data = this.tableData.slice(from, to)
        } else {
          data = this.tableData;
        }
        if (this.lastSeed !== this.seed) {
          this.$nextTick(() => {
            this.oldSelectionList = this.oldSelectionList.concat(cloneDeep(this.memorySelection))
            if (this.oldSelectionList.length > 0) {
              let sTable = this.$refs.sTable
              // filter将选中的从旧列表中过滤，并加入新列表
              this.oldSelectionList = this.oldSelectionList.filter((item) => {
                // 找到所有需要选中的数据，进行选中
                for (let key in data) {
                  if (isEqual(item, data[key])) {
                    sTable.toggleRowSelection(data[key], true)
                    return false
                  }
                }
                return true
              })
            }
          })
          this.lastSeed = this.seed
          this.memorySelection = []
        }
        return data
      },
      total() {
        return this.tableData.length
      },
      checkboxShow() {
        return this.innerCheckboxFilterDef.def.length > 0
      },
      searchShow() {
        return this.innerSearchDef.show !== false
      },
      actionsShow() {
        // console.log(this.innerActionsDef.def);
        return this.innerActionsDef.def.length > 0
      },
      filters() {
        let filters = []
        if (this.searchShow) {
          filters.push({
            props: this.formatProps(this.innerSearchDef.props),
            val: this.searchKey,
            filterFunction: this.innerSearchDef.filterFunction
          })
        }
        if (this.checkboxShow) {
          filters.push({
            props: this.formatProps(this.innerCheckboxFilterDef.props),
            val: this.checkedFilters,
            filterFunction: this.innerCheckboxFilterDef.filterFunction
          })
        }
        return filters
      }
    },
    methods: {
      clearSearch() {
        this.searchKey = ''
      },
      formatProps(props) {
        return props ? [].concat(props) : undefined
      },
      toggleRowSelection (row, selected) {
        this.$refs.sTable.toggleRowSelection(row, selected);
      },
      handleSort(obj) {
        this.sortData = obj
      },
      handleSizeChange(size) {
        this.internalPageSize = size
      },
      handleCurrentChange(currentPage) {
        this.currentPage = currentPage
        this.$emit('current-change', currentPage);
      },
      handleFilterChange(checkedFilters) {
        this.checkedFilters = checkedFilters
      },
      handleRowClick(row, event, column) {
        if (column && this.innerColNotRowClick.indexOf(column.property) === -1) {
          this.$emit('row-click', row)
        }
      },
      handleSelectChange(selection) {
        // 上次的selection值
        this.memorySelection = this.selectionList
        // 当前的selection值
        this.selectionList = cloneDeep(selection)
        // 将selection-change事件的值改为oldSelectionList + selectionList
        this.$nextTick(() => {
          this.$emit('selection-change', this.oldSelectionList.concat(this.selectionList))
        })
      },
      handleSelect(selection, row) {
        this.$emit('select', selection, row)
      },
      filterChange(filters) {
        this.$emit('filter-change', filters)
      },
      handleSelectAll(selection) {
        this.$emit('select-all', selection)
      },
      handleCurrentRowChange(currentRow, oldCurrentRow) {
        this.$emit('current-change', currentRow, oldCurrentRow)
      }
    },
    watch: {
      innerPaginationDef: {
        immediate: true,
        handler(val) {
          this.internalPageSize = val.pageSize
          this.currentPage = val.currentPage
        }
      },
      internalPageSize: {
        immediate: true,
        handler(val) {
          this.seed = Math.random()
        }
      },
      currentPage: {
        immediate: true,
        handler(val) {
          this.seed = Math.random()
        }
      },
      data: {
        immediate: true,
        deep: true,
        handler() {
          this.oldSelectionList = []
          this.memorySelection = []
          this.selectionList = []
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .sc-table {
    & .tool-bar {
      margin-bottom: 10px;
    }
    .pagination-wrap {
      text-align: center;
      margin-top: 10px;
    }
  }
</style>
