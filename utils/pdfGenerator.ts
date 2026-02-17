import jsPDF from 'jspdf';

interface ContractData {
    orderNumber: string;
    date: string;
    buyerName: string;
    buyerEmail: string;
    buyerAddress: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
}

// Fetch and register a Unicode-capable font (Roboto) for Turkish character support
async function loadTurkishFont(doc: jsPDF): Promise<void> {
    try {
        const response = await fetch(
            'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf'
        );
        const fontBuffer = await response.arrayBuffer();

        // Convert ArrayBuffer to base64 string
        const uint8Array = new Uint8Array(fontBuffer);
        let binary = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const fontBase64 = btoa(binary);

        // Register font with jsPDF
        doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');
    } catch (err) {
        console.warn('Roboto font yüklenemedi, varsayılan font kullanılıyor:', err);
        // Fallback to helvetica (no Turkish chars but at least works)
    }
}

export const generateDistanceSalesAgreement = async (data: ContractData) => {
    const doc = new jsPDF();

    // Load Turkish-compatible font
    await loadTurkishFont(doc);

    const lineHeight = 7;
    let y = 20;

    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        // Roboto only has 'normal' registered; use bold simulation for headers
        if (isBold) {
            doc.setFont('Roboto', 'normal');
            // Simulate bold with slightly larger font
            doc.setFontSize(fontSize + 1);
        } else {
            doc.setFont('Roboto', 'normal');
        }

        const splitText = doc.splitTextToSize(text, 170);
        doc.text(splitText, 20, y);
        y += splitText.length * lineHeight;

        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    };

    // Title
    addText('MESAFELİ SATIŞ SÖZLEŞMESİ', 16, true);
    y += 5;

    // 1. Taraflar
    addText('MADDE 1 - TARAFLAR', 12, true);
    addText('1.1. SATICI:');
    addText('Ünvan: TinyDreams Bebek Ürünleri');
    addText('Adres: Örnek Mah. Bebek Cad. No:1 İstanbul');
    addText('E-posta: info@tinydreams.com');
    y += 5;

    addText('1.2. ALICI:');
    addText(`Ad Soyad: ${data.buyerName}`);
    addText(`Adres: ${data.buyerAddress}`);
    addText(`E-posta: ${data.buyerEmail}`);
    y += 5;

    // 2. Konu
    addText('MADDE 2 - KONU', 12, true);
    addText('İşbu sözleşmenin konusu, ALICI\'nın SATICI\'ya ait internet sitesinden elektronik ortamda siparişini yaptığı aşağıda nitelikleri ve satış fiyatı belirtilen ürünün satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.');
    y += 5;

    // 3. Sözleşme Konusu Ürün
    addText('MADDE 3 - SÖZLEŞME KONUSU ÜRÜN', 12, true);
    addText(`Tarih: ${data.date}`);
    addText(`Sipariş No: ${data.orderNumber}`);
    y += 5;

    // Tablo Başlığı
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(11);
    doc.text('Ürün Adı', 20, y);
    doc.text('Adet', 120, y);
    doc.text('Fiyat', 150, y);
    y += 7;
    doc.line(20, y - 5, 190, y - 5);

    // Tablo İçeriği
    doc.setFontSize(10);
    data.items.forEach(item => {
        const title = doc.splitTextToSize(item.name, 90);
        doc.text(title, 20, y);
        doc.text(item.quantity.toString(), 125, y);
        doc.text(`${item.price.toFixed(2)} TL`, 150, y);
        y += Math.max(7, title.length * 5);
    });

    y += 5;
    doc.setFontSize(11);
    doc.text(`TOPLAM TUTAR: ${data.totalAmount.toFixed(2)} TL`, 130, y);
    y += 15;

    // 4. Genel Hükümler
    addText('MADDE 4 - GENEL HÜKÜMLER', 12, true);
    addText('4.1. ALICI, internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.');
    addText('4.2. Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI\'nın yerleşim yerinin uzaklığına bağlı olarak internet sitesinde ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.');
    y += 5;

    // 5. Cayma Hakkı
    addText('MADDE 5 - CAYMA HAKKI', 12, true);
    addText('ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 gün içinde cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde SATICI\'ya faks, e-posta veya telefon ile bildirimde bulunulması ve ürünün kullanılmamış olması şarttır.');
    y += 5;

    // 6. Temerrüt Hali ve Hukuki Sonuçları
    addText('MADDE 6 - GENEL HÜKÜMLER', 12, true);
    addText('İşbu sözleşmeden doğan uyuşmazlıklarda, Türkiye Cumhuriyeti kanunları uygulanır. Tüketici şikâyetleri için Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.');
    y += 10;

    // İmzalar
    addText('SATICI', 10, true);
    doc.text('TinyDreams Bebek Ürünleri', 20, y + 5);

    doc.text('ALICI', 120, y);
    doc.text(data.buyerName, 120, y + 5);

    // Kaydet
    doc.save(`Mesafeli_Satis_Sozlesmesi_${data.orderNumber}.pdf`);
};
