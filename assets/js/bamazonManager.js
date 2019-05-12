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

    //takes you to inquirer to select what to do next
    managerOptions();
});



function managerOptions() {
    console.log("");
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    console.log(`
      ${chalk.cyan.bold("BAMAZON MANAGER")}
    `);
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    console.log("");
    console.log("");

    inquirer
    .prompt({
        name: "managerPrompt",
        type: "list",
        message: `${chalk.cyan.green("Would do you want to do?")}
          
          `,
        choices: ["View Products for Sale", "View Low Inventory Products", "Manage Product Inventory", "Manage Product List", "Mischief Managed"]
    })
    .then(function(answer) {
        console.log("");
        console.log("");

        switch(answer.managerPrompt)  {
            case "View Products for Sale":
            viewProducts();
            break;

            case "View Low Inventory Products":
            viewLowInventory();
            break;

            case "Manage Product Inventory":
            manageInventory();
            break;

            case "Manage Product List":
            manageProductList();
            break;

            case "Mischief Managed":
            goodbye();
            break;
        }
    });
}


//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

// Running this application will display the ids, names, department, and prices of products for sale
function viewProducts() {
    console.log("");
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    console.log(`
        ${chalk.cyan.bold("BAMAZON MANAGER")}

        ${chalk.reset.italic.magenta("Product Overview")}
        `);
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    console.log("");
    console.log("");
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`
                Product ID:  ${chalk.yellow(res[i].item_id)}
                Item:        ${chalk.cyan(res[i].product_name)}
                Department:  ${chalk.cyan(res[i].department_name)}
                Price:       ${chalk.cyan("$")}${chalk.cyan(res[i].price.toFixed(2))}
                Quantity:    ${chalk.cyan(res[i].stock_quantity)}
                `
            );
        }
    });
    //takes you to inquirer to select what to do next
    managerOptions();
};

// Running will display all products that have an inventory < 5
function viewLowInventory() {
    console.log("");
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    console.log(`
        ${chalk.cyan.bold("BAMAZON MANAGER")}

        ${chalk.reset.italic.magenta("Low Inventory Items")}
    `);
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    console.log("");
    console.log("");
    
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`
                Product ID:  ${chalk.yellow(res[i].item_id)}
                Item:        ${chalk.cyan(res[i].product_name)}
                Quantity:    ${chalk.bold.red(res[i].stock_quantity)}
                `
            );
        }
    });
    //takes you to inquirer to select what to do next
    managerOptions();
}

function manageInventory() {
    console.log("");
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    console.log(`
        ${chalk.cyan.bold("BAMAZON MANAGER")}

        ${chalk.reset.italic.magenta("Restock Inventory")}
    `);
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    console.log("");
    console.log("");
    
  inquirer
  .prompt([
    {
      name: "productID",
      type: "number",
      message: `${chalk.green("Please enter the Product ID for the item you would like to restock")}`,
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