import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { functionTypes, type FunctionType } from "@shared/schema";
import { Code2 } from "lucide-react";

interface FunctionSelectorProps {
  value: FunctionType;
  onChange: (value: FunctionType) => void;
}

const functionLabels: Record<FunctionType, string> = {
  scanx: "scanx() - Deteksi Perempatan/Pertigaan",
  maju_cari_garis: "maju_cari_garis() - Maju Sampai Ketemu Garis",
  belok_kanan_garis: "belok_kanan_garis() - Belok Kanan 90°",
  belok_kiri_garis: "belok_kiri_garis() - Belok Kiri 90°",
  deteksi_pertigaan_kanan: "deteksi_pertigaan_kanan() - Cek Pertigaan Kanan",
  deteksi_pertigaan_kiri: "deteksi_pertigaan_kiri() - Cek Pertigaan Kiri",
  deteksi_perempatan: "deteksi_perempatan() - Cek Perempatan",
  jalan_grid: "jalan_grid() - Jalan Sejumlah Grid",
  all: "Semua Fungsi",
};

export function FunctionSelector({ value, onChange }: FunctionSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Code2 className="h-5 w-5" />
          Pilih Fungsi
        </CardTitle>
        <CardDescription>Fungsi line tracer yang akan di-generate</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger data-testid="select-function-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {functionTypes.map((type) => (
              <SelectItem key={type} value={type} data-testid={`option-${type}`}>
                {functionLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
