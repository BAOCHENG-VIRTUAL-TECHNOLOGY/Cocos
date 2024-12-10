# javascript

###### 变量

```javascript
var a;
var a = 12;
a = 12;
```

cocos必须加var

###### 函数

```javascript
var myAwesomeFunction = function(myArgument){}
myAwesomeFunction(something);
square = function(a){
  return a*a;
}
applyOperation = function(f, a){
  
}
applyOperation(square,10);
```

###### 返回值

```javascript
myFunction = function(a){
  return a*3;
  explodeComputer();//不会执行
}
```

###### if

```javascript
if(foo){
  return bar;
}
```

###### if/else

```javascript
if(foo){
  function1();
}
else{
  function2();
}
```
```javascript
foo ? function1() : function2();
```
```javascript
var n = foo ? 1 : 2;
```
```javascript
if(foo){
  function1();
}
else if(bar){
  function2();
}
else{
  function3();
}
```

###### 数组（Array）

```javascript
a = [123, 456, 789]
```
```javascript
a[1]; // 456
```

###### 对象（Object）

```javascript
myProfile = {
  name: "Jare Guo",
  email: "blabla@gmail.com",
  'zip code': 12345,
  isInvited: true
}
```
```javascript
myProfile = {
  name : "Jare Guo",
  email: "blabla@gmail.com",
  city: "Xiamen",
  points: 1234,
  isInvited: true,
  friends:[
    {
      name:"Johnny",
      email:"blablabla@gmail.com"
    },
    {
      name:"Nantas",
      email:"piapiapia@gmail.com"
    }
  ]
}
myProfile.name;// Jare Guo
myProfile.friends[1].name;//Nantas
var MyComponent = cc.Class({
  extends: cc.Component
})
```

###### 匿名函数

```javascript
myFunction = function(myArgument){
  //do something
}
square = function(a){
  return a*a;
}
applyOperation = function(f,a){
  return f(a);
}
applyOperation(square, 10);//100
```
```javascript
applyOperation = function(f,a){
  return f(a);
}
applyOperation(
  function(a){
    return a*a;
  },
  10
)
```

###### 链式语法

```javascript
var myArray = [123,456];
myArray.push(789);
var myString = "abcdef";
myString.replace("a","z");//"zbcdef"
var n = 5;
n.double().square();
```

###### This

```javascript
myFunction = function(a,  b){
  console.log(this);
  // do something
}
```
```javascript
myFunction = function(a, b){
  var myObject = this;
  // do something
}
```

###### 运算符

```javascript
a = "12";
a == 12; // true
a === 12; // false
a = 12;
a !== 11; // true
a = true;
!a; // false
a = 12;
!a;//fasle
!!a;//true
a = 0;
!a; // true
!!a;  // false
```

###### 代码风格

```javascript
//驼峰命名法
var myRandomVariable;
a =  b +  1;
```

###### 组合学到的知识

```javascript
var Comp = cc.Class({
  extends:cc.Component,
  properties:{
    target:{
      default:null,
      type:cc.Entity
    }
  },
  onStart:function(){
    this.target=cc.Entity.find('/Main Player/Bip/Head');
  },
  update:function(){
    this.transform.worldPosition = this.target.transform.worldPosition;
  }
})
```

###### 继续学习

[JavaScript 标准参考教程（alpha） -- JavaScript 标准参考教程（alpha）](https://javascript.ruanyifeng.com/)