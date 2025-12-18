"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ChefHat,
  Shield,
  BarChart3,
  ArrowRight,
  Clock,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:h-screen overflow-hidden bg-linear-to-br from-[#cffafe] via-white to-[#fefce8] flex flex-col">
      {/* Navigation */}
      <motion.nav className="px-4 sm:px-6 lg:px-8 py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-linear-to-br from-[#047857] to-[#10b981] rounded-xl flex items-center justify-center shadow-lg"
            >
              <ChefHat className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-linear-to-r from-[#047857] to-[#10b981] bg-clip-text text-transparent">
              FreshCheck
            </span>
          </div>
        </div>
      </motion.nav>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-auto">
        <div className="max-w-7xl w-full py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Food Quality
                <br />
                <span className="bg-linear-to-r from-[#047857] to-[#10b981] bg-clip-text text-transparent">
                  Redefined
                </span>
              </h1>

              <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-gray-600 leading-relaxed">
                Streamline your food safety inspections, maintain quality
                standards, and ensure compliance with our comprehensive
                monitoring solution.
              </p>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-6"
            >
              <motion.div
                transition={{ type: "spring", stiffness: 300 }}
                className=" rounded-2xl p-6 lg:max-w-125  border-gray-100"
              >
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@freshcheck.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 outline-none"
                        required
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
                    >
                      {error}
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-11 bg-linear-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={loading}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer className="px-4 sm:px-6 lg:px-8 py-4 bg-[#064e3b] backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-100 text-sm">
            © 2024 FreshCheck. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-100">
            <a
              href=""
              className="hover:text-white hover:underline transition-colors"
            >
              Privacy
            </a>
            <a
              href=""
              className="hover:text-white hover:underline transition-colors"
            >
              Terms
            </a>
            <a
              href=""
              className="hover:text-white hover:underline transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}