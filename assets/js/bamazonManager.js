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
        console.log("");
        console.log(chalk.blue("---------------------------------------------------------"));
        returnToManager();
    });
    //takes you to inquirer to select what to do next
    
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
    //takes you to inquirer to select what to do next
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    returnToManager();
    });
}

// Running will allow the user to add stock to any product
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
        console.log(`${chalk.red("Please try again, that is not a number")}`);
        return false;
      }
    },
    {
      name: "amount",
      type: "number",
      message: `${chalk.green("How many items do you want to add? Press '0' to return to home without updating inventory.")}`,
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        console.log(`${chalk.red("Please try again, that is not a number")}`);
        return false;
      }
    }
  ])
  .then(function(answer) {
    console.log("");
    console.log("");
    if (answer.itemQuantity === "0") {
        returnToManager();
    }
    else {
        //check inventory
        var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE ?";
        connection.query(query,{ item_id: answer.productID }, function(err, res) {
            if (err) {
                console.log(`${chalk.red("There was an error, are you sure that's a valid product? Please try again")}`);
                returnToManager();
                throw err
            }
            //fulfill update inventory
            var productID = answer.productID;
            var newQuantity = parseInt(res[0].stock_quantity + answer.amount);
            updateStock(productID, newQuantity, answer.amount);
            console.log(`${chalk.magenta("Inventory updated for Product ID: ")}${chalk.yellow(productID)}${chalk.magneta("!")}`);

            });
        }
        console.log("");
        console.log(chalk.blue("---------------------------------------------------------"));
        returnToManager();
    });
    
};

// Running will allow the user to add new items
function manageProductList() {
    console.log("");
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    console.log(`
        ${chalk.cyan.bold("BAMAZON MANAGER")}

        ${chalk.reset.italic.magenta("Product List Manager")}
    `);
    console.log("");
    console.log(chalk.blue("---------------------------------------------------------"));
    console.log("");
    console.log("");
    
    inquirer
    .prompt([
        {
            name: "newItem",
            type: "prompt",
            message: `${chalk.green("What would you like to add?")}`,
        },
        {
            name: "itemDepartment",
            type: "list",
            message: `${chalk.green("Select a department for the new item:")}`,
            choices: ["Apparel", "Fly Fishing", "Climbing"]
        },
        {
            name: "initialInventory",
            type: "number",
            message: `${chalk.green("What is the initial inventory for this item?")}`,
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                console.log(`${chalk.red("Please try again, that is not a number")}`);
                return false;
            }
        },
        {
            name: "itemPrice",
            type: "number",
            message: `${chalk.green("What is the price?")}`,
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                console.log(`${chalk.red("Please try again, that is not a number")}`);
                return false;
            }
        }
    ])
    .then(function(answer) {
        var newProduct = answer.newProduct;
        var newItemDepartment = answer.itemDepartment;
        var newItemPrice = answer.itemPrice;
        var newItemStock = answer.initialInventory;
        console.log(`${chalk.magenta("Your New Product:")}
            Item:        ${chalk.cyan(newProduct )}
            Department:  ${chalk.cyan(newItemDepartment)}
            Price:       ${chalk.cyan("$")}${chalk.cyan(newItemPrice)}
            Quantity:    ${chalk.cyan(newItemStock)}
            `
        );
        confirmNewItem(newProduct, newItemDepartment, newItemPrice, newItemStock);
    });
}

function confirmNewItem(product, department, price, stock) {
    inquirer
    .prompt([
        {
            name: "confirmItem",
            type: "list",
            message: `${chalk.cyan.green("Do you want to add this item to BAMAZON?")}
        
            `,
            choices: ["yes", "no"]
        }]
    )
    .then(function(answer) {
        switch(answer.confirmItem) {
            case ("yes"):
            addToInventory(product, department, price, stock);
            break;

            case ("no"):
            returnToManager();
            break;
        }
    });
}

function addToInventory(product, department, price, stock) {
    console.log(`${chalk.italics.magenta("Adding this product to the BAMAZON inventory...")}`);
    var query = "INSERT INTO products SET ?";
    connection.query(query,
        {
            product_name: product, 
            department_name: department, 
            price: price, 
            stock_quantity: stock
        },
        function(err, res) {
            if (err) throw err        
            console.log(res.affectedRows + " product(s) inserted!\n");
            console.log("");
            console.log(chalk.blue("---------------------------------------------------------"));
            returnToManager();
        }
    );
}

function returnToManager() {
    inquirer
    .prompt([
        {
            name: "confirmReturn",
            type: "list",
            message: `${chalk.cyan.green("Return to BAMAZON manager options?")}
        
            `,
            choices: ["yes", "no"]
        }]
    )
    .then(function(answer) {
        switch(answer.confirmReturn) {
            case ("yes"):
            managerOptions();
            break;

            case ("no"):
            goodbye();
            break;
        }
    });
}
function goodbye() {
    console.log("");
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log(`
        ${chalk.magenta("Goodbye!")}
    
    `);
    console.log(chalk.blue("--------------------------------------------------------"));
    console.log("");
    connection.end();
}