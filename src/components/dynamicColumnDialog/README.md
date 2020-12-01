### **此文件是为了说明动态列设置组件的用法**
### **功能**
实现了拖拽排序功能、动态列显示和隐藏设置、全部列显示和隐藏设置、自定义设置。

### **实现**
基于Popover弹窗组件实现弹窗,draggable拖拽插件实现排序功能。

### **用法**
1. 此组件接收两个props：dynamicData(动态列对象数组)、option(接收一个对象，包含弹出框title、唯一key、每列名字nameKey、是否显示属性名showKey、排序属性sortKey、弹窗宽度width、弹窗高度height))
```js
//默认props:
dynamicData:[]
option:{
  title: '列显示设置',
  key: 'uuid', // key
  nameKey: '', // 名字key
  showKey: '', // 是否显示key
  sortKey: '', // 排序key
  width: '300',
  height: '500'
}
```
2. 触发按钮可以通过slot="click"的组件传入click插槽，点击显示隐藏弹窗。
3. 自定义设置可以通过slot="otherSetting"的组件传入otherSetting插槽。
4. 点击保存后给父组件emit一个名为save的事件名，参数为按照sortKey排序后的对象数组。（注意：保存接口成功后得手动重新请求dynamicData数据，否则下次打开弹窗后还是以前数据，不是最新数据。）

### **实例**
此处实例代码位置为@/pages/AssetsMonitor_View/MonitorList.vue资产监控列表动态列设置。可以在首页 /资产监控 /资产监控列表处点击右侧设置查看具体效果。
```html
<dynamic-column-set :dynamicData="dynamicData.configs" :option="option" @save="saveform" style="display:inline-block">
  <s-button icon="set" title="设置" slot="click"></s-button>
  <s-form ref="drawerForm" label-width="280px" slot="otherSetting">
    <s-form-item label="默认排序列" prop="orderName" label-width="100px">
      <s-select v-model="dynamicData.orderName" placeholder="请选择">
        <s-option label="资产名称" value="assetName"></s-option>
        <s-option label="IP地址" value="ip"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="排序方式" prop="isAsc" label-width="100px">
      <s-select v-model="dynamicData.isAsc" placeholder="请选择">
        <s-option label="升序" :value="1"></s-option>
        <s-option label="降序" :value="0"></s-option>
      </s-select>
    </s-form-item>
  </s-form>
</dynamic-column-set>
<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash';
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'
  export default {
    components: {
      dynamicColumnSet
    }
    data(){
      return {
        dynamicData: {
          isAsc: 1,
          orderName: ''
        },
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'headName', // 名字key
          showKey: 'isShow', // 是否显示key
          sortKey: 'headIndex', // 排序key
          width: '300',
          height: '500'
        },
      }
    },
    metheds:{
      getdata() {
        $axios.get(`xxx`).then((res) => {
          this.dynamicData = res.data;
        });
      },
      saveform(data) {
        let params = cloneDeep(this.dynamicData)
        params.configs = data
        $axios.post(`/monitorlist/setConfig`, params).then(res) => {
          if (res.data && res.data.state) {
            this.getdata();//获取动态列设置数据
            this.reloadSort();//获取列表数据
            this.$message.success(res.data.errormsg)
          } else {
            this.$message.error(res.data.errormsg)
          }
        });
      },
    }
  }
</script>
```
