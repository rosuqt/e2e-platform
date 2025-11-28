import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/authOptions";
import supabase from "@/lib/supabase";

async function getStudentIdAndRoleFromSession(req: NextRequest): Promise<{ studentId: string | null, role: string | null }> {
  const session = await getServerSession({ req, ...authOptions });
  const studentId = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["studentId"] as string ?? null
    : null;
  const role = session?.user && typeof session.user === "object"
    ? (session.user as Record<string, unknown>)["role"] as string ?? null
    : null;
  return { studentId, role };
}

async function getStudentDetails(student_id: string) {
  try {
    const { data: student, error: studentError } = await supabase
      .from("registered_students")
      .select("id, first_name, last_name, course, year, section, email,address")
      .eq("id", student_id)
      .single();

    if (studentError || !student) {
      console.log("No student found for id:", student_id)
      return null;
    }

    const { data: profile } = await supabase
      .from("student_profile")
      .select("profile_img, cover_image, short_bio, contact_info, uploaded_resume_url, uploaded_cover_letter_url")
      .eq("student_id", student_id)
      .single();

    if (!profile) {
      console.log("No profile found for student_id:", student_id)
    }

    let signedProfileImgUrl: string | null = null;
    let signedCoverImgUrl: string | null = null;

    if (profile?.profile_img) {
      const cleanProfileImg = profile.profile_img.replace(/^\/+/, "");
      const { data: signed, error: signedErr } = await supabase.storage
        .from("user.avatars")
        .createSignedUrl(cleanProfileImg, 60 * 60);
      if (!signedErr && signed?.signedUrl) {
        signedProfileImgUrl = signed.signedUrl;
      } else {
        signedProfileImgUrl = profile.profile_img;
      }
    }
    if (profile?.cover_image) {
      const cleanCoverImg = profile.cover_image.replace(/^\/+/, "");
      const { data: signed, error: signedErr } = await supabase.storage
        .from("user.covers")
        .createSignedUrl(cleanCoverImg, 60 * 60);
      if (!signedErr && signed?.signedUrl) {
        signedCoverImgUrl = signed.signedUrl;
      } else {
        signedCoverImgUrl = profile.cover_image;
      }
    }

    type ContactInfo = {
      email?: string | string[];
      phone?: string | string[];
      countryCode?: string;
      socials?: { key: string; url: string }[];
      [key: string]: unknown;
    };
    let contact_info: { email?: string[]; phone?: string[]; [key: string]: unknown } = {};
    if (profile?.contact_info) {
      if (typeof profile.contact_info === "string") {
        try {
          const parsed: ContactInfo = JSON.parse(profile.contact_info);
          contact_info = {};
          if (parsed.email) {
            contact_info.email = Array.isArray(parsed.email)
              ? parsed.email
              : [parsed.email];
          }
          if (parsed.countryCode && parsed.phone) {
            contact_info.phone = [String(parsed.countryCode), String(parsed.phone)];
          } else if (parsed.phone) {
            contact_info.phone = [String(parsed.phone)];
          } else {
            contact_info.phone = [];
          }
          Object.keys(parsed).forEach((k) => {
            if (k !== "email" && k !== "phone" && k !== "countryCode") contact_info[k] = parsed[k];
          });
        } catch {
          contact_info = {};
        }
      } else {
        const parsed = profile.contact_info as ContactInfo;
        contact_info = {};
        if (parsed.email) {
          contact_info.email = Array.isArray(parsed.email)
            ? parsed.email
            : [parsed.email];
        }
        if (parsed.countryCode && parsed.phone) {
          contact_info.phone = [String(parsed.countryCode), String(parsed.phone)];
        } else if (parsed.phone) {
          contact_info.phone = [String(parsed.phone)];
        }
        Object.keys(parsed).forEach((k) => {
          if (k !== "email" && k !== "phone" && k !== "countryCode") contact_info[k] = parsed[k];
        });
      }
    }

    let country = ""
    let city = ""
    if (Array.isArray(student.address) && student.address.length >= 2) {
      const countryName = student.address[0] || ""
      const countryMap: Record<string, string> = {
        "Afghanistan": "AF",
        "Albania": "AL",
        "Algeria": "DZ",
        "Andorra": "AD",
        "Angola": "AO",
        "Antigua and Barbuda": "AG",
        "Argentina": "AR",
        "Armenia": "AM",
        "Australia": "AU",
        "Austria": "AT",
        "Azerbaijan": "AZ",
        "Bahamas": "BS",
        "Bahrain": "BH",
        "Bangladesh": "BD",
        "Barbados": "BB",
        "Belarus": "BY",
        "Belgium": "BE",
        "Belize": "BZ",
        "Benin": "BJ",
        "Bhutan": "BT",
        "Bolivia": "BO",
        "Bosnia and Herzegovina": "BA",
        "Botswana": "BW",
        "Brazil": "BR",
        "Brunei": "BN",
        "Bulgaria": "BG",
        "Burkina Faso": "BF",
        "Burundi": "BI",
        "Cabo Verde": "CV",
        "Cambodia": "KH",
        "Cameroon": "CM",
        "Canada": "CA",
        "Central African Republic": "CF",
        "Chad": "TD",
        "Chile": "CL",
        "China": "CN",
        "Colombia": "CO",
        "Comoros": "KM",
        "Congo (Congo-Brazzaville)": "CG",
        "Costa Rica": "CR",
        "Croatia": "HR",
        "Cuba": "CU",
        "Cyprus": "CY",
        "Czechia (Czech Republic)": "CZ",
        "Democratic Republic of the Congo": "CD",
        "Denmark": "DK",
        "Djibouti": "DJ",
        "Dominica": "DM",
        "Dominican Republic": "DO",
        "Ecuador": "EC",
        "Egypt": "EG",
        "El Salvador": "SV",
        "Equatorial Guinea": "GQ",
        "Eritrea": "ER",
        "Estonia": "EE",
        "Ethiopia": "ET",
        "Fiji": "FJ",
        "Finland": "FI",
        "France": "FR",
        "Gabon": "GA",
        "Gambia": "GM",
        "Georgia": "GE",
        "Germany": "DE",
        "Ghana": "GH",
        "Greece": "GR",
        "Grenada": "GD",
        "Guatemala": "GT",
        "Guinea": "GN",
        "Guinea-Bissau": "GW",
        "Guyana": "GY",
        "Haiti": "HT",
        "Holy See": "VA",
        "Honduras": "HN",
        "Hungary": "HU",
        "Iceland": "IS",
        "India": "IN",
        "Indonesia": "ID",
        "Iran": "IR",
        "Iraq": "IQ",
        "Ireland": "IE",
        "Israel": "IL",
        "Italy": "IT",
        "Jamaica": "JM",
        "Japan": "JP",
        "Jordan": "JO",
        "Kazakhstan": "KZ",
        "Kenya": "KE",
        "Kiribati": "KI",
        "Kuwait": "KW",
        "Kyrgyzstan": "KG",
        "Laos": "LA",
        "Latvia": "LV",
        "Lebanon": "LB",
        "Lesotho": "LS",
        "Liberia": "LR",
        "Libya": "LY",
        "Liechtenstein": "LI",
        "Lithuania": "LT",
        "Luxembourg": "LU",
        "Madagascar": "MG",
        "Malawi": "MW",
        "Malaysia": "MY",
        "Maldives": "MV",
        "Mali": "ML",
        "Malta": "MT",
        "Marshall Islands": "MH",
        "Mauritania": "MR",
        "Mauritius": "MU",
        "Mexico": "MX",
        "Micronesia": "FM",
        "Moldova": "MD",
        "Monaco": "MC",
        "Mongolia": "MN",
        "Montenegro": "ME",
        "Morocco": "MA",
        "Mozambique": "MZ",
        "Myanmar (Burma)": "MM",
        "Namibia": "NA",
        "Nauru": "NR",
        "Nepal": "NP",
        "Netherlands": "NL",
        "New Zealand": "NZ",
        "Nicaragua": "NI",
        "Niger": "NE",
        "Nigeria": "NG",
        "North Korea": "KP",
        "North Macedonia": "MK",
        "Norway": "NO",
        "Oman": "OM",
        "Pakistan": "PK",
        "Palau": "PW",
        "Palestine State": "PS",
        "Panama": "PA",
        "Papua New Guinea": "PG",
        "Paraguay": "PY",
        "Peru": "PE",
        "Philippines": "PH",
        "Poland": "PL",
        "Portugal": "PT",
        "Qatar": "QA",
        "Romania": "RO",
        "Russia": "RU",
        "Rwanda": "RW",
        "Saint Kitts and Nevis": "KN",
        "Saint Lucia": "LC",
        "Saint Vincent and the Grenadines": "VC",
        "Samoa": "WS",
        "San Marino": "SM",
        "Sao Tome and Principe": "ST",
        "Saudi Arabia": "SA",
        "Senegal": "SN",
        "Serbia": "RS",
        "Seychelles": "SC",
        "Sierra Leone": "SL",
        "Singapore": "SG",
        "Slovakia": "SK",
        "Slovenia": "SI",
        "Solomon Islands": "SB",
        "Somalia": "SO",
        "South Africa": "ZA",
        "South Korea": "KR",
        "South Sudan": "SS",
        "Spain": "ES",
        "Sri Lanka": "LK",
        "Sudan": "SD",
        "Suriname": "SR",
        "Sweden": "SE",
        "Switzerland": "CH",
        "Syria": "SY",
        "Taiwan": "TW",
        "Tajikistan": "TJ",
        "Tanzania": "TZ",
        "Thailand": "TH",
        "Timor-Leste": "TL",
        "Togo": "TG",
        "Tonga": "TO",
        "Trinidad and Tobago": "TT",
        "Tunisia": "TN",
        "Turkey": "TR",
        "Turkmenistan": "TM",
        "Tuvalu": "TV",
        "Uganda": "UG",
        "Ukraine": "UA",
        "United Arab Emirates": "AE",
        "United Kingdom": "GB",
        "United States": "US",
        "Uruguay": "UY",
        "Uzbekistan": "UZ",
        "Vanuatu": "VU",
        "Venezuela": "VE",
        "Vietnam": "VN",
        "Yemen": "YE",
        "Zambia": "ZM",
        "Zimbabwe": "ZW"
      }
      country = countryMap[countryName] || countryName
      city = student.address[1] || ""
    }

    return {
      ...student,
      profile_img: signedProfileImgUrl,
      cover_image: signedCoverImgUrl,
      short_bio: profile?.short_bio ?? "",
      contact_info,
      uploaded_resume_url: profile?.uploaded_resume_url ?? null,
      uploaded_cover_letter_url: profile?.uploaded_cover_letter_url ?? null,
      country,
      city,
    };
  } catch (err) {
    console.log("Error in getStudentDetails:", err)
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { studentId, role } = await getStudentIdAndRoleFromSession(req);
  if (!studentId || role !== "student") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const details = await getStudentDetails(studentId);
  if (!details) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json(details);
}
