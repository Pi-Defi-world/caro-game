import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Bell, Hexagon, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { setCurrentUser } from '@/redux/slices/auth';
import Notifications from './Notifications';

export const UserProfile = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const notifications = useAppSelector((state) => state.notifications.notifications);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setCurrentUser(null));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="text-white/70 relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 bg-[#0F1226]">
          <Notifications />
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <div className="flex items-center gap-2">
              <Hexagon className="h-6 w-6 sm:h-8 sm:w-8 text-[#F7931A]" />
              <div className="text-xs sm:text-sm hidden sm:block">
                <div className="font-medium text-white">
                  {currentUser?.username}
                </div>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-[12px] border-2 border-yellow-500/20 bg-[#0F1226] shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        >
          <DropdownMenuItem
            onClick={() => router.push('/me')}
            className="flex items-center px-2 py-1 text-white hover:bg-[#8B3A3A]/10 rounded-xl transition-colors font-medium"
          >
            <User className="mr-3 h-5 w-5 text-white" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-0 bg-[#8B3A3A]/20" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center px-2 py-2 text-white hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
