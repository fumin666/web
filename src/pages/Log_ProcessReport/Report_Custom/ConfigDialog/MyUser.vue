<!--
 * @Author: mybells
 * @Version://清远自定义报表
 * @Description:报表中心-数据库审计-自定义报表->报表配置->添加编辑操作->人员信息引用
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->
<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <s-table-page
      :data="userList"
      :show-header-checkbox="true"
      :header-search="getHeaderSearch()"
      ref="myUserList">
      <s-table-column type="selection" width="55" :selectable="canSelect"></s-table-column>
      <s-table-column label="用户名" prop="userLoginName" show-overflow-tooltip></s-table-column>
      <s-table-column label="真实姓名" prop="userRealName" show-overflow-tooltip></s-table-column>
      <s-table-column label="Email" prop="userMail" show-overflow-tooltip></s-table-column>
      <s-table-column label="手机号" prop="userPhone">
        <template slot-scope="scope">
          <span>{{scope.row.userPhone | capitalize()}}</span>
        </template>
      </s-table-column>
      <s-table-column label="微信号" prop="userWechat" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.userWechat | capitalizeWechat()}}</span>
        </template>
      </s-table-column>
    </s-table-page>
  </s-scrollbar>
</template>

<script>
  export default {
    props: {
      type: {
        required: true,
        type: String
      },
      data: {
        required: true,
        type: Array
      },
      hasSelect: {
        type: Array,
        default: () => {
          return []
        }
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
      },
      capitalizeWechat: (value) => {
        if (!value) return ''
        if (value.length > 0) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      }
    },
    data() {
      return {
        userList: this.data
      }
    },

    methods: {
      canSelect(row, index) {
        if (this.type === 'listClient') return true;
        switch (this.type) {
          case 'listEmail':
            return !!row.userMail
          case 'listMessage':
            return !!row.userPhone
          case 'listWeChat':
            return !!row.userWechat
        }
      },

      getHeaderSearch() {
        return {
          searchProps: ['userLoginName', 'userRealName', 'userMail', 'userPhone', 'userWechat']
        }
      }
    },

    created() {
      if (this.hasSelect.length > 0) {
        this.$nextTick(() => {
          for (let i = 0; i < this.hasSelect.length; i++) {
            if (this.hasSelect[i].userUuid) {
              for (let j = 0; j < this.userList.length; j++) {
                if (this.hasSelect[i].userUuid === this.userList[j].userUuid) {
                  this.$refs.myUserList.toggleRowSelection(this.userList[j], true);
                  break;
                }
              }
            }
          }
        });
      }
    }
  }
</script>
