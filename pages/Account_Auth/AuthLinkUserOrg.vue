<template>
  <s-table-page
    :data="userOrgList"
    :show-header-checkbox="true"
    :header-search="getHeaderSearch()"
    :row-actions="getRowActions()"
    key="authLinkUserOrg"
    ref="authLinkUserOrg">
    <s-table-column
      type="selection">
    </s-table-column>
    <s-table-column
      label="机构编号"
      prop="departCode">
    </s-table-column>
    <s-table-column
      label="机构名"
      prop="departName">
    </s-table-column>
  </s-table-page>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: Object
    },

    data() {
      return {
        userOrgList: []
      }
    },

    created() {
      this.getList();
    },

    methods: {
      getHeaderSearch() {
        return {
          searchProps: ['departCode', 'departName']
        }
      },

      getRowActions() {
        let vm = this;
        return [{
          icon: 'organ',
          name: '机构详情',
          click(row) {
            vm.$emit('showOrgDetails', row.uuid);
          }
        }]
      },

      getList() {
        let vm = this;
        $axios.post('/departmentInfo/queryNormalDepartList').then((res) => {
          vm.userOrgList = res.data.departmentList;
          if (this.data) {
            this.$nextTick(() => {
              this.autoSelect();
            });
          }
        });
      },

      autoSelect() {
        let data = [];
        for (let i = 0; i < this.data.authHaveDepartLists.length; i++) {
          for (let j = 0; j < this.userOrgList.length; j++) {
            if (this.data.authHaveDepartLists[i].departUuid === this.userOrgList[j].uuid) {
              data.push(this.userOrgList[j]);
              break;
            }
          }
        }
        this.$refs['authLinkUserOrg'].setAllSelectedData(data);
      }
    }
  }
</script>
