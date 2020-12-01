<template>
  <section class="checkAssetAccount addAccountDialog">
    <s-scrollbar wrap-class="addAccountScrollbar">
        <s-row class="title">业务账号信息</s-row>
        <s-row>
          <s-col span="6">
            <div class="grid-content bg-purple">账号名称</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.name}}</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple">业务名称</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.bSystemName}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="6">
            <div class="grid-content bg-purple">账号角色</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.bRoleName}}</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple">账号状态</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.status}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="6">
            <div class="grid-content bg-purple">账号分类</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.classify}}</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple">未使用天数</div>
          </s-col>
          <s-col span="6">
            <div class="grid-content bg-purple-light">{{listData.unUseDays}}</div>
          </s-col>
        </s-row>
        <s-row>

        </s-row>
      <div class="content1">
        <s-row class="title position">业务账号关联信息</s-row>
        <s-table-page v-model="accountRels" :data="accountRels"  :header-search="getHeaderSearch()" :header-actions="getHeaderActions()">
          <s-table-column prop="realName" label="真实姓名"></s-table-column>
          <s-table-column prop="orgName" label="组织机构"></s-table-column>
          <s-table-column prop="position" label="岗位"></s-table-column>
          <s-table-column prop="classify" label="人员类型"></s-table-column>
          <s-table-column prop="account" label="人员账号"></s-table-column>
          <s-table-column prop="status" label="人员账号状态"></s-table-column>
          <s-table-column prop="unUseDays" label="未使用天数"></s-table-column>
          <s-table-column prop="lastUseTime" label="最近一次使用时间"></s-table-column>
        </s-table-page>
      </div>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        listData: {},
        accountRels: []
      }
    },
    methods: {
      getList() {
        $axios.get(`/iamBusinessAccount/get/${this.viewRow}`).then((res) => {
          if (res.data) {
            this.listData = res.data;
            this.accountRels = res.data.accountRels || []
          }
        });
      },
      getHeaderSearch() {
        return {
          width: 6,
          placeholder: '请输入查询内容',
          searchProps: ['realName', 'orgName', 'position', 'lastUseTime'] // can be string or Array
        }
      },
      getHeaderActions() {
        let vm = this
        return {
          width: 12,
          actions: [{
              name: '批量同步',
              icon: 'plus',
              click() {
                vm.$message('当前无对接业务系统')
            }
          }]
        }
      }
    },
    props: {
      viewRow: {
        type: String
      }
    },
    created() {
      this.getList()
    }
  }
</script>
<style scoped lang="stylus">
.footerRow{
    text-align : right;
    margin : 15px 0 5px 0
    }
.formPadding{
    padding :10px;
}
.formwidth{
    width :90%
}
.inputwidth{
    width :50%
}
.title {
    font-weight: 700;
    height: 36px;
    line-height: 36px;
    color: #4d4d4d;
    font-size: 16px;
    margin-bottom: 5px;
    padding-left: 5px;
}
.position{
  position: absolute;
}
.content1{
  margin :20px 0
}
</style>
