import type { ParameterConfig, FunctionType, GeneratedFunction } from "@shared/schema";

export class ArduinoCodeGenerator {
  private config: ParameterConfig;

  constructor(config: ParameterConfig) {
    this.config = config;
  }

  generateScanx(): GeneratedFunction {
    const code = `void scanx(unsigned char jum, unsigned char kec) {
  // Hitung perempatan/pertigaan dan berhenti setelah sejumlah yang ditentukan
  unsigned char count = 0;
  unsigned long lastDetectTime = 0;
  bool wasDetected = false;
  
  while(count < jum) {
    read_sensor();
    
    // Hitung jumlah sensor aktif
    int activeSensors = 0;
    for(int i = 0; i < 10; i++) {
      if(data_sensor[i] < (sens[i] * 4)) {
        activeSensors++;
      }
    }
    
    // Deteksi perempatan atau pertigaan
    bool currentlyDetected = false;
    if(activeSensors >= ${this.config.jumlahSensorPerempatan}) {
      currentlyDetected = true; // Perempatan
    } else if(activeSensors >= ${this.config.jumlahSensorPertigaan}) {
      currentlyDetected = true; // Pertigaan
    }
    
    // Increment counter saat transisi dari tidak terdeteksi ke terdeteksi
    if(currentlyDetected && !wasDetected) {
      if(millis() - lastDetectTime > 300) { // Debouncing 300ms
        count++;
        lastDetectTime = millis();
      }
    }
    
    wasDetected = currentlyDetected;
    
    // Jalan dengan PID
    if(count < jum) {
      pid(kec);
    }
  }
  
  // Berhenti setelah mencapai target
  stopped();
  delay(${this.config.delayStabilisasi});
}`;

    return {
      functionType: "scanx",
      code,
      documentation: "Menghitung dan berhenti di perempatan/pertigaan ke-N",
      parameters: this.config,
      estimatedExecutionTime: 1000, // Variable, depends on track
    };
  }

  generateMajuCariGaris(): GeneratedFunction {
    const code = `void maju_cari_garis(unsigned char kec) {
  // Maju lurus sampai sensor tengah mendeteksi garis
  unsigned long startTime = millis();
  bool garisKetemu = false;
  
  while(!garisKetemu && (millis() - startTime < ${this.config.timeoutCarigaris})) {
    sensing();
    
    // Cek sensor tengah (${this.config.sensorKonfirmasiTengah.join(' atau ')})
    bool sensorTengahAktif = false;
${this.config.sensorKonfirmasiTengah.map(s => 
  `    if(data_sensor[${s}] < (sens[${s}] * 4)) sensorTengahAktif = true;`
).join('\n')}
    
    if(sensorTengahAktif) {
      garisKetemu = true;
    } else {
      // Maju lurus tanpa koreksi
      maju(kec, kec);
      delay(10); // Small delay untuk sensor refresh
    }
  }
  
  // Berhenti dan stabilisasi
  stopped();
  delay(${this.config.delayStabilisasi});
  
  // Jika timeout dan garis tidak ketemu, coba recovery dengan PID
  if(!garisKetemu) {
    // Recovery: coba ikuti garis dengan PID kecepatan rendah
    for(int i = 0; i < 20; i++) {
      read_sensor();
      if(xsensor != 0) {
        // Garis ketemu dengan PID, break
        break;
      }
      pid(kec / 2);
    }
    // Pastikan robot berhenti setelah recovery attempt
    stopped();
    delay(${this.config.delayStabilisasi});
  }
}`;

    return {
      functionType: "maju_cari_garis",
      code,
      documentation: "Maju sampai sensor tengah mendeteksi garis",
      parameters: this.config,
      estimatedExecutionTime: this.config.timeoutCarigaris,
    };
  }

