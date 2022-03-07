/* Author: Liam Lage
	 Date:   07/03/2022

	 Description:
	 My First Module - replace_template
	 Replaces placeholders in the template with values from data.json
*/

module.exports = (template, product) => {
	/* There may be multiple instances of {%PRODUCT%}, so we wrap it
	   in a regEx with the 'g' flag to make it global, then all
		 instances will be replaced, not just the first one.
	*/
	let output = template.replace(/{%PRODUCT_NAME%}/g, product.product_name);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%ORIGIN%}/g, product.origin);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	if(!product.organic) {
		output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
	}

	return output;
};
