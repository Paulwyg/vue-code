class Compile{
    constructor(el,vm){
        //要遍历的宿主节点
        this.$el=document.querySelector(el);
        this.$vm=vm;
        if(this.$el){
            //转化内部内容为片段
            this.$fragment=this.node2Fragment(this.$el)
            //执行编译
            this.compile(this.$fragment)
            this.$el.appendChild(this.$fragment);
        }
    }
    //将宿主元素中的代码片段拿出遍历，这样比较高效
    node2Fragment(el){
        const frag=document.createDocumentFragment();
        let child;
        while(child=el.firstChild){
            frag.appendChild(child);
        }
        return frag;
    }
    //编译过程
    compile(el){
        const childNodes=el.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElement(node)){
                //console.log('编译元素'+node.nodeName)

            }
            else if(this.isInterpolation(node)){
                //console.log('编译文本'+node.textContent)
                this.compileText(node)
            }

            //递归子节点
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })
    }
    compileText(node){
        console.log(RegExp.$1)
        node.textContent=this.$vm.$data[RegExp.$1]
    }

    //更新函数
    update(node,vm,exp,dir){

}

    isElement(node){
        return node.nodeType === 1;
    }
    //插值文本
    isInterpolation(node){
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}