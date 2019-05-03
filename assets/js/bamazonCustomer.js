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
    inquirer
    .prompt({
      name: "welcomePrompt",
      type: "list",
      message: `
        ${chalk.cyan.bold("WELCOME TO BAMAZON!")}
        ${chalk.reset.italic.magenta("A CLI Outdoor Gear & Apparel shopping app!")}
          
        ${chalk.cyan.green("Would you like to see our list of products?")}
        `,
      choices: ["YES PLEASE!", "No thank you!"]
    })
    .then(function(answer) {
      console.log(answer);
      if (answer.welcomePrompt === "YES PLEASE!") {
        listItems();
      }
      else {
        console.log(`${chalk.cyan("That's okay, come see us again when you want to shop for some awesome outdoor gear and apparel!")}`)
        connection.end();
      }

    });
}


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
//The first should ask them the ID of the product they would like to buy.
//The second message should ask how many units of the product they would like to buy.
function quantityPrompt(itemID) {
    inquirer
      .prompt({
        name: "itemQuantity",
        type: "number",
        message: "How many of this item would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
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

function listItems() {
  var query = "SELECT product_name, price FROM products WHERE stock_quantity > 0";
  connection.query(query, function(err, res) {
    console.log("Calculating....")
  for (var i = 0; i < res.length; i++) {
    console.log(`
      Item:  ${chalk.cyan(res[i].product_name)}
      Price: ${chalk.cyan("$")}${chalk.cyan(res[i].price.toFixed(2))}
      `
    );
  }
  inquirer
  .prompt({
    name: "readyToBuy",
    type: "list",
    message: "Do you want to make a purchase?",
    choices: ["YES!", "No thanks!"]
  })
  .then(function(answer) {
    if(answer.readToBuy === "YES!") {
      purchasePrompt();
    }
    else{
      console.log(`${chalk.cyan("That's okay, come see us again when you want to shop for some awesome outdoor gear and apparel!")}`)
      connection.end();
    }
  });
};

function purchasePrompt() {
  var query = "SELECT product_name, price FROM products WHERE stock_quantity > 0";
  connection.query(query, function(err, res) {
    console.log("Calculating....")
  for (var i = 0; i < res.length; i++) {
    console.log(`
      Item:  ${chalk.cyan(res[i].product_name)}
      Price: ${chalk.cyan("$")}${chalk.cyan(res[i].price.toFixed(2))}
      `
    );
  }
}
//Challenge#3
// -- 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// --    * Make sure your app still updates the inventory listed in the `products` column.