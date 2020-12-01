/*
 * @Author: 高建鹏
 * @Version: //Q4资产添加/编辑
 * @Description:非默认内置属性（可以关闭应用）
 * @Position:资产列表-》添加/编辑
 * @Date: 2019-11-12 14:52:22
 * @LastEditors: mybells
 */
/* 非默认内置属性（可以关闭应用） item.switchStatus===0 && item.defaultStatus===1 */
let noDefaultConstructor = {
  '资产重要程度': {path: 'monitorItcomp.important', type: 'udf_char_list'},
  '是否禁ping': {path: 'monitorItcomp.isForbidPing', type: 'udf_char_list'},
  '所在机柜': {path: 'monitorItcomp.atCabinetNumber', type: 'udf_char_single_line'},
  '面板': {path: 'monitorItcomp.panel', type: 'udf_char_single_line'},
  '尺寸': {path: 'monitorItcomp.uAmount', type: 'udf_long'},
  '资产编码': {path: 'monitorItcomp.ciCode', type: 'udf_char_single_line'},
  '序列号': {path: 'monitorItcomp.cmdbAssetinfo.assetSeries', type: 'udf_char_single_line'},
  '维护人': {path: 'monitorItcomp.takeUser', type: 'udf_char_list'},
  '服务方式': {path: 'monitorItcomp.cmdbAssetinfo.serviceMode', type: 'udf_char_single_line'},
  '环境类型': {path: 'monitorItcomp.cmdbAssetinfo.environment', type: 'udf_char_list'},
  'CPU型号': {path: 'monitorItcomp.itcompServerProcessorList[0].cpuModle', type: 'udf_char_single_line'},
  '光驱': {path: 'monitorItcomp.cmdbAssetinfo.driver', type: 'udf_char_single_line'},
  '显示器': {path: 'monitorItcomp.itcompServerPeripheralList[0].manufacturerName', type: 'udf_char_single_line'},
  '内存(MB)': {path: 'monitorItcomp.memory', type: 'udf_long'},
  '磁盘(MB)': {path: 'monitorItcomp.itcompServerHarddiskList[0].capacity', type: 'udf_long'},
  '价格(RMB)': {path: 'monitorItcomp.cmdbAssetinfo.orderingCost', type: 'udf_long'},
  '购买日期': {path: 'monitorItcomp.cmdbAssetinfo.purchaseDate', type: 'udf_date'},
  '服务到期日': {path: 'monitorItcomp.cmdbAssetinfo.guaranteeDate', type: 'udf_date'},
  '关联合同号': {path: 'monitorItcomp.cmdbAssetinfo.contract', type: 'udf_char_single_line'}
}
let constructor = {
  itcompName: '资产名称',
  controlAdderss: 'IP地址',
  citypeUuid: '资产分类',
  descr: '资产描述',
  manufactUuid: '厂商',
  productUuid: '型号',
  assetStatus: '资产状态',
  operationOrguuid: '配置管理员机构',
  maintenanceStaffuuid: '配置管理员',
  firmUuid: '公司名称',
  cmdbOrguuid: '使用部门',
  important: '资产重要程度',
  isForbidPing: '是否禁ping',
  atCabinetNumber: '所在机柜',
  panel: '面板',
  uAmount: '尺寸',
  ciCode: '资产编码',
  assetSeries: '序列号',
  takeUser: '维护人',
  serviceMode: '服务方式',
  environment: '环境类型',
  cpuModle: 'CPU型号',
  driver: '光驱',
  manufacturerName: '显示器',
  memory: '内存(MB)',
  capacity: '磁盘(MB)',
  orderingCost: '价格(RMB)',
  purchaseDate: '购买日期',
  guaranteeDate: '服务到期日',
  contract: '关联合同号'
}
export {noDefaultConstructor, constructor}
