const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZoneUser = 'America/Caracas';

//Modelo
const Tarjeta = require('../models/Tarjeta');

async function crearTarjetaCredito(userId, monto = 10000) {
  let comprobar = true;
  let tarjetaNumber = '';
  while (comprobar) {
    tarjetaNumber = '11051';
    let numbers =
      Math.floor(Math.random() * (10000000000 - 100000000000)) + 100000000000;
    tarjetaNumber = tarjetaNumber + numbers.toString();

    const data = await Tarjeta.findOne({ numero: tarjetaNumber });
    if (!data) comprobar = false;
  }
  let cvc = Math.floor(Math.random() * (100 - 1000)) + 1000;
  cvc = cvc.toString();

  const id = mongoose.Types.ObjectId();
  let fecha = dayjs().tz(timeZoneUser);
  let fechaExpiracion = fecha.add(4, 'year');
  let fechaProgramadaPago = fecha.add(1, 'month');
  let fechaLimite = fechaProgramadaPago.add(20, 'day');
  const nuevaTarjeta = new Tarjeta({
    _id: id,
    tipo: 'credito',
    numero: tarjetaNumber,
    usuarioId: userId,
    fechaVenc: fechaExpiracion,
    estado: 'activada',
    cvc,
    infoCredito: {
      fechaProgramadaPago, // fecha para pagos automaticos, por defecto 1 mes luego de su creacion
      saldoActual: '0', //lo que se le debe al banco
      saldoDisponible: String(monto), //lo que queda disponible en el mes para usar
      fechaCorte: fechaProgramadaPago, // fecha limite para pagar 1 mes luego de la creacion, va de 1 mes en 1 mes
      fechaLimite,
      montoTotal: String(monto), //monto maximo de la tarjeta a usar
      interes: '1', //% al usar la tarjeta
      pagoMinimo: '5', //monto minimo a pagar en la proxima fecha de corte o pago programado
      saldoRenovado: false, //se renovo el saldo para este mes
      pagoMinEfectuado: false, //se realizo el pag min
      importePagMin: false, //se realizo el importe por no hacer el pago min (para cobrar solo una vez hasta la sgt fecha limite)
      usada: false, //la tarjeta se uso en pago electronico
    },
  });

  await nuevaTarjeta.save();

  return { id, numero: tarjetaNumber, monto, cvc, fechaExpiracion };
}

//revisa si se cumplio el mes y renueva el saldo disponible al maximo posible
async function renovarSaldo(numero) {
  let tarjeta = await Tarjeta.findOne({ numero });
  const fechaActual = dayjs().tz(timeZoneUser);
  let time = new Date(fechaActual).getTime();
  let saldoDisponibleAux = parseFloat(tarjeta.infoCredito.saldoDisponible);
  let fechaCorte = tarjeta.infoCredito.fechaCorte;

  if (time > tarjeta.infoCredito.fechaCorte) {
    let comprobante = false;
    //calculamos fehca proxima de corte
    while (!comprobante) {
      let fechaLimiteAux = dayjs(tarjeta.infoCredito.fechaCorte).tz(
        timeZoneUser
      );
      fechaCorte = fechaLimiteAux.add(1, 'month');
      if (time <= tarjeta.infoCredito.fechaCorte) {
        comprobante = true;
      }
    }
    //La fecha de corte ha pasado, renuevo todo
    //al pasar fecha de coorte se renueva el estado de usada a false
    saldoDisponibleAux = parseFloat(tarjeta.infoCredito.montoTotal);
    await Tarjeta.findByIdAndUpdate(tarjeta._id, {
      'infoCredito.saldoRenovado': true,
      'infoCredito.saldoDisponible': tarjeta.infoCredito.montoTotal,
      'infoCredito.fechaCorte': fechaCorte,
      'infoCredito.usada': false,
    });
  }
  //else{
  //TODO: revisar esto, no le veo mucho sentido, si no estamos luego de la fecha de corte
  //no se deberia renovar nada
  //o bueno este caso podria
  //la fecha de corte para el pago minimo no ha pasado
  //se comprueba si ya se renovo el saldo
  //  let renovado = tarjeta.infoCredito.saldoRenovado || false
  //  if(!renovado){
  //si no esta renovado se renueva
  //    saldoDisponibleAux = parseFloat(tarjeta.infoCredito.montoTotal)

  //    await Tarjeta.findByIdAndUpdate(tarjeta._id,{
  //      infoCredito:{
  //        saldoRenovado:true,
  //        saldoDisponible:tarjeta.infoCredito.montoTotal,
  //      }
  //    })
  //  }
  //}
  return { saldoDisponible: saldoDisponibleAux, fechaCorte };
}

