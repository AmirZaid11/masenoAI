export interface FAQItem {
  question: string;
  answer: string;
  category: 'fees' | 'registration' | 'hostels' | 'general' | 'academic';
  keywords: string[];
}

export const faqData: FAQItem[] = [
  {
    question: "How do I pay my tuition fees?",
    answer: "Tuition fees can be paid via M-Pesa Paybill 891300, Account Number: Your Registration Number. You can also pay at any KCB or Equity Bank branch using the university's official account numbers found on the student portal.",
    category: 'fees',
    keywords: ['pay', 'fees', 'procedure', 'how to pay', 'mpesa', 'bank', 'kcb', 'equity']
  },
  {
    question: "Is it mandatory to pay fees before registration?",
    answer: "Yes, Maseno University requires students to pay at least 50% of the tuition fees plus 100% of other administrative charges to be allowed to register for units. Full payment is required before sitting for end-of-semester examinations.",
    category: 'fees',
    keywords: ['must', 'mandatory', 'compulsory', 'required', 'deadline', 'clearance', 'fees', 'pay', 'lazima', 'sharti']
  },
  {
    question: "Je, ni lazima kulipa karo kabla ya usajili?",
    answer: "Ndiyo, Chuo Kikuu cha Maseno kinahitaji wanafunzi kulipa angalau 50% ya karo ya masomo pamoja na 100% ya malipo mengine ya utawala ili kuruhusiwa kusajili masomo. Malipo kamili yanahitajika kabla ya kufanya mitihani ya mwisho wa muhula.",
    category: 'fees',
    keywords: ['lazima', 'sharti', 'karo', 'lipa', 'usajili', 'mitihani']
  },
  {
    question: "What are the requirements for hostel registration?",
    answer: "To register for a hostel, you must have cleared at least 50% of your semester fees. Log in to the Student Portal, navigate to 'Hostel Booking', select an available room, and print the booking slip for clearance at the Housekeeper's office.",
    category: 'hostels',
    keywords: ['hostel', 'room', 'booking', 'accommodation', 'housekeeper']
  },
  {
    question: "How do I register for units?",
    answer: "Unit registration is done online via the Student Portal (ERP). Go to 'Course Registration', select your current semester units as per the department's curriculum, and click 'Submit'. Ensure you do this within the first two weeks of the semester.",
    category: 'registration',
    keywords: ['register', 'units', 'course', 'erp', 'portal']
  },
  {
    question: "Where is the main library located?",
    answer: "The Maseno University Main Library is located at the Siriba Campus, adjacent to the Administration Block. It is open from 8:00 AM to 10:00 PM on weekdays and 9:00 AM to 5:00 PM on Saturdays.",
    category: 'general',
    keywords: ['library', 'books', 'study', 'siriba', 'location', 'maseno', 'university']
  },
  {
    question: "How can I reset my student portal password?",
    answer: "To reset your portal password, click on the 'Forgot Password' link on the login page. An OTP will be sent to your registered email address. Alternatively, visit the ICT directorate at Siriba or College Campus with your student ID.",
    category: 'general',
    keywords: ['password', 'reset', 'portal', 'login', 'ict', 'maseno', 'university']
  },
  {
    question: "What is the procedure for inter-faculty transfer?",
    answer: "Inter-faculty transfers are usually open during the first two weeks of the first year. You must meet the cluster points for the new course and apply through the Registrar Academic Affairs office.",
    category: 'academic',
    keywords: ['transfer', 'faculty', 'course', 'change', 'registrar']
  },
  {
    question: "Where can I download the latest exam timetable?",
    answer: "The latest exam timetables are available on the official Maseno University website. For the **Main Campus (SEM 2, 25-26AY)**, you can download it here: [Main Campus Exam Timetable (PDF)](https://www.maseno.ac.ke/sites/default/files/Final%20-%20Main%20Campus%20-%20Exam%20TT%20-%20SEM%202%20(25-26AY).pdf). For other campuses, please visit the [Announcements Page](https://www.maseno.ac.ke/index.php/announcements) or check the latest news on the homepage.",
    category: 'academic',
    keywords: ['exam', 'timetable', 'download', 'main campus', 'kisumu campus', 'homa bay campus', 'city campus']
  },
  {
    question: "Where can I find official student announcements?",
    answer: "You can access the official **Maseno University Students Notice Board** for all the latest announcements, memos, and updates here: [Students Notice Board](https://www.maseno.ac.ke/students-announcement).",
    category: 'general',
    keywords: ['announcements', 'notice board', 'memos', 'updates', 'news']
  },
  {
    question: "Hello / Hi",
    answer: "Hello! I am the Maseno AI Assistant. I can help you with questions about fees, hostels, or course registration. How can I assist you today?",
    category: 'general',
    keywords: ['hi', 'hello', 'hey']
  },
  {
    question: "Mambo vipi? / Sasa?",
    answer: "Poa sana! Mimi ni Maseno AI Assistant. Naweza kukusaidia na maswali kuhusu karo, hosteli, au usajili wa masomo. Karibu!",
    category: 'general',
    keywords: ['mambo', 'sasa', 'habari', 'vipi']
  }
];
