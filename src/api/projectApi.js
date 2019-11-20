import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 项目类型列表
export const projectTypeList = (params, callback, errorback) => { return axios.get('/ptype/searchs', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 添加项目类型
export const addProjectType = (params, callback, errorback) => { return axios.post('/ptype/addProtype', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 添加项目
export const addProject = (params, callback, errorback) => { return axios.post('/project/addProject', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 项目列表
export const projectListAll = (params, callback) => { return axios.post('/project/searchList', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 项目完结
export const updateStatus = (params, callback, errorback) => { return axios.get('/project/updateStatus', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 进展汇报
export const addProgress = (params, callback, errorback) => { return axios.post('/progress/addProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 项目编辑
export const editProject = (params, callback, errorback) => { return axios.post('/project/updateProject', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 严重滞后
export const updateLag = (params, callback, errorback) => { return axios.post('/project/updateStatusYanzhong', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 目标任务完结
export const targetOver = (params, callback, errorback) => { return axios.post('/projectAim/updateStatusEnd', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 根据目标ID查询
export const targetbyId = (params, callback, errorback) => { return axios.get('/projectAim/searchById', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 目标滞后
export const targetLag = (params, callback, errorback) => { return axios.post('/projectAim/updateStatusZhiHou', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 查看历史记录
export const lookProjectHistory = (params, callback, errorback) => { return axios.post('/progress/searchProgressByProjectId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 完成进度状态修改
export const updateTotalStatus = (params, callback, errorback) => { return axios.post('/project/updateTotalStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 报送材料状态修改
export const updateFormStatus = (params, callback, errorback) => { return axios.post('/project/updateFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 报送规则详情状态
export const getStatusForm = (params, callback, errorback) => { return axios.post('/projectRule/updateStatusById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 项目详情
export const getdetailProject = (params, callback, errorback) => { return axios.get('/project/searchDetail', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

export const changeFormstate = (params, callback, errorback) => { return axios.post('/project/changeProjectFormStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 导入数据
export const importProjectData = (params, callback, errorback) => { return axios.post('/importProject', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

export const synchFormstate = (params, callback, errorback) => { return axios.post('/project/synchFormStatusByMaxDStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 删除
export const deleteProject = (params, callback, errorback) => { return axios.post('/project/deleteById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取所有项目数据
export const getAllProject = (params, callback, errorback) => { return axios.get('/project/searchAll', { params }).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批量设置报送规则校验
export const checkReportRules = (params, callback, errorback) => { return axios.post('/project/checkRules', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 详情上一次进展情况
export const lasttimeProgress = (params, callback, errorback) => { return axios.post('/project/lastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 新增进展汇报显示上次情况
export const addShowLasttime = (params, callback, errorback) => { return axios.post('/progress/findLastProgress', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 获取规则列表
export const getAllRulelist = (params, callback, errorback) => { return axios.post('/ProjectAllRule/searchAll', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批量规则新增
export const addAllRule = (params, callback, errorback) => { return axios.post('/ProjectAllRule/addProjectAllRule', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批量规则编辑
export const editAllRule = (params, callback, errorback) => { return axios.post('/ProjectAllRule/updateProjectAllRule', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 批量规则详情
export const allRuleDetail = (params, callback, errorback) => { return axios.post('/ProjectAllRule/searchById', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
