import Vue from 'vue'
import Vuex from 'vuex'
// import Cookies from 'js-cookie'
import routerData from './modules/routerData'
import role from './modules/role'
import layout from './modules/layout/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // token: Cookies.get('token')
        token: sessionStorage.getItem('token'),
        userdata: sessionStorage.getItem('userData'),
        perssionData: sessionStorage.getItem('perssionData'),
        systemInfo: sessionStorage.getItem('systemInfo'),
        isfirst: true
    },
    mutations: {
        setToken(state, token) {
            state.token = token
            // state.perssionData = ['main', 'mainindex', 'basicinfo', 'organize', 'roles', 'system', 'setup', 'target', 'keytarget']
            // Cookies.set('token', token ,{ expires: 1/24 });
            sessionStorage.setItem('token', token)
        },
        setUserData(state, obj) {
            state.userdata = obj
            let per = JSON.parse(obj)
            state.perssionData = per.permiNames
            // state.perssionData = ["assign", "assignitem", "decision", "threeyear", "personal", "mycenter", "changepsw"]
            sessionStorage.setItem("userData", obj)
            sessionStorage.setItem("perssionData", per.permiNames)
            console.log(per.permiNames)
        },
        setSystemInfo(state, obj) {
            state.systemInfo = obj
            sessionStorage.setItem("systemInfo", obj)
        }
    },
    actions: {
        setToken({ commit }, token) {
            return new Promise((resolve, reject) => {
                commit('setToken', token)
                resolve()
            })
        },
        setUserData({ commit }, userData) {
            return new Promise((resolve, reject) => {
                commit('setUserData', userData)
                resolve()
            })
        },
        setSystemInfo({ commit }, systemInfo) {
            return new Promise((resolve, reject) => {
                commit('setSystemInfo', systemInfo)
                resolve()
            })
        }
    },
    getters: {
        addRouters: state => state.routerData.addRouters,
        token: state => state.token,
        perssionData: state => state.perssionData,
        userdata: state => state.userdata,
        systemInfo: state => state.systemInfo,
        info: state => state.role.info,
        routers: state => state.routerData.routers,
        logoShow: state => state.layout.logoShow,
        isCollapse: state => state.layout.isCollapse,
        uniquerouter: state => state.layout.uniquerouter,
        tabnavBox: state => state.layout.tabnavBox,
        visible: state => state.layout.visible,
        left: state => state.layout.left,
        top: state => state.layout.top,
        rightNav: state => state.layout.rightNav
    },
    modules: {
        routerData,
        role,
        layout
    },
})

export default store
