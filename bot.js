const { Telegraf } = require('telegraf')
const data = require('./data');
const pool = require('./database');
const urlencode = require('urlencode');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const rateLimit = require('telegraf-ratelimit');

const i18n = require("i18n");
i18n.configure({
  locales:['en','es'],
  defaultLocale: 'en',
  register: global,
  directory: __dirname + '/locales'
});

const { data_bot } = data;
const { select_data_bot } = data;
const { text } = data;
const bot = new Telegraf(data_bot[select_data_bot].token, {telegram: {webhookReply: false}});

console.log('Utilizando: ' + data_bot[select_data_bot].name);

const buttonsLimit = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx, next) => {
    if ('callback_query' in ctx.update)
    ctx.answerCbQuery('You`ve pressed buttons too oftern, wait.', true)
      .catch((err) => sendError(err, ctx))
  },
  keyGenerator: (ctx) => {
    return ctx.callbackQuery ? true : false
  }
}
bot.use(rateLimit(buttonsLimit))

const stage = new Stage()
bot.use(session())
bot.use(stage.middleware())

const getNumber = new Scene('getNumber')
stage.register(getNumber)

// Esta función verifica de que el Miembro del grupo sea el que adicionó el Bot al grupo
const verifyBotOwner = async (_idChat, _idMember) => {
  try {
    let dbData = await pool.query(
      'SELECT * FROM supergroup ' +
      'WHERE (user_id = ' + _idMember + ') AND ' + 
            '(chat_id = ' + _idChat + ')');
    return (dbData.length === 1);
  } catch (err) {
    sendError(err, ctx)
  }
}

