const mongoose = require('mongoose');
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
const timeZoneUser = 'America/Caracas'

//MODELS
const Cuenta = require('../models/Cuenta')


async function createCuentaCorriente(userId, amount=100){
  let comprobar = true
  let acountNumber = ''
  while(comprobar){
    acountNumber = '11052970'
    let numbers = Math.floor(Math.random()*(10000000000-100000000000))+100000000000
    acountNumber = acountNumber + numbers.toString() + '1'

    const data = await Cuenta.findOne({numero:acountNumber})
    if(!data) comprobar = false
  }
  const id = mongoose.Types.ObjectId();
  let fecha = dayjs().tz(timeZoneUser) 

  const newAcount = new Cuenta({
    _id:id,
    numero:acountNumber,
    monto: amount,
    tipo: 'corriente',
    usuario: userId,
    createdAt: fecha
  })

  await newAcount.save()

  return {id,numero:acountNumber,monto:amount,tipo:'corriente'}

} 

module.exports = {
  createCuentaCorriente
}