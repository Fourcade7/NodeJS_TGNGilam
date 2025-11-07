import { infoToAdmin,infoToUser } from "./tgbot.js";

let lastRetaildemandId="";
let lastPaymentId="";

function getCurrentFormattedDateAndTime() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//Получить Розничные продажи
async function getLastRetaildemand(bot) {
    try {
     
      const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/demand?order=moment,desc&expand=owner,agent,positions.assortment&limit=1`,{
        method:"GET",
        headers:{
         //"X-API-Key": "392b523f48da5ed49425d6d874517483"
         //"Authorization": "Bearer  995539205df3e4ffa965f744af89ae1e7851b1b0"
         //"Authorization": "Bearer  ef89f7033a291007f08df842eb0772b219d29247"
         "Authorization": "Bearer  1fcfe68359bd072ef37e73074046c5f132ea3b3e"
        }
      });      // GET request
      const data = await response.json(); 
      if(data?.rows.length>0){
        let products="";
        const aslist = data.rows[0].positions.rows;
        aslist.forEach((element,index) => {
          products=products+(index+1)+". 🟢 "+element.assortment.name+" 💸 "+element.quantity+"x = "+(element.quantity*element.price/100)+" UZS \n";
        });
        const retailDemandId = data.rows[0].id;
        const retailName = data.rows[0].name;
        const agentName = data.rows[0].agent.name;
        const agentCode = data.rows[0].agent.code;
        const agentPhone = data.rows[0].agent.phone;
        const ownerName = data.rows[0].owner.name;
        const sum = data.rows[0].sum/100;
        const payedSum = data.rows[0].payedSum/100;
        const debt = sum-payedSum;



        if(lastRetaildemandId!==retailDemandId){
           console.log(products);
           console.log(retailName);
           console.log(agentName)
           console.log(agentCode)
           console.log(agentPhone)
           console.log(ownerName)
           console.log(sum)
           console.log(payedSum)
           console.log(debt)
           lastRetaildemandId=retailDemandId

           let msgToAdmin=`✅ Новая Отгрузка №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: ${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: ${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           let msgToUser=`✅ Новая Отгрузка №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: ${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: ${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           infoToAdmin(bot,msgToAdmin);
           infoToUser(bot,agentPhone,msgToUser);
           
        }else{
          console.log("another id")
        }
        
      
      
      }else{
        console.log("data null")
      }
      
    } catch (err) {
      console.error("Xato:", err.message);
    }
}


//Получить Платежи
async function getLastPaymentin(bot) {
    try {
     
      const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/paymentin?order=moment,desc&expand=owner,agent,positions.assortment&limit=1`,{
        method:"GET",
        headers:{
         //"X-API-Key": "392b523f48da5ed49425d6d874517483"
         //"Authorization": "Bearer  995539205df3e4ffa965f744af89ae1e7851b1b0"
         //"Authorization": "Bearer  ef89f7033a291007f08df842eb0772b219d29247"
         "Authorization": "Bearer  1fcfe68359bd072ef37e73074046c5f132ea3b3e"
        }
      });      // GET request
      const data = await response.json(); 
      if(data?.rows.length>0){
        
        
        const paymentId = data.rows[0].id;
        const retailName = data.rows[0].name;
        const agentName = data.rows[0].agent.name;
        const agentCode = data.rows[0].agent.code;
        const agentPhone = data.rows[0].agent.phone;
        const salesAmount = data.rows[0].agent.salesAmount/100;
        const ownerName = data.rows[0].owner.name;
        const sum = data.rows[0].sum/100;
        
        const debt = salesAmount-sum;



        if(lastPaymentId!==paymentId){
           
           console.log(retailName);
           console.log(agentName)
           console.log(agentCode)
           console.log(agentPhone)
           console.log(ownerName)
           console.log(sum)
           
           console.log(debt)
           lastRetaildemandId=retailDemandId

           let msgToAdmin=`✅ Новая Платежи №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n💵 Общая цена покупки: ${salesAmount}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: ${sum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           let msgToUser=`✅ Новая Платежи №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n💵 Общая цена покупки: ${salesAmount}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: ${sum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           infoToAdmin(bot,msgToAdmin);
           infoToUser(bot,agentPhone,msgToUser);
           
        }else{
          console.log("another id")
        }
        
      
      
      }else{
        console.log("data null")
      }
      
    } catch (err) {
      console.error("Xato:", err.message);
    }
}



export  {getLastRetaildemand,getLastPaymentin};

