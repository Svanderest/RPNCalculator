var bxStack;
var arrStack;
var bolEntered;

function initialize()
{
	if(document.getElementById("form").className != "HelloClass")
		console.log("Hello world");
	bxStack = document.getElementsByName("stack");
	arrStack = new Array ("0","0");
	bxStack[1].value = arrStack[0];
	bxStack[0].value = arrStack[1];
	bolEntered = 1;
	var max = prompt("Please enter a maximimun");
	max = parseInt(max);
	var primes = new Array(max - 1);
	for(i = 0; i < max-1; i++)
		primes[i] = i+2;
	for(i of primes)
	{		
		if(i*i > max)
			break;
		primes = primes.filter(function(num) {return (num % this != 0) || (num == this)},i);
	}
	console.log(primes);	
	document.getElementById("test").title="yo";
}

function btnNumber(input)
{
	if(input == 0 && arrStack[0] == "0")
		return;
	if(input == ".")
	{
		if(arrStack[0].indexOf(".") != -1)
			return;
		if(bolEntered != 0)
			input = "0."
	}
	if(bolEntered == 0)
		arrStack[0] += input;
	if(bolEntered == 1)
		arrStack[0] = input;
	if(bolEntered == -1)
		arrStack.unshift(input);
	updateStack(0);
}


function btnEnter()
{
	arrStack.unshift(arrStack[0]);
	arrStack[1] = round(arrStack[1]).toString();
	updateStack(1);
}

function btnReset()
{
	arrStack[0] = 0;
	updateStack(1);
}

function btnPlus()
{
	arrStack[1] = parseFloat(arrStack[1]) + parseFloat(arrStack[0]);
	arrStack.shift();
	updateStack(-1);
}

function btnSubt()
{
	arrStack[1] -= arrStack[0];
	arrStack.shift();
	updateStack(-1);
}

function btnMult()
{
	arrStack[1] *= arrStack[0];
	arrStack.shift();
	updateStack(-1);
}

function btnDivide()
{
	if(arrStack[0] != 0)
	{
		arrStack[1] /= arrStack[0];
		arrStack.shift();
		updateStack(-1);
	}
	else
		dspError("Divide by 0");
}

function btnFlip()
{
	var temp = parseFloat(arrStack[0]);
	arrStack[0] = arrStack[1];
	arrStack[1] = temp;
	if(arrStack[0] == "0")
		temp = 1;
	else
		temp = -1;
	updateStack(temp);
}

function btnSign()
{
	arrStack[0] *= -1;
	updateStack(bolEntered);
}

function btnPi()
{
	if(bolEntered == 1)
		arrStack[0] = Math.PI;
	else
		arrStack.unshift(Math.PI);
	updateStack(-1);
}

function btnE()
{
	if(bolEntered == 1)
		arrStack[0] = Math.E;
	else
		arrStack.unshift(Math.E);
	updateStack(-1);
}

function btnLog()
{
	if(arrStack[0] > 0)
	{
		arrStack[0] = Math.log(arrStack[0]);
		updateStack(-1);
	}
	else
		dspError("Log of negative");	
}

function btnExp()
{
	let temp = Math.pow(arrStack[1],arrStack[0]);
	if(isNaN(temp))
		dspError("Invalid y^x");
	else if(arrStack[0] == 0 && arrStack[1] == 0)
		dspError("Error 0^0")
	else
	{
		arrStack[1] = temp;
		arrStack.shift();
		updateStack(-1);
	}
}

function btnSqrt()
{
	if(arrStack[0] >= 0)
	{
		arrStack[0] = Math.sqrt(arrStack[0]);
		updateStack(-1);
	}
	else
		dspError("Sqrt of negative");
}

function btnTan()
{
	if(Math.cos(arrStack[0]).toFixed(12) == 0)
		dspError("Divide by 0")
	else
	{
		arrStack[0] = Math.tan(arrStack[0]);
		updateStack(-1);
	}
}

function btnCos()
{
	arrStack[0] = Math.cos(arrStack[0]);
	updateStack(-1);
}

function btnSin()
{
	arrStack[0] = Math.sin(arrStack[0]);
	updateStack(-1);
}

function updateStack(bolEnt)
{
	bolEntered = bolEnt;
	if(bolEnt != 0)
		arrStack[0] = round(arrStack[0]);
	arrStack[0] = arrStack[0].toString();
	bxStack[1].value = arrStack[0];
	if(arrStack.length == 1)
		arrStack.push("0");
	bxStack[0].value = arrStack[1];	
	document.activeElement.blur();
}

function round(input)
{
	if(!Number.isInteger(input))
	{
		input = parseFloat(input).toFixed(12);
		if(Number.isInteger(input))
			input = parseInt(input);
		else
		{
			for(var i = input.length; input[i-1] == "0"; i--);
			input = input.slice(0,i);
		}
	}
	return input;
}
function dspError(message)
{
	bxStack[1].value = message;
	setTimeout(function(){bxStack[1].value = arrStack[0];}, 1000);
}

function keyPress(event)
{
	var btn;
	var color;
	if(isNaN(event.key))
	{
		color = "aaa";
		switch(event.key)
		{			
			case "+": 	btnPlus();
						btn = document.getElementById("add");
						break;
			case "-": 	btnSubt();
						btn = document.getElementById("subtract");
						break;
			case "*":
			case "x":
			case "X": 	btnMult();
						btn = document.getElementById("multiply");			
						break;
			case "/": 	btnDivide();
						btn = document.getElementById("divide");
						break;
			case "c":
			case "C": 	btnReset();
						btn = document.getElementById("C");
						color = "ddd";
						break;
			case ",":
			case ".": 	btnNumber(".");
						btn = document.getElementById("dot");
						color = "ddd"
						break;
			case "e": 	btnE();
						btn = document.getElementById("e");
						break;
			case "Enter": 	btnEnter();
							btn = document.getElementById("enter");
							break;
		}
	}
	else if(event.key != " ")
	{
		btnNumber(event.key);
		btn = document.getElementById(event.key);
		color = "ddd";
	}
	btn.style = "background-color: #" + color + ";"; 
}

function keyRelease()
{
	let btn = document.getElementsByTagName("input");
	for(let i of btn)
		i.style = null;
}