import { LoaderIcon } from "lucide-react"
function PageLoader() {
  return (
    <div className="bg-slate-900 flex items-center justify-center h-screen">
        <LoaderIcon className="size-10 animate-spin"/>
    </div>
  )
}

export default PageLoader