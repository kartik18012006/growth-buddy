export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using Growth Buddy, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to use Growth Buddy for personal, non-commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Accounts</h2>
          <p className="text-gray-700 mb-4">
            You are responsible for:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Maintaining the security of your account</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Ownership</h2>
          <p className="text-gray-700">
            You retain ownership of all data you create using Growth Buddy. You may delete your account and all associated data at any time through the application settings.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on Growth Buddy are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p className="text-gray-700">
            Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our website or otherwise relating to such materials or on any sites linked to this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitations</h2>
          <p className="text-gray-700">
            In no event shall Growth Buddy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Growth Buddy, even if Growth Buddy or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifications</h2>
          <p className="text-gray-700">
            Growth Buddy may revise these terms of service at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please contact us at:{" "}
            <a href="mailto:kartikms5477@gmail.com" className="text-blue-600 hover:underline">
              kartikms5477@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

