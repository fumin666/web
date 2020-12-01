<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @Description: ipam 子网视角
 * @Position: ipam -》 ip地址管理-》子网视角
 * @Date: 2019-04-19 09:42:27
 * @LastEditTime : 2019-12-28 21:35:00
 -->
<template>
<div>
  <section>
    <s-row>
      <s-col :span="24">
        <s-form :inline="true" class="search_form">
          <div>
            <s-form-item label="子网地址：">
              <s-select v-model="form.uuid" filterable clearable style="width:200px;">
                <s-option v-for="(item,index) in subnetAddressList" :label="item.subNetAddress" :value="item.uuid" :key="index"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="子网名称：">
              <s-input v-model="form.subNetName" style="width:200px;"></s-input>
            </s-form-item>
            <s-form-item label="扫描时间：">
              <date-range v-model="form.scanTime"></date-range>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" title="查询" @click="getList">查询</s-button>
          </div>
        </s-form>
      </s-col>
    </s-row>
  </section>
  <section>
    <s-row>
      <s-col :span="24">
        <s-button icon="self-test" @click="subnetscanDialog = true;" v-if="isSystem">子网扫描</s-button>
        <s-button icon="plus" @click="subnetadd" v-if="isSystem">子网添加</s-button>
        <s-button icon="batch-import" @click="subnetimport" v-if="isSystem">批量导入</s-button>
        <s-button icon="batch-del" @click="subnetdelete" v-if="isSystem">批量删除</s-button>
        <s-button icon="fwqq_ipdizhiqingqiufenpei" @click="ipallocation" v-if="isSystem||isShow">IP地址分配</s-button>
      </s-col>
    </s-row>
  </section>
  <s-table-page
    :data="tableData"
    @selection-change="selectionChange">
    <s-table-column type="selection" width="45">
    </s-table-column>
    <s-table-column prop="subNetAddress" label="子网地址" width="150" fixed>
      <template slot-scope="scope">
        <span>{{ scope.row.subNetAddress }}</span>
      </template>
    </s-table-column>
    <s-table-column prop="subNetName" label="子网名称" width="200"></s-table-column>
    <s-table-column prop="subNetCIDR" label="CIDR"></s-table-column>
    <s-table-column prop="subNetMask" label="子网掩码" width="150"></s-table-column>
    <s-table-column prop="departName" label="组织机构"></s-table-column>
    <s-table-column prop="mxHostCount" label="IP地址数"></s-table-column>
    <s-table-column prop="usage" label="使用率">
      <template slot-scope="scope">
        <span>{{scope.row.usage+"%"}}</span>
      </template>
    </s-table-column>
    <s-table-column prop="used" label="已使用"></s-table-column>
    <s-table-column prop="available" label="未使用"></s-table-column>
    <s-table-column prop="temporary" label="暂态"></s-table-column>
    <s-table-column prop="lastMonitorTimeStr" label="最后扫描时间" width="200"></s-table-column>
    <s-table-column label="操作" width="200" v-if="isSystem" fixed="right">
      <template slot-scope="scope">
        <i class="iconfont icon-eye" title="查看子网详情" @click="goDetail(scope.row)"> </i>
        <i class="iconfont icon-self-test" title="IP地址扫描" @click="scan(scope.row)"> </i>
        <i class="iconfont icon-edit" title="编辑" @click="addressedit(scope.row)"> </i>
        <i class="iconfont icon-delete" title="删除" @click="addressdel(scope.row)"> </i>
      </template>
    </s-table-column>
  </s-table-page>

  <!--批量导入-->
  <import-dialog v-model="bloomImport" v-if="bloomImport" :uploadObj="uploadObj" :downObj="downObj" @reload="getImportList" :fileTypes="['xls', 'xlsx']"></import-dialog>
  <!-- 子网添加 or 编辑-->
  <subnet-add-dialog v-if="addDialog" @addCancel="addDialog = false" @addEnsure="addEnsure" :subnetobj="subnetobj" :add-dialog="addDialog"></subnet-add-dialog>
   <!-- IP地址分配 -->
  <address-allocation-dialog v-if="allocationDialog" :allocationDialog.sync="allocationDialog" @reload="getImportList"></address-allocation-dialog>
  <!--子网扫描-->
  <subnet-scan-dialog v-if="subnetscanDialog" :subnetscandialog.sync="subnetscanDialog" @reload="getImportList"></subnet-scan-dialog>
  <!-- IP地址扫描 -->
  <address-scan-dialog v-if="scanDialog" :scandialog.sync="scanDialog" :ipsubnetobj="ipsubnetobj" @reload="getImportList"></address-scan-dialog>
</div>
</template>

<script>
import $axios from 'sunflower-ajax'
import subnetAddDialog from './IpamDialogs/SubnetAddDialog'
import addressAllocationDialog from './IpamDialogs/AddressAllocationDialog'
import addressScanDialog from './IpamDialogs/AddressScanDialog'
import subnetScanDialog from './IpamDialogs/SubnetScanDialog'
import DateRange from '@/components/tableCom/src/DateRange';
import ImportDialog from './IpamDialogs/ImportDialog'

