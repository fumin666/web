<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 18:52:12
 * @LastEditTime: 2019-09-25 17:52:58
 * @LastEditors: Please set LastEditors
 -->
<!--人员数据-->
<template>
  <div>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="70px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="姓名:" prop="userRealName">
          <s-input @keyup.enter.native="search" v-model="searchForm.userRealName" style="width: 180px;"></s-input>
        </s-form-item>
        <s-form-item label="所属机构:" prop="departName">
          <s-input @keyup.enter.native="search" v-model="searchForm.departName" style="width: 180px;"></s-input>
        </s-form-item>
        <s-form-item label="性别:" prop="userGender">
          <s-select v-model="searchForm.userGender" clearable style="width: 180px;">
            <s-option v-for="i in userGenderArr" :key="i.uuid" :value="i.uuid" :label="i.value"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-table-page
      ref="multipleTable"
      :data="tableData"
      :max-height=550
      style="width:100%"
      @selection-change="handleSelectionChange"
    >
      <s-table-column prop="userRealName" label="姓名"></s-table-column>
      <s-table-column prop="userGender" label="性别" >
        <template slot-scope="scope">
          {{scope.row.userGender | filterUserGender}}
        </template>
      </s-table-column>
      <s-table-column prop="isVIP" label="是否VIP" >
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isVIP" size="small" :active-value="1" :inactive-value="0" @change="changeVipState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column prop="userCellphone" label="电话" >
        <template slot-scope="scope">
          <span>{{scope.row.userCellphone | capitalize()}}</span>
        </template>
      </s-table-column>
      <s-table-column prop="userLoginName" label="账号名称" ></s-table-column>
      <s-table-column prop="departName" label="所属机构" ></s-table-column>
      <s-table-column prop="position" label="岗位" ></s-table-column>
      <s-table-column prop="userMail" label="邮箱" ></s-table-column>
      <s-table-column prop="userStatus" label="状态" >
        <template slot-scope="scope">
          {{scope.row.userStatus | filterUserStatus}}
        </template>
      </s-table-column>
      <s-table-column prop="isAllocate" label="可指派性">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isAllocate" size="small" :active-value="1" :inactive-value="0" :disabled="scope.row.userStatus !== 1 && scope.row.userStatus !== 5" @change="changeState(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="200">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="修改" @click="modifyPerson(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <!--修改人员数据弹窗-->
    <s-dialog
      v-model="modifyingPersonnel"
      v-if="modifyingPersonnel"
      width="700px"
      title="修改"
      append-to-body>
      <s-scrollbar wrap-style="height: 550px;">
        <modify-person-dialog :editData="modifyingPersonnelData" ref="modifyPersonDialog"></modify-person-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveModify">保存</s-button>
        <s-button type="cancel" @click="cancelModify">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import modifyPersonDialog from '../dialog/ModifyPersonDialog.vue';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import {multiSearch} from 'sunflower-common-utils'
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      return {
        dataList: [],
        tableData: [],
        modifyingPersonnel: false,
        modifyingPersonnelData: {},
        selections: [],
        searchForm: {
          userRealName: '',
          departName: '',
          userGender: ''
        },
        userGenderArr: [
          {
            uuid: 0,
            value: '保密'
          },
          {
            uuid: 1,
            value: '男'
          },
          {
            uuid: 2,
            value: '女'
          }
        ],
        flag: false
      }
    },
    components: {
      // SearchBox,
      modifyPersonDialog
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      modifyPerson(row) {
        this.modifyingPersonnelData = row;
        this.modifyingPersonnel = true;
      },
      saveModify() {
        let form = this.$refs['modifyPersonDialog'].form;
        let param = {};
        param.position = form.position;
        param.itilRoleUuidList = form.itilRoleUuidList;
        param.supportGroupUuidList = form.supportGroupUuidList;
        param.isAllocate = form.isAllocate;
        param.uuid = form.uuid;
        param.isVIP = form.isVIP;
        param.userRealName = form.userRealName;
        $axios.post('/itilWorkflowCenter/userItilRoleChangeCheck/', {
          uuid: param.uuid,
          itilRoleUuidList: param.itilRoleUuidList
        }).then((res) => {
          if (res.data.state) {
            $axios.post('/iamUserInfo/updateUserInfo', param, {
              data: [this.searchForm],
              logTemplate: '编辑|人员数据>人员(#userRealName#)'
            }).then((res) => {
              if (res.status === 200) {
                this.$message({message: '修改成功', type: 'success'});
                this.getData();
                this.modifyingPersonnel = false;
              } else {
                this.$message({message: '修改失败', type: 'error'});
              }
            })
          } else {
            this.$message.error(res.data.errormsg);
          }
        })
      },
      cancelModify() {
        this.modifyingPersonnel = false;
      },
      getData() {
        $axios.post('/iamUserInfo/getIamUserInfoListForItil').then((res) => {
          if (res.status === 200) {
            this.dataList = res.data;
            this.tableData = cloneDeep(res.data);
          }
        })
      },
      changeState(row) {
        $axios.get('iamUserInfo/updateUserAllocate/' + row.uuid + '/' + row.isAllocate).then((res) => {
          if (res.data === true) {
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '更新失败',
              type: 'error'
            });
          }
        });
      },
      changeVipState(row) {
        let param = {
          uuid: row.uuid,
          isVIP: row.isVIP
        }
        $axios.post('/iamUserInfo/updateIsVipStatus', param).then((res) => {
          if (res.data.state === true) {
            this.$message({
              message: res.data.errormsg,
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data.errormsg,
              type: 'error'
            });
          }
        });
      },
      search() {
        let form = Object.assign({}, {}, this.searchForm);
        this.tableData = multiSearch(form, this.dataList);
        this.flag = false
      },
      hideHandler() {
        this.flag = !this.flag
      }
    },
    created() {
      this.getData();
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      filterUserGender(val) {
        switch (val) {
          case 0:
            return '保密';
          case 1:
            return '男';
          case 2:
            return '女';
        }
      },
      filterUserStatus(val) {
        switch (val) {
          case 0:
            return '未激活';
          case 1:
            return '激活';
          case 2:
            return '锁定';
          case 3:
            return '注销';
          case 4:
            return '删除';
          case 5:
            return '待开启';
          case 6:
            return '过期';
          case 7:
            return '离职';
        }
      }
    }
  }
</script>
