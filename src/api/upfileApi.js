import axios from 'axios'
import qs from 'qs'
import { defaturl } from './apiUrl'
axios.defaults.baseURL = defaturl
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// 上传文件校验文件类型
export const checkFileTypeData = (params, callback) => { return axios.post('/importData/checkExcelFile', qs.stringify({ ...params })).then((data) => { callback(data) }).catch(function () { }) }
