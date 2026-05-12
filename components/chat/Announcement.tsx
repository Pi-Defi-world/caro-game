import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Megaphone } from "lucide-react"

export default function Announcement() {
  return (
    <Alert className="mb-2 z-50">
      <Megaphone className="h-5 w-5 text-yellow-500 mr-2" />
      {/* <p className="mr-2">Soleil</p> */}
      <AlertTitle>Announcement</AlertTitle>
      <AlertDescription>
        Moderators wanted! Apply now to help manage the chat and earn DAO rewards.
      </AlertDescription>
    </Alert>
  )
} 