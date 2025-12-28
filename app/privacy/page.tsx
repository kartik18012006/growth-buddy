export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            Growth Buddy collects the following information:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Email address (for authentication via Google OAuth)</li>
            <li>Name (from your Google account profile)</li>
            <li>Tasks, habits, and sleep data that you create using the application</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Data</h2>
          <p className="text-gray-700 mb-4">
            We use your data to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Provide and improve our service</li>
            <li>Personalize your experience</li>
            <li>Enable authentication and account management</li>
          </ul>
          <p className="text-gray-700">
            We do not share your personal data with third parties. Your data is used solely for providing the Growth Buddy service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Storage</h2>
          <p className="text-gray-700">
            Your data is stored securely in MongoDB Atlas. We implement appropriate security measures to protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Access your personal data</li>
            <li>Delete your account and associated data</li>
            <li>Request a copy of your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:kartikms5477@gmail.com" className="text-blue-600 hover:underline">
              kartikms5477@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

