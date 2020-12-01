<template>
  <div class="diy-user-process-todo">
    <s-card-diy
      title="审批待办"
      :more-click="moreClick">
      <s-grid>
        <s-grid-item :flex="1">
          <div class="my-num" @click="handleClick">{{data.undealOrderCnt}}</div>
          <div class="my-label">我的待办</div>
        </s-grid-item>
        <s-grid-item :flex="1">
          <div class="my-num" @click="handleClick">{{data.approveOrderCnt}}</div>
          <div class="my-label">我的审批</div>
        </s-grid-item>
        <s-grid-item :flex="1">
          <div class="my-num" @click="handleClick">{{data.dealedOrderCnt}}</div>
          <div class="my-label">我的已办</div>
        </s-grid-item>
        <s-grid-item :flex="1" class="my-last">
          <div class="my-num" @click="handleClick">{{data.concernOrderCnt}}</div>
          <div class="my-label">我的关注</div>
        </s-grid-item>
      </s-grid>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        data: {}
      }
    },
    computed: {
    },
    created() {
      this.getInfo();
    },

    methods: {
      getInfo() {
        $axios.get('/itilWorkflowCenter//userOrderCnt').then((res) => {
          this.data = res.data;
        });
      },
      moreClick() {
        this.$router.push('/ProcessCenter');
      },

      handleClick() {
        this.$router.push('/ProcessCenter');
      }
    }
  }
</script>

<style>
  .diy-user-process-todo {
    width: 100%;
    height: 100%;
  }
  .diy-user-process-todo .my-num {
    font-size: 28px;
  }
  .diy-user-process-todo .my-num:hover {
    cursor: pointer;
  }
  .diy-user-process-todo .my-label {
    margin-top: 12px;
    font-size: 12px;
    color: #9C9796;
  }
  .diy-user-process-todo .s-grid-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .diy-user-process-todo .s-grid-item:after {
    display: block;
    content: '';
    position: absolute;
    right: 0;
    top: 43px;
    width: 1px;
    height: 53px;
    background: #979797;
    opacity: 0.2;
  }
  .diy-user-process-todo .s-grid-item.my-last:after {
    display: none;
  }
</style>
