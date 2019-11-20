import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// ----------- 重大项目 start ------
// 新增
export const addKeyItem = (params, callback) => { return axios.post('/yy/addSituation', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 编辑
export const editKeyItem = (params, callback) => { return axios.post('/yy/updateSituation', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 列表
export const keyworkList = (params, callback, errorback) => { return axios.post('/yy/searchFilterPage', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情
export const keyitemDetail = (params, callback, errorback) => { return axios.post('/yy/searchById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 进展填报
export const addPlanReport = (params, callback, errorback) => { return axios.post('/situationProgress/situationProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重复报送校验
export const repeatItemReport = (params, callback, errorback) => { return axios.post('/situationProgress/repetByCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增
export const addItemReport = (params, callback, errorback) => { return axios.post('/situationProgress/addDecisionIAreaReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 修改总体进度状态
export const changeTotalstateItem = (params, callback, errorback) => { return axios.post('/yy/updateTotalstatusById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取所有重大项目数据
export const getAllKeyitem = (params, callback) => { return axios.get('/yy/getWorkName', { params }).then((data) => { callback(data) }) }
// 删除
export const deleteKeyitem = (params, callback, errorback) => { return axios.post('/yy/delSituation', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const changeKeyitemFormstate = (params, callback, errorback) => { return axios.post('/yy/changeFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const synchKeyitemFormstate = (params, callback, errorback) => { return axios.post('/yy/getFilterWarnMessageList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const lastKeyitemProgress = (params, callback, errorback) => { return axios.post('/yy/getLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 报送历史
export const reportKeyItemHistory = (params, callback, errorback) => { return axios.post('/situationProgress/getReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情查看上次进展情况
export const lasttimeKeyitemProgress = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/areaLastReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// ----------- 重大项目 end ------

// ===============重要片区===================
// 重要片区
export const keyAreaList = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/getFilterList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要片区详情
export const keyAreaDetail = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/getInfoByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要片区重复报送
export const repeatReportKeyarea = (params, callback, errorback) => { return axios.post('/tripleAreaProgressReport/repetByCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要片区进展汇报
export const addKeyareaReport = (params, callback, errorback) => { return axios.post('/tripleAreaProgressReport/addTripleAreaProgressReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 修改总体进度
export const changeTotalstateKeyarea = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/updateTotalStatusByHand', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 删除
export const deleteKeyarea = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/deleteTripleAreaProgressById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增
export const addKeyArea = (params, callback) => { return axios.post('/tripleAreaProgress/addTripleAreaProgress', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 编辑
export const editKeyArea = (params, callback) => { return axios.post('/tripleAreaProgress/updateTripleAreaProgressWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 报送历史
export const historyKeyArea = (params, callback, errorback) => { return axios.post('/tripleAreaProgressReport/getTripleAreaProgressReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取所有重要片区数据
export const getAllKeyarea = (params, callback) => { return axios.get('/tripleAreaProgress/getWorkName', { params }).then((data) => { callback(data) }) }
export const changeKeyareaFormstate = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/updateTripleAreaProgressFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const synchKeyareaFormstate = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/updateFormStatusByMaxDeptStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 获取上次进展填报内容
export const showKeyareaLastReport = (params, callback, errorback) => { return axios.post('/tripleAreaProgressReport/getAreaLastReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情查看上次进展情况
export const lasttimeKeyareaProgress = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/areaLastReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// ===============重要片区 end ===================

// ============ 重要工作 ==========================
// 新增
export const addKeyWork = (params, callback) => { return axios.post('/tripleWorkProgress/addTripleWorkProgress', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 一级任务列表
export const oneLevelList = (params, callback) => { return axios.get('/tripleWorkProgress/getAllNodePlan', { params }).then((data) => { callback(data) }) }
// 重点工作列表
export const keyLevelList = (params, callback) => { return axios.get('/tripleWorkProgress/getAllWorkName', { params }).then((data) => { callback(data) }) }
// 重要工作列表
export const keyWorkList = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/getFilterList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要工作详情
export const keyWorkDetail = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/getInfoByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要工作重复报送
export const repeatReportKeywork = (params, callback, errorback) => { return axios.post('/tripleWorkProgressReport/repetByCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要工作进展汇报
export const addKeyworkReport = (params, callback, errorback) => { return axios.post('/tripleWorkProgressReport/addTripleWorkProgressReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 修改总体进度
export const changeTotalstateKeywork = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/updateTotalStatusByHand', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 删除
export const deleteKeywork = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/deleteTripleWorkProgressById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 编辑
export const editKeywork = (params, callback) => { return axios.post('/tripleWorkProgress/updateTripleWorkProgressWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 报送历史
export const historyKeywork = (params, callback, errorback) => { return axios.post('/tripleWorkProgressReport/getTripleWorkProgressReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 获取所有重点工作数据
export const getAllKeywork = (params, callback) => { return axios.get('/tripleWorkProgress/getSecondWork', { params }).then((data) => { callback(data) }) }
export const changeKeyworkFormstate = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/updateTripleWorkProgressFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const synchKeyworkFormstate = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/updateFormStatusByMaxDeptStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取上次进展填报内容
export const showKeyworkLastReport = (params, callback, errorback) => { return axios.post('/tripleWorkProgressReport/getWorkLastReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 详情查看上次进展情况
export const lasttimeKeyworkProgress = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/workLastReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
