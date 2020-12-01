<template>
  <div class="user-details">
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">账号名称</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.userLoginName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">真实姓名</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.userRealName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">所属机构</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.departName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">角色</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.roleName"></div>
      </s-col>
    </s-row>
    <!--<s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">是否孤立账号</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.isolated === 0 ? '否' : '是'"></div>
      </s-col>
    </s-row>-->
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">状态</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.statusName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="10">
        <div class="grid-content bg-purple">到期时间</div>
      </s-col>
      <s-col :span="14">
        <div class="grid-content bg-purple-light" v-text="info.userExpiryDateStr === '0' ? '永不过期' : info.userExpiryDateStr"></div>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        info: this.data
      }
    },
    created() {
      console.log(this.data);
    }
  }
</script>
