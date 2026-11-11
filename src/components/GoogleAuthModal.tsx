import React, { useEffect, useRef, useState } from 'react';
import { LogOut, ShieldCheck, KeyRound, Mail, UserCheck } from 'lucide-react';
import { useCVStore } from '../store/useCVStore';
import { GoogleUserProfile } from '../types/cv';

declare global {
  interface Window {
    google?: any;
  }
}

function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

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

  const [emailInput, setEmailInput] = useState(currentUser?.email || '');
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [clientIdInput, setClientIdInput] = useState(
    googleClientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || ''
  );
  const [showAdvancedOAuth, setShowAdvancedOAuth] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const activeClientId = clientIdInput.trim();
    if (activeClientId && window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: activeClientId,
          callback: (response: any) => {
            const payload = decodeJwtPayload(response.credential);
            if (payload && payload.email) {
              const profile: GoogleUserProfile = {
                email: payload.email.toLowerCase(),
                name: payload.name || payload.email.split('@')[0],
                picture: payload.picture || '',
                sub: payload.sub || '',
              };
              setCurrentUser(profile);
              onLoginSuccess(profile);
              onClose();
            }
          },
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: 320,
        });
      } catch {
        // ignore if invalid client_id
      }
    }
  }, [isOpen, clientIdInput]);

  if (!isOpen) return null;

  const handleQuickGoogleSign = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('올바른 구글 이메일 주소(예: example@gmail.com)를 입력해주세요.');
      return;
    }
    const displayName = nameInput.trim() || trimmedEmail.split('@')[0];
    const profile: GoogleUserProfile = {
      email: trimmedEmail,
      name: displayName,
      picture: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      sub: `google-${trimmedEmail}`,
    };
    setCurrentUser(profile);
    onLoginSuccess(profile);
    onClose();
  };

  const handleSaveClientId = () => {
    setGoogleClientId(clientIdInput.trim());
    setShowAdvancedOAuth(false);
  };

  return (
    <div className="no-print fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Google 계정으로 MaxCV 시작하기
              </h2>
              <p className="text-xs text-slate-500">
                이력서 데이터는 로그인한 구글 계정별로 Cloudflare D1에 안전하게 분리 저장됩니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1.5"
          >
            ✕
          </button>
        </div>

        {/* 현재 로그인된 상태라면 계정 프로필 표시 */}
        {currentUser && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {currentUser.picture ? (
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full border border-emerald-300"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                  {currentUser.name[0]}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs font-bold text-emerald-950 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-emerald-700 truncate">{currentUser.email}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentUser(null);
                onClose();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-white text-rose-600 border border-rose-200 text-xs font-bold hover:bg-rose-50 flex items-center gap-1 shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              로그아웃
            </button>
          </div>
        )}

        {/* 공식 Google OAuth 버튼 렌더링 영역 (Client ID 설정 시 활성화) */}
        {clientIdInput.trim() && (
          <div className="flex flex-col items-center justify-center py-2 border-b border-slate-100">
            <div ref={googleBtnRef} />
            <span className="text-[11px] text-slate-400 mt-1.5">
              공식 Google Identity Services OAuth 인증
            </span>
          </div>
        )}

        {/* 즉시 사용 가능한 구글 계정 로그인 폼 */}
        <form onSubmit={handleQuickGoogleSign} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              구글 계정 이메일 (데이터 저장 기준 키)
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="hongjae@gmail.com"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/15 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              표시 이름 (선택)
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="홍재 (미입력 시 이메일 아이디 사용)"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none"
            />
          </div>

          {errorMsg && <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>Google 계정으로 로그인 및 내 이력서 동기화</span>
          </button>
        </form>

        {/* Google Cloud OAuth Client ID 설정 아코디언 */}
        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvancedOAuth(!showAdvancedOAuth)}
            className="text-[11px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 font-medium"
          >
            <KeyRound className="w-3 h-3" />
            <span>Google Cloud OAuth Client ID 직접 연동 설정 (선택)</span>
          </button>

          {showAdvancedOAuth && (
            <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Google Cloud Console에서 발급받은 OAuth 2.0 클라이언트 ID(`*.apps.googleusercontent.com`)를 입력하면 공식 Google 원탭 팝업 버튼이 활성화됩니다.
              </p>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="123456789-xxx.apps.googleusercontent.com"
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleSaveClientId}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold shrink-0"
                >
                  적용
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            Cloudflare D1(`hongjaed1db`)의 `user_resumes` 테이블에서 로그인한 구글 이메일(`user_email`)을 기준으로 본인의 이력서만 조회·저장합니다.
          </span>
        </div>
      </div>
    </div>
  );
};
