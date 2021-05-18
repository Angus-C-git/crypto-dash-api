
const schemaValidationError = (err) => {
	const errors = [];
	err.inner.forEach(error => {
		errors.push({
			relation: error.path,
			message: error.message,
		});
	});

	return errors;
};


module.exports = schemaValidationError;