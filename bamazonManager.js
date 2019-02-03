var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'bamazon'
});

connection.connect();


function manager() {
    inquirer
        .prompt([
            {
                name: "menuChoice",
                type: "list",
                message: "What product would you like to purchase?",
                choices: [
                    'View Products for Sale',
                    'View Low Inventory',
                    'Add to Inventory',
                    'Add New Product'
                ]
            }
        ])
        .then(function (answers) {
            switch (answers.menuChoice) {
                case 'View Products for Sale':
                    productsSale();
                    break;
                case 'View Low Inventory':
                    viewLowInventory();
                    break;
                case 'Add to Inventory':
                    addToInventory();
                    break;
                case 'Add New Product':
                    addNewProduct();
                    break;
                default:
                    break;
            }

        });
}


function productsSale() {
    connection.query('SELECT products.ID, products.product_name, products.price, products.stock_quantity FROM products', function (err, res) {
        if (err) throw err;
        console.log("Products for sale:");
        for (var i = 0; i < res.length; i++) {
            console.log(`
Product ID: ${res[i].ID}
Product Name: ${res[i].product_name}
Product Price: ${res[i].price}
Product Quantity: ${res[i].stock_quantity}
-----------------`
            );
        }
    });
    connection.end();

}

function viewLowInventory() {
    connection.query('SELECT products.ID, products.product_name, products.stock_quantity FROM products WHERE products.stock_quantity < 5', function (err, res) {
        if (err) throw err;
        console.log(`
Low Quantity items:    
-----------------------------------------
        `);
        for (var i = 0; i < res.length; i++) {
            console.log(`Product Name: ${res[i].product_name} || Quantity: ${res[i].stock_quantity}`)
        }
    });
    connection.end();
}

function addToInventory() {
    inquirer.prompt([
        {
            name: "productChoice",
            type: "input",
            message: "What ID would you like to add product to?",
        },
        {
            name: "productQty",
            type: "input",
            message: "How much do you want to add?",
        }

    ]).then(function (answers) {
        connection.query('UPDATE products SET stock_quantity = (stock_quantity + ?) WHERE ID = ?', [answers.productQty, answers.productChoice], function (err, res) {
            if (err) throw err;
        })
        connection.query('SELECT * FROM products WHERE ID = ?', [answers.productChoice], function (err, res) {
            if (err) throw err;
            console.log("New Product Quantity = " + res[0].stock_quantity);
        });
        connection.end();
    });
}
function addNewProduct() {
    console.log("Add New Product");

    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "What [PRODUCT] are you going to add?",
        },
        {
            name: "departmentName",
            type: "input",
            message: "What [DEPARTMENT] does that belong in?",
        },
        {
            name: "productPrice",
            type: "input",
            message: "What is the [PRICE] of the product?",
        },
        {
            name: "productQty",
            type: "input",
            message: "What [QUANTITY]?",
        }

    ]).then(function (answers) {
        connection.query('INSERT INTO products (ID, product_name, department_name, price, stock_quantity) VALUES (ID,?,?,?,?)', [answers.productName, answers.departmentName, answers.productPrice, answers.productQty], function (err, res) {
            if (err) throw err;
        });
        connection.query('SELECT * FROM products WHERE product_name = ?', [answers.productName], function (err, res) {
            if (err) throw err;
            console.log(`
NEW PRODUCT ADDED TO INVENTORY:
-----------------------------------------            
Product ID: ${res[0].ID}  ||  Product Name: ${res[0].product_name}  ||  Product Price: ${res[0].price}  ||  Product Quantity: ${res[0].stock_quantity}
-----------------------------------------
            `);
        })
        connection.end();
    });

}

manager();