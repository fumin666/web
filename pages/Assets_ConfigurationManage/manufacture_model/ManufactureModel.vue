<!--
 * @Author: 高建鹏
 * @Version: //Q4厂商型号配置
 * @Description:厂商型号配置页面
 * @Position:配置项管理-》厂商型号配置
 * @Date: 2019-10-30 14:35:06
 * @LastEditors: 高建鹏
 -->
<template>
  <div class="manufacture_model">
    <s-tab v-model="activeTab">
      <s-tab-pane label="厂商" name="pane1">
        <manufactureSetting ref="manufacture" v-if="activeTab === 'pane1'"></manufactureSetting>
      </s-tab-pane>
      <s-tab-pane label="型号" name="pane2">
        <modelSetting ref="model" v-if="activeTab === 'pane2'"></modelSetting>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import manufactureSetting from './ManufactureSetting'
  import modelSetting from './ModelSetting'
  export default {
    data() {
      return {
        activeTab: 'pane1'
      }
    },
    components: {manufactureSetting, modelSetting},
    methods: {

    }
  }
</script>
<style>

</style>