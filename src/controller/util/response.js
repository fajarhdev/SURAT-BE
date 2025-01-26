const response = async (status, message, data, dataFilter, error, req, res) => {
	return res.status(status).json({
		status: status,
		message: message,
		data: data,
		dataFilter: dataFilter,
		error: error,
	});
};

module.exports = response;
