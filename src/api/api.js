import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 修改默认配置
// axios.defaults.headers.post['Content-Type'] = 'application/json'
// axios.defaults.headers.get['Content-Type'] = 'application/json'
// axios.defaults.withCredentials = true // 表示是否跨域访问请求

// 首页数据
export const indexData = (params, callback) => { return axios.get('/homePage/searchCount', { params }).then((data) => { callback(data) }).catch(function () { }) }
export const indexnameData = (params, callback) => { return axios.get('/ll/getAllByNowYear', { params }).then((data) => { callback(data) }).catch(function () { }) }
export const getDatabyChange = (params, callback) => { return axios.post('/target/getDataByDistrictId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 首页获取经济指标全年目标数据
export const getEcoData = (params, callback) => { return axios.get('/target/getNewDataByEconomicId', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 总数据
export const getAllNumber = (params, callback) => { return axios.post('/homePage/getTransNumber', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 首页项目地图数据
export const getMapData = (params, callback) => { return axios.post('/homePage/getMapParam', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 首页牵头单位预警信息
export const getLeaderEarly = (params, callback) => { return axios.post('/leaderPersonnal/warnAndAuditMsg', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 首页数据统计牵头单位
export const getLeaderDatas = (params, callback) => { return axios.post('/leaderPersonnal/countLeaderStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 登录
export const login = (params, callback) => { return axios.post('/login', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 退出
export const logout = (params, callback) => { return axios.get('/logout', { params }).then((data) => { callback(data) }) }
// 修改密码
export const changePwd = (params, callback) => { return axios.post('/users/updateUser', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// export const changePwd = (params, callback) => { return axios.post('/users/updatePassword', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 判断用户名是否重复
export const changeUsername = (params, callback) => { return axios.post('/users/userLogName', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 组织机构
export const organizeList = (params, callback) => { return axios.get('/organization/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }

// 新增组织机构
export const addOrganize = (params, callback) => { return axios.post('/organization/addOrg', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 编辑组织机构
export const editOrganize = (params, callback) => { return axios.post('/organization/updateOrg', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 删除组织机构
export const delOrganize = (params, callback) => { return axios.post('/organization/delOrg', qs.stringify({ ...params })).then((data) => { callback(data) }) }
// 部门类别
export const deptypeList = (params, callback) => { return axios.get('/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 新增部门类别
export const addDeptype = (params, callback) => { return axios.post('/addDept', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 编辑部门类别
export const editDepttype = (params, callback) => { return axios.post('/updateDept', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 删除部门类别
export const delDepttype = (params, callback) => { return axios.post('/delDept', qs.stringify({ ...params })).then((data) => { callback(data) }) }

// 部门管理
export const deptList = (params, callback) => { return axios.get('/commom/searchAll', { params }).then((data) => { callback(data) }) }
// 获取所有部门列表
export const alldeptList = (params, callback) => { return axios.get('/commom/searchAllUserDept', { params }).then((data) => { callback(data) }) }
// 新增部门
export const addDept = (params, callback) => { return axios.post('/commom/addDept', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 编辑部门
export const editDept = (params, callback) => { return axios.post('/commom/updateDept', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 删除部门
export const delDept = (params, callback) => { return axios.post('/commom/delDept', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 部门详情
export const detailDept = (params, callback) => { return axios.post('/commom/searchByDeptid', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }
// 用户列表
export const userList = (params, callback) => { return axios.get('/users/condList', { params }).then((data) => { callback(data) }) }
// 获取领导用户列表
export const leaderList = (params, callback) => { return axios.get('/users/leader', { params }).then((data) => { callback(data) }) }
// 获取街道
export const streetList = (params, callback) => { return axios.get('/commom/searchAllStreet', { params }).then((data) => { callback(data) }) }

// 所有用户列表
export const getAllusers = (params, callback) => { return axios.get('/users/userDrop', { 'params': params }).then((data) => { callback(data) }) }
export const allusers = (params, callback) => { return axios.get('/users/userDrop', { 'params': params }).then((data) => { callback(data) }) }
// 新增用户
export const addUser = (params, callback) => { return axios.post('/users/addUser', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }

// 验证登录名是否存在
export const validUser = (params, callback, errorback) => { return axios.post('/users/userLogName', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 用户编辑
export const editUser = (params, callback) => { return axios.post('/users/updateUser', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(() => { }) }

// 职务列表
export const jobList = (params, callback) => { return axios.get('/job/jobList', { ...params }).then((data) => { callback(data) }) }
// 新增职务
export const addJob = (params, callback) => { return axios.post('/job/addJob', qs.stringify({ ...params })).then(function (data) { callback(data) }).catch(function () { }) }

// 更改用户状态
export const updateUserStatus = (params, callback) => { return axios.post('/users/updateUserStatus', { params: params }).then(function (data) { callback(data) }) }

// 系统设置
export const systemSetting = (params, callback) => { return axios.post('/system/addSystem', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 查询
export const systemDetail = (params, callback) => { return axios.get('/system/searchAll', { ...params }).then((data) => { callback(data) }).catch(function () { }) }
// 隐藏列查询
export const isHidden = (params, callback) => { return axios.post('/line/searchByUserIdAndCatagory', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 隐藏列修改
export const editHidden = (params, callback) => { return axios.post('/line/changeLine', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 个人中心修改密码
export const updatePsw = (params, callback) => { return axios.post('/users/updateUserLogNameAndPassWord', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 首页获取决策督查数据
export const getworkDatas = (params, callback) => { return axios.post('/homePage/getDuchaParam', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 进展汇报验证
export const reportTerm = (params, callback) => { return axios.post('/allReport/searchTerm', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 保存进展汇报
export const savereportInfo = (params, callback) => { return axios.post('/allReport/submitAllReport', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 批量重置密码
export const resetPassword = (params, callback, errorback) => { return axios.post('/users/resetPasswordList', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }

// 项目确定导入
export const projectImportFileData = (params, callback, errorback) => { return axios.post('/project/batchAddProject', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 三年行动计划导入
export const threePlanImportFileData = (params, callback, errorback) => { return axios.post('/importData2/addThreeList', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要工作导入
export const keyWorkImportFileData = (params, callback, errorback) => { return axios.post('/tripleWorkProgress/addTripleWorkProgressList', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重要片区
export const keyAreaImportFileData = (params, callback, errorback) => { return axios.post('/tripleAreaProgress/addTripleAreaProgressList', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重大项目
export const keyItemImportFileData = (params, callback, errorback) => { return axios.post('/yy/batchAddSituation', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
// 重点工作导入
export const zhongWorkImportFileData = (params, callback, errorback) => { return axios.post('/importDataPoint/addPointList', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function (error) { errorback(error) }) }
