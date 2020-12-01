<template>
  <s-dialog v-model="dialogFlag" title="选择变更单模板" width="900px" class="templateDialog" append-to-body>
    <s-row>
      模板搜索：
      <s-input v-model="searchValue" icon="magnifier" placeholder="请输入模板名称"
               style="width: 220px;margin-left: 10px;"></s-input>
    </s-row>
    <s-row :gutter="15" style="margin-top: 10px;">
      <s-col span="14">
        <s-radio-group v-model="selTemplate">
          <s-table :data="filterTemplateList" style="width: 100%;" :height="350"
                   @current-change="templateChange" :row-class-name="templateCurRow">
            <s-table-column width="60" align="center">
              <template slot-scope="scope">
                <s-radio :label="scope.row"></s-radio>
              </template>
            </s-table-column>
            <s-table-column prop="serialCode" label="编号" show-overflow-tooltip></s-table-column>
            <s-table-column prop="templateName" label="模板名称" show-overflow-tooltip></s-table-column>
            <s-table-column prop="briefDesc" label="简要描述" show-overflow-tooltip></s-table-column>
          </s-table>
        </s-radio-group>
      </s-col>
      <s-col span="10">
        <div class="temDetailBox">
          <s-scrollbar wrap-style="height: 350px;">
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">编号</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.serialCode}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">模板名称</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.templateName}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">简要描述</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.briefDesc}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">详细描述</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.detailDesc}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">分类一级</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.categoryFirstName}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">分类二级</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.categorySecondName}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">分类三级</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemplate.categoryThirdName}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">风险等级</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemOther.riskLevel}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">变更路径</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemOther.changePath}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">变更动作</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemOther.changeAction}}</div>
              </s-col>
            </s-row>
            <!--<s-row>-->
              <!--<s-col :span="10">-->
                <!--<div class="grid-content bg-purple">变更经理组</div>-->
              <!--</s-col>-->
              <!--<s-col :span="14">-->
                <!--<div class="grid-content bg-purple-light">{{managerGroupMap.managerGroup}}</div>-->
              <!--</s-col>-->
            <!--</s-row>-->
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">变更环境</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemOther.changeEnvironment}}</div>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="10">
                <div class="grid-content bg-purple">受影响单位</div>
              </s-col>
              <s-col :span="14">
                <div class="grid-content bg-purple-light">{{selTemOther.effectOrgnizition}}</div>
              </s-col>
            </s-row>
          </s-scrollbar>
        </div>
      </s-col>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import Bus from '@/plugins/eventBus';

  export default {
    data() {
      return {
        dialogFlag: false,
        searchValue: '',
        templateList: [],
        selTemplate: {},
        options: {
          changeActionMap: {},
          changeRiskLevelMap: {},
          changePathMap: {},
          changeEnvironmentMap: {}
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curTemplate: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      filterTemplateList() {
        if (!this.searchValue) return this.templateList;
        return this.templateList.filter(item => {
          return item.templateName.indexOf(this.searchValue) !== -1;
        });
      },
      selTemOther() {
        if (Object.keys(this.selTemplate).length === 0) {
          return {}
        }
        let obj = {
          changeAction: this.options.changeActionMap[this.selTemplate.changeAction],
          riskLevel: this.options.changeRiskLevelMap[this.selTemplate.riskLevel],
          changePath: this.options.changePathMap[this.selTemplate.changePath],
          changeEnvironment: this.options.changeEnvironmentMap[this.selTemplate.changeEnvironment],
          effectOrgnizition: this.selTemplate.effectOrgnizitionName
        };
        return obj;
      },
      managerGroupMap() {
        if (Object.keys(this.selTemplate).length === 0) {
          return {}
        }
        let obj = {
          managerGroup: this.options.managerGroupMap[this.selTemplate.managerGroup]
        };
        return obj;
      }
    },
    created() {
      this.axiosTemplate();
      this.axiosOptions();
    },
    methods: {
      axiosTemplate() {
        $axios.get('/itilChangeOrder/getChangeOrderTemplate').then(({data}) => {
          this.templateList = data;
          if (Object.keys(this.curTemplate).length !== 0) {
            this.selTemplate = this.templateList.find(item => item.uuid === this.curTemplate.uuid)
          }
        })
      },
      axiosOptions() {
        $axios.get('/itilChangeOrder/getChangeOrderSelectData').then(({data}) => {
          for (let i in this.options) {
            this.options[i] = data[i]
          }
        })
      },
      templateChange(row) {
        if (this.selTemplate.uuid !== row.uuid) {
          this.selTemplate = row;
        }
      },
      templateCurRow(row) {
        if (this.selTemplate.uuid === row.uuid) {
          return 'current-row';
        }
      },
      dialogOk() {
        if (Object.keys(this.selTemplate).length === 0) {
          this.$message({type: 'warning', message: '请选择变更模板!'})
          return;
        }
        Bus.$emit('finish', this.selTemplate)
        this.dialogFlag = false;
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
    }
  }
</script>

<style lang="stylus">

</style>
