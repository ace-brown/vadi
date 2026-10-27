import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto mt-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-light text-[#b3b3b3] lg:text-[clamp(1rem,2vw,1.5rem)]">
            Your privacy matters a great deal to us. Please read this policy
            carefully to understand how your information is collected, used and
            protected.
          </p>

          <h2 className="mt-6 text-xl font-semibold">
            1. Information Collection
          </h2>
          <ul className="list-disc pl-6">
            <li>
              We collect your personal information only when you voluntarily
              provide it to us.
            </li>
            <li>
              The information collected may include your name, email, phone
              number and other related details.
            </li>
            <li>
              We use analytics tools such as cookies to improve the user
              experience and analyze user behavior.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">2. Use of Information</h2>
          <ul className="list-disc pl-6">
            <li>
              The information collected may be used to send notifications,
              updates or personalized offers.
            </li>
            <li>
              We use your information to improve service quality, customer
              support and product development.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            3. Sharing of Information
          </h2>
          <ul className="list-disc pl-6">
            <li>
              We will not sell or rent your information to any third party
              without your consent.
            </li>
            <li>
              In some cases we may disclose your information to the relevant
              authorities to comply with legal requirements or at the request of
              legal authorities.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">4. Information Security</h2>
          <ul className="list-disc pl-6">
            <li>
              We use standard security measures to protect your personal
              information.
            </li>
            <li>
              Although no online system is completely secure, we will do our
              best to protect your information.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            5. Access to Your Information
          </h2>
          <ul className="list-disc pl-6">
            <li>
              You have the right to view, correct or request deletion of your
              personal information from the platform.
            </li>
            <li>To do so, please contact our support team.</li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            6. Changes to This Privacy Policy
          </h2>
          <ul className="list-disc pl-6">
            <li>
              This policy may change in the future. Any changes to the privacy
              policy will be clearly announced on this page.
            </li>
            <li>
              Your continued use of the platform after changes are made means
              you accept them.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">7. Contact Us</h2>
          <p className="pl-6">
            If you have questions or concerns about this privacy policy, please
            contact our support team by email or by the phone number listed on
            the website.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
