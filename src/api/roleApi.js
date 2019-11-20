import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 新增角色
export const addRole = (params, callback) => { return axios.post('/role/addRole', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 角色列表
export const rolelist = (params, callback) => { return axios.get('/role/searchAll', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 编辑角色
export const editRole = (params, callback) => { return axios.post('/role/updateRole', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }
// 停用启用
export const checkStatus = (params, callback) => { return axios.post('/role/checkStatus', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 角色成员管理
export const memberList = (params, callback) => { return axios.get('/users/roleUserParm', { params }).then((data) => { callback(data) }).catch(function () { }) }
// 管理角色提交
export const addMember = (params, callback) => { return axios.post('/userRole/addUserRole', (params), {headers: {'Content-Type': 'application/json'}}).then((data) => { callback(data) }).catch(function () { }) }

// 点击组织机构返回部门列表接口：
export const deptdataList = (params, callback) => { return axios.post('/commom/searchByOrgId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
// 根据部门ID查询没有这个角色ID的用户
export const searchbyDeptId = (params, callback) => { return axios.post('/users/searchByDeptIdAndNoRoleId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }

// 根据组织机构id获取所有用户
export const getAllusers = (params, callback) => { return axios.post('/users/searchByOrgIDAndNoRoleId', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
