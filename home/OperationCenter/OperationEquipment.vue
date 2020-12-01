<!--
 * @Author: songyf
 * @Date: 2019-12-10 11:11:11
 * @LastEditors: songyf
 * @Description: 运维中心-运维资产
 -->
<template>
  <section>
    <s-card class="main-card-content box-card card-line oper-card">
      <div slot="header" class="clearfix">
              <span class="card-title">
                <!--<i class="iconfont icon-middleware"></i>-->
                运维资产
              </span>
        <div class="card-enter more-info input-search">
          <span @click="goto('oper_equipment')" style="float: right;margin-left:10px;">更多</span>
          <s-input v-model="searchKey" @keyup.enter.native="getEquipmentList" placeholder="请输入资产名称/IP地址"
                   class="real-search-input"></s-input>
          <i class="iconfont icon-magnifier search-btn-oper" @click="getEquipmentList"></i>
        </div>
      </div>
      <div :style="{height: carouselContainerHeight + `px`}">
        <div v-nodata="!equipmentList.length" :style="{height: carouselContainerHeight + `px`}"   v-if="!equipmentList.length"></div>
        <s-carousel class="operational-equip-wrapper" arrow="never" :autoplay="false"
                    v-if="equipmentList.length"
                    :height="carouselContainerHeight + `px`">
          <s-carousel-item v-for="(item,index) in equipmentList" :key="item.id">
            <s-row class="operational-equip" type="flex" align="middle">
              <s-col class="operational-equip-item" v-for="item in equipmentList[index]" :key="item.id"
                     style="margin: 4px;width: calc(33.3% - 8px);"
                     :style="{height:  operationalEquipItemHeight + 'px', padding: itemContentPaddingTop + 'px'}">
                <s-row class="equip-item" type="flex" justify="between">
                  <s-col span="18">
                    <div class="firstWord ellipsis" :title="item.itcompName"><span>{{item.itcompName}}</span></div>
                    <s-row :style="{ paddingTop: itemContentPaddingTop / 2 + 'px' }" style="line-height: 30px">
                      <div class="ellipsis"><span class="contentWord" :title="item.controlAdderss">{{item.controlAdderss}}</span></div>
                      <s-col span="12" class="ellipsis" style="min-width: 65px">
                        <i class="iconfont icon-user"></i>
                        <span :title="item.accountName">{{item.accountName}}</span>
                      </s-col>
                      <s-col span="12" class="ellipsis" style="min-width: 65px">
                        <i class="iconfont icon-file"></i>
                        <span :title="item.protocolName">{{item.protocolName}}</span>
                      </s-col>
                    </s-row>
                  </s-col>
                  <s-col span="6">
                    <div class="tc oper-icon" @click="startOps(item)" style="cursor: pointer">
                      <i class="iconfont icon-oper" style="vertical-align: middle"></i>
                      <span>运维</span>
                    </div>
                    <div>
                      <div class="tc" :style="{ paddingTop: itemContentPaddingTop / 1.5 + 'px' }">
                        <img :src="`static/images/topologyicon/default/${item.iconName}.svg`" alt=""
                             style="height: 44px">
                      </div>
                    </div>
                  </s-col>
                </s-row>
              </s-col>
            </s-row>
          </s-carousel-item>
        </s-carousel>
      </div>
    </s-card>
    <!--运维访问-->
    <s-dialog
      v-model="opsDialog"
      v-if="opsDialog"
      width="700px"
      title="运维访问">
      <ops-add :decisionData="rowData" :showModel="showModel" :isOpen="isOpen" ref="ops"></ops-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOps">运维</s-button>
        <s-button type="cancel" @click="opsDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!--运维访问(new)-->
    <s-dialog
      v-model="opsAccessNewDialog"
      v-if="opsAccessNewDialog"
      width="700px"
      title="运维访问">
      <ops-access-new :rowData="rowData" :isOpen="isOpen" ref="opsAccessNew"></ops-access-new>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOpsAccessNew">运维</s-button>
        <s-button type="cancel" @click="opsAccessNewDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--快速运维弹框-->
    <s-dialog
      v-model="RapidopsDialog"
      v-if="RapidopsDialog"
      width="700px"
      title="快速运维">
      <rapid-add :decisionData="rowData" :userShow="usershow" :isOpen="isOpen" ref="Rapidops"></rapid-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveRapidops">保存</s-button>
        <s-button type="cancel" @click="RapidopsDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import EquipmentMixin from '@/home/OperationCenter/EquipmentMixin';
  export default {
    mixins: [EquipmentMixin],
    data() {
      return {

      }
    },
    mounted() {
      this.initHeight();
      this.$nextTick(() => {
        window.addEventListener('resize', this.initHeight);
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.initHeight);
    },
    methods: {
      initHeight() {
        this.mainCardHeight = document.getElementsByClassName('main-card-content')[0].offsetHeight;
        this.boxHeaderHeight = document.getElementsByClassName('s-card-header')[0].offsetHeight;
        this.carouselContainerHeight = this.mainCardHeight - this.boxHeaderHeight;
        var itemHeight = (this.carouselContainerHeight - 15 - 32 - 8 * 3) / 3;
        this.operationalEquipItemHeight = itemHeight > 78 ? itemHeight : 78;
        this.itemContentPaddingTop = (this.operationalEquipItemHeight - 78) / 3;
      }
    }
  }
</script>

<style lang="stylus">
  .input-search{
    position: relative;
  }
  .input-search .search-btn-oper{
    position: absolute;
    right: 42px;
    top: 1.5px
  }
</style>
