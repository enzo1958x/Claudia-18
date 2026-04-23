// ============================================================
//  ISTRUZIONI PER MODIFICARE LE DEDICHE
// ============================================================
//  Ogni elemento corrisponde a una foto (photo_01.jpg ... photo_41.jpg)
//  Modifica il campo "dedica" come vuoi!
//  Il campo "data" è solo indicativo - il sito assegna le foto
//  automaticamente in base al giorno dell'anno a partire dal compleanno.
// ============================================================

export const BIRTHDAY = { day: 26, month: 5 } // 26 maggio
export const NAME = "Claudia"
export const TOTAL_PHOTOS = 41

export interface PhotoEntry {
  id: number
  filename: string
  dedica: string
  emoji: string
}

export const photos: PhotoEntry[] = [
  {
    id: 1,
    filename: "photo_01.jpg",
    emoji: "🌅",
    dedica: "Ogni alba è un nuovo record da battere. Tu lo sai meglio di tutti: la fatica della mattina porta sempre qualcosa di bello. Come questa foto."
  },
  {
    id: 2,
    filename: "photo_02.jpg",
    emoji: "💪",
    dedica: "C'è una forza in te che va ben oltre i muscoli. È quella che ti fa alzare quando sei stanca, che ti fa sorridere anche nei giorni difficili."
  },
  {
    id: 3,
    filename: "photo_03.jpg",
    emoji: "🌿",
    dedica: "Hai la stessa energia della natura: inarrestabile, vera, sempre in movimento. Questa foto me lo ricorda ogni volta che la guardo."
  },
  {
    id: 4,
    filename: "photo_04.jpg",
    emoji: "⚡",
    dedica: "Se la matematica non ti piace, pazienza — la vita non si misura in equazioni. Si misura in momenti come questo."
  },
  {
    id: 5,
    filename: "photo_05.jpg",
    emoji: "🎯",
    dedica: "Concentrazione, determinazione, e quel mezzo sorriso furbo che hai sempre. Guardati: sei già un capolavoro."
  },
  {
    id: 6,
    filename: "photo_06.jpg",
    emoji: "🌊",
    dedica: "Come l'acqua: ti adatti, trovi sempre la strada, e alla fine arrivi dove vuoi. Niente ti ferma davvero."
  },
  {
    id: 7,
    filename: "photo_07.jpg",
    emoji: "🏆",
    dedica: "Non sempre il podio è di metallo e medaglie. A volte è un momento, una risata, una foto come questa. Questo è il tuo podio oggi."
  },
  {
    id: 8,
    filename: "photo_08.jpg",
    emoji: "🌸",
    dedica: "La fisica dice che ogni azione ha una reazione uguale e contraria. Tu invece hai solo reazioni straordinarie — la fisica non ti merita."
  },
  {
    id: 9,
    filename: "photo_09.jpg",
    emoji: "✨",
    dedica: "Ci sono persone che illuminano le stanze. Tu sei una di quelle. E non è magia — è solo chi sei."
  },
  {
    id: 10,
    filename: "photo_10.jpg",
    emoji: "🦋",
    dedica: "Quanta strada, quanta crescita. Eppure in questa foto c'è ancora tutta la leggerezza che ti ho sempre visto negli occhi."
  },
  {
    id: 11,
    filename: "photo_11.jpg",
    emoji: "🌙",
    dedica: "Anche nelle giornate storte — anche quando la matematica sembrava una lingua aliena — tu eri lì, testarda e meravigliosa."
  },
  {
    id: 12,
    filename: "photo_12.jpg",
    emoji: "🎵",
    dedica: "La vita non ha un'equazione. Ma ha un ritmo, e tu lo senti meglio di chiunque altro. Continua a ballare a modo tuo."
  },
  {
    id: 13,
    filename: "photo_13.jpg",
    emoji: "🌺",
    dedica: "Essere forti non significa non cadere mai. Significa rialzarsi ogni volta con più stile di prima. Sei maestra in questo."
  },
  {
    id: 14,
    filename: "photo_14.jpg",
    emoji: "🔥",
    dedica: "C'è qualcosa di contagioso in te — quella voglia di fare, di muoverti, di vivere a piena velocità. Non perderla mai."
  },
  {
    id: 15,
    filename: "photo_15.jpg",
    emoji: "💫",
    dedica: "Guarda questa foto. Poi guardati allo specchio. Poi dimmi ancora che non sei straordinaria. Non puoi, vero?"
  },
  {
    id: 16,
    filename: "photo_16.jpg",
    emoji: "🌈",
    dedica: "La vita è più colorata quando ci sei tu in mezzo. Questo album lo dimostra foto dopo foto."
  },
  {
    id: 17,
    filename: "photo_17.jpg",
    emoji: "🏃",
    dedica: "Corri verso i tuoi sogni con la stessa energia che metti in tutto. Non cambiare mai questa velocità."
  },
  {
    id: 18,
    filename: "photo_18.jpg",
    emoji: "🌟",
    dedica: "Diciotto anni. Ogni anno ha aggiunto qualcosa — una sfida superata, una risata nuova, un pezzo in più di te."
  },
  {
    id: 19,
    filename: "photo_19.jpg",
    emoji: "💎",
    dedica: "Non serve la fisica per capire che sei speciale. Basta guardarti una volta per capirlo."
  },
  {
    id: 20,
    filename: "photo_20.jpg",
    emoji: "🎊",
    dedica: "A metà album. A metà percorso verso il grande giorno. Ogni foto è un capitolo di te che non dimenticherò mai."
  },
  {
    id: 21,
    filename: "photo_21.jpg",
    emoji: "🌻",
    dedica: "Come il sole, ti volti sempre verso la luce. Anche quando non sai dove sia — la trovi lo stesso."
  },
  {
    id: 22,
    filename: "photo_22.jpg",
    emoji: "🎸",
    dedica: "La matematica è noiosa. Tu invece sei interessante in ogni pagina, in ogni capitolo, in ogni foto."
  },
  {
    id: 23,
    filename: "photo_23.jpg",
    emoji: "🦁",
    dedica: "Coraggio, carattere, e quel modo tutto tuo di affrontare le cose. Sei un leone — e lo sai."
  },
  {
    id: 24,
    filename: "photo_24.jpg",
    emoji: "🌠",
    dedica: "Guarda quanto hai vissuto. Guarda quanto ti aspetta. Il meglio deve ancora venire, Claudia."
  },
  {
    id: 25,
    filename: "photo_25.jpg",
    emoji: "🎭",
    dedica: "Sei molte cose insieme: sportiva, creativa, testarda nel modo giusto, generosa. Come fai a stare in una sola persona?"
  },
  {
    id: 26,
    filename: "photo_26.jpg",
    emoji: "🚀",
    dedica: "Mancano poco più di due settimane. Il conto alla rovescia è iniziato — e questa foto è la tua spinta di decollo."
  },
  {
    id: 27,
    filename: "photo_27.jpg",
    emoji: "💝",
    dedica: "Non c'è formula che spieghi quanto ti voglio bene. E questa volta la matematica non c'entra — è solo la verità."
  },
  {
    id: 28,
    filename: "photo_28.jpg",
    emoji: "🌍",
    dedica: "Il mondo è grande, e tu hai esattamente l'energia giusta per esplorarlo tutto. Pronti, partenza, via."
  },
  {
    id: 29,
    filename: "photo_29.jpg",
    emoji: "⭐",
    dedica: "Ogni tanto rallenta e guardati indietro. Quanta strada, quanta forza. Poi riprendi a correre — che stai benissimo così."
  },
  {
    id: 30,
    filename: "photo_30.jpg",
    emoji: "🎀",
    dedica: "Dieci giorni. Dieci foto ancora. Ogni giorno che passa, il 26 maggio si avvicina — e non vedo l'ora."
  },
  {
    id: 31,
    filename: "photo_31.jpg",
    emoji: "🦋",
    dedica: "Come una farfalla: hai attraversato le tue metamorfosi e sei sbocciata in qualcosa di meraviglioso."
  },
  {
    id: 32,
    filename: "photo_32.jpg",
    emoji: "🏄",
    dedica: "Cavalca le onde, anche quelle alte. Le conosci, le rispetti, e poi le superi sempre. È il tuo stile."
  },
  {
    id: 33,
    filename: "photo_33.jpg",
    emoji: "🌺",
    dedica: "Otto giorni. L'attesa è quasi più bella del momento — quasi. Tieniti pronta."
  },
  {
    id: 34,
    filename: "photo_34.jpg",
    emoji: "💪",
    dedica: "La forza non è solo fisica. La tua è anche quella di chi sa chi è, cosa vuole, dove va. Rara, preziosa."
  },
  {
    id: 35,
    filename: "photo_35.jpg",
    emoji: "🌙",
    dedica: "Sei giorni. Il conto alla rovescia si fa sentire. Come stai? Io sto già facendo i salti di gioia."
  },
  {
    id: 36,
    filename: "photo_36.jpg",
    emoji: "✨",
    dedica: "Cinque giorni. Ogni volta che guardo questa foto penso a quanto sei diventata grande — e mi si stringe il cuore nel modo migliore."
  },
  {
    id: 37,
    filename: "photo_37.jpg",
    emoji: "🎯",
    dedica: "Quattro giorni. Stai per attraversare una soglia importante. Respira. Sorridi. Sei pronta."
  },
  {
    id: 38,
    filename: "photo_38.jpg",
    emoji: "🌟",
    dedica: "Tre giorni. Ci siamo quasi. Ho scelto questa foto perché in essa c'è tutto quello che sei: vera, libera, bellissima."
  },
  {
    id: 39,
    filename: "photo_39.jpg",
    emoji: "🔥",
    dedica: "Due giorni. Domani è quasi domani. Aspetta solo ancora un po' — la sorpresa più grande arriva col 26."
  },
  {
    id: 40,
    filename: "photo_40.mp4",
    emoji: "💫",
    dedica: "Domani compi 18 anni. Stanotte, mentre dormi, si chiude un capitolo bellissimo. E domani ne inizia uno ancora più bello. Ti voglio un mondo di bene."
  },
  {
    id: 41,
    filename: "photo_41.mp4",
    emoji: "🎂",
    dedica: "Questa è l'ultima foto prima del grande giorno. Ma il grande giorno è già qui. Buon compleanno, Claudia — oggi e sempre."
  }
]

