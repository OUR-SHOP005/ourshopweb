# Web Design Agency Website

A modern, responsive website for a web design agency built with Next.js, TypeScript, and Tailwind CSS. The website features a clean, professional design with smooth animations and dark mode support.

## Features

- 🎨 Modern and responsive design
- 🌓 Dark mode support
- ⚡ Fast performance with Next.js
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-friendly navigation
- 🎯 SEO optimized
- 🎨 Custom color scheme and typography
- 📝 Contact form
- 🖼️ Portfolio showcase
- 👥 Testimonials section

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support
- [Heroicons](https://heroicons.com/) - Icon set
- [React Intersection Observer](https://github.com/thebuilder/react-intersection-observer) - Scroll animations

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/web-design-agency.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   │   └── Footer.tsx    # Footer component
│   ├── sections/         # Page sections
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ContactSection.tsx
│   └── ui/               # UI components
│       ├── ThemeToggle.tsx
│       └── MobileNav.tsx
└── styles/               # Additional styles
```

## Customization

### Colors

The website uses a custom color scheme defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: '#2D3436',    // Charcoal
  secondary: '#0984E3',  // Electric blue
  accent: '#00B894',     // Emerald
  background: {
    light: '#FFFFFF',
    dark: '#1A1A1A',
  },
  text: {
    light: '#FFFFFF',
    dark: '#2D3436',
  },
}
```

### Typography

The website uses three main fonts:

- Headings: Poppins (600, 700)
- Body: Inter (400, 500)
- Accents: Roboto Mono (400)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 