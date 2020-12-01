<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @Description:子网扫描step1
 * @Position:
 * @Date: 2019-07-15 13:44:42
 * @LastEditors  : mybells
 -->
<template>
<s-dialog id="subnetAgain" class="step1" v-model="findAgainDialogFlag" width="800px" title="子网扫描" :before-close="close">
  <s-scrollbar wrap-style="max-height: 550px;">
    <s-row>
      <s-col :span="14">
        <s-row>
          <s-col>
            <div class="table-block-title">SNMP共同体</div>
            <span>凭证(版本号)：</span>
            <li class="listblock" v-for="(item, index) in step1List" :key="index" @mouseenter="showUuid=item.uuid" @mouseleave="showUuid=null">
              {{item.community || item.userName}}
              (v{{item.version}})
              <i class="iconfont icon-error" v-show="item.uuid===showUuid" @click="axiosDeleteVerify([item.uuid])"></i>
            </li>
            <i class="iconfont icon-plus handlerPlus" @click="handlerPlus"></i>
          </s-col>
        </s-row>
        <s-row>
          <s-col>
            <div class="table-block-title">扫描方式</div>
            <s-form :model="scanway1" :rules="scanRules" ref="scanrules"  label-width="90px">
              <s-form-item label="">
                <s-radio-group v-model="scanway1.scanmode">
                  <s-radio class="radio" :label="1">从网关扫描</s-radio>
                  <s-radio class="radio" :label="2">从种子扫描</s-radio>
                </s-radio-group>
              </s-form-item>
              <s-form-item label="输入种子" v-show="scanway1.scanmode==2" prop="seed" style="height:50px;">
                <s-input v-model="scanway1.seed" style="width:200px;"></s-input>
              </s-form-item>
              <s-form-item v-show="scanway1.scanmode==1" style="height:50px;">
              </s-form-item>
            </s-form>
          </s-col>
        </s-row>
      </s-col>
      <s-col :span="10" style="text-align:center;position: absolute; right: 0; top: calc(50% - 150px);">
        <img v-if="scanway1.scanmode==1" src="/static/images/assetpolling/findAgain/scanstatic.svg" style="width:70%;margin-top:20px;">
        <img v-if="scanway1.scanmode==2" src="/static/images/assetpolling/findAgain/scanstatic2.svg" style="width:70%;margin-top:20px;">
      </s-col>
    </s-row>
  </s-scrollbar>
  <template slot="footer" class="dialog-footer">
    <s-button @click="startscan">开始扫描</s-button>
    <s-button @click="close">取消</s-button>
  </template>

  <!-- 添加SNMP共同体 -->
  <addCommonDialog v-if="SNMPDialogFlag" :SNMPDialogFlag.sync="SNMPDialogFlag" @reload="getStep1List"></addCommonDialog>
</s-dialog>
</template>

<script>
import {cloneDeep} from 'lodash'
import $axios from 'sunflower-ajax';
import addCommonDialog from './AddCommonDialog.vue';
import {Validaters} from 'sunflower-common-utils';

export default {
  components: {
    addCommonDialog
  },
  data() {
    return {
      showUuid: null,
      findAgainDialogFlag: true,
      SNMPDialogFlag: false, // 添加共同体弹窗
      scanRules: {
        seed: [
          Validaters.NotNull,
          {
            pattern: /^((([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))\.){3}(([0-9]|(([1-9]|1[0-9])[0-9]))|(2([0-4][0-9]|5[0-5])))$/,
            message: '请输入正确的ip',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    step1List: {
      get() {
        return cloneDeep(this.$store.state.scanningSteps.step1.step1List);
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep1List', cloneDeep(val));
      }
    },
    scanway1: {
      get() {
        return this.$store.state.scanningSteps.step1.scanway1;
      },
      set(val) {
        this.$store.commit('scanningSteps/setScanway1', cloneDeep(val));
      }
    }
  },
  methods: {
    // 增加SNMP共同体
    handlerPlus() {
      this.SNMPDialogFlag = true;
    },
    // 获取共同体
    getStep1List() {
      $axios.post('/ipamNetsegment/listCommunitys').then((response) => {
        let { status, msg, data } = response;
        if (status !== 200) {
          this.$nextTick(() => {
            this.$message({
              title: '错误',
              message: msg,
              type: 'error'
            });
          })
        } else {
          this.step1List = data;
        }
      })
    },
    // 删除共同体
    axiosDeleteVerify(params) {
      this.$confirm('确定删除当前凭证？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('resourcemanager/discovery/deleteCommunitys', params).then(response => {
          if (response.data === 'success') {
            this.$message({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            });
            this.getStep1List();
          } else {
            this.$message({
              showClose: true,
              message: '删除失败！',
              type: 'warnimg'
            });
          }
      }).catch(() => {});
      });
    },
    // 关闭子网扫描
    close() {
      this.$emit('close')
    },
    startscan() {
      let vm = this;
      if (vm.scanway1.scanmode === 2) { // 种子扫描
        vm.$refs.scanrules.validate((valid) => {
          if (valid) {
            if (vm.step1List.length) {
              $axios.get(`/ipamNetsegment/canScanIpam/scanSubNet`).then((res) => {
                if (res.data.state) {
                  vm.$store.commit('scanningSteps/next');
                } else {
                  vm.$nextTick(() => {
                    vm.$message({
                      customClass: 'zZindex',
                      message: res.data.errormsg,
                      type: 'warning'
                    });
                  })
                }
              });
            } else {
              vm.$nextTick(() => {
                vm.$message({
                  message: '请至少选择一项凭证！',
                  type: 'warning'
                });
              })
            }
          }
        })
      } else {
        if (vm.step1List.length) {
          $axios.get(`/ipamNetsegment/canScanIpam/scanSubNet`).then((res) => {
            if (res.data.state) {
              vm.$store.commit('scanningSteps/next');
            } else {
              vm.$nextTick(() => {
                vm.$message({
                  customClass: 'zZindex',
                  message: res.data.errormsg,
                  type: 'warning'
                });
              })
            }
          });
        } else {
          vm.$nextTick(() => {
            vm.$message({
              message: '请至少选择一项凭证！',
              type: 'warning'
            });
          })
        }
      }
    }
  },
  created() {
    this.getStep1List();
  },
  mounted() {
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.zZindex{
  z-index: 4000!important;
}
</style>
