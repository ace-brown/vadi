import { FaTelegram, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 px-8 pb-2 pt-5 mt-20 relative z-10">
      {/* Footer Content */}
      <div className="flex justify-between gap-4 text-[1rem]">
        {/* Links */}
        <ul className="flex gap-6">
          {/* <li>
            <Link href="#" className="hover:text-gray-100">
              پشتیبانی
            </Link>
          </li> */}
          {/* <li>
            <Link href="#" className="hover:text-gray-100">
              مرکز کمک
            </Link>
          </li> */}
          <li>
            <Link href="/contact" className="hover:text-gray-100">
              تماس
            </Link>
          </li>
          {/* <li>
            <Link href="#" className="hover:text-gray-100">
              سؤالات متداول
            </Link>
          </li> */}
          <li>
            <Link href="/terms" className="hover:text-gray-100">
              قوانین
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-gray-100">
              حریم خصوصی
            </Link>
          </li>
        </ul>
        {/* Social media */}
        <div className="flex items-center space-x-reverse gap-4">
          <a
            href="#"
            aria-label="Telegram"
            className="hover:text-blue-500"
            rel="noreferrer"
          >
            <FaTelegram className="text-2xl" />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="hover:text-blue-400"
            rel="noreferrer"
          >
            <FaTwitter className="text-2xl" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="hover:text-pink-500"
            rel="noreferrer"
          >
            <FaInstagram className="text-2xl" />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="hover:text-blue-600"
            rel="noreferrer"
          >
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="text-center text-[0.75rem] text-gray-500 mt-2">
        کلیه حقوق این وبسایت متعلق به خیام سانا است.
      </div>
    </footer>
  );
}
