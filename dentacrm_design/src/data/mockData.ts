import { Patient, Dentist, Appointment, InventoryItem, Transaction, ToothStatus } from "../types";

export const MOCK_DENTISTS: Dentist[] = [
  {
    id: "dentist-1",
    name: "Dr. Alisher Umarov",
    specialty: "Ortodont & Implantolog",
    phone: "+998 90 123-45-67",
    color: "#3b82f6", // Blue
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "dentist-2",
    name: "Dr. Madina Karimova",
    specialty: "Terapevt & Estetik Stomatolog",
    phone: "+998 91 987-65-43",
    color: "#ec4899", // Pink
    photoUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "dentist-3",
    name: "Dr. Sarvar Pulatov",
    specialty: "Xirurg & Ortoped",
    phone: "+998 93 456-78-90",
    color: "#10b981", // Emerald
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&h=150&q=80",
  },
  {
    id: "dentist-4",
    name: "Dr. Go'zal Rahimova",
    specialty: "Bolalar Stomatologi",
    phone: "+998 94 222-33-44",
    color: "#f59e0b", // Amber
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&h=150&q=80",
  },
];

// Helper to construct empty tooth map (all healthy by default)
export const createDefaultToothStates = (): Record<number, ToothStatus> => {
  const states: Record<number, ToothStatus> = {};
  for (let i = 1; i <= 32; i++) {
    states[i] = ToothStatus.HEALTHY;
  }
  return states;
};

// Create initial tooth maps for mock patients
const toothMapDilshod = createDefaultToothStates();
toothMapDilshod[3] = ToothStatus.CAVITY;
toothMapDilshod[4] = ToothStatus.FILLING;
toothMapDilshod[14] = ToothStatus.CROWN;
toothMapDilshod[19] = ToothStatus.MISSING;

const toothMapKamola = createDefaultToothStates();
toothMapKamola[8] = ToothStatus.FILLING;
toothMapKamola[9] = ToothStatus.FILLING;
toothMapKamola[30] = ToothStatus.ROOT_CANAL;
toothMapKamola[31] = ToothStatus.IMPLANT;

const toothMapBekzod = createDefaultToothStates();
toothMapBekzod[16] = ToothStatus.MISSING;
toothMapBekzod[17] = ToothStatus.MISSING;
toothMapBekzod[32] = ToothStatus.CAVITY;

