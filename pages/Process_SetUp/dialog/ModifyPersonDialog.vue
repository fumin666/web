<template>
  <s-form class="modifyPersonDialog" :model="form" ref="form" label-width="120px">
    <s-row>
      <s-col :span="17">
        <s-form-item prop="userId" label="员工ID:">
          <s-input v-model="form.userId" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userRealName" label="姓名:">
          <s-input v-model="form.userRealName" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userLoginName" label="账号名称:">
          <s-input v-model="form.userLoginName" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userGender" label="性别:">
          <s-radio-group v-model="form.userGender" disabled>
            <s-radio :label="0">保密</s-radio>
            <s-radio :label="1">男</s-radio>
            <s-radio :label="2">女</s-radio>
          </s-radio-group>
          <s-switch style="margin: 0 15px 6px 15px;" :active-value="1" :inactive-value="0" v-model="form.isVIP"></s-switch>
          <span>是否VIP</span>
        </s-form-item>
      </s-col>
      <s-col :offset="1" :span="6" style="padding: 5px 0">
        <img width="120px" height="150px" v-if="imageUrl" :src="imageUrl" class="avatar">
      </s-col>
    </s-row>
    <s-row>
      <s-col span="20">
        <s-form-item prop="position" label="岗位:">
          <s-input v-model="form.position"></s-input>
        </s-form-item>
        <s-form-item prop="departUuid" label="所属机构:">
          <s-input v-model="form.departName" style="width: 100%" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userStatus" label="状态:" >
          <s-input v-model="form.userStatus" style="width: 100%" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userCellphone" label="电话:">
          <s-input :value="form.userCellphone | capitalize()" disabled></s-input>
        </s-form-item>
        <s-form-item prop="userMail" label="邮箱:">
          <s-input v-model="form.userMail" disabled></s-input>
        </s-form-item>
        <s-form-item prop="itilRoleUuidList" label="角色:">
          <s-select v-model="form.itilRoleUuidList" multiple style="width: 100%">
            <s-option v-for="item in roleUuidList" :label="item.roleName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="" label="权限:">
          <s-table
            :data="tableDataA"
            style="width: 100%">
            <s-table-column
              prop="roleName"
              label="角色">
            </s-table-column>
            <s-table-column
              prop="power"
              label="权限">
            </s-table-column>
            <s-table-column type="expand">
              <template slot-scope="scope" style="padding: 0;">
                <s-table :data="scope.row.itilAuthorityList" :show-header="false" style="width: 57%;margin-left:43%;text-indent: 1px;">
                  <s-table-column prop="authorityName"></s-table-column>
                </s-table>
              </template>
            </s-table-column>
          </s-table>
        </s-form-item>
        <s-form-item prop="supportGroupUuidList" label="支持组:">
          <s-select v-model="form.supportGroupUuidList" multiple style="width: 100%">
            <s-option v-for="item in groupUuidList" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="isAllocate" label="指派可用性:">
          <s-select v-model="form.isAllocate" style="width: 100%">
            <s-option v-for="item in isAllocate" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-col>
    </s-row>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {intersectObj} from 'sunflower-common-utils'
  const photoUrl = 'static/images/system/UserPhoto.png'
  export default{
    data() {
      return {
        form: {
          userId: '',
          userRealName: '',
          userPhotopath: '',
          userLoginName: '',
          userGender: '',
          userStatus: '',
          userCellphone: '',
          userMail: '',
          position: '',
          departUuid: '',
          uuid: '',
          departName: '',
          itilRoleUuidList: [],
          supportGroupUuidList: [],
          isAllocate: '',
          appendMap: {}
        },
        imageUrl: photoUrl,
        upLoadUrl: '',
        roleUuidList: [],
        groupUuidList: [],
        userStatus: [
          {
            value: '未激活',
            uuid: 0
          },
          {
            value: '激活',
            uuid: 1
          },
          {
            value: '锁定',
            uuid: 2
          },
          {
            value: '注销',
            uuid: 3
          },
          {
            value: '删除',
            uuid: 4
          },
          {
            value: '待开启',
            uuid: 5
          },
          {
            value: '过期',
            uuid: 6
          },
          {
            value: '离职',
            uuid: 7
          }
        ],
        isAllocate: [
          {
            value: '是',
            uuid: 1
          },
          {
            value: '否',
            uuid: 0
          }
        ],
        tableDataA: []
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    filters: {
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.form.userPhotopath = res.userPhotopath;
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      getItilRoleList() {
        $axios.post('itilWorkflowConfig/getItilRoleList').then((res) => {
          this.roleUuidList = res.data;
        })
      },
      getSupportGroupList() {
        $axios.post('itilWorkflowConfig/getItilSupportGroupList').then((res) => {
          this.groupUuidList = res.data;
        })
      }
    },
    mounted() {
      this.upLoadUrl = $axios.basePath() + '/fileUpload/uploadUserPhoto';
      this.getItilRoleList();
      this.getSupportGroupList();
      this.form = intersectObj(this.form, this.editData);
      this.tableDataA = this.form.appendMap.itilRoleList;
      for (let i in this.tableDataA) {
        this.tableDataA[i].power = this.tableDataA[i].itilAuthorityList[0].authorityName;
      }
      this.imageUrl = this.form.userPhotopath || photoUrl;
    },
    watch: {
      'form.userStatus': {
        deep: true,
        handler: function (val) {
          if (val !== '') {
            switch (val) {
              case 0:
                this.form.userStatus = '未激活';
                break;
              case 1:
                this.form.userStatus = '激活';
                break;
              case 2:
                this.form.userStatus = '锁定';
                break;
              case 3:
                this.form.userStatus = '注销';
                break;
              case 4:
                this.form.userStatus = '删除';
                break;
              case 5:
                this.form.userStatus = '待开启';
                break;
              case 6:
                this.form.userStatus = '过期';
                break;
              case 7:
                this.form.userStatus = '离职';
                break;
            }
          }
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .modifyPersonDialog .s-table-expanded-cell
    padding 0
</style>
