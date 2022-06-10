const router = require("express").Router();

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneUser = 'America/Caracas'

//MODELS
const Admin = require('../models/Admin')
const User = require('../models/User')
const Transaccion = require('../models/Transaccion')
const Tarjeta = require('../models/Tarjeta')
const Cuenta = require('../models/Cuenta')

//FUNCTIONS
const { hash, compare } = require('../functions/passwordHash');

router.post('/signup', async (request, response)=>{
  try{
    const {userId, permisosAdmin} = request
    if(permisosAdmin.usuarios.escribir){
      const {nombres,apellidos, email, password, identificador,identificadorTipo, permisos} = request.body

      if(!nombres || !apellidos || !email || !password || !identificador || !identificadorTipo || !permisos){
        response.status(400).json({
          ok:false,
          error: "Missing data"
        })
        return
      }

      let dataUser = await Admin.findOne({email})
      if(dataUser){
        response.status(400).json({
          ok:false,
          error: "email ya existente"
        })
        return
      }

      dataUser = await Admin.findOne({
        'identificacion.identificador':identificador,
        'identificacion.identificadorTipo':identificadorTipo
      })
      if(dataUser){
        response.status(400).json({
          ok:false, 
          error: "data de identificacion ya existente"
        })
        return
      }

      let hashedPassword = await hash(password);
      let dateCreated = dayjs().tz(timeZoneUser)
      const admin = new Admin({
        nombres,
        apellidos,
        email,
        password: hashedPassword,
        identificacion:{
          identificador,
          identificadorTipo
        },
        createdBy:userId,
        createdAt: dateCreated,
        permisos:{
          usuarios:{
            leer: permisos?.usuarios?.leer || false,
            escribir: permisos?.usuarios?.escribir || false,
            modificar: permisos?.usuarios?.modificar || false,
            eliminar: permisos?.usuarios?.eliminar || false 
          },
          dashboard:{
            leer: permisos?.dashboard?.leer || false
          }
        }
      })

      await admin.save()


      response.status(200).json({
        ok:true,
        data:{
          user:{
            _id: admin._id,
            nombres:admin.nombres,
            apellidos: admin.apellidos,
            email: admin.email,
            permisos:{
              usuarios:{
                leer: admin?.permisos?.usuarios?.leer,
                escribir: admin?.permisos?.usuarios?.escribir,
                modificar: admin?.permisos?.usuarios?.modificar,
                eliminar: admin?.permisos?.usuarios?.eliminar
              },
              dashboard:{
                leer:admin.permisos?.dashboard?.leer
              }
            }
          }
        }
      })

    }else{
      response.status(400).json({
        ok:false,
        error: 'el usuario admin no posee permisos para crear usuarios'
      })
    }
  }catch(error){
      console.log('[error signup admin]', error)
      response.status(500).json({
        ok:false,
        error:'Error inesperado, intente mas tarde'
      })
    }
})

