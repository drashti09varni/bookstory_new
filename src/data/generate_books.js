const fs = require('fs');
const path = require('path');

// 1. Defined Dynamic Name Pools
const maleNames = ["Aarav", "Kabir", "Rohan", "Vikram", "Yash", "Dev", "Raj", "Arjun", "Amit", "Rahul", "Kunal", "Siddharth", "Sameer", "Aditya", "Ranveer", "Varun", "Abhishek", "Ishaan", "Rudra", "Reyansh"];
const femaleNames = ["Siya", "Pooja", "Meera", "Priya", "Ananya", "Riya", "Neha", "Shruti", "Sneha", "Divya", "Tanvi", "Kriti", "Kiara", "Isha", "Ridhima", "Aditi", "Avani", "Kavya", "Nisha", "Simran"];
const villainNames = ["Saurabh", "Singhania", "Malhotra", "Mehta", "Oberoi", "Gupta", "Rathore", "Khanna", "Vicky", "Deepak", "Rakesh", "Gaurav"];
const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Kolkata", "Hyderabad", "Noida", "Chandigarh", "Ahmedabad", "Jaipur"];
const collegeNames = ["St. Xavier's College", "IIT Bombay", "DTU", "BITS Pilani", "Delhi University", "HR College", "National College", "RV College"];
const startupSectors = ["Fintech App", "E-commerce Platform", "Edtech Startup", "AI Tech Firm", "Food Delivery App", "EV Tech Ventures", "SaaS Platform"];

// 2. High-Fidelity Hinglish Templates for each Category
const romanceTemplates = [
  {
    title: "Tumhara Naam Aaj Bhi Mere Password Mein Hai",
    genre: "Romance",
    author: "Rhea Sterling",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: College Ka Aakhri Din",
        content: [
          `College ka aakhri din tha. Har taraf shor tha, log ek dusre ke saath photos le rahe the, par ${m} ki nazrein sirf ek insaan ko dhoond rahi thi — ${f}.`,
          `${f} aur ${m} pichle 4 saal se ek dusre ke dost the. ${m} usse chhup kar pyaar karta tha, par usne kabhi himmat nahi ki apne dil ki baat kehne ki.`,
          `Jab farewell khatam hua, ${f} uske paas aayi aur boli, "Toh Mr. Silent Boy, ab shayad hum kabhi nahi milenge." ${m} ne dil mein hazaar baatein daba kar sirf muskura kar kaha, "Haan, shayad."`
        ]
      },
      {
        title: "Chapter 2: Paanch Saal Ki Doori",
        content: [
          `5 saal beet gaye. ${m} ab ${c} mein ek successful software engineer tha. Ek raat purani files dekhte waqt usse ek diary ki photo mili.`,
          `Diary ke aakhri page par likha tha, "Kaash ${m} ek baar keh deta ki woh mujhe pasand karta hai." ${m} ke haath kaanp gaye. Matlab ${f} bhi usse pyaar karti thi?`,
          `Usne social media par ${f} ko search kiya aur wahan engagement ki photo dekhi. Uska dil toot gaya. Bahut der ho chuki thi.`
        ]
      },
      {
        title: "Chapter 3: Coffee Shop Aur Sach",
        content: [
          `Kuch mahine baad ${m} ek coffee shop mein baitha tha, tabhi kisi ne peeche se awaaz lagayi, "${m}?" Usne mud kar dekha to samne ${f} khadi thi.`,
          `${f} ne bataya ki uski engagement cancel ho gayi kyunki woh kisi aur ko bhool nahi paayi. ${m} ne pucha "Kise?" to ${f} ne kaha, "Tumhe."`,
          `Dono ki aankhon mein aansu the. ${m} ne muskurakar kaha, "Mera password aaj bhi tumhara naam hi hai." Unhe samajh aa gaya tha ki sachi mohabbat kabhi khatam nahi hoti.`
        ]
      }
    ]
  },
  {
    title: "Dhadkanon Ka Sauda",
    genre: "Romance",
    author: "Grace Bennett",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Pehli Mulaqat",
        content: [
          `${c} ki tezz baarish mein ${m} apni gaadi ka tyre badal raha tha. Tabhi ek ladki ${f} ne aakar apni umbrella uske upar kar di.`,
          `Dono ki aankhein mili aur waqt jaise ruk gaya. ${f} ek local library mein kaam karti thi, jabki ${m} ek badi firm ka designer tha.`,
          `Dono ne wahan coffee pee aur baatein shuru ki. Woh mulakat unki zindagi badalne wali thi.`
        ]
      },
      {
        title: "Chapter 2: Khamosh Izhaar",
        content: [
          `Dono ke beech mulakaton ka silsila badhne laga. ${f} ko ${m} ki sadgi pasand aayi aur ${m} ko ${f} ka chulbulapan.`,
          `Lekin ek misunderstanding ki wajah se ${m} ko laga ki ${f} kisi aur se pyaar karti hai, aur usne khud ko door kar liya.`,
          `Dono ne ek dusre se baat karna band kar diya, lekin dil mein ek dusre ke liye tadap wahi thi.`
        ]
      },
      {
        title: "Chapter 3: Ek Baar Phir",
        content: [
          `Ek din ${m} ko sach pata chala ki ${f} akeli hai aur sirf uske intezaar mein baithi hai. Woh bina soche ${f} ki taraf bhaga.`,
          `Library mein ${f} akele khadi ro rahi thi. ${m} ne samne se jaakar uska haath pakda aur kaha, "Mujhe maaf kar do, main ab door nahi jaunga."`,
          `Dono ne ek dusre ko gale lagaya. Unki dhadkanein ab ek ho chuki thi.`
        ]
      }
    ]
  },
  {
    title: "Kuch Adhure Alfaaz",
    genre: "Romance",
    author: "V. E. Thorne",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Diary Ke Panna",
        content: [
          `${f} ko apne room se ek purani diary mili. Usme har ek panna ${m} ke baare mein tha. ${m} uski life ka sabse bada support system tha.`,
          `Dono college mein ${col} ke sabse acche dost the. Lekin ${m} bina bataye achanak ek din sheher chhod kar chala gaya tha.`,
          `${f} aaj bhi usse nafrat karne ki koshish karti thi, par dil mein uske liye jagah khali thi.`
        ]
      },
      {
        title: "Chapter 2: Achanak Samna",
        content: [
          `Ek business seminar mein ${f} ko jaana pada. Wahan guest speaker koi aur nahi, balki ${m} hi tha.`,
          `${m} stage par khada tha aur boht badal chuka tha. Jab uski nazar ${f} par padi, to uske bolne ke alfaaz ruk gaye.`,
          `Seminar ke baad ${m} ne ${f} ko rukne ko kaha, par ${f} ne gusse mein mana kar diya.`
        ]
      },
      {
        title: "Chapter 3: Sach Ka Khulasa",
        content: [
          `${m} ne ${f} ke ghar jaakar usse sach bataya ki uske pita par karza tha, isliye usne sab chhod kar kaam kiya taaki family ko bacha sake.`,
          `Usne kaha, "Maine tumse doori banayi taaki meri musibatein tum tak na pahunche. Par ek din bhi tumhare bina nahi jiya."`,
          `${f} ne haste hue use gale lagaya. Adhure alfaaz ab poore ho chuke the.`
        ]
      }
    ]
  }
];

