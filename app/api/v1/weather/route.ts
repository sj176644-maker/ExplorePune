import { NextResponse } from 'next/server';

export const revalidate = 900; // Cache for 15 minutes at the edge

const FALLBACK_WEATHER = {
  temp: 28,
  humidity: 48,
  windSpeed: 8,
  conditionEn: 'Pleasant Pune Weather',
  conditionMr: 'आल्हाददायक पुणेरी हवामान',
  icon: '🌤️',
  adviceEn: 'Optimal hours for outdoor sightseeing',
  adviceMr: 'बाहेरील पर्यटनासाठी उत्तम वेळ',
};

export async function GET() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
      {
        headers: {
          'User-Agent': 'ExplorePuneApp/1.0 (https://explore-pune-eosin.vercel.app; info@explorepune.internal)',
        },
        next: { revalidate: 900 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(FALLBACK_WEATHER);
    }

    const json = await res.json();
    const cur = json.current;
    if (!cur) {
      return NextResponse.json(FALLBACK_WEATHER);
    }

    const code = cur.weather_code ?? 0;
    let conditionEn = 'Clear & Pleasant';
    let conditionMr = 'निरभ्र व आल्हाददायक';
    let icon = '☀️';
    let adviceEn = 'Great for forts, wadas & open-air tekdi walks';
    let adviceMr = 'किल्ले, वाडे आणि टेकडी भ्रमंतीसाठी उत्तम वेळ';

    if (code === 0) {
      conditionEn = 'Clear Skies';
      conditionMr = 'स्वच्छ सूर्यप्रकाश';
      icon = '☀️';
    } else if (code >= 1 && code <= 3) {
      conditionEn = 'Partly Cloudy';
      conditionMr = 'हलके ढगाळ वातावरण';
      icon = '🌤️';
      adviceEn = 'Pleasant breeze — ideal for heritage photo walks';
      adviceMr = 'थंडगार वारा — ऐतिहासिक छायाचित्रांसाठी उत्तम काळ';
    } else if (code >= 45 && code <= 48) {
      conditionEn = 'Morning Mist / Fog';
      conditionMr = 'सकाळचे धुके';
      icon = '🌫️';
      adviceEn = 'Scenic Sahyadri views; drive carefully on ghats';
      adviceMr = 'सह्याद्रीचे नयनरम्य दृश्य; घाटात सावकाश गाडी चालवा';
    } else if (code >= 51 && code <= 67) {
      conditionEn = 'Light Monsoon Showers';
      conditionMr = 'हलक्या पावसाच्या सरी';
      icon = '🌦️';
      adviceEn = 'Carry an umbrella & trekking shoes with grip';
      adviceMr = 'छत्री व मजबूत पकडीचे बूट सोबत ठेवा';
    } else if (code >= 80 && code <= 99) {
      conditionEn = 'Passing Rain / Gusts';
      conditionMr = 'पावसाच्या जोरदार सरी';
      icon = '🌧️';
      adviceEn = 'Enjoy indoor museums, wadas & piping hot Misal';
      adviceMr = 'वाडे, वस्तुसंग्रहालये पहा आणि गरमागरम मिसळचा आनंद घ्या';
    }

    return NextResponse.json(
      {
        temp: Math.round(cur.temperature_2m ?? 28),
        humidity: cur.relative_humidity_2m ?? 48,
        windSpeed: Math.round(cur.wind_speed_10m ?? 8),
        conditionEn,
        conditionMr,
        icon,
        adviceEn,
        adviceMr,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error) {
    console.warn('[Weather API] Error fetching Open-Meteo, using fallback:', error);
    return NextResponse.json(FALLBACK_WEATHER);
  }
}
