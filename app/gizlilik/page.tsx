import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Çeviriyo",
  description: "Dosyalarınız cihazınızdan çıkmaz. Çeviriyo'nun gizlilik politikası.",
};

const UPDATED = "15 Ağustos 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="tag mb-2">{title}</h2>
      <div className="space-y-3 text-xs leading-relaxed text-[var(--fg-dim)]">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="frame flex items-center justify-between px-3 py-2">
        <span className="text-[11px] text-[var(--fg-faint)]">ceviriyo ~ gizlilik-politikasi</span>
        <span className="text-[11px] text-[var(--fg-faint)]">{UPDATED}</span>
      </div>

      <div className="frame border-t-0 p-[clamp(0.9rem,3.5vmin,1.75rem)]">
        <h1 className="text-[clamp(1.15rem,4.4vmin,1.6rem)] font-bold tracking-tight text-[var(--fg)]">
          Gizlilik <span className="text-[var(--accent)]">Politikası</span>
        </h1>
        <hr className="rule my-5" />
        <div className="border-l-2 border-[var(--accent)] bg-[var(--panel-2)] py-3 pl-3 pr-3">
          <p className="text-xs leading-relaxed text-[var(--fg)]">
            <strong className="text-[var(--accent)]">[ozet]</strong> Yüklediğiniz dosyalar sunucularımıza
            gönderilmez. Tüm dönüştürme işlemleri kendi cihazınızın tarayıcısında yapılır.
            Dosyalarınızı görmüyor, saklamıyor ve kimseyle paylaşmıyoruz.
          </p>
        </div>

        <Section title="Veri sorumlusu">
          <p>
            Bu site, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu
            sıfatıyla <strong className="text-[var(--fg)]">Adem Uçar</strong> tarafından
            işletilmektedir. Her türlü soru ve talebiniz için sayfanın sonundaki iletişim
            adresinden ulaşabilirsiniz.
          </p>
        </Section>

        <Section title="Dosyalarınıza ne oluyor?">
          <p>
            Çeviriyo&apos;daki tüm araçlar (görsel dönüştürme, kırpma, boyutlandırma, sıkıştırma,
            PDF birleştirme, sayfa seçme ve PDF&ndash;görsel dönüşümleri) tamamen tarayıcınızın
            içinde çalışır. Seçtiğiniz dosya internete hiçbir şekilde yüklenmez.
          </p>
          <p>
            İşlem bittiğinde sonuç doğrudan cihazınıza indirilir. Sekmeyi kapattığınızda geriye
            hiçbir veri kalmaz; dosyalarınızın bir kopyası bizde oluşmaz.
          </p>
          <p>
            Bunu kendiniz de doğrulayabilirsiniz: tarayıcınızın geliştirici araçlarındaki
            &quot;Network&quot; sekmesini açıp bir dosya dönüştürün &mdash; dosyanızın gönderildiği
            hiçbir istek göremezsiniz. Hatta internet bağlantınızı kesip de kullanabilirsiniz.
          </p>
        </Section>

        <Section title="Hangi verileri topluyoruz?">
          <p>
            <strong className="text-[var(--fg)]">Biz hiçbir kişisel veri toplamıyoruz.</strong> Sitede
            üyelik, giriş, form veya iletişim alanı bulunmuyor. Adınızı, e-postanızı veya
            dosyalarınızın içeriğini istemiyoruz ve kaydetmiyoruz.
          </p>
          <p>
            Sitede analitik veya izleme aracı (Google Analytics vb.) kullanılmamaktadır.
          </p>
        </Section>

        <Section title="Çerezler">
          <p>
            Çeviriyo çerez kullanmaz. Reklam, izleme veya profilleme amaçlı hiçbir çerez
            yerleştirilmez. Bu nedenle karşınıza çerez onay penceresi çıkmaz.
          </p>
        </Section>

        <Section title="Barındırma ve teknik kayıtlar">
          <p>
            Site, Vercel Inc. (ABD) altyapısı üzerinde barındırılmaktadır. Tüm web sitelerinde
            olduğu gibi, barındırma sağlayıcısı güvenlik ve hizmetin sürekliliği amacıyla teknik
            erişim kayıtları (IP adresi, tarayıcı türü, istek zamanı gibi) tutabilir. Bu kayıtlar
            Vercel tarafından kendi gizlilik politikası kapsamında işlenir.
          </p>
          <p>
            Siteyi ziyaret ettiğinizde bağlantı bilgileriniz teknik olarak yurt dışındaki bu
            sunuculara ulaşır. Ancak <strong className="text-[var(--fg)]">dosyalarınız bu kapsamda
            değildir</strong>: dosyalarınız sunucuya hiçbir zaman gönderilmediği için ne bizim ne
            de barındırma sağlayıcısının erişimine açıktır.
          </p>
          <p>
            Sitede kullanılan yazı tipleri kendi sunucumuzdan sunulmaktadır; bu nedenle üçüncü
            taraf font servislerine (Google Fonts gibi) istek gönderilmez.
          </p>
        </Section>

        <Section title="Üçüncü taraf bağlantıları">
          <p>
            Sitede geliştiriciye ait bir web sitesine bağlantı bulunmaktadır. Bu bağlantıya
            tıkladığınızda ilgili sitenin kendi gizlilik politikası geçerli olur.
          </p>
        </Section>

        <Section title="KVKK kapsamındaki haklarınız">
          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun 11. maddesi uyarınca kişisel
            verilerinizle ilgili bilgi talep etme, düzeltilmesini veya silinmesini isteme
            haklarına sahipsiniz.
          </p>
          <p>
            Uygulamada, tarafımızca saklanan herhangi bir kişisel veriniz bulunmadığı için
            silinecek bir kaydınız da bulunmamaktadır. Yine de her türlü soru ve talebiniz için
            bize ulaşabilirsiniz.
          </p>
        </Section>

        <Section title="Değişiklikler">
          <p>
            Bu politika güncellenirse sayfanın en üstündeki tarih değiştirilir. Sitenin işleyişini
            etkileyen önemli bir değişiklik olursa bunu ayrıca belirtiriz.
          </p>
        </Section>

        <Section title="İletişim">
          <p>
            Gizlilikle ilgili soru ve talepleriniz için bize ulaşabilirsiniz:{" "}
            <a
              href="mailto:ucaradem317@gmail.com"
              className="text-[var(--accent)] hover:underline"
            >
              ucaradem317@gmail.com
            </a>
          </p>
        </Section>
      </div>
    </div>
  );
}
