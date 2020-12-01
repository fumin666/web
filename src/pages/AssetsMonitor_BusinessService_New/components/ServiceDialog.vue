*
create by YOU
*/
<template>
  <s-form :inline="true" class="demo-form-inline">
    <s-form-item label="业务服务">
      <s-select v-model="data" placeholder="选择业务服务">
        <s-option v-for="(item, index) in config" :label="item.name" :value="index" :key="index"></s-option>
      </s-select>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  export default {
    props: {
      config: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        data: ''
      }
    }
  };
</script>
