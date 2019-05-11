'use strict'
var getlorem = require('getlorem');
const conn = require('../connect').connection;
const conn2 = require('../connect').connection;
var miCategoria = 1;
var nuevosProductos = 25;
var nuevasCategorias =10;
var cambioPeriodo = 1;
var reporte1 = 0;
var reporte2 = 0;
var reporte3 = 0;
/**
 * 
 * 
PIM
1.Cantidad de productos simulados total / por período.
2.Cantidad de solicitudes de catálogo total / por período.
3.Cantidad de productos enriquecidos / total / por tienda / por categoría / por período.
 * 
 */
async function obtenerCatalogo(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    /**
     * 
     * PRODUCTOS
     * 
     */
    await conn.query('SELECT * from Producto;', function (error, results, fields) {

        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        //CONSULTA DE MASTER DE CATEGORIA
        conn.query('SELECT * from CategoriaProducto;', function (errorMas, resultsMas, fields) {
            if (errorMas) {

                console.log(errorMas);
                res.jsonp({ errorMas: 'Error de conexión a la base de datos.' })
            }
            //consulta de categoria
            conn.query('SELECT * from Categoria;', function (errorCat, resultsCat, fields) {
                if (errorCat) {

                    console.log(errorCat);
                    res.jsonp({ errorCat: 'Error de conexión a la base de datos.' })
                }
                var jsonCategorias = '{"categorias":\n[\n';

                //---------------------JSON CATEGORIAS-------------------
                for (let index = 0; index < resultsCat.length; index++) {
                    const element = resultsCat[index];
                    jsonCategorias = jsonCategorias + '{\n' +
                        '"id": ' + element.idCategoria +
                        ',\n"nombre": "' + element.nombre + '"' +
                        ',\n"padre": ' + element.idPadre +
                        '\n}';
                    if (index != resultsCat.length - 1) {
                        jsonCategorias = jsonCategorias + ',\n';
                    } else {
                        jsonCategorias = jsonCategorias + '\n';
                    }
                }
                jsonCategorias = jsonCategorias + '],\n';
                var jsonProductos = '"productos":\n[\n'
                //console.log(jsonCategorias);
                //----------------------PRODUCTOS------------------
                for (let index = 0; index < results.length; index++) {
                    const element = results[index];
                    var state = 'true';
                    if (element.estado == 0) {
                        state = 'false';
                    }
                    //se debe de buscar las categorias y concatenarlas
                    var categoriasProductos = [];
                    var cateProductos = '';
                    var i = 0;
                    for (let index = 0; index < resultsMas.length; index++) {
                        const element2 = resultsMas[index];
                        if (element2.idProducto == element.idProducto) {
                            categoriasProductos[i] = element2.idCategoria;
                            i++;
                        }
                    }
                    //concateno las categorias de cada producto
                    for (let index = 0; index < categoriasProductos.length; index++) {
                        const element3 = categoriasProductos[index];
                        if (index != categoriasProductos.length - 1) {
                            cateProductos = cateProductos + element3 + ',';
                        } else {
                            cateProductos = cateProductos + element3;
                        }
                    }
                    jsonProductos = jsonProductos + '{\n' +
                        '"nombre": "' + element.nombre +
                        '",\n"sku": "' + element.SKU +
                        '",\n"categorias":[' + categoriasProductos + ']' +
                        ',\n"activo":' + state +
                        '\n}';
                    if (index != results.length - 1) {
                        jsonProductos = jsonProductos + ',\n';
                    } else {
                        jsonProductos = jsonProductos + '\n';
                    }
                }
                jsonProductos = jsonProductos + ']\n}';
                var jsonCatalogo = JSON.parse(jsonCategorias + jsonProductos)
                //var jsonCatalogo = jsonCategorias + jsonProductos;
                reporte2++;
                console.log(reporte2);
                res.jsonp(jsonCatalogo);
            });
        });
        //  res.jsonp(jsonCatalogo);
    });
}
function enriquecerProducto(req, res) {
    let skus = '';
    skus = req.body.arreglo
    console.log(skus);
   /* if (req.params.SKUs) skus = req.params.SKUs;
    else skus = req.query.SKUs;*/
   // let skusJson = JSON.parse(skus);
   
    let skusCade = '';
    for (let index = 0; index < skus.length; index++) {
        const element = skus[index];
        if (index != skus.length - 1) {
            skusCade = skusCade + "'" + element + "',";
        } else {
            skusCade = skusCade + "'" + element + "'";
        }
        reporte2++;
    }
    //console.log(skusCade);
    conn.query('SELECT * FROM Producto WHERE SKU IN(' + skusCade + ');', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        conn.query('SELECT * from CategoriaProducto;', function (errorMas, resultsMas, fields) {
            if (errorMas) {

                console.log(errorMas);
                res.jsonp({ errorMas: 'Error de conexión a la base de datos.' })
            }
            conn.query('SELECT * from ProductoImagen;', function (errorImg, resultsImg, fields) {
                if (errorImg) {

                    console.log(errorImg);
                    res.jsonp({ errorImg: 'Error de conexión a la base de datos.' })
                }
                let jsonProductos = '[\n'
                //console.log(jsonCategorias);
                //----------------------PRODUCTOS------------------
                for (let index = 0; index < results.length; index++) {
                    const element = results[index];
                    var state = 'true';
                    if (element.estado == 0) {
                        state = 'false';
                    }
                    //se debe de buscar las categorias y concatenarlas
                    var categoriasProductos = [];
                    var cateProductos = '';
                    let i = 0;
                    for (let index = 0; index < resultsMas.length; index++) {
                        const element2 = resultsMas[index];
                        if (element2.idProducto == element.idProducto) {
                            categoriasProductos[i] = element2.idCategoria;
                            i++;
                        }
                    }
                    //concateno las categorias de cada producto
                    for (let index = 0; index < categoriasProductos.length; index++) {
                        const element3 = categoriasProductos[index];
                        if (index != categoriasProductos.length - 1) {
                            cateProductos = cateProductos + element3 + ',';
                        } else {
                            cateProductos = cateProductos + element3;
                        }
                    }
                    //se debe de buscar las IMAGENES y concatenarlas
                    let ImagenesProductos = [];
                    let ImgProductos = '';
                    i = 0;
                    for (let index = 0; index < resultsImg.length; index++) {
                        const element2 = resultsImg[index];
                        if (element2.idProducto == element.idProducto) {
                            ImagenesProductos[i] = element2.idImagen;
                            i++;
                        }
                    }
                    //concateno tlas categorias de cada producto
                    for (let index = 0; index < ImagenesProductos.length; index++) {
                        const element3 = ImagenesProductos[index];
                        if (index != ImagenesProductos.length - 1) {
                            ImgProductos = ImgProductos + element3 + ',';
                        } else {
                            ImgProductos = ImgProductos + element3;
                        }
                    }
                    jsonProductos = jsonProductos + '{\n' +
                        '"sku": "' + element.SKU +
                        '",\n"nombre": "' + element.nombre +
                        '",\n"precio_lista": ' + element.precioLista +
                        ',\n"descripcion_corto": "' + element.nombre +
                        '",\n"descripcion_larga": "' + element.nombre +
                        '",\n"imagenes":[' + ImgProductos + ']' +
                        ',\n"categorias":[' + categoriasProductos + ']' +
                        ',\n"activo":' + state +
                        '\n}';
                    if (index != results.length - 1) {
                        jsonProductos = jsonProductos + ',\n';
                    } else {
                        jsonProductos = jsonProductos + '\n';
                    }
                }
                jsonProductos = jsonProductos + ']';
                //console.log(jsonProductos);

                res.jsonp(JSON.parse(jsonProductos));
            });
        });

    });
}
async function deProducto(req, res) {
    let skus = '';
    if (req.params.SKUs) skus = req.params.SKUs;
    else skus = req.query.SKUs;
    await conn.query('SELECT SKU,estado FROM Producto WHERE estado = 1 limit 3;', function (error, results, fields) {
        if (error) {

            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        //console.log(results)
        conn.query('UPDATE Producto SET Producto.estado = 0 WHERE Producto.SKU in (' + results[0].SKU + ',' + results[1].SKU + ',' + results[2].SKU + ');', function (error2, results2, fields) {
            if (error2) {

                console.log(error2);
                res.jsonp({ error2: 'Error de conexión a la base de datos.' })
            }

            res.jsonp(results2);
        });
    });
}
async function periodo(req, res) {
    await conn.query('INSERT INTO Reporte(periodo,productosSimulados,solicitudesCatalogo,productosEnriquecidos) VALUES(' + cambioPeriodo + ',' + reporte1 + ',' + reporte2 + ',' + reporte3 + ');', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        cambioPeriodo++;
        reporte1 = 0;
        reporte2 = 0;
        reporte3 = 0;
        conn.query('SELECT * FROM Reporte;', function (error2, results2, fields) {
            if (error2) {
                console.log(error2);
                res.jsonp({ error2: 'Error de conexión a la base de datos.' })
            }
            res.jsonp(results2);
        });
    });
}
async function truncarReporte(req, res) {
    conn.query('TRUNCATE Reporte;', function (error, results, fields) {
        if (error) {

            console.log(error);
            res.jsonp({ 9: 'Error de conexión a la base de datos.' })
        }
        res.jsonp("Se trunco la tabla reporte");
    });
}
async function recargarProductos(req, res) {
    let vecNumCategorias =[];
    let vecNumProductos = [];
	var procs = getlorem.words(5);
	procs = procs.replace('.','').replace(',','');
	var vecProc = procs.split(' ');
    let insertProductos='';
    for (let index = 0; index < vecProc.length; index++) {
        const element = vecProc[index];
        insertProductos = insertProductos+"('"+vecProc[index]+"','"+vecProc[index]+Date.now()+"',"+(Math.random() * (500.99 - 5.00) + 5.00).toFixed(2)+
                        ",'"+vecProc[index]+" caracteristicas','"+vecProc[index]+" caracteristicas',1";
        if (index!=vecProc.length-1) {
            insertProductos = insertProductos + '),';
        }else{
            insertProductos = insertProductos + ')';
        }
        nuevosProductos++;
        vecNumProductos[index] = nuevosProductos;
    }
	var cats = getlorem.words(2);
	cats = cats.replace('.', '').replace(',','');
	var vecCats = cats.split(' ');
    let insertCategoria='';
    
    for (let index = 0; index < vecCats.length; index++) {
        const element = vecCats[index];
        insertCategoria = insertCategoria +"('"+vecCats[index]+"','"+vecCats[index]+" descripcion',5";
        if (index!=vecCats.length-1) {
            insertCategoria = insertCategoria + '),';
        }else{
            insertCategoria = insertCategoria + ')';
        }
        nuevasCategorias++;
        vecNumCategorias[index]=nuevasCategorias;
    }
    let insertCategoriaProducto = '';
    let insertImagenes = '';
    for (let index = 0; index < vecProc.length; index++) {
        const element = vecProc[index];
        insertCategoriaProducto = insertCategoriaProducto + '('+ vecNumProductos[index]+','+vecNumCategorias[0];
        insertImagenes = insertImagenes + '('+"'ruta"+vecNumProductos[index]+"',"+vecNumProductos[index];
        if (index!=vecProc.length-1) {
            insertCategoriaProducto = insertCategoriaProducto + '),';
            insertImagenes = insertImagenes + '),';
        }else{
            insertCategoriaProducto = insertCategoriaProducto + ')';
            insertImagenes = insertImagenes + ')';
        }
    }
    console.log(insertCategoria);
    conn.query('INSERT INTO Producto(nombre,sku,precioLista,caracteristicas,descripcion,estado) VALUES'+insertProductos+';', function (error, results, fields) {
        if (error) {
            console.log(error);
            res.jsonp({ error: 'Error de conexión a la base de datos.' })
        }
        conn.query('INSERT INTO Categoria(nombre,descripcion,idPadre) VALUES'+insertCategoria+';', function (error2, results2, fields) {
            if (error2) {
                console.log(error2);
                res.jsonp({ error2: 'Error de conexión a la base de datos.' })
            }
            conn.query('INSERT INTO CategoriaProducto(idProducto,idCategoria) VALUES'+insertCategoriaProducto+';', function (error3, results3, fields) {
                if (error2) {
                    console.log(error2);
                    res.jsonp({ error2: 'Error de conexión a la base de datos.' })
                }
                conn.query('INSERT INTO ProductoImagen(ruta,idProducto) VALUES'+insertImagenes+';', function (error4, results4, fields) {
                    if (error4) {
                        console.log(error4);
                        res.jsonp({ error4: 'Error de conexión a la base de datos.' })
                    }
                   res.jsonp("Todo lo ingreso a la bd"); 
                });
            });
        });
    });
}
module.exports = {
    obtenerCatalogo,
    enriquecerProducto,
    deProducto,
    periodo,
    truncarReporte,
    recargarProductos
}