import express from "express"

import TelegramBot from "node-telegram-bot-api";

const token = "8455672387:AAHR4pmsmhnb8VzIUBtqP3nQEa3k23xSY9c";
const bot = new TelegramBot(token, { polling: true });
bot.on("polling_error", (err) => console.error("Polling error:", err));
bot.on("error", (err) => console.error("General error:", err));

import {getLastRetaildemand,getLastPaymentin} from "./moysklad.js";
import { botMain } from "./tgbot.js";



const app = express();
const PORT = 3001;

app.use(express.json());





function myJob() {
  getLastRetaildemand(bot);
  getLastPaymentin(bot);
  console.log("every 5 second ");
}

setInterval(myJob, 6000);





botMain(bot);

app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});




