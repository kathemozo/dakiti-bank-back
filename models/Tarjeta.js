const {Schema, model} = require('mongoose')

const schema = new Schema({
    tipo: {type:String, required: true}, //credito/debito
    numero: {type:String, required: true},
    cvc: {type:String, required:true},
    fechaVenc: {type:String},
    estado:  {type:String}, //desactivada/activada
    usuarioId:{type: Schema.Types.ObjectId, ref: 'User'},
    infoCredito:{
        fechaProgramadaPago: {type:String},
        saldoActual:{type:String},
        identificador: {type:String},
        saldoDisponible:{type:String},
        montoTotal:{type:String},
        fechaCorte:{type:String},
        fechaLimite:{type: String},
        interes:{type:String},
        pagoMinimo:{type:String}, //%monto minimo a pagar en la proxima fecha de corte o pago programado
        saldoRenovado:{type: Boolean, default: false}, //se renovo el saldo para este mes 
        pagoMinEfectuado:{type: Boolean, default: false}, //se realizo el pag min
        importePagMin:{type: Boolean, default: false}, //se realizo el importe por no hacer el pago min (para cobrar solo una vez hasta la sgt fecha limite)
        usada:{type: Boolean, default: false}, //la tarjeta se uso en pago electronico
    },
})

schema.set('toJSON',{
    transform: (document, returnedObject) =>{
        delete returnedObject.__v
    }
})

module.exports = model('Tarjeta', schema);
