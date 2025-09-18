import Link from 'next/link';

type Props = {
  companyName: string;
  privacyUrl?: string;
  termsUrl?: string;
  contactEmail?: string;
  phone?: string;
  showCredit?: boolean; // default true
};

export default function PaidFooter({
  companyName,
  privacyUrl = '#',
  termsUrl = '#',
  contactEmail,
  phone,
  showCredit = true
}: Props) {
  return (
    <footer data-paid-footer className="border-t border-black/5 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
        <div>
          <div className="font-semibold">{companyName}</div>
          {contactEmail && <div className="mt-1 text-muted-foreground">{contactEmail}</div>}
          {phone && <div className="text-muted-foreground">{phone}</div>}
        </div>
        <div className="space-y-2">
          <Link href={privacyUrl} className="text-blue-600 hover:text-blue-800">Privacy Policy</Link><br/>
          <Link href={termsUrl} className="text-blue-600 hover:text-blue-800">Terms of Service</Link>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {showCredit && <span>Powered by Sunspire</span>}
        </div>
      </div>
    </footer>
  );
}
