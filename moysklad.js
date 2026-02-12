import { infoToAdmin,infoToUser } from "./tgbot.js";

let lastDemandId="";
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
async function getLastDemand(bot) {
    try {
     
      const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/retaildemand?order=moment,desc&expand=owner,agent,positions.assortment&limit=1`,{
        method:"GET",
        headers:{
         //"X-API-Key": "392b523f48da5ed49425d6d874517483"
         //"Authorization": "Bearer  995539205df3e4ffa965f744af89ae1e7851b1b0"
         //"Authorization": "Bearer  ef89f7033a291007f08df842eb0772b219d29247"
         "Authorization": "Bearer  c28e28a168c061c53d6864b17fddc5dbc4e62ca9"
        }
      });      // GET request
      const data = await response.json(); 
      if(data?.rows.length>0){
        let products="";
        const aslist = data.rows[0].positions.rows;
        aslist.forEach((element,index) => {
          products=products+(index+1)+". 🟢 "+element.assortment.name+" 💸 "+element.quantity+"x = $"+(element.quantity*element.price/100)+" \n";
        });
        const demandId = data.rows[0].id;
        const retailName = data.rows[0].name;
        const agentName = data.rows[0].agent.name;
        const agentCode = data.rows[0].agent.code;
        const agentPhone = data.rows[0].agent.phone;
        const ownerName = data.rows[0].owner.name;
        const sum = data.rows[0].sum/100;
        const payedSum = data.rows[0].payedSum/100;
        const debt = sum-payedSum;



        if(lastDemandId!==demandId){
           console.log(products);
           console.log(retailName);
           console.log(agentName)
           console.log(agentCode)
           console.log(agentPhone)
           console.log(ownerName)
           console.log(sum)
           console.log(payedSum)
           console.log(debt)
           

           let msgToAdmin=`✅ Новая Отгрузка №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: $${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           let msgToUser=`✅ Новая Розничные продажи №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: $${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: ${debt}`
           //infoToAdmin(bot,msgToAdmin);
           infoToUser(bot,agentPhone,msgToUser);
           lastDemandId=demandId
        }else{
          console.log("another id")
        }
        
      
      
      }else{
        console.log("data null")
      }
      
    } catch (err) {
      console.error("Xato:xxx", err.message);
    }
}

//Получить Отгрузка продажи
async function getLastRetaildemand(bot) {
  try {
   
    const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/demand?order=moment,desc&expand=owner,agent,positions.assortment&limit=1`,{
      method:"GET",
      headers:{
       //"X-API-Key": "392b523f48da5ed49425d6d874517483"
       //"Authorization": "Bearer  995539205df3e4ffa965f744af89ae1e7851b1b0"
       //"Authorization": "Bearer  ef89f7033a291007f08df842eb0772b219d29247"
       "Authorization": "Bearer  c28e28a168c061c53d6864b17fddc5dbc4e62ca9"
      }
    });      // GET request
    const data = await response.json(); 
    if(data?.rows.length>0){
      let products="";
      const aslist = data.rows[0].positions.rows;
      aslist.forEach((element,index) => {
        products=products+(index+1)+". 🟢 "+element.assortment.name+" 💸 "+element.quantity+"x = $"+(element.quantity*element.price/100)+" \n";
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
         

         let msgToAdmin=`✅ Новая Отгрузка №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: $${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: $${debt}`
         let msgToUser=`✅ Новая Отгрузка №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n📦 Список товаров: \n${products} \n💵 Общая цена покупки: $${sum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${payedSum}\n${debt>0 ? "🔴":"🟢"} Долг: $${debt}`
        infoToAdmin(bot,msgToAdmin,6080018622);
        infoToAdmin(bot,msgToAdmin,113995828);
         infoToUser(bot,agentPhone,msgToUser);
         lastRetaildemandId=retailDemandId
      }else{
        console.log("another id")
      }
      
    
    
    }else{
      console.log("data null")
    }
    
  } catch (err) {
    console.error("Xato:xxx", err.message);
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
         "Authorization": "Bearer  c28e28a168c061c53d6864b17fddc5dbc4e62ca9"
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
           

           let msgToAdmin=`✅ Новая Платежи №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n💵 Общая цена покупки: $${salesAmount}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${sum}` //\n${debt>0 ? "🔴":"🟢"} Долг: $${debt}
           let msgToUser=`✅ Новая Платежи №: ${retailName}\n🧔🏻‍♂️ Кассир: ${ownerName} \n🕓 ${getCurrentFormattedDateAndTime()}\n💵 Общая цена покупки: $${salesAmount}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n☑️ Оплачено: $${sum}` //\n${debt>0 ? "🔴":"🟢"} Долг: $${debt}
           infoToAdmin(bot,msgToAdmin,6080018622);
           infoToAdmin(bot,msgToAdmin,113995828);
           infoToUser(bot,agentPhone,msgToUser);
           lastPaymentId=paymentId
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


//Отчет Показатели контрагентов
async function getLastBalanceCustomer(bot,phone) {
  try {
   
    const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/report/counterparty?filter=counterparty.phone=%2B${phone}`,{
      method:"GET",
      headers:{
       //"X-API-Key": "392b523f48da5ed49425d6d874517483"
       //"Authorization": "Bearer  995539205df3e4ffa965f744af89ae1e7851b1b0"
       //"Authorization": "Bearer  ef89f7033a291007f08df842eb0772b219d29247"
       "Authorization": "Bearer  c28e28a168c061c53d6864b17fddc5dbc4e62ca9"
      }
    });      // GET request
    const data = await response.json(); 
    if(data?.rows.length>0){

      
      
      
      const demandsSum = data.rows[0].demandsSum/100;
      const debt = Math.abs(data.rows[0].balance/100);
      const agentName = data.rows[0].counterparty.name;
      const agentPhone = data.rows[0].counterparty.phone;
      console.log(demandsSum);
      console.log(debt);

      
      let msgToUser=`ℹ️ Информация: \n💵 Общая цена покупки: $${demandsSum}\n\n🙆🏻‍♂️ Контрагент: ${agentName}\n📱: ${agentPhone}\n\n${debt>0 ? "🔴":"🟢"} Долг: $${debt}`
      
      infoToUser(bot,agentPhone,msgToUser);



      
      
    
    
    }else{
      console.log("data null")
    }
    
  } catch (err) {
    console.error("Xato:xxx", err.message);
  }
}



export  {getLastRetaildemand,getLastPaymentin,getLastBalanceCustomer};

