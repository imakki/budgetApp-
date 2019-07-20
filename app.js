//budget controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            //create new item based on 'inc' or 'exp'
            if (type === "expense") {
                newItem = new Expense(ID, des, val);
            } else if (type === "income") {
                newItem = new Income(ID, des, val);
            }

            //push item into data structure
            data.allItems[type].push(newItem);

            //return new element
            return newItem;

        },
        testing: function() {
            console.log(data);
        }
    };

})();

//UI controller
var UIController = (function() {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either Inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };


        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

//Global app controller
var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {

        var DOM = UIController.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', cntrlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13) {
                cntrlAddItem();
            }
        });
    };

    var cntrlAddItem = function() {

        var input, newItem;

        //1.get the input field data
        input = UIController.getInput();

        //2.add the item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3.add item to UI

        //4.calculate the budget

        //5.display budget on UI
    };

    return {
        init: function() {
            setUpEventListeners();
        }
    };

})(budgetController, UIController);

controller.init(); //init function with all the event listeners