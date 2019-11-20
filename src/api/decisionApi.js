import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 决策督查新增提交
export const addThreePlan = (params, callback) => { return axios.post('/threeWork/addThreeWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }

// 年度新增
export const addYear = (params, callback) => { return axios.post('/threeYear/addThreeYear', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 年度查询
export const getYear = (params, callback) => { return axios.get('/threeYear/searchAll', { params }).then((data) => { callback(data) }) }
// 大项新增
export const addBigterm = (params, callback) => { return axios.post('/threeBigterm/addThreeBigterm', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 大项列表
export const bigTermList = (params, callback) => { return axios.get('/threeBigterm/searchByYearId', { params }).then((data) => { callback(data) }) }
// 小项新增
export const addMinterm = (params, callback) => { return axios.post('/threeMinterm/addThreeMinterm', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 小项列表
export const bigMinList = (params, callback) => { return axios.get('/threeMinterm/searchByYidAndBid', { params }).then((data) => { callback(data) }) }

// 编辑
export const editThreePlan = (params, callback) => { return axios.post('/threeWork/updateThreeWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }

// 督查单位新增
export const addSeer = (params, callback, errorback) => { return axios.post('/ThreeSuperviseDept/addThreeSuperviseDept', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 督查单位查询列表
export const seerList = (params, callback) => { return axios.get('/ThreeSuperviseDept/searchAll', { params }).then((data) => { callback(data) }) }
// 三级工作列表
export const threeworkList = (params, callback, errorback) => { return axios.post('/threePartterm/searchByYidAndBidAndMid', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增三级工作
export const addThreework = (params, callback, errorback) => { return axios.post('/threePartterm/addThreePartterm', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 决策督查列表
export const threePlanList = (params, callback, errorback) => { return axios.post('/threeWork/searchPageList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 决策督查详情
export const threePlanDetail = (params, callback, errorback) => { return axios.post('/threeWork/searchDetail', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 修改总体状态
export const changeTotalstate = (params, callback, errorback) => { return axios.post('/threeWork/updateTotalStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 进展汇报
export const addPlanReport = (params, callback, errorback) => { return axios.post('/threeReport/addThreeReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重复填报校验
export const repeatReport = (params, callback, errorback) => { return axios.post('/threeReport/repetCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 三年行动计划报送历史
export const reportPlanHistory = (params, callback, errorback) => { return axios.post('/threeReport/searchThreeReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 新增修改调用
export const changeCheckFormstate = (params, callback) => { return axios.post('/threeWork/changeThreeWorkFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const synchFormstate = (params, callback) => { return axios.post('/threeWork/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 详情调用
export const getStatusForm = (params, callback, errorback) => { return axios.post('/threeRule/updateStatusById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 删除
export const deletePlan = (params, callback, errorback) => { return axios.post('/threeWork/deleteById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 三年行动计划获取
export const getAllPlanlist = (params, callback, errorback) => { return axios.post('/threeWork/searchAll', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批量设置规则校验
export const checkPlanReportRules = (params, callback, errorback) => { return axios.post('/threeWork/checkRules', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增显示上次进展情况
export const showThreeplanLasttime = (params, callback, errorback) => { return axios.post('/threeReport/findLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 详情查看上次进展情况
export const lasttimeProgress = (params, callback, errorback) => { return axios.post('/threeWork/lastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// ================== 重点工作 ===============
// 大项新增
export const addImportFirstTerm = (params, callback) => { return axios.post('/KeypointFirst/addPointFirst', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 大项列表
export const importWorkFirstList = (params, callback) => { return axios.post('/KeypointFirst/searchByYearId', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 小项新增
export const addImportWorkMinterm = (params, callback) => { return axios.post('/keypointSecond/addKeypointSecond', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 小项列表
export const importWorkBigMinList = (params, callback) => { return axios.post('/keypointSecond/searchByYidAndBid', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 新增
export const addImportWorkData = (params, callback) => { return axios.post('/keypointWork/addKeypointWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 查询所有
export const importWorkListData = (params, callback, errorback) => { return axios.post('/keypointWork/searchPageList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情
export const importWorkDetailData = (params, callback, errorback) => { return axios.post('/keypointWork/searchDetail', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情之前调用
export const getStatusFormImportwork = (params, callback, errorback) => { return axios.post('/KeypointRule/updateStatusById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情查看上次进展情况
export const lasttimeProgressImportwork = (params, callback, errorback) => { return axios.post('/keypointWork/getLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 修改
export const editImportWorkData = (params, callback) => { return axios.post('/keypointWork/updateKeypointWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 新增修改调用
export const changeCheckFormstateImportwork = (params, callback) => { return axios.post('/keypointWork/changeThreeWorkFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const synchFormstateImportwork = (params, callback) => { return axios.post('/keypointWork/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 报送历史
export const importWorkReportList = (params, callback, errorback) => { return axios.post('/KeypointReport/searchThreeReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 修改总体状态
export const changeTotalstateImportwork = (params, callback, errorback) => { return axios.post('/keypointWork/updateTotalStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 删除
export const deleteImportWork = (params, callback, errorback) => { return axios.post('/keypointWork/deleteById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 进展填报
export const addImportworkReport = (params, callback, errorback) => { return axios.post('/KeypointReport/addKeypointReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重复填报校验
export const repeatReportImportwork = (params, callback, errorback) => { return axios.post('/KeypointReport/repetCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增显示上次进展情况
export const showImportworkLasttime = (params, callback, errorback) => { return axios.post('/KeypointReport/findLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取所有数据
export const getAllImportworkList = (params, callback) => { return axios.get('/keypointWork/searchAll', { params }).then((data) => { callback(data) }) }
// 批量设置规则校验
export const checkImportworkReportRules = (params, callback, errorback) => { return axios.post('/keypointWork/checkRules', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
