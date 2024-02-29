import { ComponentPropsWithoutRef, ElementRef, forwardRef, useContext } from "react";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { AuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Profile Info",
        href: "/profile",
        description:
            "Look at your profile information and delete your account.",
    },
    {
        title: "View Posts",
        href: "/profile/posts",
        description:
            "View all of your posts and manage them from one place.",
    },
    {
        title: "Create a Post",
        href: "/create-post",
        description:
            "Create a new post to contribute to the community's weather forecast",
    },
    {
        title: "Sign Out",
        href: "/logout",
        description:
            "Sign out of your account.",
    }
]

export function NavMenu() {
    const { session } = useContext(AuthContext);

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

                    {(session && session.user) ?
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
                        :
                        <NavigationMenuItem>
                            <Link href="/login">
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Log In
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    }
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}

const ListItem = forwardRef<
    ElementRef<"a">,
    ComponentPropsWithoutRef<"a">
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
