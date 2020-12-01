<template>
  <section>
    <s-scrollbar wrap-class="default-dialog-scroll">
      <s-role-collapse :title="roleMsg.roleName">
        <s-role-collapse-item v-for="(item,index) in roleMsg.menuManagementList" :key="index" :name="index+1" :role-list="item"></s-role-collapse-item>
      </s-role-collapse>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        msg: []
      }
    },
    props: ['roleMsg']
  }
</script>
