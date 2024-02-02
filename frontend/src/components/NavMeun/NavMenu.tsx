import * as React from "react";

import { cn } from "@/lib/utils";
// import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "wouter";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Edit Profile",
        href: "/profile",
        description:
            "Edit your profile information, including your name, email, and password.",
    },
    {
        title: "View Posts",
        href: "/profile/posts",
        description:
            "View all of your posts and manage them from one place.",
    },
    {
        title: "Sign Out",
        href: "/logout",
        description:
            "Sign out of your account.",
    }
]

export function NavMenu() {
    return (
        <div>
            <NavigationMenu className="flex flex-row w-full justify-between">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link href="/">
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                Home
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="m-0">
                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                {components.map((component) => (
                                    <Link key={component.title}
                                        href={component.href}>
                                        <ListItem title={component.title}>
                                            {component.description}
                                        </ListItem>
                                    </Link>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
