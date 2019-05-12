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

// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale
function productOverview() {
  console.log("");
  console.log("");
  console.log(chalk.blue("--------------------------------------------------------"));
  console.log("");
  console.log(`
    ${chalk.cyan.bold("WELCOME TO BAMAZON!")}
     
    ${chalk.reset.italic.magenta("A CLI Outdoor Gear & Apparel shopping app!")}
  `);
  
  console.log("");
  console.log(chalk.blue("---------------------------------------------------------"));
  console.log("");
  console.log("");
    inquirer
    .prompt({
      name: "welcomePrompt",
      type: "list",
      message: `${chalk.cyan.green("Would you like to see our list of products?")}
        
        `,
      choices: ["YES PLEASE!", "No thank you!"]
    })
    .then(function(answer) {
      console.log("");
      console.log("");
      if (answer.welcomePrompt === "YES PLEASE!") {
        listItems();
      }
      else {
        console.log("");
        console.log(chalk.blue("---------------------------------------------------------"));
        console.log("");
        console.log(`${chalk.cyan("That's okay, come see us again when you want to shop for some awesome outdoor gear and apparel!")}`)
        console.log("");
        console.log(chalk.blue("---------------------------------------------------------"));
        console.log("");
        connection.end();
      }

    });
}

function listItems() {
  var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity > 0";
  connection.query(query, function(err, res) {
    console.log(`${chalk.magenta("Items in stock:")}`)
    for (var i = 0; i < res.length; i++) {
      console.log(`
        Product ID:  ${chalk.yellow(res[i].item_id)}
        Item:        ${chalk.cyan(res[i].product_name)}
        Price:       ${chalk.cyan("$")}${chalk.cyan(res[i].price.toFixed(2))}
        In Stock:    ${chalk.cyan(res[i].stock_quantity)}
        `
      );
    }
    inquirer
    .prompt({
      name: "readyToBuy",
      type: "list",
      message: `${chalk.green("Scroll up to see what we have to offer! Once you are ready to purchase select")}${chalk.magenta.bold("'okay'")}
       
       `,
      choices: ["okay", "I've changed my mind!"]
    })
    .then(function(answer) {
      if(answer.readyToBuy === "okay") {
        console.log("");
        console.log("");
        purchasePrompt();
      }
      else {
        console.log(`
          ${chalk.magenta("That's okay, come see us again when you want to shop for some awesome outdoor gear and apparel!")}`)
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
      message: `${chalk.green("Please enter the Product ID for the item you would like to purchase")}`,
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log(`${chalk.red("That's not a number!!")}`);
        return false;
      }
    },
    {
      name: "amount",
      type: "number",
      message: `${chalk.green("How many do you want to purchase?")}`,
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log(`${chalk.red("That's not a number!!")}`);
        return false;
      }
    }
  ])
  .then(function(answer) {
    console.log("");
    console.log("");
    if (answer.itemQuantity === "0") {
      productOverview();
    }
    else {
      //check inventory
      var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
      connection.query(query,{ item_id: answer.productID }, function(err, res) {
        //fulfill order and run stock update function
        if (res[0].stock_quantity > answer.amount) {
          var productID = answer.productID;
          var newQuantity = parseInt(res[0].stock_quantity - answer.amount);
          updateStock(productID, newQuantity, answer.amount);
        }
        //insuffucient inventory
        else {
          console.log(`
            ${chalk.red("OH NO!!!!")}
             
            ${chalk.magenta("We don't have enough in stock of that items.")}
            
            ${chalk.green("Please try again...")}
          `);
          purchasePrompt();
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
    console.log(`
      ${chalk.cyan("You total comes to")}${chalk.bold.yellow(" $")}${chalk.bold.yellow(totalPrice.toFixed(2))}
        
      ${chalk.cyan("You're order will be placed once you figure out how to pay me!")}
  
      ${chalk.green("Thank you for trying to shop at BAMAZON!")}
    `);
  });
  connection.end();
}



/////I'm going to do this SUNDAY!!!!!!!!!!!!!////////////
//Challenge#3
// -- 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

// --    * Make sure your app still updates the inventory listed in the `products` column.