import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export const getPersonAll = (params, callback) => { return axios.get('/personnalCenter/getPersonnalCenterList', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 审核详情
export const getCheckDetail = (params, callback) => { return axios.post('/personnalCenter/getAuditDetail', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
export const passChange = (params, callback) => { return axios.post('/personnalCenter/auditCenter', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 目标待审核列表
export const centerGetTargetList = (params, callback) => { return axios.post('/target/getReportListByNoAudit', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 修改审核状态
export const updateTargetStatus = (params, callback) => { return axios.post('/target/updateAudit', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 获取详情
export const getWarnDetail = (params, callback) => { return axios.post('/personnalCenter/getWarnDetail', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 推送消息
export const getNewslist = (params, callback) => { return axios.post('/sysPush/getPushMsg', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 项目通过审核调用
export const projectPassStatus = (params, callback) => { return axios.post('/project/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 批交办通过审核调用
export const assignPassStatus = (params, callback) => { return axios.post('/check/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 领导指示、三年行动计划审核调用
export const synchFormstate = (params, callback, errorback) => { return axios.post('/threeWork/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 重复报送提醒-项目
export const repeatReport = (params, callback) => { return axios.post('/progress/repetCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 重复填报校验--决策督查
export const repeatReport2 = (params, callback, errorback) => { return axios.post('/threeReport/repetCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 进展汇报--决策督查
export const addPlanReport = (params, callback, errorback) => { return axios.post('/threeReport/addThreeReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 重复报送校验 -批交办事项
export const repeatAssignReport = (params, callback) => { return axios.post('/checkReceipt/repetThreeWorkReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 三年行动计划-重复报送
export const repeatThreeReport = (params, callback) => { return axios.post('/threeReport/repetCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 审核、详情时进展汇报显示上次情况 --- 项目
export const showLasttimeState = (params, callback, errorback) => { return axios.post('/progress/findLastByReportDept', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 审核、详情时进展汇报显示上次情况---三年行动计划，领导指示分工
export const showLasttimeState3 = (params, callback, errorback) => { return axios.post('/threeReport/findLastByReportDept', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 项目新增进展汇报显示上次情况
export const addShowLasttime = (params, callback, errorback) => { return axios.post('/progress/findLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 数量统计
export const getCenterNumber = (params, callback) => { return axios.get('/personnalCenter/counterModel', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 牵头单位首页数据统计
export const getLeaderCharts = (params, callback, errorback) => { return axios.post('/leaderPersonnal/countNoValidate', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
