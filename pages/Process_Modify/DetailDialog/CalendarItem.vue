/**
* Created by alex on 2018/4/12.
*/
<template>
  <section>
    <h2 class="full-calendar-dialog-title">变更单{{data.orderCode}}</h2>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">计划开始时间</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.planStartTime}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">计划结束时间</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.planEndTime}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">简单描述</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.title}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">详细描述</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.detailDesc}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">分类一级</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.categoryFirst}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">分类二级</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.categorySecond}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">分类三级</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.categoryThird}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">风险级别</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.riskLevel}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">变更路径</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.changePathN}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">变更经理</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.managerUserName}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">变更管理员</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light">{{data.adminUserName}}</div>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  export default {
    props: {
      data: {
        type: Object
      }
    }
  }
</script>
