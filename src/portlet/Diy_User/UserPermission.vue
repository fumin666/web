<template>
  <div class="diy-user-permission">
    <s-card-diy
      title="权限清单"
      :more-click="moreClick">
      <div style="width: 100%; height: 100%; padding: 10px;">
        <div>
          <span style="font-size: 30px" class="my-sum">{{list.length}}</span>
          <span style="font-size: 14px; color: #9C9796"> 项权限</span>
        </div>
        <div style="padding-top: 10px; height: 79px; overflow: hidden">
          <div v-for="(item, index) in list" :key="index" class="tag" :title="item">
            <div class="tag-left"></div><div class="tag-right">{{item}}</div>
          </div>
        </div>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  export default {
    computed: {
      list() {
        return this.$store.state.userData.roleName.split(',');
      }
    },
    methods: {
      moreClick() {
        this.$router.push('/AccountManage/orgTopo');
      }
  },
    created () {
    }
  }
</script>

<style>
  .diy-user-permission {
    width: 100%;
    height: 100%;
  }
  .diy-user-permission .tag {
    display: flex;
    width: 106px;
    height: 32px;
    line-height: 32px;
    flex-direction: row;
    float: left;
    margin-bottom: 6px;
    margin-right: 12px;
  }
  .diy-user-permission .tag-left {
    width: 4px;
    height: 100%;
  }
  .diy-user-permission .tag-right {
    flex: 1;
    font-size: 14px;
    padding-left: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
