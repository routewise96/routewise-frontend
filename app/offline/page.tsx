export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold">Нет подключения</h1>
      <p className="text-muted-foreground">
        Проверьте интернет-соединение и обновите страницу.
      </p>
    </div>
  )
}
