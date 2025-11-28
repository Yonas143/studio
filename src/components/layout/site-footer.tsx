import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Logo } from '@/components/icons';

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 text-primary" />
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
