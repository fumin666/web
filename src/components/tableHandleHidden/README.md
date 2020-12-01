### **此文件是为了说明操作栏显示与隐藏组件的用法**
### **功能**
实现了大于三个图标时，多余的隐藏，点击三个点图标时切换显示与隐藏。

### **实现**
将原来写死的视图改为数据，通过判断每条数据对象中的条件判断操作栏是否包含该操作图标。然后通过数据来渲染操作按钮。大于三个时多余的隐藏。显示样式利用Popper UI组件实现。

### **用法**
1. 此组件接收三个props：btnData(操作按钮数据对象数组)、scope(table上的scope对象)、option配置项
```js
//默认props:
btnData:[]，
option:{
  isHidden:true,//是否开启操作栏隐藏设置，默认开启
  showNum:3//如果isHidden为true时，个数大于3就会隐藏，默认是3
  appendId: '.s-table',//将浮动栏添加到对应id或者class节点中。或者.xxx。传空字符串是添加到body中。
  trigger: 'click',//触发方式，传值可查看Popper UI组件trigger属性
  placement: 'left'//方向，传值可查看Popper UI组件placement属性
}
```
1. btnData数组中的对象接收5个属性：
```js
{
  icon: 'edit',//图标icon 必填 String
  name: '编辑',//图标title 必填 String
  handler: function (row, scope) {},//图标点击操作方法,返回两个参数行数据和scope数据 必填 Function
  v_if: function (row, scope) {}//图标是否被操作栏包含条件方法,返回两个参数行数据和scope数据,返回值为true就被包含，false不会被包含 非必填 Function
  v_noBtn: 'assetsManage_accountManage'//图标是否被操作栏包含条件字符串
},
```
其中v_if和v_noBtn只要有一个返回值为false当前行操作栏中就不包含。

### **实例**
此处实例代码位置为@/src/pages/Assets_AssetList/AssetList.vue资产管理列表。可以在首页 /资产管理 /资产管理列表处在table操作栏查看具体效果。
```html
<s-table>
  <s-table-column label="操作" fixed="right">
    <template slot-scope="scope">
      <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
    </template>
  </s-table-column>
</s-table>
<script>
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  export default {
    components: {
      buttonSet
    }
    data() {
      return {
        tableOption: {
          isHidden: true,
          showNum: 3,
          appendId: '#realpagetable_1',
          trigger: 'click',
          placement: 'left'
        }
      }
    },
    methods: {
      btnData() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看资产详情',
            v_noBtn: 'assetsManage_viewAsset',
            handler: function (row, scope) {
              vm.gotoAssetDetail(row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            handler: function (row, scope) {
              vm.curUuid = scope.row.uuid;
              vm.$router.push(`assets_list/assetEdit/${vm.curUuid}/0`);
            },
            v_if: function (row, scope) {
              return vm.isConfigAdminCheck(scope.row.monitorItcomp) || vm.judgeRoleBtn('assetsManage_editAsset')
            }
          },
          {
            icon: 'delete',
            title: '删除',
            v_noBtn: 'assetsManage_delAsset',
            handler: function (row, scope) {
              let newData = [];
              newData.push(scope.row);
              vm.axiosDelAssets([scope.row.uuid], newData);
            }
          },
          {
            icon: 'asset-add',
            name: '账号管理',
            v_noBtn: 'assetsManage_accountManage',
            handler: function (row, scope) {
              vm.assetUuid = scope.row.uuid;
              vm.curAsset = scope.row;
              vm.accountDialogFlag = true
            }
          },
          {
            icon: 'protocol-add',
            name: '协议设置',
            v_noBtn: 'assetsManage_assetListAgreementSet',
            handler: function (row, scope) {
              vm.assetUuid = scope.row.uuid;
              vm.curAsset = scope.row;
              vm.protocolDialogFlag = true
            }
          },
          {
            icon: 'order',
            name: '查看关联人员',
            v_noBtn: 'assetsManage_viewAssociatedUser',
            handler: function (row, scope) {
              vm.assetUuid = row.uuid;
              vm.$message.warning('此功能正在开发中...')
              // vm.checkRelationDialog = true
            }
          },
          {
            icon: 'seal',
            name: '资产账号稽核',
            v_noBtn: 'assetsManage_assetAccountCollect',
            handler: function (row, scope) {
              vm.auditAssets = [scope.row];
              vm.checkDialogFlag = true;
            }
          },
          {
            icon: 'line',
            name: '查看关系图',
            v_noBtn: 'assetsManage_viewRelation',
            handler: function (row, scope) {
              vm.$router.push(`/AssetsAll/assets_list/relationalGraph/${scope.row.uuid}`)
            }
          },
          {
            icon: 'info',
            name: '查看配置基准',
            v_noBtn: 'assetsManage_viewConfStandard',
            handler: function (row, scope) {
              vm.$router.push(`/AssetsAll/assets_list/configuration_baseline/${scope.row.uuid}`)
            }
          },
          {
            icon: 'qr-code',
            title: '查看二维码',
            v_noBtn: 'assetsManage_qrCode',
            handler: function (row, scope) {
              vm.curAsset = scope.row;
              vm.qrCordDialogFlag = true;
            }
          }
        ]
      }
    }
  }
</script>
```