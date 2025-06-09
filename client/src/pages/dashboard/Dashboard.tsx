import Reserved from "@/components/dashboard/Reserved";
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
  const cardStyles = "h-88 max-h-88 overflow-y-auto";
  return (
    <div className="flex w-[80%] mx-auto mt-6 flex-col gap-6">
      <Tabs defaultValue="myTurns">
        <TabsList className="ml-auto flex-row-reverse">
          <TabsTrigger value="myTurns">نوبت های من</TabsTrigger>
          <TabsTrigger value="soon">Soon</TabsTrigger>
          <TabsTrigger value="nothing">فعلا هیچی</TabsTrigger>
        </TabsList>
        <TabsContent value="myTurns">
          <Card className={cardStyles}>
            <CardHeader>
              <CardTitle>نوبت های من</CardTitle>
              <CardDescription>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ab
                sapiente expedita quasi.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <Reserved />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="soon">
          <Card className={cardStyles}>
            <CardHeader>
              <CardTitle>soon</CardTitle>
              <CardDescription>
                <p className="mb-8 p-8">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Nesciunt quae tempora aut exercitationem, voluptatibus
                  doloremque odio magnam harum corrupti, ratione quasi cum
                  recusandae cupiditate vero voluptatum praesentium neque
                  suscipit nulla at minima. Ea, quasi?
                </p>
                <p className="mb-8 p-8">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Perferendis, dignissimos corrupti reiciendis dolorum totam
                  assumenda esse rem facilis delectus quos? Reprehenderit
                  doloremque officia quis nihil. Repellendus voluptatum modi
                  odio est, ipsum at natus. Dolores, nisi. Nihil praesentium
                  fuga, dolores magni dolore hic perferendis eos, ipsam vel quod
                  aut possimus id! Aut cum laboriosam fugiat quas quis?
                </p>
                <p className="mb-8 p-8">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam
                  inventore obcaecati repudiandae reprehenderit nemo alias sit
                  ab quas eaque aperiam asperiores, aut consequuntur veritatis,
                  in nulla voluptate! Voluptas, voluptatibus minima! Fuga, illo
                  id? Officia nam unde vitae quia aliquam dolorem minima
                  similique velit ipsum. Nesciunt quos cumque provident tempore,
                  deleniti ab obcaecati pariatur commodi, perferendis laboriosam
                  eaque vel eveniet velit nam praesentium doloremque sequi
                  corrupti impedit ut quaerat nemo magnam. Tempora cupiditate
                  similique ducimus reprehenderit incidunt. Similique sunt sit
                  maiores iure dolorum architecto, ipsa vitae odit dignissimos
                  provident cumque dicta pariatur saepe expedita reprehenderit
                  fugiat, adipisci dolores distinctio beatae deserunt quia
                  consequuntur doloribus. Sit consectetur cum minima laboriosam
                  numquam ad, voluptatibus ex quaerat dolorem reprehenderit a
                  vero earum nisi tempora repellendus eaque recusandae.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">soon</CardContent>
            <CardFooter>
              <Button>کلیک کنید</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="nothing">
          <Card className={cardStyles}>
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
