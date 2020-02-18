class MyVue {
    constructor(options) {
        this.$options = options;
        //数据响应化
        this.$data = options.data;
        this.observe(this.$data)

        //模拟一下Watcher创建
        new Watcher();
        this.$data.test;
        this.$data.foo.bar;
        this.$data.test;
        // new Compile(options.el,this)
        //
        // //created执行
        // if(options.created){
        //     options.created.call(this)
        // }
    }

    observe(value) {
        if (!value || typeof value !== 'object') {
            return
        }
        Object.keys(value).forEach(key => {
            this.defineReactive(value, key, value[key])
        })
    }

    //数据响应化
    defineReactive(obj, key, val) {
        this.observe(val)  //递归解决数据嵌套

        const dep=new Dep();

        Object.defineProperty(obj, key, {
            get() {
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            set(newVal) {
                if (newVal === val) return;
                val = newVal;
                // console.log(`${key}属性更新了:${val}`)
                dep.notify()
            }
        })
    }
}


//Dep 用来管理watcher
class Dep {
    constructor() {
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        this.deps.forEach(dep => dep.update())
    }
}

//Watcher
class Watcher{
    constructor(){
        //将当前watcher实例指定到Dep静态属性target
        Dep.target=this;
    }
    update(){
        console.log("属性更新了")
    }
}
