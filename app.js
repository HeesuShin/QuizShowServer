const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const index = require('./controllers/index');
const user = require('./controllers/user');
const { sequelize } = require('./models');

//Initialize our app variable
const app = express();
sequelize.sync();

//Declaring Port
const port = 8001;

app.use(session({
    secret: 'test1234',
    resave: true,
    saveUninitialized: true
}));

//Middleware for CORS
app.use(cors());

//Middleware for bodyparsing using both json and urlencoding
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/*express.static is a built in middleware function to serve static files.
 We are telling express server public folder is the place to look for the static files
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',index);
app.use('/user',user);


//Listen to port 3000
app.listen(port, () => {
    console.log(`Starting the server at port ${port}`);
});
