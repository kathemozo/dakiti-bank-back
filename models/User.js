const {Schema, model} = require('mongoose')

const schema = new Schema({
    primerNombre: {type:String, required: true},
    segundoNombre: {type:String},
    primerApellido: {type:String},
    segundoApellido: {type:String},
    identificacion:{
        rol: {type:String, required: true},
        identificadorTipo:{type:String, required: true},
        identificador: {type:String, required: true},
    },
    
    email: {type:String, required: true},
    password: {type:String, required: true},
    createdAt: {type: Date, default: Date.now},
    cuentas:[{_id:{type: Schema.Types.ObjectId, ref: 'Cuenta'}}],
    tarjetas:[{tarjeta:{type: Schema.Types.ObjectId, ref: 'Tarjeta'}}],
    libretaContactos:[{
        nombre:{type: String},
        cuenta:{type: Schema.Types.ObjectId, ref: 'Cuenta'}    
    }],
    apiKey: {type:String},
    tokenData:{
        token:{type:String},
        lastRequest: {type:Number}
    }
})

schema.set('toJSON',{
    transform: (document, returnedObject) =>{
        delete returnedObject.__v
    }
})

module.exports = model('User', schema);
