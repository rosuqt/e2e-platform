import { NextRequest, NextResponse } from "next/server"

const staticCities: Record<string, string[]> = {
  PH: [
    "Manila", "Quezon City", "Makati", "Cebu City", "Davao City", "Muntinlupa", "Taguig", "Pasig", "Parañaque", "Las Piñas",
    "Baguio", "Iloilo City", "Cagayan de Oro", "General Santos", "Calamba", "San Fernando", "Antipolo", "Valenzuela", "Bacoor", "Santa Rosa",
    "Marikina", "Mandaluyong", "Malabon", "Navotas", "San Juan", "Pateros", "Angeles", "Olongapo", "Batangas City", "Lipa",
    "Lucena", "San Pablo", "Tanauan", "Tarlac City", "Dagupan", "Urdaneta", "Cabanatuan", "Gapan", "San Jose", "Palayan",
    "Meycauayan", "San Jose del Monte", "Malolos", "Balanga", "Baliuag", "Santa Maria", "San Mateo", "Rodriguez", "Montalban", "San Pedro",
    "Binan", "Cabuyao", "Santa Rosa", "San Fernando (La Union)", "La Trinidad", "Bangued", "Vigan", "Laoag", "Tuguegarao", "Tabuk",
    "Basco", "Bayombong", "Solano", "Santiago", "Cauayan", "Ilagan", "Aparri", "Baler", "San Jose (Occidental Mindoro)", "Calapan",
    "Puerto Princesa", "Roxas", "Kalibo", "Malay", "Tagbilaran", "Dumaguete", "Toledo", "Mandaue", "Lapu-Lapu", "Ormoc",
    "Tacloban", "Catbalogan", "Borongan", "Maasin", "Surigao", "Butuan", "Bislig", "Tagum", "Panabo", "Digos",
    "Kidapawan", "Cotabato City", "Koronadal", "Polomolok", "Tacurong", "Isulan", "Iligan", "Ozamiz", "Pagadian", "Dipolog",
    "Zamboanga City", "Dapitan", "Molave", "Isabela City", "Jolo", "Basilan", "Sulu", "Tawi-Tawi", "Bongao", "Lamitan"
  ],
  US: [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington"
  ],
  GB: [
    "London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Glasgow", "Sheffield", "Edinburgh", "Bristol", "Cardiff",
    "Newcastle", "Nottingham", "Leicester", "Coventry", "Kingston upon Hull", "Bradford", "Belfast", "Stoke-on-Trent", "Wolverhampton", "Plymouth"
  ],
  CA: [
    "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Kitchener",
    "London", "Victoria", "Halifax", "Oshawa", "Windsor", "Saskatoon", "Regina", "St. John's", "Barrie", "Kelowna"
  ],
  AU: [
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City",
    "Geelong", "Hobart", "Townsville", "Cairns", "Toowoomba", "Darwin", "Ballarat", "Bendigo", "Albury", "Launceston"
  ],
  IN: [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara"
  ],
  DE: [
    "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf", "Dortmund", "Essen", "Leipzig",
    "Bremen", "Dresden", "Hanover", "Nuremberg", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster"
  ],
  FR: [
    "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg", "Montpellier", "Bordeaux", "Lille",
    "Rennes", "Reims", "Le Havre", "Saint-Étienne", "Toulon", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne"
  ],
  JP: [
    "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama",
    "Hiroshima", "Sendai", "Kitakyushu", "Chiba", "Sakai", "Niigata", "Hamamatsu", "Shizuoka", "Okayama", "Sagamihara"
  ],
  CN: [
    "Shanghai", "Beijing", "Chongqing", "Tianjin", "Guangzhou", "Shenzhen", "Chengdu", "Nanjing", "Wuhan", "Xi'an",
    "Hangzhou", "Dongguan", "Foshan", "Shenyang", "Harbin", "Qingdao", "Dalian", "Jinan", "Zhengzhou", "Changsha"
  ]
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get("country")
  const prefix = searchParams.get("prefix")?.toLowerCase() || ""
  if (!country) return NextResponse.json({ data: [] })

  const citiesArr = staticCities[country] || []
  const cities = citiesArr
    .filter(name => name.toLowerCase().includes(prefix))
    .map((name, idx) => ({
      id: `${country}-${name}-${idx}`,
      name
    }))

  return NextResponse.json({ data: cities })
}
