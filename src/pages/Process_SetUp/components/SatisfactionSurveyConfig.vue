<template>
  <div class="satisfaction-survey-config">
    <h3>设置发送问卷</h3>
    <s-row style="height: 40px; line-height: 40px;">
      <s-col span="8">是否开启问卷发送</s-col>
      <s-col span="16"><s-switch v-model="autoSend" :active-value="1" :inactive-value="0"></s-switch></s-col>
    </s-row>

    <div v-if="autoSend" class="ssc-card">
      <div class="ssc-card-header">事件管理</div>
      <div class="ssc-card-body">
        <s-row>
          <s-col span="8">选择问卷</s-col>
          <s-col span="8">
            <s-select v-model="selectedEventPaper">
              <s-option
                v-for="(value, key, index) in allEventPaper"
                :key="index"
                :label="value"
                :value="key"/>
            </s-select>
          </s-col>
          <s-col span="7" offset="1">
            <s-button @click="handlePaperView(selectedEventPaper)">预览</s-button>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="8">选择接收人</s-col>
          <s-col span="16">
            <s-checkbox-group v-model="eventPaperRecipient">
              <s-checkbox label='createUser'>提交人</s-checkbox>
              <s-checkbox label='assignUser'>事件处理人</s-checkbox>
              <s-checkbox label="tsecondroleinfo00000000000000017">事件经理</s-checkbox>
            </s-checkbox-group>
          </s-col>
        </s-row>
      </div>
    </div>

    <div v-if="autoSend" class="ssc-card">
      <div class="ssc-card-header">服务请求</div>
      <div class="ssc-card-body">
        <s-row>
          <s-col span="8">选择问卷</s-col>
          <s-col span="8">
            <s-select v-model="selectedServicePaper">
              <s-option
                v-for="(value, key, index) in allServicePaper"
                :key="index"
                :label="value"
                :value="key"/>
            </s-select>
          </s-col>
          <s-col span="7" offset="1">
            <s-button @click="handlePaperView(selectedServicePaper)">预览</s-button>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="8">选择接收人</s-col>
          <s-col span="16">
            <s-checkbox-group v-model="servicePaperRecipient">
              <s-checkbox label="createUser">提交人</s-checkbox>
              <s-checkbox label="finalUser">请求处理人</s-checkbox>
              <s-checkbox label="managerUser">请求管理员</s-checkbox>
            </s-checkbox-group>
          </s-col>
        </s-row>
      </div>
    </div>

    <s-row v-if="autoSend">
      <s-col span="8">回收时间</s-col>
      <s-col span="16">
        <s-select v-model="callbackTime">
          <s-option
            v-for="item in callbackTimeArr"
            :key="item"
            :label="`${item}天`"
            :value="item"/>
        </s-select>
      </s-col>
    </s-row>

    <s-row v-if="autoSend">
      <s-col span="8">未答题默认选择第一项</s-col>
      <s-col span="16">
        <s-switch v-model="autoSelect" :active-value="1" :inactive-value="0"></s-switch>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        list: {},                       // 所有问卷列表
        autoSend: 0,                // 问卷自动发送switch
        autoSelect: 0,              // 未答题自动选择第一项
        allEventPaper: {},              // 所有事件管理问卷列表
        selectedEventPaper: '',         // 选择的事件管理问卷uuid
        allServicePaper: {},            // 所有服务请求问卷列表
        selectedServicePaper: '',       // 选择的服务请求问卷uuid
        eventPaperRecipient: [],        // 事件管理接收人列表
        servicePaperRecipient: [],      // 服务请求接收人列表
        callbackTime: '',               // 回收时间
        callbackTimeArr: ['1', '3', '5', '7']   // 回收时间options
      }
    },
    created() {
      this.getConfig();
      this.getList();
    },
    methods: {
      // 查看问卷详情
      handlePaperView(uuid) {
        this.$emit('view', {
          paperUuid: uuid,
          recieverUuid: '',
          viewMode: 'question'
        });
      },
      // 获取所有问卷列表
      getList() {
        $axios.get('/satisfiedsurvey/getAllPaper').then((res) => {
          this.allEventPaper = this.allServicePaper = res.data;
        });
      },
      // 获取问卷设置
      getConfig() {
        $axios.get('/systemmanager/sysConfig/getSendPaperSetting').then((res) => {
          this.callbackTime = res.data.defaultRecyclTime;
          this.selectedEventPaper = res.data.incidentManagerPaperSend;
          this.eventPaperRecipient = res.data.incidentManagerReceiver;
          this.autoSend = parseInt(res.data.openPaperSend);
          this.autoSelect = parseInt(res.data.itemChooseOne);
          this.selectedServicePaper = res.data.serviceRequestPaperSend;
          this.servicePaperRecipient = res.data.serviceRequestReceiver;
        });
      },
      // 保存问卷设置
      saveConfig() {
        let param = {
          openPaperSend: this.autoSend.toString(), // 是否开启发送功能
          incidentManagerPaperSend: this.selectedEventPaper, // 选择事件问卷
          serviceRequestPaperSend: this.selectedServicePaper, // 选择服务问卷
          incidentManagerReceiver: this.eventPaperRecipient, // 选择事件接收人
          serviceRequestReceiver: this.servicePaperRecipient, // 选择服务接收人
          defaultRecyclTime: this.callbackTime, // 回收时间
          itemChooseOne: this.autoSelect.toString() // 默认选择第一项
        }
        $axios.post('/systemmanager/sysConfig/saveSendPaperSetting', param, {
          data: [],
          logTemplate: '编辑|满意度调查>问卷库发送设置'
        }).then((res) => {
          if (res.data.result) {
            this.$message({type: 'success', message: '保存成功!'})
            this.$emit('closeDialog');
          }
        });
      }
    }
  }
</script>

<style>
  .satisfaction-survey-config h3 {
    font-size: 14px;
    font-weight: bold;
  }
  .satisfaction-survey-config .s-row {
    height: 36px;
    line-height: 36px;
  }
  .satisfaction-survey-config .ssc-card {
    margin-bottom: 12px;
    border-radius: 4px;
    overflow: hidden;
  }
  .satisfaction-survey-config .ssc-card-header {
    font-size: 14px;
    font-weight: bold;
    height: 32px;
    line-height: 32px;
    padding-left: 6px;
  }
  .satisfaction-survey-config .ssc-card-body {
    padding: 12px 6px;
  }
</style>
