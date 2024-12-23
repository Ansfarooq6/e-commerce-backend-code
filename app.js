const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth-user');
const adminRoutes = require('./routes/admin');
const userCont = require('./routes/user');
const cors = require('cors');
const helmet   = require('helmet');
const compression = require('compression');
const morgan = require('morgan')
const fs = require('fs');

const MONGO_URI = `mongodb+srv://ansfarooq:ansfarooq2233@cluster0.cexffl3.mongodb.net/shopAPI?retryWrites=true&w=majority&appName=Cluster0`

const app = express();

app.use(bodyParser.json());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    }, 
    filename: (req, file, cb) => {
        const dateStr = new Date().toISOString().replace(/:/g, '-');
        cb(null, dateStr + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' || // Corrected MIME type
        file.mimetype === 'image/png' // Corrected MIME type
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'));

app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use(cors())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH , DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// app.use((req, res, next) => {
//     //throw new Error("dummy") 
//     User.findById(req.user._id)
//       .then(user => {
//         if (!user) {
//           return next();
//         }
  
//         req.user = user;
//         next();
//       })
//       .catch(err => {
//         throw new Error(err)
//       }
//       );
//   });
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

  

app.use('/auth', authRoutes);
app.use('/api', adminRoutes);
app.use('/user',userCont);

const accessWriteStream = fs.createWriteStream(path.join(__dirname , 'access.log'),{flags :'a'})

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream :accessWriteStream})); 


mongoose.connect(
    MONGO_URI).then(result => {
    app.listen(process.env.PORT || 3000, () => {
        console.log('Server is running on port', process.env.PORT);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});
 
