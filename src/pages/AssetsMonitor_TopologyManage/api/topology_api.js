import $axios from 'sunflower-ajax'
// let baseUrl = 'https://192.168.212.63';
// 树的数据
export const getTopologyTree = () => { return $axios.post(`/viewmanager/topoview/getTopoviewTypeTreeList`) };

// 拓扑图配置
export const getTopoviewConfig = data => { return $axios.post(`/viewmanager/topoview/getTopoviewConfig`, data).then(res => res.data) };

// 拓扑图内容数据
export const getTopoview = params => { return $axios.get(`/viewmanager/topoview/getTopoview/` + params.subTopoId + '/' + params.showapp) };

// 获取所有资产的授权情况
export const getOperationItcomp = () => { return $axios.get('/resourcemanager/assetmanager/itasset/getAllUserOperationItcomp').then(({data}) => data) }

// 拓扑图实时信息
export const getViewInfo = params => { return $axios.post(`/viewmanager/topoview/getTopoviewShowByTopoviewInfoUuid/` + params.subTopoId + '/' + params.showapp + '/' + params.realtime) };

// 保存拓扑
export const saveOrUpdateTopoview = params => { return $axios.post('/viewmanager/topoview/saveOrUpdateTopoview', params).then(res => res.data) };

// 添加节点
export const addCells = (urlTail, params) => { return $axios.post('/viewmanager/topoview/' + urlTail, params).then(res => res.data) };

// 获取资产接口
export const getDeviceInterface = (uuid) => { return $axios.post(`/monitorConfigitem/getInterfaceByItcompUuid/` + uuid).then(res => res.data) };

// 批量删除连线
export const deleteLineList = (type, params) => { return $axios.post('/viewmanager/topoview/deleteLineList/' + type, params).then(res => res.data) };

// 和线路信息选项卡不是同一个接口，这个默认删除所有的拓扑
export const delTopoviewLink = (params) => { return $axios.post('/viewmanager/topoLink/delTopoviewLink', params).then(res => res.data) };

// 批量删除节点
export const deleteNodeList = (params) => { return $axios.post('/viewmanager/topoview/deleteNodeList', params).then(res => res.data) };

// 删除区域
export const deleteDomain = (uuid) => { return $axios.post('/viewmanager/topoview/deleteDomain/' + uuid).then(res => res.data) };

// 通过uuid获取连线信息
export const getTopoviewLineDetail = (uuid) => { return $axios.get('/viewmanager/topoview/getTopoviewLineDetail/' + uuid).then(res => res.data) };

// 通过uuid获取资产节点信息
export const getTopoviewNodeDetail = (uuid) => { return $axios.get('/viewmanager/topoview/getTopoviewNodeDetail/' + uuid).then(res => res.data) };

// 更新拓扑的配置项（如轮训周期、是否显示应用节点）
export const updateTopoviewConfig = (params) => { return $axios.post('/viewmanager/topoview/updateTopoviewConfig', params).then(res => res.data) };

// 事件信息列表
export const getIncidentList = (params) => { return $axios.post(`/incidentCount/getIncidentCountByTopoviewInfoUuid`, params).then(res => res.data) };
// 批量删除事件
export const deleteIncident = (params) => { return $axios.post('/incidentInfo/deleteIncidentByIncidetnCountUuidList', params).then(res => res.data) };

// 资产信息列表(type的含义： 4:所有资产，3:线路选项卡可连线的资产，2:拖拽选项卡的资产，1:已经在当前拓扑中的资产(连线、资产选项卡使用)，0:不在当前拓扑中的资产(资产选项卡新增使用))
export const getMonitorItcompList = (params, type) => { return $axios.post('/monitorItcomp/getMonitorItcompByTopoviewInfoUuid/' + params.subTopoId + '/' + type).then(res => res.data) };
// 批量删除资产
export const deleteTopviewItcomp = (subTopoId, params) => { return $axios.post('/viewmanager/topoview/deleteTopviewItcomp/' + subTopoId, params).then(res => res.data) }
// 添加资产
export const saveTopviewItcomp = (subTopoId, params) => { return $axios.post('/viewmanager/topoview/saveTopviewItcomp/' + subTopoId, params).then(res => res.data) }
// 获取线路列表
export const getTopoviewLinkList = (params) => { return $axios.post('/viewmanager/topoLink/getTopoviewLinkByTopoviewInfoUuid/' + params.subTopoId + '/' + params.showapp).then(res => res.data) };

