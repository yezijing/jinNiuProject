import Vue from 'vue'
import Router from 'vue-router'
import CommerViews from '@/views/commerViews'
import Login from '@/views/login/index'
import Layout from '@/views/layout/layout'
import HomeMain from '@/views/index/mainIndex'

// 不是必须加载的组件使用懒加载
const changePassword = () => import('@/views/person/changePassword')
const personCenter = () => import('@/views/person/personCenter')
const NotFound = () => import('@/page404')
const organization = () => import('@/views/setting/organization')
const departmentManage = () => import('@/views/setting/departmentManage')
const roleMenagement = () => import('@/views/setting/roleMenagement')
const userMenagement = () => import('@/views/setting/userMenagement')
const projectList = () => import('@/views/project/projectList')
const assignList = () => import('@/views/assign/assignList')
const decision2 = () => import('@/views/decision/decision2')
const targetTabs = () => import('@/views/target/targetTabs')
const otherTarget = () => import('@/views/target/otherTarget')
const streetRank = () => import('@/views/target/streetRank')
const targetManagement = () => import('@/views/target/targetManagement')
const setup = () => import('@/views/system/setup')
const working = () => import('@/views/decision/working')
const governmentWork = () => import('@/views/decision/governmentWork')
const liveliHood = () => import('@/views/decision/liveliHood')
const threework = () => import('@/views/threework/threework')
const honorAll = () => import('@/views/target/honorAll')
const honorFill = () => import('@/views/target/honorFill')
const fillIn = () => import('@/views/target/fillIn')
const importWork = () => import('@/views/threework/importWork')
Vue.use(Router)
let defaultRouter = [
    {
        path: '/',
        redirect: '/index',
        hidden: true,
        children: []
    },
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true,
        children: []
    },
    {
        path: '/404',
        component: NotFound,
        name: '404',
        hidden: true,
        children: []
    }
]

