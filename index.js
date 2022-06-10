//IMPORTS
require("./database");
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const multer = require('multer');
const xss = require('xss-clean');
const path = require('path');
const server = require('./config');
const cors = require("cors");
const compression = require('compression');
const { decodeToken } = require('./functions/token');

require('dotenv').config()
const swaggerUI = require("swagger-ui-express")
const swaggerFile = require("./swagger_output.json")

//FUNCTIONS
const {verifyToken, verifyTokenAdmin} = require('./functions/verifyToken')

//CONFIG
const app = express();
const limit = rateLimit({
    max: 1000,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour of 'ban' / lockout 
    message: 'Too many requests, you are locked for 1hr' // message to send
});
const photoStorage = multer.diskStorage({
    destination: 'images',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    },
});
const uploadPhoto = multer({ photoStorage });


//MIDDELWARES
app.use(express.urlencoded({extended: true ,limit: '1mb'}))
app.use(express.static(path.join(__dirname,'public'), {
	dotfiles: 'allow',
	maxage: 31557600000,
	setHeaders: function(res, path) {
		res.setHeader("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
	}
}));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());
app.use(compression());
app.use(xss());
app.use(helmet());
app.use( '*', limit);
app.use(cors());
app.use(uploadPhoto.single('file'));
app.options("*", cors());
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile))

//ROUTERS
const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth')
const appRouter = require('./routes/app')
const adminRouter = require('./routes/admin')

app.use('/api/app', verifyToken, appRouter);
app.use('/api/admin', verifyTokenAdmin, adminRouter)
app.use('/api/', apiRouter);
app.use('/api/auth', authRouter)

app.get("/test", async (req,res)=>{
    res.status(200).json({ok:true, message:"Lets seee"})
})
//crear super admin
/* const Admin = require('./models/Admin')
const {hash} = require('./functions/passwordHash')
app.post('/admin', async (request,response)=>{
    const{nombres, apellidos, email, password,identificador, identificadorTipo, permisos}= request.body
    let hashedPassword = await hash(password);
    const admin = new Admin({
        nombres,
        apellidos, 
        email,
        password: hashedPassword,
        identificacion:{
            identificador,
            identificadorTipo
        },
        permisos
    })
    await admin.save()
    const adminRes = await Admin.findOne({email}) 
    response.status(200).json({adminRes})
    
}) */


// app.use('/api/app', async ( req, res, next ) => {
//     const token = req.header("Authorization");
//     if (!token){
//         res.status(401).json({ 
//             ok: false,
//             error: 'Not logged in'
//         });
//         return;
//     }else{
//         let response = await decodeToken(token.split(" ")[1], server.SESSION_TOKEN);
//         if(response.error){
//             res.status(401).json({
//                 ok: false,
//                 error: response.error
//             });
//             return;
//         }else{
//             next();
//         }
//     }
// });

// ROUTERS

app.get('*.js', (req, res) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
	res.set("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
    res.sendFile(path.join(__dirname,'/public'+req.url));
});

app.get('*.css', (req, res) => {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
	res.set("Expires", new Date(Date.now() + 2592000000*30).toUTCString());
    res.sendFile(path.join(__dirname,'/public'+req.url));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'));
    return;
});

//CONNECTION
//app.listen(3001,() => {
//    console.log(`Server running on port 3001`);
//});
app.listen(process.env.PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`);
});