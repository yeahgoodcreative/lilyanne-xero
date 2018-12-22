// Modules
var mongoose = require('mongoose')
var XeroClient = require('xero-node').AccountingAPIClient

// Xero Config
var config = {
    appType: 'private',
    consumerKey: 'K1NA1PB857ZP0FNUAN6HI8OR2VLCWH',
    consumerSecret: 'FVSQXNLVLBNRYKM25USJTPKF8MHEAO',
    privateKeyPath: __dirname + '/privatekey.pem'
}


// Xero Init
var xero = new XeroClient(config)


// Mongoose Models
var Order = require('./models/order.js')


// Mongoose Connection
mongoose.connect('mongodb://157.230.40.86:27017/lilyanneintegration', {useNewUrlParser: true, authSource: 'admin', user: 'yeahgood', pass: 'beginnings01'})
var db = mongoose.connection


// Mongoose DB log errors
db.on('error', console.error.bind(console, 'Connection error: '))


// Mongoose DB opened
db.once('open', function() {

    // Find all orders without xero
    Order.find({xeroInfo: null}).sort({}).exec(function(err, orders) {
        if (err) {
            console.log(err)
        }

        // Iterate through orders
        for (order of orders) {

            // Create due date
            var dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + 30)

            // A place to store line items
            var lineItems = []

            // Iterate through order items (bydesign line items)
            for (orderItem of order.orderDetailsInfo) {
                // Create line item object
                var lineItem = {
                    Description: orderItem.productId + ' - ' + orderItem.description,
                    Quantity: orderItem.quantity,
                    UnitAmount: orderItem.price,
                    // ItemCode: orderItem.productId,
                    AccountCode: '200',
                }

                // Push line item to array
                lineItems.push(lineItem)
            }

            // Create promise to create invoice
            var invoiceCreatePromise = xero.invoices.update({
                Type: 'ACCREC',
                Contact: {
                    ContactStatus: 'ACTIVE',
                    AccountNumber: order.orderInfo.repNumber,
                    Name: order.orderInfo.billName1,
                    EmailAddress: order.orderInfo.billEmail,
                    Addresses: [
                        {
                            AddressType: 'STREET',
                            AddressLine1: order.orderInfo.billStreet1,
                            AddressCity: order.orderInfo.billCity,
                            AddressRegion: order.orderInfo.billState,
                            PostalCode: order.orderInfo.billPostalCode
                        }
                    ],
                    Phones: [
                        {
                            PhoneType: 'DEFAULT',
                            PhoneNumber: order.orderInfo.billPhone
                        }
                    ]
                },
                LineItems: lineItems,
                DueDate: dueDate,
                Status: 'AUTHORISED'
            })

            // // Get promised invoice
            invoiceCreatePromise.then(function(resolve) {
                console.log(resolve)
            })

            // console.log(order.orderInfo.billEmail)
        }
    })

})