if (process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: 'mongodb+srv://cookiezdsz:34851288x@blogapp.zo5pnwb.mongodb.net/?retryWrites=true&w=majority'}
}
else {
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017'}
}