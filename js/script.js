var gotChange = function(inputVal, res){
	// declare global variables inside main function to keep global namespace unpoluted.
	this.inputEl = document.getElementById(inputVal),
	this.resEl = document.getElementById(res),
	this.coins = {0:[200, 0],1:[100, 0],2:[50, 0],3:[20, 0],4:[2, 0],5:[1, 0]},
	this.curr = 0,
	this.dotPos_val,
	this.ifValid = true,
	this.decimal = false;
}

// init function - calling this method adds listener and automatically triggers program.
gotChange.prototype.init = function(){
	var self = this;

	self.inputEl.focus();
	self.inputEl.addEventListener('keypress', function(){
        if(event.keyCode === 13){
            self.validate();
        }
    });
}

// method that runs user input validation
gotChange.prototype.validate = function(){
    var val = this.inputEl.value,
    	inputArr = this.inputEl.value == '' ? [0] : val.split(''), // if input is empty return array with 0 value, else split characters
        dotPos = val.indexOf('.'), // set variable with dot position
        dotLeft = val.substring(0,dotPos), // set variable with string containg the numbers left to the dot
		dotRight = val.substring(dotPos+1, dotPos.length), // set variable with string containg the numbers right to the dot
        rounded = Number('.'+ (dotRight)).toFixed(2), //round numbers to the right of the dot to the decimal value
        dotFound = false; // boolean to check id dots were already found

    for(var j=0; inputArr.length > j; j++){ // loop through input value single characters

        if((isNaN(inputArr[j]) && inputArr[j].indexOf('.') === -1) || (inputArr.length == 1 && inputArr[j] == 0)){ //preform some validation
           console.log('error: invalid input field value - input value may be empty, less-than 0 and/or have forbidden characters such as letters');
           this.ifValid = false; // set input value as invalid
           break;
        }

        if(inputArr[j].indexOf('.') != -1){  // if dot is found
    		
    		if(dotFound){ // check if dot has been found previously
    			console.log('error: invalid input field value - more than one dot found');
				dotFound = false;
				this.ifValid = false;
           		break;
    		}
    		dotFound = true; // set dot as found
        }
    }
    
	this.dotPos_val = val; // assume is int and set decimal value to false.

	if(dotPos != -1){	// check if input is decimal
        this.decimal = true;

		if(dotRight.length === 0){ // if there's no number after the dot add ".0"
           rounded = '.00';           
        }
    
		// convert strings into numbers, calculate as integer total of pennies and put in global variable.
		this.dotPos_val = Number(dotLeft)*100+Number(rounded.substring(2,4));   		
	}
    
    // call function to calculate minimum coins needed.
    this.coinsCalc(this.dotPos_val);
}

// calculate minimum coins needed recursive function.
gotChange.prototype.coinsCalc = function(val){
    var total = 0;
	// in a first instance, if total pennies is >= 200
	if(val >= this.coins[this.curr][0]){
		// copy value minus 200 to new variable
		total = val - this.coins[this.curr][0];
		// increment one to associate array in the 200 key
		this.coins[this.curr][1]++;
		// call same function and check for 200 again.
		this.coinsCalc(total);

	// if total pennies is < 200
	} else {
		// copied variable equals tested variable
		total = val;
		// if copied variable is bigger than 0
		if(total > 0){
			// up one level in object current level being tested
			this.curr++;
			// call same function and check fo 100 this time.
			this.coinsCalc(total);
		// or print the result and reset values.	
		} else {
			this.printResult(this.ifValid);
		}
	}
}


gotChange.prototype.printResult = function(validation){
	var sentence = '',
		totalCoins = 0;
    
    if(validation === true){ // if input value is valid go through coins object and print arrays in order
        for(var i=0; Object.keys(this.coins).length > i; i++){
            if(this.coins[i][1] > 0){ // if array isn't empty print it
                if (this.coins[i][0] % 100 === 0 ){ // if it's multiple of 100 - print as pounds
                    sentence += this.coins[i][1]+'x '+this.coins[i][0]/100+'£, ';
                } else { // otherwise print as pennies
                    sentence += this.coins[i][1]+'x '+this.coins[i][0]+'p, ';
                }
                totalCoins += this.coins[i][1]; // calc total coins by iterating each one of them to variable
            }
            this.coins[i][1] = 0; // reset coins value to 0
	    }
        
	var checkCurr = this.decimal === true ? this.dotPos_val/100+'£.' : this.inputEl.value+'p.'; // variable encapsulating decision on which format to print
	sentence = sentence.slice(0, -2) + ') to make a total of '+ checkCurr; // mount and set sentence
	this.resEl.innerHTML = 'You need at least '+totalCoins+' coin(s) ('+sentence.split(-1); // print sentence to result paragraph element
	        
    } else { // if input value is invalid, set/print sentence and reset valid variable back to true
        sentence += 'Invalid value. Please type only integer or decimal numbers bigger than 0.';
        this.resEl.innerHTML = sentence;
        this.ifValid = true;
    }

    //reset all variables
    this.resetAll();
}

// function responsible for reseting all variables in order to make input available to run program again.
gotChange.prototype.resetAll = function(validation){
	this.curr = this.dotPos = 0;
    this.decimal = false;
    this.inputEl.value = '';
}
