<template>
  <section id="c-myApplication">
    <s-table-page
      :data="myApplicationList"
      :header-search="defSearch()"
      key="myApplicationList">
      <s-table-column label="工单编号">
        <template slot-scope="scope">
          <span class="jump-link"
            @click="goToServiceRequestDetail(scope.row)"
            v-text="scope.row.serialCode"></span>
        </template>
      </s-table-column>
      <s-table-column label="简要描述" prop="briefDesc"></s-table-column>
      <s-table-column label="工单类型">
        <template slot-scope="scope">
          <span v-text="orderTypes[scope.row.orderType]"></span>
        </template>
      </s-table-column>
      <s-table-column label="工单状态">
        <template slot-scope="scope">
          <span v-text="getStatus(scope.row.status)"></span>
        </template>
      </s-table-column>
      <s-table-column label="提交人" prop="createUserName"></s-table-column>
      <s-table-column label="提交时间" prop="createTime" sortable></s-table-column>
      <s-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i
            :class="{disabled: judgeRole(scope.row).acceptDisabled && judgeRole(scope.row).allDisabled}"
            class="iconfont icon-receive" title="接单"
            @click="receiveOrder(scope.row)"></i>
          <i
            :class="{disabled: judgeRole(scope.row).assignToOthersDisabled && judgeRole(scope.row).allDisabled}"
            class="iconfont icon-click" title="指派"
            @click="assignOrder(scope.row)"></i>
          <i
            :class="{disabled: scope.row.status!==5}"
            class="iconfont icon-start" title="重新打开"
            @click="reStartOrder(scope.row)"></i>
          <i
            :class="{disabled: judgeRole(scope.row).cancelDisabled && judgeRole(scope.row).allDisabled}"
            class="iconfont icon-cancel" title="取消"
            @click="cancelOrder(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--指派给他人-->
    <s-dialog
      title="指派给他人"
      ref="assignToOthersDialog"
      v-if="assignToOthersDialog"
      v-model="assignToOthersDialog">
      <assign-to-others
        :orderUuid="currentOrderUuid"
        :companyUuid="currentCompanyUuid"
        @closeAssignToOthers="closeAssignToOthers"></assign-to-others>
    </s-dialog>

    <!--取消-->
    <s-dialog
      v-if="cancelOrderDialog"
      v-model="cancelOrderDialog"
      title="取消">
      <cancel ref="cancelOrder"></cancel>
      <template slot="footer">
        <s-button @click="saveCancelOrder">确定</s-button>
        <s-button type="cancel" @click="cancelOrderDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  import AssignToOthers from '@/pages/Process_RequestService/DetailDialog/AssignToOthers';
  import Cancel from '@/pages/Process_RequestService/DetailDialog/Cancel';

  export default {
    data() {
      return {
        orderTypes: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],   // 工单类型
        userGroups: [],                               // 当前用户所有组
        myApplicationList: [],                        // 我提交的申请
        searchGroup: {},
        userUuid: this.$store.state.userData.uuid,    // 当前用户uuid
        currentOrderUuid: '',                         // 当前操作的工单uuid
        currentCompanyUuid: '',                       // 指派给他人，弹框所需公司uuid
        assignToOthersDialog: false,                  // 指派给他人弹框
        cancelOrderDialog: false
      }
    },
    components: {
      AssignToOthers,
      Cancel
    },
    methods: {
      // 表头查询
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['serialCode', 'briefDesc', 'type', 'statusName', 'createUserName', 'createTime']
        }
      },
      // 获取当前用户所有的组
      getUserGroups() {
        return new Promise((resolve, reject) => {
          $axios.get('/ItilCommonWorkflow/getGroupListByUser').then(({data}) => {
            if (data && data instanceof Array) {
              this.userGroups = data.map(item => item.uuid);
              resolve();
            } else {
              reject();
            }
          });
        });
      },
      // 获取当前用户流程角色
      getUserItilRole() {
        return new Promise((resolve, reject) => {
          $axios.get(`/itilWorkflowConfig/getItilRoleByUserUuid/${this.$store.state.userData.uuid}`).then(({data}) => {
            if (data && data instanceof Array) {
              this.ItilRole = data;
              resolve();
            } else {
              reject();
            }
          });
        });
      },
      // 获取我的服务请求列表
      getMyApplicationList() {
        $axios.get('/itilServiceRequest/getRequestOrderList').then(({data}) => {
          if (data) {
            // if (data.hasOwnProperty('itilChangeOrders')) this.myApplicationList = data.itilChangeOrders;
            // if (data.hasOwnProperty('itilIncidentOrders')) this.myApplicationList = this.myApplicationList.concat(data.itilIncidentOrders);
            if (data.hasOwnProperty('itilRequestOrders') && data.itilRequestOrders instanceof Array) {
              this.myApplicationList = [];
              this.myApplicationList = this.myApplicationList.concat(data.itilRequestOrders.map(list => {
                list.orderType = 6;
                return list
              }));
            }
          }
        });
      },
      // 条件搜索查询
      searchPost() {},
      // 计算工单状态(文字)
      getStatus(status) {
        let data = this.$store.state.processCenter.status[6];
        return data[status];
      },
      // 服务请求管理员权限
      publicPermission(status, access, flag = 1) {
        let userIsManager = false;// 服务请求管理员
        // let userIsSubmitter = false;// 服务请求提交人
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsManager = this.ItilRole.some((item) => {
            return item.roleKey === 'service_minstrator'
          })
          // userIsSubmitter = this.ItilRole.some((item) => {
          //   return item.roleKey === 'service_submitter'
          // })
        }
        if ((status === 0 || status === 1) && flag) {
          access.acceptDisabled = false;
          access.cancelDisabled = false;
        } else if (status === 3) {
          access.acceptDisabled = false;
        } else if (status === 4) {
          if (userIsManager) {
            access.cancelDisabled = false;
          }
        }
      },
      // 判断角色信息
      judgeRole(row) {
        /* eslint-disable no-unused-vars */
        let status = row.status;
        let userIsManager = false;// 服务请求管理员
        // let userIsSubmitter = false;// 服务请求提交人
        if (this.ItilRole instanceof Array && this.ItilRole.length > 0) {
          userIsManager = this.ItilRole.some((item) => {
            return item.roleKey === 'service_minstrator'
          })
          // userIsSubmitter = this.ItilRole.some((item) => {
          //   return item.roleKey === 'service_submitter'
          // })
        }
        // 默认所有都为true，在判断是否需要放开按钮，并且每次重新重置为true
        let access = {
          cancelDisabled: true,
          assignToOthersDisabled: true,
          acceptDisabled: true,
          allDisabled: true
        };
        if (!(status === 4 && row.isOtherOrder === 1)) { // 如果生成的是其他单并且是进行中状态，有按钮权限全部禁掉
          if ((this.userGroups.indexOf(row.managerGroup) > -1) && userIsManager) {
            this.publicPermission(status, access);
          } else {
            if (this.userUuid === row.createUser && this.userUuid === row.assigneUser) {
              this.publicPermission(status, access);
            } else if (this.userUuid === row.createUser && this.userUuid !== row.assigneUser) {
              if (status === 0 || status === 1) {
                access.acceptDisabled = false;
                access.cancelDisabled = false;
              }
            } else if (this.userUuid !== row.createUser && this.userUuid !== row.assigneUser) {
              this.publicPermission(status, access, 0);
            }
          }
          // 指派给他人按钮
          if (this.userUuid === row.assigneUser || this.userUuid === row.managerUser) {
            if (status === 3 || status === 4) {
              access.assignToOthersDisabled = false;
            }
          }
        }
        return access;
      },
      // 接单
      receiveOrder(row) {
        let access = this.judgeRole(row);
        if (access.acceptDisabled && access.allDisabled) return
        $axios.get(`/itilServiceRequest/orderTakling/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.getMyApplicationList();
            this.$message.success('接单成功！');
          } else {
            this.$message.error('接单失败，请重试！');
          }
        });
      },
      // 打开指派给他人弹框
      assignOrder(row) {
        let access = this.judgeRole(row);
        if (access.assignToOthersDisabled && access.allDisabled) return
        this.currentOrderUuid = row.uuid;
        // 公司uuid，传值给"指派给他人"弹框，用于查询"请求受派组"
        this.currentCompanyUuid = row.companyUuid;
        this.assignToOthersDialog = true;
      },
      // 关闭指派给他人弹框
      closeAssignToOthers(flag) {
        flag !== 'cancle' && this.getMyApplicationList();
        this.assignToOthersDialog = false;
      },
      // 重新打开
      reStartOrder(row) {
        if (row.status !== 5) return
        $axios.get(`/itilServiceRequest/reOpen/${row.uuid}`).then(({data}) => {
          if (data.state === true) {
            this.getMyApplicationList();      // 获取我的服务请求列表
            this.$message.success(data.errormsg);
          } else {
            this.$message.error(data.errormsg);
          }
        });
      },
      // 取消
      cancelOrder(row) {
        let access = this.judgeRole(row);
        if (access.cancelDisabled && access.allDisabled) return
        this.currentOrderUuid = row.uuid;
        this.cancelOrderDialog = true;
      },
      // 保存取消
      saveCancelOrder() {
        let cancelReason = this.$refs['cancelOrder'].cancelForm.cancel
        this.$refs['cancelOrder'].$refs['cancelForm'].validate((valid) => {
          if (valid) {
            $axios.post(`/itilServiceRequest/requestOrderCancle`, {
              requestOrderUuid: this.currentOrderUuid,
              reason: cancelReason
            }).then(({data}) => {
              if (data.state === true) {
                this.getMyApplicationList();
                this.cancelOrderDialog = false;
                this.$message.success('取消成功！');
              } else {
                this.$message.error('取消失败，请重试！');
              }
            })
          } else {
            return false
          }
        })
      },
      // 跳转至服务请求单详情
      goToServiceRequestDetail(row) {
        this.$router.push(`requestServiceDetail/${row.uuid}`);
      }
    },
    created() {
      // 获取当前用户所有组及用户流程角色
      Promise.all([this.getUserGroups(), this.getUserItilRole()]).then(() => {
        this.getMyApplicationList();      // 获取我的服务请求列表
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #c-myApplication
    .jump-link
      cursor pointer
      &:hover
        text-decoration underline
    .s-table .s-table-body .s-table-row
      .iconfont.disabled
        cursor not-allowed
</style>
