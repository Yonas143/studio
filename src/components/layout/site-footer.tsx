import Link from 'next/link';
import NextImage from 'next/image';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/icons';

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <NextImage src="/logo.jpg" alt="Cultural Ambassador Award" width={32} height={32} className="h-8 w-8 object-contain rounded-full" />
              <span className="font-headline text-xl font-bold">Cultural Ambassador Award</span>
            </Link>
            <p className="text-sm">
              Celebrating Ethiopian Cultural Excellence.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-secondary-foreground/70 hover:text-primary">
                <Youtube className="h-5 w-5" />
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
          <p>&copy; {new Date().getFullYear()} ABN Studio. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
