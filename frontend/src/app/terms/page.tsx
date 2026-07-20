import { Card } from '@/components/ui/card';

const sections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using InvestProp AI (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.' },
  { title: 'Account Registration', content: 'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate, current, and complete information during registration.' },
  { title: 'AI Analysis Disclaimer', content: 'Our AI-generated investment scores, recommendations, and analyses are provided for informational and educational purposes only. They do not constitute financial advice, investment recommendations, or a solicitation to buy or sell any property. Always consult with qualified financial professionals before making investment decisions.' },
  { title: 'User Responsibilities', content: 'You agree not to misuse the Platform, including attempting to access unauthorized areas, submitting false information, interfering with platform operations, or using automated tools to extract data. You are responsible for the accuracy of any property data you submit.' },
  { title: 'Intellectual Property', content: 'The Platform, including its AI models, algorithms, design, content, and technology, is the proprietary property of InvestProp AI. You may not reproduce, distribute, modify, or create derivative works without our express written consent.' },
  { title: 'Limitation of Liability', content: 'InvestProp AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. Our total liability is limited to the amount you paid for Platform access in the 12 months preceding the claim.' },
  { title: 'Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the Platform. You may terminate your account at any time through your account settings.' },
  { title: 'Governing Law', content: 'These terms are governed by the laws of the State of New York, United States. Any disputes shall be resolved in the courts of New York County. You agree to submit to the personal jurisdiction of these courts.' },
];

export default function TermsPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/5 border border-primary-800/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-neutral-500">Last updated: January 1, 2024</p>
        </div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <Card key={i} className="p-6 border-neutral-200/50">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">{s.title}</h2>
              <p className="text-neutral-600 leading-relaxed text-sm">{s.content}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-neutral-500">
          <p>For questions about these terms, contact us at legal@investprop.ai</p>
        </div>
      </div>
    </div>
  );
}
