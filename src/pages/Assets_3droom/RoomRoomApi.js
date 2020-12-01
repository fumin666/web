/**
 * 3D机房api
 * Created by dgunzi on 2019/08/20.
 */
import $axios from 'sunflower-ajax'

// 机房列表
export const getAssetRoomList = () => { return $axios.get(`/threeDimensionalAssetRoom/getAssetRoomList`) };

// 机房详情
export const getThreeDAssetRoomByUuid = (roomUuid) => { return $axios.get(`/threeDimensionalAssetRoom/getThreeDAssetRoomByUuid/${roomUuid}`) };

// 删除一个机房
export const removeAssetRoom = (roomUuid) => { return $axios.get(`/threeDimensionalAssetRoom/removeAssetRoom/${roomUuid}`) };

// 新建机房
export const addAssetRoom = (param) => { return $axios.post(`/threeDimensionalAssetRoom/addAssetRoom`, param) };

// 编辑机房
export const modifyAssetRoom = (param) => { return $axios.post(`/threeDimensionalAssetRoom/modifyAssetRoom`, param) };

// 检查房间名称唯一
export const checkRoomNameUnique = (param) => { return $axios.post(`/threeDimensionalAssetRoom/checkRoomNameUnique`, param) };

// 获得机柜列表
export const getThreeDCabinet = () => { return $axios.get(`/threeDimensionalAssetRoom/getThreeDCabinet`) };

// 从资产处取得允许添加到3D机柜的几种资产
export const getThreeDAssets = () => { return $axios.get(`/threeDimensionalAssetRoom/getThreeDAssets`) };

// 机柜利用率/机柜详情
export const cabinetUtilizationRate = (cabinetUuid) => { return $axios.get(`/threeDimensionalAssetRoom/cabinetUtilizationRate/${cabinetUuid}`) };

// 保存资产到机柜
export const saveAssetsToCabinet = (param) => { return $axios.post(`/threeDimensionalAssetRoom/saveAssetsToCabinet`, param) };

// 所有机柜利用情况
export const roomUtilizationRate = (roomUuid) => { return $axios.get(`/threeDimensionalAssetRoom/roomUtilizationRate/${roomUuid}`); };

