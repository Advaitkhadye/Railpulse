import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Password Strength State
    const [validations, setValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        setValidations({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    }, [password]);

    const isPasswordValid = Object.values(validations).every(Boolean);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isPasswordValid) {
            return setError('Please meet all password requirements');
        }

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already in use');
            } else {
                setError('Failed to create account');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm text-slate-500 mb-8 font-medium">
                Join RailPulse to start tracking your journeys
            </p>

            <form className="space-y-5 text-left" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-900 placeholder-gray-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm transition-all duration-200"
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-900 placeholder-gray-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm transition-all duration-200"
                    />

                    {/* Password Strength Meter */}
                    {password && (
                        <div className="space-y-2 pt-1">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-500">Password Strength</span>
                                <span className={`text-xs font-bold ${Object.values(validations).filter(Boolean).length <= 2 ? 'text-red-500' :
                                    Object.values(validations).filter(Boolean).length <= 4 ? 'text-yellow-500' :
                                        'text-green-500'
                                    }`}>
                                    {Object.values(validations).filter(Boolean).length <= 2 ? 'Weak' :
                                        Object.values(validations).filter(Boolean).length <= 4 ? 'Medium' :
                                            'Strong'}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ease-out ${Object.values(validations).filter(Boolean).length <= 2 ? 'bg-red-500 w-1/3' :
                                        Object.values(validations).filter(Boolean).length <= 4 ? 'bg-yellow-500 w-2/3' :
                                            'bg-green-500 w-full'
                                        }`}
                                />
                            </div>
                            {!isPasswordValid && (
                                <p className="text-[10px] text-slate-400 leading-tight">
                                    Must contain 8+ chars, uppercase, lowercase, number, and special character.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-3 text-slate-900 placeholder-gray-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 sm:text-sm transition-all duration-200"
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !isPasswordValid}
                        className="flex w-full justify-center rounded-xl bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:shadow-slate-900/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none transition-all duration-200"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700 hover:underline decoration-2 underline-offset-2 transition-all">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
