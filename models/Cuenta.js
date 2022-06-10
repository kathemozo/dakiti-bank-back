const {Schema, model} = require('mongoose')

const schema = new Schema({
    numero:{type:String},
    tipo: {type:String},
    usuario: {type: Schema.Types.ObjectId, ref: 'User'},
    monto:{type: Number},
    createdAt: {type: Date, default: Date.now},
})

schema.set('toJSON',{
    transform: (document, returnedObject) =>{
        delete returnedObject.__v
    }
})

module.exports = model('Cuenta', schema);
