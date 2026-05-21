import { useState } from "react";
import { useMutation } from "@apollo/client/react";

import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

type LoginResponse = {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
    };
  };
};

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { loading }] = useMutation<LoginResponse>(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const { token } = data.login;
      localStorage.setItem("auth_token", token);
      alert("Logged in successfully!");
    },
    onError: (error) => {
      setErrorMsg(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    await login({ variables: { email, password } });
  };

  const currentHour = new Date().getHours();
  let timeOfDay = "Good Morning";
  if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = "Good Afternoon";
  } else if (currentHour >= 17 || currentHour < 4) {
    timeOfDay = "Good Evening";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            <span className="text-[#0B2582] block">{timeOfDay},</span>Welcome
            back!
          </h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-left border border-red-200 font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 text-left">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#0B2582] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="username@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-300 focus:border-[#0B2582] focus:outline-none focus:ring-1 focus:ring-gray-400 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#0B2582] mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-300 focus:border-[#0B2582] focus:outline-none focus:ring-1 focus:ring-gray-400 sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-[#8387AD] px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#0B2582] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-[#8387AD] hover:text-[#0B2582] transition-colors"
              >
                Forgot your password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
