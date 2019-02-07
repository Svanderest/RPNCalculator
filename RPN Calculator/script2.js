var txtScreen = new Array();	
var arrStack = new Array("0","0");;
var intMode;

function initialize()
{
	var body = document.getElementsByTagName("body");
	var df = document.createDocumentFragment();
	var myForm = document.createElement('form');
	var myDiv = document.createElement('div');
	myDiv.id = "screen";
	for(i = 0; i < 2; i++)
	{
		var txtScreenElement = document.createElement('input');
		txtScreenElement.type = "text";
		txtScreenElement.onfocus = function() {this.blur()};
		txtScreen[i] = txtScreenElement;
		myDiv.appendChild(txtScreenElement);
	}
	myForm.appendChild(myDiv);
	var functionNames = ["asin","acos","atan","log","sin","cos","tan","sqrt","^","!","e","\u03C0"];
	var functionFunctions = [btnAsin, btnAcos, btnAtan, btnLog, btnSin, btnCos, btnTan, btnSqrt, btnExp, btnFac, btnE, btnPi];
	var myDiv = document.createElement('div');
	myDiv.id = "functions";
	for(i in functionNames)
	{
		if(i%4 == 0)
			var nestedDiv = document.createElement('div');
		var btnNew = document.createElement('input');
		btnNew.type = "button";
		if(i == functionNames.length-1)
			btnNew.id = "pi";
		else
			btnNew.id = functionNames[i];
		btnNew.value = functionNames[i];
		btnNew.onclick = functionFunctions[i];
		nestedDiv.appendChild(btnNew);
		if(i%4 == 3)
			myDiv.appendChild(nestedDiv);
	}
	myForm.appendChild(myDiv);
	var numPadNames = ["\u21B5",null,"+/-","\u2194","7","8","9","/","4","5","6","*","1","2","3","-","C","0",".","+"];
	var numPadFunctions = [btnEnter, btnSign, btnFlip, btnDivide, btnMultiply, btnSubtract, btnClear, btnDot, btnAdd];
	var myDiv = document.createElement('div');
	myDiv.id = "numPad";
	for(i in numPadNames)
	{
		if(i%4 == 0)
			var nestedDiv = document.createElement('div');
		if(numPadNames[i] != null)
		{
			var btnNew = document.createElement('input');
			btnNew.type = "button";
			btnNew.value = numPadNames[i];
			switch (i)
			{
				case "0": btnNew.id = "enter";
				          break;
				case "2": btnNew.id = "sign";
				          break;
				case "3": btnNew.id = "flip";
				          break;
				default: btnNew.id = numPadNames[i];
						 break;
			}
			if(isNaN(numPadNames[i]))
			{
				btnNew.onclick = numPadFunctions[0]
				numPadFunctions.shift();
			}
			else
				btnNew.onclick = function() {btnNumber(this.value)};
			if(i>=4 && i%4<=2)
				btnNew.name = "number";
			nestedDiv.appendChild(btnNew);
		}
		if(i%4 == 3)
			myDiv.appendChild(nestedDiv);
	}
	myForm.appendChild(myDiv);
	df.appendChild(myForm);
	body[0].appendChild(df);
	body[0].onkeydown = keyPress;
	body[0].onkeyup = keyRelease;
	updateScreen(1);
}

function btnNumber(input)
{
	if(intMode == 1)
		arrStack[0] = input;
	else if(intMode == 0)
		arrStack[0] += input;
	else
		arrStack.unshift(input);
	updateScreen(0);
}

function btnDot()
{
	if(intMode == 1)
		arrStack[0] = "0.";
	else if(intMode == 0 && arrStack[0].indexOf(".") == -1)
		arrStack[0] += ".";
	else if(intMode == -1)
		arrStack.unshift("0.");
	updateScreen(0);
}

function btnClear()
{
	arrStack[0] = 0;
	updateScreen(1);
}

function btnEnter()
{
	arrStack.unshift(arrStack[0]);
	arrStack[1] = round(arrStack[1]);
	updateScreen(1);
}

function btnSign()
{
	arrStack[0] *= -1;
	updateScreen(intMode);
}

function btnFlip()
{
	var temp = round(arrStack[0]);
	arrStack[0] = arrStack[1];
	arrStack[1] = temp.toString();
	if(arrStack[0] == "0")
		updateScreen(1);
	else
		updateScreen(-1);
}

function btnAdd()
{
	arrStack[1] = parseFloat(arrStack[1]) + parseFloat(arrStack[0]);
	arrStack.shift();
	updateScreen(-1);
}

function btnSubtract()
{
	arrStack[1] -= arrStack[0];
	arrStack.shift();
	updateScreen(-1);
}

