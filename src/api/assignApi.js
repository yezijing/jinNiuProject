import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 新增
export const addAssign = (params, callback, errorback) => { return axios.post('/check/addCheck', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 列表
export const assignList = (params, callback) => { return axios.post('/check/searchPageFilter', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 添加回执
export const addAssignReport = (params, callback, errorback) => { return axios.post('/checkReceipt/addCheckReceipt', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 查询某编号下议定事项
export const meetList = (params, callback) => { return axios.post('/checkMeet/searchByCheckId', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 批交办事项详情
export const assignDetail = (params, callback) => { return axios.post('/check/searchSingel', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 编辑
export const assignEdit = (params, callback) => { return axios.post('/check/updateCheck', (params), { headers: { 'Content-Type': 'application/json' } }).then((data) => { callback(data) }) }

// 完结
export const assignOver = (params, callback) => { return axios.post('/check/updateStatusById', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 批交办严重滞后
export const threeplanLag = (params, callback, errorback) => { return axios.post('/check/updateStatusYanZhong', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 议定事项完结
export const planOver = (params, callback, errorback) => { return axios.get('/checkMeet/updateStatusEnd', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 根据id查询
export const planbyId = (params, callback, errorback) => { return axios.get('/checkMeet/searchById', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 滞后
export const planLag = (params, callback, errorback) => { return axios.get('/checkMeet/updateStatusZhiHou', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 查看历史回执
export const historyAssign = (params, callback, errorback) => { return axios.post('/checkReceipt/searchByCheckId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 修改报送状态
export const changeFormstate = (params, callback, errorback) => { return axios.post('/check/updateFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 修改总体状态接口
export const changeTotalstate = (params, callback, errorback) => { return axios.post('/check/updateTotalStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情报送规则状态
export const getStatusForm = (params, callback, errorback) => { return axios.post('/checkRule/updateStatusById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增修改调用
export const changeCheckFormstate = (params, callback, errorback) => { return axios.post('/check/changeCheckFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
export const synchFormstate = (params, callback, errorback) => { return axios.post('/check/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 删除
export const deleteAssign = (params, callback, errorback) => { return axios.post('/check/deleteById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取上一次进展情况
export const showAssignLasttime = (params, callback, errorback) => { return axios.post('/checkReceipt/findLastReceipt', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取所有列表数据
export const getAllAssign = (params, callback, errorback) => { return axios.get('/check/searchAll', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
