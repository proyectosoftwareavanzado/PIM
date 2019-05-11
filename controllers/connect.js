'use strict'

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '35.225.155.247',
    user     : 'root',
    password : '123',
    database : 'PIM'
});

module.exports = {
    connection
}