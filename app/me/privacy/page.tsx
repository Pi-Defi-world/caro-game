import BackNav from "@/components/me/BackNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-white ">
      <BackNav link="/me" title="Privacy"/>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <h2 className="text-xl text-white mt-6">Data Collection</h2>
            <p className="text-slate-400">
              We collect minimal personal information necessary for platform functionality, including your Pi Network wallet address and email for notifications.
            </p>

            <h2 className="text-xl text-white mt-6">Data Usage</h2>
            <p className="text-slate-400">
              Your data is used solely for gaming purposes, including matchmaking, reward distribution, and optional email notifications.
            </p>

            <h2 className="text-xl text-white mt-6">Data Protection</h2>
            <p className="text-slate-400">
              We implement industry-standard security measures to protect your personal information and gaming data on our platform.
            </p>

            <h2 className="text-xl text-white mt-6">Your Rights</h2>
            <p className="text-slate-400">
              You have the right to access, modify, or delete your personal data. Contact our support team to exercise these rights.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

