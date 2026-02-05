"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardPageTitle, isNavItemActive } from "../lib/dashboard-nav";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightStartOnRectangleIcon,
  UserGroupIcon,
  CogIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const userTypeNavigation = {
  patient: [
    { name: "Dashboard", href: "/dashboard/patient", icon: HomeIcon },
    {
      name: "Health Profile",
      href: "/dashboard/patient/profile",
      icon: UserIcon,
    },
    {
      name: "Find a Doctor",
      href: "/dashboard/patient/find-doctor",
      icon: UserGroupIcon,
    },
    {
      name: "AI Doctor",
      href: "/dashboard/patient/ai-doctor",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "Medical Records",
      href: "/dashboard/patient/records",
      icon: DocumentTextIcon,
    },
    {
      name: "Consultations",
      href: "/dashboard/patient/consultations",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "Analytics",
      href: "/dashboard/patient/analytics",
      icon: ChartBarIcon,
    },
  ],
  doctor: [
    { name: "Dashboard", href: "/dashboard/doctor", icon: HomeIcon },
    { name: "Profile", href: "/dashboard/doctor/profile", icon: UserIcon },
    {
      name: "Patients",
      href: "/dashboard/doctor/patients",
      icon: UserGroupIcon,
    },
    {
      name: "Consultations",
      href: "/dashboard/doctor/consultations",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "AI Analysis",
      href: "/dashboard/doctor/ai-analysis",
      icon: DocumentTextIcon,
    },
    {
      name: "Analytics",
      href: "/dashboard/doctor/analytics",
      icon: ChartBarIcon,
    },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: HomeIcon },
    { name: "Users", href: "/dashboard/admin/users", icon: UserGroupIcon },
    {
      name: "Reports",
      href: "/dashboard/admin/reports",
      icon: DocumentTextIcon,
    },
    {
      name: "Analytics",
      href: "/dashboard/admin/analytics",
      icon: ChartBarIcon,
    },
    { name: "Settings", href: "/dashboard/admin/settings", icon: CogIcon },
  ],
};

function navLinkClass(active) {
  return [
    "group flex items-center gap-x-3 rounded-lg px-2 py-2 text-sm font-semibold leading-6 transition-colors duration-150",
    active
      ? "bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-100"
      : "text-gray-700 hover:bg-gray-50 hover:text-primary-600",
  ].join(" ");
}

function navIconClass(active) {
  return [
    "h-6 w-6 shrink-0 transition-colors duration-150",
    active ? "text-primary-600" : "text-gray-400 group-hover:text-primary-600",
  ].join(" ");
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary-600" />
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userType = user.type;
  const dashboardPrefix = `/dashboard/${userType}`;

  if (!pathname.startsWith(dashboardPrefix)) {
    router.push(dashboardPrefix);
    return null;
  }

  const navigation = userTypeNavigation[userType] || [];
  const homeHref = `/dashboard/${userType}`;
  const pageTitle = getDashboardPageTitle(pathname, navigation, homeHref);

  const displayName =
    user.name ||
    (userType === "patient"
      ? "Patient"
      : userType === "doctor"
        ? "Doctor"
        : "Admin");

  const avatarLetter =
    user.name?.charAt(0).toUpperCase() ||
    (userType === "patient" ? "P" : userType === "doctor" ? "D" : "A");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!sidebarOpen}
      >
        <div
          className={`fixed inset-0 bg-gray-900/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out ${
            sidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-xl transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <Link
              href={homeHref}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center"
            >
              <Image
                src="/images/logo.png"
                alt="MEDIRA"
                width={200}
                height={60}
                className="h-12 w-auto"
                priority
              />
            </Link>
            <button
              type="button"
              className="-m-2 rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {navigation.map((item) => {
              const active = isNavItemActive(pathname, item.href, homeHref);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={navLinkClass(active)}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={navIconClass(active)} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-100 p-3">
            <button
              type="button"
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
            >
              <ArrowRightStartOnRectangleIcon className="h-6 w-6 shrink-0 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-5 shadow-sm">
          <div className="flex h-16 shrink-0 items-center pt-2">
            <Link href={homeHref} className="block transition-opacity hover:opacity-90">
              <Image
                src="/images/logo.png"
                alt="MEDIRA"
                width={280}
                height={84}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col pb-4">
            <ul className="space-y-0.5">
              {navigation.map((item) => {
                const active = isNavItemActive(pathname, item.href, homeHref);
                return (
                  <li key={item.name}>
                    <Link href={item.href} className={navLinkClass(active)}>
                      <item.icon className={navIconClass(active)} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/80 bg-white/95 px-4 shadow-sm backdrop-blur-sm transition-[box-shadow] duration-200 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex min-w-0 flex-1 flex-col">
            <h1 className="truncate text-base font-semibold leading-6 text-gray-900 lg:text-lg">
              {pageTitle}
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              {userType === "patient"
                ? "Your care hub"
                : userType === "doctor"
                  ? "Clinical workspace"
                  : "Administration"}
            </p>
          </div>

          <Menu as="div" className="relative shrink-0">
            <Menu.Button className="flex items-center gap-x-3 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {avatarLetter}
              </span>
              <span className="hidden min-w-0 flex-col text-left sm:flex">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {userType}
                </span>
              </span>
              <ChevronDownIcon className="hidden h-4 w-4 text-gray-400 sm:block" />
            </Menu.Button>
            <Transition
              enter="transition ease-out duration-100"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/dashboard/${userType}/profile`}
                      className={`${
                        active ? "bg-gray-50" : ""
                      } block px-4 py-2.5 text-sm font-medium text-gray-700`}
                    >
                      Profile & settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/"
                      className={`${
                        active ? "bg-gray-50" : ""
                      } block px-4 py-2.5 text-sm font-medium text-gray-700`}
                    >
                      Marketing site
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => logout()}
                      className={`${
                        active ? "bg-red-50" : ""
                      } flex w-full px-4 py-2.5 text-left text-sm font-medium text-red-700`}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </header>

        <main className="py-8 transition-opacity duration-200 sm:py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
