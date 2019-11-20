import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 向上分工列表
export const threePlanList = (params, callback, errorback) => { return axios.post('/decisionUp/getFilterList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 协调分工列表
export const iAreaList = (params, callback, errorback) => { return axios.post('/decisionIArea/getFilterList', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 向上分工新增
export const addThreePlan = (params, callback) => { return axios.post('/decisionUp/addDecisionUp', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 协调分工新增
export const addIAreaWork = (params, callback) => { return axios.post('/decisionIArea/addDecisionIArea', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }

// 向上分工编辑
export const editThreePlan = (params, callback) => { return axios.post('/decisionUp/updateDecisionUpWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 协调分工编辑
export const editThreePlan2 = (params, callback) => { return axios.post('/decisionIArea/updateDecisionIAreaWork', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }

// 向上分工详情
export const threePlanDetail = (params, callback, errorback) => { return axios.post('/decisionUp/getInfoByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const threeUpDetail = (params, callback, errorback) => { return axios.post('/decisionUp/getInfoByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 协调分工详情
export const threePlanDetail2 = (params, callback, errorback) => { return axios.post('/decisionIArea/getInfoByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 向上分工报送历史
export const reportPlanHistory = (params, callback, errorback) => { return axios.post('/decisionUpReport/getDecisionUpReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 协调分工报送历史
export const reportPlanHistory2 = (params, callback, errorback) => { return axios.post('/decisionIAreaReport/getDecisionIAreaReportByWorkId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 向上分工重复报送
export const repeatReportDecisionUp = (params, callback, errorback) => { return axios.post('/decisionUpReport/repetByCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 协调分工重复报送
export const repeatReportDecisionArea = (params, callback, errorback) => { return axios.post('/decisionIAreaReport/repetByCheck', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 向上分工进展汇报
export const addPlanReport = (params, callback, errorback) => { return axios.post('/decisionUpReport/addDecisionUpReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 协调分工进展汇报
export const addPlanReport2 = (params, callback, errorback) => { return axios.post('/decisionIAreaReport/addDecisionIAreaReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 修改总体状态
export const changeTotalstate = (params, callback, errorback) => { return axios.post('/decisionUp/updateTotalStatusByHand', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const changeTotalstate2 = (params, callback, errorback) => { return axios.post('/decisionIArea/updateTotalStatusByHand', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 向上删除
export const deleteUp = (params, callback, errorback) => { return axios.post('/decisionUp/deleteDecisionUpById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 我区删除
export const deleteIArea = (params, callback, errorback) => { return axios.post('/decisionIArea/deleteDecisionIAreaById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 我区获取所有数据
export const getAllMyarea = (params, callback) => { return axios.get('/decisionIArea/getAllIAreaNodePlan', { params }).then((data) => { callback(data) }) }
// 向上获取所有数据
export const getAllDup = (params, callback) => { return axios.get('/decisionUp/getAllNodePlan', { params }).then((data) => { callback(data) }) }
