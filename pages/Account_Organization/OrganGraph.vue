/**
* Created by alex on 2018/10/23.
*/
<template>
  <div>
    <s-form :model="departmentinfo" :inline="true" ref="departmentinfo" class="search_form" label-width='90px' style="margin:10px 0">
      <div>
        <s-form-item label="机构名称：" prop="departName">
          <s-input v-model="departmentinfo.departName" @keyup.enter.native="searchByEnter"></s-input>
        </s-form-item>
        <s-form-item label="上级机构：" prop="departParentName">
          <s-select v-model="departmentinfo.departParentName" filterable placeholder="请选择" clearable>
            <s-option v-for="item in departParentsOption" :label="item.departName" :value="item.departName" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="机构负责人：" prop="departLeaderName">
          <s-input v-model="departmentinfo.departLeaderName" @keyup.enter.native="searchByEnter"></s-input>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" @click="searchByEnter()">查询</s-button>
      </div>
    </s-form>
    <div class="organ-btn-group">
      <s-button icon="import" @click="orgImport" v-noBtn="'accountManage_importOrganization'">导入</s-button>
      <s-button icon="export" @click="orgExport" v-noBtn="'accountManage_exportOrganization'">导出</s-button>
      <div class="radio-box fr">
        <s-button-group>
          <s-button icon="structure" class="group-button" :class="{hoverbutton:isActive}" @click="showModel('graph')" title="图形模式"></s-button>
          <s-button icon="list" class="group-button" :class="{hoverbutton:!isActive}" @click="showModel('list')" title="列表模式"></s-button>
        </s-button-group>
      </div>
    </div>
    <s-row type="flex" style="position: relative;" :gutter="20">
      <s-col class="graph-wrap" :span="20" :style="{height: graphwrapHeight + 'px'}">
        <div v-clickoutside="closeFloatBox" class="graph-container" id="graphContainer">
        </div>
      </s-col>
      <s-fishbone style="top:10px;left:50px;" ref="fishbone" :graph="graph"></s-fishbone>
      <s-col :span="4" style=" padding: 0;border-radius: 4px;box-shadow: 0px 1px 6px rgba(0,0,0,0.2)">
        <div class="org_info">
          <s-row class="main-content" type="flex" style="margin-top:0;">
            <s-col :span="9">
              <div class="org_icon"><i class="icon iconfont icon-institute"></i></div>
            </s-col>
            <s-col :span="15" class="org-name-box">
              <div class="org_name" :title="orgInfo.departName">{{ orgInfo.departName || '-'}}</div>
              <div class="org_info_item" :title="orgInfo.chargePerson">负责人：{{ orgInfo.chargePerson  || '-'}}</div>
              <div class="org_info_item">管理机构数：{{ orgInfo.orgCounter  || '-'}}</div>
              <div class="org_info_item">管理人员数：{{ orgInfo.accountCounter  || '-'}}</div>
            </s-col>
          </s-row>
        </div>
        <s-table :data="userAry" :height="graphTableHeight" class="user-table">
          <s-table-column prop="userLoginName" label="账号名称" style="width:40px"></s-table-column>
          <s-table-column prop="userRealName" label="真实姓名" style="width:50%"></s-table-column>
        </s-table>
      </s-col>
    </s-row>
    <!--新增组织机构-->
    <dialog-org-add v-model="showOrgAdd" v-if="showOrgAdd" ref="addorg"></dialog-org-add>
    <!--编辑组织机构-->
    <dialog-org-add v-model="showOrgEdit" v-if="showOrgEdit" title="编辑组织机构"></dialog-org-add>
    <!--添加人员-->
    <staff-add-dialog v-model="staffAddDialog" v-if="staffAddDialog" :staff="{}" :curUuid="tempCell.uuid"></staff-add-dialog>
    <import-dialog v-if="importOrgDialog" v-model="importOrgDialog" :upload-obj="uploadObj" :down-obj="downObj" @reload="updateChild" :fileTypes="['xls', 'xlsx']">
    </import-dialog>
  </div>
</template>

