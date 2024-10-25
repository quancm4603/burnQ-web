import dotenv from "dotenv";

dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_END_POINT: process.env.API_END_POINT,
  },
};

export default nextConfig;
