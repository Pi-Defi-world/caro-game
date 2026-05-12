import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import BackNav from "@/components/me/BackNav"

export default function HelpPage() {
  return (
    <div className="min-h-screen text-white">
      <BackNav link="/me" title="Help Center"/>
      <div className="max-w-3xl mx-auto">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Help Center</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-white">How do I start playing?</AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  To start playing, connect your Pi Network wallet and browse available games. Choose a game and match with other players to begin competing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-white">How do rewards work?</AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  Winners receive Pi tokens as rewards. The reward amount varies by game and stake level. Rewards are automatically transferred to your Pi wallet after each victory.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-white">Having technical issues?</AccordionTrigger>
                <AccordionContent className="text-slate-400">
                  If you&apos;re experiencing technical issues, try refreshing your browser or clearing your cache. For persistent problems, contact our support team.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
