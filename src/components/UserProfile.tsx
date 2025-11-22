import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { LogOut, X } from 'lucide-react';

export function UserProfile() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const email = user?.email || '';
    const initial = email.charAt(0).toUpperCase();
    const displayName = user?.displayName || email.split('@')[0];

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        auth.signOut();
    };

    return (
        <div className="absolute top-4 right-4 z-50" ref={menuRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-medium shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                    initial
                )}
            </button>

            {/* Popup Card */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#eef2f6] rounded-3xl shadow-2xl border border-white/50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-3 right-3 p-1 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-6 flex flex-col items-center text-center">
                        <p className="text-sm text-gray-600 font-medium mb-6">{email}</p>

                        {/* Large Avatar */}
                        <div className="relative mb-3">
                            <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-medium shadow-xl">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl text-gray-800 font-normal mb-6">Hi, {displayName}!</h3>

                        {/* Sign Out Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
                        >
                            <LogOut size={18} />
                            Sign out
                        </button>

                        <div className="mt-6 flex gap-2 text-[10px] text-gray-500">
                            <a href="#" className="hover:underline">Privacy Policy</a>
                            <span>•</span>
                            <a href="#" className="hover:underline">Terms of Service</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
