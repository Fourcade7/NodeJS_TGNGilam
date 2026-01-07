import express from "express"

import TelegramBot from "node-telegram-bot-api";

const token = "8584583825:AAEqCWmO2Z1pNCL-0NfkK5tVRtjBSbp_hjU";
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

setInterval(myJob, 5000);





botMain(bot);

app.listen(PORT, () => {
  console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});




