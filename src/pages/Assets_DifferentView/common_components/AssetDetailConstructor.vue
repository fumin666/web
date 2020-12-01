/**
* Created by dgunzi on 2019/02/20.//Q4资产详情
* 资产详情结构内容
*/
<template>
  <div id="assetsDetailConstructor">
    <div class="left_page">
      <div class="left_top">
        <div class="left_title" style="margin-top:30px;">名称</div>
        <div class="left_val" :title="commonPropForm.itcompName||'-'">{{commonPropForm.itcompName||'--'}}</div>
        <div class="left_title">IP地址</div>
        <div class="left_val" :title="commonPropForm.controlAdderss||'--'">{{commonPropForm.controlAdderss||'--'}}</div>
        <img :src="getImage" style="width: 55px;">
      </div>
      <div class="left_bottom">
        <s-scrollbar wrap-style="height: calc(100vh - 360px + 15px);">
          <RightMenu :threeTypeName="threeTypeName" v-if="isShow"></RightMenu>
        </s-scrollbar>
      </div>
    </div>
    <div class="right_page">
      <s-scrollbar wrap-style="height:calc(100vh - 190px + 15px);padding-right:10px;">
        <div class="right_top">
          <s-carousel :initial-index="0" :autoplay="false" arrow="never">
            <s-carousel-item>
              <div class="asset_carousel">
                <div class="column">
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 资产分类</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.citypeName">{{commonPropForm.citypeName||'--'}}</s-col>
                  </s-row>
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 厂商</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.manufactCaption">{{commonPropForm.manufactCaption||'--'}}</s-col>
                  </s-row>
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 型号</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.productCaption">{{commonPropForm.productCaption||'--'}}</s-col>
                  </s-row>
                </div>
                <div class="column">
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 资产状态</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.assetStatusName">{{commonPropForm.assetStatusName||'--'}}</s-col>
                  </s-row>
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 配置管理员机构</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.operationOrgName">{{commonPropForm.operationOrgName||'--'}}</s-col>
                  </s-row>
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 配置管理员</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.maintenanceStaffName">{{commonPropForm.maintenanceStaffName||'--'}}</s-col>
                  </s-row>
                </div>
                <div class="column">
                  <s-row class="asset-info">
                    <s-col :span="9" class="asset-title">• 使用部门</s-col>
                    <s-col class="asset-value" :span="15" :title="commonPropForm.useDepartName">{{commonPropForm.useDepartName||'--'}}</s-col>
                  </s-row>
                  <s-row class="asset-info" style="height:66.6%;">
                    <s-col :span="9" class="asset-title">• 资产描述</s-col>
                    <s-col class="asset-value" :span="15" style="-webkit-line-clamp: 4;" :title="commonPropForm.descr">{{commonPropForm.descr||'--'}}</s-col>
                  </s-row>
                </div>
              </div>
            </s-carousel-item>
            <s-carousel-item v-for="(items, index) in openApplicationData" :key="index">
              <div class="asset_carousel">
                <div class="column" v-for="(arr, index) in items" :key="index">
                  <s-row class="asset-info" v-for="(item, index) in arr" :key="index">
                    <s-col :span="9" class="asset-title" :title="item.colnumName">• {{item.colnumName}}</s-col>
                    <s-col class="asset-value" :span="15" :title="item.value">{{item.value||'--'}}</s-col>
                  </s-row>
                </div>
              </div>
            </s-carousel-item>
          </s-carousel>
        </div>
        <div class="right_bottom">
          <slot></slot>
        </div>
      </s-scrollbar>
    </div>
  </div>
</template>

