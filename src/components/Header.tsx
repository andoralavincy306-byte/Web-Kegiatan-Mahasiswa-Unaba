import React, { useState } from 'react';
import { PageType, StudentProfile } from '../types';
import { GraduationCap, Menu, X, User, Home, Calendar, Lock, Award } from 'lucide-react';

interface HeaderProps {
  activePage: PageType;
  onChangePage: (page: PageType) => void;
  student: StudentProfile;
}

export default function Header({ activePage, onChangePage, student }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { page: 'HOME' as PageType, label: 'Beranda', icon: Home },
    { page: 'ACTIVITIES' as PageType, label: 'Kegiatan', icon: Calendar },
    { page: 'PROFILE' as PageType, label: 'Pendaftaran Saya', icon: User },
    { page: 'ADMIN' as PageType, label: 'Admin', icon: Lock },
  ];

  const handleNavClick = (page: PageType) => {
    onChangePage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="campus-header" className="sticky top-0 z-50 w-full border-b border-univ-blue-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo and Campus Brand */}
        <div 
          onClick={() => handleNavClick('HOME')}
          className="flex cursor-pointer items-center space-x-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-univ-blue-800 text-univ-orange-500 shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-univ-blue-800 sm:text-xl">
              UAB <span className="text-univ-orange-500">Student Portal</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
              Universitas Anak Bangsa
            </p>
          </div>
        </div>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page || (item.page === 'ACTIVITIES' && activePage === 'DETAILS');
            return (
              <button
                key={item.page}
                id={`nav-btn-${item.page.toLowerCase()}`}
                onClick={() => handleNavClick(item.page)}
                className={`group flex items-center space-x-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-univ-blue-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-slate-100 hover:text-univ-blue-800'
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-univ-orange-500' : 'text-gray-400 group-hover:text-univ-blue-800'
                }`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Student Indicator (Desktop Only) */}
        <div className="hidden lg:flex items-center space-x-4 border-l border-gray-200 pl-4">
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900">{student.name}</p>
            <p className="text-[10px] font-mono text-gray-500">NIM: {student.nim}</p>
          </div>
          <div 
            onClick={() => handleNavClick('PROFILE')}
            className="flex cursor-pointer items-center space-x-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 transition-all hover:bg-slate-100"
          >
            <User className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Akun Saya</span>
          </div>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-slate-100 hover:text-univ-blue-800 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-gray-100 bg-white px-4 py-3 shadow-lg">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page || (item.page === 'ACTIVITIES' && activePage === 'DETAILS');
              return (
                <button
                  key={item.page}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-univ-blue-800 text-white'
                      : 'text-gray-600 hover:bg-slate-50 hover:text-univ-blue-805'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-univ-orange-500' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Student Profile Quick View in Mobile Drawer */}
          <div className="mt-4 border-t border-gray-100 pt-4 pb-2">
            <div className="flex items-center space-x-3 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-univ-blue-100 text-univ-blue-800 font-bold uppercase">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.department}</p>
                <p className="text-[10px] font-mono text-gray-400">NIM: {student.nim}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
