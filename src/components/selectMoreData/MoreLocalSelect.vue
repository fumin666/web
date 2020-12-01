<!--
 * @Author: 高建鹏
 * @Description: 本地分批渲染下拉框
 * @Position:
 * @Date: 2019-09-02 17:38:30
 * @LastEditors: mybells
 -->
<template>
  <div>
    <s-select @change="selectChange" :style="{width:width}" :loading="loading" v-model="uuid" :filter-method="filterMethod" filterable :placeholder="placeholder" v-loadmoredata="scrolldata">
      <s-option :label="item[defaultProps.label]" :value="item[defaultProps.value]" v-for="(item) in dataArr" :key="item[defaultProps.value]"></s-option>
    </s-select>
  </div>
</template>

<script>
  import {cloneDeep} from 'lodash'
  export default {
    props: {
      width: {
        type: String,
        default: '185px'
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      value: {
        type: String,
        default: ''
      },
      defaultProps: {
        type: Object,
        default: function () {
          return {
            label: 'label',
            value: 'value'
          }
        }
      }
    },
    data() {
      return {
        uuid: '',
        loading: false,
        scrolldata: {id: '.s-select-dropdown .s-select-dropdown-wrap', callback: this.loadMoreCreate, arg: {page: 0, onceCount: 100}},
        dataArr: [],
        options: [],
        optionsCopy: []
      }
    },
    created() {
      this.initData(this.data);
    },
    methods: {
      filterMethod(query) {
        if (query) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            let data = this.optionsCopy.filter(item => {
              return (item[this.defaultProps.label]).toLowerCase().includes(query.toLowerCase());
            })
            if (data.length) {
              this.options = cloneDeep(data);
            } else {
              this.options = []
            }
            this.scrolldata.arg.page = 0;
            this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
          }, 200);
        } else {
          this.options = cloneDeep(this.optionsCopy);
          this.scrolldata.arg.page = 0;
          this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
        }
      },
      loadMoreCreate(count, onceCount) {
        let total = this.options.length;
        let loopCount = Math.ceil(total / onceCount) // 渲染次数
        if (total) {
          if (count < loopCount) {
            let batchdata = cloneDeep(this.options.slice(count * onceCount, (count + 1) * onceCount));
            if (count === 0) {
              this.$set(this, 'dataArr', batchdata)
            } else {
              this.dataArr.push(...batchdata);
            }
            this.scrolldata.arg.page += 1
          }
        } else {
          this.$set(this, 'dataArr', [])
        }
      },
      selectChange(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      initData(arr) {
        if (arr && arr.length) {
          if (this.uuid) {
            // 如果uuid的选项太靠后，会选择不上。所以提前放到第一个。
            let newArr = cloneDeep(arr);
            let n = this.defaultProps.value;
            let index = 0;
            let uuid = this.uuid;
            let list = newArr.filter((item, i) => {
              if (item[n] === uuid) {
                index = i;
              }
              return item[n] === uuid
            })
            newArr.splice(index, 1);
            arr = list.concat(newArr);
          }
          this.options = cloneDeep(arr);
          this.optionsCopy = cloneDeep(arr);
          this.loadMoreCreate(0, 100)
        }
      }
    },
    watch: {
      'data'(arr) {
        this.initData(arr);
      },
      'value': {
        immediate: true,
        handler(newval, oldval) {
          if (newval && newval !== oldval) {
            this.uuid = newval;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
