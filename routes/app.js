const router = require('express').Router();
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
const randomString = require('../functions/Strings');
dayjs.extend(utc);
dayjs.extend(timezone);
const timeZoneUser = 'America/Caracas';
const axios = require('axios');

const config = require('../config');

//MODELS
const User = require('../models/User');
const Cuenta = require('../models/Cuenta');
const Transaccion = require('../models/Transaccion');
const Tarjeta = require('../models/Tarjeta');
const Confirm = require('../models/Confirm');

//FUNCTIONS
const { hash, compare } = require('../functions/passwordHash');
const { createCuentaCorriente } = require('../functions/Cuentas');
const {
  crearTarjetaCredito,
  renovarSaldo,
  interesPagoMinimo,
} = require('../functions/tarjetas');
const { transaccionFallida } = require('../functions/transacciones');
const transporter = require('../functions/mail');

router.get('/', async (request, response) => {
  response.status(200).json({
    ok: true,
  });
});

//Transferencias
router.post('/transferencia', async (request, response) => {
  try {
    const { userId, identificadorU, identificadorTipoU } = request;
    let {
      cuentaDestino,
      cuentaOrigen,
      monto,
      identificador,
      identificadorTipo,
      descripcion,
    } = request.body;

    if (
      !cuentaDestino ||
      !cuentaOrigen ||
      !monto ||
      !identificador ||
      !identificadorTipo ||
      !descripcion
    ) {
      response.status(400).json({
        ok: false,
        error: 'Missing data',
      });
      return;
    }
    monto = parseFloat(monto);
    let fecha = dayjs().tz(timeZoneUser);

    if (cuentaDestino === cuentaOrigen) {
      response.status(400).json({
        ok: false,
        error: 'Data incorrecta',
      });
      return;
    }

    let origen = await Cuenta.findOne({ numero: cuentaOrigen });
    if (!origen) {
      response.status(400).json({
        ok: false,
        error: 'Cuenta de origen no encontrada',
      });
      return;
    }
    let destino = await Cuenta.findOne({ numero: cuentaDestino });
    if (!destino) {
      response.status(400).json({
        ok: false,
        error: 'Cuenta de destino no encontrada',
      });
      await transaccionFallida('transferencia', origen._id, null, monto, fecha);
      return;
    }

    //usuario que hace solicitud posee la cuenta de origen
    const user = await User.findById(userId);
    let exist = false;
    for (cuenta of user.cuentas) {
      if (origen._id.equals(cuenta._id)) {
        exist = true;
        break;
      }
    }
    if (!exist) {
      response.status(400).json({
        ok: false,
        error: 'El usuario no posee la cuenta de origen',
      });
      return;
    }

    //los datos de cuenta de destino son correctos
    let destinoUser = destino.usuario;
    destinoUser = await User.findById(destinoUser);
    if (!destinoUser) {
      response.status(400).json({
        ok: false,
        error: 'El usuario de destino no existe',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }

    if (
      destinoUser?.identificacion?.identificador !== identificador ||
      destinoUser?.identificacion?.identificadorTipo !== identificadorTipo
    ) {
      response.status(400).json({
        ok: false,
        error: 'Datos de destino incorrectos',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }
    if (monto <= 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto incorrecto',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }
    if (origen.monto - monto < 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto insuficiente en cuenta',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }

    origen = await Cuenta.findByIdAndUpdate(
      origen._id,
      { monto: origen.monto - monto },
      { new: true }
    );
    destino = await Cuenta.findByIdAndUpdate(
      destino._id,
      { monto: destino.monto + monto },
      { new: true }
    );
    const id = mongoose.Types.ObjectId();
    const transferencia = new Transaccion({
      _id: id,
      monto,
      descripcion,
      comision: 0,
      tipo: 'transferencia',
      origen: {
        id: origen._id,
        estadoPuntual: origen.monto,
      },
      destino: {
        id: destino._id,
        estadoPuntual: destino.monto,
      },
      fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    const transferenciaData = await Transaccion.findById(id);
    isContacto = false;
    if (user.libretaContactos.length) {
      for (cuenta of user.libretaContactos) {
        if (cuenta.cuenta.equals(destino._id)) {
          isContacto = true;
          break;
        }
      }
    }

    let mailOptions = {
      from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
      to: user.email, // list of receivers
      subject: 'Transferencia realizada', // Subject line
      text: 'Bienvenido(a) a nuestro banco', // plain text body
      html: `	<div style="text-align: center; margin: 5px;">
							<h2>Hola ${user.primerNombre} ${user.primerApellido}, se registro una trasferencia realizada desde tu cuenta, con los siguientes datos </h2>
								<table style="width:70%">
								<tr>
									<td>Número de referencia:</td>
									<td>${transferenciaData.numeroRef}</td>
								</tr>
								<tr>
									<td>Identificador:</td>
									<td>${id}</td>
								</tr>
								<tr>
									<td>Cuenta de origen:</td>
									<td>${cuentaOrigen}</td>
								</tr>
								<tr>
									<td>Cuenta de destino:</td>
									<td>${cuentaDestino}</td>
								</tr>
								<tr>
									<td>Monto:</td>
									<td>${monto} Bs</td>
								</tr>
								<tr>
									<td>Fecha:</td>
									<td>${fecha.$D}/${fecha.$M}/${fecha.$y}</td>
								</tr>
								<tr>
									<td>Hora:</td>
									<td>${fecha.$H}:${fecha.$m} Hora Venezuela</td>
								</tr>
							</table>

								<h2>Puedes encontrar más información del movimiento en Banco en Linea</h2>
								`, // html body
    };

    let mailOptions2 = {
      from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
      to: destinoUser.email, // list of receivers
      subject: 'Transferencia recibida', // Subject line
      text: 'Bienvenido(a) a nuestro banco', // plain text body
      html: `	<div style="text-align: center; margin: 5px;">
								<h2>Hola ${destinoUser.primerNombre} ${destinoUser.primerApellido}, se registro una trasferencia realizada a tu cuenta, con los siguientes datos </h2>
								<table style="width:70%">
								<tr>
									<td>Número de referencia:</td>
									<td>${transferenciaData.numeroRef}</td>
								</tr>
								<tr>
									<td>Identificador:</td>
									<td>${id}</td>
								</tr>
								<tr>
									<td>Cuenta de origen:</td>
									<td>${cuentaOrigen}</td>
								</tr>
								<tr>
									<td>Cuenta de destino:</td>
									<td>${cuentaDestino}</td>
								</tr>
								<tr>
									<td>Monto:</td>
									<td>${monto} Bs</td>
								</tr>
								<tr>
									<td>Fecha:</td>
									<td>${fecha.$D}/${fecha.$M}/${fecha.$y}</td>
								</tr>
								<tr>
									<td>Hora:</td>
									<td>${fecha.$H}:${fecha.$m} Hora Venezuela</td>
								</tr>
							</table>
								<h2>Puedes encontrar más información del movimiento en Banco en Linea</h2>
								`, // html body
    };
    let emailSend = transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        response.status(500).json({
          success: false,
          error: 'Error inesperado, intente mas tarde',
        });
        console.log('[transferencia tercero send - send email error] ', err);
        return;
      }
    });

    emailSend = transporter.sendMail(mailOptions2, function (err, info) {
      if (err) {
        response.status(500).json({
          success: false,
          error: 'Error inesperado, intente mas tarde',
        });
        console.log('[transferencia tercero destino - send email error] ', err);
        return;
      }
    });

    response.status(200).json({
      ok: true,
      data: {
        transferencia: transferenciaData,
        contacto: isContacto,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/transferenciaOtherBank', async (request, response) => {
  try {
    const { userId, identificadorU, identificadorTipoU } = request;
    let {
      cuentaDestino,
      cuentaOrigen,
      monto,
      identificador,
      identificadorTipo,
      descripcion,
    } = request.body;

    if (
      !cuentaDestino ||
      !cuentaOrigen ||
      !monto ||
      !identificador ||
      !identificadorTipo ||
      !descripcion
    ) {
      response.status(400).json({
        ok: false,
        error: 'Missing data',
      });
      return;
    }
    monto = parseFloat(monto);
    let fecha = dayjs().tz(timeZoneUser);

    if (cuentaDestino === cuentaOrigen) {
      response.status(400).json({
        ok: false,
        error: 'Data incorrecta',
      });
      return;
    }

    let origen = await Cuenta.findOne({ numero: cuentaOrigen });
    if (!origen) {
      response.status(400).json({
        ok: false,
        codigo: 1,
        error: 'Cuenta de origen no encontrada',
      });
      return;
    }

    //usuario que hace solicitud posee la cuenta de origen
    const user = await User.findById(userId);
    let exist = false;
    for (cuenta of user.cuentas) {
      if (origen._id.equals(cuenta._id)) {
        exist = true;
        break;
      }
    }
    if (!exist) {
      response.status(400).json({
        ok: false,
        codigo: 1,
        error: 'El usuario no posee la cuenta de origen',
      });
      return;
    }
    if (monto <= 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto incorrecto',
      });
      await transaccionFallida('transferencia', origen._id, monto, fecha);
      return;
    }
    if (origen.monto - monto < 0) {
      response.status(400).json({
        ok: false,
        codigo: 3,
        error: 'Monto insuficiente en cuenta',
      });
      await transaccionFallida('transferencia', origen._id, monto, fecha);
      return;
    }
    let data;
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.bank.vittorioadesso.com/bank/transaction/',
        data: {
          acc_src: {
            number: cuentaOrigen,
            document_id: identificadorTipoU + identificadorU,
          },
          acc_dst: {
            number: cuentaDestino,
            document_id: identificadorTipo + identificador,
          },
          amount: monto,
          reason: descripcion,
        },
      });
      data = response.data;
    } catch (error) {
      await transaccionFallida(
        'otherBankTransfer',
        origen._id,
        null,
        monto,
        fecha,
        'Error inesperado.'
      );
      console.log(
        error,
        error.response.status,
        '/////////',
        error.response.data.detail,
        '/////////',
        error.response.data
      );
      return response
        .status(error.response.status)
        .json({ ok: false, message: error.response.data.detail.target });
    }

    origen = await Cuenta.findByIdAndUpdate(
      origen._id,
      { monto: origen.monto - monto },
      { new: true }
    );
    const id = mongoose.Types.ObjectId();
    const transferencia = new Transaccion({
      _id: id,
      monto,
      descripcion,
      comision: 0,
      tipo: 'otherBankTransfer',
      origen: {
        id: origen._id,
        estadoPuntual: origen.monto,
      },
      fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    console.log(data);
    const transferenciaData = await Transaccion.findById(id);
    isContacto = false;
    if (user.libretaContactos.length) {
      for (cuenta of user.libretaContactos) {
        if (cuenta.cuenta.equals(otherAccountId)) {
          isContacto = true;
          break;
        }
      }
    }

    response.status(200).json({
      ok: true,
      data: {
        transferencia: transferenciaData,
        contacto: isContacto,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/transferencia-propia', async (request, response) => {
  try {
    const { userId, identificadorU, identificadorTipoU } = request;
    let { cuentaDestino, cuentaOrigen, monto, descripcion } = request.body;
    let fecha = dayjs().tz(timeZoneUser);
    if (!cuentaDestino || !cuentaOrigen || !monto || !descripcion) {
      response.status(400).json({
        ok: false,
        error: 'Missing data',
      });
      return;
    }
    monto = parseFloat(monto);

    if (cuentaDestino === cuentaOrigen) {
      response.status(400).json({
        ok: false,
        error: 'Data incorrecta',
      });
      return;
    }
    let origen = await Cuenta.findOne({ numero: cuentaOrigen });
    if (!origen) {
      response.status(400).json({
        ok: false,
        error: 'Cuenta de origen no encontrada',
      });
      return;
    }
    let destino = await Cuenta.findOne({ numero: cuentaDestino });
    if (!destino) {
      response.status(400).json({
        ok: false,
        error: 'Cuenta de destino no encontrada',
      });
      await transaccionFallida('transferencia', origen._id, '', monto, fecha);
      return;
    }
    //usuario que hace solicitud posee la cuenta de origen
    const user = await User.findById(userId);
    let existOrigen = false;
    let existDestino = false;
    for (cuenta of user.cuentas) {
      if (origen._id.equals(cuenta._id)) {
        existOrigen = true;
      }
      if (destino._id.equals(cuenta._id)) {
        existDestino = true;
      }
    }
    if (!existOrigen) {
      response.status(400).json({
        ok: false,
        error: 'El usuario no posee la cuenta de origen',
      });
      return;
    }
    if (!existDestino) {
      response.status(400).json({
        ok: false,
        error: 'El usuario no posee la cuenta de destino',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );

      return;
    }

    if (monto <= 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto incorrecto',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }
    if (origen.monto - monto < 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto insuficiente en cuenta',
      });
      await transaccionFallida(
        'transferencia',
        origen._id,
        destino._id,
        monto,
        fecha
      );
      return;
    }

    origen = await Cuenta.findByIdAndUpdate(
      origen._id,
      { monto: origen.monto - monto },
      { new: true }
    );
    destino = await Cuenta.findByIdAndUpdate(
      destino._id,
      { monto: destino.monto + monto },
      { new: true }
    );
    const id = mongoose.Types.ObjectId();
    const transferencia = new Transaccion({
      _id: id,
      monto,
      descripcion,
      comision: 0,
      tipo: 'transferencia',
      origen: {
        id: origen._id,
        estadoPuntual: origen.monto,
      },
      destino: {
        id: destino._id,
        estadoPuntual: destino.monto,
      },
      fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    const transferenciaData = await Transaccion.findById(id);
    response.status(200).json({
      ok: true,
      data: {
        transferencia: transferenciaData,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//Cuentas
router.post('/solicitar-cuenta', async (request, response) => {
  try {
    const { userId } = request;
    let { tipoCuenta, montoCuenta } = request.body;
    if (montoCuenta) {
      montoCuenta = parseFloat(montoCuenta);
      if (montoCuenta <= 0) montoCuenta = 50;
    } else {
      montoCuenta = 50;
    }

    if (tipoCuenta === 'corriente') {
      const user = await User.findById(userId);
      const { id, numero, tipo, monto } = await createCuentaCorriente(
        userId,
        montoCuenta
      );
      user.cuentas = user.cuentas.push({ _id: id });
      await User.findByIdAndUpdate(userId, { cuentas: user.cuentas });
      response.status(200).json({
        ok: true,
        data: {
          cuenta: {
            _id: id,
            numero,
            monto,
            tipo,
          },
        },
      });
      return;
    }
    if (tipoCuenta === 'ahorro') {
      response.status(400).json({
        ok: false,
        error: 'No se pueden abrir cuentas de ahorro en este momento',
      });
      return;
    }
    response.status(400).json({
      ok: false,
      error: 'Se requiere especificar un tipo de cuenta, ahorro o corriente',
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.get('/cuenta/:id', async (request, response) => {
  try {
    const { id } = request.params;
    const data = await Cuenta.findById(id);
    if (!data) {
      response.status(400).json({
        ok: false,
        error: 'no existe la cuenta',
      });
      return;
    }
    response.status(200).json({
      ok: true,
      data: {
        cuenta: data,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.get('/cuentas', async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId).populate({
      path: 'cuentas._id',
      model: 'Cuenta',
    });
    let dataCuentas = user.cuentas;
    if (dataCuentas.length) {
      dataCuentas = dataCuentas.map((cuenta) => {
        const info = cuenta._id;
        return info;
      });
    }

    response.status(200).json({
      ok: true,
      data: {
        cuentas: dataCuentas,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/movimientos-cuenta', async (request, response) => {
  try {
    let { tipo, estatus, numero, fechaFrom, fechaTo } = request.body;
    if (!numero) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    const cuentaCliente = await Cuenta.findOne({ numero });
    if (!cuentaCliente) {
      response.status(400).json({
        ok: false,
        error: 'la cuenta no fue encontrada',
      });
      return;
    }
    //console.log(cuentaCliente)
    let querySearch = {};
    //buscamos todos los movimientos segun el tipo y estatus
    let movimientos = [];
    if (!tipo || (tipo !== 'saliente' && tipo !== 'entrante')) {
      tipo = '';
    }
    //console.log(tipo)
    if (tipo !== '') {
      if (tipo === 'saliente') {
        /* {
					'identificacion.identificador':identificador,    
					'identificacion.rol':rol,
					'identificacion.identificadorTipo':identificadorTipo
				 }*/
        /* age:{$in:[25,30,35]}} */
        querySearch = {
          tipo: { $in: ['transferencia', 'pagoElectronico', 'otherBankTransfer'] },
          'origen.id': cuentaCliente.id,
        };
      }
      if (tipo === 'entrante') {
        querySearch = {
          tipo: { $in: ['transferencia', 'pagoElectronico', 'otherBankTransfer'] },
          'destino.id': cuentaCliente.id,
        };
      }
    } else {
      querySearch = {
        tipo: { $in: ['transferencia', 'pagoElectronico', 'otherBankTransfer'] },
        $or: [
          { 'origen.id': cuentaCliente.id },
          { 'destino.id': cuentaCliente.id },
        ],
      };
    }

    //modificamos querySearch para buscar segun el estatus
    if (!estatus || (estatus !== 'exitosa' && estatus !== 'fallida'))
      estatus = '';
    if (estatus !== '') {
      if (estatus === 'exitosa') {
        /* {
					'identificacion.identificador':identificador,    
					'identificacion.rol':rol,
					'identificacion.identificadorTipo':identificadorTipo
				 }*/
        /* age:{$in:[25,30,35]}} */
        querySearch.estatus = estatus;
      }
      if (estatus === 'fallida') {
        querySearch.estatus = estatus;
      }
    } else {
      querySearch.estatus = { $in: ['exitosa', 'fallida'] };
    }
    //console.log(querySearch)
    movimientos = await Transaccion.find(querySearch);
    //console.log(movimientos)

    let searchDate = false;
    if (fechaTo && fechaFrom) {
      let validDates = true;
      fechaFrom = dayjs(fechaFrom).tz(timeZoneUser);
      fechaTo = dayjs(fechaTo).tz(timeZoneUser);
      if (!fechaTo.isValid() || !fechaFrom.isValid()) validDates = false;
      //console.log(fechaTo)
      //console.log(fechaFrom)
      if (validDates) {
        let validRango =
          new Date(fechaTo).getTime() + 60000 * 60 * 24 - 1 >
          new Date(fechaFrom).getTime();
        if (validRango) searchDate = true;
      }
    }

    //si existe un rango valido de fechcas filtramos
    let movimientosAux = movimientos;
    movimientos = [];
    if (searchDate) {
      for (movimiento of movimientosAux) {
        const timeTo = new Date(fechaTo).getTime() + 86400000 - 1;
        const timeFrom = new Date(fechaFrom).getTime();
        const timeMov = new Date(movimiento.fecha).getTime();
        if (timeMov < timeTo && timeMov > timeFrom) {
          let objToAdd = {};
          let idCLiente = cuentaCliente._id;
          let idOrigen = movimiento.origen.id;
          let idDestino = movimiento.destino.id;

          if (idCLiente.equals(idOrigen)) {
            //tipo saliente
            objToAdd.tipo = 'saliente';
            objToAdd.estadoPuntual = movimiento?.origen?.estadoPuntual || null;
          }
          if (idCLiente.equals(idDestino)) {
            //tipo entrante
            objToAdd.tipo = 'entrante';
            objToAdd.estadoPuntual = movimiento?.destino?.estadoPuntual || null;
          }

          objToAdd._id = movimiento._id;
          objToAdd.monto = movimiento.monto;
          objToAdd.descripcion = movimiento?.descripcion || '';
          objToAdd.estatus = movimiento?.estatus || 'exitosa';
          objToAdd.numeroRef = movimiento.numeroRef;
          objToAdd.fecha = movimiento.fecha;

          movimientos.push(objToAdd);
        }
      }
    } else {
      for (movimiento of movimientosAux) {
        let objToAdd = {};
        let idCLiente = cuentaCliente._id;
        let idOrigen = movimiento?.origen?.id || null;
        let idDestino = movimiento?.destino?.id || null;

        if (idCLiente.equals(idOrigen)) {
          //tipo saliente
          objToAdd.tipo = 'saliente';
          objToAdd.estadoPuntual = movimiento?.origen?.estadoPuntual || null;
        }
        if (idCLiente.equals(idDestino)) {
          //tipo entrante
          objToAdd.tipo = 'entrante';
          objToAdd.estadoPuntual = movimiento?.destino?.estadoPuntual || null;
        }

        objToAdd._id = movimiento._id;
        objToAdd.monto = movimiento.monto;
        objToAdd.descripcion = movimiento.descripcion;
        objToAdd.estatus = movimiento?.estatus || 'exitosa';
        objToAdd.numeroRef = movimiento.numeroRef;
        objToAdd.fecha = movimiento.fecha;

        movimientos.push(objToAdd);
      }
    }

    //ordenamos de mas actuales a mas antiguas

    if (movimientos.length) {
      movimientos = movimientos.sort((a, b) => {
        let dateA = new Date(a.fecha).getTime();
        let dateB = new Date(b.fecha).getTime();
        return dateB - dateA;
      });
    }

    response.status(200).json({
      ok: true,
      data: { movimientos },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//Libreta de contactos
router.get('/contacto', async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId).populate({
      path: 'libretaContactos.cuenta',
      model: 'Cuenta',
    });
    let dataCuentas = user.libretaContactos;
    let libretaContactos = [];
    if (dataCuentas.length) {
      for (cuenta of dataCuentas) {
        const userContacto = await User.findById(cuenta.cuenta.usuario);
        const data = {
          nombre: cuenta?.nombre,
          numero: cuenta?.cuenta?.numero,
          cuentaId: cuenta.cuenta._id,
          identificador: userContacto?.identificacion?.identificador || '',
          identificadorTipo:
            userContacto?.identificacion?.identificadorTipo || '',
        };
        libretaContactos.push(data);
      }
    }

    response.status(200).json({
      ok: true,
      data: {
        libretaContactos,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/contacto', async (request, response) => {
  try {
    const { cuenta, nombreAlias, identificador, identificadorTipo } =
      request.body;
    if (!cuenta || !nombreAlias || !identificador || !identificadorTipo) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }

    const { userId } = request;
    const user = await User.findById(userId);

    const cuentaContacto = await Cuenta.findOne({
      numero: cuenta,
    }).populate({
      path: 'usuario',
      model: 'User',
    });
    if (cuentaContacto) {
      const usercontacto = cuentaContacto.usuario.identificacion;
      if (
        usercontacto.identificador === identificador &&
        usercontacto.identificadorTipo === identificadorTipo
      ) {
        let includes = false;
        for (contacto of user.libretaContactos) {
          if (contacto.cuenta.equals(cuentaContacto._id)) {
            includes = true;
            break;
          }
        }
        if (!includes) {
          let cuentasForSave = user.libretaContactos;
          cuentasForSave.push({
            nombre: nombreAlias,
            cuenta: cuentaContacto._id,
          });
          await User.findByIdAndUpdate(userId, {
            libretaContactos: cuentasForSave,
          });
        }
        response.status(200).json({
          ok: true,
        });
      }
      response.status(400).json({
        ok: false,
        error: 'Datos de identificacion incorrectos',
      });
    }
    response.status(400).json({
      ok: false,
      error: 'No existe la cuenta',
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/contacto/:idCuenta', async (request, response) => {
  try {
    const { idCuenta } = request.params;
    const { userId } = request;
    const { nombreAlias } = request.body;

    const user = await User.findById(userId);
    let cambios = false;
    let dataCuentas = user.libretaContactos;
    if (dataCuentas.length) {
      for (cuenta of dataCuentas) {
        if (cuenta.cuenta.equals(idCuenta)) {
          cuenta.nombre = nombreAlias;
          cambios = true;
        }
      }
      if (cambios) {
        await User.findByIdAndUpdate(userId, {
          libretaContactos: dataCuentas,
        });
      }
    }
    response.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.delete('/contacto/:idCuenta', async (request, response) => {
  try {
    const { idCuenta } = request.params;
    const { userId } = request;

    const user = await User.findById(userId);
    let cambios = false;
    let dataCuentas = user.libretaContactos;
    let libretaContactos = [];
    if (dataCuentas.length) {
      for (cuenta of dataCuentas) {
        if (cuenta.cuenta.equals(idCuenta)) {
          cambios = true;
        } else {
          libretaContactos.push(cuenta);
        }
      }
      if (cambios) {
        await User.findByIdAndUpdate(userId, {
          libretaContactos: libretaContactos,
        });
      }
    }
    response.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//tarjetas de credito
router.post('/tarjeta-credito', async (request, response) => {
  //genera tarjeta de credito
  try {
    const { userId } = request;
    const { id, numero, monto, cvc, fechaExpiracion } =
      await crearTarjetaCredito(userId);
    const user = await User.findById(userId);

    let tarjetas = user.tarjetas;
    tarjetas.push({ _id: id });

    await User.findByIdAndUpdate(userId, { tarjetas });

    response.status(200).json({
      ok: true,
      data: {
        tarjeta: {
          numero,
          _id: id,
          monto,
          cvc,
          fechaExpiracion,
        },
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/consultar-tarjeta-credito', async (request, response) => {
  //genera tarjeta de credito
  try {
    const { userId } = request;
    const { numero } = request.body;
    if (!numero) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    let tarjeta = await Tarjeta.findOne({ numero, tipo: 'credito' });
    if (!tarjeta) {
      response.status(400).json({
        ok: false,
        error: 'la tarjeta no fue encontrada',
      });
      return;
    }

    //verifica saldo actual y se renueva si es necesesario
    const { saldoDisponible, fechaCorte } = await renovarSaldo(numero);
    const { saldoActual, fechaMinimo } = await interesPagoMinimo(numero);
    // monto min por un monto calculado en base al porcentaje de este sobre ña deudasobre la deuda
    tarjeta.infoCredito.pagoMinimo = String(
      (saldoActual * parseFloat(tarjeta.infoCredito.pagoMinimo)) / 100
    );

    tarjeta.infoCredito.saldoDisponible = String(saldoDisponible);
    tarjeta.infoCredito.fechaCorte = fechaCorte;
    tarjeta.infoCredito.saldoActual = String(saldoActual);
    tarjeta.infoCredito.fechaLimite = fechaMinimo;

    response.status(200).json({
      ok: true,
      data: {
        tarjeta,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.get('/tarjetas-credito', async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId).populate({
      path: 'tarjetas._id',
      model: 'Tarjeta',
    });
    //console.log(user.tarjetas)
    let dataTarjetas = [];
    if (user.tarjetas.length) {
      for (tarjeta of user.tarjetas) {
        let estado = tarjeta._id.estado || 'activada';
        if (estado === 'desactivada') agregar = false;
        if (estado === 'activada') {
          dataTarjetas.push({
            _id: tarjeta._id._id,
            numero: tarjeta._id.numero,
            monto: tarjeta?._id?.infoCredito?.saldoDisponible || 0,
            estado: 'activada',
            cvc: tarjeta._id.cvc,
            fechaExpiracion: tarjeta._id.fechaVenc
          });
        }
      }
    }

    response.status(200).json({
      ok: true,
      data: {
        tarjetas: dataTarjetas,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/desactivar-credito', async (request, response) => {
  try {
    const { userId } = request;
    const { numero } = request.body;
    if (!numero) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }

    const tarjeta = await Tarjeta.findOne({ numero, tipo: 'credito' });
    if (!tarjeta) {
      response.status(400).json({
        ok: false,
        error: 'tarjeta no encontrada',
      });
      return;
    }
    //console.log(tarjeta)
    if (tarjeta.estado === 'desactivada') {
      response.status(200).json({
        ok: true,
      });
      return;
    }

    await Tarjeta.findByIdAndUpdate(tarjeta._id, { estado: 'desactivada' });
    response.status(400).json({
      ok: true,
    });
    return;
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/pago-manual-credito', async (request, response) => {
  try {
    const { userId } = request;
    let { tarjeta, cuenta, monto } = request.body;
    let fecha = dayjs().tz(timeZoneUser);
    if (!tarjeta || !cuenta || !monto) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    const tarjetaUser = await Tarjeta.findOne({
      numero: tarjeta,
      tipo: 'credito',
    });
    const cuentaUser = await Cuenta.findOne({ numero: cuenta });
    if (!tarjetaUser) {
      response.status(400).json({
        ok: false,
        error: 'no existe la tarjeta',
      });
      return;
    }

    if (!cuentaUser) {
      response.status(400).json({
        ok: false,
        error: 'no existe la cuenta',
      });
      return;
    }
    monto = parseFloat(monto);
    if (tarjetaUser.estado === 'desactivada') {
      response.status(400).json({
        ok: false,
        error: 'La tarjeta se encuentra desactivada',
      });
      await transaccionFallida(
        'pagoTarjeta',
        cuentaUser._id,
        tarjetaUser._id,
        monto,
        fecha
      );
      return;
    }
    //actualizamos y verificamos saldo disponible y actual
    const { saldoDisponible, fechaCorte } = await renovarSaldo(tarjeta);
    const { saldoActual, fechaMinimo } = await interesPagoMinimo(tarjeta);
    if (saldoActual <= 0) {
      response.status(400).json({
        ok: false,
        error: 'no existe deuda',
      });
      return;
    }

    let montoMinimo =
      (saldoActual * parseFloat(tarjetaUser?.infoCredito?.pagoMinimo)) / 100 || 5;
    if (
      monto > saldoActual ||
      monto <= 0 ||
      monto < montoMinimo ||
      cuentaUser.monto - monto < 0 ||
      monto + saldoDisponible > parseFloat(tarjetaUser?.infoCredito?.montoTotal)
    ) {
      //monto a querer pagar > lo que se le debe al banco
      //monto es menor o igual 0
      //monto es menor al pago minimo
      //montto a pagar dejaria la cuenat en negativo
      //monto + disponible es mayor que lo que puede tomar la tarjeta
      response.status(400).json({
        ok: false,
        error: 'monto incorrecto a pagar',
      });
      await transaccionFallida(
        'pagoTarjeta',
        cuentaUser._id,
        tarjetaUser._id,
        monto,
        fecha
      );
      return;
    }

    await Tarjeta.findByIdAndUpdate(tarjetaUser._id, {
      'infoCredito.saldoActual': String(saldoActual - monto),
      'infoCredito.saldoDisponible': String(saldoDisponible + monto),
      'infoCredito.pagoMinEfectuado': true,
    });
    await Cuenta.findByIdAndUpdate(cuentaUser._id, {
      monto: cuentaUser.monto - monto,
    });

    const id = mongoose.Types.ObjectId();
    const pago = new Transaccion({
      _id: id,
      monto,
      descripcion: 'pago manual de tarjeta',
      comision: 0,
      tipo: 'pagoTarjeta',
      origen: {
        id: cuentaUser._id,
        estadoPuntual: parseFloat(cuentaUser.monto),
      },
      destino: {
        id: tarjetaUser._id,
        estadoPuntual: saldoDisponible,
      },
      fecha,
      estatus: 'exitosa',
    });
    await pago.save();
    response.status(200).json({
      ok: true,
    });
    return;
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.post('/movimientos-tarjeta', async (request, response) => {
  try {
    let { tipo, estatus, numero, fechaFrom, fechaTo } = request.body;
    /*
      tipo: 
      -pagoTarjeta:pago manual tarjeta, la tarjeta es destino, puede ser fallida o exitosa
      -pagoElectronico:pago estandar en la pasarela con propio banco, la tarjeta es origen
      estatus: exitosa/fallida
    */

    if (!numero) {
      response.status(400).json({
        ok: false,
        error: 'missing numero de tarjeta',
      });
      return;
    }
    const tarjetaCliente = await Tarjeta.findOne({ numero });
    if (!tarjetaCliente) {
      response.status(400).json({
        ok: false,
        error: 'no se encontro la tarjeta',
      });
      return;
    }

    let querySearch = {};
    let movimientos = [];
    if (!tipo || (tipo !== 'pagoTarjeta' && tipo !== 'pagoElectronico')) {
      tipo = '';
    }

    if (tipo != '') {
      //hay un tipo particular a buscar
      //pagos electronicos a nuestras cuentas y del otro banco
      if (tipo === 'pagoElectronico' || tipo === 'otherBankCards') {
        querySearch = {
          tipo,
          'origen.id': tarjetaCliente._id,
        };
      }

      //Pago manual de la tarjeta donde aumenta el saldo disponible
      if (tipo === 'pagoTarjeta') {
        querySearch = {
          tipo,
          'destino.id': tarjetaCliente._id,
        };
      }
    } else {
      querySearch = {
        $or: [
          {
            tipo: { $in: ['pagoElectronico', 'otherBankCards'] },
            'origen.id': tarjetaCliente._id,
          },
          {
            tipo: 'pagoTarjeta',
            'destino.id': tarjetaCliente._id,
          },
        ],
      };
    }

    //modificamos querySearch para buscar segun el estatus
    if (!estatus || (estatus !== 'exitosa' && estatus !== 'fallida'))
      estatus = '';
    if (estatus !== '') {
      querySearch.estatus = estatus;
    } else {
      querySearch.estatus = { $in: ['exitosa', 'fallida'] };
    }

    movimientos = await Transaccion.find(querySearch);

    //manejo de fechas
    let searchDate = false;
    if (fechaTo && fechaFrom) {
      let validDates = true;
      fechaFrom = dayjs(fechaFrom).tz(timeZoneUser);
      fechaTo = dayjs(fechaTo).tz(timeZoneUser);
      if (!fechaTo.isValid() || !fechaFrom.isValid()) validDates = false;
      //console.log(fechaTo)
      //console.log(fechaFrom)
      if (validDates) {
        let validRango =
          new Date(fechaTo).getTime() + 60000 * 60 * 24 - 1 >
          new Date(fechaFrom).getTime();
        if (validRango) searchDate = true;
      }
    }

    //si existe un rango valido de fechcas filtramos
    let movimientosAux = movimientos;
    movimientos = [];
    if (searchDate) {
      for (movimiento of movimientosAux) {
        const timeTo = new Date(fechaTo).getTime() + 86400000 - 1;
        const timeFrom = new Date(fechaFrom).getTime();
        const timeMov = new Date(movimiento.fecha).getTime();
        if (timeMov < timeTo && timeMov > timeFrom) {
          let objToAdd = {};
          let idCLiente = tarjetaCliente._id;
          let idOrigen = movimiento?.origen?.id;
          let idDestino = movimiento?.destino?.id;

          if (idCLiente.equals(idOrigen)) {
            //tipo saliente
            //TODO:deberia usar el tipo de pago electronico y pago tarjeta
            objToAdd.tipo = 'Pago Electronico';
            objToAdd.estadoPuntual = movimiento?.origen?.estadoPuntual || null;
          }
          if (idCLiente.equals(idDestino)) {
            //tipo entrante
            objToAdd.tipo = 'Pago de Tarjeta';
            objToAdd.estadoPuntual = movimiento?.destino?.estadoPuntual || null;
          }

          objToAdd._id = movimiento._id;
          objToAdd.monto = movimiento.monto;
          objToAdd.descripcion = movimiento?.descripcion || '';
          objToAdd.estatus = movimiento?.estatus || 'exitosa';
          objToAdd.numeroRef = movimiento.numeroRef;
          objToAdd.fecha = movimiento.fecha;

          movimientos.push(objToAdd);
        }
      }
    } else {
      for (movimiento of movimientosAux) {
        let objToAdd = {};
        let idCLiente = tarjetaCliente._id;
        let idOrigen = movimiento?.origen?.id;
        let idDestino = movimiento?.destino?.id;

        if (idCLiente.equals(idOrigen)) {
          //tipo saliente
          objToAdd.tipo = 'Pago Electronico';
          objToAdd.estadoPuntual = movimiento?.origen?.estadoPuntual || null;
        }
        if (idCLiente.equals(idDestino)) {
          //tipo entrante
          objToAdd.tipo = 'Pago de Tarjeta';
          objToAdd.estadoPuntual = movimiento?.destino?.estadoPuntual || null;
        }

        objToAdd._id = movimiento._id;
        objToAdd.monto = movimiento.monto;
        objToAdd.descripcion = movimiento?.descripcion || '';
        objToAdd.estatus = movimiento?.estatus || 'exitosa';
        objToAdd.numeroRef = movimiento.numeroRef;
        objToAdd.fecha = movimiento.fecha;

        movimientos.push(objToAdd);
      }
    }

    //ordenamos de mas actuales a mas antiguas

    if (movimientos.length) {
      movimientos = movimientos.sort((a, b) => {
        let dateA = new Date(a.fecha).getTime();
        let dateB = new Date(b.fecha).getTime();
        return dateB - dateA;
      });
    }

    response.status(200).json({
      ok: true,
      data: {
        movimientos,
      },
    });
  } catch (err) {
    console.log('movientos-tarjeta error', err);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//datos personales
router.post('/change-email', async (request, response) => {
  try {
    const { userId } = request;
    const { email, password } = request.body;
    if (!email || !password || password.trim() === '' || email.trim() === '') {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    const user = await User.findById(userId);
    if (email != user.email) {
      let validPassword = await compare(password, user.password);
      if (!validPassword) {
        response.status(400).json({
          ok: false,
          error: 'contraseña actual incorrecta',
        });
        return;
      }
      const dataEmail = await User.findOne({ email });
      if (dataEmail) {
        response.status(400).json({
          ok: false,
          error: 'correo ya en uso',
        });
        return;
      }
      await User.findByIdAndUpdate(userId, { email });
    }

    response.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});
router.post('/change-password', async (request, response) => {
  try {
    const { userId } = request;
    const { password, oldPassword } = request.body;
    if (
      !password ||
      !oldPassword ||
      oldPassword.trim() === '' ||
      password.trim() === ''
    ) {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    const user = await User.findById(userId);
    let validPassword = await compare(oldPassword, user.password);
    if (!validPassword) {
      response.status(400).json({
        ok: false,
        error: 'contraseña actual incorrecta',
      });
      return;
    }
    let hashedPassword = await hash(password);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    let mailOptions = {
      from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
      to: user.email, // list of receivers
      subject: 'Contraseña cambiada', // Subject line
      text: 'Contraseña cambiada', // plain text body
      html: `	<div style="text-align: center; margin: 5px;">
      <h2>Hola ${user.primerNombre} ${user.primerApellido}, se ha completa el proceso de cambio de contraseña de tu cuenta</h2> 
                </div>`, // html body
    };

    let emailSend = transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        response.status(500).json({
          success: false,
          error: 'Error inesperado, intente mas tarde',
        });
        console.log('[change-password send email error] ', err);
        return;
      }
    });

    response.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});
router.post('/recuperar-password', async (request, response) => {
  try {
    const { userId } = request;
    const { password } = request.body;
    if (!password || password.trim() === '') {
      response.status(400).json({
        ok: false,
        error: 'missing data',
      });
      return;
    }
    const user = await User.findById(userId);
    const confirmData = await Confirm.findOne({
      email: user.email,
      type: 'resetpwd',
    });
    if (confirmData) {
      if (confirmData.confirmCode) {
        let hashedPassword = await hash(password);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
        await Confirm.findOneAndDelete({ email: user.email, type: 'resetpwd' });

        let mailOptions = {
          from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
          to: user.email, // list of receivers
          subject: 'Contraseña recuperada', // Subject line
          text: 'Contraseña recuperada', // plain text body
          html: `	<div style="text-align: center; margin: 5px;">
          <h2>Hola ${user.primerNombre} ${user.primerApellido}, se ha completa el proceso de recuperacion de contraseña de tu cuenta, puedes ingresar a Banca en linea </h2> 
                    </div>`, // html body
        };

        let emailSend = transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            response.status(500).json({
              success: false,
              error: 'Error inesperado, intente mas tarde',
            });
            console.log('[Contraseña recuperada send email error] ', err);
            return;
          }
        });

        response.status(200).json({
          ok: true,
        });
        return;
      }
      response.status(400).json({
        ok: false,
        error: 'codigo no confirmado',
      });
      return;
    }

    response.status(400).json({
      ok: false,
      error: 'no se encontro la solicitud',
    });
    return;
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

router.get('/info', async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);
    delete user['password'];
    response.status(200).json({
      ok: true,
      data: {
        usuario: user,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//Key empresa
router.get('/getKey', async (request, response) => {
  const { userId } = request;
  try {
    const user = await User.findById(userId);
    const apiKey = user.apiKey || randomString();
    if (apiKey !== user.apiKey) {
      user.apiKey = apiKey;
      await user.save();
    }
    return response.status(200).json({
      ok: true,
      data: {
        apiKey,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      ok: false,
      error: 'Error inesperado, intente mas tarde',
    });
  }
});

//Logout
router.post('/logout', async (request, response) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      response.status(400).json({
        ok: false,
        error: 'no existe el usuario',
      });
      return;
    }
    await User.findByIdAndUpdate(userId, {
      'tokenData.token': '',
      'tokenData.lastRequest': 0,
    });
    response.status(200).json({
      ok: true,
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      error,
    });
  }
});
module.exports = router;