const revengeTemplates = [
  {
    title: "Inteqam Ki Dhadkan",
    genre: "Revenge",
    author: "Marc Vance",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Bharosa Aur Dhoka",
        content: [
          `${m} aur ${v} ne milkar ek ${sec} shuru kiya tha. ${m} ne apni din-raat ek kar di thi company ko bada banane mein.`,
          `Lekin jab funding aayi, toh ${v} ne dhoke se saare shares apne naam karwa liye aur ${m} ko jhoothe scam mein fasa kar jail bhej diya.`,
          `${m} jail ke andar se sirf ek hi cheez soch raha tha — inteqam. Usne thaan liya tha ki woh apna sab kuch wapas lekar rahega.`
        ]
      },
      {
        title: "Chapter 2: Nayi Pehchan, Naya Vaar",
        content: [
          `Jail se nikalne ke baad, ${m} ne apna naam aur shakal badal li. Ab woh market mein ek bada investor ban kar lauta.`,
          `Usne ${v} ki company par nazar rakhi aur uske business partners ko dheere-dheere apni side karna shuru kar diya.`,
          `${v} ko lag raha tha ki uski company asmaan chhoo rahi hai, par usse nahi pata tha ki neeche ki zameen khisne wali hai.`
        ]
      },
      {
        title: "Chapter 3: Aakhri Game",
        content: [
          `Board meeting mein jab ${v} naye deals announce karne wala tha, tabhi ${m} ne entry maari aur saare proofs samne rakh diye.`,
          `${v} ke dhoke, tax chori aur illegal transfers ki saari file media aur police tak pahunch chuki thi. Police ne ${v} ko arrest kar liya.`,
          `${m} ne apni chair par baith kar kaha, "Dhoka dene se pehle sochna chahiye tha ki zameen ghoom kar wapas wahin aati hai."`
        ]
      }
    ]
  },
  {
    title: "Zehreela Inteqam",
    genre: "Revenge",
    author: "Marc Vance",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Pyar Ka Khel",
        content: [
          `${f} ko lagta tha ki ${v} usse sacha pyaar karta hai. Lekin ${v} sirf uske pita ke empire ka malik banna chahta tha.`,
          `Ek raat, ${v} ne uske pita ko zeher dekar maar diya aur saara blame ${f} par daal diya. ${f} ko court ne saalon ki saza sunayi.`,
          `Barbaad hokar ${f} ne tay kiya ki ab uski zindagi ka ek hi maksad hai — ${v} ki tabahi.`
        ]
      },
      {
        title: "Chapter 2: Tezz Shadyantra",
        content: [
          `Saza kaatne ke baad ${f} ek shaktishali business woman ban kar wapas aayi. Usne ${v} ki har deal ko block karna shuru kar diya.`,
          `${v} ko lag raha tha ki uska koi naya dushman hai, par usne kabhi nahi socha tha ki ${f} wapas aa sakti hai.`,
          `Dheere-dheere ${f} ne ${v} ke saare assets ko auction mein khareed liya.`
        ]
      },
      {
        title: "Chapter 3: Sach Ka Saamna",
        content: [
          `Auction room mein ${v} bilkul bankrupted ho chuka tha. Wahan ${f} uske samne aayi aur kaha, "Kya hua ${v}, apni shakal bhool gaye?"`,
          `${v} ne police ko bulane ki koshish ki par uske saare gunaahon ke gawah pehle hi court mein hazir the.`,
          `${f} ne apne pita ki tasveer ko yaad karte hue sukoon ki saans li. Inteqam pura ho chuka tha.`
        ]
      }
    ]
  }
];

