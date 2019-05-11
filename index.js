'use strict'

const app = require('./app');
const config = require('./config');
var reportProductosSimulados=0;
var reportCatalogo=0;
var reportEnriquecidos=0;
//Iniciamos el servidor
app.listen(config.port, () => {
	console.log(`Aplicación corriendo en http://localhost:${config.port}`);
	
});