// Calcola quale foto mostrare oggi
export function getTodayPhotoIndex(): number {
  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth() + 1 // 1-based

  // Giorno del compleanno = foto 41 (ultima)
  // I 40 giorni precedenti = foto 1-40
  const birthday = new Date(today.getFullYear(), BIRTHDAY.month - 1, BIRTHDAY.day)
  
  // Controlla se è il compleanno
  if (todayDay === BIRTHDAY.day && todayMonth === BIRTHDAY.month) {
    return 40 // indice 0-based dell'ultima foto (41esima)
  }

  // Trova quanti giorni mancano al compleanno
  let diff = Math.floor((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  // Se il compleanno è già passato quest'anno, calcola per l'anno prossimo
  if (diff < 0) {
    const nextBirthday = new Date(today.getFullYear() + 1, BIRTHDAY.month - 1, BIRTHDAY.day)
    diff = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  // Foto da mostrare: se mancano N giorni, mostriamo foto (41 - N - 1)
  // Nella finestra di 41 giorni prima del compleanno
  if (diff <= 40) {
    return 40 - diff // 0-based
  }

  // Fuori dalla finestra dei 41 giorni: mostra foto ciclicamente
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return dayOfYear % TOTAL_PHOTOS
}

// Ritorna tutti gli indici delle foto già mostrate (fino a oggi)
export function getRevealedPhotoIndices(): number[] {
  const today = new Date()
  const todayDay = today.getDate()
  const todayMonth = today.getMonth() + 1

  const birthday = new Date(today.getFullYear(), BIRTHDAY.month - 1, BIRTHDAY.day)
  let diff = Math.floor((birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diff < 0) {
    const nextBirthday = new Date(today.getFullYear() + 1, BIRTHDAY.month - 1, BIRTHDAY.day)
    diff = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const isBirthday = todayDay === BIRTHDAY.day && todayMonth === BIRTHDAY.month
  
  if (isBirthday) {
    // Mostra tutte le foto nel giorno del compleanno
    return Array.from({ length: TOTAL_PHOTOS }, (_, i) => i)
  }

  if (diff <= 40) {
    const todayIndex = 40 - diff
    return Array.from({ length: todayIndex + 1 }, (_, i) => i)
  }

  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return [dayOfYear % TOTAL_PHOTOS]
}

export function isBirthdayToday(): boolean {
  const today = new Date()
  return today.getDate() === BIRTHDAY.day && today.getMonth() + 1 === BIRTHDAY.month
}
