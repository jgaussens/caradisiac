
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const express = require('express');
const app = express();
var elasticsearch = require('elasticsearch');


//Main functions

var client = new elasticsearch.Client({
    host: 'localhost:9200'
})



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//creation of the index: $CURL -XPUT http://localhost:9200/cars
app.get('/populate', function (req, res) {


//if error of storage curl -XPUT 'localhost:9200/my_index/_settings' -d '{ "index" : { "blocks": { "read_only_allow_delete": "false"}}}'
console.log("dzad");
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
                    id: model.uuid,
                    body: model
                }, function (error, response) {
                    if(error) {
                        console.log(error);
                    }
                })
            })
        })
    })
})

app.listen(6969, function () {
    console.log('Express server is listening on port 6969!')
});


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


