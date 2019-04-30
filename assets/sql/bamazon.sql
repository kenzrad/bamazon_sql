-- 1. Create a MySQL Database called `bamazon`.

-- 2. Then create a Table inside of that database called `products`.

-- 3. The products table should have each of the following columns:

--    * item_id (unique id for each product)

--    * product_name (Name of product)

--    * department_name

--    * price (cost to customer)

--    * stock_quantity (how much of the product is available in stores)

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).




-- ### Challenge #3: Supervisor View (Final Level)

-- 1. Create a new MySQL table called `departments`. Your table should include the following columns:

--    * department_id

--    * department_name

--    * over_head_costs (A dummy number you set for each department)

-- 2. Modify the products table so that there's a product_sales column, and modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

--    * Make sure your app still updates the inventory listed in the `products` column.
