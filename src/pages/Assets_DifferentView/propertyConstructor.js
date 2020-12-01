// function getPathVal(obj, path) {
//   let SEP = /^([^\.\[\]]+)|(?:\[)([^\.\[\]]+)(?:\])|(?:\.)([^\.\[\]]+)/g;
//   let tmp;
//   // eslint-disable-next-line no-cond-assign
//   while (tmp = SEP.exec(path)) {
//     for (var i = 1; i < tmp.length; ++i) {
//       var prop = tmp[i];
//       if (prop != null) {
//         if (prop in obj) {
//             obj = obj[prop];
//             break;
//         } else {
//           return null;
//         }
//       }
//     }
//   }
//   return obj;
// }
export default {
  '资产名称': {detailFixed: true, path: 'itcompName'},
  'IP地址': {detailFixed: true, path: 'controlAdderss'},
  '资产分类': {detailFixed: true, path: 'citypeName'},
  '厂商': {detailFixed: true, path: 'manufactCaption'},
  '型号': {detailFixed: true, path: 'productCaption'},
  '资产状态': {detailFixed: true, path: 'assetStatusName'},
  '配置管理员机构': {detailFixed: true, path: 'operationOrgName'},
  '配置管理员': {detailFixed: true, path: 'maintenanceStaffName'},
  '公司名称': {path: 'firmName'},
  '使用部门': {detailFixed: true, path: 'useDepartName'},
  '资产描述': {detailFixed: true, path: 'descr'},
  '资产重要程度': {path: 'important'},
  '是否禁ping': {path: 'isForbidPing'},
  '所在机柜': {path: 'atCabinetNumber'},
  '面板': {path: 'panel'},
  '尺寸': {path: 'uAmount'},
  '资产编码': {path: 'ciCode'},
  '序列号': {path: 'assetSeries'},
  '维护人': {path: 'takeUserName'},
  '服务方式': {path: 'serviceMode'},
  '环境类型': {path: 'environment'},
  'CPU型号': {path: 'CPUXH'},
  '光驱': {path: 'driver'},
  '显示器': {path: 'XIANSHIQI'},
  '内存(MB)': {path: 'memory'},
  '磁盘(MB)': {path: 'HARDDISKRL'},
  '价格(RMB)': {path: 'orderingCost'},
  '购买日期': {path: 'purchaseDate'},
  '服务到期日': {path: 'guaranteeDate'},
  '关联合同号': {path: 'contract'}
}
