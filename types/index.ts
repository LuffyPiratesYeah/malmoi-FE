export interface User {
    id: string;
    email: string;
    name: string;
    userType: "student" | "teacher";
    isTeacher: boolean;
    profileImage?: string;
    verificationStatus: "none" | "pending" | "verified";
}

export interface ClassItem {
    id: string;
    title: string;
    description: string;
    level: string;
    type: string;
    category: string;
    image: string;
    tutorId: string;
    tutorName: string;
    details?: string[];
}

export interface ScheduleItem {
    id: string;
    classId: string;
    date: string;
    time: string;
    status: "scheduled" | "completed" | "cancelled";
    studentId: string;
    studentName?: string;
    studentEmail?: string;
    class: ClassItem;
}
