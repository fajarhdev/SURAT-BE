const response = async (status, message, data, error, req, res) => {
	return res.status(status).json({
		status: status,
		message: message,
		data: data,
		error: error,
	});
};

module.exports = response;
