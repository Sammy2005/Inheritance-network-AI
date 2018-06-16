//Clause processing functions
var clause = document.getElementById('clause');
var submitClause = document.getElementById('submitClause');
var submitQuery = document.getElementById('submitQuery');
var warehouse = [];
var counter = 0;
var out = [];

				submitClause.onclick = function(){

					//Grabbing the clause statement from the input box
					var data = clause.value;

					//Calling the split function hence creating an 
					//array out of the string
					data = data.split(" ");

					//Feeding through the iput to a data manager to parse the data
					dataManager(data[0], data[2], data[1]);

					/*
					*accesing the DOM element that hold the output
					*and appending to it the input from the user
					*/

					var input = document.getElementById('input');

					var div = document.createElement("P")
				    var dd = document.createTextNode(data);
				    div.setAttribute('id', counter);

				    div.setAttribute("class", "w3-padding w3-light-grey");

				    div.innerHTML = data[0] + " "+data[1]+" "+ data[2]+"        <button class='w3-btn w3-red' onclick='deleting("+counter+");'>delete</button>";

				    input.appendChild(div);
				    console.log(div);
				    counter++;

				}

				/*
				*This function is responsible for acting on the input query 
				*from the user.
				*/
				submitQuery.onclick = function(){
					//retrieving the input from the users input
					var output = document.getElementById('output');
					var query = document.getElementById('query').value;

					//breaking up the input into an array of strings
					var q = query.split(" ");

					//function to identify the proposition used between the strings
					let rule = processRule(q[1]);

					//Function to produce the longest possible path 
					out = brain(q[0], q[2], rule);

					var i = 0;

					while(i < out.length){
						out.splice(i, 0, "IS-A"); //adds the proposition string before every clause

						i+=2;
					}
					out.shift();


					//Displaying the longest path to the user
					out.forEach(function(element, index){

						var div = document.createElement('span');
						var dd = document.createTextNode(element);
						div.setAttribute("class", "w3-light-grey");

						div.innerHTML = " "+element+" ";

						output.append(div);

				});

				
				//function to produce and output the prefered pathto the user
				var outInferential = preferredPath(q[0], q[2]);

				var Preferred = document.getElementById('Preferred');

						outInferential.forEach(function(element, index){
							var div = document.createElement('span');
							var dd = document.createTextNode(element);
							div.setAttribute("class", "w3-light-grey w3-padding-top w3-padding-bottom");

							div.innerHTML = " "+element+" ";

							Preferred.append(div);
						});

				//function to produce the shortest path taking the longest path as an argument
				var shortPath = shortestPath(q[0], q[2]);


				//outputting the shortest path to the dom
				outPut(shortPath);

				}

//Outputs the shortestpath to the browser
			function outPut(short){

				var shortput = document.getElementById('short');

				short.forEach(function(element, index){

					var div = document.createElement('span');
					var dd = document.createTextNode(element);
					div.setAttribute("class", "w3-light-grey");

					div.innerHTML = " "+element+" ";

					shortput.append(div);

			});
			}
//Functions controlling input


/*
*Acts as a network manager by relaying data depending on
*task to be performed on it.
*/

				var dataManager = function(data1, data2, rule){

					/*
					*Function processes the proposition used and
					*helps in the identification of the stack to be used
					*to store the data
					*/
					var store = processRule(rule);

					//function that analyses the input and stores it into the knowledge base
					dataWarehouse(data1, data2, store);
				}

/*
*Tries to identify the relationship between the elements
*/
			function processRule(rule){
					if(rule==="IS-A"){
						return true;
					}else if(rule==="IS-NOT-A"){
						return false;
					}else{
						throw new Error("The proposition Logic rule is not defined, please check the syntax: Expected (IS-A or IS-NOT-A)");
					}
				}


/*
*Separate the different forms of data eithet negative or positive and creating the object to be stord
*/

					var dataWarehouse = function(input1, input2, location){
						//Declaration of our stacks arrays to store input
						var	pos = [];
						var neg = [];

						/*
						*If the location variable which is the rule/proposition 
						*logic identifier has a value true. The input values 
						*are stored in the pos[] stack while if it is false 
						*the values are stored in the neg[] stack.
						*/
						if(location===true){ //proposition is positive "IS-A"

							pos.push(input1, input2); //both data strings are stored into the pos[] stack
							
						}else if(location===false){ //proposition is false ie "IS-NOT-A"

							neg.push(input1, input2);  //both data strings are stored into the neg[] stack
						}

						var dataToStore = {'neg': neg, 'pos': pos}; //The resulting stacks are pushed into the object

						Store(dataToStore);	//function to store the data in the knowledge base
						
					}

					/*
*Function to store the object data into the warehouse array
*/
				var Store = function(object){

					warehouse.push(object); //object is pushed into the Knowledge base

					return warehouse;

				}


