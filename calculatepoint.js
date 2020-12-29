let x1 =0
let y1 =0
let x2 = -10
let y2 = 9
let k = 0.2


let delta = (1 + Math.pow((y2/x2),2))*(k*k)
let xi = ( Math.sign(x2)*Math.sqrt(delta))/ (1+ Math.pow((y2/x2),2))
let yi = (xi*y2/x2)

console.log(xi,yi)
console.log(Math.sqrt(Math.pow((xi-x1),2) + Math.pow((yi - y1),2)))