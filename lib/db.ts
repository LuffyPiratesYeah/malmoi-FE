import { ClassItem, ScheduleItem, User } from "@/types";

// Initial Mock Data
let users: User[] = [
    {
        id: "user-1",
        email: "kimtaehyun081117@gmail.com",
        name: "디포네",
        isTeacher: false,
        verificationStatus: "none",
    },
];

let classes: ClassItem[] = [
    {
        id: "1",
        title: "회의에서 사용하는 핵심 표현",
        description: "실제 회의 상황을 기반으로 회의 시작, 안건 소개, 의견 제시 표현을 연습합니다.",
        level: "중급 (TOPIK 3-4)",
        type: "영상 · 25분",
        category: "비즈니스",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
        tutorId: "tutor-1",
        tutorName: "김지은 튜터",
        details: [
            "실제 회의에서 사용되는 상황을 기반으로 연습을 진행합니다.",
            "회의를 시작할 때 활용할 수 있는 적절한 표현을 익힙니다.",
            "안건을 소개하는 다양한 표현 방식도 함께 연습합니다.",
        ],
    },
    {
        id: "2",
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
        id: "3",
        title: "TOPIK II 쓰기 완벽 대비",
        description: "TOPIK II 쓰기 영역의 51번부터 54번까지 문제 유형별 전략을 학습합니다.",
        level: "중급 (TOPIK 3-4)",
        type: "PDF · 45분",
        category: "시험 대비",
        image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000",
        tutorId: "tutor-1",
        tutorName: "김지은 튜터",
    },
    {
        id: "4",
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

let schedules: ScheduleItem[] = [
    {
        id: "sch-1",
        classId: "1",
        date: "2025-10-16",
        time: "21:00",
        status: "scheduled",
        studentId: "user-1",
        class: classes[0],
    },
    {
        id: "sch-2",
        classId: "2",
        date: "2025-10-16",
        time: "18:30",
        status: "scheduled",
        studentId: "user-1",
        class: classes[1],
    },
];

// Mock Database Functions
export const db = {
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
        getAll: async () => [...classes],
        getById: async (id: string) => classes.find((c) => c.id === id) || null,
        create: async (data: Omit<ClassItem, "id" | "tutorId" | "tutorName">) => {
            const newClass: ClassItem = {
                ...data,
                id: Math.random().toString(36).substr(2, 9),
                tutorId: "user-1", // Current user is creating it
                tutorName: users[0].name,
            };
            classes.push(newClass);
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
