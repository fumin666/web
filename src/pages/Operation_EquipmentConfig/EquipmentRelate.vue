<template>
  <section id="account-relation">
    <s-row>
      <s-table-page ref="table" :data="equipmentList" @selection-change="handleSelectionChange"  :pagination-show='false' :has-action-col='false' :header-search='getNewSearchDef()'>
        <s-table-column
          type="selection"
          width="45">
        </s-table-column>
        <s-table-column label="资产名称" prop="itcompName">
        </s-table-column>
        <s-table-column label="IP地址" prop="ipaddr">
        </s-table-column>
        <s-table-column label="协议端口">
          <template slot-scope="scope">
            <s-select :key="scope.row.deviceUuid" v-model="scope.row.portUuid">
              <s-option v-for="item in scope.row.portProtocolList" :key="item.id" :label="`${item.protocolName}.${item.port}`" :value="item.portUuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="登录账号">
          <template slot-scope="scope">
            <s-select :key="scope.row.deviceUuid" v-model="scope.row.accountUuid">
              <s-option v-for="item in scope.row.accountList" :key="item.id" :label="item.accountName" :value="item.accountUuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="授权账号">
          <template slot-scope="scope">
            <s-select :key="scope.row.deviceUuid" v-model="scope.row.authAccountUuid">
              <s-option v-for="item in scope.row.superAccountList" :key="item.id" :label="item.accountName" :value="item.accountUuid"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="备份任务" prop="oldTaskName">
        </s-table-column>
      </s-table-page>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        equipmentList: [],
        selection: []
      }
    },

    props: {
      editData: {
        type: Array
      },
      uuid: {
        type: String
      }
    },
    mounted() {
      this.getEquipmentList()
    },
    methods: {
      handleSelectionChange(val) {
        this.selection = val
      },
      getNewSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '查询条件',
          searchProps: ['itcompName', 'ipaddr', 'oldTaskName']
        }
      },
      getEquipmentList() {
        $axios.get(`deviceConf/getAllDeviceInfo`).then((res) => {
          this.equipmentList = res.data
          for (let v of this.equipmentList) {
            this.$set(v, 'portUuid', v.portProtocolList[0].portUuid)
            this.$set(v, 'accountUuid', v.accountList[0].accountUuid)
            this.$set(v, 'authAccountUuid', v.superAccountList[0].accountUuid)
            if (this.editData !== undefined) {
              this.$set(v, 'taskUuid')
              for (let item of this.editData) {
                  if (v.deviceUuid === item.deviceUuid) {
                    v.taskUuid = item.taskUuid
                    v.portUuid = item.portUuid
                    v.accountUuid = item.accountUuid
                    v.authAccountUuid = item.authAccountUuid
                    this.$nextTick(() => {
                      this.$refs['table'].toggleRowSelection(v, true)
                    })
                  }
              }
            }
          }
        })
      }
    },
    watch: {
      equipmentList: {
        deep: true,
        handler: function (val) {
          let arr = []
          for (let v of val) {
            for (let y of this.selection) {
              if (y.deviceUuid === v.deviceUuid) {
                arr.push(v)
              }
            }
          }
          this.selection = arr
        }
      }
    }
  }
</script>
