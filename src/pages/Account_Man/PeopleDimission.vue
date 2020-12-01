<template>
<s-row type="flex" :gutter="20" style="height: calc(100vh - 250px);">
  <s-col :span="4" class="left-border people-manage-box">
    <section class="left-nav tree-box">
      <div class="tree-title">
        <i class="iconfont icon-organ"></i>
        <span>组织机构</span>
      </div>
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 285px);" key="it" ref="treeScrollbar">
        <s-tree style="margin-left: 10px; padding-top: 10px; background-color: transparent "
                :data="treeData"
                ref="stree"
                :props="defaultProps"
                node-key="uuid"
                default-expand-all
                @node-click="handleNodeClick"
                :expand-on-click-node="false"
                :current-node-key="curNodeUuid"
                :highlight-current="true">
        </s-tree>
      </s-scrollbar>
    </section>
  </s-col>
  <s-col class="right-table" :span="20">
    <s-scrollbar wrap-class="tab-scroll-height">
      <section class="fileList" style="margin-bottom: 20px">
        <s-row>
          <s-col :span="24">
            <s-form :inline="true" class="search_form" style="margin:10px 0" label-width='90px'>
              <div>
                <s-form-item label='真实姓名：'>
                  <s-input v-model="searchForm.userRealName"></s-input>
                </s-form-item>
                <s-form-item label='所属机构：'>
                  <s-input v-model="searchForm.departName"></s-input>
                </s-form-item>
                <s-form-item label='岗位：'>
                  <s-input v-model="searchForm.position"></s-input>
                </s-form-item>
                <s-form-item label='工作移交人：'>
                  <s-input v-model="searchForm.handoverUserName"></s-input>
                </s-form-item>

                <s-form-item label="离职日期：">
                  <s-date-picker :picker-options="disableAfterToday1" v-model="searchForm.leaveStartTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="选择起始日期" :editable="false">
                  </s-date-picker>
                  ~
                  <s-date-picker :picker-options="disableAfterToday2" v-model="searchForm.leaveEndTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" placeholder="选择结束日期" :editable="false">
                  </s-date-picker>
                </s-form-item>
                <s-form-item label="入职日期：">
                  <s-date-picker :picker-options="disableAfterToday3" v-model="searchForm.entryStartTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 00:00:00" placeholder="选择起始日期" :editable="false">
                  </s-date-picker>
                  ~
                  <s-date-picker :picker-options="disableAfterToday4" v-model="searchForm.entryEndTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd 23:59:59" placeholder="选择结束日期" :editable="false">
                  </s-date-picker>
                </s-form-item>
              </div>
              <div class="search_btn">
                <s-button title="查询" icon='magnifier' @click="search">查询</s-button>
              </div>
            </s-form>
            <RealPageTable :ajax-obj="ajaxObj" :keyid="curNodeUuid">
              <s-table-column prop="userRealName" label="真实姓名">
              </s-table-column>
              <s-table-column prop="departName" label="所属机构">
              </s-table-column>
              <s-table-column prop="position" label="岗位">
              </s-table-column>
              <s-table-column prop="userMail" label="Email">
              </s-table-column>
              <s-table-column prop="leaveTime" label="离职日期">
                <template slot-scope="scope">
                  <span>{{scope.row.leaveTime?format(scope.row.leaveTime):''}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="entryTime" label="入职日期">
                <template slot-scope="scope">
                  <span>{{scope.row.entryTime?format(scope.row.entryTime):''}}</span>
                </template>
              </s-table-column>
              <s-table-column prop="handoverUserName" label="工作移交人">
              </s-table-column>
              <s-table-column label="操作" width="270">
                <template slot-scope="scope">
                  <i class="iconfont icon-eye" @click="rowView(scope.row)" title="查看"></i>
                  <i class="iconfont icon-account-isolate" @click="rowRetirement(scope.row)" title="返聘" v-if="isSystemAdmin"></i>
                </template>
              </s-table-column>
            </RealPageTable>
          </s-col>
        </s-row>
      </section>
    </s-scrollbar>
  </s-col>
  <!--查看-->
  <s-dialog v-model="viewDialog" v-if="viewDialog" width="700px" title="查看">
    <view-dialog :viewObj="viewObj"></view-dialog>
  </s-dialog>
  <!--返聘-->
  <s-dialog v-model="retirementDialog" v-if="retirementDialog" width="700px" title="返聘">
    <retirementDialog :editObj="viewObj" ref="editDia" :showAccount="showAccount"></retirementDialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveRetirement">确定</s-button>
      <s-button type="cancel" @click="retirementDialog=false">取消</s-button>
    </template>
  </s-dialog>
</s-row>
</template>

<script>
// import Bus from '@/plugins/eventBus';
import $axios from 'sunflower-ajax';
import viewDialog from './StaffViewDialog'
import retirementDialog from './StaffEditDialog'
// import retirementDialog from './StaffRetirementDialog'
import roleCheckMixin from '@/common/mixins/roleCheckMixin'
import {cloneDeep} from 'lodash'
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
export default {
  mixins: [roleCheckMixin],
  data() {
    return {
      showAccount: false, // 是否显示账号信息
      retirementDialog: false,
      viewDialog: false,
      treeData: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name',
        id: 'uuid'
      },
      curNodeUuid: '',
      staffList: [],
      // staffData: [],
      searchForm: {
        position: '',
        // userGender: 0,
        departUuid: '',
        departName: '',
        leaveStartTime: '',
        leaveEndTime: '',
        entryStartTime: '',
        entryEndTime: '',
        handoverUserName: '',
        userRealName: ''
      },
      ajaxObj: {
      type: 'post',
        url: '/iamUserInfo/getAllLeaveOfficeUserByCriteria',
        params: {
          condition: {
            position: '',
            departUuid: '',
            departName: '',
            leaveStartTime: null,
            leaveEndTime: null,
            entryStartTime: null,
            entryEndTime: null,
            handoverUserName: '',
            userRealName: ''
          }
      }
    }
    }
  },
  computed: {
    disableAfterToday1() {
      let outEndTime = this.searchForm.outEndTime;
      let val = outEndTime ? (new Date(outEndTime).getTime()) : 0;
      return {
        disabledDate(time) {
          if (val) {
            return time.getTime() > val;
          } else {
            return false;
          }
        }
      }
    },
    disableAfterToday2() {
      let outStartTime = this.searchForm.outStartTime;
      let val = outStartTime ? new Date(outStartTime).getTime() : 0;
      return {
        disabledDate(time) {
          if (val) {
            return time.getTime() < val;
          } else {
            return false;
          }
        }
      }
    },
    disableAfterToday3() {
      let inEndTime = this.searchForm.inEndTime;
      let val = inEndTime ? new Date(inEndTime).getTime() : 0;
      return {
        disabledDate(time) {
          if (val) {
            return time.getTime() > val;
          } else {
            return false;
          }
        }
      }
    },
    disableAfterToday4() {
      let inStartTime = this.searchForm.inStartTime;
      let val = inStartTime ? new Date(inStartTime).getTime() : 0;
      return {
        disabledDate(time) {
          if (val) {
            return time.getTime() < val;
          } else {
            return false;
          }
        }
      }
    }
  },
  created() {
    this.nowUserUuid = this.$store.getters.userData.uuid
    // $axios.get('/iamUserInfo/getAllStatusUserList').then(res => {
    //   this.staffData = res.data;
    // })
    this.axiosTree(() => {
      this.axiosList();
    });
  },
  methods: {
    format(value) {
      var date = new Date(value * 1000);
      let dateStr = date.getFullYear() + '-' +
        (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + // 月份从0～11
        date.getDate();
      return dateStr;
    },
    search() {
      this.axiosList();
    },
    handleNodeClick(nodeData) {
      this.curNodeUuid = nodeData.uuid;
      this.axiosList();
    },
    axiosList() {
      let params = {
        departUuid: this.curNodeUuid,
        position: this.searchForm.position,
        userGender: typeof this.searchForm.userGender === 'number' ? this.searchForm.userGender : null,
        departName: this.searchForm.departName,
        handoverUserName: this.searchForm.handoverUserName,
        leaveStartTime: this.searchForm.leaveStartTime ? (new Date(this.searchForm.leaveStartTime).getTime() / 1000) : null,
        leaveEndTime: this.searchForm.leaveEndTime ? (new Date(this.searchForm.leaveEndTime).getTime() / 1000) : null,
        entryStartTime: this.searchForm.entryStartTime ? (new Date(this.searchForm.entryStartTime).getTime() / 1000) : null,
        entryEndTime: this.searchForm.entryEndTime ? (new Date(this.searchForm.entryEndTime).getTime() / 1000) : null,
        userRealName: this.searchForm.userRealName
      }
      this.ajaxObj.params.condition = cloneDeep(params);
    },
    axiosTree(callback = () => {}) {
      $axios.get('/departmentInfo/getAllDepartmentInfoForTree').then(({
        data
      }) => {
        this.treeData = data.treeNodeList;
        this.curNodeUuid = data.treeNodeList[0].uuid;
        this.$nextTick(function () {
          this.$refs.stree.setCurrentKey(data.treeNodeList[0].uuid)
        });
        callback();
      });
    },
    // 行内操作----------------------------------
    rowRetirement(row) {
      let param = {
        userUuid: row.uuid,
        status: 7
      }
      $axios.post(`/iamUserInfo/getUserInfoDetailByUuid`, param).then((res) => {
        this.viewObj = res.data
        this.showAccount = false
        this.retirementDialog = true
      })
    },
    rowView(row) {
      let param = {
        userUuid: row.uuid,
        status: 7
      }
      $axios.post(`/iamUserInfo/getUserInfoDetailByUuid`, param).then((res) => {
        this.viewObj = res.data
        this.viewDialog = true
      })
    },
    saveRetirement() {
      let vm = this;
      let form = vm.$refs['editDia']
      let param = cloneDeep(form.staffForm)
      if (param.entryTime !== null) {
        param.entryTime = Date.parse(new Date(param.entryTime)) / 1000;
      }
      if (form.$refs['staffForm1'] && !form.$refs['staffForm2'] && !form.$refs['staffForm3']) {
        form.$refs['staffForm1'].validate(valid1 => {
          if (!valid1) {
            form.activeName = '1';
            vm.$message({message: '请正确填写信息!', type: 'warning'});
            return;
          }
          this.saveEditUrl(param)
        })
      } else if (form.$refs['staffForm1'] && !form.$refs['staffForm2'] && form.$refs['staffForm3']) {
        form.$refs['staffForm1'].validate(valid1 => {
          if (!valid1) {
            form.activeName = '1';
            vm.$message({message: '请正确填写信息!', type: 'warning'});
            return;
          } else {
            form.$refs['staffForm3'].validate(valid3 => {
              if (!valid3) {
                form.activeName = '3';
                vm.$message({message: '请正确填写信息!', type: 'warning'});
                return;
              }
              this.saveEditUrl(param)
            })
          }
        })
      } else if (form.$refs['staffForm1'] && form.$refs['staffForm2'] && !form.$refs['staffForm3']) {
        form.$refs['staffForm1'].validate(valid1 => {
          if (!valid1) {
            form.activeName = '1';
            vm.$message({message: '请正确填写信息!', type: 'warning'});
            return;
          } else {
            form.$refs['staffForm2'].validate(valid2 => {
              if (!valid2) {
                form.activeName = '2';
                vm.$message({message: '请正确填写信息!', type: 'warning'});
                return;
              }
              this.saveEditUrl(param)
            })
          }
        })
      } else {
        form.$refs['staffForm1'].validate(valid1 => {
          if (!valid1) {
            form.activeName = '1';
            vm.$message({message: '请正确填写信息!', type: 'warning'});
            return;
          } else {
            form.$refs['staffForm2'].validate(valid2 => {
              if (!valid2) {
                form.activeName = '2';
                vm.$message({message: '请正确填写信息!', type: 'warning'});
                return;
              } else {
                form.$refs['staffForm3'].validate(valid3 => {
                  if (!valid3) {
                    form.activeName = '3';
                    vm.$message({message: '请正确填写信息!', type: 'warning'});
                    return;
                  } else {
                    this.saveEditUrl(param)
                  }
                })
              }
            })
          }
        })
      }
    },
    saveEditUrl(param) {
      $axios.post(`/iamUserInfo/leaveToRehelloring`, param, {
        data: [{
          name: this.viewObj.userRealName
        }],
        logTemplate: '返聘|人员管理>人员(#name#)'
      }).then(({data}) => {
        if (data.state === true) {
          this.$message({
            message: '返聘成功!',
            type: 'success'
          });
          this.axiosList()
          this.retirementDialog = false;
        } else {
          this.$message({
            message: data.errormsg,
            type: 'error'
          });
        }
      });
    }
  },
  components: {
    RealPageTable,
    viewDialog,
    retirementDialog
  }
}
</script>
<style lang="stylus">
  .tab-scroll-height
    max-height: calc(100vh - 200px)
    padding-right 15px
</style>
