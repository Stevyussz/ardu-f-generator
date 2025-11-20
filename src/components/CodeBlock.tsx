import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  title: string;
  code: string;
  language?: string;
}

export function CodeBlock({ title, code, language = "cpp" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Berhasil disalin!",
        description: `Fungsi ${title} telah disalin ke clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Gagal menyalin",
        description: "Silakan coba lagi",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden" data-testid={`code-block-${title}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base font-semibold font-mono">{title}</CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCopy}
          data-testid={`button-copy-${title}`}
          className="h-8"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="ml-2 text-xs">{copied ? "Tersalin" : "Salin"}</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <pre className="overflow-x-auto bg-muted/50 p-4 text-sm font-mono leading-relaxed">
            <code className="text-foreground">{code}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
