import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between md:gap-0 bg-gray-800 p-8 rounded-lg">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link href={""} className="flex items-center">
          <Image src="/logo.png" alt={""} width={36} height={36} />
          <p className="hidden md:block text-md font-medium tracking-wider text-white">
            TRENDSHOP
          </p>
        </Link>
        <p className="text-gray-400 text-sm">&copy; 2026 Trendshop.</p>
        <p className="text-gray-400 text-sm">All rights reserved.</p>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text text-amber-50">Links</p>
        <Link href={""}>Homepage</Link>
        <Link href={""}>Contact</Link>
        <Link href={""}>Terms of Service</Link>
        <Link href={""}>Privacy Policy</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text text-amber-50">Products</p>
        <Link href={""}>All Products</Link>
        <Link href={""}>New Arrivals</Link>
        <Link href={""}>Best Sellers</Link>
        <Link href={""}>Sale</Link>
      </div>
      <div className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start">
        <p className="text-sm text text-amber-50">Company</p>
        <Link href={""}>About</Link>
        <Link href={""}>Contact</Link>
        <Link href={""}>Blog</Link>
        <Link href={""}>Afilliate Program</Link>
      </div>
    </div>
  );
};

export default Footer;
