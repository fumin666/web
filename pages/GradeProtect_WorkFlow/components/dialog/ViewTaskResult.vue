<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务-查看任务执行结果
 -->
<template>
  <s-dialog v-model="dialogFlag" title="查看任务执行结果" width="800px" append-to-body class="task-result">
    <s-row style="height: 450px">
      <s-col :span="6" class="left-box bgGray">
        <s-input placeholder="请输入用户名称" v-model="searchKey" class="" icon="magnifier" @input="searchHandle"
                 style="margin-right: 20px; margin-bottom: 10px"></s-input>
        <s-scrollbar wrap-class="default-dialog-scroll">
          <div v-nodata="!taskListNew.length" style="height: 350px" v-if="!taskListNew.length"></div>
          <s-row class="user-item" :class="{'is-active': currentItem === index}"
                 v-for="(item, index) in taskListNew" :key="index" v-if="taskListNew.length">
            <div @click="currentInfo(item, index)" >
              <s-col :span="14" class="ellipsis">
                <img v-if="item.userPhotopath" :src="item.userPhotopath">
                <img v-else src="static/images/system/UserPhoto.png"/>
                <i class="iconfont"></i>
                <span :title="item.userName">{{item.userName}}</span>
              </s-col>
              <s-col :span="10" class="text-right" :class="[item.executeStatus === '已完成' ? 'state-success' : 'state-pending']">
                <img src="/static/images/processCenter/success.svg" alt="" v-if="item.executeStatus === '已完成'">
                <img src="/static/images/processCenter/pending.svg" alt="" v-else>
                {{item.executeStatus}}
              </s-col>
            </div>
          </s-row>
        </s-scrollbar>
      </s-col>
      <s-col :span="18">
        <s-scrollbar wrap-class="default-dialog-scroll">
          <div class="right-box">
            <div style="margin: 20px 0">
              <span class="spanText">工作信息 （<i class="iconfont icon-link"></i>附件 <span class="link-title"  @click="viewFile">{{fileCount}}</span>）</span>
              <s-button @click="addKnowledge" class="fr" style="margin-right: 10px">加入知识库</s-button>
            </div>
            <s-row class="right-item" v-for="(infoItem, index1) in currentItemArr" :key="index1">
              <div class="date theme_fontcolor65">{{infoItem.createTime}}</div>
              <div class="text theme_fontcolor85" style="word-wrap:break-word">{{infoItem.workInfo}}</div>
            </s-row>
          </div>
        </s-scrollbar>
      </s-col>
    </s-row>
    <!--查看文件-->
    <view-task-file
      v-if="viewTaskFileFlag"
      v-model="viewTaskFileFlag"
      :workflowFileList="workflowFileList"
    ></view-task-file>
    <!-- 添加编辑知识库表单 -->
    <AddEditKnowledge
      v-if="addEditDialog"
      :addEditDialog.sync="addEditDialog"
      :isAdd="isAdd"
      :rowUuid="rowUuid"
      @reload="getReloadList">
    </AddEditKnowledge>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import viewTaskFile from '@/pages/Safety_BulletinTask/components/dialog/ViewTaskFile'
  import AddEditKnowledge from '@/pages/GradeProtect_Knowledge/Dialog/AddEditKnowledge'
  export default {
    components: {
      viewTaskFile,
      AddEditKnowledge
    },
    data() {
      return {
        dialogFlag: false,
        viewTaskFileFlag: false,
        // 知识库
        addEditDialog: false,
        isAdd: true,
        rowUuid: '',
        searchKey: '',
        fileCount: 0,
        workflowFileList: [], // 附件集合
        taskList: [],
        currentItem: '',
        taskListNew: [], // 搜索List
        currentItemArr: []  // 当前工作信息
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      rowData: {
        type: Object,
        default: null
      },
      resultType: {
        type: Number,
        default: 1
      },
      historyType: {
        type: Boolean,
        default: false
      },
      resultData: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        let vm = this;
        if (this.historyType) { // 根据类型判断是从历史任务进来
          vm.taskList = vm.resultData;
          vm.taskListNew = vm.resultData;
          vm.currentItemArr = vm.taskList[0].workflows;
          vm.workflowFileList = vm.taskList[0].workflowFileList;
          vm.fileCount = vm.taskList[0].fileCount;
          vm.currentItem = 0
        } else {
          $axios.get(`/safetyPlatform/bulletinIssuedTask/getSafeTaskExecutionResult/${this.rowData.uuid}/${this.resultType}`).then(({data}) => {
            console.log(data);
            vm.taskList = data;
            vm.taskListNew = data;
            vm.currentItemArr = vm.taskList[0].workflows;
            vm.workflowFileList = vm.taskList[0].workflowFileList;
            vm.fileCount = vm.taskList[0].fileCount;
            vm.currentItem = 0
          })
        }
      },
      currentInfo(item, index) { // 当前选中数据
        this.fileCount = item.fileCount;
        this.workflowFileList = item.workflowFileList;
        this.currentItemArr = item.workflows
        this.currentItem = index
      },
      searchHandle() {
        this.taskListNew = [];
        for (let i = 0; i < this.taskList.length; i++) {
          // 如果字符串中不包含目标字符会返回-1
          if (this.taskList[i].userName.indexOf(this.searchKey) >= 0) {
            this.taskListNew.push(this.taskList[i]);
          }
        }
        if (this.taskListNew.length !== 0) {
          this.currentItemArr = this.taskListNew[0].workflows;
          this.fileCount = this.taskList[0].fileCount;
          this.workflowFileList = this.taskList[0].workflowFileList;
        } else {
          this.fileCount = 0;
          this.currentItemArr = []
          this.workflowFileList = []
        }
        this.currentItem = 0
        return this.taskListNew;
      },
      viewFile() { // 查看附件
        this.viewTaskFileFlag = true
      },
      addKnowledge() { // 加入知识库
        this.addEditDialog = true;
        this.isAdd = true;
      },
      getReloadList() {}
    }
  }
</script>
<style lang="stylus">
  .task-result
    .s-dialog-body
      padding 0
      .left-box
        height 100%
        padding 10px 12px
        .user-item
          width 100%
          height 42px
          line-height 42px
          cursor pointer
          padding 0 5px
          & img
            width 26px
            height 26px
            border-radius 50%
            vertical-align middle
          .state-success
            color #67C23A
          .state-pending
            color #409EFF
          .text-right
            & > img
              width 12px
              height 12px
      .right-box
        margin-left 20px
        .link-title
          cursor pointer
          color #199fed
        .right-item
          padding 0 0 30px 0
          .date
            margin-bottom 5px
          .text
            line-height 25px
</style>

