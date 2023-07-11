if (process.env.NODE_ENV == "production") {
    module.exports = {mongoURI: 'mongodb+srv://<username>:<password>@blogapp.zo5pnwb.mongodb.net/?retryWrites=true&w=majority'}

}

else {
    module.exports = {mongoURI: 'mongodb://127.0.0.1:27017'}
}