/**
 * 资产管理列表api
 * Created by dgunzi on 2019/05/16.
 */
import $axios from 'sunflower-ajax'

// 搜索栏资产类型选项
export const getCitypeTree = () => { return $axios.get(`/resourcemanager/configurationmanage/citype/getCitypeTree`) };

// 资产左侧列表树
export const getCountCitypeTree = () => { return $axios.get('/resourcemanager/configurationmanage/citype/getCountCitypeTree') };

// 资产列表数据
export const getItassetlisAutoView = (params) => { return $axios.post('/assetDynamicColnum/getAssetListData', params) };

// 资产批量删除
export const assetBatchDelete = (params, logParams) => { return $axios.post('/resourcemanager/assetmanager/itasset/assetBatchDelete', params, logParams) };

// 开启/关闭资产日志审计
export const assetBatchAudit = (params, logTemplate) => { return $axios.post('/resourcemanager/assetmanager/itasset/assetBatchAudit', params, logTemplate) };

// 批量导出
export const exportAssetParams = (params, logTemplate) => { return $axios.post('/resourcemanager/assetmanager/itasset/exportAssetFirst', params, logTemplate) };

// 设置为配置基准
export const addBaseline = (params, logTemplate) => { return $axios.post('/baseline/addBaseline', params, logTemplate) };

// 编辑资产账号信息
export const editAssetsAccountInfo = (params, logParams) => { return $axios.post('/assetsAccountInfo/editAssetsAccountInfo', params, logParams) };

// 新增资产账号信息
export const saveAssetsAccountInfo = (params, logParams) => { return $axios.post('/assetsAccountInfo/saveAssetsAccountInfo', params, logParams) };

// 获取资产状态/配置管理员机构下拉选项
export const findAddSelect = () => { return $axios.get('/resourcemanager/assetmanager/itasset/findAddSelect') };

// 获取当前配置管理员机构下的配置管理员信息
export const viewDepartIncludeUsers = (params) => { return $axios.post(`/departmentInfo/viewDepartIncludeUsers`, params) };

// 获取公司名称下拉选项
export const getAllCompanyList = () => { return $axios.get('/itilWorkflowConfig/getAllCompanyList') };

// 获取公司内所有组织机构
export const getAllOrganizationByCompanyUuid = (companyUuid) => { return $axios.get(`/departmentInfo/getAllOrganizationByCompanyUuid/${companyUuid}`) };

// 批量更新资产
export const batchUpdateMontior = (params, logParams) => { return $axios.post('/resourcemanager/assetmanager/itasset/batchUpdateMontior', params, logParams) };

// 获取资产详情
export const getitAsset = (assetUuid) => { return $axios.get(`/resourcemanager/assetmanager/itasset/getitAsset/${assetUuid}`) };