//Query processing functions

/*
*A function that process the output and creates a logical inheritance tree for display
*/

	//declaring variables to be used.
	var hierarchy = [];		//holds the longest path
	var preferredP = [];	//holds the preferred path
	var shortArray = [];	//holds the shortest path

var brain = function(data1, data2, location){
	//check that it is a positive statement
	if(location ===true){				
		warehouse.forEach(function(element, index){
			//using back propagation to solve ambinguity
			if(element.pos[1]===data2){
				//adding the last term first that matches the second term in the query
				if(hierarchy.indexOf(element.pos[1]) < 0){
				hierarchy.unshift(data2);
				}
				//if non matches the first query term we loop through the knowledge base again
				if(element.pos[0]!==data1){
					warehouse.forEach(function(e, i){
						//checking whether the term may be found in stack with the fist item matching the 
						//first query item
						if(e.pos[1]===element.pos[0] && e.pos[0]===data1){
							warehouse.forEach(function(item,id){
								if(e.pos[1]===item.pos[1] && item.pos[0]!==data1){
									if(hierarchy.indexOf(item.pos[1]) < 0 ){
									hierarchy.unshift(item.pos[1]);
									}
									brain(data1, item.pos[0], location);
								}else{

									//if it exixts we push the first term to the stack and exit out
									if(hierarchy.indexOf(data1) < 0 ){
									hierarchy.unshift(e.pos[1]);
									hierarchy.unshift(data1);

									return hierarchy;
									}
									return hierarchy;
								}
							});
							
						}else{
							//if not stack matches that, we recurse throught the function again with the new value for input 
							//two being the element in top of the stack
							brain(data1,element.pos[0],location);
						}
					});
				
				}

			}

		});

	}
	return hierarchy;
}
		//Generating a preferred path
			var preferredPath = function(data1, data2){
				//checking through the negative stack since for freffered path when we reach a negative statement, we stop
				warehouse.forEach(function(element, index){
					//checking for matching attributes from the negative stack
					if(element.neg[1]===data2 && preferredP.indexOf(data2) < 0){
						//if we find a stack whose second item matches our second input
						//we push that item into the array.
						preferredP.unshift(data2);
						preferredP.unshift("IS-NOT-A")

						//the first item is then pushed into a recursive array 
						getPos(data1, element.neg[0]);
					}
					return preferredP;
				});

				return preferredP;

			}

			//retrieving the head of the inheritance network
			var getPos = function(data1, data2){
				//looping through the knowledge base
			warehouse.forEach(function(e,i){
				//we first find the longest head path
				if(e.pos[0]!==data1 && e.pos[1]===data2){
					//the method keeps recursing until it reaches the end of the network
					preferredP.unshift(data2);
					preferredP.unshift("IS-A");
					getPos(data1, e.pos[0]);

				}else if(e.pos[0]===data1 && e.pos[1]==data2){
					//if we get lucky and there is a shortest path as our head for the network
					//we add it onto the array stack
					preferredP.unshift(data2);
					preferredP.unshift("IS-A");
					preferredP.unshift(data1);

					return preferredP;
				}
			});
			return preferredP;
			}


var shortestPath = function(data1, data2){
	//looping through the knowledge base
	warehouse.forEach(function(element, index){
		//we find O(1) where the first stack matches the inputs query
		if(element.pos[1]===data2 && element.pos[0]===data1){
			//we add it into the array and exit out
			shortArray.unshift(data2);
			shortArray.unshift("IS-A");
			shortArray.unshift(data1);

			return shortArray;

			//if we are unlucky we recurse through the method picking the last item first and pushing
			//it into the stack array until we reach the end of the network.
		}else if(element.pos[1]===data2 && element.pos[0]!==data1 && shortArray.indexOf(element.pos[1]) < 0){
			shortArray.unshift(data2);
			shortArray.unshift("IS-A");

			//recursing with new inputs 
			shortestPath(data1, element.pos[0]);
		}

	});

	return shortArray;
}

//delete method
function deleting(id){
	//we retrieve the id of the elements position
			var element = document.getElementById(id);
			//we remove the element from the view
            element.parentNode.removeChild(element);
            var elementId = parseInt(id,10);	//converting the id to integer
            //deleting the data from the knowledge base
            warehouse[elementId].pos = [];
            warehouse[elementId].neg = [];
}
