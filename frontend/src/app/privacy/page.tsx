import { Card } from '@/components/ui/card';

const sections = [
  { title: 'Information We Collect', content: 'We collect information you provide directly to us, including your name, email address, phone number, investment preferences, and property data. We also automatically collect certain technical information when you use our platform, such as IP address, browser type, device information, and usage patterns.' },
  { title: 'How We Use Your Information', content: 'Your information is used to provide and improve our AI-powered investment analysis services, personalize your experience, send relevant property recommendations, communicate with you about your account, and ensure platform security. We never sell your personal information to third parties.' },
  { title: 'AI & Data Processing', content: 'Property data submitted to our AI analysis engine is processed securely and used solely to generate investment scores, recommendations, and insights. We do not train our models on your personal data without explicit consent. Analysis results are stored securely and associated with your account.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, regular security audits, and strict access controls. Our infrastructure is hosted on SOC 2-compliant cloud providers with 24/7 monitoring.' },
  { title: 'Data Retention', content: 'We retain your account information for as long as your account is active. You may request deletion of your account and associated data at any time. Property analysis data is retained for 24 months unless you request earlier deletion.' },
  { title: 'Your Rights', content: 'You have the right to access, correct, update, or delete your personal data at any time through your account settings. You may also export your data in a portable format. Contact our privacy team at privacy@investprop.ai for any data-related requests.' },
  { title: 'Cookies & Tracking', content: 'We use essential cookies for platform functionality and optional analytics cookies to improve our service. You can control cookie preferences through your browser settings. We do not use cookies for advertising or third-party tracking.' },
  { title: 'Third-Party Services', content: 'We integrate with trusted third-party services including Google (for authentication), MongoDB Atlas (for database hosting), and Cloudinary (for image storage). Each service provider is contractually obligated to maintain data protection standards.' },
];

export default function PrivacyPage() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/5 border border-primary-800/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-neutral-500">Last updated: January 1, 2024</p>
        </div>

        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-600 leading-relaxed mb-8">At InvestProp AI, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you use our platform.</p>
        </div>

        <div className="space-y-5">
          {sections.map((s, i) => (
            <Card key={i} className="p-6 border-neutral-200/50">
              <h2 className="text-lg font-semibold text-neutral-900 mb-3">{s.title}</h2>
              <p className="text-neutral-600 leading-relaxed text-sm">{s.content}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 bg-neutral-50 rounded-[14px] border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-2">Contact Our Privacy Team</h3>
          <p className="text-sm text-neutral-600">Email: privacy@investprop.ai<br />Response time: Within 48 hours</p>
        </div>
      </div>
    </div>
  );
}
