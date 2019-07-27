//budget controller
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type) {
        var sum = 0;

        data.allItems[type].forEach(function(curr) {
            sum += curr.value;
        });

        data.totals[type] = sum;
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

        deleteItem: function(type, id) {

            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function() {

            //1.calculate income and expenses
            calculateTotal('expense');
            calculateTotal('income');

            //2.calculate budget: income-expenses
            data.budget = data.totals.income - data.totals.expense;

            //3.calculate the percentage of income spent
            if (data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function() {
            data.allItems.expense.forEach(function(cur) {
                cur.calcPercentage(data.totals.income);
            });
        },

        getPercentage: function() {
            var allPercentage = data.allItems.expense.map(function(cur) {
                return cur.getPercentage();
            });
            return allPercentage;
        },


        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            };
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
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncValue: '.budget__income--value',
        budgetExpValue: '.budget__expenses--value',
        budgetExpPercentage: '.budget__expenses--percentage',
        container: '.container',
        itemPercentage: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type) {

        var numSplit, int, dec;

        /*
        + or - before number,
        exactly 2 decimal points,
        comma separating the thousands

        rounding off
        2000 -> +2,000.00
         */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 2310 -> 2,310
        }

        dec = numSplit[1];

        return (type === 'expense' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //Will be either Inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };


        },

        addListItem: function(obj, type) {

            var html, newHtml, element;

            //create html string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type === 'expense') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }


            //replace placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));



            //insert html into the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorId) {

            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },

        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputType);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {

                current.value = "";

            });
            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {

            var type;
            obj.budget > 0 ? type = 'income' : type = 'expense';

            document.querySelector(DOMstrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.budgetIncValue).textContent = formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMstrings.budgetExpValue).textContent = formatNumber(obj.totalExpense, 'expense');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.budgetExpPercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.budgetExpPercentage).textContent = '---';
            }

        },

        displayPercentage: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.itemPercentage);

            nodeListForEach(fields, function(current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: function() {
            var now, year, month, monthNames;
            now = new Date();

            year = now.getFullYear();
            monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            document.querySelector(DOMstrings.dateLabel).textContent = monthNames[now.getMonth()] + ', ' + year;
        },

        changeType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(curr) {

                curr.classList.toggle('red-focus');

            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updateBudget = function() {

        //1.calculate the budget
        budgetCtrl.calculateBudget();

        //2.read the percentage from the budget controller
        var budget = budgetCtrl.getBudget();

        //3.update the ui with new percentages
        UICtrl.displayBudget(budget);
    };

    var updatePercentage = function() {

        //1.calculate the percentage
        budgetCtrl.calculatePercentage();

        //2.return the percentage
        var percentage = budgetCtrl.getPercentage();

        //3.display the percentage on ui
        UICtrl.displayPercentage(percentage);

    };

    var cntrlAddItem = function() {

        var input, newItem;

        //1.get the input field data
        input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2.add the item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3.add item to UI
            UICtrl.addListItem(newItem, input.type);

            //4.clear the fields
            UICtrl.clearFields();

            //5.calculate and update budget
            updateBudget();

            //6.calculate and update percentage
            updatePercentage();
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            // income-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1.delete the item from data structure
            budgetCtrl.deleteItem(type, ID);

            //2.delete the item from user interface
            UICtrl.deleteListItem(itemID);

            //3.update and show new budget
            updateBudget();

            //4.update and display new percentages
            updatePercentage();
        }

    };

    return {
        init: function() {
            console.log('Application has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    };

})(budgetController, UIController);

controller.init(); //init function with all the event listener.