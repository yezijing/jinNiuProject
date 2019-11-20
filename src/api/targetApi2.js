import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export const keyFill = (params, callback) => { return axios.post('/target/streetAddData', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }

// 重点经济指标排名
// export const keyRank = (params, callback) => { return axios.post('/target/getRank', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const keyRank = (params, callback) => { return axios.post('/target/getJNQRankInfo', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 街道排名
export const getStreetRank = (params, callback) => { return axios.post('/target/getStreetRank', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 对比表
// export const getContrastList = (params, callback) => { return axios.post('/target/getContrastRank', qs.stringify({ ...params })).then((data) => { callback(data) }) }
export const getContrastList = (params, callback) => { return axios.post('/target/getContrastInfo', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 承办单位
// 查询经济指标填报的街道和推进办
export const fillstreetList = (params, callback) => { return axios.get('/target/getStreet', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 生成报表
export const addStreetdata = (params, callback) => { return axios.post('/target/streetAddData', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
// 数据列表
export const getreportList = (params, callback) => { return axios.get('/target/getReportList', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 更新报表排名信息(报表提交)
export const editStreetdata = (params, callback) => { return axios.post('/target/updateRankInfo', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
// 点编辑获取详情
export const detailStreetdata = (params, callback) => { return axios.get('/target/getInfo', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 删除
export const delContrastList = (params, callback) => { return axios.post('/target/deleteReportInfo', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 编辑生成报表
export const updateStreetdata = (params, callback) => { return axios.post('/target/updateInfo', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
// 查看报表
export const otherViewReport = (params, callback) => { return axios.get('/target/getReportInfo', { params }).then((data) => { callback(data) }).catch(function () { }) }

// 区市县填报
// 获取填报单位
export const fillDistrictList = (params, callback) => { return axios.get('/target/getDistrict', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 数据列表
export const getothertList = (params, callback) => { return axios.post('/target/getOtherPage', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 生成报表
export const addAreaList = (params, callback) => { return axios.post('/target/addOther', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
export const otherRankList = (params, callback) => { return axios.get('/target/getStreetForm', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 点编辑获取详情
export const detailAreaData = (params, callback) => { return axios.get('/target/getOtherInfo', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 删除
export const delAreaList = (params, callback) => { return axios.post('/target/deleteOtherReport', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 更新报表排名信息(报表提交)
export const editAreadata = (params, callback) => { return axios.post('/target/updateOtherRankInfo', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
// 编辑生成报表
export const updateAreadata = (params, callback) => { return axios.post('/target/updateOther', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }) }
// 查看报表
export const areaViewReport = (params, callback) => { return axios.get('/target/getOtherReportInfo', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 获取月份时间段
export const getMonthlist = (params, callback) => { return axios.get('/target/getJNQReportMonth', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 承办单位月份
export const getareaMonthlist = (params, callback) => { return axios.get('/target/getStreetReportMonth', { params }).then((data) => { callback(data) }).catch(function () { }) }

