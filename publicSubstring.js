let str1="abfsaghelloworldsagrdv"
let str2="acvhfvdfhhelloworldpohbx"
function publicSubstring(str1,str2){
    let arr=[]
    for(let j=0;j<str1.length;j++) {
        for (let i = 1+j; i < str1.length+1; i++) {
            if (str2.indexOf(str1.slice(j, i)) !== -1) arr.push(str1.slice(j, i))
        }
    }
    let index=Math.max(...arr.map(item=>{return item.length}))
    return arr.find(item=>item.length === index)
}
console.log(publicSubstring(str1,str2))

var num=1234567890.9
function fn(num){
    let arr=num.toString().split('.')
    let arr1=[]
    for(let i=arr[0].length;i>0;i=i-3){
        arr1.unshift(arr[0].slice(i-3<0?0:i-3,i))
    }
    console.log(arr[1]?arr1.join(',')+'.'+arr[1]:arr1.join(','))
}
fn(num)