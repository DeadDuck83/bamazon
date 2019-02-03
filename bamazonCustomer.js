var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'bamazon'
});

connection.connect();



connection.query('SELECT * FROM products', function (err, res) {
    if (err) throw err;
    for(var i = 0; i < res.length; i++){
        console.log(`Product ID: ${res[i].ID}  ||  Product Name: ${res[i].product_name}  ||  Product Price: $${res[i].price}  ||  Product Quantity: ${res[i].stock_quantity}
            `);
    };
    wishTobuy();
})


function wishTobuy() {
    inquirer
        .prompt([
            {
                name: "productID",
                type: "input",
                message: "What [PRODUCT ID] would you like to purchase?"
            },
            {
                name: "productQty",
                type: "input",
                message: "What [QUANTITY] would you like to purchase?"
            }
        ])
        .then(function (answers) {
            connection.query('SELECT products.ID, products.stock_quantity, products.price FROM products WHERE ? = ID',[answers.productID], function (err, res) {
                if (err) throw err;
                if(answers.productQty <= res[0].stock_quantity){
                    connection.query('UPDATE products SET stock_quantity = ? WHERE ID = ?',[(res[0].stock_quantity - answers.productQty), answers.productID], function(err, res){
                        if (err) throw err;
                    });
                    console.log("Total Price: $"+ res[0].price * answers.productQty);
                }else{
                    console.log("Insufficient quantity!");
                }
                connection.end();

            });

        });
}
