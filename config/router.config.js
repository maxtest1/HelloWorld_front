export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      // 演示案例
      {
        path: '/demo',
        name: 'demo',
        icon: 'smile',
        routes: [
          // 演示用例
          {
            path: '/demo/DemoList',
            name: 'DemoList',
            icon: 'table',
            component: './Demo/DemoList',
          },
        ],
      },
      {
        path: '/world',
        name: 'worldList',
        icon: 'lock',
        // 直连阶段先删除，接入权限时候放开即可
        // authority: ['worldList'],
        component: './HelloWorld/WorldList',
      },
      // 403
      {
        component: '403',
      },
      // 404
      {
        component: '404',
      },
    ],
  },
];