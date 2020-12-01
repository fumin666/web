<!--
 * @Description: In User Settings Edit
 * @Version: //Q4IP台账//Q4高级搜索优化
 * @LastEditors  : mybells
 * @Date: 2019-04-25 10:28:54
 * @LastEditTime : 2019-12-24 17:56:57
 -->

<template>
  <div>
    <section>
      <s-row>
        <s-col :span="24">
          <s-form :inline="true" class="search_form" label-width='75px'>
            <div>
              <s-form-item label="子网地址：">
                <s-select v-model="form.subnetUuid" clearable style="width:185px;">
                  <s-option v-for="item in subnetData" :label="item.subNetAddress" :value="item.uuid" :key="item.uuid"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="保留类型：">
                <s-select v-model="form.spare" clearable>
                  <s-option label="保留" :value="1"></s-option>
                  <s-option label="非保留" :value="2"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="IP地址：">
                  <s-input v-model="form.ipAddress" style="width:185px;"></s-input>
              </s-form-item>
              <s-form-item label="状态：">
                <s-select v-model="form.status" clearable>
                  <s-option label="暂态" :value="0"></s-option>
                  <s-option label="未使用" :value="1"></s-option>
                  <s-option label="已使用" :value="2"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="资产名称：">
                  <s-input v-model="form.assetName" style="width:185px;"></s-input>
              </s-form-item>
              <s-form-item label="资产类型：">
                <select-tree :muti="true" @selectMutiTreeChange="nextSelect" style="width: 185px"></select-tree>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" title="统计" @click="getList">统计</s-button>
            </div>
          </s-form>
        </s-col>
      </s-row>
    </section>
    <s-row>
      <s-col :span="24">
        <s-button title="批量删除" icon="batch-del" @click="BatchDeletion">批量删除</s-button>
      </s-col>
    </s-row>
    <s-table-page
      :data="tableData"
      @selection-change="selectionChange">
      <s-table-column
        type="selection"
        width="45">
      </s-table-column>
      <s-table-column
        prop="statusStr"
        label="状态">
        <template slot-scope="scope">
          <span :style="color(scope.row.status)">{{scope.row.statusStr}}</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="ipAddress"
        label="IP地址">
        <template slot-scope="scope">
          <span>{{ scope.row.ipAddress }}</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="spareStr"
        label="保留类型">
      </s-table-column>
      <s-table-column
        prop="subnetAddress"
        label="子网地址">
      </s-table-column>
      <s-table-column
        prop="assetName"
        label="资产名称">
      </s-table-column>
      <s-table-column
        prop="assetCitypeName"
        label="资产类型">
      </s-table-column>
      <s-table-column
        prop="assetStatus"
        label="资产状态">
      </s-table-column>
      <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" title="查看" @click="goDetail(scope.row)"> </i>
              <i class="iconfont icon-edit" title="编辑" @click="addressedit(scope.row)"> </i>
              <i class="iconfont icon-delete" title="删除" @click="addressdel(scope.row)"> </i>
            </template>
      </s-table-column>
    </s-table-page>
    <s-dialog v-model="edit" width="700px" title="编辑IP地址">
      <s-form :model="editForm" :rules="rules" ref="editForm" label-width="100px" class="demo-ruleForm">
          <s-form-item label="保留类型">
              <s-select v-model="editForm.spare" prop='editspare'>
                <s-option label="保留" :value="1"></s-option>
                <s-option label="非保留" :value="2"></s-option>
              </s-select>
          </s-form-item>
          <s-form-item label="IP地址状态">
              <s-select v-model="editForm.status" prop='status'>
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
    <ipam-details v-if="ipamDetailsDialog" :ipamDetailsDialog.sync="ipamDetailsDialog" :rowUuid="rowUuid"></ipam-details>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {Validaters} from 'sunflower-common-utils'
  import SelectTree from '@/components/selectTree/SelectTree'
  import ipamDetails from '@/pages/Assets_Ipam/Perspective/IpamDetails.vue'
  export default {
    components: {
      SelectTree,
      ipamDetails
    },
    props: {
        keyuuid: {
          type: String
        }
    },
    data () {
      return {
        ipamDetailsDialog: false,
        rowUuid: '',
        edit: false,
        tableData: [],
        flag: 1,
        form: {
          ipAddress: '',
          status: '',
          spare: '',
          subnetUuid: '',
          assetName: '',
          assetCitypeUuids: [],
          departmentUuid: ''
        },
        editForm: {},
        rules: {
          remark: [ Validaters.Max(120)
          ]
        },
        classUuid: [],
        selection: [],
        nameValue: '',
        BatchdelUuid: [],
        subnetData: [],
        selections: []
      }
    },
    mounted() {
      this.getSubnetType()
    },
    methods: {
      nextSelect(val) {
        let vm = this;
        vm.classUuid = [];
        vm.selection = [];
        vm.nameValue = '';
        val.map((item) => {
          vm.classUuid.push(item.uuid)
        });
        vm.form.assetCitypeUuids = this.classUuid
      },
      // 详情页跳转
      goDetail(row) {
        this.rowUuid = row.uuid;
        this.ipamDetailsDialog = true;
      },
      // 编辑按钮
      color(text) {
        if (text === 1) {
          return {color: 'yellowgreen', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        } else if (text === 2) {
          return {color: 'red', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        } else if (text === 0) {
          return {color: 'orange', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        }
      },
      addressedit(rows) {
        this.editForm = Object.assign({}, rows)
        this.edit = true
      },
      // 点击统计
      getList() {
        this.form.departmentUuid = this.keyuuid
        let properties = {
          condition: this.form
        }
        $axios.post(`/ipamIpAddressView/searchIpAddressInfoByCriteria`, properties).then((res) => {
            if (res.data) {
              this.tableData = res.data || []
            }
        })
      },
      getSubnetType() {
        $axios.post(`/ipamNetsegment/getAllIpamNetSegmentList`).then((res) => {
            if (res.data) {
              this.subnetData = res.data || []
            }
        })
      },
      // 保存编辑
      okedit(editForm) {
        this.$refs[editForm].validate((valid) => {
          if (valid) {
            this.editForm.createTime = null
            this.editForm.updateTime = null
            this.editForm.updateUser = this.$store.state.userData.uuid;
            this.editForm.prevStatus = 4
            $axios.post(`/ipamIpAddressView/editIpAddressInfo`, this.editForm, {
              data: [this.form],
              logTemplate: '编辑|IP地址(#ipAddress#)'
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({type: 'success', message: '编辑成功!'});
                this.edit = false
                this.getList();
              }
            })
          } else {
                this.$message({type: 'error', message: '编辑失败!'});
          }
        });
      },
      // 删除按钮
      addressdel(row) {
          this.$confirm('确定删除该条数据?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', center: true}).then(() => {
            let delUuid = []
            delUuid.push(row.uuid)
            $axios.post(`/ipamIpAddressView/batchDelIpAddressInfoByUuids`, delUuid, {
              data: [row],
              logTemplate: '删除|IP地址(#ipAddress#)'
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({type: 'success', message: '删除成功!'});
                this.form.assetCitypeUuids = []
                this.form.departmentUuid = this.keyuuid
                let properties = {
                  condition: this.form
                }
                $axios.post(`/ipamIpAddressView/searchIpAddressInfoByCriteria`, properties).then((res) => {
                    if (res.data) {
                      this.tableData = res.data || []
                    }
                })
              }
            })
            }).catch(() => {
            });
      },
      selectionChange(rows) {
        this.selections = rows;
      },
      // 批量删除
      BatchDeletion() {
        this.BatchdelUuid = this.selections.map(function (item) {
          return item.uuid;
        });
        if (this.BatchdelUuid.length) {
          this.$confirm('确定删除该条数据?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
              $axios.post(`/ipamIpAddressView/batchDelIpAddressInfoByUuids`, this.BatchdelUuid, {
                data: this.selections,
                logTemplate: '删除|IP地址(#ipAddress#)'
              }).then((res) => {
                if (res.data.state === true) {
                  this.$message({type: 'success', message: '删除成功!'});
                  this.getList()
                }
              }).catch(() => {
              });
          })
        } else {
          this.$message({
            type: 'warning',
            message: '选择要删除的数据！'
          })
        }
      },
      // 取消按钮
      cancel0() {
        this.editForm = {}
        this.edit = false
      }
    },
    watch: {
      'form.assetCitypeUuids': {
        handler() {
          if (this.flag === 1) {
            this.getList()
            this.flag = 0
          }
        }
      }
    }

  }
</script>
<style lang="stylus">
</style>
