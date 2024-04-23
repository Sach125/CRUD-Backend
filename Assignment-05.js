/*  Name:Sachin Samayam
    Student Number: 22251923
 */
// I used Readline, MongoDB, Mongoose, Express, Node and JavaScript for this.

const express = require('express');  // Express framework for Node.js
const mongoose = require('mongoose');  // MongoDB ORM for Node.js
const { User, Manufacturer, Address, TotalOrder } = require('./models/Assignment-05.js');  // Importing models
const readline = require('readline');  // Module for reading input from command line


const app = express();// Create an Express application instance
const rl = readline.createInterface({// Create a readline interface for command-line input
    input: process.stdin,
    output: process.stdout
});



// Set up middleware to parse incoming JSON requests and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// MongoDB connection
mongoose.connect('mongodb+srv://samayamsachin10:lz6BAztWbA9J01iz@backenddb.baivy75.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackEndDB', {
}).then(() => {
    console.log('Connected to MongoDB');

    // Start server
    app.listen(3000, () => {
        console.log('Server running on port 3000');
        main(); // Start back to main menu
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// functions
const createProduct = async () => {
    //questions for Users details
    rl.question('Enter title: ', async (title) => {
        rl.question('Enter first name: ', async (firstName) => {
            rl.question('Enter surname: ', async (surname) => {
                rl.question('Enter mobile: ', async (mobile) => {
                    rl.question('Enter email: ', async (email) => {
                        try {
                            // Prompt for address details
                            rl.question('Enter address line 1: ', async (addressLine1) => {
                                rl.question('Enter address line 2: ', async (addressLine2) => {
                                    rl.question('Enter town: ', async (town) => {
                                        rl.question('Enter county/city: ', async (countyCity) => {
                                            rl.question('Enter EirCode: ', async (eirCode) => {
                                                try {
                                                    // Create address document
                                                    const address = await Address.create({ AddressLine1: addressLine1, AddressLine2: addressLine2, Town: town, CountyCity: countyCity, EirCode: eirCode });
                                                    // Create user document and link to address
                                                    const user = await User.create({ Title: title, FirstName: firstName, Surname: surname, mobile: mobile, Email: email, Address: address._id });
                                                    console.log('User created successfully!');
                                                    console.log(user);
                                                    rl.question('Do you want to buy a phone? (yes/no): ', async (answer) => {
                                                        if (answer.toLowerCase() === 'yes') {
                                                            try {
                                                                // Fetch available phones
                                                                const phones = await Manufacturer.find({});
                                                                let manufacturertemp;
                                                                let pricetemp;
                                                                let modeltemp;
                                                                console.log('Available Phones:');
                                                                console.log('------------------------------------------');
                                                                console.log('|   ID   |   Manufacturer   |   Model   |');
                                                                console.log('------------------------------------------');
                                                                phones.forEach(phone => {
                                                                    console.log(`| ${phone._id} | ${phone.Manufacturer} | ${phone.Model} |  ${phone.Price}`);
                                                                    manufacturertemp=phone.Manufacturer;
                                                                    pricetemp=phone.Price;
                                                                    modeltemp=phone.Model;
                                                                });
                                                                console.log('------------------------------------------');
                                                                rl.question('Enter the ID of the phone you want to buy: ', async (phoneId) => {
                                                                    rl.question('Enter the quantity you want to buy: ', async (quantity) => {
                                                                        try {
                                                                            const selectedPhone = await Manufacturer.findById(phoneId);
                                                                            if (!selectedPhone) {
                                                                                console.error('Phone not found');
                                                                                main(); // Restart back to main menu
                                                                                return;
                                                                            }
                                                                            const totalus = await TotalOrder.create({ Title: title, FirstName: firstName, Surname: surname, mobile: mobile, Email: email,AddressLine1: addressLine1, AddressLine2: addressLine2, Town: town, CountyCity: countyCity, EirCode: eirCode,Quantity:quantity ,Manufacturer: manufacturertemp, Model: modeltemp, Price: pricetemp });
                                                                            console.log(totalus);
                                                                        } catch (error) {
                                                                            console.error('Error placing order:', error.message);
                                                                            main(); // Restart back to main menu
                                                                        }
                                                                        main();
                                                                    });
                                                                });
                                                            } catch (error) {
                                                                console.error('Error fetching phones:', error.message);
                                                                main(); // Restart back to main menu
                                                            }
                                                        } else {
                                                            main(); // Restart back to main menu
                                                        }
                                                    });
                                                } catch (error) {
                                                    console.error('Error creating user:', error.message);
                                                    main(); // Restart back to main menu
                                                }
                                            });
                                        });
                                    });
                                });
                            });
                        } catch (error) {
                            console.error('Error creating product:', error.message);
                            main(); // Restart back to main menu
                        }
                    });
                });
            });
        });
    });
};

const getProducts = async () => {
    try {//try catch method which takes everything till address and prints it in a table 
        const orders = await TotalOrder.find({});
        console.log('List of Users with Address:');
        console.log('-------------------------------------------------------------------');
        console.log('|      Name        |   Email   |   Phone Number   |    Address   ');
        console.log('-------------------------------------------------------------------');
            orders.forEach(order =>{
                const { _id, FirstName, Email, Title,Surname,mobile, AddressLine1, AddressLine2, Town, CountyCity, EirCode } = order;
                console.log(`| ${Title}  ${FirstName} ${Surname}| ${Email} | ${mobile} | ${AddressLine1}, ${AddressLine2}, ${Town}, ${CountyCity}, ${EirCode} `);
            });
        console.log('--------------------------------------------------------------------');
    } catch (error) {
        console.error('Error listing users:', error.message);
    }
    main(); // Restart back to main menu
};


//this method 
const updateProducts = async () => {
    try {
        const orders = await TotalOrder.find({});
        console.log('List of Users with Address:');
        console.log('-------------------------------------------------------------------');
        console.log('|      ID        |   Name   |   Phone Number   |    Email   ');
        console.log('-------------------------------------------------------------------');
        orders.forEach(order =>{
            const { _id, FirstName, Email, Title,Surname,mobile, AddressLine1, AddressLine2, Town, CountyCity, EirCode } = order;
            console.log(`| ${_id}  ${FirstName} ${Surname}| ${Email} | ${mobile}`);
        });
        console.log(` `);
        rl.question('Enter user ID to update: ', async (id) => {
            const order1 = await TotalOrder.findById(id);
            if (!order1) {
                console.error('User not found');
                main(); // Restart back to main menu
                return;
            }
            rl.question('Enter new title: ', async (title) => {
                rl.question('Enter new first name: ', async (firstName) => {
                    rl.question('Enter new surname: ', async (surname) => {
                        rl.question('Enter new mobile: ', async (mobile) => {
                            rl.question('Enter new email: ', async (email) => {
                                rl.question('Enter new address line 1: ', async (addressLine1) => {
                                    rl.question('Enter new address line 2: ', async (addressLine2) => {
                                        rl.question('Enter new town: ', async (town) => {
                                            rl.question('Enter new county/city: ', async (countyCity) => {
                                                rl.question('Enter new EirCode: ', async (eirCode) => {
                                                    try {
                                                        order1.Title = title || order1.Title;
                                                        order1.FirstName = firstName || order1.FirstName;
                                                        order1.Surname = surname || order1.Surname;
                                                        order1.mobile = mobile || order1.mobile;
                                                        order1.Email = email || order1.Email;
                                                        order1.AddressLine1 = addressLine1 || order1.AddressLine1;
                                                        order1.AddressLine2 = addressLine2 || order1.AddressLine2;
                                                        order1.Town = town || order1.Town;
                                                        order1.CountyCity = countyCity || order1.CountyCity;
                                                        order1.EirCode = eirCode || order1.EirCode;
                                                            await order1.save();
                                                        console.log('User updated successfully!');
                                                        console.log(order1);
                                                    } catch (error) {
                                                        console.error('Error updating user:', error.message);
                                                    }
                                                    main(); // Restart back to main menu
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
    }

};

//this command is for the owner to add more phones or items so people can see
const putManufacture = async () => {
    rl.question('Enter manufacturer name: ', async (manufacturer) => {
        rl.question('Enter model number: ', async (model) => {
            rl.question('Enter price: ', async (price) => {
                try {
                    const newManufacture = await Manufacturer.create({ Manufacturer: manufacturer, Model: model, Price: price });
                    console.log('Manufacturer created successfully!');
                    console.log(newManufacture);
                } catch (error) {
                    console.error('Error creating manufacturer:', error.message);
                }
                main(); // Restart back to main menu
            });
        });
    });
};


//a method to get what the manufacture is offering like what phones he has to over for what price
const getManufacture = async () => {
    try {
        const manufacturers = await Manufacturer.find({});
        console.log('List of Manufacturers:');
        console.log('--------------------------------------------------');
        console.log('   Manufacturer   |   Model        |   Price   |');
        console.log('--------------------------------------------------');
        manufacturers.forEach(manufacturer => {
            console.log(`      ${manufacturer.Manufacturer}       |   ${manufacturer.Model}    |      ${manufacturer.Price}  |`);
        });
        console.log('--------------------------------------------------');
    } catch (error) {
        console.error('Error listing manufacturers:', error.message);
    }
    main(); // Restart back to main menu
};


//a method to get the totalorder with the price and address and users
const getTotalOrder = async () => {
    try {
        const orders = await TotalOrder.find({});
        console.log('Total Orders:');
        console.log('---------------------------------------------------------------------------------------------------------------------------------------');
        console.log('|   Title    |   First Name    |   Surname    |   Mobile    |   Email     |   Address    |   Model     |   Price     |   Quantity    |');
        console.log('---------------------------------------------------------------------------------------------------------------------------------------');
        orders.forEach(order => {
            //taking every thing stored in totalorder and printing it out putting it in order and printing
            const {Title, FirstName, Surname, mobile, Email, AddressLine1,AddressLine2,Town,CountyCity,EirCode, Model, Price, Quantity,Manufacturer} = order;
            console.log(`|   ${Title}       |   ${FirstName}    |   ${Surname}      |   ${mobile}       |   ${Email}    |   ${AddressLine1}, ${AddressLine2}, ${Town}, ${CountyCity}, ${EirCode}    |   ${Manufacturer}      |   ${Model}       |   ${Price}    |   ${Quantity}   |`);
        });
        console.log('----------------------------------------------------------------------------------------------------------------------------------------');
    } catch (error) {
        console.error('Error fetching total orders:', error.message);//catching error and sending it to terminal
    }
    main(); // Restart back to main menu
};

//this method deletes the products by taking the ID created by MongoDB
const deleteProducts = async () => {
    const orders = await TotalOrder.find({});
    console.log('List of Users with Address:');
    console.log('-------------------------------------------------------------------');
    console.log('|      ID        |   Name   |   Phone Number   |    Email   ');
    console.log('-------------------------------------------------------------------');
    orders.forEach(order =>{
        const { _id, FirstName, Email, Title,Surname,mobile, AddressLine1, AddressLine2, Town, CountyCity, EirCode } = order;
        console.log(`| ${_id}  ${FirstName} ${Surname}| ${Email} | ${mobile}`);
    });
    console.log(` `);
    rl.question('Enter product ID to delete: ', async (id) => {
        try {//taking in the id and using findIFAndDelete
            const product = await TotalOrder.findByIdAndDelete(id);
            if (!product) {//error case if not found
                console.error('User not found');
            } else {
                console.log('User deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting product:', error.message);//catch error and log it to the terminal
        }
        main(); // Restart back to main menu
    });
};

const main = () => {

    //this is the main method where everything starts
    console.log('Welcome to Sachins Mobile Data Base');
    rl.question('Choose an action :- GetRetrieve Customer Details (Type R) | Create Customer (Type C) | Update Customer (Type U) | Delete Customer (Type D) | List Phones (Type listphones) | Add Phones (Type addphones) | Total Order Display (Type total)| exit (Type exit) ): ', (choice) => {
        switch (choice) {//switch case to start
            case 'R':
                getProducts();      //RETRIEVE FUNCTIONALITY
                break;
            case 'C':
                createProduct();    //CREATE FUNCTIONALITY
                break;
            case 'U':
                updateProducts();   //UPDATE FUNCTIONALITY
                break;
            case 'D':
                deleteProducts();   //DELETE FUNCTIONALITY
                break;
            case 'listphones':
                getManufacture();   //listing phones
                break;
            case 'total':
                getTotalOrder();    //getting total order
                break;
            case 'addphones':
                putManufacture();   //adding phones
                break;
            case 'exit':
                console.log('GoodBye!!'); //quiting
                rl.close();
                mongoose.disconnect();
                break;
            default:
                console.log('Invalid choice');
                main(); // Restart back to main menu
                break;
        }
    });
};


/* Before Starting this, please do 
npm init
npm i express
npm i readline-sync
npm i mongodb
npm i mongoose or
npm i init
npm i express readline-sync mongodb mongoose
 */