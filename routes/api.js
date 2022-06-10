//IMPORTS
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const transporter = require('../functions/mail');
const server = require('../config');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const mongoose = require('mongoose');
const timeZoneUser = 'America/Caracas';
const axios = require('axios');
const config = require('../config');

//FUNCTIONS
const { hash, compare } = require('../functions/passwordHash');
const { decodeToken } = require('../functions/token');
const { transaccionFallida } = require('../functions/transacciones');

//MODELS
const User = require('../models/User');
const Confirm = require('../models/Confirm');
const Tarjeta = require('../models/Tarjeta');
const Cuenta = require('../models/Cuenta');
const Transaccion = require('../models/Transaccion');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
const passRegexp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

//ROUTES
const getExpDate = (fecha)=>{
  let year = fecha.getFullYear();
  year = year.toString()
  year = year.split("")[2] + year.split("")[3]
  
  let month = fecha.getMonth() + 1;
  year = month < 10 ? "0"+month.toString() + year : month.toString() + year
  console.log(year)
  return year
}
router.post('/testcards', async (req, res) => {
  console.log('========================', req);
  console.log('//////////////////////////////////');
  const { card, apiKey, monto, nombre, cvc, expirationDate, descripcion } =
    req.body;
  const tarjeta = await Tarjeta.findOne({ numero: card });
  const user = await User.findOne({ apiKey }).populate({
    path: 'cuentas._id',
    model: 'Cuenta',
  });
  if (!user.cuentas[0]) {
    return res.status(400).json({
      ok: false,
      message:
        'apiKey invalida, revisa las mayusculas y nombre de las variables',
    });
  }
  const cuentaIdEmpresa = user.cuentas[0]._id._id;
  const fecha = dayjs().tz(timeZoneUser);
  if (!card || !tarjeta)
    return res
      .status(400)
      .json({ ok: false, message: 'No se ingreso una tarjeta valida.' });
  if (
    parseInt(monto) + parseInt(tarjeta.infoCredito.saldoActual) >
    parseInt(tarjeta.infoCredito.saldoDisponible)
  ) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'No tiene fondos suficientes.'
    );
    return res
      .status(400)
      .json({ ok: false, message: 'No tiene fondos suficientes.' });
  }
  if (String(cvc) !== tarjeta.cvc) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'Codigo de seguridad incorrecto'
    );
    return res
      .status(400)
      .json({ ok: false, message: 'Codigo de seguridad incorrecto' });
  }
  if (user.cuentas.length > 0) {
    //buscamos esa cuenta
    let cuentaEmpresa = await Cuenta.findById(cuentaIdEmpresa);

    let montoNuevo = cuentaEmpresa.monto + monto;
    const transferencia = new Transaccion({
      monto,
      descripcion,
      comision: 0,
      tipo: 'pagoElectronico',
      destino: {
        id: cuentaIdEmpresa,
        estadoPuntual: cuentaEmpresa.monto,
      },
      fecha: fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    await Cuenta.findByIdAndUpdate(cuentaIdEmpresa, { monto: montoNuevo });
  }
  return res
    .status(200)
    .json({ ok: true, message: 'Compra realizada exitosamente' });
});

