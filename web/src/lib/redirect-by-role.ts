export function getDashboardByRole(role?: string): string {
  switch (role) {
    case 'admin':     return '/admin';
    case 'bac_si':    return '/bac-si';
    case 'nhan_vien': return '/nhan-vien';
    default:          return '/portal';
  }
}
