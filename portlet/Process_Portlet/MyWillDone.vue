<template>
  <!--自定义首页  我的待办-->
  <div class="diy-process-myWillDone">
    <s-card-diy
      title="我的待办"
      :show-more="false"
      show-scrollbar
    >
      <s-col span="24">
        <section class="main-card-content box-card" style="height: calc( (100vh - 98px) / 3 * 2 - 15px);margin-bottom:5px;">
              <div>
                <s-row type="flex" class="Orderbackground" style="line-height:30px;margin: 12px 0.5% 1px 0;" id="selectRow">
                  <s-col span="2" offset="19" style="text-align: right;font-size: 14px;">筛选工单：</s-col>
                  <s-col span="3">
                    <s-select v-model="pendingOrder" @change="changeType">
                      <s-option label="全部" :value="null"></s-option>
                      <s-option v-for="(item, index) in allOrderTypes" :label="item" :key="index" :value="index">
                      </s-option>
                    </s-select>
                  </s-col>
                </s-row>
                <s-row shape="beauty" v-nodata="pendingLists.length === 0">
                  <s-scrollbar :wrap-style="'height:500px;z-index:-1;'" class="Orderbackground">
                    <s-carousel class="work-order-wrapper" arrow="never" :autoplay="false" :height="'500px'">
                      <s-carousel-item  v-for="(items, indexes) in pendingListsDouble" :key="indexes + 'outter'">
                        <deal-work-item
                          v-for="(item, index) in pendingListsDouble[indexes]"
                          :key="indexes * 6 + index + 'inner'"
                          :num="indexes * 6 + index"
                          :spanHeight="18"
                          :model="item"
                          :rolePro="rolePro"
                          @goOrder="goOrder"
                          @GetWorkOrder="GetWorkOrder"
                          @propblemDelegateWorkOrder="propblemDelegateWorkOrder"
                          @requestServDelegateWorkOrder="requestServDelegateWorkOrder"
                          @DelegateWorkOrder="DelegateWorkOrder"
                          @handleConcern="handleConcern"
                          @goPublishTask="goPublishTask"
                          @DelegatePublishWorkOrder="DelegatePublishWorkOrder"
                        ></deal-work-item>
                      </s-carousel-item>
                    </s-carousel>
                  </s-scrollbar>
                </s-row>
              </div>
        </section>
      </s-col>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import dealWorkItem from '@/home/ProcessCenter/ProcessUndealOrders/DealWorkItem.vue'
  export default {
    name: 'process-myWillDone',
    components: {
      dealWorkItem
    },
    data() {
      return {
        pendingOrder: null, // 待处理工单类型选中值
        allOrderTypes: [], // 全部工单类型数组
        pendingLists: [],
        spanHeight: 20,
        mainScrollbarHeight: 0,
        carouselHeight: 0
      }
    },
    computed: {
      pendingListsDouble() {
        let DoubleList = new Array([])
        for (let i = 0; i < this.pendingLists.length; i += 6) {
          let k = Math.floor(i / 6)
          DoubleList[k] = []
          for (let j = 0; j < 6; j++) {
            this.pendingLists[i + j] ? DoubleList[k].push(this.pendingLists[i + j]) : ''
          }
        }
        return DoubleList
      },
      rolePro() {
        return this.$store.state.processCenter.rolePro;
      }
    },
    created() {
      this.getPendingList();
    },
    mounted() {
      $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
        if (res) {
          this.allOrderTypes = res.data
        }
      });
    },
    methods: {
      changeType () {
        this.getPendingList(parseInt(this.pendingOrder))
      },
      getPendingList(num) {
        let params = {
          ordertype: num
        }
        $axios.post('/itilWorkflowCenter/getUndealOrders', num === '全部' ? '' : params).then(({data}) => {
          let {changeOrderList, changeTaskList, incidentOrderList, problemOrderList, knowledgeOrderList, publishOrderList, requestOrderList} = data
          changeOrderList = (changeOrderList || []).map(item => Object.assign({}, item, {
            status: item.changeStatus,
            orderType: 2
          }))
          changeTaskList = (changeTaskList || []).map(item => Object.assign({}, item, {
            status: item.taskStatus,
            orderType: 3
          }))
          incidentOrderList = (incidentOrderList || []).map(item => Object.assign({}, item, {
            status: item.incidentStatus,
            orderType: 0
          }))
          problemOrderList = (problemOrderList || []).map(item => Object.assign({}, item, {
            status: item.problemStatus,
            orderType: 1
          }))
          knowledgeOrderList = (knowledgeOrderList || []).map(item => Object.assign({}, item, {
            status: item.knowledgeStatus,
            orderType: 4
          }))
          publishOrderList = (publishOrderList || []).map(item => Object.assign({}, item, {
            status: item.publishStatus,
            orderType: 5
          }))
          requestOrderList = (requestOrderList || []).map(item => Object.assign({}, item, {
            status: item.status,
            orderType: 6
          }))
          this.pendingLists = [...changeOrderList, ...changeTaskList, ...incidentOrderList, ...problemOrderList, ...knowledgeOrderList, ...publishOrderList, ...requestOrderList]
          this.pendingLists = this.pendingLists.sort(function(a, b) {
            return a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0
          })
        })
      },
      goOrder(uuid, orderType) {
        switch (orderType) {
          case 0:
            this.goto('ProcessCenter/eventDetail/' + uuid);
            break;
          case 1:
            this.goto('ProcessCenter/problemDetail/' + uuid);
            break;
          case 2:
            this.goto('ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('ProcessCenter/taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            this.goto('ProcessCenter/requestServiceDetail/' + uuid);
            break;
        }
      },
      goPublishTask(model) {
        this.goto('ProcessCenter/publishTaskOrderDetail/' + model.uuid);
      },
      GetWorkOrder(uuid, orderType, model) {
        switch (orderType) {
          case 0:
            $axios.get(`/itilIncidentCenter/OrderTalking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/eventDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
          case 1:
            if (model.problemStatus === 0 && this.rolePro.problem > 1 || model.problemStatus === 1 || model.problemStatus === 2 || model.problemStatus === 3) {
              $axios.get(`/itilProblemOrder/takeItilProblemOrder/${uuid}`).then((res) => {
                if (res.data.state === true) {
                  this.goto('ProcessCenter/problemDetail/' + uuid);
                } else {
                  this.$message({
                    message: res.data.errormsg,
                    type: 'error'
                  })
                }
              })
            } else {
              this.goto('ProcessCenter/problemDetail/' + uuid);
            }
            break;
          case 2:
            this.goto('ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            $axios.get(`/itilChangeOrder/changeTaskTaking/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/taskOrderDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
          case 4:
            this.goto('ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            $axios.get(`/itilServiceRequest/orderTakling/${uuid}`).then((res) => {
              if (res.data.state === true) {
                this.goto('ProcessCenter/requestServiceDetail/' + uuid);
              } else {
                this.$message({
                  message: res.data.errormsg,
                  type: 'error'
                })
              }
            })
            break;
        }
      },
      propblemDelegateWorkOrder(taskId, orderType, orderId, companyUuid) {
        this.AssignToOtherDialog = true
        this.eventParams.orderType = orderType
        this.eventParams.incidentOrderUuid = orderId
        this.eventParams.taskId = taskId
        this.eventParams.companyUuid = companyUuid
        this.getPendingList(parseInt(this.pendingOrder))
      },
      DelegateWorkOrder(uuid, orderType, companyUuid) {
        this.orderType = orderType
        if (this.orderType === 3) {
          this.deletitle = '任务工单委派给他人'
        }
        this.delegateDialog = true;
        this.eventParams.uuid = uuid
        this.getPendingList(parseInt(this.pendingOrder))
        this.companyUuid = companyUuid
      },
      handleConcern(uuid, orderType, isConcern, concernUuid) {
        if (isConcern !== 1) {
          this.$confirm('是否关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${uuid}/${orderType}`).then(({data}) => {
              concernUuid = data
              if (data) {
                this.$message({
                  type: 'success',
                  message: '关注成功'
                })
                this.getPendingList(parseInt(this.pendingOrder))
              } else {
                this.$message({
                  type: 'error',
                  message: '关注失败'
                })
              }
            })
          }).catch(() => {
          });
        } else {
          this.$confirm('是否取消关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${concernUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: data.errormsg
                })
                this.getPendingList(parseInt(this.pendingOrder))
              } else {
                this.$message({
                  type: 'error',
                  message: '取消关注失败'
                })
              }
            })
          }).catch(() => {
          });
        }
      },
      DelegatePublishWorkOrder(model) {
        this.publishParams.uuid = model.uuid;
        this.publishData = model;
        if (model.orderType === 3) {
          this.deletitle = '任务工单委派给他人'
        }
        this.delegatePublishDialog = true;
      },
      requestServDelegateWorkOrder(uuid, companyUuid) {
        this.AssignToOtherRSDialog = true
        this.requestParams.uuid = uuid
        this.requestParams.companyUuid = companyUuid
        this.getPendingList(parseInt(this.pendingOrder))
      },
      goto(path) {
        this.$router.push(path)
      }
    }
  }
</script>
