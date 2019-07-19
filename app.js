//budget controller
var budgetController = (function() {

    //some code

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

    var DOM = UIController.getDOMstrings();

    var cntrlAddItem = function() {
        //1.get the input field data
        var input = UIController.getInput();
        console.log(input);
        //2.add the item to budget controller

        //3.add item to UI

        //4.calculate the budget

        //5.display budget on UI
    }

    document.querySelector(DOM.inputButton).addEventListener('click', cntrlAddItem);

    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            cntrlAddItem();
        }
    });

})(budgetController, UIController);