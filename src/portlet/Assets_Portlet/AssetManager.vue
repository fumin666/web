<!--
 * @Author: 高建鹏
 * @Date: 2019-06-05 14:52:39
 * @LastEditors: 高建鹏
 * @Description: 自定义首页资产管理中的业务管理展示页面
 * @Position:
 -->
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="业务系统管理"
      show-scrollbar
      :show-more="false">
      <business></business>
    </s-card-diy>
  </div>
</template>

<script>
  import business from '@/pages/Assets_Business/Business';

  export default {
    components: {
      business
    }
  }
</script>
