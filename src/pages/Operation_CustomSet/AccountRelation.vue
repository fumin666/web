<template>
  <section id="account-relation">
    <s-row class="oper-suppage-title">
      <i class="iconfont icon-tag"></i>
      账号关联列表
      <s-button @click="addCommand" size="mini">添加关联</s-button>
    </s-row>
    <s-row>
      <s-table class="commandTab" :data="accountList">
        <s-table-column label="资产" prop="itcompUuid">
          <template slot-scope="scope">
            <s-select :key="scope.row.idx" v-model="scope.row.itcompUuid" @change="getAccount(scope.$index)">
              <s-option v-for="item in AssDevice" :key="item.id" :label="`${item.itcompName}（${item.controlAdderss}）`" :value="item.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column :label="accountName" prop="accountUuid">
          <template slot-scope="scope">
            <s-select :key="scope.row.idx" v-model="scope.row.accountUuid">
              <s-option v-for="item in (scope.row.AccountInfo)" :key="item.id" :label="item.accountName" :value="item.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="协助账号" prop="assistAccountUuid">
          <template slot-scope="scope">
            <s-select :key="scope.row.idx" v-model="scope.row.assistAccountUuid">
              <s-option v-for="item in (scope.row.AccountInfo)" :key="item.id" :label="item.accountName" :value="item.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="备用账号" prop="reserveAccountUuid">
          <template slot-scope="scope">
            <s-select :key="scope.row.idx" v-model="scope.row.reserveAccountUuid">
              <s-option v-for="item in (scope.row.AccountInfo)" :key="item.id" :label="item.accountName" :value="item.uuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="操作" width="80">
          <template slot-scope="scope">
            <i class="iconfont icon-delete" @click="delCommand(scope.$index)"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  export default {
    data() {
      return {
        accountList: [],
        AssDevice: [],
        index: 1,
        accountName: (this.checkType === 3) ? '校验账号' : (this.checkType === 2) ? '改密账号' : '运维账号'
      }
    },
    props: {
      editData: {
        type: Array
      },
      uuid: {
        type: String
      },
      checkType: {
        type: Number
      }
    },
    created() {
      let vm = this
      if (vm.editData !== undefined) {
        vm.accountList = vm.editData.map(function (v, i) {
          let temp = {
            idx: i + 1,
            itcompUuid: v.itcompUuid,
            accountUuid: v.accountUuid,
            assistAccountUuid: v.assistAccountUuid,
            reserveAccountUuid: v.reserveAccountUuid,
            AccountInfo: v.deviceAllAccountInfos
          }
          return temp
        })
      }
    },
    mounted() {
      this.getAccountAssDevice()
    },
    methods: {
      delCommand(row) {
        this.accountList.splice(row, 1)
      },
      addCommand() {
        let newCommand = {
          idx: this.index,
          itcompUuid: '',
          accountUuid: '',
          assistAccountUuid: '',
          reserveAccountUuid: '',
          AccountInfo: []
        }
        this.accountList.push(newCommand)
        this.index++
      },
      getAccountAssDevice() {
        let uuid = this.$parent.scriptUuid || this.uuid
        $axios.get(`/operationSettings/getAccountAssDevice/${uuid}`).then((res) => {
          this.AssDevice = res.data
        })
      },
      getAccount(val) {
        let uuid = this.accountList[val].itcompUuid || '';
        this.accountList[val].accountUuid = ''
        this.accountList[val].assistAccountUuid = ''
        this.accountList[val].reserveAccountUuid = ''
        if (uuid === '') {
          return false
        }
        $axios.get(`/operationSettings/getUserdefineDeviceAccount/${uuid}`).then((res) => {
          this.accountList[val].AccountInfo = res.data
        })
      }
    }
  }
</script>
