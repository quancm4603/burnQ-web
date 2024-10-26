"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Text, Button, Spinner } from "@chakra-ui/react"; // Thêm Spinner
import { useAuthStore } from "../../stores/authStore";
import ScoreChart from "@/components/ScoreChart";
import { QuestionApi } from "../../../api";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, user, logout, token } = useAuthStore();
  const router = useRouter();
  const questionApi = new QuestionApi();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [isLoggedIn, router, token]);

  if (isLoading) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <Box maxWidth="800px" margin="auto" mt={8}>
      <Heading mb={4}>Dashboard</Heading>
      <Text mb={4}>Welcome, {user?.fullName}!</Text>
      <ScoreChart />
    </Box>
  );
}
