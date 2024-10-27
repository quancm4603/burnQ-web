"use client";

import { useState, useRef, useEffect } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { useQuestionStore } from "../../../stores/questionStore";
import { useRouter } from "next/navigation";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { ChapterApi, ChapterResponse, QuestionApi } from "../../../../api";
import { useAuthStore } from "@/stores/authStore";

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
interface Subject {
  id: number;
  name: string | null;
  chapters: ChapterResponse[];
}
export default function CreateQuestion() {
  const [question, setQuestion] = useState({
    content: "",
    chapterId: 0,
    difficultyId: 0,
    answers: ["", ""],
    correctAnswers: [] as number[],
    blobUrls: [],
  });
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [showSymbols, setShowSymbols] = useState(false);
  const { addQuestion } = useQuestionStore();
  const router = useRouter();
  const toast = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const questionApi = new QuestionApi();
  const chapterApi = new ChapterApi();
  const { token } = useAuthStore();

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

  const handleRemoveAnswer = (index: number) => {
    const newAnswers = question.answers.filter((_, i) => i !== index);
    const newCorrectAnswers = question.correctAnswers.filter(
      (i) => i !== index
    );
    setQuestion({
      ...question,
      answers: newAnswers,
      correctAnswers: newCorrectAnswers,
    });
  };

  const insertSymbol = (latex: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const text = question.content;

      const beforeCursor = text.substring(0, start);
      const afterCursor = text.substring(end);

      const lastDollarBeforeCursor = beforeCursor.lastIndexOf("$");
      const nextDollarAfterCursor = afterCursor.indexOf("$");

      // Kiểm tra nếu con trỏ nằm trong cặp dấu $
      const isInsideMathBlock =
        lastDollarBeforeCursor !== -1 &&
        nextDollarAfterCursor !== -1 &&
        beforeCursor.substring(lastDollarBeforeCursor).split("$").length % 2 ===
          0;

      // Kiểm tra xem con trỏ có nằm trong cặp {} của frac không
      const lastFracIndex = beforeCursor.lastIndexOf("\\frac");
      const lastBraceBeforeCursor = beforeCursor.lastIndexOf("{");
      const isInsideFrac =
        lastFracIndex !== -1 && lastBraceBeforeCursor > lastFracIndex;

      let newText: string;
      let newCursorPosition: number;

      if (isInsideMathBlock) {
        if (isInsideFrac && latex === "\\frac") {
          latex = "\\cfrac"; // Chuyển thành \cfrac nếu đang trong {}
        }
        newText = beforeCursor + latex + afterCursor;
        newCursorPosition = start + latex.length;
      } else {
        // Nếu không, thêm cặp dấu $ mới
        newText = beforeCursor + "$" + latex + "$" + afterCursor;
        newCursorPosition = start + latex.length + 1; // +1 để đặt con trỏ trước dấu $ cuối
      }

      setQuestion({ ...question, content: newText });

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart =
            textareaRef.current.selectionEnd = newCursorPosition;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  useEffect(() => {
    const fetchSubjectsAndChapters = async () => {
      try {
        const subjectResponse = await chapterApi.apiChapterCurrentGet({
          headers: { Authorization: `Bearer ${token}` },
        });

        const chapters = subjectResponse.data as ChapterResponse[];
        const subjectsMap = new Map<number, Subject>();

        chapters.forEach((chapter) => {
          const { subjectId, subjectName } = chapter;
          if (subjectId && subjectName) {
            if (!subjectsMap.has(subjectId)) {
              subjectsMap.set(subjectId, {
                id: subjectId,
                name: subjectName,
                chapters: [],
              });
            }
            subjectsMap.get(subjectId)!.chapters.push(chapter);
          }
        });

        setSubjects(Array.from(subjectsMap.values()));
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast({
          title: "Error",
          description: "Could not fetch subjects",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSubjectsAndChapters();
    }
  }, [token]);

  const handleSubjectChange = (id: number) => {
    setSubjectId(id);
    const selectedSubject = subjects.find((subject) => subject.id === id);
    setChapters(selectedSubject ? selectedSubject.chapters : []);
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Show loading while submitting
    try {
      const response = await questionApi.apiQuestionCreatePost(question, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        addQuestion(question);
        toast({
          title: "Success",
          description: "Question created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push("/questions");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error creating question:", error);
      toast({
        title: "Error",
        description: "Failed to create question",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // End loading after submit is complete
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={8}>
        <Spinner size="lg" />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="auto" padding={4}>
      <Heading mb={4}>Tạo câu hỏi</Heading>
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Select
            value={subjectId || ""}
            onChange={(e) => handleSubjectChange(Number(e.target.value))}
          >
            <option value="" disabled>
              Chọn môn học
            </option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>

          <Select
            value={question.chapterId || ""}
            onChange={(e) =>
              setQuestion({ ...question, chapterId: Number(e.target.value) })
            }
            isDisabled={!subjectId}
          >
            <option value="" disabled>
              Chọn chương
            </option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
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
                return <Text key={index}>{part}</Text>;
              }
            })}
        </Box>

        <Wrap spacing={4}>
          {question.answers.map((answer, index) => (
            <WrapItem key={index} width="calc(50% - 8px)">
              <HStack width="100%">
                <Checkbox
                  isChecked={question.correctAnswers.includes(index)}
                  onChange={() => {
                    const newCorrectAnswers = question.correctAnswers.includes(
                      index
                    )
                      ? question.correctAnswers.filter((i) => i !== index)
                      : [...question.correctAnswers, index];
                    setQuestion({
                      ...question,
                      correctAnswers: newCorrectAnswers,
                    });
                  }}
                />
                <Input
                  placeholder={`Đáp án ${index + 1}`}
                  value={answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  flex={1}
                />
                <Button
                  size="xs" // Make the button small
                  onClick={() => {
                    const newAnswers = question.answers.filter(
                      (_, i) => i !== index
                    );
                    const newCorrectAnswers = question.correctAnswers.filter(
                      (i) => i !== index
                    );
                    setQuestion({
                      ...question,
                      answers: newAnswers,
                      correctAnswers: newCorrectAnswers,
                    });
                  }}
                  _hover={{ bg: "lightcoral" }}
                  _focus={{ bg: "lightcoral" }}
                >
                  &times; {}
                </Button>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>

        <Button onClick={handleAddAnswer}>Thêm đáp án</Button>

        <Select
          placeholder="Chọn độ khó"
          value={question.difficultyId || ""}
          onChange={(e) =>
            setQuestion({ ...question, difficultyId: Number(e.target.value) })
          }
        >
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </Select>

        <Button colorScheme="teal" onClick={handleSubmit}>
          Tạo câu hỏi
        </Button>
      </VStack>
    </Box>
  );
}
