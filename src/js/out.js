function hello() {
    return "hello";
}
/// <reference path="./hello.ts"/>
function f() {
    return hello() + 'test';
}
/// <reference path="./log.ts"/>
/// <reference path="./hello.ts"/>
var txt = f();
console.log(txt);
console.log(hello());
