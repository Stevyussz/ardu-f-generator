import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Info, Code, Lightbulb } from "lucide-react";
import type { FunctionType } from "@shared/schema";

interface FunctionDocumentationProps {
  functionType: FunctionType;
}

const documentationData: Record<FunctionType, {
  description: string;
  usage: string;
  example: string;
  notes: string[];
}> = {
  scanx: {
    description: "Fungsi untuk mendeteksi dan menghitung perempatan atau pertigaan. Robot akan berjalan mengikuti garis dan berhenti setelah melewati sejumlah perempatan/pertigaan yang ditentukan.",
    usage: "scanx(jumlah_perempatan, kecepatan);",
    example: "scanx(2, 150); // Berhenti di perempatan ke-2 dengan kecepatan 150",
    notes: [
      "Parameter pertama: jumlah perempatan/pertigaan yang ingin dilewati sebelum berhenti",
      "Parameter kedua: kecepatan robot saat scanning (0-255 PWM)",
      "Fungsi akan otomatis membedakan perempatan (semua sensor aktif) dan pertigaan (sebagian sensor aktif)",
      "Robot akan berhenti tepat setelah melewati perempatan/pertigaan terakhir"
    ]
  },
  maju_cari_garis: {
    description: "Fungsi untuk maju lurus sampai sensor tengah mendeteksi garis. Berguna untuk mencari garis setelah robot keluar dari jalur atau setelah belok.",
    usage: "maju_cari_garis(kecepatan);",
    example: "maju_cari_garis(120); // Maju dengan kecepatan 120 sampai ketemu garis",
    notes: [
      "Robot akan maju lurus tanpa koreksi PID",
      "Berhenti ketika sensor tengah (S4 atau S5) mendeteksi garis",
      "Ada timeout untuk mencegah robot jalan terus jika tidak menemukan garis",
      "Ideal digunakan setelah fungsi belok atau saat robot kehilangan garis"
    ]
  },
  belok_kanan_garis: {
    description: "Fungsi belok kanan 90 derajat dengan presisi tinggi. Robot akan belok menggunakan gerakan mechanum (belka) sampai sensor tengah mendeteksi garis horizontal.",
    usage: "belok_kanan_garis(kecepatan_belok);",
    example: "belok_kanan_garis(120); // Belok kanan dengan kecepatan 120",
    notes: [
      "Menggunakan gerakan belka() untuk belok diagonal kanan",
      "Belok dilakukan dengan durasi tertentu (delayBelok)",
      "Setelah belok, ada delay stabilisasi untuk memastikan posisi akurat",
      "Sensor tengah akan memverifikasi bahwa robot sudah berada di garis yang benar",
      "Parameter kecepatan_belok mempengaruhi kecepatan putaran (lebih tinggi = lebih cepat tapi kurang presisi)"
    ]
  },
  belok_kiri_garis: {
    description: "Fungsi belok kiri 90 derajat dengan presisi tinggi. Robot akan belok menggunakan gerakan mechanum (belki) sampai sensor tengah mendeteksi garis horizontal.",
    usage: "belok_kiri_garis(kecepatan_belok);",
    example: "belok_kiri_garis(120); // Belok kiri dengan kecepatan 120",
    notes: [
      "Menggunakan gerakan belki() untuk belok diagonal kiri",
      "Belok dilakukan dengan durasi tertentu (delayBelok)",
      "Setelah belok, ada delay stabilisasi untuk memastikan posisi akurat",
      "Sensor tengah akan memverifikasi bahwa robot sudah berada di garis yang benar",
      "Parameter kecepatan_belok mempengaruhi kecepatan putaran (lebih tinggi = lebih cepat tapi kurang presisi)"
    ]
  },
  deteksi_pertigaan_kanan: {
    description: "Fungsi untuk mengecek apakah ada pertigaan di sebelah kanan. Mengembalikan true jika terdeteksi pertigaan kanan.",
    usage: "bool ada_pertigaan = deteksi_pertigaan_kanan();",
    example: "if(deteksi_pertigaan_kanan()) { belok_kanan_garis(120); }",
    notes: [
      "Mendeteksi berdasarkan jumlah sensor kanan yang aktif",
      "Tidak menggerakkan robot, hanya mengembalikan status true/false",
      "Berguna untuk decision making dalam strategi navigasi",
      "Threshold sensor bisa disesuaikan via parameter jumlahSensorPertigaan"
    ]
  },
  deteksi_pertigaan_kiri: {
    description: "Fungsi untuk mengecek apakah ada pertigaan di sebelah kiri. Mengembalikan true jika terdeteksi pertigaan kiri.",
    usage: "bool ada_pertigaan = deteksi_pertigaan_kiri();",
    example: "if(deteksi_pertigaan_kiri()) { belok_kiri_garis(120); }",
    notes: [
      "Mendeteksi berdasarkan jumlah sensor kiri yang aktif",
      "Tidak menggerakkan robot, hanya mengembalikan status true/false",
      "Berguna untuk decision making dalam strategi navigasi",
      "Threshold sensor bisa disesuaikan via parameter jumlahSensorPertigaan"
    ]
  },
  deteksi_perempatan: {
    description: "Fungsi untuk mengecek apakah robot berada di perempatan. Mengembalikan true jika hampir semua sensor mendeteksi garis.",
    usage: "bool di_perempatan = deteksi_perempatan();",
    example: "if(deteksi_perempatan()) { stopped(); delay(500); }",
    notes: [
      "Perempatan terdeteksi jika jumlah sensor aktif >= threshold perempatan",
      "Lebih sensitif dibanding deteksi pertigaan",
      "Tidak menggerakkan robot, hanya mengembalikan status",
      "Bisa digunakan untuk menghitung intersection atau membuat keputusan navigasi"
    ]
  },
  jalan_grid: {
    description: "Fungsi untuk berjalan mengikuti garis sejumlah grid/kotak tertentu. Setiap grid dihitung berdasarkan perempatan atau marker yang dilewati.",
    usage: "jalan_grid(jumlah_grid, kecepatan);",
    example: "jalan_grid(3, 150); // Jalan 3 grid dengan kecepatan 150",
    notes: [
      "Menggunakan PID untuk mengikuti garis",
      "Menghitung jumlah perempatan/marker yang dilewati",
      "Berhenti setelah melewati sejumlah grid yang ditentukan",
      "Berguna untuk navigasi berbasis grid pada track lomba"
    ]
  },
  all: {
    description: "Generate semua fungsi line tracer sekaligus dengan parameter yang sama.",
    usage: "Salin semua fungsi ke kode Arduino Anda.",
    example: "// Semua fungsi akan di-generate dengan konfigurasi yang sama",
    notes: [
      "Efisien untuk mendapatkan seluruh library fungsi sekaligus",
      "Semua fungsi menggunakan parameter yang sama dari form",
      "Anda bisa langsung copy-paste semua fungsi ke kode robot"
    ]
  }
};

export function FunctionDocumentation({ functionType }: FunctionDocumentationProps) {
  const doc = documentationData[functionType];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5" />
          Dokumentasi
        </CardTitle>
        <CardDescription>Penjelasan dan cara penggunaan fungsi</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Deskripsi
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {doc.description}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usage">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Cara Pakai
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <code className="block bg-muted p-2 rounded text-xs font-mono">{doc.usage}</code>
                <p className="text-sm text-muted-foreground mt-2">Contoh:</p>
                <code className="block bg-muted p-2 rounded text-xs font-mono">{doc.example}</code>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes">
            <AccordionTrigger className="text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Catatan Penting
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                {doc.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
