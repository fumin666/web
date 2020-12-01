<template>
  <div class="rule-cfg">
    <s-scrollbar wrap-style="max-height: 450px;">
      <s-table-page :data="allAuth"
                   ref="allAuth"
                   :show-header-checkbox="true"
                   @selection-change="handleSelectionChange"
                   :header-search="getSearchDef()">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="授权清单名称" prop="authName" show-overflow-tooltip>
        </s-table-column>
        <s-table-column label="清单类型" show-overflow-tooltip>
          <template slot-scope="scope">
            {{listType[scope.row.listType]}}
          </template>
        </s-table-column>
        <s-table-column label="密码会同" show-overflow-tooltip>
          <template slot-scope="scope">
            {{pwdCon[scope.row.pwdCon]}}
          </template>
        </s-table-column>
        <s-table-column label="描述" prop="authCont" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    components: {

    },
    props: {
      linkRow: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        type: ['禁止', '允许'],
        listType: ['授权清单', '申请清单'],
        pwdCon: ['关闭', '开启'],
        selectedAlarm: [],
        allAuth: []
      }
    },
    methods: {
      getAllAuth() {
        $axios.get('operationAuth/getNewOperationAuthList').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.allAuth = res.data;
            this.$nextTick(() => {
              this.autoSelect();
            });
          }
        });
      },
      getSearchDef() { // 列表搜索
        return {
          width: 8,
          searchProps: ['authName', 'authCont']
        }
      },
      handleSelectionChange(rows) {
        this.selectedAlarm = rows;
      },
      autoSelect() {
        let vm = this;
        if (vm.linkRow.authInfoList.length > 0) {
          vm.linkRow.authInfoList.forEach((row) => {
            for (let i = 0; i < vm.allAuth.length; i++) {
              if (row.authUuid === vm.allAuth[i].uuid) {
                vm.$refs.allAuth.toggleRowSelection(vm.allAuth[i], true);
                continue;
              }
            }
          });
        }
      }
    },
    created() {
      console.log(this.rule);
      this.getAllAuth();
    }
  }
</script>
