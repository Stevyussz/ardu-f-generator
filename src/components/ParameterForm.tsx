import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parameterConfigSchema, type ParameterConfig, type AccuracyMode } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Zap, Gauge, Clock } from "lucide-react";

interface ParameterFormProps {
  onSubmit: (data: ParameterConfig) => void;
  isPending?: boolean;
}

export function ParameterForm({ onSubmit, isPending }: ParameterFormProps) {
  const form = useForm<ParameterConfig>({
    resolver: zodResolver(parameterConfigSchema),
    defaultValues: {
      kecepatan: 150,
      kecepatanBelok: 120,
      jumlahSensorPerempatan: 6,
      jumlahSensorPertigaan: 5,
      delayBelok: 100,
      delayStabilisasi: 50,
      timeoutCarigaris: 2000,
      accuracyMode: "normal",
      sensorKonfirmasiTengah: [4, 5],
    },
  });

  const setPreset = (mode: AccuracyMode) => {
    if (mode === "cepat") {
      form.setValue("kecepatan", 180);
      form.setValue("kecepatanBelok", 150);
      form.setValue("delayBelok", 50);
      form.setValue("delayStabilisasi", 20);
      form.setValue("timeoutCarigaris", 1500);
    } else if (mode === "normal") {
      form.setValue("kecepatan", 150);
      form.setValue("kecepatanBelok", 120);
      form.setValue("delayBelok", 100);
      form.setValue("delayStabilisasi", 50);
      form.setValue("timeoutCarigaris", 2000);
    } else if (mode === "presisi") {
      form.setValue("kecepatan", 120);
      form.setValue("kecepatanBelok", 90);
      form.setValue("delayBelok", 150);
      form.setValue("delayStabilisasi", 100);
      form.setValue("timeoutCarigaris", 3000);
    }
    form.setValue("accuracyMode", mode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mode Akurasi</CardTitle>
            <CardDescription>Pilih preset atau sesuaikan manual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={form.watch("accuracyMode") === "cepat" ? "default" : "outline"}
                onClick={() => setPreset("cepat")}
                data-testid="button-preset-cepat"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Zap className="h-4 w-4" />
                <span className="text-xs">Cepat</span>
              </Button>
              <Button
                type="button"
                variant={form.watch("accuracyMode") === "normal" ? "default" : "outline"}
                onClick={() => setPreset("normal")}
                data-testid="button-preset-normal"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Gauge className="h-4 w-4" />
                <span className="text-xs">Normal</span>
              </Button>
              <Button
                type="button"
                variant={form.watch("accuracyMode") === "presisi" ? "default" : "outline"}
                onClick={() => setPreset("presisi")}
                data-testid="button-preset-presisi"
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Clock className="h-4 w-4" />
                <span className="text-xs">Presisi</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kecepatan Motor (PWM)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="kecepatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecepatan Maju</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={255}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        data-testid="slider-kecepatan"
                      />
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-kecepatan"
                        className="w-24"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">0-255 PWM</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kecepatanBelok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecepatan Belok</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={255}
                        step={5}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        data-testid="slider-kecepatan-belok"
                      />
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        data-testid="input-kecepatan-belok"
                        className="w-24"
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">0-255 PWM</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deteksi Sensor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="jumlahSensorPerempatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Sensor Perempatan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-sensor-perempatan"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Minimal sensor aktif untuk deteksi perempatan (3-10)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jumlahSensorPertigaan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Sensor Pertigaan</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-sensor-pertigaan"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Minimal sensor aktif untuk deteksi pertigaan (3-10)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timing & Delay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="delayBelok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Belok (ms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-delay-belok"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Durasi eksekusi belok 90 derajat</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delayStabilisasi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay Stabilisasi (ms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-delay-stabilisasi"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Jeda setelah belok untuk stabilisasi posisi</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeoutCarigaris"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeout Cari Garis (ms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      data-testid="input-timeout-carigaris"
                    />
                  </FormControl>
                  <FormDescription className="text-xs">Batas waktu mencari garis sebelum timeout</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isPending} data-testid="button-generate">
          {isPending ? "Generating..." : "Generate Fungsi"}
        </Button>
      </form>
    </Form>
  );
}
