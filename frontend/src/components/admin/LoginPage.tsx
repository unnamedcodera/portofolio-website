import { motion } from 'framer-motion'
import { useState } from 'react'
import { authAPI } from '../../services/api'

interface LoginPageProps {
  onLoginSuccess: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(username, password)
      localStorage.setItem('admin_token', response.token)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-magnolia via-dun/10 to-magnolia">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-vandyke/5 via-transparent to-walnut/5"></div>

      {/* Full Artistic Doodle Background Layer - Like Banner */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {/* Paint Brush Icons */}
        <motion.div
          className="absolute top-[10%] left-[8%]"
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-vandyke/20">
            <path d="M9.5 2L8 3.5L12.5 8L14 6.5L9.5 2Z" fill="currentColor"/>
            <path d="M8 3.5L3 8.5L4.5 10L9.5 5L8 3.5Z" fill="currentColor"/>
            <path d="M12.5 8L10 10.5L11.5 12L14 9.5L12.5 8Z" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[15%] right-[12%]"
          animate={{
            rotate: [0, -20, 20, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-walnut/25">
            <path d="M9.5 2L8 3.5L12.5 8L14 6.5L9.5 2Z" fill="currentColor"/>
            <path d="M7 13.5L5.5 15L4 16.5L3 17.5L3.5 18.5L4.5 18L6 16.5L7.5 15L7 13.5Z" fill="currentColor"/>
          </svg>
        </motion.div>

        {/* Palette Icons */}
        <motion.div
          className="absolute top-[25%] right-[15%]"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" className="text-dun/30">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13.5 22 15 21 15 19.5C15 18.7 14.7 18 14.5 17.4C14.3 16.9 14 16.5 14 16C14 15.2 14.7 14.5 15.5 14.5H17C19.8 14.5 22 12.3 22 9.5C22 5.4 17.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="7" cy="9" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
            <circle cx="16" cy="10" r="1.5" fill="currentColor"/>
            <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] left-[18%]"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        >
          <svg width="90" height="90" viewBox="0 0 24 24" fill="none" className="text-battleshipgray/25">
            <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C13.5 22 15 21 15 19.5C15 18.7 14.7 18 14.5 17.4C14.3 16.9 14 16.5 14 16C14 15.2 14.7 14.5 15.5 14.5H17C19.8 14.5 22 12.3 22 9.5C22 5.4 17.5 2 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
          </svg>
        </motion.div>

        {/* Pencil/Pen Icons */}
        <motion.div
          className="absolute top-[45%] left-[5%]"
          animate={{
            rotate: [0, 25, -25, 0],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-vandyke/28">
            <path d="M3 21L6 18L18 6L21 3L18 6L6 18L3 21Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2"/>
            <path d="M14.5 5.5L18.5 9.5" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        {/* Star/Sparkle Icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute"
            style={{
              top: `${15 + Math.random() * 70}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 0.5
            }}
          >
            <svg width={50 + i * 5} height={50 + i * 5} viewBox="0 0 24 24" fill="none" className="text-dun/20">
              <path d="M12 2L15 9L22 9L16.5 14L18.5 21L12 16.5L5.5 21L7.5 14L2 9L9 9L12 2Z" fill="currentColor"/>
            </svg>
          </motion.div>
        ))}

        {/* Circle/Ring Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              rotate: i % 2 === 0 ? [0, 360] : [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <svg width={60 + i * 10} height={60 + i * 10} viewBox="0 0 24 24" fill="none" className={i % 3 === 0 ? "text-vandyke/15" : i % 3 === 1 ? "text-walnut/15" : "text-battleshipgray/15"}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.15"/>
            </svg>
          </motion.div>
        ))}

        {/* Triangle/Geometric Icons */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`triangle-${i}`}
            className="absolute"
            style={{
              top: `${25 + Math.random() * 50}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              rotate: [0, 120, 240, 360],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 14 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8
            }}
          >
            <svg width={55 + i * 8} height={55 + i * 8} viewBox="0 0 24 24" fill="none" className="text-dun/18">
              <path d="M12 3L21 20H3L12 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            </svg>
          </motion.div>
        ))}

        {/* Easel/Canvas Icons */}
        <motion.div
          className="absolute top-[30%] left-[25%]"
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="140" height="140" viewBox="0 0 24 24" fill="none" className="text-walnut/20">
            <path d="M6 2L4 8M18 2L20 8" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="5" y="8" width="14" height="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12"/>
            <path d="M5 18L3 22M19 18L21 22" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 18L12 22" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-[35%] right-[20%]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2
          }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-vandyke/22">
            <rect x="4" y="4" width="16" height="14" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
            <path d="M3 4L6 2M21 4L18 2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 18L2 22M20 18L22 22" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </motion.div>
      </div>

      {/* Login Container */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Glassmorphism Card */}
          <motion.div
            className="relative bg-magnolia/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-dun/30 overflow-hidden"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(102, 66, 40, 0.25)" }}
          >
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vandyke via-walnut to-dun" />

            <div className="p-10">
              {/* Minimal Logo/Header */}
              <div className="text-center mb-10">
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-vandyke to-walnut shadow-lg"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                  whileHover={{ 
                    rotate: [0, -10, 10, -10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <span className="text-4xl">🔐</span>
                </motion.div>
                
                <motion.h1 
                  className="text-3xl font-bold text-vandyke mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Welcome Back
                </motion.h1>
                
                <motion.p 
                  className="text-battleshipgray text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Sign in to access your dashboard
                </motion.p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-xs font-semibold text-vandyke uppercase tracking-wider mb-3">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-battleshipgray">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-dun/40 rounded-2xl focus:bg-magnolia focus:border-vandyke focus:outline-none transition-all duration-300 text-vandyke placeholder:text-battleshipgray/50"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-xs font-semibold text-vandyke uppercase tracking-wider mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-battleshipgray">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-dun/40 rounded-2xl focus:bg-magnolia focus:border-vandyke focus:outline-none transition-all duration-300 text-vandyke placeholder:text-battleshipgray/50"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="relative w-full bg-gradient-to-r from-vandyke via-walnut to-vandyke text-white font-semibold py-4 rounded-2xl shadow-lg overflow-hidden group"
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(102, 66, 40, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  disabled={loading}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-walnut via-vandyke to-walnut"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              {/* Footer Info */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-dun/20 rounded-full text-xs text-battleshipgray">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Default: <span className="font-mono font-semibold text-vandyke">admin / admin123</span></span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Floating Elements */}
          <motion.div
            className="mt-6 text-center text-xs text-battleshipgray/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>© 2025 Admin Dashboard. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
