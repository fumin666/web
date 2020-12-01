<template>
  <s-dialog
    append-to-body
    v-model="dialogFlag"
    v-if="dialogFlag"
    title="查看资产账号"
    width="800px"
    class="addAccountDialog"
  >
    <s-scrollbar wrap-class="addAccountScrollbar">
      <s-row class="title">资产账号信息</s-row>
      <div style="text-align: center">
        <s-row>
          <s-col span="5">
            <div class="grid-content bg-purple">账号名称</div>
          </s-col>
          <s-col span="7">
            <div class="grid-content bg-purple-light">{{accountViewList.accountName}}</div>
          </s-col>
          <s-col span="5">
            <div class="grid-content bg-purple">资产名称</div>
          </s-col>
          <s-col span="7">
            <div class="grid-content bg-purple-light">{{accountViewList.assetName}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="5">
            <div class="grid-content bg-purple">账号角色</div>
          </s-col>
          <s-col span="7">
            <div class="grid-content bg-purple-light">{{accountViewList.roleName}}</div>
          </s-col>
          <s-col span="5">
            <div class="grid-content bg-purple">账号状态</div>
          </s-col>
          <s-col span="7">
            <div class="grid-content bg-purple-light">{{accountViewList.status}}</div>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="5">
            <div class="grid-content bg-purple">账号分类</div>
          </s-col>
          <s-col span="7">
            <div class="grid-content bg-purple-light">{{accountViewList.classify}}</div>
          </s-col>
          <s-col span="5" v-if="isEffective || isZombies">
            <div class="grid-content bg-purple">未使用天数</div>
          </s-col>
          <s-col span="7" v-if="isEffective || isZombies">
            <div class="grid-content bg-purple-light">{{accountViewList.noUseDays}}</div>
          </s-col>
        </s-row>
      </div>
      <s-row class="title">资产账号关联信息</s-row>
          <div v-if="isTable"  style="margin-top:-36px;">
             <s-table-page :data="tableData"
                       v-if="!isOrphan"
                       :header-search="getSearchDef()">
            <s-table-column prop="realName" label="真实姓名" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="orgName" label="组织机构" show-overflow-tooltip>
            </s-table-column>
            <!-- <s-table-column prop="position" label="岗位" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="classify" label="人员类型" show-overflow-tooltip>
            </s-table-column> -->
            <s-table-column prop="account" label="人员账号" show-overflow-tooltip>
            </s-table-column>
            <!--有效账号-->
            <s-table-column prop="status" label="人员账号状态" show-overflow-tooltip v-if="isEffective">
            </s-table-column>
            <s-table-column prop="noUseDays" label="未使用天数" show-overflow-tooltip v-if="isEffective">
            </s-table-column>
            <s-table-column prop="lastUseTime" label="最近一次使用时间" show-overflow-tooltip v-if="isEffective">
            </s-table-column>
            <!--僵尸账号-->
            <s-table-column prop="status" label="人员账号状态" show-overflow-tooltip v-if="isZombies">
            </s-table-column>
            <s-table-column prop="noUseDays" label="未使用天数" show-overflow-tooltip v-if="isZombies">
            </s-table-column>
            <s-table-column prop="lastUseTime" label="最近一次使用时间" show-overflow-tooltip v-if="isZombies">
            </s-table-column>
            <!--重复账号-->
            <s-table-column prop="repeatCount" label="重复账号个数" show-overflow-tooltip v-if="isRepeat">
            </s-table-column>
            <s-table-column prop="repeatInfo" label="使用过的重复账号" show-overflow-tooltip v-if="isRepeat">
              <template slot-scope="scope">
                <a @click="goDetail(scope.row)" href="javascript:void(0);" class="ipamColor">{{ scope.row.repeatInfo }}</a>
              </template>
            </s-table-column>
          </s-table-page>
          </div>

          <!--孤儿账号时”未关联任何人员“-->
          <div class="s-table s-table-empty-block" v-if="!isTable">
            <span class="s-table-empty-text">未关联任何人员</span>
          </div>

    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogFlag=false">确定</s-button>
    </template>

    <!--查看重复账号-->
    <repeat-view-dialog v-model="repeatViewDialogFlag"
                        v-if="repeatViewDialogFlag"
                        :repeatInfo="repeatInfo">
    </repeat-view-dialog>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import repeatViewDialog from './RepeatDetailsDialog';
  export default {
    data() {
      return {
        isTable: true,
        dialogFlag: false,
        repeatViewDialogFlag: false,
        accountViewList: {},
        tableData: [],
        repeatInfo: [],
        isEffective: false, // 有效账号
        isRepeat: false, // 重复账号
        isOrphan: false, // 孤儿账号
        isZombies: false // 僵尸账号
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      assetUuid: String,
      accountUuid: String,
      accountClassify: Number
    },
    components: {
      repeatViewDialog
    },
    created() {
      this.judgeAccountClassify();
      this.getAccountViewList();
    },
    methods: {
      judgeAccountClassify() {
        if (this.accountClassify === 1) { // 账号分类: 1-孤儿账号 2-僵尸账号 3-有效账号 4-重复账号
          this.isTable = false
          this.isOrphan = true
        } else if (this.accountClassify === 2) {
          this.isZombies = true
        } else if (this.accountClassify === 3) {
          this.isEffective = true
        } else if (this.accountClassify === 4) {
          this.isRepeat = true
        }
      },
      getAccountViewList() {
        $axios.get(`/assetsAccountInfo/getAccountUseInfo/${this.assetUuid}/${this.accountUuid}`).then(({data}) => {
          this.accountViewList = data;
          if (this.accountClassify === 4) {
            this.tableData = this.accountViewList.repeatAccountRels
          } else {
            this.tableData = this.accountViewList.assetAccountRels
          }
        });
      },
      goDetail (row) {
        this.repeatInfo = row.info;
        this.repeatViewDialogFlag = true;
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['realName', 'orgName', 'position', 'classify', 'account', 'status']
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="stylus">
  .addAccountDialog
    .s-form-item .s-form-item-content
      .s-checkbox + .s-checkbox
        margin-right 0
</style>