router.post('/cardPayment', async (req, res) => {
  const { card, apiKey, monto, nombre, cvc, expirationDate, descripcion } =
    req.body;

  const user = await User.findOne({ apiKey }).populate({
    path: 'cuentas._id',
    model: 'Cuenta',
  });
  if (!user) {
    return res.status(400).json({
      ok: false,
      message:
        'apiKey invalida, revisa las mayusculas y nombre de las variables',
    });
  }

  const cuentaIdEmpresa = user.cuentas[0]._id._id;
  const fecha = dayjs().tz(timeZoneUser);
  if (card.includes('1337')) {
    let newExpDate = expirationDate.split("");
    newExpDate = newExpDate[0] + newExpDate[1] + "/" + newExpDate[2] + newExpDate[3] 
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.bank.vittorioadesso.com/bank/transaction/',
        data: {
          acc_dst: {
            number: user.cuentas[0]._id.numero,
            document_id:
              user.identificacion.identificadorTipo +
              user.identificacion.identificador,
          },
          card_src: {
            number: card,
            security_code: cvc,
            expiration_date: newExpDate,
          },
          amount: monto,
          reason: descripcion,
        },
      });
        let cuentaEmpresa = await Cuenta.findById(cuentaIdEmpresa);
        //otras tarjetas a nuestras cuentas bancarias
        const transferencia = new Transaccion({
          monto,
          descripcion,
          comision: 0,
          tipo: 'pagoElectronico',
          destino: {
            id: cuentaIdEmpresa,
            estadoPuntual: cuentaEmpresa.monto,
          },
          fecha: fecha,
          estatus: 'exitosa',
        });
        await transferencia.save();
        await Cuenta.findByIdAndUpdate(cuentaIdEmpresa, { monto: cuentaEmpresa.monto + monto });
        return res
          .status(200)
          .json({ ok: true, message: 'Compra realizada exitosamente' });
      
    } catch (error) {
      console.log(error.response.data)
      return res
        .status(error.response.status)
        .json({ ok: false, message: error.response.data.detail.source[0] });
    }
  }

  const tarjeta = await Tarjeta.findOne({ numero: card });
  console.log('tarjeta api', tarjeta.infoCredito)
  let montoPuntualTarjeta = tarjeta.infoCredito.saldoDisponible
  
  const year = expirationDate.split('')[2] + expirationDate.split('')[3];
  const month = expirationDate.split('')[0] + expirationDate.split('')[1];
  if (!card || !tarjeta)
    return res
      .status(400)
      .json({ ok: false, codigo:4, message: "El numero de la tarjeta origen es inválido." });
  if (
    parseFloat(monto) + parseFloat(tarjeta.infoCredito.saldoActual) >
    parseFloat(tarjeta.infoCredito.saldoDisponible)
  ) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'No tiene fondos suficientes.'
    );
    return res
      .status(400)
      .json({ ok: false, codigo:8, message: 'No tiene fondos suficientes.' });
  }
  if (String(cvc) !== tarjeta.cvc) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'Codigo de seguridad incorrecto'
    );
    return res
      .status(400)
      .json({ ok: false, codigo:5, message: 'Codigo de seguridad incorrecto' });
  }
  if (expirationDate != getExpDate(new Date(tarjeta.fechaVenc))) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false,codigo:6, message: 'Fecha de expiración incorrecta' });
  }
  if (parseInt(year) + 2000 < dayjs()['$y']) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false,codigo:7, message: 'Tarjeta expirada' });
  } else if (
    parseInt(month) < dayjs()['$M'] + 1 &&
    parseInt(year) + 2000 == dayjs()['$y']
  ) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      cuentaIdEmpresa,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false, codigo:7, message: 'Tarjeta expirada' });
  }
  if (user.cuentas.length > 0) {
    //buscamos esa cuenta
    let cuentaEmpresa = await Cuenta.findById(cuentaIdEmpresa);
    if (!cuentaEmpresa) {
      await transaccionFallida(
        'pagoElectronico',
        null,
        cuentaIdEmpresa,
        monto,
        fecha,
        'Esto no deberia pasar wtf'
      );
      return res.status(400).json({ ok: false, message: 'Cuenta inexistente' });
    }
    tarjeta.infoCredito.saldoDisponible = String(
      parseFloat(tarjeta.infoCredito.saldoDisponible) - parseFloat(monto)
    );

    tarjeta.infoCredito.saldoActual = String(
      parseFloat(monto) + parseFloat(tarjeta.infoCredito.saldoActual)
    );
    tarjeta.infoCredito.usada=true
    await tarjeta.save();
    let montoNuevo = cuentaEmpresa.monto + monto;
    const transferencia = new Transaccion({
      monto,
      descripcion,
      comision: 0,
      tipo: 'pagoElectronico',
      destino: {
        id: cuentaIdEmpresa,
        estadoPuntual: cuentaEmpresa.monto,
      },
      origen:{
        id:tarjeta._id,
        estadoPuntual:parseFloat(montoPuntualTarjeta),
      },
      fecha: fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    await Cuenta.findByIdAndUpdate(cuentaIdEmpresa, { monto: montoNuevo });
  }
  //correo realizo compra
  const userTarjeta = await User.findById(tarjeta.usuarioId)
  let mailOptions = {
    from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
    to: userTarjeta.email, // list of receivers
    subject: 'Pago electronico realizado', // Subject line
    text: 'Pago electronico realizado', // plain text body
    html: `	<div style="text-align: center; margin: 5px;">
            <h2>Hola ${userTarjeta.primerNombre} ${userTarjeta.primerApellido}, se registro un pago electronico desde tu tarjeta a ${user.primerNombre} ${user.primerApellido}, con los siguientes datos </h2>
              <table style="width:70%">
              <tr>
                <td>Tarjeta de origen:</td>
                <td>${card}</td>
              </tr>
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
              <tr>
                <td>descripcion:</td>
                <td>${descripcion}</td>
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
      console.log('[cardPayment - send email error] ', err);
      return;
    }
  });

  return res
    .status(200)
    .json({ ok: true, message: 'Compra realizada exitosamente' });
});

router.post('/otherBankCards', async (req, res) => {
  const { card, monto, cvc, expirationDate, nombre, descripcion } = req.body;
  const tarjeta = await Tarjeta.findOne({ numero: card });
  console.log(tarjeta, card);
  const user = await User.findOne({
    tarjetas: { $elemMatch: { _id: tarjeta._id } },
  }).populate({
    path: 'cuentas._id',
    model: 'Cuenta',
  });
  const fecha = dayjs().tz(timeZoneUser);
  const year = expirationDate.split('')[2] + expirationDate.split('')[3];
  const month = expirationDate.split('')[0] + expirationDate.split('')[1];
  if (!card || !tarjeta)
    return res
      .status(400)
      .json({ ok: false, codigo:4, message: 'No se ingreso una tarjeta valida.' });
  if (
    parseInt(monto) + parseInt(tarjeta.infoCredito.saldoActual) >
    parseInt(tarjeta.infoCredito.saldoDisponible)
  ) {
    await transaccionFallida(
      'otherBankCards',
      null,
      tarjeta._id,
      monto,
      fecha,
      'No tiene fondos suficientes.'
    );
    return res
      .status(400)
      .json({ ok: false, codigo:8, message: 'No tiene fondos suficientes.' });
  }
  if (String(cvc) !== tarjeta.cvc) {
    await transaccionFallida(
      'otherBankCards',
      null,
      tarjeta._id,
      monto,
      fecha,
      'Codigo de seguridad incorrecto'
    );
    return res
      .status(400)
      .json({ ok: false, message: 'Codigo de seguridad incorrecto' });
  }
  if (expirationDate != getExpDate(new Date(tarjeta.fechaVenc))) {
    await transaccionFallida(
      'pagoElectronico',
      null,
      tarjeta._id,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false,codigo:6, message: 'Fecha de expiración incorrecta' });
  }
  if (parseInt(year) + 2000 < dayjs()['$y']) {
    await transaccionFallida(
      'otherBankCards',
      null,
      tarjeta._id,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false, codigo:7,message: 'Tarjeta expirada' });
  } else if (
    parseInt(month) < dayjs()['$M'] + 1 &&
    parseInt(year) + 2000 == dayjs()['$y']
  ) {
    await transaccionFallida(
      'otherBankCards',
      null,
      tarjeta._id,
      monto,
      fecha,
      'Tarjeta vencida'
    );
    return res.status(400).json({ ok: false, codigo:7, message: 'Tarjeta expirada' });
  }
  tarjeta.infoCredito.saldoDisponible = String(
    parseInt(tarjeta.infoCredito.saldoDisponible) - parseInt(monto)
  );

  tarjeta.infoCredito.saldoActual = String(
    parseInt(monto) + parseInt(tarjeta.infoCredito.saldoActual)
  );
  tarjeta.infoCredito.usada=true
  await tarjeta.save();

  const transferencia = new Transaccion({
    monto,
    descripcion,
    comision: 0,
    tipo: 'otherBankCards',
    origen: {
      id: tarjeta._id,
      estadoPuntual: monto,
    },
    fecha: fecha,
    estatus: 'exitosa',
  });
  await transferencia.save();

  //correo realizo compra
  const userTarjeta = await User.findById(tarjeta.usuarioId)
  let mailOptions = {
    from: `"Banco Dakiti" <${config.MAIL}>`, // sender address
    to: userTarjeta.email, // list of receivers
    subject: 'Pago electronico realizado', // Subject line
    text: 'Pago electronico realizado', // plain text body
    html: `	<div style="text-align: center; margin: 5px;">
            <h2>Hola ${userTarjeta.primerNombre} ${userTarjeta.primerApellido}, se registro un pago electronico desde tu tarjeta, con los siguientes datos </h2>
              <table style="width:70%">
              <tr>
                <td>Tarjeta de origen:</td>
                <td>${card}</td>
              </tr>
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
              <tr>
                <td>descripcion:</td>
                <td>${descripcion}</td>
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
      console.log('[cardPayment - send email error] ', err);
      return;
    }
  });

  return res
    .status(200)
    .json({ ok: true, message: 'Compra realizada exitosamente' });
});

