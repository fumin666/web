<template>
  <section id="approvalMap">
    <s-row class="step-title">
      定义服务请求审批
      <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
    </s-row>
    <s-row>
      <s-col :span="4">
        <s-row class="radio-item"><s-radio v-model="approvalMapForm.approveRules" :label="0" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">无审批</s-radio></s-row>
        <s-row class="radio-item"><s-radio v-model="approvalMapForm.approveRules" :label="1" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">制定审批人</s-radio></s-row>
        <s-row class="radio-item"><s-radio v-model="approvalMapForm.approveRules" :label="2" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">角色审批</s-radio></s-row>
        <s-row class="radio-item"><s-radio v-model="approvalMapForm.approveRules" :label="3" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">组内审批</s-radio></s-row>
      </s-col>
      <s-col :span="20">
        <s-row class="select-item">&nbsp;</s-row>
        <s-row class="select-item">
          <span v-if="approvalMapForm.approveRules!==1">&nbsp;</span>
          <div class="approval-list-ctn" v-if="approvalMapForm.approveRules===1">
            <s-select v-model="currentSelectApproval" placeholder="请选择" @change="addApproval('approvalUserLists')">
              <s-option
                v-for="list in approvalUserLists"
                :label="list.userRealName" :value="list.uuid" :key="list.uuid">
              </s-option>
            </s-select>
            <ul class="showGroup">
              <li v-for="item in approvalMapForm.approvalList">
                <span>{{item.userRealName}}</span>
                <span class="tool-bar"><i class="iconfont icon-delete" @click="deleteApproval(item)"></i></span>
              </li>
            </ul>
          </div>
        </s-row>
        <s-row class="select-item">
          <span v-if="approvalMapForm.approveRules!==2">&nbsp;</span>
          <div class="approval-list-ctn" v-if="approvalMapForm.approveRules===2">
            <s-select v-model="currentSelectApproval" placeholder="请选择" @change="addApproval('approvalRoleLists')">
              <s-option
                v-for="list in approvalRoleLists"
                :label="list.roleName" :value="list.uuid" :key="list.uuid">
              </s-option>
            </s-select>
            <ul class="showGroup">
              <li v-for="(item,index) in approvalMapForm.approvalList" :key="index">
                <span>{{item.name || item.roleName}}</span>
                <span class="tool-bar"><i class="iconfont icon-delete" @click="deleteApproval(item)"></i></span>
              </li>
            </ul>
          </div>
        </s-row>
        <s-row class="select-item">
          <span v-if="approvalMapForm.approveRules!==3">&nbsp;</span>
          <div class="approval-list-ctn" v-if="approvalMapForm.approveRules===3">
            <s-select v-model="currentSelectApproval" placeholder="请选择" @change="addApproval('approvalGroupLists')">
              <s-option
                v-for="list in approvalGroupLists"
                :label="list.groupName" :value="list.uuid" :key="list.uuid">
              </s-option>
            </s-select>
            <ul class="showGroup">
              <li v-for="(item,index) in approvalMapForm.approvalList" :key="index">
                <span>{{item.groupName}}</span>
                <span class="tool-bar"><i class="iconfont icon-delete" @click="deleteApproval(item)"></i></span>
              </li>
            </ul>
          </div>
        </s-row>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        approvalGroupLists: [],     // 审批组下拉选项列表
        approvalUserLists: [],      // 审批人下拉选项列表
        approvalRoleLists: [],      // 审批角色下拉选项列表
        currentSelectApproval: [],  // select当前选中值
        approvalMapForm: {
          approveRules: 0,
          approvalList: []          // 已选择的列表
        }
      }
    },
    watch: {
      'approvalMapForm.approveRules'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.currentSelectApproval = ''
          this.approvalMapForm.approvalList = []
        }
      }
    },
    methods: {
      // 获取审批人下拉选项列表
      getApprovalUserLists() {
        $axios.get(`/iamUserInfo/getIamUserInfoListForItil`).then(({data}) => {
          if (data && data instanceof Array) {
            this.approvalUserLists = data;
          }
        });
      },
      // 获取审批角色下拉选项列表
      getApprovalRoleLists() {
        $axios.get(`/itilServiceRequest/getItilRoleList`).then(({data}) => {
          if (data && data instanceof Array) {
            this.approvalRoleLists = data;
          }
        });
      },
      // 获取审批组下拉选项列表
      getApprovalGroupLists() {
        $axios.get(`/itilWorkflowConfig/getItilSupportGroupList`).then(({data}) => {
          if (data && data instanceof Array) {
            this.approvalGroupLists = data;
          }
        });
      },
      // 添加
      addApproval(name) {
        let uuidList = this.approvalMapForm.approvalList.map((item) => item.uuid);
        if (uuidList.indexOf(this.currentSelectApproval) === -1) {
          this[name].forEach((item) => {
            if (item.uuid === this.currentSelectApproval) {
              this.approvalMapForm.approvalList.push(item);
              this.currentSelectApproval = '';
            }
          });
        } else {
          this.currentSelectApproval = '';
          this.$message({
            type: 'warning',
            message: '该项已存在于已选列表中，请勿重复选择!'
          });
        }
      },
      // 删除
      deleteApproval(deItem) {
        this.approvalMapForm.approvalList = this.approvalMapForm.approvalList.filter((item) => item.uuid !== deItem.uuid);
      }
    },
    created() {
      this.getApprovalUserLists();    // 获取审批人下拉选项列表
      this.getApprovalRoleLists();    // 获取审批角色下拉选项列表
      this.getApprovalGroupLists();   // 获取审批组下拉选项列表
    },
    computed: {
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      },
      designeruuid() {
        if (this.$store.state.serviceRequest.editDesigner) {
          return this.$store.state.serviceRequest.editDesigner.uuid
        } else {
          return null;
        }
      }
    },
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.approvalMapForm.approveRules = state.editDesigner.editData.itilRequestDesigner.itilRequestDesignerOne[0].approveRules;
        this.$nextTick(() => {
          this.approvalMapForm.approvalList = state.editDesigner.editData.ApproveDetail || [];
        });
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #approvalMap
    margin-bottom 120px
    .radio-item, .select-item
      line-height 40px
    .showGroup
      width 350px
      li
        position relative
        font-size 14px
        line-height 28px
        padding-left 20px
        margin-bottom 2px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
        &:hover .tool-bar
          opacity 1
        .tool-bar
          position absolute
          right 20px
          opacity 0
          .iconfont
            cursor pointer
            font-size 18px
</style>
