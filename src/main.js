// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from './btnPermission'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/reset.scss'
import './assets/css/public.scss'
import App from './App.vue'
import router from './router'
import store from './vuex'
import i18n from './i18n/i18n'
import moment from 'moment'
import 'babel-polyfill'
import './directives.js'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import jinniu from 'echarts/map/json/jinniu.json'
echarts.registerMap('jinniu', jinniu)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$moment = moment
Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') { return moment(dataStr).format(pattern) })

//  获取角色信息，根据用户权限动态加载路由
router.beforeEach((to, from, next) => {
    if (store.getters.token) {
        store.dispatch('setToken', store.getters.token)
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if (!store.getters.info.length) {
                !async function getAddRouters() {
                    await store.dispatch('getInfo', store.getters.perssionData)
                    await store.dispatch('newRoutes', store.getters.info)
                    await router.addRoutes(store.getters.addRouters)
                    next({ path: '/index' })
                }()
            } else {
                let is404 = to.matched.some(record => {
                    if (record.meta.role) {
                        return record.meta.role.indexOf(store.getters.info.role) === -1
                    }
                })
                if (is404) {
                    next({ path: '/404' })
                    return false
                }
                next()
            }
        }
    } else {
        if (to.path === '/login') {
            next()
        }
        next({ path: '/login' })
    }
})

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App),
    components: { App },
    template: '<App/>'
})
