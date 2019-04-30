DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  item_id INT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  --product_sales DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);


SELECT * FROM products;
--Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).


--Challenge #3: Supervisor View

-- CREATE TABLE departments (
--   department_id INT NOT NULL,
--   department_name VARCHAR(100) NULL,
--   over_head_costs DECIMAL(10,2) NULL,
--   stock_quantity INT NULL,
--   PRIMARY KEY (item_id)
-- );