//si la fecha de pago minimo ha pasado y no se efectuo un pago, se agrega un monto de interes al saldoActual (deuda)
//Se debe tener actualizada la fecha de corte antes
async function interesPagoMinimo(numero) {
  let tarjeta = await Tarjeta.findOne({ numero });
  const fechaActual = dayjs().tz(timeZoneUser);
  let time = new Date(fechaActual).getTime();
  let saldoActualAux = parseFloat(tarjeta.infoCredito.saldoActual);
  let fechaMinimo = tarjeta.infoCredito.fechaLimite;

  if (time > tarjeta.infoCredito.fechaLimite) {
    let pagado = tarjeta.infoCredito.pagoMinEfectuado || false;
    let importe = tarjeta.infoCredito.importePagMin || false;
    let fechacorteAux = dayjs(tarjeta.infoCredito.fechaCorte).tz(timeZoneUser);
    fechaMinimo = fechacorteAux.subtract(10, 'day');

    //verifico si ya se pago el pago min
    if (!pagado) {
      //si estamos en una fecha sup al limite y no se pago se agrega el importe

      //si la deuda es cero no se cobra importe, esto porque ya se ha pagado

      //si no se ha realizado el importe por la deuda en este periodo
      //se le agrega al saldo actual (deuda) un % del monto total de la tarjeta
      if (!importe) {
        saldoActualAux =
          parseFloat(tarjeta.infoCredito.saldoActual) +
          (parseFloat(tarjeta.infoCredito.montoTotal) *
            parseFloat(tarjeta.infoCredito.pagoMinimo)) /
            100;
        importe = true;
      }
    }
    //cambiamos tambien el estatus de pagado en pagoMinEfectuado, esa parte de tiempo solo se ejecutara una vez, el pago debe ser exigido
    //si no se ha usado no es necesario pagar
    let pagMin = false;
    let usada = tarjeta.infoCredito.usada || false;
    if (!usada) {
      pagMin = true;
    }
    await Tarjeta.findByIdAndUpdate(tarjeta._id, {
      'infoCredito.fechaLimite': fechaMinimo,
      'infoCredito.saldoActual': String(saldoActualAux),
      'infoCredito.importePagMin': importe,
      'infoCredito.pagoMinEfectuado': pagMin,
    });
  } else {
    //si aun estamos en el periodo para hacer el pago, hacemos siempre negavito el importe
    //este cpbro se hara solo una vez al vencerse la fecha limite
    //tendra un estado negativo pero nunca se cobrar si no se paso el limite
    let usada = tarjeta.infoCredito.usada || false;
    let importe = tarjeta.infoCredito.importePagMin || false;
    if (importe) {
      await Tarjeta.findByIdAndUpdate(tarjeta._id, {
        'infoCredito.importePagMin': false,
      });
    }
    //si no se ha usado en este mes la tarjeta, se asume que el pago min se realizo
    if (!usada) {
      await Tarjeta.findByIdAndUpdate(tarjeta._id, {
        'infoCredito.pagoMinEfectuado': true,
      });
    }
  }

  return { saldoActual: saldoActualAux, fechaMinimo };
}

module.exports = {
  crearTarjetaCredito,
  renovarSaldo,
  interesPagoMinimo,
};
