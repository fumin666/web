<template>
  <div id="accountOrgGraph" class="org-graph-container">
    <s-row type="flex" style="position: relative;">
      <s-col class="graph-wrap" :style="{ height: 'calc(100vh - 358px)', width: '100%' }">
        <div class="graph-container" id="graphContainer">
        </div>
      </s-col>
      <s-fishbone style="top:20px;right:2%;" ref="fishbone" :graph="graph"></s-fishbone>
      <!--<div class="welcome">欢迎您，{{ firstTreeNodeName }}：</div>
      <s-col :span="5" class="left-panel">
        <div style="margin:0 auto;height: 60px;width: 100%;line-height: 60px" id="buttonLine">
          <s-button icon="import" title="导入" @click="orgImport" v-noBtn="'accountManage_importOrganization'" style="margin-right: 5px">导入</s-button>
          <s-button icon="export" title="导出" @click="orgExport" v-noBtn="'accountManage_exportOrganization'" style="margin-left:5px">导出</s-button>
        </div>
        <div class="orgDetail" id="orgDetailEle">
          <div class="org_name" :title="orgInfo.departName">{{ orgInfo.departName }}</div>
          <div class="org_info_item"><span :title="orgInfo.chargePerson">负责人：</span> {{ orgInfo.chargePerson }}</div>
          <div class="org_info_item"><span>管理机构数：</span> {{ orgInfo.orgCounter }}</div>
          <div class="org_info_item"><span>管理账号数：</span> {{ orgInfo.accountCounter }}</div>
        </div>
        <s-row type="flex" class="user-list">
          <s-col :span="12">
            账号名称
          </s-col>
          <s-col :span="12">
            真实姓名
          </s-col>
        </s-row>
        <s-scrollbar wrap-class="scrollheight" :wrap-style="'height:' + scrollbarHeight + 'px;'">
          <s-row type="flex" v-for="item in userAry" :key="item.uuid" class="user-list-item">
            <s-col :span="12">
              {{ item.userLoginName }}
            </s-col>
            <s-col :span="12">
              {{ item.userRealName }}
            </s-col>
          </s-row>
        </s-scrollbar>
      </s-col>-->
    </s-row>
    <!--新增组织机构-->
    <dialog-org-add v-model="showOrgAdd" v-if="showOrgAdd" ref="addorg"></dialog-org-add>
    <!--编辑组织机构-->
    <dialog-org-add v-model="showOrgEdit" v-if="showOrgEdit" title="编辑组织机构"></dialog-org-add>
    <!--添加人员-->
    <staff-add-dialog v-model="staffAddDialog" v-if="staffAddDialog" :staff="{}" :curUuid="tempCell.uuid">
    </staff-add-dialog>
    <import-dialog
      v-if="importOrgDialog"
      v-model="importOrgDialog"
      :upload-obj="uploadObj"
      :down-obj="downObj"
      :saveLog="true"
      :modelName="'组织机构管理>组织机构'"
      @reload="updateChild"
      :fileTypes="['xls', 'xlsx']">
    </import-dialog>
  </div>
</template>
<script>
  import mixin from '@/components/graph/OrgGraphMixin'
  import importDialog from '@/components/importDialog/ImportDialog';
  export default {
    mixins: [mixin],
    name: 'AccountOrgGraph',
    data() {
      return {
        scrollbarHeight: 120,
        isLevelOne: true             // 标注自己在一级页面内
      }
    },
    methods: {
      initDivHeight() {
        let boxCardItemHeight = document.getElementById('graphContainer').offsetHeight;
        let orgDetailEleHeight = document.getElementById('orgDetailEle').offsetHeight;
        this.scrollbarHeight = boxCardItemHeight - orgDetailEleHeight - 25;
        if (this.isSystemAdmin) {
          let buttonLineHeight = document.getElementById('buttonLine').offsetHeight;
          this.scrollbarHeight = this.scrollbarHeight - buttonLineHeight;
        }
      }
    },
    mounted() {
      // this.initDivHeight();
      window.addEventListener('resize', this.initDivHeight);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    components: {
      importDialog
    }
  }
</script>
<style lang="stylus">
  .org-graph-container
    .graph-container
      overflow hidden
      cursor default
      height 100%
      width 100%
      background url('/static/images/orggraph/org_bg.png') repeat
    .org-level1-cell
      background-image url('/static/images/orggraph/org-level1-normal.png')
    .org-level1-cell:hover,.org-cell-current .org-level1-cell
      background-image url('/static/images/orggraph/org-level1-hover.png')
    .org-level2-cell
      background-image url('/static/images/orggraph/org-level2-normal.png')
    .org-level2-cell:hover,.org-cell-current .org-level2-cell
      background-image url('/static/images/orggraph/org-level2-hover.png')
    .org-level3-cell
      background-image url('/static/images/orggraph/org-level3-normal.png')
    .org-level3-cell:hover,.org-cell-current .org-level3-cell
      background-image url('/static/images/orggraph/org-level3-hover.png')
</style>
