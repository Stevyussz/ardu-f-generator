import { z } from "zod";

// Function types available
export const functionTypes = [
  "scanx",
  "maju_cari_garis",
  "belok_kanan_garis",
  "belok_kiri_garis",
  "deteksi_pertigaan_kanan",
  "deteksi_pertigaan_kiri",
  "deteksi_perempatan",
  "jalan_grid",
  "all"
] as const;

export type FunctionType = typeof functionTypes[number];

// Accuracy modes
export const accuracyModes = ["cepat", "normal", "presisi"] as const;
export type AccuracyMode = typeof accuracyModes[number];

// Parameter configuration schema
export const parameterConfigSchema = z.object({
  // General parameters
  kecepatan: z.number().min(0).max(255).default(150),
  kecepatanBelok: z.number().min(0).max(255).default(120),
  
  // Sensor thresholds
  jumlahSensorPerempatan: z.number().min(3).max(10).default(6),
  jumlahSensorPertigaan: z.number().min(3).max(10).default(5),
  
  // Timing parameters
  delayBelok: z.number().min(0).max(2000).default(100),
  delayStabilisasi: z.number().min(0).max(500).default(50),
  timeoutCarigaris: z.number().min(100).max(5000).default(2000),
  
  // Accuracy mode
  accuracyMode: z.enum(accuracyModes).default("normal"),
  
  // Sensor confirmation (which sensors should detect line after turn)
  sensorKonfirmasiTengah: z.array(z.number().min(0).max(9)).default([4, 5]),
});

export type ParameterConfig = z.infer<typeof parameterConfigSchema>;

// Generated function schema
export const generatedFunctionSchema = z.object({
  functionType: z.enum(functionTypes),
  code: z.string(),
  documentation: z.string(),
  parameters: parameterConfigSchema,
  estimatedExecutionTime: z.number().optional(),
});

export type GeneratedFunction = z.infer<typeof generatedFunctionSchema>;

// Request to generate functions
export const generateRequestSchema = z.object({
  functionType: z.enum(functionTypes),
  parameters: parameterConfigSchema,
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
