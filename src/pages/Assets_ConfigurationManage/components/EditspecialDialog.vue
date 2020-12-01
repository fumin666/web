<template>
  <div class="editspecialDialog">
    <p class="manageText">配置项类型</p>
  <div class="editspecialForm">
    <s-form ref="manageForm" :model="Specialform" :rules="SpeciaRule" label-width="120px">
      <s-form-item label="一级分类:">
        <s-input v-model="Specialform.fristTypeName" style="width: 90%" disabled>
        </s-input>
      </s-form-item>
      <s-form-item label="二级分类:" >
        <s-input v-model="Specialform.secondTypeName" style="width: 90%" disabled>
        </s-input>
      </s-form-item>
      <s-form-item label="三级分类:">
        <s-input v-model="Specialform.threeTypeName" style="width: 90%" disabled></s-input>
      </s-form-item>
    </s-form>
  </div>
    <p class="manageText">属性</p>
    <specialAttr ref="SpecialAttr" :dragData="Specialform"></specialAttr>
   </div>
</template>
<script type="text/ecmascript-6">
  import specialAttr from '@/components/customFormPanel/dragForm'
  import {cloneDeep} from 'lodash'
 export default {
 components: {specialAttr},
 data () {
 return {
   Specialform: {
     fristTypeName: '',
     secondTypeName: '',
     threeTypeName: ''
   },
   SpeciaRule: {},
   data: [{prop: 'prop'}]
 }
 },
 props: {
   specialdata: {
   type: Object
   }
 },
 created() {
  this.Specialform = cloneDeep(this.specialdata)
 }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.editspecialDialog
  .editspecialForm
   width: 70%;
   margin: 10px 40px;
  .manageText
    margin-left: 40px
    font-size: 14px
    font-weight: bold
</style>
