<template>
  <div class="satisfaction-survey-history">
    <div class="satisfaction-survey-history-header">
      <i class="iconfont icon-event"/>
      <h2>工单满意度历史</h2>
      <div style="flex: 1;"></div>
      <s-button @click="goLibrary">问卷库</s-button>
      <s-button @click="handleOpenConfig">问卷发送设置</s-button>
    </div>
    <s-table-page
      style="margin-bottom: 20px;"
      :data="data"
      :header-search="getHeaderSearch()"
      :row-actions="getRowActions()">
      <s-table-column
        label="工单编号"
        prop="serialCode" />
      <s-table-column
        label="工单简要描述"
        prop="briefDesc"/>
      <s-table-column
        label="工单类型"
        prop="orderTypeStr"
        :filters="[
          { text: '事件管理', value: '事件管理' },
          { text: '服务请求', value: '服务请求' }
        ]"
        :filter-method="filterType"/>
      <s-table-column
        label="工单状态"
        prop="statusName"/>
      <s-table-column
        label="工单提交人"
        prop="createUserName"/>
      <s-table-column
        label="提交时间"
        prop="createTime"
        sortable/>
    </s-table-page>

    <div class="satisfaction-survey-log-header">
      <i class="iconfont icon-event"/>
      <h2>问卷发送历史记录</h2>
      <div style="flex: 1"></div>
      <span @click="goLog" class="more more-info">更多</span>
    </div>
    <div v-if="logList.length === 0" class="s-table-empty-block">
      <span class="s-table-empty-text">暂无数据</span>
    </div>
    <s-grid v-else direction="row">
      <s-grid-item
        v-for="(item, idx) in logList.slice(0, 5)"
        :key="idx"
        :flex="1"
        style="display: flex; flex-direction: row">
        <div style="padding: 0 10px;" class="img">
          <i class="iconfont icon-order-pending" style="font-size: 42px"/>
        </div>
        <div>
          <div style="font-size: 14px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;" class="paper-title">{{item.paperTitle}}</div>
          <div style="font-size: 12px; color: #9c9796; padding: 4px 0 2px 0;">{{item.orderTypeStr}}</div>
          <div style="font-size: 12px; color: #9c9796">{{item.sendTimeStr}}</div>
        </div>
      </s-grid-item>
    </s-grid>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    props: {
      logList: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        data: [],
        currentRecipientUuid: '',
        currentPaperUuid: ''
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入工单编号、工单简要描述、工单状态 、工单提交人查询',
          searchProps: ['serialCode', 'briefDesc', 'createUserName']
        }
      },

      getRowActions() {
        let vm = this;
        return [
          {
            name: '查看',
            icon: 'eye',
            click: (row) => {
              vm.$emit('view', {
                paperUuid: row.paperUuid,
                recieverUuid: row.itileOrder.createUser,
                historyUuid: row.historyUuid,
                viewMode: 'answer'
              });
            }
          }
        ]
      },

      getList() {
        $axios.get('/satisfiedsurvey/getItilOrderSatisfiedHistory').then(({ data }) => {
          if (data && data instanceof Array) {
            for (let i = 0; i < data.length; i++) {
              data[i].serialCode = data[i].itileOrder.serialCode;
              data[i].briefDesc = data[i].itileOrder.briefDesc;
              data[i].orderTypeStr = ['事件管理', '', '', '', '', '', '服务请求'][data[i].itileOrder.orderType];
              data[i].statusName = data[i].itileOrder.statusName;
              data[i].createUserName = data[i].itileOrder.createUserName;
              data[i].createTime = data[i].itileOrder.createTime;
            }
            this.data = data;
          }
        });
      },

      filterType(value, row) {
        return row.orderTypeStr === value;
      },

      handleOpenConfig() {
        this.$emit('open-config');
      },

      goLibrary() {
        $axios.get('/satisfiedsurvey/getAllPaper').then((res) => {
          let paperLen = Object.keys(res.data);
          if (paperLen.length === 0) {
            // 创建初始问卷
            this.$prompt('创建您的第一份问卷', '创建问卷', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPlaceholder: '问卷名称'
            }).then(({value}) => {
              if (value.trim().length > 0) {
                $axios.post('/satisfiedsurvey/addPaper', {paperName: value.trim()}).then((res) => {
                  if (typeof res.data === 'string' && res.data.length === 32) {
                    // 添加成功
                    this.$emit('go', 'library');
                  } else {
                    this.$message({type: 'error', message: '创建失败'});
                  }
                });
              } else {
                this.$message({type: 'error', message: '请输入问卷名'});
              }
            }).catch(() => {
              // 取消
            });
          } else {
            this.$emit('go', 'library');
          }
        });
      },

      goLog() {
        this.$emit('go', 'log');
      }
    }
  }
</script>

<style>
  .satisfaction-survey-history-header,
  .satisfaction-survey-log-header {
    display: flex;
    flex-direction: row;
    height: 44px;
    line-height: 44px;
    align-items: center;
    margin-bottom: 12px;
  }
  .satisfaction-survey-history-header .iconfont,
  .satisfaction-survey-log-header .iconfont {
    fot-size: 20px;
  }
  .satisfaction-survey-history-header h2,
  .satisfaction-survey-log-header h2 {
    padding-left: 6px;
    font-size: 16px;
  }
  .satisfaction-survey-history-header .s-button {
    margin-left: 6px;
  }
  .satisfaction-survey-log-header .more {
    font-size: 14px;
    cursor: pointer;
  }
</style>
