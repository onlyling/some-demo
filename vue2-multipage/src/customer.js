import routers from './routers/customer'
import setApp from './main'
import App from './App.vue'

var {
    router,
    app
} = setApp(routers, App)