<template>
  <div class="org-details">
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">机构名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">机构编号</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departCode"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">上级机构</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departParentName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">机构负责人</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departLeaderName"></div>
      </s-col>
    </s-row>
   <!-- <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">机构副负责人</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departViceLeaderName	"></div>
      </s-col>
    </s-row>-->
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">联系方式</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departPhone"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">机构地址</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departPlace"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.remark"></div>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        info: {}
      }
    },
    methods: {
      getOrgInfo() {
        $axios.get(`/departmentInfo/viewDepartInfo/${this.data}`).then((res) => {
          if (res.data && typeof res.data.departmentInfo === 'object') {
            this.info = res.data.departmentInfo;
          }
        });
      }
    },
    mounted() {
      this.getOrgInfo();
    }
  }
</script>

<style>
  .org-details .bg-purple-light {
    word-wrap: break-word;
    word-break: normal;
  }
</style>
