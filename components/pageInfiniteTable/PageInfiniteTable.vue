<template>
  <div>
    <s-table
      v-loading="loading"
      :data="tableData"
      :element-loading-text="loadingText"
      :height="height"
      :border="border"
      style="width: 100%;"
      @row-click="rowClick"
      :row-class-name="rowClassName"
      @selection-change="selectionChange"
      @filter-change="filterChangeHandler"
    >
      <slot></slot>
    </s-table>
    <s-pagination
      :total="total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      infinite
      :hasNext="hasNext"
      v-infiniteTotal="{
        show: infiniteTotalFlag,
        total: infiniteTotalCount
      }">
    </s-pagination>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  const pageNumShow = 6;

  //  function mockArr(length) {
  //    let arr = [];
  //    for (let i = 0; i < length; i++) {
  //      arr.push({});
  //    }
  //    return arr;
  //  }

  export default {
    name: 'sPageInfinite',
    data() {
      return {
        currentPage: 1,
        innerPageSize: 10,
        hasNext: true,
        totalData: [],
        total: 0,
        offsetPage: 0,
        loading: false,
        preving: false,
        infiniteTotalFlag: false,     // 此字段用来判断该无限分页组件是否需要显示"total(总条数)信息"
        infiniteTotalCount: 0         //  无限分页数据库中数据的总条数
      };
    },
    props: {
      border: {
        type: Boolean,
        default: false
      },
      pageSize: {
        type: Number,
        default: 10
      },
      pageSizes: {
        type: Array,
        default: function() {
          return [10, 20, 50, 100];
        }
      },
      loadingText: {
        type: String,
        default: ''
      },
      height: {},
      rowClassName: {},
      field: {}, // 数据库资产的数据返回的是个对象，所以需要传这个来区分取哪个数组
      ajaxObj: {
        type: Object,
        required: true,
        default: function() {
          return {
            type: 'get',
            url: '/infinitePagination',
            params: {}
          };
        }
      },
      startAjax: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      tableData: function() {
        if (!this.startAjax) {
          this.hasNext = false;
          return [];
        }
        let page = (this.currentPage - this.offsetPage) >= 0 ? (this.currentPage - this.offsetPage) : 0;
        let list = this.totalData.slice((page - 1) * this.innerPageSize, page * this.innerPageSize);
        if ((this.preving || this.hasNext) && list.length === 0) {
          this.getData();
        }
        return list;
      },
      ajaxParams: function() {
        return {
          'condition': {},
          'currentPage': this.currentPage,
          'totalCount': this.total === 0 ? -1 : (this.total + 1),
          'pageSize': this.innerPageSize,
          'pageList': this.totalData,
          'distinct': false,
          'orderByClause': ''
        };
      }
    },
    methods: {
      selectionChange(selections) {
        this.$emit('selection-change', selections);
      },
      rowClick(row) {
        this.$emit('row-click', row);
      },
      handleSizeChange(val) {
        this.innerPageSize = val;
        this.reInfinite();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      getData() {
        let params = Object.assign(this.ajaxParams, this.ajaxObj.params);
        this.loading = true;
        $axios[this.ajaxObj.type](this.ajaxObj.url, params).then(({data}) => {
          this.loading = false;
          // 判断无限分页是否需要显示总条数
          this.infiniteTotalFlag = data.hasOwnProperty('totalCount');
          this.infiniteTotalCount = data.hasOwnProperty('totalCount') ? data.totalCount : 0;

          let localData = data.dataList || data
          if (localData.length > 0) {
            if (localData.length >= pageNumShow * this.innerPageSize) {
              this.hasNext = true;
              //  this.curGroupOver = true;
            } else { // 当只有半页数据时不显示下一页
              this.hasNext = false;
            }
            if (this.total <= this.currentPage * this.innerPageSize) {
              this.total += localData.length;
            } else {
              this.total -= this.totalData.length;
            }
            this.offsetPage = Math.floor((this.currentPage - 1) / pageNumShow) * pageNumShow;
            this.totalData = localData;
          } else {
            this.hasNext = false;
          }
          this.$emit('load-callback', this.totalData);
        });
      },
      reInfinite() {
        this.offsetPage = 0;
        this.currentPage = 1;
        this.total = 0;
        this.totalData = [];
        this.hasNext = this.startAjax;
      },
      filterChangeHandler(val) {
        this.$emit('filter-change', val)
      }
    },
    watch: {
      pageSize: {
        immediate: true,
        handler(value) {
          this.innerPageSize = value;
        }
      },
      currentPage(newVal, oldVal) {
        this.preving = newVal < oldVal;
      },
      ajaxObj: {
        immediate: true,
        deep: true,
        handler(val) {
          this.reInfinite();
        }
      }
    }
  }
</script>

<style lang="stylus">
  .s-pagination
    margin-bottom: 20px
</style>
