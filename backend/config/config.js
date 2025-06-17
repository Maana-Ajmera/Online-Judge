module.exports = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGODB_URI || 'mongodb+srv://maana:mongodb@cluster0.wqyc3.mongodb.net/oj',
    jwtSecret: process.env.JWT_SECRET || 'uiqyhjskapoupupaaswvgA',
    nodeEnv: process.env.NODE_ENV || 'development'
}; 