<script>
import { merge, chunk } from 'lodash'
import $axios from 'sunflower-ajax'
import propertyConstructor from '../propertyConstructor.js'
import RightMenu from '@/components/rightMenu/RightMenu.vue';
export default {
  data() {
    return {
      isShow: false,
      fristTypeName: '服务器',
      threeTypeName: 'PC服务器',
      commonPropForm: {         // 通用属性表单
        attrvalueView: []       // 特殊属性返回列表(防止渲染时ajax数据未返回报错)
      },
      /* 基础信息参数 */
      assetUuid: this.$route.params.assetUuid,
      openApplicationData: []
    }
  },
  components: {
    RightMenu
  },
  created() {
    this.getdata()
  },
  computed: {
    getImage() {
      var iconUrl = '/static/images/topologyicon/default/';

      var firstIconEnum = {
        '服务器': 'WebService.svg',
        '应用': 'ApplicationCluster.svg',
        '网络': 'Network.svg',
        '存储': 'Storage.svg',
        '安全': 'SecurityAudit.svg',
        '机房环境': 'HeadendEquipment.svg',
        '用户终端': 'Tenminal.svg',
        '其他': 'unknown.svg'
      };
      var threeIconEnum = {
        '数据库': 'DataBase.svg',
        '中间件': 'Middleware.svg',
        '网络交换机': 'NetworkSwitch.svg',
        '安全审计': 'SecurityAudit.svg',
        '摄像头': 'domecamera.svg',
        '防火墙': 'Firewall.svg',
        '虚拟机': 'VirtualDevice.svg',
        '路由器': 'Router.svg',
        '打印机': 'Printer.svg',
        'PC服务器': 'PCserver.svg',
        '前端设备': 'networkserver.svg',
        '网络端口': 'Hub.svg',
        '服务器硬件': 'hostHardWare.svg'
      };
      let name = 'unknown.svg';
      if (this.threeTypeName in threeIconEnum) {
        name = threeIconEnum[this.threeTypeName];
      } else {
        name = firstIconEnum[this.firstTypeName];
      }
      return iconUrl + (name || 'unknown.svg');
    }
  },
  methods: {
    getdata() {
      let vm = this;
      function getitAsset() {
        return $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${vm.assetUuid}`);
      }

      function getApplicationProperty() {
        return $axios.get('/resourcemanager/configurationmanage/generalProperty/getApplicationProperty');
      }

      Promise.all([getitAsset(), getApplicationProperty()]).then(([{ data }, property]) => {
        this.fristTypeName = data.fristTypeName;
        this.threeTypeName = data.threeTypeName;
        this.isShow = true;
        // 两个请求现在都执行完成
        if (data && data instanceof Object) {
          let tempForm = Object.assign({}, data, data.cmdbAssetinfo, data.cmdbCi)
          let environmentTypeLists = ['生产环境', '测试环境', '灾备环境', '其他', '开发环境'];
          tempForm.environment = environmentTypeLists[parseInt(tempForm.environment)]
          tempForm.modifyTime = data.modifyTime
          tempForm.citypeName = ''
          if (data.important && (data.important === 2 || data.important === 1)) {
            tempForm.important = '很高'
          } else if (data.important && data.important === 3) {
            tempForm.important = '高'
          } else if (data.important && data.important === 4) {
            tempForm.important = '中等'
          } else if (data.important && data.important === 5) {
            tempForm.important = '低'
          } else {
            tempForm.important = '很低'
          }
          if (data.isForbidPing && data.isForbidPing === 1) {
            tempForm.isForbidPing = '是'
          } else {
            tempForm.isForbidPing = '否'
          }
          if (data.uAmount === null) {
            tempForm.uAmount = ''
          } else {
            tempForm.uAmount = data.uAmount
          }
          tempForm.panel = data.panel
          tempForm.atCabinetNumber = data.atCabinetNumber
          tempForm.maintenanceStaffName = data.operationOrgName ? data.maintenanceUser.userRealName : ''
          tempForm.HARDDISKRL = data.itcompServerHarddiskList.length > 0 ? data.itcompServerHarddiskList[0].capacity : ''
          tempForm.CPUXH = data.itcompServerProcessorList.length > 0 ? data.itcompServerProcessorList[0].cpuModle : ''
          tempForm.XIANSHIQI = data.itcompServerPeripheralList.length > 0 ? data.itcompServerPeripheralList[0].manufacturerName : ''
          tempForm.attrvalueView = data.attrvalueView instanceof Array ? data.attrvalueView : []
          // 资产型号选择回显为: 厂商(型号)
          tempForm.manufacturerModelNumber = `${data.manufactCaption ? data.manufactCaption : ''}${data.productCaption ? `(${data.productCaption})` : ''}`
          tempForm.useDepartName = data.cmdbOrganization ? data.cmdbOrganization.departName : ''     // 使用部门名称
          tempForm.assetStatusName = data.cmdbAssetinfo.assetstatusView.assetstatusName      // 资产状态名称

          // 追加配置项管理>通用属性详情
          tempForm.assetAtachAttrArr = []
          if (data.cmdbAssetinfo.assetAtachAttr) {
            for (let key in data.cmdbAssetinfo.assetAtachAttr) {
              tempForm.assetAtachAttrArr.push({
                name: key,
                value: data.cmdbAssetinfo.assetAtachAttr[key]
              })
            }
          }

          // 设备三级分类数据处理
          if (data.fristTypeName && data.secondTypeName && data.threeTypeName) {
            // 一二三级都存在
            tempForm.citypeName = `${data.fristTypeName}/${data.secondTypeName}/${data.threeTypeName}`
          } else if (data.fristTypeName && data.secondTypeName) {
            // 只存在一二级
            tempForm.citypeName = `${data.fristTypeName}/${data.secondTypeName}`
          }
          this.commonPropForm = Object.assign({}, this.commonPropForm, tempForm)

          /** *********** 合并数据 ******************/
          let allProperty = property.data || [];
          let arr = []
          let customObj = tempForm.assetAtachAttrArr.reduce((monitor, val) => {
            monitor[val.name] = val.value;
            return monitor;
          }, {})
          for (let obj of allProperty) {
            // 内置属性存在
            if (propertyConstructor[obj.colnumName]) {
              // 不是写死在页面中
              if (!propertyConstructor[obj.colnumName].detailFixed) {
                if (obj.colnumName === '公司名称') {
                  arr.unshift(merge({}, obj, { value: this.commonPropForm[propertyConstructor[obj.colnumName].path] }))
                } else {
                  arr.push(merge({}, obj, { value: this.commonPropForm[propertyConstructor[obj.colnumName].path] }))
                }
              }
            } else {
              arr.push(merge({}, obj, { value: customObj[obj.colnumName] }))
            }
          }
          this.openApplicationData = chunk(chunk(arr, 3), 3)
        } else {
          this.$message.error('获取数据失败，请刷新重试！')
        }
      });
    }
  }
}
</script>

<style lang="stylus">
#assetsDetailConstructor .left_val{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
