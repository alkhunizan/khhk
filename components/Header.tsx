import React from 'react';
import type { User } from '../types';
import { GoogleIcon } from './GoogleIcon';

interface HeaderProps {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onSignIn, onSignOut }) => {
  return (
    <header className="bg-teal-600 text-white shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <div className="text-center md:text-right">
          <h1 className="text-3xl md:text-4xl font-amiri font-bold">الدورية الشهرية للأسرة</h1>
          <p className="text-teal-100 mt-1 hidden md:block">نسأل الله أن يديم جمعنا على خير</p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold">{user.name}</p>
                <p className="text-sm text-teal-200 hidden md:block">{user.email}</p>
              </div>
              <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white"/>
              <button
                onClick={onSignOut}
                className="bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors"
              >
                خروج
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <GoogleIcon />
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </header>
  );
};