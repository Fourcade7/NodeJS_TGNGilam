import { log } from "console";
import fs from "fs";
const USERS_FILE = "./users.json";





function botMain(bot){
  tgBotStart(bot);
  tgContacts(bot);
 

}



//new
function tgBotStart(bot){

 bot.setMyCommands([
  { command: "/start", description: "Botni ishga tushirish 🚀" },
]); 
  bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name;


  bot.sendMessage(chatId, "Здравствуйте, добро пожаловать в МойСклад Info бот \n\n\nОтправьте мне свой номер телефона для получения информации. 📞", {
    reply_markup: {
      keyboard: [
       
        [
          { text: "📞 Отправить номер телефона", request_contact: true },
          //{ text: "ℹ️ Haqida" }

        ],
        
      ],
       
      resize_keyboard: true, // Tugmani ekranga moslashtiradi
      one_time_keyboard: true, // 👈 Shu qator tugmani bosgandan keyin yo‘q qilad
    },
  });
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


function infoToAdmin(bot,message){
  bot.sendMessage(6080018622,`${message}`,{
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
  const mavjud = users.find((u) => u.phoneNumber === phone);

  console.log(mavjud.chatId);
  
  // Agar mavjud bo‘lmasa, qo‘shamiz
  if (mavjud) {
    
    bot.sendMessage(mavjud.chatId,`${message}`,{
    reply_markup: {
      remove_keyboard: true, // 👈 Shu joy klaviaturani butunlay yo‘q qiladi
    }
   });
  }

  
}




export {botMain,infoToAdmin,infoToUser}
