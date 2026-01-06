export function googleLogin() {
  const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/callback`;
  const scope = encodeURIComponent("openid profile email");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const responseType = "code";

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

  window.location.href = url;
}