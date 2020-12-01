<template>
  <s-dialog v-model="dialogFlag" title="登录SQL学习" width="800px" class="sqlStudyDialog">
    <s-scrollbar wrap-class="dialogScrollbar">
      <s-form :model="studyForm" :inline="true" :rules="studyRule" ref="studyForm">
        <s-form-item label="用户名:" prop="user_name">
          <s-input v-model="studyForm.user_name"></s-input>
        </s-form-item>
        <s-form-item label="用户IP:" prop="clientIp">
          <s-input v-model="studyForm.clientIp"></s-input>
        </s-form-item>
        <s-form-item label="SQL模式:">
          <s-input v-model="studyForm.patternStr" placeholder="多个以,分隔"></s-input>
        </s-form-item>
        <s-form-item>
          <s-checkbox v-model="studyForm.patternStrMatch" :true-label="1" :false-label="0">
            使用正则表达式匹配
          </s-checkbox>
        </s-form-item>
        <s-form-item label="时间范围:">
          <s-date-picker v-model="studyForm.timePeriod" type="datetimerange"  :picker-options="pickerOptions" placeholder="选择时间范围">
          </s-date-picker>
        </s-form-item>
        <s-form-item>
          <s-button @click="retrieval">检索</s-button>
        </s-form-item>
      </s-form>
      <s-row class="title">候选SQL列表</s-row>
      <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosStudyObj"
      :start-ajax="startAjax" @load-callback="loadCallback">
      <s-table-column type="expand">
        <template slot-scope="scope">
          <s-row class="expandName">SQL模式:</s-row>
          <s-row class="expandInfo">{{scope.row.pattern_str}}</s-row>
          <s-row class="expandName">Post参数:</s-row>
          <s-row class="expandInfo">{{filterParams(scope.row.sql_params)}}</s-row>
        </template>
      </s-table-column>
      <s-table-column label="SQL模式" prop="pattern_str" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="参数" show-overflow-tooltip>
        <template slot-scope="scope">
          {{filterParams(scope.row.sql_params)}}
        </template>
      </s-table-column>
      <s-table-column label="	用户ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <s-select v-model="scope.row.userIdStr" placeholder="请选择">
            <s-option-group v-for="(group,index) in getGroupOptions(scope.row)"
                            :label="group.label" :key="'id' + group.label + index">
              <s-option v-for="(item,childIndex) in group.childOptions" :label="item.label"
                        :value="item.value" :key="'id' + group.label + item.label + childIndex">
              </s-option>
            </s-option-group>
          </s-select>
        </template>
      </s-table-column>
      <s-table-column label="	用户名" show-overflow-tooltip>
        <template slot-scope="scope">
          <s-select v-model="scope.row.userNameStr" placeholder="请选择">
            <s-option-group v-for="(group,index) in getGroupOptions(scope.row)"
                            :label="group.label" :key="'name' + group.label + index">
              <s-option v-for="(item,childIndex) in group.childOptions" :label="item.label"
                        :value="item.value" :key="'name' + group.label + item.label + childIndex">
              </s-option>
            </s-option-group>
          </s-select>
        </template>
      </s-table-column>
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
          user_name: '',
          clientIp: '',
          patternStr: '',
          patternStrMatch: 0,
          timePeriod: ''
        },
        studyRule: {
          user_name: [Validaters.NotNull],
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
          url: '/sysDbauditBusiness/searchSqlBussiness',
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
        if (this.studyForm.timePeriod) {
          obj.startTime = getTime(this.studyForm.timePeriod[0]);
          obj.endTime = getTime(this.studyForm.timePeriod[1]);
        } else {
          obj.startTime = 0;
          obj.endTime = 0;
        }
        return obj;
      }
    },
    created() {
      // 默认为近5分钟
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
          let param = Object.assign({}, this.studyObj);
          param.appId = this.$route.params.appId - 0;
          this.startAjax = true;
          this.axiosStudyObj.params.condition = param;
        });
      },
      loadCallback(list) {
        list.forEach(item => {
          this.$set(item, 'userIdStr', '空或NULL,,');
          this.$set(item, 'userNameStr', '空或NULL,,');
        })
      },
      filterParams(paramStr) {
        return paramStr.replace(/&/g, ',');
      },
      getGroupOptions(row) {
        let groupOptions = [
          {
            label: '无',
            childOptions: [
              {
                label: '无',
                value: '空或NULL,,'
              }
            ]
          }, {
            label: '参数',
            childOptions: []
          }, {
            label: '字段',
            childOptions: []
          }, {
            label: '结果集',
            childOptions: []
          }
        ];
        for (let i in row.seqList) {
          if (i === 'args') { // 参数
            row.seqList[i].forEach((val, index) => {
              groupOptions[1].childOptions.push({
                label: '参数' + (index + 1) + ':' + val,
                value: '{param_by_index},' + val + ',' + (index + 1)
              })
            })
          } else if (i === 'name_args') {
            for (let j = 0; j < row.seqList[i].length; j += 2) {
              groupOptions[2].childOptions.push({
                label: row.seqList[i][j] + ':' + row.seqList[i][j + 1],
                value: '{field_by_name},' + row.seqList[i][j] + ',' + row.seqList[i][j]
              })
            }
          } else if (i === 'sqlResult') {
            if (row.seqList[i].fields) {
              row.seqList[i].fields.forEach((val, index) => {
                groupOptions[3].childOptions.push({
                  label: '列' + (index + 1) + ':' + val,
                  value: '{column_by_index},' + val + ',' + (index + 1)
                })
              });
            }
          }
        }
        return groupOptions;
      },
      rowAdd(row) {
        let param = {
          appId: this.$route.params.appId,
          bizPattern: row.pattern_str,
          useridPattern: row.userIdStr.split(',')[0],
          useridKey: row.userIdStr.split(',')[2],
          usernamePattern: row.userNameStr.split(',')[0],
          usernameKey: row.userNameStr.split(',')[2]
        };
        $axios.post(`/sysDbauditBusiness/learnSql`, param).then(({data}) => {
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
