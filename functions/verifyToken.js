const jwt = require('jsonwebtoken')
const config = require('../config')

const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin
const randomString = require("../functions/Strings");
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZoneUser = "America/Caracas";

//MODELA
const User = require('../models/User')
const Admin = require('../models/Admin')


async function verifyToken (request, response, next){
    if(request.get('authorization')){
      try{
        const authorization = request.get('authorization')
        let decodedToken = null 
        let token = authorization.split(' ')[1]
        let schemes = authorization.split(' ')[0]
        if(authorization && schemes.toLowerCase() === 'bearer'){
          decodedToken = jwt.verify(token, config.SESSION_TOKEN) 
        }else{
          token = null
        }
        
        if(!token || !decodedToken.userId){ 
          response.status(401).json({
            ok: false,
            error:"Token missing or invalid"
          })
          return
        }
        
        const {userId, rol, identificador, identificadorTipo, dateCreated, type} = decodedToken

        let tipoToken = type || null

        const user = await User.findById(userId) 
        if(user){ 
          let tiempoMin = 5*60000;
          //let tiempoMin = 5*60000*5465435168454186465168644564654654564654
          let timeNow = Date.now(dayjs().tz(timeZoneUser))
          if(user.tokenData.lastRequest+tiempoMin < timeNow && user.tokenData.lastRequest !== 0){ 
            await User.findByIdAndUpdate(userId,{
              'tokenData.token':'',
              'tokenData.lastRequest':0
            })
            response.status(400).json({
              ok: false,
              error:"Token vencido"
            })
            return

          } 
          if(user.tokenData.token !== token){
            await User.findByIdAndUpdate(userId,{ 
              'tokenData.token':'',
              'tokenData.lastRequest':0
            })
            response.status(400).json({
              ok: false,
              error:"Token invalido"
            })
            return 

          }
          let editData = {} 
          if(tipoToken === 'resetpwd'){ 
            editData = {
              'tokenData.token':'',
              'tokenData.lastRequest':0
            }
          }else{
            editData = {
              'tokenData.lastRequest':timeNow
            }
          }
          await User.findByIdAndUpdate(userId,editData)
          
          request.userId = userId
          request.rolU = rol
          request.identificadorU = identificador
          request.identificadorTipoU = identificadorTipo
          next()
        
        }else{
          response.status(400).json({
            ok:false,
            error:'no existe el usuario'
          })
          return;
        }
        
            
      } catch(err){
        console.log('[Error verify Token]: ', err)
        response.status(500).json({
          ok: false, 
          error: 'Unknown error, please try later'
        })
        return
      }
           
    }else{
      response.status(400).json({
        ok: false,
        error: 'Missing token'
      })
      return;
    }   
  }

async function verifyTokenAdmin (request, response, next){
  if(request.get('authorization')){
    try{
      const authorization = request.get('authorization')
      let decodedToken = null 
      let token = authorization.split(' ')[1]
      let schemes = authorization.split(' ')[0]
      if(authorization && schemes.toLowerCase() === 'bearer'){
        decodedToken = jwt.verify(token, config.SESSION_TOKEN) 
      }else{
        token = null
      }
        
      if(!token || !decodedToken.userId){ 
        response.status(401).json({
          ok: false,
          error:"Token missing or invalid"
        })
        return
      }
        
      const {userId} = decodedToken

      const user = await Admin.findById(userId)

      if(user){

        request.userId = userId
        request.permisosAdmin = {
          usuarios:user.permisos.usuarios,
          dashboard: user.permisos.dashboard
        }
        next()

      }else{
        response.status(400).json({
          ok:false,
          error:'no existe el usuario'
        })
        return;
      }
             
      } catch(err){
        console.log('[Error verify Token]: ', err)
        response.status(500).json({
          ok: false, 
          error: 'Unknown error, please try later'
        })
        return
      }
           
    }else{
      response.status(400).json({
        ok: false,
        error: 'Missing token'
      })
      return;
    }   
  }
  
  module.exports = {verifyToken, verifyTokenAdmin}