router.get('/leer/:id', async(request,response)=>{
  try{
    const {id} = request.params
    const {userId, permisosAdmin} = request
    if(permisosAdmin.usuarios.leer){
      const user = await Admin.findById(id)
      if(!user){
        response.status(400).json({
          ok:false,
          error: 'No existe el usuario'
        })
        return
      }

      response.status(200).json({
        ok:true,
        data:{
          user:{
            _id: user._id,
            nombres:user.nombres,
            apellidos: user.apellidos,
            email: user.email,
            permisos: user.permisos,
            identificacion: user.identificacion
          }
        }
      })

    }else{
      response.status(400).json({
        ok:false,
        error: 'el usuario admin no posee permisos para leer usuarios'
      })
    }
  }catch(error){
    console.log(error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.get('/leer', async(request,response)=>{
  try{
    const {userId, permisosAdmin} = request
    if(permisosAdmin.usuarios.leer){
      let users = await Admin.find().populate({
        path: 'createdBy',
        model: 'Admin'
      })
      users = users.map(user=>{
        const newUser = {
          _id: user._id,
          nombres: user.nombres,
          apellido: user.apellidos,
          createdAt: user.createdAt,
          createdBy: user?.createdBy?.nombres || null,
          lastConnection: user?.lastConnection || null,
          email: user.email
        }
        return newUser
      })
      if(!users.length){
        response.status(400).json({
          ok:false,
          error: 'No hay usuarios para consultar'
        })
        return
      }

      response.status(200).json({
        ok:true,
        data:{
          users
        }
      })

    }else{
      response.status(400).json({
        ok:false,
        error: 'el usuario admin no posee permisos para leer usuarios'
      })
    }
  }catch(error){
    console.log(error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.post('/modificar/:id', async(request,response)=>{
  try{
    const {id} = request.params
    const {userId, permisosAdmin} = request
    const {permisos} = request.body
    if(permisosAdmin.usuarios.modificar){
      let admin = await Admin.findById(id)
      if(!admin){
        response.status(400).json({
          ok:false,
          error: 'No existe el usuario'
        })
        return
      }
      if(!permisos){
        response.status(400).json({
          ok:false,
          error: "Missing data"
        })
        return
      }

      admin = await Admin.findByIdAndUpdate(id,{
        permisos:{
          usuarios:{
            leer: permisos?.usuarios?.leer || false,
            escribir: permisos?.usuarios?.escribir || false,
            modificar: permisos?.usuarios?.modificar || false,
            eliminar: permisos?.usuarios?.eliminar || false 
          },
          dashboard:{
            leer: permisos?.dashboard?.leer || false
          }
        }
      },{new:true})

      response.status(200).json({
        ok:true,
        data:{
          user:{
            _id: admin._id,
            nombres:admin.nombres,
            apellidos: admin.apellidos,
            email: admin.email,
            permisos:{
              usuarios:{
                leer: admin.permisos.usuarios.leer,
                escribir: admin.permisos.usuarios.escribir,
                modificar: admin.permisos.usuarios.modificar,
                eliminar: admin.permisos.usuarios.eliminar
              },
              dashboard:{
                leer:admin.permisos.dashboard.leer
              }
            }
          }
        }
      })
    }else{
      response.status(400).json({
        ok:false,
        error: 'el usuario admin no posee permisos para modificar usuarios'
      })
    }
  }catch(error){
    console.log('[modificar admin error]', error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.post('/eliminar/:id', async(request,response)=>{

  try{
    const {id} = request.params
    const {userId, permisosAdmin} = request
    if(permisosAdmin.usuarios.eliminar){
      const user = await Admin.findById(id)
      if(!user){
        response.status(400).json({
          ok:false,
          error: 'No existe el usuario'
        })
        return
      }

      await Admin.findByIdAndDelete(id)
      response.status(200).json({
        ok:true
      })
    }else{
      response.status(400).json({
        ok:false,
        error: 'el usuario admin no posee permisos para eliminar usuarios'
      })
    }
  }catch(error){
    console.log('[eliminar admin error]', error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.get('/permisos', async (request, response)=>{
  try{
    const { permisosAdmin} = request
    response.status(200).json({
      ok:true,
      data:{
        permisos:permisosAdmin
      }
    })
  }catch(error){
    console.log(error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})

router.post('/reporte-trasacciones', async (request, response)=>{
  /*
  permite consultar transacciones fallidas y/o exitosas, por el momento sobre todos los clientes
  */
  try{
    let {estatus, fechaTo, fechaFrom} = request.body
    //verificamos permisos
    const {permisosAdmin} = request

    if(!permisosAdmin.dashboard.leer){
      response.status(400).json({
        ok:false,
        error: 'No posees permisos para leer data en el dashboard'
      })
      return
    }

    let querySearch = {};
		//buscamos todos los movimientos segun el tipo y estatus
		let transacciones = [];

    if (!estatus || (estatus !== 'exitosa' && estatus !== 'fallida')) estatus = "";
		if (estatus !== "") {
			querySearch.estatus = estatus;
		} else {
			querySearch.estatus = { $in: ["exitosa", "fallida"] };
		}
		//console.log(querySearch)
		transacciones = await Transaccion.find(querySearch);

    //verificamos el rango de tiempo
    let searchDate = false;
		if (fechaTo && fechaFrom) {
			let validDates = true;
			fechaFrom = dayjs(fechaFrom).tz(timeZoneUser);
			fechaTo = dayjs(fechaTo).tz(timeZoneUser);
			if (!fechaTo.isValid() || !fechaFrom.isValid()) validDates = false; 
			if (validDates) {
        //let testDateTo = new Date(fechaTo).getTime() + 60000*60*24 -1 
        //let testDate = fechaTo.add(1, 'day') 
        //testDate= testDate.subtract(1,'s')
				let validRango =
					new Date(fechaTo).getTime() + 60000*60*24 -1  > new Date(fechaFrom).getTime();
				if (validRango) searchDate = true;
			}
		}

    let timeTo= 0
    let timeFrom=0
    if (searchDate) {
      let testDate = fechaTo.add(1, 'day') 
      testDate= testDate.subtract(1,'s')
      //timeTo = new Date(testDate).getTime()
      timeTo = new Date(fechaTo).getTime() + 60000*60*24 -1 
      timeFrom = new Date(fechaFrom).getTime();
    }
  console.log(timeTo-timeFrom)
    let transaccionesAux = transacciones;
    transacciones = [];
    for (movimiento of transaccionesAux) {
      let agregar = true
      
      if(searchDate){
        const timeMov = new Date(movimiento.fecha).getTime();
        agregar = false
        
        if((timeMov < timeTo) && (timeMov > timeFrom)){
          agregar = true
        } 
      }
      if(agregar){
        let objToAdd = {};
        let idOrigen = movimiento?.origen?.id || null;
        let idDestino = movimiento?.destino?.id || null;

        let dataOrigen = []
        let dataDestino = []
        if(idOrigen){
          if(movimiento.tipo==='transferencia'){
            dataOrigen = await Cuenta.findById(idOrigen).populate({
              path: 'usuario',
              model: 'User',
            });
          }
          if(movimiento.tipo==='pagoElectronico'){
            dataOrigen = await Tarjeta.findById(idOrigen).populate({
              path: 'usuario',
              model: 'User',
            });
          }
        }else{
          dataOrigen = null
        }

        if(idDestino){
          dataDestino = await Cuenta.findById(idDestino)
        }else{
          dataDestino = null
        }
        
        
        
        //objToAdd.dataOrigen = dataOrigen;
        //objToAdd.dataDestino = dataDestino;
        objToAdd.usuario={
          nombre: dataOrigen?.usuario?.primerNombre || null,
          apellido: dataOrigen?.usuario?.primerApellido || null
        }
        objToAdd.origen = dataOrigen?.numero || null
        objToAdd.destino = dataDestino?.numero || null
        objToAdd._id = movimiento._id;
        objToAdd.monto = movimiento.monto;
        objToAdd.tipo = movimiento.tipo;
        objToAdd.descripcion = movimiento?.descripcion || '';
        objToAdd.estatus = movimiento?.estatus || "exitosa";
        objToAdd.numeroRef = movimiento.numeroRef;
        objToAdd.fecha = movimiento.fecha;
        transacciones.push(objToAdd);
        
      }
    }
      
      
    if (transacciones.length) {
			transacciones = transacciones.sort((a, b) => {
				let dateA = new Date(a.fecha).getTime();
				let dateB = new Date(b.fecha).getTime();
				return dateB - dateA;
			});
		}
      

      

      
    response.status(200).json({
      ok:true,
      data:{
        transacciones
      }
    })
    

  }catch(error){
    console.log(error)
    response.status(500).json({
      ok:false,
      error:'Error inesperado, intente mas tarde'
    })
  }
})


module.exports = router;