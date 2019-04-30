var mysql = require("mysql");
var chalk = require("chalk")
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    
    productOverview();
  });

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
function productOverview() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", 
    function(err, res) {
      if (err) throw err;
      console.log(res);
      connection.end();
    });
}

//The first should ask them the ID of the product they would like to buy.
function idPrompt() {
    inquirer
      .prompt({
        name: "itemID",
        type: "list",
        message: "Which items would you like to buy (item ID)?",
        choices: ["1", "2", "3", "Show me the options again, please"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid === "Show me the options again, please") {
          productOverview();
        }
        else {
          quantityPrompt(answer.itemID);
        }
      });
  }

//The second message should ask how many units of the product they would like to buy.
function quantityPrompt(itemID) {
    inquirer
      .prompt({
        name: "itemQuantity",
        type: "list",
        message: "How many of this item would you like to purchase?",
        choices: [""]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.itemQuantity === "0") {
          productOverview();
        }
        else {
            //Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
            //If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
            //However, if your store does have enough of the product, you should fulfill the customer's order & update SQL database to refelect the remaining quantity
            //Once the order goes through, show the customer the total cost of their purchase
        }
      });
  }


//Challenge#3
// -- 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// --    * Make sure your app still updates the inventory listed in the `products` column.