function btnMultiply()
{
	arrStack[1] *= arrStack[0]
	arrStack.shift();
	updateScreen(-1);
}

function btnDivide()
{
	if(arrStack[0] == 0)
		displayError("Divide by 0");
	else
	{
		arrStack[1] /= arrStack[0];
		arrStack.shift();
		updateScreen(-1);
	}
}

function btnSin()
{
	arrStack[0] = Math.sin(arrStack[0]);
	updateScreen(-1);
}

function btnCos()
{
	arrStack[0] = Math.cos(arrStack[0]);
	updateScreen(-1);
}

function btnTan()
{
	if(round(Math.cos(arrStack[0])) == 0)
		displayError("Divide by 0");
	else
	{
		arrStack[0] = Math.tan(arrStack[0]);
		updateScreen(-1);
	}
}

function btnSqrt()
{
	if(arrStack[0] < 0)
		displayError("Complex solution");
	else
	{
		arrStack[0] = Math.sqrt(arrStack[0]);
		updateScreen(-1);
	}
}

function btnExp()
{
	if(arrStack[0] == "0" && arrStack[1] == "0")
		displayError("Invalid exponent");
	else if(arrStack[1] < 0 && !Number.isInteger(parseFloat(arrStack[0])))
		displayError("Complex solution");
	else
	{
		arrStack[1] = Math.pow(arrStack[1],arrStack[0]);
		arrStack.shift();
		updateScreen(-1);
	}
}

function btnLog()
{
	if(arrStack[0] <= 0)
		displayError("Invalid logarithm");
	else
	{
		arrStack[0] = Math.log(arrStack[0]);
		updateScreen(-1);
	}
}

function btnE()
{
	arrStack.unshift(Math.E);
	updateScreen(-1);
}

function btnPi()
{
	arrStack.unshift(Math.PI);
	updateScreen(-1);
}

function btnFac()
{
	if(Number.isInteger(parseFloat(arrStack[0])) && arrStack[0] >= 0)
	{
		let temp = 1;
		for(let i = 1; i<=arrStack[0]; i++)
			temp *= i;
		arrStack[0] = temp;
		updateScreen(-1)
	}
	else
		displayError("Not an integer");
}

function btnAsin()
{
	if(Math.abs(arrStack[0]) <= 1)
	{
		arrStack[0] = Math.asin(arrStack[0]);
		updateScreen(-1);
	}
	else
		displayError("Invalid data");
}

function btnAcos()
{
	if(Math.abs(arrStack[0]) <= 1)
	{
		arrStack[0] = Math.acos(arrStack[0]);
		updateScreen(-1);
	}
	else
		displayError("Invalid data");
}

function btnAtan()
{
	arrStack[0] = Math.atan(arrStack[0]);
	updateScreen(-1);
}

function updateScreen(mode)
{
	intMode = mode;
	if(intMode != 0)
		arrStack[0] = round(arrStack[0]).toString();
	if(arrStack.length == 1)
		arrStack[1] = "0";
	else
		arrStack[1] = arrStack[1].toString();
	txtScreen[0].value = arrStack[1];
	txtScreen[1].value = arrStack[0];
	document.activeElement.blur();
}

function round(input)
{
	input = parseFloat(input)
	if(Number.isInteger(input))
		return parseInt(input);
	else		
		input = input.toFixed(12);
	if(Number.isInteger(parseFloat(input)))
		return parseInt(input);
	else		
		return parseFloat(input);
}

function displayError(message)
{
	txtScreen[1].value = message;
	setTimeout(function(){txtScreen[1].value = arrStack[0]}, 1000);
}

function keyPress(event)
{
	var btnId = event.key;
	var colour = "#aaa;";
	if(isNaN(event.key))
	{
		switch (event.key)
		{
			case "+": 	btnAdd();
						break;
			case "-": 	btnSubtract();
						break;
			case "*":
			case "x":
			case "X": 	btnMultiply();
						btnId = "*";
						break;
			case "/": 	btnDivide();
						break;
			case ".":   btnDot();
						break;
			case "c":
			case "C": 	btnClear();
						btnId = "C"
						break;
			case "e":
			case "E": 	btnE();
						btnId = "e"
						break;
			case "^": 	btnExp();
						break;
			case "!": 	btnFac();
						break;
			case "Enter": btnEnter();
						  btnId = "enter";
						  break;
		}
	}
	else if(event.key != " ")
		btnNumber(event.key);
	var btn = document.getElementById(btnId);
	if(btn != null)
	{
		if(btn.name == "number")
			colour = "#ddd;"
		btn.style = "background-color:" + colour;
	}
}

function keyRelease()
{
	var btns = document.getElementsByTagName("input");
	for(i of btns)
		i.style = null;
}