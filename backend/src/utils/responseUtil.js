exports.handleResponse = (res, statusCode, data = null, error = null) => {
    if (error) {
        return res.status(statusCode).send({ error: error.message });
    }
    res.status(statusCode).send(data);
};