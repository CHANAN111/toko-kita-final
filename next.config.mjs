/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        // <-- TAMBAHKAN OBJEK BARU INI
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        // <-- TAMBAHAN BARU UNTUK SUPABASE
        // GANTI 'hostname' DI BAWAH INI DENGAN DOMAIN PROYEK SUPABASE ANDA SENDIRI
        protocol: "https",
        hostname: "kqjmjwnousbeunrxxmbv.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
