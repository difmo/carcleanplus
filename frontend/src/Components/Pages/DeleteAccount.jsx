import React, { useState } from "react";
import { FaTrashAlt, FaLock, FaEnvelope, FaExclamationTriangle, FaCheckCircle, FaSpinner } from "react-icons/fa";

const BACKEND_URL = "https://carcleanplus-backend.vercel.app/api";

function DeleteAccount() {
  const [step, setStep] = useState("form"); // form | confirm | success | error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Step 1: Login to get token
      const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (!loginRes.ok || !loginData.token) {
        throw new Error(loginData.message || "Invalid email or password.");
      }

      // Step 2: Delete account using token
      const deleteRes = await fetch(`${BACKEND_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginData.token}`,
        },
      });
      const deleteData = await deleteRes.json();

      if (!deleteRes.ok) {
        throw new Error(deleteData.message || "Failed to delete account.");
      }

      setStep("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-4">
            <FaTrashAlt className="text-red-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delete Account</h1>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Permanently remove your Car Clean Plus account and all associated data.
          </p>
        </div>

        {/* FORM STEP */}
        {step === "form" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.06)] p-8">
            {/* Warning Banner */}
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <FaExclamationTriangle className="text-red-500 text-sm shrink-0 mt-0.5" />
              <div className="text-xs text-red-700 leading-relaxed">
                <strong>This action is irreversible.</strong> Deleting your account will permanently erase your
                profile, booking history, and all personal data from our servers.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold tracking-wide transition-all"
              >
                Continue to Delete
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-5">
              Changed your mind?{" "}
              <a href="/" className="text-[#0052cc] font-semibold hover:underline">
                Go back to homepage
              </a>
            </p>
          </div>
        )}

        {/* CONFIRM STEP */}
        {step === "confirm" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.06)] p-8 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaExclamationTriangle className="text-red-500 text-xl" />
            </div>
            <h2 className="text-lg font-black text-gray-900 mb-2">Are you absolutely sure?</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              You are about to permanently delete the account associated with{" "}
              <strong className="text-gray-700">{email}</strong>. This cannot be undone.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <FaTrashAlt className="text-xs" />
                    Yes, Delete My Account
                  </>
                )}
              </button>
              <button
                onClick={() => setStep("form")}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.06)] p-8 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaCheckCircle className="text-emerald-500 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Account Deleted</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Your account and all associated data have been permanently removed from our systems.
              We're sorry to see you go.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 rounded-xl bg-[#0052cc] text-white text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Back to Homepage
            </a>
          </div>
        )}

        {/* ERROR STEP */}
        {step === "error" && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_35px_rgba(0,82,204,0.06)] p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Something Went Wrong</h2>
            <p className="text-sm text-red-500 leading-relaxed mb-6">{errorMsg}</p>
            <button
              onClick={() => { setStep("form"); setErrorMsg(""); }}
              className="inline-block px-6 py-3 rounded-xl bg-[#0052cc] text-white text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Need help? Contact us at{" "}
          <a href="mailto:carcleanplusofficial@gmail.com" className="text-[#0052cc] hover:underline font-medium">
            carcleanplusofficial@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default DeleteAccount;
