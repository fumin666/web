<template>
 <div class="lookManage">
   <div>
     <p class="manageText">配置项类型</p>
     <s-form label-width="120px" ref="form">
       <s-form-item label="一级分类：">
         <s-input v-model="specialData.fristTypeName" disabled></s-input>
       </s-form-item>
       <s-form-item label="二级分类：">
         <s-input v-model="specialData.secondTypeName" disabled></s-input>
       </s-form-item>
       <s-form-item label="三级分类：">
         <s-input v-model="specialData.threeTypeName" disabled></s-input>
       </s-form-item>
     </s-form>
   </div>
   <s-tab v-model="activeTab">
     <s-tab-pane label="特殊属性">
       <specialAttr :lookspecialData="specialData"></specialAttr>
     </s-tab-pane>
   </s-tab>
 </div>
</template>

<script type="text/ecmascript-6">
/* 2.9资产通用属性调整 */
import specialAttr from './SpecialAttr';
 export default {
 components: {specialAttr},
  data() {
   return {
     activeTab: 0
    }
   },
   methods: {
   },
   props: {
     specialData: {
     type: Object,
     default() {
     return {}
     }
     }
   }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
