export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-muted-foreground">Content 1</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-muted-foreground">Content 2</p>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">
          <p className="text-muted-foreground">Content 3</p>
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to Home</h2>
          <p className="text-muted-foreground">Select a menu item from the sidebar</p>
        </div>
      </div>
    </div>
  )
}
