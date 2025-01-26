import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-white bg-black text-white">
      <div className="px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center mb-12">
          <div className="flex-1 h-px bg-white"></div>
          <Link href="/">
            <div className="mx-8 px-4 py-2 border border-white hover:bg-white hover:text-black transition duration-300 cursor-pointer">
                <span>IR Lens</span>
            </div>
          </Link>
          <div className="flex-1 h-px bg-white"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm md:text-md hover:underline">Our Mission</Link></li>
              <li><Link href="/team" className="text-sm md:text-md hover:underline">Editorial Team</Link></li>
              <li><Link href="/ethics" className="text-sm md:text-md hover:underline">Ethics Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Sections</h3>
            <ul className="space-y-2">
              <li><Link href="/tags/diplomacy" className="text-sm md:text-md hover:underline">Diplomacy</Link></li>
              <li><Link href="/tags/global-economy" className="text-sm md:text-md hover:underline">Global Economy</Link></li>
              <li><Link href="/tags/conflicts" className="text-sm md:text-md hover:underline">Conflicts</Link></li>
              <li><Link href="/tags/climate" className="text-sm md:text-md hover:underline">Climate</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm md:text-md hover:underline">Contact Us</Link></li>
              <li><Link href="#" className="text-sm md:text-md hover:underline">Twitter</Link></li>
              <li><Link href="#" className="text-sm md:text-md hover:underline">Instagram</Link></li>
              <li><Link href="#" className="text-sm md:text-md hover:underline">LinkedIn</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-4">Newsletter</h3>
            <p className="mb-4 text-sm md:text-md">Stay informed with our daily briefing.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" className="mb-1 text-black" />
              <Button type="submit" className="w-full border-white h-9">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 IR Lens. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
