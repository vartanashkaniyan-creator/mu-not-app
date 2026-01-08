const Router = (() => {
    const routes = {};
    let defaultRoute = '/home';

    function register(path, callback){
        if(typeof callback!=='function') return console.error(`Callback مسیر ${path} معتبر نیست`);
        routes[path]=callback;
    }

    function setDefault(path){ defaultRoute=path; }

    function navigate(path){
        const cb=routes[path]||routes[defaultRoute];
        if(cb) cb();
        window.history.pushState({path},'',path);
    }

    function init(){
        window.addEventListener('popstate',e=>{
            const path=e.state?.path||defaultRoute;
            const cb=routes[path]||routes[defaultRoute];
            if(cb) cb();
        });
        navigate(location.pathname||defaultRoute);
    }

    return {register,navigate,setDefault,init};
})();
window.Router=Router;
