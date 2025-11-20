import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FunctionSelector } from "@/components/FunctionSelector";
import { ParameterForm } from "@/components/ParameterForm";
import { CodeBlock } from "@/components/CodeBlock";
import { FunctionDocumentation } from "@/components/FunctionDocumentation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import type { FunctionType, ParameterConfig, GeneratedFunction } from "@shared/schema";
import { Code2, Copy, Check, Clock } from "lucide-react";

export default function Home() {
  const [selectedFunction, setSelectedFunction] = useState<FunctionType>("all");
  const [generatedFunctions, setGeneratedFunctions] = useState<GeneratedFunction[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async (params: ParameterConfig) => {
      const response = await apiRequest("POST", "/api/generate", {
        functionType: selectedFunction,
        parameters: params,
      });
      return await response.json() as GeneratedFunction[];
    },
    onSuccess: (data) => {
      // Debug logging
      console.log('Received data from API:', data);
      console.log('Is array?', Array.isArray(data));
      
      // Ensure data is always an array
      const functionsArray = Array.isArray(data) ? data : [data];
      console.log('Functions array:', functionsArray);
      console.log('Function types:', functionsArray.map(f => f?.functionType));
      
      setGeneratedFunctions(functionsArray);
      toast({
        title: "Fungsi berhasil di-generate!",
        description: `${functionsArray.length} fungsi siap digunakan`,
      });
    },
    onError: () => {
      toast({
        title: "Gagal generate fungsi",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    },
  });

  const handleCopyAll = async () => {
    const allCode = generatedFunctions.map(fn => fn.code).join("\n\n");
    try {
      await navigator.clipboard.writeText(allCode);
      setCopiedAll(true);
      toast({
        title: "Semua fungsi berhasil disalin!",
        description: "Silakan paste ke kode Arduino Anda",
      });
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      toast({
        title: "Gagal menyalin",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  const totalEstimatedTime = Array.isArray(generatedFunctions) 
    ? generatedFunctions.reduce(
        (sum, fn) => sum + (fn.estimatedExecutionTime || 0),
        0
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="m-auto container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Function Line Tracer Generator</h1><span className="text-sm text-muted-foreground">By Stevyuss</span>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            Robot Mechanum • 10 Sensor V0.1
          </div>
        </div>
      </header>

      <div className="m-auto container py-6">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Left Sidebar - Controls */}
          <div className="space-y-6">
            <FunctionSelector value={selectedFunction} onChange={setSelectedFunction} />
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ParameterForm
                onSubmit={(data) => generateMutation.mutate(data)}
                isPending={generateMutation.isPending}
              />
            </ScrollArea>
          </div>

          {/* Main Content - Generated Code */}
          <div className="space-y-6">
            {generatedFunctions.length === 0 ? (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-center text-muted-foreground">
                    Belum Ada Fungsi yang Di-generate
                  </CardTitle>
                  <CardDescription className="text-center">
                    Pilih fungsi dan atur parameter, lalu klik "Generate Fungsi"
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-12">
                  <Code2 className="h-24 w-24 text-muted-foreground/20" />
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Fungsi Ter-generate</CardTitle>
                        <CardDescription>
                          {generatedFunctions.length} fungsi siap digunakan
                        </CardDescription>
                      </div>
                      <Button
                        onClick={handleCopyAll}
                        data-testid="button-copy-all"
                        className="gap-2"
                      >
                        {copiedAll ? (
                          <>
                            <Check className="h-4 w-4" />
                            Tersalin
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Salin Semua
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {totalEstimatedTime > 0 && (
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Estimasi total waktu eksekusi: ~{totalEstimatedTime}ms</span>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Generated Functions */}
                <div className="space-y-4" data-testid="generated-functions-container">
                  {generatedFunctions.map((fn, index) => (
                    <CodeBlock
                      key={index}
                      title={fn.functionType}
                      code={fn.code}
                    />
                  ))}
                </div>

                <Separator />

                {/* Documentation */}
                <FunctionDocumentation functionType={selectedFunction} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
