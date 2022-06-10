const { request, response } = require("express");
const config = require('../config')
const router = require("express").Router();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneUser = 'America/Caracas'

//FUNCTIONS
const { hash, compare } = require('../functions/passwordHash');
const {createCuentaCorriente} = require('../functions/Cuentas')
const transporter = require('../functions/mail') 

//MODELS
const User = require('../models/User') 
const Tarjeta = require('../models/Tarjeta') 
const Admin = require('../models/Admin')
const Confirm = require('../models/Confirm')

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/



router.post('/signup', async (request, response)=>{
  try {
    const {
      primerNombre,
			segundoNombre,
			primerApellido,
			segundoApellido,
			email,
			password,
			rol,
			identificadorTipo,
			identificador
		} = request.body

		if(!primerNombre || !email || !password || !rol || !identificador || !identificadorTipo){
			response.status(400).json({
				ok: false,
				error: "missing data"
			})
			return
		}
		if(rol ==='natural' && !primerApellido){
			response.status(400).json({
				ok:false,
				error:"missing data"
			})
			return
		}
		if(rol==='juridico' && identificadorTipo !== 'J'){
			response.status(400).json({
				ok:false,
				error:"user juridico debe usar rif"
			})
		}
		if(!email.match(emailRegexp)){
			response.status(422).json({
				ok: false,
				error: 'formato de email invalido'
			});
			return;
		}	
		let data = await User.find({ email });
    if (data.length) {
      response.status(400).json({ 
        ok: false,
        error: "email ya existente" 
      });
      return;
    };
		let query = {
			'identificacion.identificador':identificador,
			'identificacion.identificadorTipo':identificadorTipo,
		}
		data = await User.find(query)
		if (data.length) {
      response.status(400).json({ 
        ok: false,
        error: "data de identificacion ya existente" 
      });
      return;
    };
		if(identificadorTipo !=='V' && identificadorTipo!=='E' && identificadorTipo !='J'){
			response.status(422).json({
				ok:false,
				error:"identificadorTipo incorrecto"
			})
			return
		}
		if(rol !=='juridico' && rol !=='natural'){
			response.status(422).json({
				ok:false,
				error:"rol incorrecto"
			})
			return
		}


		let hashedPassword = await hash(password);
		const userId = mongoose.Types.ObjectId();
		const {id,numero,monto,tipo} = await createCuentaCorriente(userId,100)
		let cuentas = [{_id:id}]
		const user = new User({
			_id:userId,
			primerNombre,
			segundoNombre,
			primerApellido,
			segundoApellido,
			email,
			password: hashedPassword,
			identificacion:{
				rol,
				identificadorTipo,
				identificador
			},
			cuentas
		})

		await user.save()

		let mailOptions = {
			from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
			to: email, // list of receivers
			subject: "Bienvenido(a) a Dakiti", // Subject line
			text: "Bienvenido(a) a nuestro banco", // plain text body
			html: `	<div style="text-align: center; margin: 5px;">
								<h2>Hola ${primerNombre} ${primerApellido}, bienvenido(a)</h2>
								<h2>Gracias por abrir una cuenta y unirte a nuestro banco, esperamos que disfrutes de nuestros servicios</h2>
								<h2>Puedes ingresar y disfrutar de ellos, mediante la opcion de Banco en Linea del banco Dakiti</h2>
								`, // html body
		}

		let emailSend = transporter.sendMail(mailOptions, function (err, info) { 
			if (err) {
				response.status(500).json({
					success: false,
					error: 'Error inesperado, intente mas tarde'
				});
				console.log('[sign up - send email error] ', err)
				return;
			} })
		response.status(200).json({
			ok: true
		})

  } catch (error) {
    console.log('[sign-in error]', error)
    response.status(500).json({
      ok: false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.post('/login', async (request, response)=>{
	try{
		const {identificador, identificadorTipo, rol, password} = request.body
		if(!rol || !identificador || !identificadorTipo || !password){
			response.status(400).json({
				ok: false,
				error: "missing data"     
			})
			return
		}
		const user = await User.findOne({
			'identificacion.identificador':identificador,    
			'identificacion.rol':rol,
			'identificacion.identificadorTipo':identificadorTipo
		})
		//console.log(user)
		if(user){
			let validUser = await compare(password, user.password); 
			if(validUser){
				let dateRequest = dayjs().tz(timeZoneUser) 
				let token = jwt.sign({
					 rol,identificador,identificadorTipo, userId:user._id
					}, config.SESSION_TOKEN);
				await User.findByIdAndUpdate(user._id,{tokenData:{token, lastRequest:dateRequest}})
				response.status(200).json({
					ok:true,
					data:{ 
						token,
						primerNombre: user.primerNombre,
						segundoNombre: user.segundoNombre,
						primerApellido: user.primerApellido,
						segundoApellido: user.segundoApellido
					}
				})
				return
			}
		}
		response.status(400).json({
			ok:false,
			error:"usuario o contraseña incorrecta"
		})
		return

	}catch(error){
		console.log(error)
		response.status(500).json({
			ok: false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

router.get('/user', async(request, response)=>{
	try {
		const {email} = request.body
		const user = await User.findOne({email})
		if(user){
			response.status(200).json({
				ok:true,
				user
			})
		}else{
			response.status(400).json({
        ok: false,
        error: 'no existe el usuario'
      })
      return
		}
		
	} catch (error) {
		console.log(error)
		response.status(500).json({
			ok:false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

router.delete('/delete-user', async(request, response)=>{
	try {
		const {email} = request.body
		const user = await User.findOne({email})
    if(user){
      const deleteUser = await User.findByIdAndDelete(user._id)
      response.status(200).json({
        ok: true
      })
      return

    }else{
      response.status(400).json({
        ok: false,
        error: 'no existe el usuario'
      })
      return
    }
	} catch (error) {
		console.log(error)
		response.status(500).json({
			ok:false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

//recuperar contraseña
router.post('/recuperar-password', async (request, response)=>{
	try {
		const {identificador, identificadorTipo, rol} = request.body
		if(!identificador || !identificadorTipo || !rol){
			response.status(400).json({
        ok: false,
        error: 'missing data'
      })
			return
		}
		const user = await User.findOne({
			'identificacion.identificador':identificador,    
			'identificacion.rol':rol,
			'identificacion.identificadorTipo':identificadorTipo
		})
		if(!user){
			response.status(400).json({
        ok: false,
        error: 'no existe el usuario'
      })
			return
		}

		const digitCode = Math.floor(Math.random()*(100000-1000000))+1000000
		let dateRequest = dayjs().tz(timeZoneUser) 

		const confirmRequest = await Confirm.findOne({email:user.email, type:'resetpwd'})
    if(confirmRequest){
      await Confirm.findOneAndUpdate({email:user.email, type:'resetpwd'},{createdAt: dateRequest, code: digitCode})
    }else{
      const confirmForSave = new Confirm({
        email: user.email,
        type :'resetpwd', 
        createdAt:dateRequest,
        code: digitCode
      })
      await confirmForSave.save()
      //console.log('save')
    }
		let mailOptions = {
			from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
			to: user.email, // list of receivers
			subject: "Recuperar contraseña", // Subject line
			text: "this is a test", // plain text body
			html: `	<div style="text-align: center; margin: 5px;">
								<h2>Se ha solicitado recuperar la contraseña de tu cuenta, usa el siguiente codigo para continuar, sera valido por 24 horas.</h2>
								<br/>
								<h1>${digitCode}</h1> 
								</div>`, // html body
		}

		let emailSend = transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				response.status(500).json({
					success: false,
					error: 'Error inesperado, intente mas tarde'
				});
				console.log('[forgot-password send email error] ', err)
				return;
			} })

		response.status(200).json({
			ok:true
		})


		
	} catch (error) {
		console.log(error)
		response.status(500).json({
			ok:false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

router.post('/confirmar-codigo', async (request, response)=>{
	try {
		let {codigo,identificador, identificadorTipo, rol} = request.body
		if(!codigo || !identificador || !identificadorTipo || !rol){
			response.status(400).json({
        ok: false,
        error: 'missing data'
      })
			return
		}
		const user = await User.findOne({
			'identificacion.identificador':identificador,    
			'identificacion.rol':rol,
			'identificacion.identificadorTipo':identificadorTipo
		})
		if(!user){
			response.status(400).json({
        ok: false,
        error: 'no existe el usuario'
      })
			return
		}

		const confirmData = await Confirm.findOne({email:user.email,type:'resetpwd'})
      if(confirmData){
        //24h
        //60000*60*24
        if (new Date(dayjs().tz(timeZoneUser)).getTime() - confirmData.createdAt > 60000*60*24 ) {
          response.status(400).json({
            success: false,
            error: 'El codigo esta vencido'
          })
            return
        }

        //cofirm correct code
        if(confirmData.code !==  parseInt(codigo)){
          response.status(400).json({
            success: false,
            error: 'El codigo es invalido'
          })
          return
        }

        //cofirm password can be change
        if(confirmData.confirmCode === false){
          await Confirm.findOneAndUpdate({email:user.email,type:'resetpwd'},{confirmCode:true})
        }
				let dateRequest = dayjs().tz(timeZoneUser) 
				let token = jwt.sign({
					 rol,
					 identificador,
					 identificadorTipo, 
					 userId:user._id, 
					 type:'resetpwd',
					}, config.SESSION_TOKEN);
				await User.findByIdAndUpdate(user._id,{tokenData:{token, lastRequest:dateRequest}})
        response.status(200).json({
          ok: true,
          data:{token}
        })


      }else{
        response.status(400).json({
          ok: false,
          error:"No existe la solicitud para recuperar contraseña para este usuario"
        })
        return
      }


	} catch (error) {
		console.log(error)
		response.status(500).json({
			ok:false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

//------admin-------
router.post('/login-admin', async (request, response)=>{
	try{
		const {email, password} = request.body
		if(!email || !password){
			response.status(400).json({
				ok: false,
				error: "missing data"     
			})
			return
		}
		const user = await Admin.findOne({email})

		if(user){
			let validUser = await compare(password, user.password); 
			if(validUser){
				let token = jwt.sign({
					userId:user._id
				}, config.SESSION_TOKEN);
				let dateConnect= dayjs().tz(timeZoneUser) 
				await Admin.findByIdAndUpdate(user._id,{lastConnection:dateConnect})
				
				response.status(200).json({
					ok:true,
					data:{ 
						token,
						nombres: user.nombres,
						apoellidos: user.apellidos,
					}
				})
				return
			}
		}
		response.status(400).json({
			ok:false,
			error:"email o contraseña incorrecta"
		})
		return

	}catch(error){
		console.log(error)
		response.status(500).json({
			ok: false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

router.get('/user-admin', async(request, response)=>{
	try {
		const {email} = request.body
		const user = await Admin.findOne({email})
		if(user){
			response.status(200).json({
				ok:true,
				user
			})
		}else{
			response.status(400).json({
        ok: false,
        error: 'no existe el usuario admin'
      })
      return
		}
		
	} catch (error) {
		console.log(error)
		response.status(500).json({
			ok:false,
			error:'Error inesperado, intente mas tarde'
		})
	}
})

router.get('/fecha', async(request,response)=>{
	let fecha = dayjs().tz(timeZoneUser);
	console.log(fecha)
	response.status(200).json({
		fecha
	})
})

router.post('/find-cuenta', async (resquet, response)=>{
	const tarjeta = '1105157263620048'
	const tarjetaData = await Tarjeta.findOne({numero:tarjeta}).populate({
		path: 'usuarioId',
		model: 'User',
	  });
	if(tarjetaData){
		console.log(tarjetaData)
		const usuario = await User.findById(tarjeta.usuarioId) 
		response.status(200).json({
			ok:true,
			usuario
		})
	}else{
		response.status(400).json({
			ok:false
		})
	}
})


module.exports = router;