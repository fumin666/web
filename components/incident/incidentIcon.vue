<template>
  <div :class="levelClass"></div>
</template>
<script>
  export default {
    name: 'incidentLevel',
    props: {
      level: {
        type: Number,
        required: true
      }
    },
    computed: {
      levelClass: function () {
        return 'incident' + this.level;
      }
    }
  }
</script>
<style>
  .incident4{
    background:url('../../assets/images/incident/ciyao.png') no-repeat center center;
  }
  .incident3{
    background:url('../../assets/images/incident/jinggao.png') no-repeat;
  }
  .incident2{
    background:url('../../assets/images/incident/tishi.png') no-repeat;
  }
  .incident1{
    background:url('../../assets/images/incident/zhengchang.png') no-repeat;
  }
  .incident0{
    background:url('../../assets/images/incident/weizhi.png') no-repeat;
  }
  .incident6{
    background:url('../../assets/images/incident/yanzhong.png') no-repeat;
  }
  .incident5{
    background:url('../../assets/images/incident/zhuyao.png') no-repeat;
  }
  .incident0,.incident1,.incident2,.incident3,.incident4,.incident5,.incident6{
    width:16px;
    height:16px;
    text-align: center;
    margin-left:6px;
  }
</style>
