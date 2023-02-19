const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require('cors')
const cookieParser = require('cookie-parser')
require("dotenv").config({ path: "./.env" });
const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGOURL

// create out express app
const app = express()

// Handle CORS + middleware
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE"); // If using .fetch and not axios
  res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// database stuff
// const uri = "mongodb+srv://farhan:Icsm1458319@atlascluster.5wi8utm.mongodb.net/mevn-project";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected")
})
.catch(err => console.log(err))

app.use(bodyParser.json())
app.use(express.json())
app.use(cors({
  credentials: true,
  exposedHeaders: ["set-cookie"],
  origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:3000']
}))

app.use(cookieParser())

// routes
app.get("/", (res, req) => {
  res.send("yay home page")
})

const routes = require('./routes/allRoutes');
  app.use('/api', routes)

// start server
app.listen(port, () => {
  console.log("Listening at port 5000")
})