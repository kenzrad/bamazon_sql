![bamazon](readMe/bamazon.png)

Bamazon is a shopping prototype CLI app that uses a SQL database to track orders, update inventories, and determines trending products


## Overview

The bamazon app will take in orders from customers and deplete stock from the store's inventory. Bamazon also tracks product sales across departments and generates reports of the highest-grossing departments in the store.

Make sure you save and require the MySQL and Inquirer npm packages in your homework files--your app will need them for data input and storage.

# Requirements

* Node.js
* MySQL
* Inquirer.js
* Chalk.js


## How it works

When you enter BAMAZON, the app will ask you if you want to view the inventory. If you select yet, it will show you a list of items in stock:
![List](readMe/list.png)

If you want to purchase more items than there are in stock (for instance, 11 silk shirts), the app will let you know that there is insufficient inventory for your purchase.
![Silk](readMe/silk.png)

![No Silk](readMe/nosilk.png)

It will then ask you if you want to buy something else! If you select an item and an amount that is in stock, BAMAZON will calculate a total price for you and update the inventory on the SQL database!
![ATC](readMe/atc.png)

![Buy ATC](readMe/yesatc.png)

See the app in action on youTube!
- - -

