### **此文件是为了说明数据非常多时下拉框组件的用法（后面也带了一个无限滚动列表的例子）**

### **原因**
电信项目有一个需求，需要下拉框加载几万条数据，就会导致页面渲染dom卡顿。解决方法也可以用UI库中Select远程搜索的本地操作方法实现（UI库有例子），但是不能够显示所有数据只能显示过滤搜索的数据，如果过滤后的数据依旧庞大那么这种方法也会出现问题。为了更清楚的展示所有数据。所以写了这个组件。

### **具有的功能**
1. 初始显示选中项。
2. 有过滤搜索功能。
3. 只实现了单选，没有实现多选。如果需要多选大数据的话可以参考（UI库Select中远程搜索的例子）
4. 数据<=100条时全部加载。当数据大于100条时，首先加载100条数据，当滚动条滑到底部时再加载100条数据依次类推，直到全部显示。

### **实现逻辑**
首先写了一个全局指令v-loadmoredata。作用是当滚动条滑到底部时触发函数。列表渲染也可以使用这个指令。实现过程中遇到了一个问题，初始显示选中项的问题，因为数据量过大，如果选中项是非常靠数据后面的话，就会导致不能显示出选中项。所以最后将选中的数据放到第一条。这个组件的核心思想就是分批加载数据。这样渲染dom的压力就会变小。具体代码实现就不写了有兴趣的可以查看src\components\selectMoreData\MoreLocalSelect.vue文件。

### **使用方法**
1. 此组件可接受的props：
```js
    props: {
      width: {//选择框长度
        type: String,
        default: '185px'
      },
      placeholder: {//holder
        type: String,
        default: '请选择'
      },
      data: {//需要加载的所有数据
        type: Array,
        default: function () {
          return []
        }
      },
      value: {//v-model的初始选中值
        type: String,
        default: ''
      },
      defaultProps: {//配置项
        type: Object,
        default: function () {
          return {
            label: 'label',//显示文字字段名
            value: 'value'//实际值字段名
          }
        }
      }
    },
```
2. 再说下v-loadmoredata指令的用法
可以用在所有滚动到底部触发函数的地方。具体实现在src\common\directive\moreDataScroll\index.js中。

需要在使用的组件上写 `v-loadmoredata="scrolldata"`。scrolldata是一个对象，对象中有三个属性：节点id或者class、callback回调函数、arg是回调函数的参数。可以通过改变arg中的page控制页数。
```js
scrolldata: {id: '.s-select-dropdown .s-select-dropdown-wrap', callback: this.loadMoreCreate, arg: {page: 0, onceCount: 100}},
```

### **例子**
1. select(可以查看./example/moreLocalSelectExample.vue文件)
```html
<template>
  <div>
    <moreselect v-model="value" :data="selectData" :defaultProps="defaultProps" @change="change"></moreselect>
  </div>
</template>
<script>
  import moreselect from '../MoreLocalSelect';
  import { selectData } from '@/common/utils/mockData.js';
  export default {
    components: {
      moreselect
    },
    data() {
      return {
        value: '100000',
        selectData: [],
        defaultProps: {
          label: 'label',
          value: 'uuid'
        }
      }
    },
    created() {
      this.selectData = selectData.data;
    },
    methods: {
      change(val) {}
    }
  }
</script>
```

2. 列表滚动加载(具体可以查看./example/moreLocalListExample.vue文件)
```html
<template>
  <div>
    <ul>
      <s-scrollbar wrap-style="height:calc(100vh - 240px);" v-loadmoredata="scrolldata">
        <li v-for="item in userArr" :key="item.uuid">
          {{ item.userLoginName}}
        </li>
      </s-scrollbar>
    </ul>
  </div>
</template>
<script>
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        scrolldata: {id: '.s-scrollbar-wrap', callback: this.loadMoreCreate, arg: {page: 0, onceCount: 50}},
        userArr: [],
        userList: [],
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.userList = cloneDeep(data);
        this.loadMoreCreate(this.scrolldata.arg.page, this.scrolldata.arg.onceCount)
      },
      loadMoreCreate(count, onceCount) {
        let total = this.userList.length;
        let loopCount = Math.ceil(total / onceCount) // 渲染次数
        if (total) {
          if (count < loopCount) {
            let batchdata = cloneDeep(this.userList.slice(count * onceCount, (count + 1) * onceCount));
            if (count === 0) {
              this.$set(this, 'userArr', batchdata)
            } else {
              this.userArr.push(...batchdata);
            }
            this.scrolldata.arg.page += 1
          }
        } else {
          this.$set(this, 'userArr', [])
        }
      }
    }
  }
</script>
```
