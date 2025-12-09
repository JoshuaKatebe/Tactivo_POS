import React, { useState } from 'react';
import { attendantsApi } from '@/api/attendants';
import { User, LogIn, Loader2 } from 'lucide-react';

export default function AttendantLogin({ stationId, onLogin, darkMode = false }) {
    const [employeeCode, setEmployeeCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleLogin(e) {
        e.preventDefault();

        if (!employeeCode.trim()) {
            setError('Please enter an employee code');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const attendantData = await attendantsApi.loginByCode(employeeCode, stationId);
            console.log('Attendant logged in:', attendantData);
            onLogin(attendantData);
            setEmployeeCode('');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid employee code or login failed');
        } finally {
            setLoading(false);
        }
    }

    const cardClass = darkMode
        ? "bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg"
        : "bg-white rounded-xl border border-slate-200 p-6 shadow-lg";

    const inputClass = darkMode
        ? "w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        : "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    const buttonClass = darkMode
        ? "w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        : "w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className={cardClass}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <User className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        Attendant Login
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Enter your employee code to begin
                    </p>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label
                        htmlFor="employeeCode"
                        className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                        Employee Code
                    </label>
                    <input
                        id="employeeCode"
                        type="text"
                        placeholder="Enter employee code"
                        value={employeeCode}
                        onChange={(e) => setEmployeeCode(e.target.value)}
                        disabled={loading}
                        autoFocus
                        className={inputClass}
                    />
                </div>

                {error && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border border-red-700/50 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <button type="submit" disabled={loading} className={buttonClass}>
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        <>
                            <LogIn className="w-5 h-5" />
                            Login
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