let addRouter = [
    {
        path: '/index',
        iconCls: 'fa fa-home',
        name: '主页',
        component: Layout,
        alone: true,
        alias: 'main',
        children: [
            {
                path: '/index',
                iconCls: 'fa fa-home',
                name: '主页',
                component: HomeMain,
                alias: 'mainindex',
                children: []
            }
        ]
    },
    {
        path: '/',
        iconCls: 'el-icon-setting',
        name: '基础信息配置',
        component: Layout,
        alias: 'basicinfo',
        children: [
            {
                path: '/organization',
                name: '组织机构',
                component: organization,
                alias: 'organize',
                children: []
            },
            {
                path: '/departmentManage',
                name: '部门管理',
                component: departmentManage,
                alias: 'department1',
                children: []
            },
            {
                path: '/userMenagement',
                name: '用户管理',
                component: userMenagement,
                alias: 'users1',
                children: []
            },
            {
                path: '/roleMenagement',
                name: '角色管理',
                alias: 'roles',
                component: roleMenagement,
                children: []
            }
        ]
    },
    {
        path: '/projectList',
        iconCls: 'fa fa-cubes',
        name: '重点项目',
        component: Layout,
        alias: 'keyItem',
        alone: true,
        children: [
            {
                path: '/projectList',
                iconCls: 'fa fa-cubes',
                name: '重点项目',
                component: projectList,
                alias: 'keyProject',
                children: []
            }
        ]
    },
    {
        path: '/assignList',
        iconCls: 'fa fa-tasks',
        name: '批交办事项',
        component: Layout,
        alias: 'assign',
        alone: true,
        children: [
            {
                path: '/assignList',
                iconCls: 'fa fa-tasks',
                name: '批交办事项',
                component: assignList,
                alias: 'assignitem',
                children: []
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-bullseye',
        name: '决策督查',
        component: Layout,
        alias: 'decision',
        children: [
            {
                path: '/decision2',
                name: '三年行动计划',
                component: decision2,
                alias: 'threeyear',
                children: []
            },
            {
                path: '/working',
                name: '现场办公会',
                component: working,
                alias: 'xcworking',
                children: []
            },
            {
                path: '/threework',
                name: '片区督查',
                component: threework,
                alias: 'szthreework',
                children: []
            },
            {
                path: '/importWork',
                name: '重点工作',
                component: importWork,
                alias: 'importantwork',
                children: []
            },
            {
                path: '/governmentWork',
                name: '政府工作报告',
                component: governmentWork,
                alias: 'xcgovernmentWork',
                children: []
            },
            {
                path: '/liveliHood',
                name: '省市区民生',
                component: liveliHood,
                alias: 'xcliveliHood',
                children: []
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-crosshairs',
        name: '目标管理',
        component: Layout,
        alias: 'target',
        children: [
            {
                path: '/onelevel',
                name: '重点经济目标',
                component: CommerViews, // 无限极菜单的容器
                alias: 'keytargetone',
                children: [
                    {
                        path: '/targetTabs',
                        name: '金牛区完成情况',
                        component: targetTabs,
                        alias: 'keytargetlist',
                        children: []
                    },
                    {
                        path: '/streetRank',
                        name: '承办单位完成情况',
                        component: streetRank,
                        alias: 'sranklist',
                        children: []
                    },
                    {
                        path: '/fillIn',
                        name: '牵头单位填报',
                        component: fillIn,
                        alias: 'keyfillin',
                        children: []
                    },
                    {
                        path: '/targetManagement',
                        name: '经济指标管理',
                        component: targetManagement,
                        alias: 'targetMenage',
                        children: []
                    }
                ]
            },
            {
                path: '/twolevel',
                name: '非经济目标',
                component: CommerViews, // 无限极菜单的容器
                alias: 'othereco',
                children: [
                    {
                        path: '/otherTarget',
                        name: '市下达绩效考评体系',
                        component: otherTarget,
                        alias: 'kptx',
                        children: []
                    }
                ]
            },
            {
                path: '/threelevel',
                name: '争先工作',
                component: CommerViews, // 无限极菜单的容器
                alias: 'zxgz',
                children: [
                    {
                        path: '/honorAll',
                        name: '表彰奖牌情况汇总表',
                        component: honorAll,
                        alias: 'zxall',
                        children: []
                    },
                    {
                        path: '/honorFill',
                        name: '表彰奖牌情况填报表',
                        component: honorFill,
                        alias: 'zxfill',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-user-o',
        name: '个人中心',
        component: Layout,
        alias: 'personal',
        children: [
            {
                path: '/personCenter',
                name: '个人中心',
                component: personCenter,
                alias: 'mycenter',
                children: []
            },
            {
                path: '/changePassword',
                name: '修改密码',
                component: changePassword,
                alias: 'changepsw',
                children: []
            }
        ]
    },
    {
        path: '/setup',
        iconCls: 'fa fa-asterisk',
        name: '系统设置',
        component: Layout,
        alone: true,
        alias: 'system',
        children: [
            {
                path: '/setup',
                iconCls: 'fa fa-asterisk',
                name: '系统设置',
                component: setup,
                alias: 'syssetup',
                children: []
            }
        ]
    }
]

let allAddRouter = [
    {
        path: '/',
        iconCls: 'el-icon-setting',
        name: '基础信息配置',
        component: Layout,
        alias: 'basicinfo',
        children: [
            {
                path: '/organization',
                name: '组织机构',
                component: organization,
                alias: 'organize',
                children: []
            },
            {
                path: '/departmentManage',
                name: '部门管理',
                component: departmentManage,
                alias: 'department1',
                children: []
            },
            {
                path: '/userMenagement',
                name: '用户管理',
                component: userMenagement,
                alias: 'users1',
                children: []
            },
            {
                path: '/roleMenagement',
                name: '角色管理',
                alias: 'roles',
                component: roleMenagement,
                children: []
            }
        ]
    },
    {
        path: '/projectList',
        iconCls: 'fa fa-cubes',
        name: '重点项目',
        component: Layout,
        alias: 'keyItem',
        alone: true,
        children: [
            {
                path: '/projectList',
                iconCls: 'fa fa-cubes',
                name: '重点项目',
                component: projectList,
                alias: 'keyProject',
                children: []
            }
        ]
    },
    {
        path: '/assignList',
        iconCls: 'fa fa-tasks',
        name: '批交办事项',
        component: Layout,
        alias: 'assign',
        alone: true,
        children: [
            {
                path: '/assignList',
                iconCls: 'fa fa-tasks',
                name: '批交办事项',
                component: assignList,
                alias: 'assignitem',
                children: []
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-bullseye',
        name: '决策督查',
        component: Layout,
        alias: 'decision',
        children: [
            {
                path: '/decision2',
                name: '三年行动计划',
                component: decision2,
                alias: 'threeyear',
                children: []
            },
            {
                path: '/working',
                name: '现场办公会',
                component: working,
                alias: 'xcworking',
                children: []
            },
            {
                path: '/threework',
                name: '片区督查',
                component: threework,
                alias: 'szthreework',
                children: []
            },
            {
                path: '/importWork',
                name: '重点工作',
                component: importWork,
                alias: 'importantwork',
                children: []
            },
            {
                path: '/governmentWork',
                name: '政府工作报告',
                component: governmentWork,
                alias: 'xcgovernmentWork',
                children: []
            },
            {
                path: '/liveliHood',
                name: '省市区民生',
                component: liveliHood,
                alias: 'xcliveliHood',
                children: []
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-crosshairs',
        name: '目标管理',
        component: Layout,
        alias: 'target',
        children: [
            {
                path: '/onelevel',
                name: '重点经济目标',
                component: CommerViews, // 无限极菜单的容器
                alias: 'keytargetone',
                children: [
                    {
                        path: '/targetTabs',
                        name: '金牛区完成情况',
                        component: targetTabs,
                        alias: 'keytargetlist',
                        children: []
                    },
                    {
                        path: '/streetRank',
                        name: '承办单位完成情况',
                        component: streetRank,
                        alias: 'sranklist',
                        children: []
                    },
                    {
                        path: '/fillIn',
                        name: '牵头单位填报',
                        component: fillIn,
                        alias: 'keyfillin',
                        children: []
                    },
                    {
                        path: '/targetManagement',
                        name: '经济指标管理',
                        component: targetManagement,
                        alias: 'targetMenage',
                        children: []
                    }
                ]
            },
            {
                path: '/twolevel',
                name: '非经济目标',
                component: CommerViews, // 无限极菜单的容器
                alias: 'othereco',
                children: [
                    {
                        path: '/otherTarget',
                        name: '市下达绩效考评体系',
                        component: otherTarget,
                        alias: 'kptx',
                        children: []
                    }
                ]
            },
            {
                path: '/threelevel',
                name: '争先工作',
                component: CommerViews, // 无限极菜单的容器
                alias: 'zxgz',
                children: [
                    {
                        path: '/honorAll',
                        name: '表彰奖牌情况汇总表',
                        component: honorAll,
                        alias: 'zxall',
                        children: []
                    },
                    {
                        path: '/honorFill',
                        name: '表彰奖牌情况填报表',
                        component: honorFill,
                        alias: 'zxfill',
                        children: []
                    }
                ]
            }
        ]
    },
    {
        path: '/',
        iconCls: 'fa fa-user-o',
        name: '个人中心',
        component: Layout,
        alias: 'personal',
        children: [
            {
                path: '/personCenter',
                name: '个人中心',
                component: personCenter,
                alias: 'mycenter',
                children: []
            },
            {
                path: '/changePassword',
                name: '修改密码',
                component: changePassword,
                alias: 'changepsw',
                children: []
            }
        ]
    },
    {
        path: '/setup',
        iconCls: 'fa fa-asterisk',
        name: '系统设置',
        component: Layout,
        alone: true,
        alias: 'system',
        // hidden: true,
        children: [
            {
                path: '/setup',
                iconCls: 'fa fa-asterisk',
                name: '系统设置',
                component: setup,
                alias: 'syssetup',
                children: []
            }
        ]
    }
];

export default new Router({
    routes: defaultRouter
})

export { defaultRouter, addRouter, allAddRouter }