router.post('/otherBankTransfer', async (request, response) => {
  try {
    console.log("Test========================")
    let { cuentaDestino, cuentaOrigen, monto, identificador, descripcion, identificadorTipo } =
      request.body;

    if (
      !cuentaDestino ||
      !cuentaOrigen ||
      !monto ||
      !identificador ||
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

    let destino = await Cuenta.findOne({ numero: cuentaDestino });
    if (!destino) {
      response.status(400).json({
        ok: false,
        codigo:9,
        error: 'Cuenta de destino no encontrada',
      });
      return;
    }

    //los datos de cuenta de destino son correctos
    let destinoUser = destino.usuario;
    destinoUser = await User.findById(destinoUser);
    if (!destinoUser) {
      response.status(400).json({
        ok: false,
        codigo:9,
        error: 'El usuario de destino no existe',
      });
      await transaccionFallida(
        'otherBankTransfer',
        null,
        destino._id,
        monto,
        fecha
      );
      return;
    }

    if (destinoUser.identificacion.identificador !== identificador) {
      response.status(400).json({
        ok: false,
        codigo:10,
        error: 'Datos de destino incorrectos',
      });
      await transaccionFallida(
        'otherBankTransfer',
        null,
        destino._id,
        monto,
        fecha
      );
      return;
    }
    if (destinoUser.identificacion.identificadorTipo !== identificadorTipo) {
      response.status(400).json({
        ok: false,
        codigo:10,
        error: 'Datos de destino incorrectos',
      });
      await transaccionFallida(
        'otherBankTransfer',
        null,
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
        'otherBankTransfer',
        null,
        destino._id,
        monto,
        fecha
      );
      return;
    }
    console.log(destino)
    destino = await Cuenta.findByIdAndUpdate(
      destino._id,
      { monto: destino.monto + (monto) },
      { new: true }
    );
    console.log(destino, monto , "-------------")
    const id = mongoose.Types.ObjectId();
    //const otherBankId = mongoose.Types.ObjectId(cuentaOrigen);
    const transferencia = new Transaccion({
      _id: id,
      monto,
      descripcion,
      comision: 0,
      tipo: 'otherBankTransfer',
      destino: {
        id: destino._id,
        estadoPuntual: destino.monto,
      },
      fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    response.status(200).json({
      ok: true,
      data: {
        message: 'Transferencia hecha exitosamente',
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


router.post('/transferenciaOtherBankDemo', async (request, response) => {
  try {
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
    monto = parseInt(monto);
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
    if (monto <= 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto incorrecto',
      });
      //await transaccionFallida('transferencia', origen._id, monto, fecha);
      return;
    }
    if (origen.monto - monto < 0) {
      response.status(400).json({
        ok: false,
        error: 'Monto insuficiente en cuenta',
      });
      //await transaccionFallida('transferencia', origen._id, monto, fecha);
      return;
    }
    console.log("==========================================")
    let responseDeg = {}
    try {
      responseDeg = await axios({
        method: 'post',
        url: 'https://api.bank.vittorioadesso.com/bank/transaction/',
        data: {
          acc_src: {
            number: cuentaOrigen,
            document_id:identificadorTipo+identificador
          },
          acc_dst: {
            number: cuentaDestino,
            document_id:identificadorTipo+identificador
          },
          amount: monto,
          reason: descripcion,
        },
      });
    } catch (error) {
      console.log(error)
      await transaccionFallida(
        'otherBankTransfer',
        origen._id,
        cuentaDestino,
        monto,
        fecha,
        'Error inesperado.'
      );
      console.log(
        error.response.status,
        error.response.data.detail,
        error.response.data
      );
      return res
        .status(error.response.status)
        .json({ ok: false, message: error.response.data.detail.msg });
    }

    origen = await Cuenta.findByIdAndUpdate(
      origen._id,
      { monto: origen.monto - monto },
      { new: true }
    );
    const id = mongoose.Types.ObjectId();
    const transferencia = new Transaccion({
      monto,
      descripcion,
      comision: 0,
      tipo: 'otherBankTransfer',
      origen: {
        id: origen._id,
        estadoPuntual: origen.monto,
      },
      destino: {
        id: origen._id,
        estadoPuntual: origen.monto,
      },
      fecha,
      estatus: 'exitosa',
    });
    await transferencia.save();
    const transferenciaData = await Transaccion.findById(id);
    isContacto = false;
    
    console.log(responseDeg.data, transferenciaData)
    response.status(200).json({
      ok: true,
      data: {
        transferencia: transferencia
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


router.get('/tarjeta/:id', async (req, res) => {
  const tarjeta = await Tarjeta.findOne({ numero: req.params.id });
  return res.status(200).json({ ok: true, tarjeta });
});

router.get('/currentUser', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({
      ok: false,
      error: 'Access Denied',
    });
    return;
  } else {
    let response = await decodeToken(token.split(' ')[1], server.SESSION_TOKEN);
    if (response.error) {
      res.status(401).json({
        ok: false,
        error: response.error,
      });
      return;
    } else {
      let user = await User.findById(response.data.id);
      res.status(200).json({
        ok: true,
        user,
      });
      return;
    }
  }
});

router.get('/logged', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({
      ok: false,
    });
    return;
  } else {
    let response = await decodeToken(token.split(' ')[1], server.SESSION_TOKEN);
    if (response.error) {
      res.status(401).json({
        ok: false,
      });
      return;
    } else {
      res.status(200).json({
        ok: true,
      });
      return;
    }
  }
});

//------RESET PASSWORD-------
router.post('/reset-password', async (req, res) => {
  const data = await User.find({ email: req.body.email });
  if (!data.length) {
    res.status(404).json({
      ok: false,
      error: 'Email not found',
    });
    return;
  }

  let token = jwt.sign({ email: req.body.email }, 'resetPassword', {
    expiresIn: '1h',
  });
  let link = `${req.headers.x - forwarded - proto}://${
    req.headers.host
  }/recover-password/${token}`;

  var mailOptions = {
    from: `Health Commons <${server.EMAIL_USER}>`,
    to: req.body.email,
    subject: 'Reset Password',
    html: `
            <div style="text-align: center; margin: 5px;">
                <img src='${req.headers.x - forwarded - proto}://${
      req.headers.host
    }/Healthcommons.png' style="display: flex; width: 28%; margin-right: auto; margin-left: auto;"/>
                <h1 style="color: #26a3a2;">Reset Password</h1>
                <h3>Click the button to reset your password</h3>
                <a href="${link}" style="font-size: 20px; text-decoration: none; color: white; background-color: #26a3a2; border-radius: 7px; padding: 5px;">Click Here!</a>
                <br/>
            </div>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(400).json({
        ok: false,
        error,
      });
      return;
    } else {
      res.status(200).json({
        ok: true,
      });
      return;
    }
  });
});

router.post('/verify-reset', (req, res) => {
  jwt.verify(req.body.token, 'resetPassword', async (err, decoded) => {
    if (err) {
      res.status(400).json({
        ok: false,
        error: 'Token Expired',
      });
      return;
    } else {
      res.status(200).json({
        ok: true,
        email: decoded.email,
      });
      return;
    }
  });
});

router.post('/new-password', async (req, res) => {
  jwt.verify(req.body.token, 'resetPassword', async (err, decoded) => {
    if (err) {
      res.status(401).json({
        ok: false,
        error: 'Token Expired',
      });
      return;
    } else {
      const data = await User.find({ email: decoded.email });
      if (!data.length) {
        res.status(404).json({
          ok: false,
          error: 'Email not found',
        });
        return;
      } else {
        try {
          let user = data[0];
          let hashedPassword = await hash(req.body.password);
          user.password = hashedPassword;
          await user.save();
          res.status(200).json({
            ok: true,
            email: decoded.email,
          });
          return;
        } catch (error) {
          res.status(400).json({
            ok: false,
            error,
          });
          return;
        }
      }
    }
  });
});
//------RESET PASSWORD-------

//------VERIFY ACCOUNT-------
router.post('/confirm-account', async (req, res) => {
  try {
    let confirm = await Confirm.findOne({ email: req.body.email });
    if (new Date() - confirm.createdAt > 5 * 60 * 1000) {
      res.status(400).json({
        ok: false,
        error: 'Code Expired!',
      });
    } else {
      if (confirm.token === parseInt(req.body.token)) {
        await User.findOneAndUpdate({ email: req.body.email }, { valid: true });
        await confirm.remove();
        res.status(200).json({
          ok: true,
        });
        return;
      } else {
        res.status(422).json({
          ok: false,
          error: 'Invalid Token',
        });
      }
    }
  } catch (error) {
    res.status(422).json({
      ok: false,
      error: 'Invalid Data',
    });
    return;
  }
});

router.post('/resend-code', async (req, res) => {
  try {
    let digits = Math.floor(100000 + Math.random() * 900000);

    let numero = digits.toString();

    var mailOptions = {
      from: `Health Commons <${server.EMAIL_USER}>`,
      to: req.body.email,
      subject: 'Verify Account',
      html: `
                <div style="text-align: center; margin: 5px;">
                    <h2>This is the code to verify your account</h2><br/>
                    <span style="font-size: 45px; font-weight: bold;">${numero[0]}-${numero[1]}-${numero[2]}  ${numero[3]}-${numero[4]}-${numero[5]}</span>
                </div>
            `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(400).json({
          ok: false,
          error,
        });
        return;
      } else {
        Confirm.findOneAndUpdate(
          { email: req.body.email },
          { token: digits, createdAt: Date.now() }
        );
        res.status(200).json({
          ok: true,
        });
        return;
      }
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: 'Unknown error',
    });
    return;
  }
});
//------VERIFY ACCOUNT-------

module.exports = router;
