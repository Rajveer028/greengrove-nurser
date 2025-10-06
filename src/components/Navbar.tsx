import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { 
  HomeIcon, 
  LogIn, 
  LogOut, 
  Sprout, 
  Users, 
  ShoppingCart, 
  Calendar, 
  BarChart3,
  Package,
  Bell
} from "lucide-react";
import ModeToggle from "./ModeToggle";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth.action";

async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="sticky top-0 w-full z-50 border-b bg-gradient-to-r from-green-100/30 via-green-200/20 to-green-100/30 backdrop-blur-md supports-[backdrop-filter]:bg-white/30 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Sprout className="text-green-700 w-6 h-6" />
            <Link
              href="/"
              className="text-2xl font-bold text-green-800 font-mono tracking-wide"
            >
              GreenGrove
            </Link>
          </div>

		  {/* Greeting removed as per requirements */}

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/plants">
                <Sprout className="w-4 h-4" />
                <span className="hidden lg:inline">Plants</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/customers">
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">Customers</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/orders">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden lg:inline">Orders</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/care-schedule">
                <Calendar className="w-4 h-4" />
                <span className="hidden lg:inline">Care</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/reports">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden lg:inline">Reports</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-green-800"
              asChild
            >
              <Link href="/inventory">
                <Package className="w-4 h-4" />
                <span className="hidden lg:inline">Inventory</span>
              </Link>
            </Button>

            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-2">
				<span className="text-sm text-green-700 dark:text-green-500">
				  {user.displayName}
				</span>
                <form action={signOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="flex items-center gap-2 text-green-800"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden lg:inline">Sign Out</span>
                  </Button>
                </form>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-green-800"
                asChild
              >
                <Link href="/sign-in">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
