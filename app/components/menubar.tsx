"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact", path: "/contact" },
];

const isActive = (pathname: string, path: string) => {
  if (path === "/") return pathname === path;
  return pathname.startsWith(path);
};

export default function MainMenuBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Jonathan Ty
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-items-end space-x-8">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm transition-colors ${
                  isActive(pathname, link.path)
                    ? "text-green-600 font-medium"
                    : "text-gray-700 hover:text-green-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300">
              <a
                href="https://github.com/jonathannnty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="GitHub"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12A11.5 11.5 0 0 0 8.36 22.92c.58.1.79-.25.79-.56v-2.17c-3.2.7-3.88-1.35-3.88-1.35-.53-1.33-1.29-1.68-1.29-1.68-1.06-.72.08-.7.08-.7 1.17.08 1.8 1.2 1.8 1.2 1.04 1.8 2.73 1.28 3.4.98.1-.76.4-1.28.74-1.57-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.3-.51-1.5.11-3.13 0 0 .97-.31 3.17 1.18A10.97 10.97 0 0 1 12 6.05c.97 0 1.94.13 2.85.38 2.2-1.49 3.17-1.18 3.17-1.18.62 1.63.23 2.83.11 3.13.74.8 1.19 1.83 1.19 3.08 0 4.41-2.7 5.39-5.27 5.67.41.36.78 1.08.78 2.18v3.24c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/jonathan-ty/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="LinkedIn"
              >
                {/* <LinkedIn className="w-5 h-5" /> */}
              </a>
              <a
                href="mailto:jonathanty42@gmail.com"
                className="text-gray-600 hover:text-green-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base ${
                  isActive(link.path)
                    ? "text-blue-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:alex.chen@email.com"
                className="text-gray-600 hover:text-blue-600"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )} */}
    </nav>
  );
}
