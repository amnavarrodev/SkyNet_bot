// Auxiliar para desplegar en las pruebas con diferentes Bots
// Solo se selecciona el Bot que se utilizará para el despliegue
const select_data_bot = 0;
const data_bot = 
  [
       { //0
      name: 'TesterLocalBot',
      token: '5769580134:AAHpL8afRODzrsBAkzGzTStAuDWfmmXFv-w'
    }, { //1
      name: 'TesterOnLineBot',
      token: '5621452124:AAGFxLMgmOV3KVCoee1W9Z-t9Xv1E84MNdg'
    }, { //2
      name: 'Mark_SkyBot',
      token: '5475234546:AAGg9QfKdhbthcVygUw2kgikJusaCCi0qnA'
    }
  ];

// Esto creo que no se está utilizando  
const text = {  
  invite_es: '',
  invite_referral_es: '',
  msg_referral: '',
  msg_start_only_referral: '',
  msg_hello_es: 'Hola ',
  msg_welcome_es: 
    '\n¡Bienvenid@ a ...!',
  msg_help_es:
    '<b>Comandos básicos: </b>' +
    '\n/start - ' +
    '\n/state - Estado del proyecto' +
    '\n/mystatus - Estado de la cuenta' +
    '\n/balance - Balance de la cuenta' +
    '\n' +
    '\n'
}

module.exports = {
  select_data_bot,
  data_bot,
  text
}