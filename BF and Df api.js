/*
*The Inheritance will involve a depth first search:
* This entails going to the deepest node first before 
*it can return back to a different layer
*/


// Defining the queue funtion for the traverseBf function
function Queue() {
this.dataStore = []
this.enqueue = function enqueue(element) {
this.dataStore.push(element)
}
this.dequeue = function dequeue() {
return this.dataStore.shift()
}
this.front = function front() {
return this.dataStore[0]
}
this.back = function back() {
return this.dataStore[this.dataStore.length - 1]
}
}



//Building The algorithm

// Create a node function that injects new nodes onto a parent

function Node(data){

	//assign object data to the arguments data
	this.data = data;
	//No parents are assigned initially
	this.parent = null;

	//No children as well initially
	this.children = [];

	//the parent and children 
	//are assigned dynamically as they are made available
}

//functionthat creates our tree 
function Tree(data){
	//Creating a new instance of the node functional object
	var node = new Node(data);

	//assign the node created as a tree in its current perspective/location
	this._root = node;

}

//Creating the depth first search 
/*
The depth first search finds the furthest most node
first all the way to the root of the tree. Its more 
like a backpropagation method
*/
//functional tree creation. To be called during search

Tree.prototype.traverseDF = function(callback){

	//Recursive function that is self invoking, prpagating and terminating
	//takes the current node as a parameter, 
	(function recurse(currentNode){

//loops through the treen odes untill there are no more branchs to loop through
//If it reaches the end of one branch it heads back to another till all branches are exhausted
		for(var i = 0, length = currentNode.children.length; i< length; i++){
			recurse(currentNode.children[i]);
		}

		//calling the call back constructor on the node 
		callback(currentNode);

		//assign the node to begin search from
	})(this._root);
};

//Creating the depth first search 
/*
The Bredth first search finds the widest most node
first all the way to the narrowest node of the tree.
*/

//functional tree creation. To be called during search
Tree.prototype.traverseBF = function(callback) {

	//instantiating a new queue
	var queue = new Queue();

	//Add a node that invoked the function to the instance to the queue
	queue.enqueue(this._root);

	//new variable assigned to the node added to the queue
	currentTree = queue.dequeue();

	// Check every node iff there exists a parent node 
	while(currentTree){
		//loop through each node and get every branch found
		for(var i = 0, length = currentTree.children.length; i< length; i++){
			queue.enqueue(currentTree.children[i]);
		}

		callback(currentTree);
		currentTree = queue.dequeue();
	}

};

//check in a tree for a specific node

Tree.prototype.contains = function(callback, traversal){
	//this binds traversal to the invoking tree
	//callback invoked on every treee
	traversal.call(this, callback);
};


//Adding a new node to a tree
Tree.prototype.add = function(data, toData, traversal){

	//variable initialization
	var child = new Node(data),
	parent = null,
	callback = function(node){ //assigning the parent to a node if it exists
		if(node.data === toData){
			parent = node;
		}
	};

	this.contains(callback, traversal);

//check if a parent exists else throw a not found error
	if(parent){

	//if a parent is found, the new node is pushed into the array
		parent.children.push(child);
	//new node is made the parent of the branch
		child.parent = parent;
	}else{
		throw new Error('Cannot add node. No parent found...');
	}
};


//removing a node from a parent
Tree.prototype.remove = function(data, fromData, traversal){
	//variable initialization
	var tree = this,
	parent = null,
	childToRemove = null,
	index;

//creating the call back function that sets the parent nodein each branch
	var callback = function(node){
		if(node.data === fromData){
			parent = node;
		}
	};
	this.contains(callback, traversal);

	if(parent){

		//findIndex defined at the bottom
		index = findIndex(parent.children, data);

		if(index === undefined){
			throw new Error('No node to remove');
		}else{

			//using a javascript function to shift a node out of the array
			childToRemove = parent.children.splice(index, 1);
		}
	}else{
		throw new Error('No parent class found');
	}
	return childToRemove;
};

function findIndex(arr, data){
	var index;
// trying to find whether the delete index exists
	for(var i = 0; i< arr.length; i++){
		if(arr[i].data === data){
			index = i;
		}
	}
	return index;
}
