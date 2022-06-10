const {Schema, model} = require('mongoose')
const autoincrement = require('simple-mongoose-autoincrement');

const schema = new Schema({
    monto:{type: Number},
    comision:{type:Number}, //porcentaje
    tipo:{type:String}, //(pagoElectronico/transferencia/pagoTarjeta/otherBankCards/otherBankTransfer)
    origen:{
      id:{type:Schema.Types.ObjectId},
      estadoPuntual:{type:Number},
    },
    destino:{
      id:{type:Schema.Types.ObjectId},
      estadoPuntual:{type:Number},
    },
    descripcion:{type:String},
    fecha: {type: Date, default: Date.now},
    estatus: {type:String}, // fallida/exitosa
})
schema.plugin(autoincrement, {field: 'numeroRef' /*with field name*/});
schema.set('toJSON',{
    transform: (document, returnedObject) =>{
        delete returnedObject.__v
    }
})
//----------Tipos de pago-----------
//pagoElectronico=tarjeta credito a cuenta
//transferencia=cuenta a cuenta
//pagoTarjeta=cuenta a tarjeta de credito


module.exports = model('Transaccion', schema);

