
let a = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, (v, k) => k + 1));
console.log(a);