<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox'
  import mixin from '@/components/graph/OrgGraphMixin'
  import $axios from 'sunflower-ajax'
  import Clickoutside from '@/components/inputTree/clickoutside';
  import importDialog from '@/components/importDialog/ImportDialog';

  export default {
    mixins: [mixin],
    data() {
      return {
        departParentsOption: [], // 上级机构的集合
        graphwrapHeight: 1000,
        graphTableHeight: 450,
        uploadUrl: `${$axios.basePath()}departmentInfo/importDepartInfo`
      };
    },
    directives: {
      Clickoutside
    },
    components: {
      // SearchBox,
      importDialog
    },
    created() {
      console.log(this.departmentinfo);
      this.$nextTick(() => {
        var _self = this;
        this.initDivHeight();
        window.resizeHandler = function () {
          _self.initDivHeight();
        };
        window.addEventListener('resize', window.resizeHandler);
      })
      this.getDepartParentsData()
    },
    destroyed() {
      window.removeEventListener('resize', window.resizeHandler);
    },
    methods: {
      getDepartParentsData() {
        $axios.get('/departmentInfo/getAllDepart').then((res) => {
          if (res.data) {
            this.departParentsOption = res.data
          }
        })
      },
      initDivHeight() {
        var footerHeight = document.querySelector('.s-footer').offsetHeight;
        var headerHeight = document.querySelector('.header-bg').offsetHeight;
        var infoHeight = document.querySelector('.org_info').offsetHeight;
        var tabHeaderHeight = document.querySelector('.s-tabs-header').offsetHeight;
        this.graphwrapHeight = window.innerHeight - footerHeight - headerHeight - tabHeaderHeight - 103;
        this.graphTableHeight = this.graphwrapHeight - infoHeight - 2 - 20;
      },
      getSearchActionDef() {
        var _self = this;
        return function () {
          var treeNode = null;
          var keyAry = [];
          var flag = false;
          for (var key in _self.allNodes) {
            treeNode = _self.allNodes[key];
            flag = false;
            // 三个查询都有数据
            if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departParentName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
              // 123
              let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
              let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
              let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
              if (one && two && three) {
                flag = true
              }
            } else if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departParentName !== '') {
              // 12
              let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
              let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
              if (one && two) {
                flag = true
              }
            } else if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
              // 13
              let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
              let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
              if (one && three) {
                flag = true
              }
            } else if (_self.departmentinfo.departParentName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
              // 23
              let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
              let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
              if (two && three) {
                flag = true
              }
            } else if (_self.departmentinfo.departName !== '') {
              // 1
              let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
              if (one) {
                flag = true
              }
            } else if (_self.departmentinfo.departParentName !== '') {
              // 2
              let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
              if (two) {
                flag = true
              }
            } else if (_self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
              // 3
              let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
              if (three) {
                flag = true
              }
            }
            if (flag) {
              keyAry.push(key);
            }
          }
          if (keyAry.length === 0) {
            _self.clickAction({
              uuid: _self.treeNodeList[0].uuid
            });
            _self.$message('没有查到任何记录');
          } else {
            _self.clickAction({
              uuid: keyAry[0]
            });
            for (var i = 0, length = keyAry.length; i < length; i++) {
              var cellDiv = document.getElementById(keyAry[i] + '-cell-val');
              cellDiv.className = cellDiv.className + ' org-cell-current';
            }
            _self.$message('找到' + keyAry.length + '条记录，面板中展示了第1条记录的详情');
          }
        }
      },
      searchByEnter() {
        var _self = this;
        var treeNode = null;
        var keyAry = [];
        var flag = false;
        for (var key in _self.allNodes) {
          treeNode = _self.allNodes[key];
          flag = false;
          // 三个查询都有数据
          if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departParentName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
            // 123
            let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
            let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
            let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
            if (one && two && three) {
              flag = true
            }
          } else if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departParentName !== '') {
            // 12
            let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
            let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
            if (one && two) {
              flag = true
            }
          } else if (_self.departmentinfo.departName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
            // 13
            let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
            let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
            if (one && three) {
              flag = true
            }
          } else if (_self.departmentinfo.departParentName !== '' && _self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
            // 23
            let two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
            let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
            if (two && three) {
              flag = true
            }
          } else if (_self.departmentinfo.departName !== '') {
            // 1
            let one = treeNode.departName.indexOf(_self.departmentinfo.departName) > -1 ? 1 : 0;
            if (one) {
              flag = true
            }
          } else if (_self.departmentinfo.departParentName !== '') {
            // 2
            let two = null
            if (treeNode.departParentName) {
              two = treeNode.departParentName.indexOf(_self.departmentinfo.departParentName) > -1 ? 1 : 0;
            }
            if (two) {
              flag = true
            }
          } else if (_self.departmentinfo.departLeaderName !== '' && treeNode.departLeaderName !== null) {
            // 3
            let three = treeNode.departLeaderName.indexOf(_self.departmentinfo.departLeaderName) > -1 ? 1 : 0;
            if (three) {
              flag = true
            }
          }
          if (flag) {
            keyAry.push(key);
          }
        }
        if (keyAry.length === 0) {
          _self.clickAction({
            uuid: _self.treeNodeList[0].uuid
          });
          _self.$message('没有查到任何记录');
        } else {
          _self.clickAction({
            uuid: keyAry[0]
          });
          for (var i = 0, length = keyAry.length; i < length; i++) {
            var cellDiv = document.getElementById(keyAry[i] + '-cell-val');
            cellDiv.className = cellDiv.className + ' org-cell-current';
          }
          _self.$message('找到' + keyAry.length + '条记录，面板中展示了第1条记录的详情');
        }
      }
    }
  }
</script>
<style>
  .organ-btn-group{
    margin-bottom: 10px;
  }
  .organ-btn-group .s-button-group .s-button:not(:last-child){
    margin-right: 0;
  }
  .org-graph-container .org_info .org-name-box{
    line-height: 25px;
  }
</style>
