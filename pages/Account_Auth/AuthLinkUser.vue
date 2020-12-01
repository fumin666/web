<template>
  <s-table-page
    :data="userList"
    :show-header-checkbox="false"
    :header-search="getHeaderSearch()"
    :row-actions="getRowActions()"
    ref="authLinkUser">
    <s-table-column v-if="!isOrder"
      type="selection">
    </s-table-column>
    <s-table-column width="100" center v-else>
      <template slot-scope="scope">
        <s-radio class="radioType" v-model="radio" :label="scope.$index" @change="getCurrentRow(scope.row)"></s-radio>
      </template>
    </s-table-column>
    <s-table-column
      label="真实姓名"
      prop="userRealName">
    </s-table-column>
    <s-table-column
      label="账号名称"
      prop="userLoginName">
    </s-table-column>
    <s-table-column
      label="所属机构"
      prop="departName">
    </s-table-column>
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: Object,
      isOrder: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        userList: [],
        isRadio: true,
        radio: false,
        selectedOperations: ''
      }
    },

    methods: {
      getCurrentRow(row) { // 获取单选框选中行的data
        this.selectedOperations = row.uuid
        console.log(row);
      },
      getHeaderSearch() {
        return {
          searchProps: ['userRealName', 'userLoginName', 'departName']
        }
      },
      getUser() {
        let vm = this;
        let url = '/authInfo/userInfoForAuth'
        if (vm.isOrder) {
          url = '/orderOperation/userInfoForAuth'
        }
        $axios.post(url, {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            vm.userList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.autoSelect();
              });
            }
          }
        });
      },

      getRowActions() {
        let vm = this;
        return [{
          icon: 'user',
          name: '人员详情',
          click(row) {
            vm.$emit('showUserDetails', row);
          }
        }, {
          icon: 'organ',
          name: '机构详情',
          click(row) {
            vm.$emit('showOrgDetails', row.departUuid);
          }
        }]
      },

      autoSelect() {
        let data = [];
        for (let i = 0; i < this.data.authHaveUserLists.length; i++) {
          for (let j = 0; j < this.userList.length; j++) {
            if (this.data.authHaveUserLists[i].userUuid === this.userList[j].uuid) {
              data.push(this.userList[j]);
              break;
            }
          }
        }
        this.$refs['authLinkUser'].setAllSelectedData(data);
      }
    },

    created() {
      this.getUser();
    }
  }
</script>

<style>
  .radioType .s-radio__label{
    display: none;
  }
</style>
