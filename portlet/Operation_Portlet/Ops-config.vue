* Created by alex on 2018/12/4.
*/
<template>
  <div class="diy-second-mod">
    <s-card-diy
      title="运维设置"
      show-scrollbar
      :show-more="false">
      <oper-set></oper-set>
    </s-card-diy>
  </div>
</template>

<script>
  import operSet from '@/pages/Operation_TotalSet/OperSet'

  export default {
    components: {
      operSet
    }
  }
</script>