// 获取全部线路列表
export const getAllTopoviewLink = () => { return $axios.post('/viewmanager/topoLink/getAllTopoviewLink').then(res => res.data) };
// 获取线路详情
export const getTopoviewLineDetailShowByLinkUuid = (uuid) => { return $axios.post('/viewmanager/topoLink/getTopoviewLineDetailShowByLinkUuid/' + uuid).then(res => res.data) };
// 线路选项卡添加线路(type: 1表示所有拓扑，2表示当前拓扑)
export const addTopoviewLink = (param, type) => { return $axios.post(`/viewmanager/topoview/addLine/${type}`, param) };
// 链路管理添加线路
export const addTopoviewLine = (param) => { return $axios.post(`/viewmanager/topoLink/saveTopoviewLink`, param) };
// 更新线路
export const updateTopoviewLink = (param) => { return $axios.post(`/viewmanager/topoLink/uptTopoviewLink`, param) };

// 拓扑导出接口
export const exportTopology = () => { return $axios.basePath() + '/topologyExport' };

// 统计页面接口
// 概况信息
export const countTopoviewNodeAndLine = (subTopoId) => { return $axios.post('/viewmanager/topoview/countTopoviewNodeAndLine/' + subTopoId + '/1').then(res => res.data) };
// 统计环图数据
export const countTopoviewItcompByCitypecategory = (subTopoId) => { return $axios.post('/viewmanager/topoview/countTopoviewItcompByCitypecategory/' + subTopoId + '/1').then(res => res.data) };
// 组件监控
export const countTopoviewItcompByStatus = (subTopoId) => { return $axios.post('/viewmanager/topoview/countTopoviewItcompByStatus/' + subTopoId + '/1').then(res => res.data) };
// 事件级别
export const countTopoviewByDateAndLevel = (subTopoId, dateFlag) => { return $axios.post('/viewmanager/topoview/countTopoviewByDateAndLevel/' + subTopoId + '/1' + '/' + dateFlag).then(res => res.data) };
// 事件top10
export const countTopoviewItcompByIncidentAssetCount = (subTopoId) => { return $axios.post('/viewmanager/topoview/countTopoviewItcompByIncidentAssetCount/' + subTopoId + '/1' + '/0').then(res => res.data) };

// 执行ping命令
export const getPingResult = (ipObj) => { return $axios.post('/viewmanager/Topology/getPingResult', ipObj).then(res => res.data) };
// 执行Trace命令
export const getTraceResult = (ipObj) => { return $axios.post('/viewmanager/Topology/getTraceResult', ipObj).then(res => res.data) };
// 执行remote ping 命令
export const remotePing = (dataObj) => { return $axios.post('/viewmanager/Topology/remotePing', dataObj).then(res => res.data) };
// 上传图标接口
export const uploadTopologyIco = () => { return $axios.basePath() + '/viewmanager/topoview/uploadTopologyIco' };
// 上传拓扑背景接口
export const uploadForTopologyBg = () => { return $axios.basePath() + '/UploadForTopologyBg' };
// 拓扑发现
export const startScanTopo = (param) => { return $axios.get('/viewmanager/Topology/scanTopology/' + param); };
export const scanTopo = () => { return $axios.get('/resourcemanager/discovery/getTopoScanMsg') };

// 保存拓扑图
export const saveTopo = (param) => { return $axios.post(`/viewmanager/topoview/saveTopoviewInfo`, param) };
// 保存拓扑类别
export const saveTopoType = (param) => { return $axios.post(`/viewmanager/topoview/saveTopoviewType`, param) };
// 拓扑树节点重命名
export const renameTopo = (param) => { return $axios.post(`/viewmanager/topoview/updateTopoviewInfo`, param) };
// 拓扑类别重命名
export const renameTopoType = (param) => { return $axios.post(`/viewmanager/topoview/updateTopoviewType`, param) };
// 删除拓扑图
export const delTopo = (param) => { return $axios.get(`/viewmanager/topoview/deleteTopoviewInfo/${param}`) };
// 删除拓扑类别
export const delTopoType = (param) => { return $axios.get(`/viewmanager/topoview/deleteTopoviewType/${param}`) };

// 获取资产的端口
export const axiosGetDevicePort = (param) => { return $axios.get(`/monitorConfigitem/getInterfaceByItcompUuid/${param}`) };

// 划归拓扑
export const applyTopolink = (param) => { return $axios.post(`/viewmanager/topoLink/applyTopolinkToTopoviewInfo`, param) };

