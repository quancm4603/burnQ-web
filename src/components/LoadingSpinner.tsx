import { chakra } from '@chakra-ui/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { Spinner, Text } from '@chakra-ui/react';

// Tạo một ChakraBox từ motion.div
const MotionBox = chakra(motion.div, {
  shouldForwardProp: isValidMotionProp,
});

export default function LoadingSpinner() {
  return (
    <MotionBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" } as any}
    >
      <Spinner size="xl" color="blue.500" />
      <Text mt={4} fontSize="xl">Đang tải, vui lòng chờ...</Text>
    </MotionBox>
  );
}
