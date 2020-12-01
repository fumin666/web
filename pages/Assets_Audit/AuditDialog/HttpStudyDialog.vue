<template>
  <s-dialog v-model="dialogFlag" title="登录业务学习" width="700px" class="httpStudyDialog">
    <s-scrollbar wrap-class="dialogScrollbar">
    <s-form :model="studyForm" :inline="true" :rules="studyRule" ref="studyForm">
      <s-form-item label="用户名:" prop="bizName">
        <s-input v-model="studyForm.bizName"></s-input>
      </s-form-item>
      <s-form-item label="用户IP:" prop="clientIp">
        <s-input v-model="studyForm.clientIp"></s-input>
      </s-form-item>
      <s-form-item label="时间范围:">
        <s-date-picker v-model="studyForm.timePeriod" type="datetimerange"  :picker-options="pickerOptions" placeholder="选择时间范围">
        </s-date-picker>
      </s-form-item>
      <s-form-item>
        <s-button @click="retrieval">检索</s-button>
      </s-form-item>
    </s-form>
    <s-row class="title">候选业务列表</s-row>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosStudyObj"
                         :start-ajax="startAjax">
      <s-table-column type="expand">
        <template slot-scope="scope">
          <s-row class="expandName">URL:</s-row>
          <s-row class="expandInfo">{{scope.row.referer}}</s-row>
          <s-row class="expandName">Post参数:</s-row>
          <s-row class="expandInfo">{{scope.row.post_arg}}</s-row>
        </template>
      </s-table-column>
      <s-table-column label="URL" prop="referer" show-overflow-tooltip></s-table-column>
      <s-table-column label="POST参数" prop="post_arg" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center" widht="80">
        <template slot-scope="scope">
          <i class="iconfont icon-add" @click="rowAdd(scope.row)"></i>
        </template>
      </s-table-column>
    </page-infinite-table>
    </s-scrollbar>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default {
    data() {
      function pickerClick(picker, minu) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 60 * 1000 * minu);
        picker.$emit('pick', [start, end]);
      }
      return {
        dialogFlag: false,
        studyForm: {
          bizName: '',
          clientIp: '',
          timePeriod: ''
        },
        studyRule: {
          bizName: [Validaters.NotNull],
          clientIp: [Validaters.IP]
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '最近5分钟',
              onClick(picker) {
                pickerClick(picker, 5);
              }
            }, {
              text: '最近10分钟',
              onClick(picker) {
                pickerClick(picker, 10);
              }
            }, {
              text: '最近30分钟',
              onClick(picker) {
                pickerClick(picker, 30);
              }
            }, {
              text: '最近1小时',
              onClick(picker) {
                pickerClick(picker, 60);
              }
            }, {
              text: '今天',
              onClick(picker) {
                pickerClick(picker, 60 * 24);
              }
            }
          ]
        },
        startAjax: false,
        axiosStudyObj: {
          type: 'post',
          url: 'sysDbauditBusiness/searchUrlBusiness',
          params: {
            condition: {}
          }
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      studyObj() {
        function getTime(str) {
          if (!str) return '';
          return window.parseInt((new Date(str).getTime()) / 1000);
        }
        let obj = {};
        for (let i in this.studyForm) {
          if (i !== 'timePeriod') {
            obj[i] = this.studyForm[i];
          }
        }
        if (this.studyForm.timePeriod && this.studyForm.timePeriod.length > 0) {
          obj.startTime = getTime(this.studyForm.timePeriod[0]);
          obj.endTime = getTime(this.studyForm.timePeriod[1]);
        }
        return obj;
      }
    },
    created() {
      this.studyForm.timePeriod = [];
      let endTime = new Date();
      let now = new Date();
      let startTime = now.setTime(now.getTime() - 60 * 1000 * 5);
      this.studyForm.timePeriod.push(startTime, endTime);
    },
    methods: {
      retrieval() {
        this.$refs.studyForm.validate(valid => {
          if (!valid) {
            return;
          }
          this.startAjax = true;
          this.axiosStudyObj.params.condition = this.studyObj;
        });
      },
      rowAdd(row) {
        let param = {
          appId: this.$route.params.appId,
          usernamePattern: this.studyForm.bizName,
          bizPattern: row.referer,
          usernameKey: row.post_arg
        };
        $axios.post(`/sysDbauditBusiness/learnHttp`, param).then(({data}) => {
          if (data === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: '保存失败!', type: 'error'});
          }
        });
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
    components: {
      pageInfiniteTable
    }
  }
</script>