const garibToAmirTemplates = [
  {
    title: "Gareeb Ka Khwab",
    genre: "Drama",
    author: "Kaelen Vane",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Sadak Se Safar",
        content: [
          `${m} ke paas rehne ke liye thik se ghar nahi tha. ${c} ke ek chote se dhabe par kaam karke woh apne collge ${col} ki fees bharta tha.`,
          `Log uski fate-purane kapdo par haste the. Ek din, college ke ameer ladke ${v} ne us par paani fek kar mazaak udaya.`,
          `${m} ne chupchap apna ansoo ponchha aur kaha, "Waqt sabka badalta hai, mera bhi badlega."`
        ]
      },
      {
        title: "Chapter 2: Raat Bhar Ki Mehnat",
        content: [
          `${m} ne coding seekhi aur raat-raat bhar jaag kar ek revolutionary ${sec} code kiya.`,
          `Uske paas laptop nahi tha, par usne college lab ka sahi istemaal kiya aur apne idea ko demo level tak le gaya.`,
          `Ek venture capitalist ne uska talent dekha aur use 5 crore ki initial funding de di.`
        ]
      },
      {
        title: "Chapter 3: Billionaire Ka Crown",
        content: [
          `3 saal ke andar ${m} ki company ki valuation 1000 crore ho gayi. Aaj uski badi car ${col} ke samne khadi thi.`,
          `${v} usi company mein job interview ke liye line mein khada tha. Jab usne ${m} ko Boss ki chair par dekha, to uske hoshe udd gaye.`,
          `${m} ne smile kiya aur bola, "Job interview ke liye all the best, ${v}. Purani baatein bhool jao, kaam dekho."`
        ]
      }
    ]
  },
  {
    title: "Waitress Se Business Queen",
    genre: "Drama",
    author: "Rhea Sterling",
    getChapters: (m, f, v, c, col, sec) => [
      {
        title: "Chapter 1: Paanch Rupaye Ki Kimat",
        content: [
          `${f} ek five-star hotel mein waitress thi. Uske bhai ki tabiyat kharab thi aur use paise ki boht zaroorat thi.`,
          `Ek din, ek ghamandi customer ${v} ne uspar chillar fenk di aur kaha, "Tumhari aukaat bas yahi hai."`,
          `${f} ne chillar utayi aur faisla kiya ki woh ab kabhi kisi ke samne haath nahi felayegi.`
        ]
      },
      {
        title: "Chapter 2: Naya Dhanda",
        content: [
          `${f} ne organic organic spice business shuru kiya. Dheere-dheere sheher ki mahilayon ko jod kar usne ek factory kholi.`,
          `Uski lagan aur mehnat se unka brand pure desh mein famous ho gaya. Badi companies unhe buy out karna chahti thi.`,
          `Lekin ${f} ne har baar mana kar diya, unhe khud ka empire banana tha.`
        ]
      },
      {
        title: "Chapter 3: Aukaat Ki Baat",
        content: [
          `Kuch saalon baad ${f} wahi hotel khareedne aayi jahan woh kaam karti thi. Board meeting mein ${v} wahan ek director ban kar baitha tha.`,
          `${f} ne hotel khareed kar ${v} ko fire kar diya aur kaha, "Ab aapko chillar fenkne ki zaroorat nahi padegi."`,
          `Ek gareeb waitress ab sheher ki sabse badi business queen ban chuki thi.`
        ]
      }
    ]
  }
];