  generateBelokKananGaris(): GeneratedFunction {
    // Calculate precise turn duration based on accuracy mode
    const baseDuration = this.config.delayBelok;
    let preciseDuration = this.config.accuracyMode === "presisi" 
      ? baseDuration + 50 
      : this.config.accuracyMode === "cepat" 
        ? baseDuration - 30 
        : baseDuration;
    
    // Clamp to prevent negative/zero delays
    preciseDuration = Math.max(10, preciseDuration);
    
    const majuKeluar = Math.max(50, Math.round(this.config.kecepatan * 0.7));
    const delayKeluar = Math.max(10, Math.round(this.config.delayBelok * 0.3));
    const timeoutCari = Math.max(200, Math.round(this.config.timeoutCarigaris / 2));
    const delayFineAdjust = Math.max(5, Math.round(this.config.delayBelok * 0.1));

    const code = `void belok_kanan_garis(unsigned char kec_belok) {
  // BELOK KANAN 90 DERAJAT - PRESISI TINGGI
  
  // Fase 1: Maju sedikit untuk memastikan robot keluar dari perempatan
  maju(${majuKeluar}, ${majuKeluar});
  delay(${delayKeluar});
  
  // Fase 2: Eksekusi belok kanan dengan mechanum
  belka(kec_belok, kec_belok);
  delay(${preciseDuration});
  
  // Fase 3: Stabilisasi posisi
  stopped();
  delay(${this.config.delayStabilisasi});
  
  // Fase 4: Cari garis dengan sensor tengah
  unsigned long timeoutStart = millis();
  bool garisKetemu = false;
  
  while(!garisKetemu && (millis() - timeoutStart < ${timeoutCari})) {
    sensing();
    
    // Verifikasi sensor tengah mendeteksi garis
    int sensorTengahAktif = 0;
${this.config.sensorKonfirmasiTengah.map(s => 
  `    if(data_sensor[${s}] < (sens[${s}] * 4)) sensorTengahAktif++;`
).join('\n')}
    
    if(sensorTengahAktif >= 1) {
      garisKetemu = true;
    } else {
      // Fine adjustment: belok sedikit lagi jika belum ketemu garis
      // Gunakan uint16_t untuk hindari overflow, lalu cast ke unsigned char
      const unsigned char kec_adjust = ((uint16_t)kec_belok * 3) / 5;
      if(kec_adjust > 0) {
        belka(kec_adjust, kec_adjust);
        delay(${delayFineAdjust});
        stopped();
        delay(${Math.round(this.config.delayStabilisasi / 2)}); // Mini stabilisasi
      }
    }
  }
  
  // Fase 5: Final stabilisasi
  stopped();
  delay(${this.config.delayStabilisasi});
}`;

    return {
      functionType: "belok_kanan_garis",
      code,
      documentation: "Belok kanan 90° dengan presisi tinggi menggunakan mechanum",
      parameters: this.config,
      estimatedExecutionTime: preciseDuration + this.config.delayStabilisasi * 2 + timeoutCari,
    };
  }

  generateBelokKiriGaris(): GeneratedFunction {
    const baseDuration = this.config.delayBelok;
    let preciseDuration = this.config.accuracyMode === "presisi" 
      ? baseDuration + 50 
      : this.config.accuracyMode === "cepat" 
        ? baseDuration - 30 
        : baseDuration;
    
    // Clamp to prevent negative/zero delays
    preciseDuration = Math.max(10, preciseDuration);
    
    const majuKeluar = Math.max(50, Math.round(this.config.kecepatan * 0.7));
    const delayKeluar = Math.max(10, Math.round(this.config.delayBelok * 0.3));
    const timeoutCari = Math.max(200, Math.round(this.config.timeoutCarigaris / 2));
    const delayFineAdjust = Math.max(5, Math.round(this.config.delayBelok * 0.1));

    const code = `void belok_kiri_garis(unsigned char kec_belok) {
  // BELOK KIRI 90 DERAJAT - PRESISI TINGGI
  
  // Fase 1: Maju sedikit untuk memastikan robot keluar dari perempatan
  maju(${majuKeluar}, ${majuKeluar});
  delay(${delayKeluar});
  
  // Fase 2: Eksekusi belok kiri dengan mechanum
  belki(kec_belok, kec_belok);
  delay(${preciseDuration});
  
  // Fase 3: Stabilisasi posisi
  stopped();
  delay(${this.config.delayStabilisasi});
  
  // Fase 4: Cari garis dengan sensor tengah
  unsigned long timeoutStart = millis();
  bool garisKetemu = false;
  
  while(!garisKetemu && (millis() - timeoutStart < ${timeoutCari})) {
    sensing();
    
    // Verifikasi sensor tengah mendeteksi garis
    int sensorTengahAktif = 0;
${this.config.sensorKonfirmasiTengah.map(s => 
  `    if(data_sensor[${s}] < (sens[${s}] * 4)) sensorTengahAktif++;`
).join('\n')}
    
    if(sensorTengahAktif >= 1) {
      garisKetemu = true;
    } else {
      // Fine adjustment: belok sedikit lagi jika belum ketemu garis
      // Gunakan uint16_t untuk hindari overflow, lalu cast ke unsigned char
      const unsigned char kec_adjust = ((uint16_t)kec_belok * 3) / 5;
      if(kec_adjust > 0) {
        belki(kec_adjust, kec_adjust);
        delay(${delayFineAdjust});
        stopped();
        delay(${Math.round(this.config.delayStabilisasi / 2)}); // Mini stabilisasi
      }
    }
  }
  
  // Fase 5: Final stabilisasi
  stopped();
  delay(${this.config.delayStabilisasi});
}`;

    return {
      functionType: "belok_kiri_garis",
      code,
      documentation: "Belok kiri 90° dengan presisi tinggi menggunakan mechanum",
      parameters: this.config,
      estimatedExecutionTime: preciseDuration + this.config.delayStabilisasi * 2 + timeoutCari,
    };
  }

