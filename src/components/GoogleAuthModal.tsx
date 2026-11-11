import React, { useEffect, useRef, useState } from 'react';
import { LogOut, KeyRound } from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { GoogleUserProfile } from '../types/cv';

declare global {
  interface Window {
    google?: any;
  }
}

export const DEFAULT_GOOGLE_CLIENT_ID =
  '251812450629-52de9b5uldeel8jvbqc88bsji1tkaa1h.apps.googleusercontent.com';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: GoogleUserProfile) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const currentUser = useCVStore((s) => s.currentUser);
  const googleClientId = useCVStore((s) => s.googleClientId);
  const setCurrentUser = useCVStore((s) => s.setCurrentUser);
  const setGoogleClientId = useCVStore((s) => s.setGoogleClientId);

  const activeClientId =
    googleClientId ||
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID;

  const [clientIdInput, setClientIdInput] = useState(activeClientId);
  const [showConfig, setShowConfig] = useState(false);
  const [loadingPopup, setLoadingPopup] = useState(false);
  const [authError, setAuthError] = useState('');

  const tokenClientRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    setAuthError('');

    if (window.google?.accounts?.oauth2 && activeClientId) {
      try {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            setLoadingPopup(false);
            if (tokenResponse?.error) {
              setAuthError('구글 로그인 인증이 취소되었거나 실패했습니다.');
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const info = await res.json();
                if (info && info.email) {
                  const profile: GoogleUserProfile = {
                    email: info.email.toLowerCase(),
                    name: info.name || info.email.split('@')[0],
                    picture: info.picture || '',
                    sub: info.sub || '',
                  };
                  setCurrentUser(profile);
                  onLoginSuccess(profile);
                  onClose();
                }
              } catch {
                setAuthError('구글 프로필 정보를 가져오는 데 실패했습니다.');
              }
            }
          },
        });
      } catch {
        // ignore init error
      }
    }
  }, [isOpen, activeClientId]);

  if (!isOpen) return null;

  const handleOpenGooglePopup = () => {
    setAuthError('');
    if (tokenClientRef.current) {
      setLoadingPopup(true);
      tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
    } else if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: activeClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const info = await res.json();
              if (info?.email) {
                const profile: GoogleUserProfile = {
                  email: info.email.toLowerCase(),
                  name: info.name || info.email.split('@')[0],
                  picture: info.picture || '',
                  sub: info.sub || '',
                };
                setCurrentUser(profile);
                onLoginSuccess(profile);
                onClose();
              }
            }
          },
        });
        client.requestAccessToken({ prompt: 'select_account' });
      } catch {
        setAuthError('Google 로그인 스크립트를 불러오는 중입니다. 잠시 후 다시 눌러주세요.');
      }
    } else {
      setAuthError('Google 로그인 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-sm w-full p-7 space-y-6 text-center relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-400 hover:text-zinc-800 text-sm font-bold px-1.5"
        >
          ✕
        </button>

        {/* 미니멀 브랜드 로고 */}
        <div className="flex flex-col items-center space-y-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white font-black text-lg flex items-center justify-center shadow-md">
            M
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-zinc-950 tracking-tight">
              MaxCV 시작하기
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Google 계정으로 간편하게 로그인하세요.
            </p>
          </div>
        </div>

        {/* 이미 로그인된 상태일 경우 프로필 표시 */}
        {currentUser ? (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3 text-left">
              {currentUser.picture ? (
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full border border-zinc-200"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.name[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-zinc-500 truncate">{currentUser.email}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleOpenGooglePopup}
                className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-xs font-bold text-zinc-700"
              >
                다른 계정으로 전환
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser(null);
                  onClose();
                }}
                className="py-2.5 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          /* Google OAuth 팝업 호출 메인 버튼 */
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleOpenGooglePopup}
              disabled={loadingPopup}
              className="w-full py-3.5 px-5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
              </div>
              <span>{loadingPopup ? 'Google 로그인 팝업 연결 중...' : 'Google 계정으로 계속하기'}</span>
            </button>

            {authError && (
              <p className="text-xs text-rose-600 font-medium leading-relaxed">{authError}</p>
            )}
          </div>
        )}

        {/* OAuth Client ID 변경 토글 (최소한의 아이콘으로 숨김) */}
        <div className="pt-2 border-t border-zinc-100 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
          >
            <KeyRound className="w-3 h-3" />
            <span>OAuth 클라이언트 설정</span>
          </button>

          {showConfig && (
            <div className="mt-2.5 w-full space-y-2 text-left">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="Google OAuth Client ID"
                  className="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGoogleClientId(clientIdInput.trim());
                    setShowConfig(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 text-white text-[11px] font-bold shrink-0"
                >
                  저장
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
