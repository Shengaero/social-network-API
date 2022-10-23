class RequestError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

const badRequest = (message = 'Bad Request') => {
    throw new RequestError(message, 400);
};

const notFound = (message = 'Not Found') => {
    throw new RequestError(message, 404);
};

const unimplemented = () => {
    throw new RequestError('Not Implemented', 501);
};

const handler = (error, _1, res, _3) => {
    if(error instanceof RequestError) {
        res.status(error.status).json({
            message: error.message
        });
    } else {
        console.log(error);
        res.status(500).json({ message: 'An internal server error occurred!' });
    }
};

module.exports = { handler, badRequest, notFound, unimplemented, RequestError };