  generateDeteksiPertigaanKanan(): GeneratedFunction {
    const code = `bool deteksi_pertigaan_kanan() {
  // Deteksi pertigaan di sebelah kanan
  read_sensor();
  
  // Hitung sensor kanan yang aktif (sensor 6-9)
  int sensorKananAktif = 0;
  for(int i = 6; i <= 9; i++) {
    if(data_sensor[i] < (sens[i] * 4)) {
      sensorKananAktif++;
    }
  }
  
  // Pertigaan kanan terdeteksi jika >= threshold
  if(sensorKananAktif >= ${Math.max(3, this.config.jumlahSensorPertigaan - 2)}) {
    return true;
  }
  
  return false;
}`;

    return {
      functionType: "deteksi_pertigaan_kanan",
      code,
      documentation: "Return true jika ada pertigaan di kanan",
      parameters: this.config,
      estimatedExecutionTime: 5,
    };
  }

  generateDeteksiPertigaanKiri(): GeneratedFunction {
    const code = `bool deteksi_pertigaan_kiri() {
  // Deteksi pertigaan di sebelah kiri
  read_sensor();
  
  // Hitung sensor kiri yang aktif (sensor 0-3)
  int sensorKiriAktif = 0;
  for(int i = 0; i <= 3; i++) {
    if(data_sensor[i] < (sens[i] * 4)) {
      sensorKiriAktif++;
    }
  }
  
  // Pertigaan kiri terdeteksi jika >= threshold
  if(sensorKiriAktif >= ${Math.max(3, this.config.jumlahSensorPertigaan - 2)}) {
    return true;
  }
  
  return false;
}`;

    return {
      functionType: "deteksi_pertigaan_kiri",
      code,
      documentation: "Return true jika ada pertigaan di kiri",
      parameters: this.config,
      estimatedExecutionTime: 5,
    };
  }

  generateDeteksiPerempatan(): GeneratedFunction {
    const code = `bool deteksi_perempatan() {
  // Deteksi perempatan (hampir semua sensor aktif)
  read_sensor();
  
  // Hitung total sensor aktif
  int totalSensorAktif = 0;
  for(int i = 0; i < 10; i++) {
    if(data_sensor[i] < (sens[i] * 4)) {
      totalSensorAktif++;
    }
  }
  
  // Perempatan terdeteksi jika >= threshold
  if(totalSensorAktif >= ${this.config.jumlahSensorPerempatan}) {
    return true;
  }
  
  return false;
}`;

    return {
      functionType: "deteksi_perempatan",
      code,
      documentation: "Return true jika berada di perempatan",
      parameters: this.config,
      estimatedExecutionTime: 5,
    };
  }

  generateJalanGrid(): GeneratedFunction {
    const code = `void jalan_grid(unsigned char jum_grid, unsigned char kec) {
  // Jalan sejumlah grid dengan mengikuti garis
  unsigned char gridCount = 0;
  unsigned long lastGridTime = 0;
  bool wasAtGrid = false;
  
  while(gridCount < jum_grid) {
    bool atGrid = deteksi_perempatan();
    
    // Increment saat melewati grid baru
    if(atGrid && !wasAtGrid) {
      if(millis() - lastGridTime > 500) { // Debouncing
        gridCount++;
        lastGridTime = millis();
        
        // Maju sedikit untuk keluar dari grid saat ini
        if(gridCount < jum_grid) {
          maju(kec, kec);
          delay(${Math.round(this.config.delayBelok * 0.5)});
        }
      }
    }
    
    wasAtGrid = atGrid;
    
    // Ikuti garis dengan PID
    if(gridCount < jum_grid) {
      pid(kec);
    }
  }
  
  // Berhenti setelah mencapai grid terakhir
  stopped();
  delay(${this.config.delayStabilisasi});
}`;

    return {
      functionType: "jalan_grid",
      code,
      documentation: "Jalan sejumlah grid/kotak tertentu",
      parameters: this.config,
      estimatedExecutionTime: 2000, // Variable
    };
  }

  generateAll(): GeneratedFunction[] {
    return [
      this.generateScanx(),
      this.generateMajuCariGaris(),
      this.generateBelokKananGaris(),
      this.generateBelokKiriGaris(),
      this.generateDeteksiPertigaanKanan(),
      this.generateDeteksiPertigaanKiri(),
      this.generateDeteksiPerempatan(),
      this.generateJalanGrid(),
    ];
  }

  generateByType(type: FunctionType): GeneratedFunction | GeneratedFunction[] {
    switch (type) {
      case "scanx":
        return this.generateScanx();
      case "maju_cari_garis":
        return this.generateMajuCariGaris();
      case "belok_kanan_garis":
        return this.generateBelokKananGaris();
      case "belok_kiri_garis":
        return this.generateBelokKiriGaris();
      case "deteksi_pertigaan_kanan":
        return this.generateDeteksiPertigaanKanan();
      case "deteksi_pertigaan_kiri":
        return this.generateDeteksiPertigaanKiri();
      case "deteksi_perempatan":
        return this.generateDeteksiPerempatan();
      case "jalan_grid":
        return this.generateJalanGrid();
      case "all":
        return this.generateAll();
      default:
        throw new Error(`Unknown function type: ${type}`);
    }
  }
}
