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

// Comando o Entrada al bot con Start
bot.start(async (ctx) => {
  try {
    // console.log(ctx.chat);

    var isBotFrom = ctx.message.from.is_bot;
    if (!isBotFrom) {
      //Está iniciandolo una persona
      var typeChat = ctx.message.chat.type;
      if (typeChat == 'private') {
        //Solo se ejecuta en privado
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

        ctx.reply(
          'Hello, select the language.',
          Extra
          .markup(Markup.inlineKeyboard([
            [Markup.callbackButton('English', 'langen'), Markup.callbackButton('Español', 'langes')]
          ]))
          .webPreview(false)
        )
      }
    }
  } catch (err) {
    sendError(err, ctx)
  }
})

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

bot.action('langen', async (ctx) => {
  try {
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

bot.action('langes', async (ctx) => {
  try {
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

bot.command('quit', (ctx) => {
  try {
    ctx.telegram.leaveChat(ctx.message.chat.id);
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
    // console.log(ctx.message);
    // Usuario nuevo en el grupo
    if (ctx.message.new_chat_members != undefined){    
      var idChat = ctx.message.chat.id;
      var idNewMember = ctx.message.new_chat_member.id;
      var userNameNewMember = ctx.message.new_chat_member.username;
      var isBotNewMember = ctx.message.new_chat_member.is_bot;
      if (isBotNewMember) {
        //Es un Bot
        // ctx.reply('Es un Bot...');
        if (userNameNewMember == data_bot[select_data_bot].name) {
          //Es nuestro bot

          // console.log(ctx.message);
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
          //No es nuestro Bot
          
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
        //No es un Bot
        var nameNewMember = ctx.message.new_chat_member.first_name;        
        ctx.reply(i18n.__('Hello') + ': ' + nameNewMember + ',\n' + i18n.__('Bienvenido a la comunidad'));
      }
    }
    // Usuario abandona el grupo
    else if (ctx.message.left_chat_member != undefined){
      
    }
    else if (ctx.message.text != undefined) {
      
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
          text.hello + ctx.from.id,
          Extra
          .markup(Markup.inlineKeyboard([
            [Markup.urlButton('📨 Share link', 't.me/share/url?url=' + urlencode(text.invite_es + ctx.from.id))],
            [Markup.callbackButton('💵 Balance', 'balance'), Markup.callbackButton('📱 My number', 'number')],
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