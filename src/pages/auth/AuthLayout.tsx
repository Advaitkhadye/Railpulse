import { Outlet } from 'react-router-dom';

export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-4 font-sans">
            <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 ring-1 ring-black/5">
                <div className="p-8 sm:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20 ring-4 ring-slate-50">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="RailPulse Logo" className="w-8 h-8 object-contain" />
                        </div>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
