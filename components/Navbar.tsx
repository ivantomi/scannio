import React from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Separator } from "@/components/ui/separator";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/"
                className="px-4 py-2 text-white transition-colors duration-200 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            <Separator orientation="vertical" className="h-6 border-gray-600" />

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/scan"
                className="px-4 py-2 text-white transition-colors duration-200 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              >
                New Scan
              </NavigationMenuLink>
            </NavigationMenuItem>

            <Separator orientation="vertical" className="h-6 border-gray-600" />

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/attendees"
                className="px-4 py-2 text-white transition-colors duration-200 rounded-md hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
              >
                View Attendees
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
