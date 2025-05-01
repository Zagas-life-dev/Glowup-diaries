import Link from "next/link"
import Image from "next/image"
import { Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="mb-4">
              <Image src="/images/logo-transparent.png" alt="Glow Up Diaries" width={180} height={50} />
            </div>
            <p className="text-sm text-gray-400">
              Connect young ambitious people to opportunities, events, and free resources.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-gray-400 hover:text-brand-orange">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://linkedin.com" className="text-gray-400 hover:text-brand-orange">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://twitter.com" className="text-gray-400 hover:text-brand-orange">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-brand-orange">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm text-gray-400 hover:text-brand-orange">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="text-sm text-gray-400 hover:text-brand-orange">
                  Opportunities
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-gray-400 hover:text-brand-orange">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-sm text-gray-400 hover:text-brand-orange">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold">Submit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/submit?type=event" className="text-sm text-gray-400 hover:text-brand-orange">
                  Submit an Event
                </Link>
              </li>
              <li>
                <Link href="/submit?type=opportunity" className="text-sm text-gray-400 hover:text-brand-orange">
                  Submit an Opportunity
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-brand-orange">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold">Contact</h3>
            <p className="text-sm text-gray-400">Email: glowupdiaries@gmail.com</p>
            <Link href="https://wa.me/" className="text-sm text-gray-400 hover:text-brand-orange">
              WhatsApp Contact
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Glow Up Diaries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