export default {
  components: {
    addressAllocationDialog,
    subnetAddDialog,
    addressScanDialog,
    subnetScanDialog,
    ImportDialog,
    DateRange
  },
  props: {
      keyuuid: {
        type: String
      }
  },
  data() {
    return {
      isShow: false, // 是否是配置管理员
      isSystem: false, // 是否是系统管理员
      bloomImport: false, // 导入
      allocationDialog: false, // ip分配
      subnetscanDialog: false, // 子网扫描
      scanDialog: false, // ip地址扫描
      addDialog: false, // 添加弹窗
      subnetobj: {}, // 判断是添加还是编辑
      ipsubnetobj: {},
      uploadObj: {
        url: '/ipamNetsegment/importSubNet',
        type: 'get'
      },
      downObj: {
        url: '/ipamNetsegment/getSubNetImportTemplate',
        text: '子网导入模版'
      },
      /* 编辑相关 */
      contentForm: [], // 每条信息内容
      tableData: [], // 列表数据
      selection: [], // 选中的数据
      subnetAddressList: [], // 子网地址下拉框
      form: {
        departUuid: '',
        uuid: '',
        subNetName: '',
        scanTime: []
        // startTime: '',
        // endTime: ''
      },
      rules: {
        name: [{
            required: true,
            message: '请输入告警名称',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '最长输入20个字符',
            trigger: 'blur'
          }
        ]
      },
      rolearr: ['tsecondroleinfo00000000000000000', 'tsecondroleinfo00000000000000003', 'tsecondroleinfo00000000000000005', 'tsecondroleinfo00000000000000010', 'tsecondroleinfo00000000000000012', 'tsecondroleinfo00000000000000014']
    }
  },
  computed: {
  },
  created() {
    let _this = this;
    let role = this.$store.state.userData.roleUuidsStr;
    this.rolearr.forEach(function(val) {
      if (role && role.includes(val)) {
        _this.isSystem = true;
      }
    })
    // IP地址分配 判断当前用户是否是资产配置管理员
    $axios.get('/ipamNetsegment/isAssetConfig').then(({data}) => {
      this.isShow = !!data;
    })
    $axios.get('/ipamNetsegment/getAllIpamNetSegmentList').then(({data}) => {
      this.subnetAddressList = data;
    })
    this.getList();
  },
  methods: {
    // getDateRangeStart(value) {
    //   let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
    //   let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
    //   if (end) {
    //     if (start >= end) {
    //       this.$message({
    //         type: 'warning',
    //         message: '开始时间必须小于结束时间！'
    //       })
    //       this.form.startTime = '';
    //     }
    //   }
    // },
    // getDateRangeEnd(value) {
    //   let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
    //   let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
    //   if (start) {
    //     if (start >= end) {
    //       this.$message({
    //         type: 'warning',
    //         message: '结束时间必须大于开始时间！'
    //       })
    //       this.form.endTime = '';
    //     }
    //   }
    // },
    // 行操作扫描
    scan(row) {
      this.ipsubnetobj = row;
      $axios.get(`/ipamNetsegment/canScanIpam/scanIpAddress`).then((res) => {
        if (res.data.state) {
          this.scanDialog = true;
        } else {
          this.$message.warning(res.data.errormsg)
        }
      });
    },
    // 子网添加
    subnetadd() {
      this.subnetobj = {};
      this.addDialog = true;
    },
    // 编辑按钮
    addressedit(row) {
      this.subnetobj = row;
      this.addDialog = true;
    },
    // 子网添加确认
    addEnsure() {
      this.form.subNetName = '';
      this.form.scanTime = [];
      this.getList();
      this.addDialog = false;
    },
    // 批量导入
    subnetimport() {
      this.bloomImport = true;
    },
    // 批量删除
    subnetdelete() {
      if (this.selection.length) {
        let uuidArr = this.selection.map(row => {
          return row.uuid;
        })
        this.$confirm('确定删除选中数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/ipamNetsegment/batchDeleteNet`, uuidArr, {
            data: this.selection,
            logTemplate: '删除|子网(#subNetName#)'
          }).then(({data}) => {
            if (data.state) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.getList();
            } else {
              this.$message({
                type: 'error',
                message: data.errormsg
              })
            }
          })
        }).catch(() => {
        });
      } else {
        this.$message({
          type: 'warning',
          message: '选择要删除的数据！'
        })
      }
    },
    // IP地址分配弹窗
    ipallocation() {
      // 配置管理员才能分配
      this.allocationDialog = true;
    },
    // 获取选中数据
    selectionChange(val) {
      this.selection = val
    },
    // 删除按钮
    addressdel(row) {
      this.$confirm('确定删除该条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        $axios.post(`/ipamNetsegment/batchDeleteNet`, [row.uuid], {
          data: [row],
          logTemplate: '删除|子网(#subNetName#)'
        }).then(({data}) => {
          if (data.state) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: data.errormsg
            })
          }
        })
      }).catch(() => {
      });
    },
    // 获取列表数据
    getList() {
      if (this.keyuuid) {
        this.form.departUuid = this.keyuuid;
        var param = Object.assign({}, this.form);
        param.startTime = param.scanTime[0] ? (new Date(param.scanTime[0]).getTime() / 1000) : 0;
        param.endTime = param.scanTime[1] ? (new Date(param.scanTime[1]).getTime() / 1000) : 0;
        $axios.post(`/ipamNetsegment/getIpamNetSegmentList`, param).then((res) => {
          this.tableData = res.data || []
        })
      }
    },
    getImportList() {
      this.$nextTick(() => {
        this.getList();
      })
    },
    goDetail(row) {
      this.$router.push('/AssetsAll/assets_ipam/subnetDetail/' + row.uuid);
    }
  }
}
</script>
