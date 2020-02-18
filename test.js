class TestVue{
    constructor(option){
        this.$option=option;
        this.$data=option.data;
        this.observe(this.$data)
        // new Watcher();
        // this.$data.test;
        // new Watcher();
        // this.$data.foo.bar;
        new Compile(option.el,this)
        if(option.created){
            option.created.call(this)
        }
    }

    // 监听
    observe(value){
        if(!value || typeof value !== 'object') return;
        Object.keys(value).forEach(key =>{
            this.fun1(value,key,value[key]);
            //代理data里的属性到vue实例上
            this.proxyData(key);
        });
    }
    //  数据响应化
    fun1(obj,key,val){
        this.observe(val)  //多层遍历，递归解决数据的嵌套
        const dep=new Dep();
        Object.defineProperty(obj,key,{
            get(){
                // 将Dep.target（即当前的Watcher对象）存入Dep的deps中
                Dep.target&&dep.addDep(Dep.target)
                return val;
            },
            set(newVal){
                if(newVal !== val){
                    val=newVal
                    //console.log(`值改变啦${val}`)
                    // 在set的时候触发dep的notify来通知所有的Watcher对象更新视图
                    dep.notify()
                }
            }
        })
    }
    proxyData(key){
        Object.defineProperty(this,key,{
            get(){
                return this.$data[key];
            },
            set(newValue){
                this.$data[key]=newValue;
            }
        })
    }
}
// 依赖对象 用来管理Watcher
class Dep{
    constructor(){
        // 这里存放若干依赖(Watcher)
        this.deps=[];
    }
    //通知方法  用于通知所有监听器去做更新
    notify(){
        this.deps.forEach(dep=>dep.update())

    }
    // 添加依赖方法
    addDep(dep){
        this.deps.push(dep)
    }
}
// 观察者，监听器：负责更新视图
class Watcher{
    constructor(vm,key,cb){
        this.vm=vm;
        this.key=key;
        this.cb=cb;
        // 将当前watcher实例指定到Dep静态属性target
        Dep.target=this;
        this.vm[this.key];
        Dep.target=null;
    }
    // 更新操作
    update(){
        //console.log("更新啦")
        this.cb.call(this.vm,this.vm[this.key]);
    }
}

class Compile{
    constructor(el,vm){
        this.$el=document.querySelector(el);
        this.$vm=vm;
        if(this.$el) {
            this.$fragment=this.fragment(this.$el);
            this.compile(this.$fragment)
            this.$el.appendChild(this.$fragment);
        }
    }
    fragment(el){
        const frage=document.createDocumentFragment();
        let child;
        while(child=el.firstChild){
            frage.appendChild(child);
        }
        return frage;
    }
    compile(frage){
        Array.from(frage.childNodes).forEach(dom=>{
            if(this.isElement(dom)){
                console.log('元素'+dom.nodeName)
            }
            else if(this.isInterpolation(dom)){
                console.log('插值'+dom.textContent)
                this.text(dom);
            }
            //递归子节点
            if(dom.childNodes && dom.childNodes.length>0){
                this.compile(dom);
            }
        })
    }
    text(dom){
        // dom.textContent=this.$vm.$data[RegExp.$1]
        this.update(dom,this.$vm,RegExp.$1)
    }
    update(node,vm,exp){
        node.textContent=vm[exp];
        new Watcher(vm,exp,function (value) {
            node.textContent=value;
        })
    }
    isElement(dom){
        return dom.nodeType===1;
    }
    isInterpolation(dom){
        return dom.nodeType === 3 && /\{\{(.*)\}\}/.test(dom.textContent);
    }
}