/**
 * @param {string} pathname
 * @param {string} href
 * @param {string} homeHref e.g. /dashboard/patient
 */
export function isNavItemActive(pathname, href, homeHref) {
  if (href === homeHref) {
    return pathname === homeHref;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Prefer the longest matching route label (e.g. /ai-doctor over /dashboard root).
 */
export function getDashboardPageTitle(pathname, navigation, homeHref) {
  const sorted = [...navigation].sort((a, b) => b.href.length - a.href.length);
  const item = sorted.find(
    (n) =>
      pathname === n.href ||
      (n.href !== homeHref && pathname.startsWith(`${n.href}/`))
  );
  return item?.name ?? "Dashboard";
}
