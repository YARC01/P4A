import React, { useState } from 'react';
import {
  Bell,
  Shield,
  UserCheck,
  Trophy,
  Activity,
  ChevronDown,
  Sparkles,
  Lock,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { User, UserRole, PushNotification } from '../types.ts';
import { INITIAL_USERS } from '../mockData.ts';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSelectUser: (user: User) => void;
  notifications: PushNotification[];
  onOpenNotifications: () => void;
  onOpenRoleManagement: () => void;
  onMarkAllNotificationsRead: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  users,
  onSelectUser,
  notifications,
  onOpenNotifications,
  onOpenRoleManagement,
  activeTab,
  onNavigate,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; color: string; badge: string }> = {
    super_admin: { label: 'BQT Tối Cao', color: 'from-amber-500 to-orange-600', badge: 'SUPER ADMIN' },
    admin: { label: 'Admin CLB', color: 'from-blue-600 to-indigo-600', badge: 'ADMIN CLB' },
    organizer: { label: 'Ban Tổ Chức', color: 'from-emerald-600 to-teal-700', badge: 'BTC GIẢI' },
    coach: { label: 'Huấn Luyện Viên', color: 'from-emerald-500 to-teal-600', badge: 'COACH' },
    athlete: { label: 'Vận Động Viên', color: 'from-cyan-500 to-blue-600', badge: 'ATHLETE' },
    referee: { label: 'Trọng Tài', color: 'from-rose-500 to-pink-600', badge: 'REFEREE' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-lime-400 shadow-md shadow-emerald-500/25">
              <span className="font-display font-black text-white text-lg tracking-tighter">P4A</span>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  PICKLE <span className="text-emerald-600">4 ALL</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  V.2026 PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Hệ Thống Thể Thao & Bốc Thăm Giải Đấu Chuẩn Quốc Tế
              </p>
            </div>
          </div>

          {/* Quick Stats or Live Match Ticker indicator */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">Hệ thống trực tiếp:</span>
              <span className="text-emerald-700 font-bold">1 Trận Đang Đấu</span>
            </div>
            <div className="h-3 w-px bg-slate-300"></div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">3 Giải Khởi Tranh</span>
            </div>
          </div>

          {/* Action Center: Role Switcher & Push Notification Bell */}
          <div className="flex items-center gap-3">
            {/* Super Admin & Role Management Button - Accessible by all with pass */}
            <button
              type="button"
              onClick={onOpenRoleManagement}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all hover:scale-105 active:scale-95 ${
                currentUser.role === 'super_admin'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-amber-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
              }`}
              title="Phân quyền hệ thống (Nhập mật khẩu để thay đổi)"
            >
              {currentUser.role === 'super_admin' ? (
                <Shield className="w-3.5 h-3.5 text-white" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Phân Quyền</span>
            </button>

            {/* Push Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Thông báo đẩy"
              >
                <Bell className="w-5 h-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-sm"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                    {currentUser.name}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    {roleLabels[currentUser.role]?.badge || 'THÀNH VIÊN'}
                  </div>
                </div>
              </button>

              {/* Role Switcher Menu */}
              {showRoleMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Chuyển Đổi Phân Quyền
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Thử nghiệm các vai trò trong hệ thống
                      </p>
                    </div>
                    {currentUser.role === 'super_admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          onOpenRoleManagement();
                        }}
                        className="p-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[10px] border border-amber-200"
                      >
                        Quản lý quyền
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {(users && users.length > 0 ? users : INITIAL_USERS).map(user => {
                      const isCurrent = user.id === currentUser.id;
                      const badgeInfo = roleLabels[user.role] || roleLabels.athlete;
                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => {
                            onSelectUser(user);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                            isCurrent
                              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate text-slate-900">{user.name}</div>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold uppercase text-[9px] bg-slate-200 text-slate-700`}
                              >
                                {badgeInfo.badge}
                              </span>
                              <span className="text-slate-500 truncate">{user.email}</span>
                            </div>
                          </div>
                          {isCurrent && <UserCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {currentUser.role === 'super_admin' && (
                    <div className="pt-2 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          onOpenRoleManagement();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Mở Trung Tâm Phân Quyền Cấp Dưới</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
