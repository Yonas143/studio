import Link from 'next/link';
import NextImage from 'next/image';
import { Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <NextImage src="/logo.jpg" alt="Cultural Ambassador Award" width={32} height={32} className="h-8 w-8 object-contain" />
              <span className="font-headline text-xl font-bold">Cultural Ambassador Award</span>
            </Link>
            <p className="text-sm">
              Celebrating Ethiopian Cultural Excellence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <TikTokIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <TelegramIcon className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm hover:text-primary">About Us</Link></li>
              <li><Link href="/nominees" className="text-sm hover:text-primary">Nominees</Link></li>
              <li><Link href="/categories" className="text-sm hover:text-primary">Categories</Link></li>
              <li><Link href="/submit" className="text-sm hover:text-primary">Submit Work</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/voting-rules" className="text-sm hover:text-primary">Voting Rules</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline font-semibold">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm">
                Merkeb Plaza | Olompia<br />
                መርከብ ፕላዛ | ኦሎምፒያ<br />
                Addis Ababa, Ethiopia
              </li>
              <li>
                <a href="tel:+251945443450" className="text-sm hover:text-primary">
                  +251 945 44 34 50
                </a>
              </li>
              <li className="pt-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.4679677705817!2d38.77574197059446!3d8.993602906244039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85bf78ae5f39%3A0x5876d9eab73e5228!2zTWVya2ViIFBsYXphIHwgT2xvbXBpYSB8IOGImOGIreGKqOGJpSDhjZXhiIvhi5sgfCDhiqbhiI7hiJ3hjZLhi6s!5e0!3m2!1sen!2set!4v1765179327055!5m2!1sen!2set"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-md shadow-sm"
                ></iframe>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EYUDAN MEDIA PLC ( ABN STUDIO ). All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
