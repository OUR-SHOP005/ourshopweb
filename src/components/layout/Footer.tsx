import Link from 'next/link'

const footerLinks = {
  services: [
    { name: 'Web Design', href: '/services#web-design' },
    { name: 'UI/UX Design', href: '/services#ui-ux-design' },
    { name: 'Brand Identity', href: '/services#brand-identity' },
    { name: 'Digital Marketing', href: '/services#digital-marketing' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Twitter', href: '#', icon: '𝕏' },
  { name: 'LinkedIn', href: '#', icon: 'in' },
  { name: 'Instagram', href: '#', icon: '📸' },
  { name: 'Dribbble', href: '#', icon: '🎨' },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-heading font-bold">
              DesignAgency
            </Link>
            <p className="text-gray-600 dark:text-gray-300">
              Creating digital experiences that inspire and innovate.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-300">
              © {new Date().getFullYear()} DesignAgency. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-secondary transition-colors"
                  aria-label={link.name}
                >
                  <span className="text-xl">{link.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 