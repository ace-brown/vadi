import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardPage() {
  return (
    <div className="flex w-[70%] mx-auto mt-6 flex-col gap-6">
      <Tabs defaultValue="myTurns">
        <TabsList className="ml-auto flex-row-reverse">
          <TabsTrigger value="myTurns">نوبت های من</TabsTrigger>
          <TabsTrigger value="soon">Soon</TabsTrigger>
          <TabsTrigger value="nothing">فعلا هیچی</TabsTrigger>
        </TabsList>
        <TabsContent value="myTurns">
          <Card className="min-h-80">
            <CardHeader>
              <CardTitle>نوبت های من</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you&apos;re
                done.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                tempore numquam nam ea, voluptates earum at inventore libero
                quisquam cum quia, ipsum necessitatibus?
              </p>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="soon">
          <Card className="min-h-80">
            <CardHeader>
              <CardTitle>soon</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">soon</CardContent>
            <CardFooter>
              <Button>کلیک کنید</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="nothing">
          <Card className="min-h-80">
            <CardHeader>
              <CardTitle>nothing</CardTitle>
              <CardDescription>
                Change your nothing here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">مفاد</CardContent>
            <CardFooter>
              <Button>کلیک کنید</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
