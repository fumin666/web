<template>
  <div class="field-outer-container" :id="divId" :data-attrid="uid">
    <s-row>
      <s-col span="12" :title="attrTag"><label>{{ attrTag }}</label></s-col>
      <s-col span="8">
        <s-select v-if="select" v-model="value" placeholder="请选择">
          <s-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></s-option>
        </s-select>
        <s-input v-if="!select"></s-input>
      </s-col>
      <s-col span="4" class="btns">
        <i alt="close" class="icon iconfont icon-delete closefieldicon" :data-attrid="uid" title="删除"></i>
        <i alt="edit" class="icon iconfont icon-edit editfieldicon" :data-attrid="uid" title="编辑"></i>
      </s-col>
    </s-row>
  </div>
</template>
<script>
  export default {
    props: {
      divId: {
        type: String,
        required: true
      },
      uid: {
        type: String,
        required: true
      },
      attrTag: {
        type: String,
        required: true
      },
      options: {
        type: Array
      },
      value: {
        type: String
      },
      select: {
        type: Boolean,
        required: true
      }
    }
  }
</script>
<style scoped>
  /*.s-select {
    width: 275px;
  }*/
  .s-col-12{
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .s-col-12 label{
    margin-right: 10px;
  }
</style>
