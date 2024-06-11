import { formatCurrency } from "../scripts/utils/money.js";

//Testing the formatCurrency function
//Basic Test case 
console.log('Convert cents into dollars?');
if(formatCurrency(2095) === '20.95'){
    console.log('Yes,passed');
}
else{ 
    console.log('No,failed');
}
console.log(" ");
//Edge case testing
console.log('Works with 0?');
if(formatCurrency(0) === '0.00'){
    console.log('Yes,passed');
}
else{
    console.log('No,failed');
}
console.log(" ");
//Testing to see if the formatCurrency function rounds properly
console.log("Rounds up to the nearest Cent?")
if(formatCurrency(2000.5) === '20.01'){
    console.log('Yes, passed');
}
else{
    console.log('No,failed');
}