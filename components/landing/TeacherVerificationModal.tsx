import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface TeacherVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TeacherVerificationModal({ isOpen, onClose }: TeacherVerificationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center space-y-6">
                {/* Icon */}
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                {/* Title and Description */}
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-900" style={{ wordBreak: 'keep-all' }}>선생님 인증이 필요해요</h3>
                    <p className="text-gray-600 text-sm leading-relaxed" style={{ wordBreak: 'keep-all' }}>
                        튜터로 활동하시려면 인증이 필요합니다.<br />
                        마이페이지에서 서류를 업로드하고<br />
                        승인 요청을 보내주세요.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full space-y-3">
                    <Link href="/profile" className="block w-full">
                        <Button
                            className="w-full bg-primary text-white hover:bg-primary/90"
                            onClick={onClose}
                        >
                            인증하러 가기
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={onClose}
                    >
                        나중에 하기
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
