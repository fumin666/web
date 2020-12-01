<!--
 * @Description: 子网详情
 * @Position: 只能从列表点击子网地址来
 * @Date: 2019-04-19 09:42:28
 * @LastEditTime: 2019-12-17 18:35:21
 -->
<template>
<section class="logLevelReport" style="height: calc(100vh - 190px);">
  <s-row class="main-content" :gutter="30">
    <s-col class="level-left-nav noPrint" :span="5" id="leftMenu">
      <s-col  style="border-right: 1px solid #ccc;" :span="24">
        <s-row>
          <pieChart name="one" :data="data" title="IP地址可用性统计" :titleSize='14' width="100%" height="300px" :borderWidth="4"></pieChart>
        </s-row>
        <hr style="width: 80%;margin-bottom: 10px;border: 1px solid #ccc;">
        <s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">子网地址:</span>
            </s-col>
            <s-col :title="countInfo.subNetAddress" class="ipamcontent">
              <span class="item-content">{{ countInfo.subNetAddress?countInfo.subNetAddress:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">子网名称:</span>
            </s-col>
            <s-col :title="countInfo.subNetName" class="ipamcontent">
              <span class="item-content">{{ countInfo.subNetName?countInfo.subNetName:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">CIDR:</span>
            </s-col>
            <s-col class="ipamcontent">
              <span class="item-content">{{ countInfo.subNetCIDR?countInfo.subNetCIDR:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">子网掩码:</span>
            </s-col>
            <s-col :title="countInfo.subNetMask" class="ipamcontent">
              <span class="item-content">{{ countInfo.subNetMask?countInfo.subNetMask:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">IP地址数:</span>
            </s-col>
            <s-col class="ipamcontent">
              <span class="item-content">{{ countInfo.mxHostCount?countInfo.mxHostCount:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">使用率:</span>
            </s-col>
            <s-col class="ipamcontent">
              <span class="item-content">{{ countInfo.usage ? countInfo.usage+'%' : '--'}}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">所属组织机构:</span>
            </s-col>
            <s-col :title="countInfo.departName" class="ipamcontent">
              <span class="item-content">{{ countInfo.departName?countInfo.departName:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">最后扫描时间:</span>
            </s-col>
            <s-col :title="countInfo.lastMonitorTimeStr" class="ipamcontent">
              <span class="item-content">{{ countInfo.lastMonitorTimeStr?countInfo.lastMonitorTimeStr:'--' }}</span>
            </s-col>
          </s-row>
          <s-row class="item-right">
            <s-col class="ipamTitle">
              <span class="item-title">描述:</span>
            </s-col>
            <s-col :title="countInfo.remark" class="ipamcontent">
              <span class="item-content">{{ countInfo.remark?countInfo.remark:'--'  }}</span>
            </s-col>
          </s-row>
        </s-row>
      </s-col>
    </s-col>
    <s-col class="console-right-table" :span="19" style="padding-right:0px;">
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 190px);">
      <div style="padding-right:10px;">
        <s-button icon="arrow-left" style="float: right;margin-bottom: 10px;z-index:100;" @click="goback"></s-button>
        <section>
          <s-row>
            <s-col :span="24">
              <s-form :inline="true" :model="searchForm" :rules="rules1" ref="formx" class="search_form" label-width="65px">
                <div>
                  <!-- <s-form-item label="子网地址" prop="subnetAddress">
                    <s-select v-model="searchForm.subnetAddress" filterable>
                      <s-option v-for="item in subnetAddressList" :label="item.name" :value="item.id" :key="item.id"></s-option>
                    </s-select>
                  </s-form-item> -->
                  <s-form-item label="IP地址:" prop="ipAddress">
                    <s-input v-model="searchForm.ipAddress"></s-input>
                  </s-form-item>
                  <s-form-item label="状态:" prop="status">
                    <s-select v-model="searchForm.status" clearable>
                      <s-option v-for="item in statusList" :label="item.name" :value="item.value" :key="item.value"></s-option>
                    </s-select>
                  </s-form-item>
                  <s-form-item label="资产名称:" prop="assetName">
                    <s-input v-model="searchForm.assetName"></s-input>
                  </s-form-item>
                  <s-form-item label="资产类型:" prop="assetCitypeUuids">
                    <select-tree :muti="true" @selectMutiTreeChange="nextSelect" style="width: 185px"></select-tree>
                    <!-- <s-select v-model="searchForm.assetCitypeUuids">
                      <s-option v-for="item in assetTypeList" :label="item.name" :value="item.value" :key="item.value"></s-option>
                    </s-select> -->
                  </s-form-item>
                  <s-form-item label="保留类型:" prop="spare">
                    <s-select v-model="searchForm.spare" clearable>
                      <s-option v-for="item in saveTypeList" :label="item.name" :value="item.value" :key="item.value"></s-option>
                    </s-select>
                  </s-form-item>
                </div>
                <div class="search_btn">
                  <s-button icon="magnifier" @click="getList">查询</s-button>
                </div>
              </s-form>
            </s-col>
          </s-row>
        </section>
        <section>
          <s-row>
            <s-col :span="24">
              <s-button @click="subnetdelete">批量删除</s-button>
            </s-col>
          </s-row>
        </section>
        <s-table-page :data="tableData"
                      @selection-change="selectionChange">
          <s-table-column type="selection" width="45">
          </s-table-column>
          <s-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span :style="color(scope.row.status)">{{text(scope.row.status)}}</span>
            </template>
          </s-table-column>
          <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
          <s-table-column prop="spare" label="保留类型">
            <template slot-scope="scope">
              <span>{{scope.row.spare===1?'保留':'非保留'}}</span>
            </template>
          </s-table-column>
          <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
          <s-table-column prop="assetName" label="资产名称"></s-table-column>
          <s-table-column prop="assetCitypeName" label="资产类型"></s-table-column>
          <s-table-column prop="assetStatus" label="资产状态"></s-table-column>
          <s-table-column label="操作" width="150">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="编辑" @click="editx(scope.row)"> </i>
              <i class="iconfont icon-delete" title="删除" @click="del(scope.row)"> </i>
            </template>
          </s-table-column>
        </s-table-page>
      </div>
      </s-scrollbar>
    </s-col>
  </s-row>
  <s-dialog v-model="edit" width="700px" title="编辑IP地址">
    <s-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
      <s-form-item label="保留类型" prop='spare'>
        <s-select v-model="editForm.spare" clearable>
          <s-option label="保留" :value="1"></s-option>
          <s-option label="非保留" :value="2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="IP地址状态" prop='status'>
        <s-select v-model="editForm.status" clearable>
          <s-option label="暂态" :value="0"></s-option>
          <s-option label="未使用" :value="1"></s-option>
          <s-option label="已使用" :value="2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="备注" prop='remark'>
        <s-input type="textarea" :rows='4' placeholder="最多不超过120字" v-model="editForm.remark"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="okedit('editForm')">确定</s-button>
      <s-button @click="cancel0">取消</s-button>
    </template>
  </s-dialog>
</section>
</template>

<script>
import SelectTree from '@/components/selectTree/SelectTree'
import $axios from 'sunflower-ajax'
import {Validaters} from 'sunflower-common-utils'
import pieChart from '@/components/chart/pieChart.vue'
export default {
  data() {
    return {
      classUuid: [],
      selection: [],
      nameValue: '',
      edit: false,
      editForm: {
        spare: '',
        status: '',
        remark: ''
      },
      rules: {
        remark: [Validaters.Max(120)]
      },
      rules1: {
        ipAddress: [Validaters.IP]
      },
      keyuuid: '',
      searchForm: {
        ipAddress: '',
        status: '',
        assetName: '',
        assetCitypeUuids: [],
        spare: ''
      },
      statusList: [
        {
          name: '未使用',
          value: 1
        },
        {
          name: '已使用',
          value: 2
        },
        {
          name: '暂态',
          value: 0
        }
      ],
      saveTypeList: [
        {
          name: '保留',
          value: 1
        },
        {
          name: '非保留',
          value: 2
        }
      ],
      selections: [],
      tableData: [],
      countInfo: {
        subNetAddress: '',
        subNetCIDR: '',
        subNetName: '',
        subNetMask: '',
        mxHostCount: '',
        usage: '',
        departName: '',
        lastMonitorTimeStr: '',
        remark: ''
      },
      flag: 1,
      data: [{
            value: 0,
            name: '暂态'
          },
          {
            value: 0,
            name: '已使用'
          },
          {
            value: 0,
            name: '未使用'
          }
      ]
    }
  },
  components: {
    SelectTree,
    pieChart
  },
  created() {
    this.getleftList();
  },
  mounted() {
  },
  watch: {
    'searchForm.assetCitypeUuids': {
      handler(val) {
        if (val) {
          this.getList()
        }
      }
    }
  },
  methods: {
    getleftList() {
      this.keyuuid = this.$route.params.id;
      let self = this;
      $axios.get(`/ipamIpAddressView/getSubnetdetail/${this.keyuuid}`).then(res => {
        if (res.status === 200) {
          self.data[0].value = res.data.temporary;
          self.data[1].value = res.data.used;
          self.data[2].value = res.data.available;
          self.countInfo = res.data;
        }
      })
    },
    nextSelect(val) {
      let vm = this;
      vm.classUuid = [];
      vm.selection = [];
      vm.nameValue = '';
      val.map((item) => {
        vm.classUuid.push(item.uuid)
      });
      this.searchForm.assetCitypeUuids = this.classUuid;
    },
    color(text) {
      if (text === 1) {
        return {color: 'yellowgreen', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
      } else if (text === 2) {
        return {color: 'red', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
      } else if (text === 0) {
        return {color: 'orange', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
      }
    },
    text(text) {
      if (text === 1) {
        return '未使用';
      } else if (text === 2) {
        return '已使用';
      } else if (text === 0) {
        return '暂态'
      }
    },
    getList() {
      this.searchForm.subnetUuid = this.keyuuid;
      let param = {
        condition: this.searchForm
      }
      this.$refs.formx.validate((valid) => {
        if (!valid) {
          return false
        }
        $axios.post('/ipamIpAddressView/searchIpAddressInfoByCriteria', param).then((res) => {
          if (res.status === 200) {
            this.tableData = res.data;
          } else {
            this.$message({
              showClose: true,
              message: '查询失败！',
              type: 'error'
            });
          }
        });
      })
    },
    selectionChange(rows) {
      this.selections = rows;
    },
    subnetdelete() {
      let param = this.selections.map(function (item) {
        return item.uuid;
      });
      if (param.length === 0) {
        this.$message({
          showClose: true,
          message: '请至少选择一项要删除的数据！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/ipamIpAddressView/batchDelIpAddressInfoByUuids', param).then(({
          data,
          status
        }) => {
          if (status === 200 && data.state === true) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'error'
            });
          }
        });
      }).catch(() => {});
    },
    editx(row) {
      this.editForm = Object.assign({}, row);
      this.edit = true
    },
    // 保存编辑
    okedit(editForm) {
      this.$refs[editForm].validate((valid) => {
        if (valid) {
          this.editForm.createTime = null
          this.editForm.updateTime = null
          this.editForm.updateUser = this.$store.state.userData.uuid;
          this.editForm.prevStatus = 4
          $axios.post(`/ipamIpAddressView/editIpAddressInfo`, this.editForm).then((res) => {
            if (res.data.state === true) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.edit = false
              this.getleftList()
              this.getList()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '编辑失败!'
          });
        }
      });
    },
    del(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/ipamIpAddressView/batchDelIpAddressInfoByUuids', [row.uuid]).then(({
          data,
          status
        }) => {
          if (status === 200 && data.state === true) {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getList();
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'error'
            });
          }
        });
      }).catch(() => {});
    },
    // 取消按钮
    cancel0() {
      this.editForm = {
        spare: '',
        status: '',
        remark: ''
      }
      this.edit = false
    },
    goback() {
      this.$router.push({
        path: '/AssetsAll/assets_ipam'
      })
      this.$store.commit('setSubnetform', 'address')
    }
  }
}
</script>

<style scoped>
.ipamcontent{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.ipamTitle{
  min-width: 90px;
}
.item-right {
  height: 38px;
  line-height: 37px;
  display: flex;
  /* border:1px solid #E4E7ED; */
}
/* table,tr,td{
  border:1px solid #E4E7ED;
} */
.item-right .item-title {
  font-weight: bold;
  font-size: 13px;
}
.item-right .item-content {
  font-size: 13px;
  margin-left: 5px
}
</style>
