//MODELs
const Transaccion = require('../models/Transaccion')
async function transaccionFallida(tipo,origen,destino,monto,fecha, motivo=""){
  const transaccionInfo = new Transaccion({
    tipo,
    origen:origen ? {
      id:origen
    } : null,
    destino:destino?{
      id:destino
    }:null,
    fecha,
    estatus:'fallida',    
    monto, 
    descripcion:motivo
  })

  await transaccionInfo.save()
}

module.exports = {transaccionFallida}