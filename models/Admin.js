const {Schema, model} = require('mongoose')

const schema = new Schema({
    nombres: {type:String},
    apellidos: {type:String},
    identificacion:{
        identificadorTipo:{type:String, required: true},
        identificador: {type:String, required: true},
    },
    
    email: {type:String, required: true},
    password: {type:String, required: true},
    createdAt: {type: Date, default: Date.now},
    createdBy:{type: Schema.Types.ObjectId, ref: 'Admin'},
    lastConnection:{type: Date},
    permisos:{
      usuarios:{
        leer: {type: Boolean},
        escribir: {type: Boolean},
        modificar: {type: Boolean},
        eliminar: {type: Boolean},
      },
      dashboard:{
        leer: {type: Boolean},
      }
    },
})

schema.set('toJSON',{
    transform: (document, returnedObject) =>{
        delete returnedObject.__v
    }
})

module.exports = model('Admin', schema);
