### **此文件是为了说明真分页组件RealPageTable的用法**
### **功能**
主要实现了真分页（每点一次页面跳转请求一次接口）、初始行勾选中、行选中（可以翻页选中）、显示已选。

### **实现**
此组件包含了~~tablegroup~~table组件、s-checkbox UI组件、s-pagination UI组件。
多页行选中是将选中数据保存在本地数组中。每翻一次对比本页所有行数据和本地保存的选中数据行uuid。如果相同就勾选中。
显示已选是将本地选中数据~~分批（性能考虑）显示在假分页上。利用tablegroup实现。~~以真分页的方式显示在table上。切换分页实际上是截取对应页的数组对象。这样加载大数据时就不会一次全部渲染，造成页面卡顿。
注意：真分页全选只能选中本页。

### **用法**
1.此组件接收三个props：callback（为了处理接口返回值，参数是接口返回数据）、showHeaderCheckbox（是否显示‘显示已选功能’）、ajaxObj（实现接口调用和初始化选中数据）。
2.此组件主要有三个返回事件：load-callback（表格加载的数据数组）、res-callback（接口返回的数据，和callback参数是相同的）、selection-change（所有选中行数据数组）。

默认的主要props:
```js
callback: {
  type: Function
},
showHeaderCheckbox: {
  type: Boolean,
  default: false
},
ajaxObj: {
  type: Object,
  required: true,
  default: function () {
    return {
      type: 'post',
      url: '/infinitePagination',
      params: {},
      checkedUuidArr: []// 控制是否初始回显选中，没有这个就不会回显选中，当然组件还有小伙伴加的初始行选中功能。
    };
  }
}
```
3.只要ajaxObj中数据改变就立即请求接口。不能在created钩子中直接改变，因为不会触发组件watch函数。可以在mounted钩子中或者在created钩子中用$nextTick改变，就会立即请求接口。初始是不会请求接口的。不初始自动请求接口是为了防止多次调用接口。

4.主要说下props中的callback使用方法。此方法是为了防止接口返回结果不一致准备的。如果返回结果中如下格式和属性名就不用使用callback：
```js
 {
  pageList:[{},{}...]
  pageSize: 10,
  currentPage: 1,
  totalCount: 0
}
```
如果接口返回结果和上面字段和结果的不一致就需要用到callback处理数据，接口返回后会看有没有接收到callback的props。如果没有就不做处理，如果有就将接口结果引用传到callback方法的参数中。只需要将表格数据数组return就行了。当然也必须保证接口结果中最外层有totalCount属性。也可以将结果中选中的数据放到ajaxObj的checkedUuidArr数组中，一旦改变ajaxObj就会立刻请求接口，注意：在callback中不能无限改变ajaxObj否则就无限请求接口了，得做限制。
### **示例**
@\src\pages\AssetsMonitor_View\dialog\CustomSetting.vue
```html
<template>
  <RealPageTable :ajax-obj="ajaxObj" :show-header-checkbox="true" @selection-change="handleSelectionChange" :callback="handleData">
    <s-table-column type="selection" width="45">
    </s-table-column>
    <s-table-column label="资产名称" prop="assetName"></s-table-column>
    <s-table-column label="IP地址" prop="ip"></s-table-column>
    <s-table-column label="资产类型" prop="assetType"></s-table-column>
  </RealPageTable>
</template>
<script>
import $axios from 'sunflower-ajax';
import {cloneDeep} from 'lodash';
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
export default {
  components: {
    RealPageTable
  },
  data() {
    return {
      selections: [],
      ajaxObj: {
        type: 'post',
        url: '/monitorlist/getAssetlist',
        params: {
          condition: {
          }
        },
        checkedUuidArr: []// 初始要回显选中的行
      }
    }
  },
  created() {
    this.selections = cloneDeep(this.customData);//获取到初始要回显选中的行数据
  },
  mounted() {
    this.getdata();
  },
  methods: {
    handleData(data) {
      data.totalCount = data.criteria.totalCount;//引用对象最外层加totalCount属性，表示数据行总数
      return data.monitorlist;//返回表格数据数组
    },
    getdata() {
      let params = {
        assetName: this.searchForm.assetName,
        ip: this.searchForm.ip,
        citypeUuid: this.searchForm.citypeUuid ? this.searchForm.citypeUuid : this.monitorCiypeuuid
      }
      this.ajaxObj.checkedUuidArr = this.selections;//默认勾选数据
      this.ajaxObj.params.condition = cloneDeep(params);//请求接口
    },
    //勾选行调用
    handleSelectionChange(rows) {
      this.selections = rows;
    }
  }
}
</script>
```
其他一些功能可以查看具体组件RealPageTable.vue
