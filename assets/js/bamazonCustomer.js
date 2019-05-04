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

function listItems() {
  var query = "SELECT item_id, product_name, price FROM products WHERE stock_quantity > 0";
  connection.query(query, function(err, res) {
    console.log("Calculating....")
    for (var i = 0; i < res.length; i++) {
      console.log(`
        Product ID:  ${chalk.yellow(res[i].item_id)}
        Item:        ${chalk.cyan(res[i].product_name)}
        Price:       ${chalk.cyan("$")}${chalk.cyan(res[i].price.toFixed(2))}
        `
      );
    }
    inquirer
    .prompt({
      name: "readyToBuy",
      type: "list",
      message: "Scroll up to see what we have to offer! Once you are ready to purchase, select 'okay'!",
      choices: ["okay", "I've changed my mind!"]
    })
    .then(function(answer) {
      console.log(answer.readyToBuy);
      if(answer.readyToBuy === "okay") {
        console.log("okay!!");
        purchasePrompt();
      }
      else {
        console.log(`${chalk.cyan("That's okay, come see us again when you want to shop for some awesome outdoor gear and apparel!")}`)
        connection.end();
      }
    });
  });
}

function purchasePrompt() {
  inquirer
  .prompt([
    {
      name: "productID",
      type: "number",
      message: "Please enter the Product ID for the item you would like to purchase",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log("That's not a number!!");
        return false;
      }
    },
    {
      name: "amount",
      type: "number",
      message: "How many do you want to purchase?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log("That's not a number!!");
        return false;
      }
    }
  ])
  .then(function(answer) {
    if (answer.itemQuantity === "0") {
      productOverview();
    }
    else {
      console.log("OR ELSE!!!");
      //Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
      var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
      connection.query(query,{ item_id: answer.productID }, function(err, res) {
      //However, if your store does have enough of the product, you should fulfill the customer's order & update SQL database to refelect the remaining quantity
        if (res[0].stock_quantity > 0) {
          console.log("Processing your order....");
          var productID = answer.productID;
          var newQuantity = parseInt(res[0].stock_quantity - answer.amount);
          updateStock(productID, newQuantity, answer.amount);
          //Once the order goes through, show the customer the total cost of their purchase
        }
        //If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
        else {
          console.log("I'm sorry! We are all out of that item. Please come again soon!!")
          connection.end();
        }
      });
    }
  });
};

function updateStock(id, newQuantity, quantity) {
  var query = "UPDATE products SET ? WHERE ?";
  connection.query(query,[{ stock_quantity: newQuantity }, { item_id: id }],function(error) {
    if (error) throw err;
    calculatePrice(id, quantity);
  });
}

function calculatePrice(id, quantity) {
  var query = "SELECT product_name, price FROM products WHERE ?";
  connection.query(query, { item_id: id }, function(err, res) {
    var totalPrice = parseInt(res[0].price * quantity);
    console.log(totalPrice);
  });
  connection.end();
}



//Challenge#3
// -- 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// --    * Make sure your app still updates the inventory listed in the `products` column.