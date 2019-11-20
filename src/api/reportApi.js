import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 进展汇报验证
export const reportTerm = (params, callback) => { return axios.post('/allReport/searchTerm', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 保存进展汇报
export const saveReportInfo = (params, callback) => { return axios.post('/allReport/submitAllReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 项目进展汇报
export const addProjectReportData = (params, callback, errorback) => { return axios.post('/progress/addProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批交办进展提交
export const addAssignReport = (params, callback, errorback) => { return axios.post('/checkReceipt/addCheckReceipt', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 三年行动计划
export const addPlanReport = (params, callback, errorback) => { return axios.post('/threeReport/addThreeReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 重要工作进展提交
export const addKeyworkReport = (params, callback, errorback) => { return axios.post('/tripleWorkProgressReport/addTripleWorkProgressReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要片区
export const addKeyareaReport = (params, callback, errorback) => { return axios.post('/tripleAreaProgressReport/addTripleAreaProgressReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重大项目
export const addItemReport = (params, callback, errorback) => { return axios.post('/situationProgress/addDecisionIAreaReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
