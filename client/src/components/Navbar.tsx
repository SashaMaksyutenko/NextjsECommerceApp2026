import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { Heart, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import AuthButton from "./AuthButton";
import ThemeToggle from "./ThemeToggle";
import { Suspense } from "react";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
      <Link href={"/"} className="flex items-center">
        <Image
          src="/logo.png"
          alt={""}
          width={36}
          height={36}
          className="w-6 h-6 md:w-9 md:h-9"
        />
        <p className="hidden md:block text-md font-medium tracking-wider">
          TRENDSHOP
        </p>
      </Link>
      <div className="flex items-center gap-6">
        <Suspense>
          <SearchBar />
        </Suspense>
        <Link href={"/"}>
          <Home className="w-4 h-4 text-gray-600" />
        </Link>
        <ThemeToggle />
        <Link href="/wishlist">
          <Heart className="w-4 h-4 text-gray-600" />
        </Link>
        <ShoppingCartIcon />
        <AuthButton />
      </div>
    </nav>
  );
};

export default Navbar;
