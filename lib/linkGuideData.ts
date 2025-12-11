export interface GuideStep {
  image: string;
  description: string;
}

// Zoom 직접 생성 방법
export const zoomDirectGuide: GuideStep[] = [
  {
    image: "/guides/zoom-direct-1.png",
    description: "Zoom 앱 또는 웹사이트(zoom.us)에 로그인합니다.",
  },
  {
    image: "/guides/zoom-direct-2.png",
    description: "홈 화면에서 '호스트' 버튼을 클릭하여 즉시 회의를 시작합니다.",
  },
  {
    image: "/guides/zoom-direct-3.png",
    description: "앱으로 직접 여시거나 브라우저를 통해 회의를 생성합니다.",
  },
  {
    image: "/guides/zoom-direct-4.png",
    description: "'회의가 시작되면 하단의 '참가자' 버튼을 클릭합니다.",
  },
  {
    image: "/guides/zoom-direct-5.png",
    description: "'초대' 버튼을 클릭하고 '초대 링크 복사'를 선택합니다.",
  },
  {
    image: "/guides/last.png",
    description: "복사한 Zoom 링크를 수업 설정 화면의 'Zoom 링크' 입력란에 붙여넣습니다.",
  },
];

// Zoom 회의 예약 방법
export const zoomScheduleGuide: GuideStep[] = [
  {
    image: "/guides/zoom-direct-1.png",
    description: "Zoom 앱 또는 웹사이트(zoom.us)에 로그인합니다.",
  },
  {
    image: "/guides/zoom-schedule-2.png",
    description: "상단 메뉴에서 '회의 예약'을 클릭합니다.",
  },
  {
    image: "/guides/zoom-schedule-3.png",
    description: "회의 주제, 날짜, 시간 등을 설정하고 '저장'을 클릭합니다.",
  },
  {
    image: "/guides/zoom-schedule-4.png",
    description: "예약된 회의 목록에서 해당 회의를 찾아 '초대 링크 복사'를 클릭합니다.",
  },
  {
    image: "/guides/last.png",
    description: "복사한 Zoom 링크를 수업 설정 화면의 'Zoom 링크' 입력란에 붙여넣습니다.",
  },
];

export const googleDocsLinkGuide: GuideStep[] = [
  {
    image: "/guides/docs-1.png",
    description: "Google Docs 사이트에 접속하여 로그인합니다.",
  },
  {
    image: "/guides/docs-2.png",
    description: "좌측 상단의 '+ 빈 문서' 버튼을 클릭하여 새로운 문서를 생성합니다.",
  },
  {
    image: "/guides/docs-3.png",
    description: "우측 상단의 '공유' 버튼을 클릭합니다.",
  },
  {
    image: "/guides/docs-4.png",
    description: "파일의 이름은 건너뛰기하거나 이름설정 후 확인버튼을 눌러줍니다.",
  },
  {
    image: "/guides/docs-5.png",
    description: "'제한됨'을 클릭합니다.",
  },
  {
    image: "/guides/docs-6.png",
    description: "'링크가 있는 모든 사용자'로 변경합니다.",
  },
  {
    image: "/guides/docs-7.png",
    description: "'뷰어'를 선택하고 편집자를 클릭하여 권한을 변경합니다.",
  },
  {
    image: "/guides/docs-8.png",
    description: "'링크 복사'를 누르고 완료를 클릭합니다.",
  },
  {
    image: "/guides/last.png",
    description: "복사한 Google Docs 링크를 수업 설정 화면의 'Google Docs 링크' 입력란에 붙여넣습니다.",
  },
];
