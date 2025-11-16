export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">CTI-IDS Framework</h1>
            <p className="text-muted-foreground mt-2">Cyber Threat Intelligence & Intrusion Detection System</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Powered by BERT, LSTM & CNN</p>
          </div>
        </div>
      </div>
    </header>
  )
}
