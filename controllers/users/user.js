'use strict'

const conn = require('../connect').connection;

async function listUsers(req,res){
    await conn.query('SELECT * from Categoria;', function (error, results, fields) {
        if (error) 
        {
            
            console.log(error);
            res.jsonp({error: 'Error de conexión a la base de datos.'})
        }
        
        res.jsonp(results);
    });
}

module.exports = {
    listUsers
}