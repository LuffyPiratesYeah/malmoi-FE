import { ClassItem, ScheduleItem, User } from "@/types";

// localStorage helper functions (클라이언트에서만 실행)
const getClassesFromStorage = (): ClassItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('malmoi-classes');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveClassesToStorage = (classes: ClassItem[]) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('malmoi-classes', JSON.stringify(classes));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
        }
    }
};

// Initial Mock Data
let users: User[] = [
    {
        id: "user-1",
        email: "kimtaehyun081117@gmail.com",
        name: "디포네",
        userType: "student",
        isTeacher: false,
        verificationStatus: "none",
    },
    {
        id: "student-1",
        email: "student@example.com",
        name: "학생",
        userType: "student",
        isTeacher: false,
        verificationStatus: "none",
    },
    {
        id: "teacher-1",
        email: "teacher@example.com",
        name: "선생님",
        userType: "teacher",
        isTeacher: true,
        verificationStatus: "verified",
    },
];

// Mock credentials
const credentials = [
    { username: "student", password: "1234", userId: "student-1" },
    { username: "teacher", password: "1234", userId: "teacher-1" },
];

// 초기 목 데이터
const initialClasses: ClassItem[] = [
    {
        id: "class-1",
        title: "비즈니스 한국어 - 회의 표현",
        description: "직장에서 바로 사용할 수 있는 회의 관련 표현을 배우고 연습합니다.",
        level: "중급 (TOPIK 3-4)",
        type: "영상 · 25분",
        category: "비즈니스",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
        tutorId: "teacher-1", // 현재 선생님
        tutorName: "선생님",
        details: [
            "회의에서 자주 사용되는 필수 표현을 익힙니다.",
            "회의를 시작할 때 활용할 수 있는 적절한 표현을 익힙니다.",
            "안건을 소개하는 다양한 표현 방식도 함께 연습합니다.",
        ],
    },
    {
        id: "class-2",
        title: "드라마로 배우는 일상 표현",
        description: "인기 드라마 속 대사를 통해 자연스러운 일상 한국어를 배워봅니다.",
        level: "입문 (TOPIK 1-2)",
        type: "영상 · 18분",
        category: "K-Drama",
        image: "https://images.unsplash.com/photo-1517604931442-710c8ef5ad25?auto=format&fit=crop&q=80&w=1000",
        tutorId: "tutor-2",
        tutorName: "박민수 튜터",
    },
    {
        id: "class-3",
        title: "TOPIK II 쓰기 완벽 대비",
        description: "TOPIK II 쓰기 영역의 51번부터 54번까지 문제 유형별 전략을 학습합니다.",
        level: "중급 (TOPIK 3-4)",
        type: "PDF · 45분",
        category: "시험 대비",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000",
        tutorId: "teacher-1", // 현재 선생님
        tutorName: "선생님",
    },
    {
        id: "class-4",
        title: "대학 생활 필수 표현",
        description: "한국 대학에서 필요한 수강신청, 과제 제출, 교수님과의 대화 등을 배웁니다.",
        level: "중급 (TOPIK 3-4)",
        type: "영상 · 30분",
        category: "유학/학업",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000",
        tutorId: "tutor-3",
        tutorName: "이수진 튜터",
    },
];

// localStorage에서 불러오거나 초기 데이터 사용
let classes: ClassItem[] = (() => {
    const stored = getClassesFromStorage();
    if (stored.length > 0) {
        console.log("Loading classes from localStorage:", stored.length);
        return stored;
    }
    console.log("Using initial classes");
    return [...initialClasses];
})();

let schedules: ScheduleItem[] = [
    {
        id: "sch-1",
        classId: "class-1",
        date: "2025-10-16",
        time: "20:00",
        status: "scheduled",
        studentId: "user-1",
        class: classes[0],
    },
    {
        id: "sch-2",
        classId: "class-1",
        date: "2025-10-18",
        time: "21:00",
        status: "scheduled",
        studentId: "student-1", // 학생 계정이 class-1 수업 수강 중
        class: classes[0],
    },
    {
        id: "sch-3",
        classId: "class-3",
        date: "2025-10-20",
        time: "19:00",
        status: "scheduled",
        studentId: "student-1", // 학생 계정이 class-3 수업도 수강 중
        class: classes[2],
    },
];

// Mock Database Functions
export const db = {
    auth: {
        login: async (username: string, password: string) => {
            const credential = credentials.find(
                (c) => c.username === username && c.password === password
            );
            if (!credential) {
                return null;
            }
            const user = users.find((u) => u.id === credential.userId);
            return user || null;
        },
    },
    user: {
        getCurrent: async () => users[0], // Simulating single user session for now
        update: async (id: string, data: Partial<User>) => {
            const index = users.findIndex((u) => u.id === id);
            if (index !== -1) {
                users[index] = { ...users[index], ...data };
                return users[index];
            }
            return null;
        },
    },
    class: {
        getAll: async () => {
            console.log("Getting all classes, count:", classes.length);
            return [...classes];
        },
        getById: async (id: string) => classes.find((c) => c.id === id) || null,
        create: async (data: Omit<ClassItem, "id" | "tutorId" | "tutorName">) => {
            console.log("DB.class.create 호출됨");
            console.log("현재 classes 배열 길이:", classes.length);

            // Get current user (who is creating the class)
            const currentUser = await db.user.getCurrent();
            console.log("Current user:", currentUser);

            const newClass: ClassItem = {
                ...data,
                id: `class-${Date.now()}`, // Generate unique ID with timestamp
                tutorId: currentUser.id,
                tutorName: currentUser.name,
            };

            console.log("New class object:", newClass);
            classes.push(newClass);
            console.log("추가 후 classes 배열 길이:", classes.length);

            return newClass;
        },
    },
    schedule: {
        getAll: async () => [...schedules],
        create: async (classId: string, date: string, time: string) => {
            const cls = classes.find((c) => c.id === classId);
            if (!cls) throw new Error("Class not found");

            const newSchedule: ScheduleItem = {
                id: Math.random().toString(36).substr(2, 9),
                classId,
                date,
                time,
                status: "scheduled",
                studentId: "user-1",
                class: cls,
            };
            schedules.push(newSchedule);
            return newSchedule;
        },
    },
};
