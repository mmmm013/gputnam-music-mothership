export default function BlockedPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
      
      {/* GPM SEAL */}
      <img src="/gpm_logo.jpg" alt="G Putnam Music" className="h-20 mb-8 opacity-80" />

      <div className="max-w-2xl space-y-12 border border-gray-800 p-10 rounded-xl bg-gray-900/50">
        
        {/* ENGLISH (Official) */}
        <div>
          <h1 className="text-2xl font-bold text-gold-400 mb-2">Service Unavailable</h1>
          <p className="text-gray-400">
            Due to United States export regulations and international trade laws, 
            G Putnam Music services are not currently available in your region. 
            We apologize for the inconvenience.
          </p>
        </div>

        {/* RUSSIAN (Russia) */}
        <div lang="ru">
          <h2 className="text-lg font-semibold text-white mb-1">Сервис недоступен</h2>
          <p className="text-gray-500 text-sm">
            В связи с экспортными правилами США и законами о международной торговле, 
            услуги G Putnam Music в настоящее время недоступны в вашем регионе.
          </p>
        </div>

        {/* SPANISH (Cuba) */}
        <div lang="es">
          <h2 className="text-lg font-semibold text-white mb-1">Servicio No Disponible</h2>
          <p className="text-gray-500 text-sm">
            Debido a las regulaciones de exportación de Estados Unidos, 
            los servicios de G Putnam Music no están disponibles actualmente en su región.
          </p>
        </div>

        {/* ARABIC (Syria) */}
        <div lang="ar" dir="rtl">
          <h2 className="text-lg font-semibold text-white mb-1">الخدمة غير متوفرة</h2>
          <p className="text-gray-500 text-sm">
            نظراً للوائح التصدير الأمريكية وقوانين التجارة الدولية، خدمات G Putnam Music غير متوفرة حالياً في منطقتكم.
          </p>
        </div>

        {/* PERSIAN (Iran) */}
        <div lang="fa" dir="rtl">
          <h2 className="text-lg font-semibold text-white mb-1">سرویس در دسترس نیست</h2>
          <p className="text-gray-500 text-sm">
            به دلیل مقررات صادرات ایالات متحده، خدمات G Putnam Music در حال حاضر در منطقه شما در دسترس نیست.
          </p>
        </div>

        {/* KOREAN (North Korea) */}
        <div lang="ko">
          <h2 className="text-lg font-semibold text-white mb-1">서비스를 사용할 수 없습니다</h2>
          <p className="text-gray-500 text-sm">
            미국 수출 규정 및 국제 무역법에 따라 현재 귀하의 지역에서는 G Putnam Music 서비스를 이용할 수 없습니다.
          </p>
        </div>

      </div>
      
      <p className="mt-8 text-xs text-gray-700 uppercase tracking-widest">
        Compliance ID: OFAC-GEO-BLOCK-2026
      </p>
    </div>
  )
}
