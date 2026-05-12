import BackNav from "@/components/me/BackNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen  text-white ">
      <BackNav link="/me" title="Terms and conditions"/>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <h2 className="text-xl text-white mt-6">Platform Rules</h2>
            <p className="text-slate-400">
              Users must follow fair play guidelines. Any form of cheating or exploitation will result in account suspension.
            </p>

            <h2 className="text-xl text-white mt-6">Rewards and Payments</h2>
            <p className="text-slate-400">
              All rewards are distributed in Pi tokens. Winners receive rewards automatically after successful game completion.
            </p>

            <h2 className="text-xl text-white mt-6">User Conduct</h2>
            <p className="text-slate-400">
              Users must maintain respectful behavior towards other players. Harassment or abusive behavior will not be tolerated.
            </p>

            <h2 className="text-xl text-white mt-6">Platform Changes</h2>
            <p className="text-slate-400">
              We reserve the right to modify platform features, reward structures, and these terms of service with appropriate notice to users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

