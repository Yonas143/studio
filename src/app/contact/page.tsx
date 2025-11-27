'use client';

import { PageHeader, PageHeaderHeading, PageHeaderDescription } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container py-8">
      <PageHeader className="items-center text-center mb-8">
        <PageHeaderHeading>Contact ABN Studio</PageHeaderHeading>
        <PageHeaderDescription>Empowering Ethiopia's Creative Youth</PageHeaderDescription>
      </PageHeader>

      <div className="prose dark:prose-invert max-w-4xl mx-auto text-center">
        <p className="lead">
          ABN Studio is a leading creative hub in Ethiopia, dedicated to empowering youth, promoting cultural excellence, and fostering innovation across the arts. As a sister company of Abyssinia Business Network (ABN) Magazine and Africa for Africans, we leverage a strong media and cultural network to provide opportunities for artists and innovators.
        </p>
        <p>
          We operate with the highest standards of professionalism to ensure all creative projects meet international benchmarks.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-6xl mx-auto">
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">We welcome inquiries from artists, partners, sponsors, and media representatives.</p>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-muted-foreground">Country: Ethiopia</p>
                  <p className="text-muted-foreground">Address: [Insert Physical Address Here]</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Phone & Email</h4>
                  <p className="text-muted-foreground">Phone: [Insert Phone Number Here]</p>
                  <p className="text-muted-foreground">Email: [Insert Email Address Here]</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Globe className="h-6 w-6 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Website</h4>
                  <p className="text-muted-foreground">www. [Insert Full Website URL Here]</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>General Inquiries:</strong> <a href="mailto:[Insert Email]" className="text-primary hover:underline">[Insert Email]</a></p>
              <p><strong>Award Submissions:</strong> <a href="mailto:[Insert Email or Submission Link]" className="text-primary hover:underline">[Insert Email or Submission Link]</a></p>
              <p><strong>Sponsorship Opportunities:</strong> <a href="mailto:[Insert Email]" className="text-primary hover:underline">[Insert Email]</a></p>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>How We Can Help You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 flex-grow">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Creative Services & Production</h3>
              <p className="text-muted-foreground mb-4">Contact us for our specialized professional services:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Experience Documentary Production</li>
                <li>Promotional Advert Production</li>
                <li>Television Shows and Podcasts</li>
                <li>Studio and Equipment Rental Services</li>
              </ul>
            </div>
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-2">2. ABN Studio Cultural Ambassadors Award</h3>
              <p className="text-muted-foreground mb-4">For inquiries regarding our initiative to identify and empower Ethiopia's creative youth:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Participants:</strong> Youth aged 15–35 interested in Performing Arts, Digital Music, Traditional Instruments, or Literature/Poetry.</li>
                <li><strong>Sponsors & Partners:</strong> Government agencies, NGOs, and private sector organizations.</li>
                <li><strong>Media:</strong> National and international media platforms interested in covering the initiative.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <footer className="text-center mt-16 max-w-3xl mx-auto">
        <p className="text-lg font-semibold text-foreground">ABN Studio</p>
        <p className="text-muted-foreground">Identifying, celebrating, and empowering Ethiopia’s creative youth as ambassadors of culture, innovation, and social impact.</p>
      </footer>
    </div>
  );
}