const toothMapLola = createDefaultToothStates();
toothMapLola[12] = ToothStatus.CROWN;
toothMapLola[13] = ToothStatus.IMPLANT;

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "patient-1",
    name: "Dilshodbek Abduvaliyev",
    phone: "+998 90 333-12-34",
    email: "dilshod@gmail.com",
    gender: "Erkak",
    birthDate: "1992-04-12",
    address: "Toshkent sh., Yunusobod tumani, 4-mavze",
    bloodType: "A (II) Rh+",
    allergies: "Penitsillin",
    notes: "Tish milklarining qonashi va kariesga moyillik bor. Yuqori sezuvchanlik.",
    registeredAt: "2025-01-15",
    toothStates: toothMapDilshod,
    treatments: [
      {
        id: "tr-1",
        date: "2026-07-10",
        description: "3-tish kariesini tozalash va fotopolimer plomba qo'yish",
        cost: 350000,
        status: "completed",
        toothNumber: 3,
        dentistName: "Dr. Madina Karimova",
      },
      {
        id: "tr-2",
        date: "2026-07-12",
        description: "Professional tish tozalash va flyuorizatsiya",
        cost: 250000,
        status: "completed",
        dentistName: "Dr. Madina Karimova",
      },
      {
        id: "tr-3",
        date: "2026-07-22",
        description: "14-tishga sirkoniy toj (crown) o'rnatish rejalashtirildi",
        cost: 1200000,
        status: "planned",
        toothNumber: 14,
        dentistName: "Dr. Sarvar Pulatov",
      }
    ]
  },
  {
    id: "patient-2",
    name: "Kamola Solihova",
    phone: "+998 93 501-88-99",
    email: "kamola.s@inbox.uz",
    gender: "Ayol",
    birthDate: "1995-09-25",
    address: "Toshkent sh., Chilonzor tumani, 9-kvartal",
    bloodType: "O (I) Rh+",
    allergies: "Yo'q",
    notes: "Ortodontik davolanish jarayonida (breket tizimi bor). Har oy keladi.",
    registeredAt: "2024-11-20",
    toothStates: toothMapKamola,
    treatments: [
      {
        id: "tr-4",
        date: "2026-06-15",
        description: "Breketlarni faollashtirish va yangi yoylarni o'rnatish",
        cost: 400000,
        status: "completed",
        dentistName: "Dr. Alisher Umarov",
      },
      {
        id: "tr-5",
        date: "2026-07-05",
        description: "31-tishga dental implant o'rnatish (shvetsariya)",
        cost: 4500000,
        status: "completed",
        toothNumber: 31,
        dentistName: "Dr. Alisher Umarov",
      },
      {
        id: "tr-6",
        date: "2026-07-19",
        description: "30-tish ildiz kanallarni davolash (Root Canal Therapy)",
        cost: 600000,
        status: "completed",
        toothNumber: 30,
        dentistName: "Dr. Madina Karimova",
      }
    ]
  },
  {
    id: "patient-3",
    name: "Bekzod To'rayev",
    phone: "+998 97 744-55-11",
    email: "bekzod88@mail.ru",
    gender: "Erkak",
    birthDate: "1988-11-02",
    address: "Toshkent sh., Mirzo Ulug'bek tumani, Qorasuv-4",
    bloodType: "B (III) Rh-",
    allergies: "Lidokain (ogohlantirish!)",
    notes: "Anesteziya uchun faqat ultratset yoki boshqa muqobildan foydalaning.",
    registeredAt: "2025-05-10",
    toothStates: toothMapBekzod,
    treatments: [
      {
        id: "tr-7",
        date: "2026-07-01",
        description: "16 va 17-chirigan aql tishlarini jarrohlik yo'li bilan olib tashlash",
        cost: 900000,
        status: "completed",
        toothNumber: 16,
        dentistName: "Dr. Sarvar Pulatov",
      }
    ]
  },
  {
    id: "patient-4",
    name: "Lola To'laganova",
    phone: "+998 99 400-11-22",
    email: "lola.t@gmail.com",
    gender: "Ayol",
    birthDate: "2000-02-14",
    address: "Toshkent sh., Shayxontohur tumani",
    bloodType: "AB (IV) Rh+",
    allergies: "Yo'q",
    notes: "Estetik oqartirish va tish dizayniga qiziqadi.",
    registeredAt: "2025-03-02",
    toothStates: toothMapLola,
    treatments: [
      {
        id: "tr-8",
        date: "2026-07-15",
        description: "Tishlarni lazerli oqartirish (Zoom 4 texnologiyasi)",
        cost: 1500000,
        status: "completed",
        dentistName: "Dr. Madina Karimova",
      }
    ]
  },
  {
    id: "patient-5",
    name: "Jasur Nematov",
    phone: "+998 90 234-56-78",
    email: "jasur.nem@gmail.com",
    gender: "Erkak",
    birthDate: "1994-07-30",
    address: "Toshkent sh., Sergeli tumani, 5-daha",
    bloodType: "A (II) Rh+",
    allergies: "Yo'q",
    notes: "Tish g'ijirlatish (Bruksizm) shikoyati bor. Tungi kapa buyurtma qilingan.",
    registeredAt: "2026-06-01",
    toothStates: createDefaultToothStates(),
    treatments: []
  },
  {
    id: "patient-6",
    name: "Sardorbek Shokirov",
    phone: "+998 91 155-66-77",
    email: "sardor.shok@mail.ru",
    gender: "Erkak",
    birthDate: "2018-05-18",
    address: "Toshkent sh., Uchtepa tumani",
    bloodType: "O (I) Rh+",
    allergies: "Yo'q",
    notes: "Bolalar bo'limi bemori. Sut tishlari kariesi mavjud. Shakarli narsalarni ko'p yeydi.",
    registeredAt: "2026-07-11",
    toothStates: createDefaultToothStates(),
    treatments: [
      {
        id: "tr-9",
        date: "2026-07-11",
        description: "Sut tishlarini floridli lak bilan qoplash",
        cost: 200000,
        status: "completed",
        dentistName: "Dr. Go'zal Rahimova",
      }
    ]
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "app-1",
    patientId: "patient-1",
    patientName: "Dilshodbek Abduvaliyev",
    dentistId: "dentist-2",
    date: "2026-07-20", // TODAY (will dynamically match later if we want, but let's hardcode for ease or adjust in components)
    time: "09:00",
    duration: 60,
    treatmentType: "Tish konsultatsiyasi va rentgen",
    status: "scheduled",
    chairNumber: 1,
    notes: "Asoratsiz tish og'rig'i tekshiruvi",
  },
  {
    id: "app-2",
    patientId: "patient-2",
    patientName: "Kamola Solihova",
    dentistId: "dentist-1",
    date: "2026-07-20",
    time: "10:30",
    duration: 45,
    treatmentType: "Breketlarni faollashtirish (ortodontiya)",
    status: "scheduled",
    chairNumber: 2,
    notes: "Yangi elastik yoylar tortish",
  },
  {
    id: "app-3",
    patientId: "patient-3",
    patientName: "Bekzod To'rayev",
    dentistId: "dentist-3",
    date: "2026-07-20",
    time: "14:00",
    duration: 90,
    treatmentType: "Tish ildiz implantatsiyasi",
    status: "scheduled",
    chairNumber: 1,
    notes: "3-tish o'rniga Nobel Biocare implantati o'rnatiladi. Allergiyaga e'tibor bering!",
  },
  {
    id: "app-4",
    patientId: "patient-4",
    patientName: "Lola To'laganova",
    dentistId: "dentist-2",
    date: "2026-07-20",
    time: "16:00",
    duration: 60,
    treatmentType: "Estetik tish restavratsiyasi (Vinir)",
    status: "completed",
    chairNumber: 3,
    notes: "Yuqori tishlar rangini moslash",
  },
  {
    id: "app-5",
    patientId: "patient-5",
    patientName: "Jasur Nematov",
    dentistId: "dentist-3",
    date: "2026-07-21",
    time: "11:00",
    duration: 45,
    treatmentType: "Bruksizm uchun tungi kapa o'rnatish",
    status: "scheduled",
    chairNumber: 2,
    notes: "Tish o'lcham kapa tekshirish",
  },
  {
    id: "app-6",
    patientId: "patient-6",
    patientName: "Sardorbek Shokirov",
    dentistId: "dentist-4",
    date: "2026-07-21",
    time: "15:00",
    duration: 40,
    treatmentType: "Karies davolash (Sut tishi)",
    status: "scheduled",
    chairNumber: 3,
    notes: "Yengil davolash, qo'rqitmasdan muomala qilinadi",
  },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Fotopolimer kompozit (3M Filtek)",
    category: "Plomba materiallari",
    quantity: 15,
    unit: "shprits",
    minQuantity: 5,
    lastRestocked: "2026-07-01",
    pricePerUnit: 140000,
    supplier: "DentalTrade LLC",
  },
  {
    id: "inv-2",
    name: "Artikain anesteziya ampulalari (Septodont)",
    category: "Anesteziya",
    quantity: 120,
    unit: "dona",
    minQuantity: 50,
    lastRestocked: "2026-07-05",
    pricePerUnit: 12000,
    supplier: "MedFarm Servis",
  },
  {
    id: "inv-3",
    name: "Lidokain sprey (10%)",
    category: "Anesteziya",
    quantity: 4,
    unit: "flakon",
    minQuantity: 5, // LOW STOCK
    lastRestocked: "2026-05-12",
    pricePerUnit: 45000,
    supplier: "MedFarm Servis",
  },
  {
    id: "inv-4",
    name: "Surgidax jarrohlik kiyimi & niqobi",
    category: "Himoya jihozlari",
    quantity: 250,
    unit: "komplekt",
    minQuantity: 100,
    lastRestocked: "2026-07-15",
    pricePerUnit: 8000,
    supplier: "EuroProtect",
  },
  {
    id: "inv-5",
    name: "Dental gips (A-Klass)",
    category: "Ortopediya",
    quantity: 3,
    unit: "qop (5kg)",
    minQuantity: 2,
    lastRestocked: "2026-06-20",
    pricePerUnit: 110000,
    supplier: "DentalTrade LLC",
  },
  {
    id: "inv-6",
    name: "Tish kanallarini tozalash ignasi (K-Files)",
    category: "Endodontiya",
    quantity: 18,
    unit: "quti",
    minQuantity: 10,
    lastRestocked: "2026-07-10",
    pricePerUnit: 35000,
    supplier: "MedTech Asia",
  },
  {
    id: "inv-7",
    name: "Tish implantat to'plami (Nobel Biocare)",
    category: "Implantologiya",
    quantity: 2,
    unit: "to'plam",
    minQuantity: 5, // LOW STOCK
    lastRestocked: "2026-06-15",
    pricePerUnit: 1800000,
    supplier: "Nobel Swiss Agency",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    date: "2026-07-15",
    type: "income",
    amount: 1500000,
    category: "Estetik stomatologiya",
    description: "Lazerli oqartirish (Lola To'laganova)",
    patientId: "patient-4",
    patientName: "Lola To'laganova",
  },
  {
    id: "tx-2",
    date: "2026-07-15",
    type: "expense",
    amount: 1200000,
    category: "Klinika jihozlari / Materiallar",
    description: "DentalTrade LLC dan plomba materiallari sotib olindi",
  },
  {
    id: "tx-3",
    date: "2026-07-18",
    type: "income",
    amount: 350000,
    category: "Terapiya",
    description: "Karies davolash plomba (Dilshodbek Abduvaliyev)",
    patientId: "patient-1",
    patientName: "Dilshodbek Abduvaliyev",
  },
  {
    id: "tx-4",
    date: "2026-07-18",
    type: "income",
    amount: 250000,
    category: "Gigiyena",
    description: "Professional tish tozalash (Dilshodbek Abduvaliyev)",
    patientId: "patient-1",
    patientName: "Dilshodbek Abduvaliyev",
  },
  {
    id: "tx-5",
    date: "2026-07-19",
    type: "income",
    amount: 4500000,
    category: "Implantatsiya",
    description: "Tish implantatsiyasi o'rnatish (Kamola Solihova)",
    patientId: "patient-2",
    patientName: "Kamola Solihova",
  },
  {
    id: "tx-6",
    date: "2026-07-19",
    type: "income",
    amount: 600000,
    category: "Endodontiya",
    description: "Ildiz kanallarini davolash (Kamola Solihova)",
    patientId: "patient-2",
    patientName: "Kamola Solihova",
  },
  {
    id: "tx-7",
    date: "2026-07-20",
    type: "expense",
    amount: 450000,
    category: "Maishiy xarajatlar",
    description: "Klinika tozalash vositalari va kofe ta'minoti",
  },
  {
    id: "tx-8",
    date: "2026-07-20",
    type: "income",
    amount: 900000,
    category: "Xirurgiya",
    description: "Aql tishlarini olib tashlash (Bekzod To'rayev)",
    patientId: "patient-3",
    patientName: "Bekzod To'rayev",
  },
];

// LocalStorage helpers to allow state edits to remain across refreshes
export const loadData = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`dentacrm_${key}`);
  if (data) {
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error parsing key ${key} from localStorage`, e);
    }
  }
  return defaultValue;
};

export const saveData = <T>(key: string, value: T): void => {
  localStorage.setItem(`dentacrm_${key}`, JSON.stringify(value));
};
