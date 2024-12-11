
// class Bar{

// }
// class Foo{
//     public bar: Bar = null;
//     constructor(){
//         this.bar = new Bar();
//     }
// }
// let bar = new Foo();

// class Foo{
//     public text!:string;
//     constructor(){
//         this.text="this is sprite"
//     }
//     // 声明一个"print"的实例方法
//     print(){
//         console.log(this.text);
//     }
// }

// let obj = new Foo();
// // 调用实例方法
// obj.print();

// class Base{
// }
// class Sub extends Base {
    
// }
// let sub = new Sub();
// console.log(sub instanceof Sub);
// console.log(sub instanceof Base);
// let base = new Base();
// console.log(base instanceof Sub);

// class Foo{
//     static count=0;
//     static getBounds(){

//     }
// }

// class Object{
//     static count = 11;
//     static range:{w:100,  h:100}
// }

// class Foo extends Object{

// }

// console.log(Foo.count);//11 因为count继承自Object类

// Foo.range.w=200;
// console.log(Object.range.w)//200 因为Foo.range和Object.range指向同一个对象

// //局部方法
// doLoad(sprite){
//     //
// };
// //局部变量
// let url = "foo.png"

// class Sprite {
//     public url = '';
//     load(){
//         this.url = url;
//         doLoad(this);
//     }
// }

// class Node {
//     name: string;
//     constructor(){
//         this.name = "node";
//     }
// }

// class Sprite extends Node{
//     constructor(){
//         super();
//         //子构造函数被调用前，父构造函数已经被调用过，所以this.name已经被初始化过
//         console.log(this.name);//"node"
//         //重新设置this.name
//         this.name = "sprite";
//     }
// }

// let obj = new Sprite();
// console.log(obj.name);//"Sprite"

// class Shape{
//     getName(){
//         return "shape";
//     }
// };

// class Rect extends Shape{
//     getName(){
//         return "rect";
//     }
// };

// let obj = new Rect();
// console.log(obj.getName());//"rect"

// @property
// get num(){
//     return this._num;
// }

// @property
// private _num = 0;

// class Sprite{
//     @property
//     get width(){
//         return this._width;
//     }
//     @property
//     private _width=0;
    
//     print(){
//         console.log(this.width);
//     }
// }

// get width(){
//     return this._width;
// }

// @property({type:CCInteger, tooltip:"The width of sprite"})
// private _width = 0;

// @property
// get width(){
//     return this._width;
// }

// @property({type:CCInteger, tooltip:"The width of sprite"})
// private _width = 0;

// get num(){
//     return this._num;
// }

// @property
// private _num=0;

// start(){
//     console.log(this.num);
// }

// set width(value){
//     this._width = value;
// }

// private _width =0;
// start(){
//     this.width=20;
//     console.log(this.width);
// }
// @property
// get width(){
//     return this._width;
// }
// set width(value){
//     this._width  = value;
// }

// @property
// private _width =0;