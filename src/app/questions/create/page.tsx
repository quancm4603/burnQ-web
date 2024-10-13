"use client";

import { useState, useRef } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
VStack,
  HStack,
  Text,
  Select,
  Textarea,
  Checkbox,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useQuestionStore } from "../../../stores/questionStore";
import { useRouter } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const mathSymbols = [
  { symbol: "+", latex: "+" },
  { symbol: "-", latex: "-" },
  { symbol: "×", latex: "\\times" },
  { symbol: "÷", latex: "\\div" },
  { symbol: "=", latex: "=" },
  { symbol: "≠", latex: "\\neq" },
  { symbol: "≈", latex: "\\approx" },
  { symbol: ">", latex: ">" },
  { symbol: "<", latex: "<" },
  { symbol: "≥", latex: "\\geq" },
  { symbol: "≤", latex: "\\leq" },
  { symbol: "π", latex: "\\pi" },
  { symbol: "√", latex: "\\sqrt{}" },
  { symbol: "x²", latex: "^2" },
  { symbol: "xⁿ", latex: "^{}" },
  { symbol: "∑", latex: "\\sum" },
  { symbol: "∫", latex: "\\int" },
  { symbol: "∂", latex: "\\partial" },
  { symbol: "sin", latex: "\\sin" },
  { symbol: "cos", latex: "\\cos" },
  { symbol: "tan", latex: "\\tan" },
  { symbol: "log", latex: "\\log" },
  { symbol: "ln", latex: "\\ln" },
  { symbol: "lim", latex: "\\lim_{x \\to }" },
  { symbol: "∞", latex: "\\infty" },
  { symbol: "°", latex: "^\\circ" },
  { symbol: "Δ", latex: "\\Delta" },
  { symbol: "μ", latex: "\\mu" },
  { symbol: "ρ", latex: "\\rho" },
  { symbol: "λ", latex: "\\lambda" },
  { symbol: "→", latex: "\\rightarrow" },
  { symbol: "←", latex: "\\leftarrow" },
  { symbol: "↔", latex: "\\leftrightarrow" },
  { symbol: "Phân số", latex: "\\frac{a}{b}" },
];

export default function CreateQuestion() {
  const [question, setQuestion] = useState({
    subject: "",
    content: "",
    chapter: "",
    difficulty: "",
    answers: ["", ""],
    correctAnswer: 0,
  });
  const [showSymbols, setShowSymbols] = useState(false);
  const { addQuestion } = useQuestionStore();
  const router = useRouter();
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion({ ...question, content: e.target.value });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...question.answers];
    newAnswers[index] = value;
    setQuestion({ ...question, answers: newAnswers });
  };

  const handleAddAnswer = () => {
    setQuestion({ ...question, answers: [...question.answers, ""] });
  };

  const handleSubmit = () => {
    if (
      !question.subject ||
      !question.content ||
      !question.chapter ||
      !question.difficulty
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    addQuestion({ ...question, id: Date.now() });
    toast({
      title: "Thành công",
      description: "Câu hỏi đã được tạo",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    router.push("/questions");
  };

  const insertSymbol = (latex: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = question.content;

      // Kiểm tra xem con trỏ có đang nằm trong cặp dấu $$ không
      const beforeCursor = text.substring(0, start);
      const afterCursor = text.substring(end);
      const lastDollarBeforeCursor = beforeCursor.lastIndexOf("$$");
      const nextDollarAfterCursor = afterCursor.indexOf("$$");
      const isInsideMathBlock =
        lastDollarBeforeCursor !== -1 &&
        nextDollarAfterCursor !== -1 &&
        beforeCursor.substring(lastDollarBeforeCursor).split("$$").length % 2 === 0;

      let newText: string;
      let newCursorPosition: number;

      if (isInsideMathBlock) {
        // Nếu con trỏ đang trong cặp $$, chỉ chèn latex
        newText = beforeCursor + latex + afterCursor;
        newCursorPosition = start + latex.length;
      } else {
        // Nếu con trỏ không trong cặp $$, bọc latex trong $$
        newText = beforeCursor + "$" + latex + "$" + afterCursor;
        newCursorPosition = start + latex.length + 1; // +2 để đặt con trỏ trước $$ cuối cùng
      }

      setQuestion({ ...question, content: newText });

      // Đặt lại vị trí con trỏ
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  return (
    <Box maxWidth="800px" margin="auto" padding={4}>
      <Heading mb={4}>Tạo câu hỏi</Heading>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Select
            placeholder="Chọn danh mục"
            value={question.subject}
            onChange={(e) =>
              setQuestion({ ...question, subject: e.target.value })
            }
          >
            <option value="Toán">Toán</option>
            <option value="Lý">Lý</option>
            <option value="Hóa">Hóa</option>
          </Select>

          <Select
            placeholder="Chọn khối lớp"
            value={question.chapter}
            onChange={(e) =>
              setQuestion({ ...question, chapter: e.target.value })
            }
          >
            <option value="10">Lớp 10</option>
            <option value="11">Lớp 11</option>
            <option value="12">Lớp 12</option>
          </Select>
        </HStack>

        <Button onClick={() => setShowSymbols(!showSymbols)}>
          Trợ giúp nhập biểu thức
        </Button>
        {showSymbols && (
          <Wrap spacing={2} mb={2}>
            {mathSymbols.map((item, index) => (
              <WrapItem key={index}>
                <Button size="sm" onClick={() => insertSymbol(item.latex)}>
                  {item.symbol}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        )}

        <Textarea
          ref={textareaRef}
          placeholder="Nhập câu hỏi (Sử dụng $...$ cho công thức toán học)"
          value={question.content}
          onChange={handleContentChange}
          height="150px"
        />

        <Box border="1px solid" borderColor="gray.200" p={2} borderRadius="md">
          <Text fontWeight="bold">Preview:</Text>
          {question.content
            .split(/($$[\s\S]+?$$|\$[\s\S]+?\$)/)
            .map((part, index) => {
              if (part.startsWith("$$") && part.endsWith("$$")) {
                return <BlockMath key={index} math={part.slice(2, -2)} />;
              } else if (part.startsWith("$") && part.endsWith("$")) {
                return <InlineMath key={index} math={part.slice(1, -1)} />;
              } else {
                return <span key={index}>{part}</span>;
              }
            })}
        </Box>

        <Heading size="md" mb={4}>
          Tạo câu trả lời
        </Heading>
        <Wrap spacing={4}>
          {question.answers.map((answer, index) => (
            <WrapItem key={index} width="calc(50% - 8px)">
              <HStack width="100%">
                <Checkbox
                  isChecked={question.correctAnswer === index}
                  onChange={() =>
                    setQuestion({ ...question, correctAnswer: index })
                  }
                />
                <Input
                  placeholder={`Câu trả lời ${index + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  flex={1}
                />
              </HStack>
            </WrapItem>
          ))}
        </Wrap>
        <Button mt={4} onClick={handleAddAnswer}>
          Thêm câu trả lời
        </Button>

        <Select
          placeholder="Chọn độ khó"
          value={question.difficulty}
          onChange={(e) =>
            setQuestion({ ...question, difficulty: e.target.value })
          }
        >
          <option value="Dễ">Dễ</option>
          <option value="Trung bình">Trung bình</option>
          <option value="Khó">Khó</option>
        </Select>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Tạo câu hỏi
        </Button>
      </VStack>
    </Box>
  );
}