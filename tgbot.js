import { log } from "console";
import fs from "fs";
const USERS_FILE = "./users.json";

import { getLastBalanceCustomer } from "./moysklad.js";





function botMain(bot){
  tgBotStart(bot);
  //tgContacts(bot);
  checkPhoneNumber(bot);
  buttonInfoToUser(bot);
 

}


const keyboard = {
  reply_markup: {
    keyboard: [
      //['📋 Menu', ''],
      ['ℹ️ Информация']
    ],
    resize_keyboard: true,
    one_time_keyboard: false // doimiy chiqib turadi
  }
};

//new
function tgBotStart(bot){

 bot.setMyCommands([
  { command: "/start", description: "Запустить бота 🚀" },
]); 
  bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;

  bot.sendMessage(chatId, "Здравствуйте, добро пожаловать в МойСклад Info бот \n\n\nОтправьте мне свой номер телефона для получения информации. 📞",keyboard);
  // bot.sendMessage(chatId, "Здравствуйте, добро пожаловать в МойСклад Info бот \n\n\nОтправьте мне свой номер телефона для получения информации. 📞", {
  //   reply_markup: {
  //     keyboard: [
  //      [
  //         { text: "📞 Отправить номер телефона", request_contact: true },
  //         //{ text: "ℹ️ Haqida" }
  //       ],
  //       ],
       
  //     resize_keyboard: true, // Tugmani ekranga moslashtiradi
  //     one_time_keyboard: true, // 👈 Shu qator tugmani bosgandan keyin yo‘q qilad
  //   },
  // });
});
}


function tgContacts(bot){

  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  // 📲 Foydalanuvchi kontakt yuborganda
  bot.on("contact", (msg) => {
  const chatId = msg.chat.id;
  const phoneNumber = msg.contact.phone_number;
  const name = msg.contact.first_name;

   // Faylni o‘qish
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  }

  // Foydalanuvchi mavjudligini tekshirish
  const mavjud = users.find((u) => u.chatId === chatId);

  // Agar mavjud bo‘lmasa, qo‘shamiz
  if (!mavjud) {
    users.push({ chatId, first_name: name ,phoneNumber});
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log(`📥 Yangi foydalanuvchi qo‘shildi: ${name} (${chatId})`);
    
  }
  
  bot.sendMessage(chatId,`✅ Спасибо ${name}, я сейчас отправлю вам информацию ${chatId}`,{
    reply_markup: {
      remove_keyboard: true, // 👈 Shu joy klaviaturani butunlay yo‘q qiladi
    }
  });
  bot.sendMessage(6080018622,`👏 Добавлен новый пользователь \n\n🙋🏻‍♂️${name} \n✍🏼${msg.chat.username} \n📞${phoneNumber}`,{
    reply_markup: {
      remove_keyboard: true, // 👈 Shu joy klaviaturani butunlay yo‘q qiladi
    }
  });
});

}


function infoToAdmin(bot,message,chatId){
  bot.sendMessage(chatId,`${message}`,{
    reply_markup: {
      remove_keyboard: true, // 👈 Shu joy klaviaturani butunlay yo‘q qiladi
    }
  });
}

function infoToUser(bot,phone,message){
   // Faylni o‘qish
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
  }
  // Foydalanuvchi mavjudligini tekshirish
  const checkUser = users.find((u) => u.phoneNumber === phone);

  
  
  // Agar mavjud bo‘lmasa, qo‘shamiz
  if (checkUser) {
    console.log(checkUser.chatId);
    bot.sendMessage(checkUser.chatId,`${message}`,{
    reply_markup: {
      //remove_keyboard: true, // 👈 Shu joy klaviaturani butunlay yo‘q qiladi
    }
   });
  }

  
}



function checkPhoneNumber(bot){


  bot.on("message",msg=>{
    const chatId = msg.chat.id;
    const name = msg.chat.first_name;
    const text = msg.text;
    // if(text[0]==="+" && text.length===13){
    //   bot.sendMessage(msg.chat.id, text);
    // }
    if (msg.text === "/start") return;

    const phoneRegex = /^\+998\d{9}$/;

    

   //read file
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }

    
    const checkUser = users.find((u) => u.chatId === chatId);

   
    if (!checkUser) {
      if (!phoneRegex.test(text)) {
        bot.sendMessage(chatId, "📞 Отправьте свой номер телефона.\nВ таком виде: +998901234567");
        return;
      }
      users.push({ chatId, first_name: name ,phoneNumber:text});
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      console.log(`📥 Yangi foydalanuvchi qo‘shildi: ${name} (${chatId})`);
      bot.sendMessage(chatId, `✅ Спасибо ${name} Вы успешно зарегистрированы`);
    }
    
  })

}

async function buttonInfoToUser(bot,phone,message){

  

  bot.on('message', (msg) => {
    let users = [];
      if (fs.existsSync(USERS_FILE)) {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
      }

    const text = msg.text;
    const chatId = msg.chat.id;
    const checkUser = users.find((u) => u.chatId === chatId);
    
    if(!checkUser) return;
    
    let phoneNumber=checkUser.phoneNumber;
    const phoneNumber2 =phoneNumber.substring(1);
    console.log(phoneNumber2);
    
  
    if (text === 'ℹ️ Информация') {
      getLastBalanceCustomer(bot,phoneNumber2)

      //bot.sendMessage(msg.chat.id, 'Bu info bo‘limi');
    }
  
  });
  
 
 

 
 

 
}


export {botMain,infoToAdmin,infoToUser}
