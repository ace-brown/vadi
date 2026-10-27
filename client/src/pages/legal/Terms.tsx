import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Terms and Conditions of Use</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-light text-[#b3b3b3] lg:text-[clamp(1rem,2vw,1.5rem)]">
            Welcome to our platform! Please read the following terms and
            conditions carefully before using our services. Using this platform
            means you accept all of the terms below.
          </p>

          <h2 className="mt-6 text-xl font-semibold">1. General Terms</h2>
          <ul className="list-disc pl-6">
            <li>
              This platform is designed to provide the tools, resources and
              guidance needed to compare services and make informed choices.
            </li>
            <li>
              Users must use the platform's services only for lawful purposes
              and in accordance with applicable laws.
            </li>
            <li>
              The platform reserves the right to change, update or amend these
              terms and conditions without prior notice.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            2. Registration and User Accounts
          </h2>
          <ul className="list-disc pl-6">
            <li>Some services require registering and creating an account.</li>
            <li>
              Users must provide accurate, complete and up-to-date information.
              Users are responsible for the accuracy of the information they
              enter.
            </li>
            <li>
              Each user may have only one account. Creating multiple accounts
              without permission is prohibited.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">3. Content Ownership</h2>
          <ul className="list-disc pl-6">
            <li>
              All content on the platform, including text, images, videos and
              tools, belongs to the platform, and copying it without permission
              is prohibited.
            </li>
            <li>
              Users may download or use educational content and tools solely
              for personal, non-commercial purposes.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">4. Responsibilities</h2>
          <ul className="list-disc pl-6">
            <li>
              The platform accepts no responsibility for the outcomes of
              decisions users make based on information provided on the site.
            </li>
            <li>
              Any illegal activity or misuse of the platform's services will
              result in the offending user's account being suspended.
            </li>
            <li>
              Users are responsible for keeping their account information
              secure. Any unauthorized use of an account must be reported to
              the support team immediately.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">5. Privacy</h2>
          <ul className="list-disc pl-6">
            <li>
              Users' personal information is collected and stored in line with
              confidentiality principles.
            </li>
            <li>
              The platform is committed to not sharing users' personal
              information with third parties without permission, except where
              required by law.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">6. Account Cancellation</h2>
          <ul className="list-disc pl-6">
            <li>Users may request to cancel their account at any time.</li>
            <li>
              The platform has the right to temporarily or permanently
              deactivate a user's account if they violate these terms.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">
            7. Rules for Content and Projects
          </h2>
          <ul className="list-disc pl-6">
            <li>Users must not publish offensive, illegal or harmful content.</li>
            <li>
              Users are responsible for the information and content they upload,
              and the platform accepts no responsibility for it.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">8. Changes to Services</h2>
          <ul className="list-disc pl-6">
            <li>
              The platform may change its services, tools or terms of use at
              any time.
            </li>
            <li>
              Users are responsible for keeping up with the latest changes and
              complying with the updated terms.
            </li>
          </ul>

          <h2 className="mt-6 text-xl font-semibold">9. Dispute Resolution</h2>
          <ul className="list-disc pl-6">
            <li>
              Any dispute arising from use of the platform should first be
              resolved through discussion and mediation.
            </li>
            <li>
              If no agreement is reached, the matter will be referred to the
              competent legal authorities.
            </li>
          </ul>

          <p className="mt-6">
            Note: Using this platform's services means you fully agree to all of
            the above. If you have any questions, please contact the support
            team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