// Helper to generate a random rating between 4.2 and 4.9
const getRandomRating = () => (4.2 + Math.random() * 0.7).toFixed(1);

// Helper to pick a random item from array
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate 75 detailed stories
const generatedBooks = [];

for (let i = 1; i <= 80; i++) {
  const m = pickRandom(maleNames);
  const f = pickRandom(femaleNames);
  const v = pickRandom(villainNames);
  const c = pickRandom(cities);
  const col = pickRandom(collegeNames);
  const sec = pickRandom(startupSectors);
  
  // Distribute themes evenly
  const themeType = i % 3;
  let template;
  if (themeType === 0) {
    template = pickRandom(romanceTemplates);
  } else if (themeType === 1) {
    template = pickRandom(revengeTemplates);
  } else {
    template = pickRandom(garibToAmirTemplates);
  }
  
  // Make title slightly unique if we repeat templates
  let finalTitle = template.title;
  if (i > 7) {
    const titlesAddons = [
      "Ki Nayi Raah", "Ka Sach", "Ka Dusra Mauka", "Ek Naya Safar", "Ka Aakhri Panna",
      "Aur Dil Ka Faisla", "Ki Kahani", "Inteqam Ka Khel", "Ka Naya Daur", "Ki Takdeer"
    ];
    finalTitle = `${template.title}: ${pickRandom(titlesAddons)} (Vol. ${Math.ceil(i/3)})`;
  }
  
  const rating = getRandomRating();
  const price = pickRandom([3.99, 4.99, 5.99]);
  
  // Alternate cover images
  const covers = [
    "/covers/whispering-canopy.png",
    "/covers/echoes-neon.png",
    "/covers/clockwork-cryptid.png"
  ];
  const coverUrl = covers[i % 3];
  
  // Generate dynamic chapters
  const chapters = template.getChapters(m, f, v, c, col, sec);
  
  // Construct description
  let description = "";
  if (template.genre === "Romance") {
    description = `Yeh dastan hai ${m} aur ${f} ki sachi mohabbat ki. ${c} sheher ke background me bani, unki college ki dosti aur paanch saal ki doori ke baad achanak hui coffee shop ki mulaqat ki ek anokhi prem kahani.`;
  } else if (template.genre === "Revenge") {
    description = `Dhoka jab apna hi deta hai toh dard sabse zyada hota hai. ${m} ne jab ${v} par bharosa kiya, toh use mila dhoka aur jail. Ab ${m} wapas aya hai ek naye roop aur naye inteqam ke sath.`;
  } else {
    description = `Ek struggling chhatra ${m} jo ${col} ki fees ke liye dhabe par kaam karta tha, uspar bade logon ne boht hasa. Par uski kismat badli jab usne ek ${sec} banaya aur ban gaya billionaire.`;
  }
  
  generatedBooks.push({
    id: `story-${i}`,
    title: finalTitle,
    author: template.author,
    genre: template.genre,
    rating: parseFloat(rating),
    price: price,
    coverUrl: coverUrl,
    description: description,
    chapters: chapters
  });
}

// Convert generated book objects to ES Module output format
const fileContent = `export const books = ${JSON.stringify(generatedBooks, null, 2)};\n`;

const targetPath = path.join(__dirname, 'books.js');
fs.writeFileSync(targetPath, fileContent, 'utf-8');
console.log(`Successfully generated 80 stories and saved them to ${targetPath}!`);
