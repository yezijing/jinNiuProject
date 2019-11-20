import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// --------------- 经济指标 ----------------------
// 新增
// export const addEconomic = (params, callback) => { return axios.post('/ll/addEconomic', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const addEconomic = (params, callback, errorback) => { return axios.post('/ll/addEconomic', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 查询所有
export const allIndexlist = (params, callback) => { return axios.get('/ll/searchs', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 根据ID查询
export const indexById = (params, callback) => { return axios.post('/ll/searchById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 编辑
// export const editIndex = (params, callback) => { return axios.post('/ll/updateEconomic', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const editIndex = (params, callback, errorback) => { return axios.post('/ll/updateEconomic', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 根据时间查询
export const yearIndexlist = (params, callback) => { return axios.get('/ll/searchByYear', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 搜索查询
export const getFilterIndexlist = (params, callback) => { return axios.post('/ll/searchFilterPage', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 手动修改材料报送状态
export const changeFormState = (params, callback) => { return axios.post('/ll/updateFormstatusById', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 修改总体进度
export const changeTotalState = (params, callback) => { return axios.post('/ll/updateTotalstatusById', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 承办单位指标管理
export const getDistrictIndexlist = (params, callback) => { return axios.post('/cc/searchFilterPage', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 根据ID查询
export const indexByIdDistrict = (params, callback) => { return axios.post('/cc/searchById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 新增
// export const adddDistrictEconomic = (params, callback) => { return axios.post('/cc/addEconomicDept', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const adddDistrictEconomic = (params, callback, errorback) => { return axios.post('/cc/addEconomicDept', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 编辑
// export const editIndexDistrict = (params, callback) => { return axios.post('/cc/updateEconomicDept', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const editIndexDistrict = (params, callback, errorback) => { return axios.post('/cc/updateEconomicDept', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 查询所有
export const getAllCheng = (params, callback) => { return axios.get('/cc/searchs', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 手动修改材料报送状态
export const changeChengFormState = (params, callback) => { return axios.post('/cc/updateFormstatusById', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 修改总体进度
export const changeChengTotalState = (params, callback) => { return axios.post('/cc/updateTotalstatusById', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// ---------------- 区(市)县管理 ------------------
// 新增
export const addDistrict = (params, callback) => { return axios.post('/targetDistrict/addDistrict', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 查询所有
export const allArealist = (params, callback) => { return axios.get('/targetDistrict/searchs', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 根据ID查询
export const areaById = (params, callback) => { return axios.get('/targetDistrict/searchById', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 查询类别列表
export const typelist = (params, callback) => { return axios.get('/Type/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 编辑
export const editDistrict = (params, callback) => { return axios.post('/targetDistrict/updateDistrict', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 新增类别
export const addTypes = (params, callback) => { return axios.post('/Type/addType', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 搜索查询
export const getFilterArea = (params, callback) => { return axios.post('/targetDistrict/searchPage', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// ----------------------------- 其他区县管理 -------------------
// 新增
export const addOtherfill = (params, callback) => { return axios.post('/OtherEconomic/addOEconomic', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 查询所有
export const getAllOtherfill = (params, callback) => { return axios.get('/OtherEconomic/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 搜索查询
export const getFilterOtherfill = (params, callback) => { return axios.get('/OtherEconomic/searchFilterPage', { params }).then((data) => { callback(data) }).catch(function () { }) }

// 争先工作
// 汇总表
export const getCountAll = (params, callback) => { return axios.post('/targetPrize/countPrizePage', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 填报列表
export const getAllHonor = (params, callback) => { return axios.post('/targetPrize/searchPageFilter', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 填报新增
export const addFillHonor = (params, callback) => { return axios.post('/targetPrize/addTargetPrize', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 填报编辑
export const editFillHonor = (params, callback) => { return axios.post('/targetPrize/updateTargetPrize', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 非经济指标
// 进展汇总表
export const getmicList = (params, callback) => { return axios.get('/mic/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 进展汇总表 - 新增
export const addSummary = (params, callback) => { return axios.post('/mic/addNoneconomic', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 修改
export const editSummary = (params, callback) => { return axios.post('/mic/updateNoneconomic', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 根据ID查询
export const summarylistId = (params, callback) => { return axios.get('/mic/searchById', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 新增进展汇报
export const addSummartReport = (params, callback) => { return axios.post('/ort/addReport', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 添加承办单位
export const adddutyReport = (params, callback) => { return axios.post('/zer/addOrganizer', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 目标责任分解表
export const aimListall = (params, callback) => { return axios.get('/mic/searchAim', { params }).then((data) => { callback(data) }).catch(function () { }) }
