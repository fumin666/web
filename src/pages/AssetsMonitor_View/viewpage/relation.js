/*
 * @Author: 高建鹏
 * @Description:card卡片需要的业务组件
 * @Position:
 * @Date: 2019-08-23 11:25:54
 * @LastEditors: 高建鹏
 */
export var hostSystem = {
  /* 主机系统 */
  'CPU-CPU使用率': {componentId: 'lineBusiness'},
  '内存-内存使用率': {componentId: 'circlarBusiness'},
  '磁盘-磁盘使用率': {componentId: 'liquidfillBusiness'},
  '计数器-会话数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true}, // 进度条isBlue是否是蓝色就，unit是否显示单位，notext1:tagname是否没有，默认有
  '接口-接收&发送速率': {componentId: 'moreProcessBusiness', isBlue: true, unit: 'kbps'},
  '接口-接收&发送丢包率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接收&发送利用率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接口带宽': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'mbps'},
  '接口-接口带宽利用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false}
}
export var serverHardware = {
  /* 主机硬件 */
  '温度-温度值': {componentId: 'sigleProcessBusiness', isBlue: true, unit: '℃', notext1: true},
  '风扇-转速': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'RP'},
  '风扇-风扇状态': {componentId: 'statusBusiness', '正常': '../../../../static/images/assetview/fan-normal.svg', '异常': '../../../../static/images/assetview/fan-abnormal.svg', '未知': '../../../../static/images/assetview/fan-unknown.svg'},
  '温度-温度值趋势': {componentId: 'morelineBusiness', unit: '℃'},
  '风扇-转速趋势': {componentId: 'morelineBusiness', unit: 'RP'},
  '磁盘-磁盘状态': {componentId: 'statusBusiness', '正常': '../../../../static/images/assetview/disk-normal.svg', '异常': '../../../../static/images/assetview/disk-abnormal.svg', '未知': '../../../../static/images/assetview/disk-unknown.svg'}
}
export var networkDevices = {
  /* 网络设备 */
  'CPU-CPU使用率': {componentId: 'lineBusiness'},
  '内存-内存使用率': {componentId: 'circlarBusiness'},
  '接口-接收&发送速率': {componentId: 'moreProcessBusiness', isBlue: true, unit: 'kbps'},
  '接口-接收&发送丢包率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接收&发送利用率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接口带宽': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'mbps'},
  '接口-接口带宽利用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false}
}
export var dataBase = {
  /* 数据库 */
  'DB2-表空间使用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false},
  'DB2-连接统计': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true},
  'DB2-缓冲池命中率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false, notext1: true},
  'Oracle-表空间使用率': {componentId: 'circlarBusiness', isTagName: true}, // 是否第三行展示表空间使用率
  'Oracle-SGA缓冲区命中率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false, notext1: true},
  'Oracle-PGA&ASM使用率': {componentId: 'moreCirclarBusiness'},
  'MYSQL-缓存命中率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false, notext1: true},
  'MYSQL-查询缓存使用率': {componentId: 'circlarBusiness'},
  'MYSQL-缓冲区内存': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'KB', notext1: true},
  'Sqlserver-缓冲区命中率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false, notext1: true},
  'Sqlserver-空间使用率': {componentId: 'moreCirclarBusiness', isTagName: true},
  'Sqlserver-缓冲区内存': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'KB', notext1: true}
}
export var middleWare = {
  /* 中间件 */
  'Tomcat-JVM内存使用率': {componentId: 'circlarBusiness'},
  'Tomcat-请求数': {componentId: 'moreProcessBusiness', isBlue: true, unit: '/s', notext1: true, unitisinline: true},
  'Tomcat-线程数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true},
  'IIS-请求数': {componentId: 'moreProcessBusiness', isBlue: true, unit: false, notext1: true},
  'IIS-连接总数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true},
  'IIS-用户数': {componentId: 'moreProcessBusiness', isBlue: true, unit: false, notext1: true},
  'Apache-闲置线程数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true},
  'Apache-每秒请求数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: '/s', notext1: true, unitisinline: true},
  'Apache-总访问数': {componentId: 'sigleProcessBusiness', isBlue: true, unit: false, notext1: true}
}
export var terminal = {
  /* 终端 */
  '打印机-墨粉使用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false, notext1: true},
  '打印机-带宽利用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false, notext1: true},
  '打印机-缺纸状态统计': {componentId: 'statusBusiness', '正常': '../../../../static/images/assetview/pringter-normal.svg', '异常': '../../../../static/images/assetview/printer-abnormal.svg', '未知': '../../../../static/images/assetview/printer-unknown.svg'},
  '打印机-卡纸状态统计': {componentId: 'statusBusiness', '正常': '../../../../static/images/assetview/pringter-normal.svg', '异常': '../../../../static/images/assetview/printer-abnormal.svg', '未知': '../../../../static/images/assetview/printer-unknown.svg'},
  '电源-输出功率': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'W', notext1: true},
  '电源-电池容量': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false, notext1: true},
  '电源-输入': {componentId: 'moreProcessBusiness', isBlue: true, unit: ['V', 'HZ'], notext1: true},
  '电源-输出': {componentId: 'moreProcessBusiness', isBlue: true, unit: ['V', 'W'], notext1: true}
}
export var memory = {
  /* 存储 */
  'CPU-CPU使用率': {componentId: 'lineBusiness'},
  '内存-内存使用率': {componentId: 'circlarBusiness'},
  '磁盘-磁盘使用率': {componentId: 'liquidfillBusiness'},
  '磁盘-磁盘状态': {componentId: 'statusBusiness', '正常': '../../../../static/images/assetview/disk-normal.svg', '异常': '../../../../static/images/assetview/disk-abnormal.svg', '未知': '../../../../static/images/assetview/disk-unknown.svg'},
  '接口-接收&发送速率': {componentId: 'moreProcessBusiness', isBlue: true, unit: 'kbps'},
  '接口-接收&发送丢包率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接收&发送利用率': {componentId: 'moreProcessBusiness', isBlue: false, unit: false},
  '接口-接口带宽': {componentId: 'sigleProcessBusiness', isBlue: true, unit: 'mbps'},
  '接口-接口带宽利用率': {componentId: 'sigleProcessBusiness', isBlue: false, unit: false}
}