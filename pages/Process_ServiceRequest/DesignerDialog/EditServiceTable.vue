<template>
  <section id="editServiceTable">
    <s-table-page
      :data="requestServiceList"
      singleLineActionShow
      :header-search="defSearch()"
      key="requestServiceList">
      <s-table-column width="70">
        <template slot-scope="scope">
          <s-radio v-model="editServiceUuid" :label="scope.row.uuid" :key="scope.$index">&nbsp;</s-radio>
        </template>
      </s-table-column>
      <s-table-column label="目录一级" prop="firstCatalogName"></s-table-column>
      <s-table-column label="目录二级" prop="node.name"></s-table-column>
      <s-table-column label="服务名称" prop="node.requestName"></s-table-column>
      <s-table-column label="创建时间" prop="node.createTime" sortable>
        <template slot-scope="scope">
          <span v-text="formatDate(scope.row.node.createTime)"></span>
        </template>
      </s-table-column>
    </s-table-page>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        requestServiceList: [],
        editServiceUuid: ''
      }
    },

    methods: {
      // 表头查询定义
      defSearch() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入目录一级、目录二级、服务名称查询',
          searchProps: ['node.name', 'firstCatalogName', 'node.requestName'] // can be string or Array
        }
      },
      /**
       * 时间格式化(s -> yyyy-MM-dd HH:mm:ss)
       * @param seconds
       * @returns {string}
       */
      formatDate(seconds) {
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      },
      // 获取服务请求列表
      getRequestServiceList() {
        $axios.get('/itilServiceRequest/getDesignerOffLineAndOnLine').then(({data}) => {
          if (data && data instanceof Array) {
            data.forEach(item => {
              item.childrenList.forEach(list => {
                this.requestServiceList.push({
                  ...list,
                  firstCatalogName: item.name,
                  firstCatalogUuid: item.uuid
                });
              });
            });
          }
        });
      }
    },
    created() {
      this.getRequestServiceList();   // 获取服务请求列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
