/**
 * Created by tonyg on 26/10/2016.
 */

//Manage expense records

var ExpenseManager = (function() {
    var expenses = [];

    return {
        updateExpense: function(date, amount, item, tags) {
            var index = this.findExpense(date);
            var expense;
            if(index < 0) {
                expense = new Expense(date, amount, item, tags);
                expenses.push(expense);
            } else {
                expense = expenses[index];
                expense.update(amount, item, tags);
            }

            return expense;
        },

        findExpense: function(date) {
            var expense, i;
            for(i=0; i<expenses.length; ++i) {
                expense = expenses[i];
                if(expense.year === date.year && expense.month === date.month && expense.day === date.day) {
                    return i;
                }
            }

            return -1;
        },

        getWeeklyExpense: function() {

        },

        getMonthlyExpense: function() {

        }
    }
})();

