/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Navigation } from './components/Navigation.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { TournamentsView } from './components/TournamentsView.tsx';
import { AthletesView } from './components/AthletesView.tsx';
import { ClubsView } from './components/ClubsView.tsx';
import { StandingsLeaderboardView } from './components/StandingsLeaderboardView.tsx';
import { TreasuryBetsView } from './components/TreasuryBetsView.tsx';
import { NewsView } from './components/NewsView.tsx';
import { NotificationCenterModal } from './components/NotificationCenterModal.tsx';
import { RoleManagementModal } from './components/RoleManagementModal.tsx';
import {
  INITIAL_USERS,
  INITIAL_CLUBS,
  INITIAL_ATHLETES,
  INITIAL_TOURNAMENTS,
  INITIAL_TREASURY,
  INITIAL_BETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_NEWS,
} from './mockData.ts';
import {
  User,
  UserRole,
  ClubGroup,
  Athlete,
  Tournament,
  TreasuryRecord,
  BetPrediction,
  PushNotification,
  NewsArticle,
} from './types.ts';
import { Bell, Flame, Shield, CheckCircle, Trophy, Sparkles } from 'lucide-react';

export default function App() {
  // Users state with Super Admin permission delegation
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('nesa333_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS;
  });

  const [isRoleManagementOpen, setIsRoleManagementOpen] = useState(false);

  // Current logged in user (with role switcher)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nesa333_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_USERS[0]; // Super Admin
  });

  // State with LocalStorage persistence
  const [clubs, setClubs] = useState<ClubGroup[]>(() => {
    const saved = localStorage.getItem('nesa333_clubs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CLUBS;
  });

  const [athletes, setAthletes] = useState<Athlete[]>(() => {
    const saved = localStorage.getItem('nesa333_athletes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_ATHLETES;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem('nesa333_tournaments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TOURNAMENTS;
  });

  const [treasury, setTreasury] = useState<TreasuryRecord[]>(() => {
    const saved = localStorage.getItem('nesa333_treasury');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_TREASURY;
  });

  const [bets, setBets] = useState<BetPrediction[]>(() => {
    const saved = localStorage.getItem('nesa333_bets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_BETS;
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('nesa333_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    const saved = localStorage.getItem('nesa333_news');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_NEWS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Floating Toast Alert for new real-time push notifications
  const [activeToast, setActiveToast] = useState<PushNotification | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nesa333_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nesa333_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('nesa333_athletes', JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem('nesa333_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('nesa333_treasury', JSON.stringify(treasury));
  }, [treasury]);

  useEffect(() => {
    localStorage.setItem('nesa333_bets', JSON.stringify(bets));
  }, [bets]);

  useEffect(() => {
    localStorage.setItem('nesa333_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nesa333_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nesa333_news', JSON.stringify(news));
  }, [news]);

  // User Role Management Handlers
  const handleUpdateUserRole = (userId: string, newRole: UserRole, clubId?: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, role: newRole, clubId: clubId || u.clubId } : u))
    );
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole, clubId: clubId || prev.clubId }));
    }
  };

  const handleAddUserFromAthlete = (athlete: Athlete, role: UserRole, clubId?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: athlete.fullName,
      email: `${athlete.fullName.toLowerCase().replace(/\s+/g, '.')}@pickle4all.vn`,
      role,
      avatar: athlete.avatarUrl,
      phone: athlete.phone,
      clubId: clubId || athlete.clubId,
    };
    setUsers(prev => [newUser, ...prev]);
  };

  // Batch Update Athletes' Club
  const handleBatchUpdateAthletesClub = (clubId: string, clubName: string, selectedAthleteIds: string[]) => {
    setAthletes(prev =>
      prev.map(ath => {
        if (selectedAthleteIds.includes(ath.id)) {
          return { ...ath, clubId, clubName };
        } else if (ath.clubId === clubId) {
          return { ...ath, clubId: '', clubName: 'Tự do' };
        }
        return ath;
      })
    );
    setClubs(prev =>
      prev.map(c => (c.id === clubId ? { ...c, memberCount: selectedAthleteIds.length } : c))
    );
  };

  // Trigger Notification helper with in-app floating banner
  const triggerNotification = (
    title: string,
    message: string,
    type: PushNotification['type'] = 'tournament',
    priority: PushNotification['priority'] = 'normal'
  ) => {
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      priority,
      timestamp: 'Vừa xong',
      read: false,
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);

    // Auto dismiss toast after 4.5 seconds
    setTimeout(() => {
      setActiveToast(prev => (prev?.id === newNotif.id ? null : prev));
    }, 4500);
  };

  // Quick simulate push alert
  const handleQuickSimulateAlert = () => {
    triggerNotification(
      '⚡ Thông báo đẩy từ BQT NESA 333',
      'Đã cập nhật lịch thi đấu vòng bán kết trên Sân Trung Tâm A. VĐV vui lòng có mặt trước 15 phút.',
      'match_alert',
      'urgent'
    );
  };

  // Club Handlers
  const handleAddClub = (newClub: ClubGroup) => {
    setClubs(prev => [newClub, ...prev]);
  };

  const handleUpdateClub = (updatedClub: ClubGroup) => {
    setClubs(prev => prev.map(c => (c.id === updatedClub.id ? updatedClub : c)));
  };

  const handleDeleteClub = (clubId: string) => {
    setClubs(prev => prev.filter(c => c.id !== clubId));
  };

  // Athlete Handlers
  const handleAddAthlete = (newAthlete: Athlete) => {
    setAthletes(prev => [newAthlete, ...prev]);
  };

  const handleUpdateAthlete = (updatedAthlete: Athlete) => {
    setAthletes(prev => prev.map(a => (a.id === updatedAthlete.id ? updatedAthlete : a)));
  };

  const handleDeleteAthlete = (athleteId: string) => {
    setAthletes(prev => prev.filter(a => a.id !== athleteId));
  };

  const handleResetDefaultAthletes = () => {
    setAthletes(INITIAL_ATHLETES);
    triggerNotification(
      '🔄 Đã khôi phục danh sách VĐV mẫu',
      'Đã nạp lại danh sách VĐV đầy đủ chỉ số ELO, DUPR, chiều cao, cân nặng và hồ sơ chuẩn.',
      'tournament'
    );
  };

  // Tournament Handlers
  const handleAddTournament = (newTour: Tournament) => {
    setTournaments(prev => [newTour, ...prev]);
  };

  const handleUpdateTournament = (updatedTour: Tournament) => {
    setTournaments(prev => prev.map(t => (t.id === updatedTour.id ? updatedTour : t)));
  };

  // Treasury Handlers
  const handleAddTreasuryRecord = (record: TreasuryRecord) => {
    setTreasury(prev => [record, ...prev]);
  };

  // Bet Pick Handler
  const handlePlaceBetPick = (betId: string, teamId: string, points: number) => {
    setBets(prev =>
      prev.map(b => {
        if (b.id !== betId) return b;
        const isTeam1 = b.team1.id === teamId;
        return {
          ...b,
          team1: { ...b.team1, votes: isTeam1 ? b.team1.votes + 1 : b.team1.votes },
          team2: { ...b.team2, votes: !isTeam1 ? b.team2.votes + 1 : b.team2.votes },
          totalPoolPoints: b.totalPoolPoints + points,
          picks: [
            ...b.picks,
            {
              userId: currentUser.id,
              userName: currentUser.name,
              pickTeamId: teamId,
              pointsWagered: points,
              timestamp: new Date().toLocaleTimeString('vi-VN'),
            },
          ],
        };
      })
    );
    triggerNotification(
      'Dự đoán thành công',
      `Bạn đã bình chọn cho đội trong trận đấu với ${points.toLocaleString()} điểm MVP.`,
      'tournament'
    );
  };

  // News Handlers
  const handleAddNews = (article: NewsArticle) => {
    setNews(prev => [article, ...prev]);
  };

  const handleUpdateNews = (article: NewsArticle) => {
    setNews(prev => prev.map(n => (n.id === article.id ? article : n)));
  };

  const handleDeleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  // Notifications Handlers
  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        currentUser={currentUser}
        users={users}
        onSelectUser={setCurrentUser}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenRoleManagement={() => setIsRoleManagementOpen(true)}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
        activeTab={activeTab}
        onNavigate={setActiveTab}
      />

      {/* Main Tab Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdminUnlocked={isAdminUnlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            athletes={athletes}
            clubs={clubs}
            tournaments={tournaments}
            notifications={notifications}
            onNavigate={setActiveTab}
            onQuickSimulateAlert={handleQuickSimulateAlert}
          />
        )}

        {activeTab === 'tournaments' && (
          <TournamentsView
            tournaments={tournaments}
            athletes={athletes}
            currentUser={currentUser}
            onAddTournament={handleAddTournament}
            onUpdateTournament={handleUpdateTournament}
            onTriggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'athletes' && (
          <AthletesView
            athletes={athletes}
            clubs={clubs}
            currentUser={currentUser}
            onAddAthlete={handleAddAthlete}
            onUpdateAthlete={handleUpdateAthlete}
            onDeleteAthlete={handleDeleteAthlete}
            onResetDefaultAthletes={handleResetDefaultAthletes}
            onTriggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'clubs' && (
          <ClubsView
            clubs={clubs}
            athletes={athletes}
            currentUser={currentUser}
            onAddClub={handleAddClub}
            onUpdateClub={handleUpdateClub}
            onDeleteClub={handleDeleteClub}
            onBatchUpdateAthletesClub={handleBatchUpdateAthletesClub}
            onTriggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsLeaderboardView
            athletes={athletes}
            tournaments={tournaments}
          />
        )}

        {activeTab === 'news' && (
          <NewsView
            news={news}
            currentUser={currentUser}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onTriggerNotification={triggerNotification}
          />
        )}

        {activeTab === 'treasury' && (
          <TreasuryBetsView
            treasury={treasury}
            bets={bets}
            currentUser={currentUser}
            isAdminUnlocked={isAdminUnlocked}
            onSetAdminUnlocked={setIsAdminUnlocked}
            onAddTreasuryRecord={handleAddTreasuryRecord}
            onPlaceBetPick={handlePlaceBetPick}
            onTriggerNotification={triggerNotification}
          />
        )}
      </main>

      {/* Floating Push Toast Alert Notification */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-2xl flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {activeToast.title}
                </h5>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs font-bold ml-2"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 font-medium">
                {activeToast.message}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
                <span>THÔNG BÁO ĐẨY REALTIME</span>
                <span className="text-slate-400">{activeToast.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Role Delegation & Access Control Center */}
      <RoleManagementModal
        isOpen={isRoleManagementOpen}
        onClose={() => setIsRoleManagementOpen(false)}
        currentUser={currentUser}
        users={users}
        clubs={clubs}
        athletes={athletes}
        onUpdateUserRole={handleUpdateUserRole}
        onAddUserFromAthlete={handleAddUserFromAthlete}
        onTriggerNotification={triggerNotification}
      />

      {/* Push Notifications Center Slide-Over */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        currentUser={currentUser}
        onSendNotification={(title, msg, type, priority) => triggerNotification(title, msg, type, priority)}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onClearNotifications={handleClearNotifications}
        onNavigateTab={tab => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-slate-900 font-display text-base">
              PICKLE <span className="text-emerald-600">4 ALL</span>
            </span>
            <span>•</span>
            <span className="text-slate-600">Hệ Thống Quản Lý Thể Thao & Giải Đấu Quốc Tế (Tham khảo 333.nesagroups.com)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span>Bảo mật nhóm mã hóa SHA-256</span>
            <span>•</span>
            <span>Bốc thăm xếp lịch chống 2 trận liền</span>
            <span>•</span>
            <span>Hồ sơ VĐV xuất PDF</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
