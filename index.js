
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const express = require('express');
const app = express();
var elasticsearch = require('elasticsearch');


var client = new elasticsearch.Client({
    host: 'localhost:9200'
})



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//creation of the index: $CURL -XPUT http://localhost:9200/cars

/* Experienced a problem of storage for '/populate' because of my low-storage on my computer.
	If this error happends:
	
		Launch this command:
		curl -XPUT -H "Content-Type: application/json" http://localhost:9200/cars/_settings -d '{"index.blocks.read_only_allow_delete": null}'
	
	
	This works for a moment, but comes back after a few indexing. Didn't manage to insert all the models due to that.
*/



/*Populate Endpoint */
app.get('/populate', function (req, res) {

    async function getApiBrands() {
        const brands = await getBrands();
        return brands;
    }

    getApiBrands().then(brands => {
        brands.forEach(async brand => {
            const models = await getModels(brand)
            console.log(models);
            models.forEach(model => {
                client.create({
                    index: 'cars',
                    type: 'model',
                    id: model.uuid, //wasn't present in the previous version of node-car-api, had to update
                    body: model
                }, function (error, response) {
                    if(error) {
                    	console.log("nop");
                        console.log(error);
                    }
                    else{
	                    console.log("ok");
                    }
                })
            })
        })
    })
})

app.listen(6969, function () {
    console.log('Express server is listening on port 6969!')
});




/* Suv Endpoint */
app.get('/suv', function (req, res) {
    var results = []
    client.search({
        index: 'cars',
        type: 'model',
        body: {
            size: req.params.size,
            offset: req.params.offset,
            query: {
                match_all: {},
            },
            sort: {
                "volume.keyword": {
                    order: "desc" 
                }
            }
        }
    }).then(res => {
        res.hits.hits.forEach(model => {
            results.push(model['_source']);
        });
    }).then(() => {
        res.json(results);
    });
})



/*older functions */

/*
async function getBrands_(){
	
	return await getBrands();

}

async function getModelFromBrand(brand){
	return await getModels(brand)
}






async function getModelsByBrands(brands) {
    var models = [];
    for (let brand of brands) {
        console.log(brand);
        const model = await getModelFromBrand(brand);
        model.push({
            brand: brand,
            model: model
        });
    }
    return models;
}


getBrands_().then(function(result){
	getModelsByBrands(result).then(function(model){
		console.log(model);
	})
	
})
*/


