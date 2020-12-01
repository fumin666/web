<template>
  <section>
    <s-scrollbar wrap-style="max-height: 450px;">
      <s-row class="title">资产账号信息</s-row>
      <div style="text-align: center">
        <s-row>
          <s-col span="4">
            <div class="grid-content bg-purple">账号名称</div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light">{{viewAssetObj.businessAccountName}}</div>
          </s-col>
          <s-col span="4">
            <div class="grid-content bg-purple">业务名称</div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light">{{viewAssetObj.businessSystemName}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="4">
            <div class="grid-content bg-purple">账号角色</div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light">{{viewAssetObj.businessRoleNames}}</div>
          </s-col>
          <s-col span="4">
            <div class="grid-content bg-purple">账号状态</div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light">{{viewAssetObj.businessAccountStatusStr}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="4">
            <div class="grid-content bg-purple">账号分类</div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light">{{viewAssetObj.businessAccountClassifyStr}}</div>
          </s-col>
          <s-col span="4">
            <div class="grid-content bg-purple" v-if="nouserBool">
              <span>未使用天数</span>
            </div>
          </s-col>
          <s-col span="8">
            <div class="grid-content bg-purple-light" v-if="nouserBool">
              <span>{{viewAssetObj.unUsedDay}}</span>
            </div>
          </s-col>
        </s-row>
      </div>
      <s-row class="title">资产账号关联信息</s-row>

      <div style="margin-top:-36px;" v-if="isTable">
        <s-table-page
          style="width:98%"

          :header-search="getSearchDef()"
          :data="viewAssetList"
          :header-actions="defAction()"

        >
          <s-table-column label="真实姓名" prop="userRealName" align="center"></s-table-column>
          <s-table-column label="组织机构"  prop="userOrgName" align="center"></s-table-column>
          <s-table-column label="岗位"  prop="userPosition" align="center"></s-table-column>
          <s-table-column label="人员类型"  prop="userClassify" align="center"></s-table-column>
          <s-table-column label="人员账号" prop="userLoginName" align="center"></s-table-column>

          <!--有效账号-->
          <s-table-column label="人员账号状态" v-if="isEffective"  prop="userStatus" align="center"></s-table-column>
          <s-table-column label="未使用天数" v-if="isEffective"  prop="assetAccountVo.unUsedDay" align="center"></s-table-column>
          <s-table-column label="最近一次使用时间" v-if="isEffective"  prop="assetAccountVo.usedLastTime" align="center"></s-table-column>

          <!--僵尸账号-->
          <s-table-column label="人员账号状态" v-if="isZombies"  prop="userStatus" align="center"></s-table-column>
          <s-table-column label="未使用天数" v-if="isZombies"  prop="assetAccountVo.unUsedDay" align="center"></s-table-column>
          <s-table-column label="最近一次使用时间" v-if="isZombies"  prop="assetAccountVo.usedLastTime" align="center"></s-table-column>
          <!--重复账号-->
          <s-table-column label="重复账号个数" v-if="isRepeat" prop="repeatAaNumber" align="center"></s-table-column>
          <s-table-column label="使用过的重复账号" v-if="isRepeat" prop="repeatAssetAccount" align="center">
            <template slot-scope="scope">
              <div @click="detailSee(scope.row)" class="score-td">
                {{scope.row.repeatAssetAccount}}
              </div>
            </template>
          </s-table-column>
        </s-table-page>
      </div>

      <!--孤儿账号时”未关联任何人员“-->
      <div class="s-table s-table-empty-block" style="width:98%" v-if="!isTable">
        <span class="s-table-empty-text">未关联任何人员</span>
      </div>

    </s-scrollbar>
  </section>
</template>

<script>

  export default {

    data() {
      return {
        nouserBool: false, // 未使用天数是否显示
        dialogFlag: true,
        viewAssetList: [],
        isTable: true,
        isEffective: false, // 有效账号
        isRepeat: false, // 重复账号
        isOrphan: false, // 孤儿账号
        isZombies: false // 僵尸账号
      }
    },
    props: {
      viewAssetObj: {
        type: Object
      }
    },
    created() {
      this.getviewAssetList();
      this.jusitfuObv();
      console.log(this.viewAssetObj);
    },
    methods: {
      // 获取资产账号稽核页面的列表信息
      getviewAssetList() {
        if (this.viewAssetObj.userInfoVos === null) {
          this.viewAssetList = []
        } else {
          this.viewAssetList = this.viewAssetObj.userInfoVos
        }
      },
      defAction() {
      },
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userOrgName', 'userPosition', 'userClassify']
        }
      },
      //  判断是孤儿账号、僵尸账号、有效账号、重复账号，并且决定账号稽核页面内的列表头部信息
      jusitfuObv() {
        if (this.viewAssetObj.assetAccountClassify === '孤儿账号') {
          this.isTable = false;
          this.isOrphan = true;
        } else if (this.viewAssetObj.assetAccountClassify === '重复账号') {
          this.isRepeat = true;
        } else if (this.viewAssetObj.assetAccountClassify === '僵尸账号') {
          this.isZombies = true;
          this.nouserBool = true;
        } else if (this.viewAssetObj.assetAccountClassify === '有效账号') {
          this.isEffective = true;
          this.nouserBool = true;
        }
      },
      //  向父组件传值
      detailSee(val) {
        let repeatUuidArr = val.repeatAssetAccountUuid.split(',');
        this.$emit('getRepeatUuid', repeatUuidArr)
      }
    }
  }
</script>
<style scoped>
  .s-scrollbar .s-row{
    width:98%;
  }
</style>