// Comando o Entrada al bot con Start
bot.start(async (ctx) => {
  try {
    
    // El comando start solo será ejecutado por un usuario
    // Los Bots no podrán ejecutarlo
    var isBotFrom = ctx.message.from.is_bot;    
    if (!isBotFrom) {
      //Si lo inicia un usuario debe verificar si es desde un grupo o un chat privado
      var typeChat = ctx.message.chat.type;
      if (typeChat == 'private') {
        // Si el comando es ejecutado desde un chat privado se adiciona a la tabla private 
        // de la base de datos los datos del usuario y así se llevará un registro de las 
        // personas que hacen uso del bot. Esto es con el proposito de que cada usuario 
        // haga uso de una configuración personal, no está implementado aún
        const id = 0;
        const user_id = ctx.from.id;
        const user_name = ctx.from.username;
        const first_name = ctx.from.first_name;
        const chat_id = ctx.chat.id;
        const newUser = {
          id,
          user_id,
          user_name,
          first_name,
          chat_id
        };
        let dbData = await pool.query('SELECT * FROM private WHERE user_id = ' + newUser.user_id);
        if (dbData.length === 0) {
          await pool.query('INSERT INTO private set ?', [newUser]);
        }

        // Aqui se muestra la interfaz de selección del idioma para el Bot
        // Hay un botón para Ingles y otro para Español y según la se selección se ejecuta un action
        // Aún no se guarda en la Base de Datos, se debe implementar con otras opciones
        ctx.reply(
          'Hello, select the language.',
          Extra
          .markup(Markup.inlineKeyboard([
            [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿 English', 'langen'), Markup.callbackButton('🇪🇸 Español', 'langes')]
          ]))
          .webPreview(false)
        )
      }
    }
  } catch (err) {
    sendError(err, ctx)
  }
})

// Aqui se muestra la interfaz de selección del idioma para el Bot en caso de presionar Back
bot.action('selectlang', async (ctx) => {
  try {
    ctx.answerCbQuery()
      
    ctx.editMessageText(
      'Hello, select the language.',
      Extra
      .markup(Markup.inlineKeyboard([
        [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿 English', 'langen'), Markup.callbackButton('🇪🇸 Español', 'langes')]
      ]))
    )
      .catch((err) => sendError(err, ctx))
  } catch (err) {
    sendError(err, ctx)
  }
})

// Interfaz informando el idioma seleccionado en caso de ingles
bot.action('langen', async (ctx) => {
  try {
    // setLocale cambia el idioma de uso y es mostrado mediante la fucion i18n
    i18n.setLocale('en');
    ctx.answerCbQuery()
    
    ctx.editMessageText(
      i18n.__('Hola, usted ha seleccionado el idioma Español.') + 
      '\n' + i18n.__('Presione continuar para ver las opciones del Bot.'),
      Extra
      .markup(Markup.inlineKeyboard([
        [Markup.callbackButton(i18n.__('Continuar'), 'main')],
        [Markup.callbackButton('◀️ '+ i18n.__('Atras'), 'selectlang')]        
      ]))
    )
      .catch((err) => sendError(err, ctx))
  } catch (err) {
    sendError(err, ctx)
  }
})

// Interfaz informando el idioma seleccionado en caso de español
bot.action('langes', async (ctx) => {
  try {
    // setLocale cambia el idioma de uso y es mostrado mediante la fucion i18n
    i18n.setLocale('es');
    ctx.answerCbQuery()
      
    ctx.editMessageText(
      i18n.__('Hola, usted ha seleccionado el idioma Español.') + 
      '\n' + i18n.__('Presione continuar para ver las opciones del Bot.'),
      Extra
      .markup(Markup.inlineKeyboard([
        [Markup.callbackButton(i18n.__('Continuar'), 'main')],
        [Markup.callbackButton('◀️ '+ i18n.__('Atras'), 'selectlang')]        
      ]))
    )
      .catch((err) => sendError(err, ctx))
  } catch (err) {
    sendError(err, ctx)
  }
})

// Interfaz principal para interactuar con el Bot
// Aqui se mostrarán las acciones que realizará el bot
// Hay que implementarlas
//En eset caso solo muestra 2 botones para acceder a un Canal y un Grupo
bot.action('main', async (ctx) => {
  try {
    ctx.answerCbQuery()
      
    ctx.editMessageText(
      'Estamos en el menú principal.',
      Extra
      .markup(Markup.inlineKeyboard([
        [Markup.urlButton('Canal', 'https://t.me/+H9O8X8cHXBA0OTYx'), Markup.urlButton('Grupo', 'https://t.me/+5seobDJo3ZQ2YmRh')]
      ]))
    )
      .catch((err) => sendError(err, ctx))
  } catch (err) {
    sendError(err, ctx)
  }
})

// El comando quit es para que el bot salga solo de un grupo.
// El usuario que lo puede ejecutar debe ser el mismo que lo adicionó.
bot.command('quit', async (ctx) => {
  try {
    var idChat = ctx.message.chat.id;
    var idMember = ctx.message.from.id;
    memberBotOwner = await verifyBotOwner(idChat, idMember);
    // Si el miembro es el que adicionó al Bot el Bot sale del grupo
    if (memberBotOwner) {
      ctx.telegram.leaveChat(idChat);
    } else {
      ctx.telegram.sendMessage(idChat, i18n.__('Usted no tiene permiso para utilizar este comando.'));
    }
  } catch (err) {
    sendError(err, ctx)
  }
})

// bot.command("", async (ctx) => {
//   try {
    
//   } catch (err) {
//     sendError(err, ctx)
//   }
// })

// Mensajes de Bienvenida y de Salida del Grupo    
bot.on('message', async (ctx) => {
  try {
    // Aqui se verifica si el mensaje es de un nuevo miembro
    if (ctx.message.new_chat_members != undefined){    
      var idChat = ctx.message.chat.id;
      var idNewMember = ctx.message.new_chat_member.id;
      var userNameNewMember = ctx.message.new_chat_member.username;
      var isBotNewMember = ctx.message.new_chat_member.is_bot;
      // Si el nuevo miembro es un Bot hay que revisar si es este Bot u otro diferente
      if (isBotNewMember) {
        // Revisamos de que sea nuestro Bot
        if (userNameNewMember == data_bot[select_data_bot].name) {
          // Si es nuestro bot se adiciona a la tabla supergroup de la base de datos
          // los datos del usuario y del grupo y así se llevará un registro de la 
          // persona que adicionó el bot al grupo; así se pueden limitar operaciones
          const id = 0;
          const user_id = ctx.from.id;
          const user_name = ctx.from.username;
          const first_name = ctx.from.first_name;
          const chat_id = ctx.chat.id;
          const chat_title = ctx.chat.title;
          const active = true;
          const newChat = {
            id,
            user_id,
            user_name,
            first_name,
            chat_id,
            chat_title,
            active
          };
          let dbData = await pool.query('SELECT * FROM supergroup WHERE chat_id = ' + newChat.chat_id);
          if (dbData.length === 0) {
            await pool.query('INSERT INTO supergroup set ?', [newChat]);
          }

          ctx.telegram.sendMessage(idChat, i18n.__('Muchas gracias por agregarme a este Grupo.'));
        } else {
          // Si no es nuestro bot hay que eliminarlo del grupo
          // Para esto se verifica primero que nuestro Bot tenga permisos para expulsar
          // y luego se expulsa al usuario. Si no se tiene permiso para expulsar se lanza un mensaje
          
          ctx.telegram.getChatMember(idChat, ctx.botInfo.id).then(function(data) {
            if ((data.status == "creator") || (data.status == "administrator")){
              ctx.telegram.kickChatMember(idChat, idNewMember);
            } else
            {
              ctx.telegram.sendMessage(idChat, i18n.__('Un usuario ha adicionado un Bot.'));
            }
          });

          ctx.telegram.sendMessage(idChat, i18n.__('Los Bots están prohibidos en este Grupo.'));
          
        }
      } else {
        // En este caso el nuevo miembro no es un Bot sino una persona
        // Lanzamos un mensaje de bienvenida y otras funcionalidades (esto ultimo no está implementado)
        var nameNewMember = ctx.message.new_chat_member.first_name;        
        ctx.reply(i18n.__('Hello') + ': ' + nameNewMember + ',\n' + i18n.__('Bienvenido a la comunidad'));
      }
    }
    // Usuario abandona el grupo
    else if (ctx.message.left_chat_member != undefined){
      // Aqui se pueden realizar acciones cuando un miembro abandona el grupo
    }
    // EL mensaje es un texto normal
    else if (ctx.message.text != undefined) {
      // Aqui se pueden realizar acciones cuando un miembro escribe un mensaje normal dentro del grupo
    }
  } catch (err) {
    sendError(err, ctx)
  }
})

async function sendError(err, ctx) {
  console.log(err.toString())
  if (ctx != undefined) {
    if (err.code === 400) {
      return setTimeout(() => {
        ctx.answerCbQuery()
        ctx.editMessageText(
          'Hello, select the language.',
          Extra
          .markup(Markup.inlineKeyboard([
            [Markup.callbackButton('🏴󠁧󠁢󠁥󠁮󠁧󠁿 English', 'langen'), Markup.callbackButton('🇪🇸 Español', 'langes')]
          ]))
          .webPreview(false)
        )
      }, 500)
    } else if (err.code === 429) {
      return ctx.editMessageText(
        'You`ve pressed buttons too often and were blocked by Telegram' +
        'Wait some minutes and try again'
      )
    }

    bot.telegram.sendMessage(data.admins[0], '[' + ctx.from.first_name + '](tg://user?id=' + ctx.from.id + ') has got an error.\nError text: ' + err.toString(), {parse_mode: 'markdown'})
  } else {
    bot.telegram.sendMessage(data.admins[0], 'There`s an error:' + err.toString())
  }
}

bot.catch((err) => {
  sendError(err)
})

process.on('uncaughtException', (err) => {
  sendError(err)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))