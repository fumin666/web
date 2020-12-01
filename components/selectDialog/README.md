# select弹窗用法

## props

```
/*和普通Select一样，v-model绑定数据*/
props: {
      /*是否多选 boolean*/
      multiple,
      /*数据 Array*/
      options,
       /*弹出表格配置*/
      config,
      /*dialog宽度，如 360px*/
      dialogWidth,
      /*options中value的prop*/
      valueProp
    }

```

## 示例

```
<template>
  <select-dialog
    <!-- 绑定的数据,必填 -->
    v-model="value"
    <!-- 下拉框数据，必填 -->
    :options="options"
    <!-- 弹出表格配置，必填 -->
    :config="config"
    <!-- 是否多选,默认false -->
    :multiple="false"
    <!-- options中value所在的prop，默认'uuid'，必填 -->
    valueProp="uuid">
    <!-- s-options和s-select一样 -->
    <s-option v-for="item in options" :label="item.name" :value="item.uuid"
              :key="item.uuid"></s-option>
  </select-dialog>
</template>
/**/
<script>
import SelectDialog from '@/components/selectDialog'
  export default{
    components: {
      sDialog
    },
    data () {
      return {
        options: [
          {name:'admin', age:1, uuid:'jfkgi43tbhgsd7igtf4w'},
          {name:'SB', age:2, uuid:'g5sdh5ushsjhsfhg'},
          {name:'NB', age:3, uuid:'jfsdfsdfkgi43tbhdfdw'}
        ],
        // name表头
        // value对应表数据字段
        config: [
          {name: '用户名',value: 'name'},
          {name: '年龄',value: 'age'}
        ],
        value: ''
      }
    }
  }
</script>

```

## 其他属性

> **title:** String(弹出Dialog的title) \
> **clearable:** Boolean(单选是否可以清除) \
> **disabled:** Boolean(是否禁用)

## 方法

> change(Select数据改变时)
> clear(可清空单选模式下清空时)
