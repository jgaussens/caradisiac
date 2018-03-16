
const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');



/*
async function getModelFromBrand(brand){
	var models = []
	for (let brand of brands){
		const model = await getModels(brand);
		models.push({
			brand: brand,
			model: model
		});
	}
	//return await getModels(brand)
	models
}
*/


//Main functions



async function getBrands_(){
	
	return await getBrands();

}

async function getModelFromBrand(brand){
	return await getModels(brand)
}






async function getModelsByBrands(brands) {
    var models = [];
    for (let brand of brands) {
        //console.log(brand);
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




//tests
/*

getBrands_().then(function(brands){
	console.log(brands);
})

getModelFromBrand('PEUGEOT').then(function(model){
	console.log(model);
})
*/
