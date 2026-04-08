export interface FAQItem {
  question: string;
  answer: string;
  category: 'fees' | 'registration' | 'hostels' | 'general' | 'academic' | 'contact' | 'schools';
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
    question: "What are the schools and faculties at Maseno University?",
    answer: "Maseno University has 14 schools: \n1. School of Arts and Social Sciences (SASS)\n2. School of Education (SED)\n3. School of Biological and Physical Sciences (SBPS)\n4. School of Public Health and Community Development (SPHCD)\n5. School of Environment and Earth Sciences (SEES)\n6. School of Development and Strategic Studies (SDSS)\n7. School of Business and Economics (SBE)\n8. School of Medicine (SOM)\n9. School of Nursing (SON)\n10. School of Mathematics, Applied Statistics and Actuarial Sciences (SMASAS)\n11. School of Computing and Informatics (SCI)\n12. School of Planning and Architecture (SPA)\n13. School of Agriculture, Food Security and Environmental Sciences (SAFSES)\n14. School of Graduate Studies (SGS)",
    category: 'schools',
    keywords: ['schools', 'faculties', 'departments', 'list of schools', 'what schools', 'sass', 'sci', 'sbe', 'som']
  },
  {
    question: "Contact Information & Emails",
    answer: "Official University Contacts:\n- General Enquiries: info@maseno.ac.ke\n- Admissions: admission@maseno.ac.ke\n- Registrar Academic Affairs: draa@maseno.ac.ke\n- Finance/Fees: finance@maseno.ac.ke\n- ICT Support: ict-support@maseno.ac.ke\n- Student Affairs: dean-students@maseno.ac.ke",
    category: 'contact',
    keywords: ['email', 'contact', 'address', 'official email', 'phone', 'help desk', 'send mail']
  },
  {
    question: "Emergency & Health Unit Numbers",
    answer: "For emergencies, contact:\n- University Health Unit / Ambulance: 0722 203 411 / 0735 447 777\n- Security Office: 0722 203 411\n- Note: These numbers are subject to update. Always check the official website if unreachable.",
    category: 'contact',
    keywords: ['emergency', 'ambulance', 'health', 'security', 'police', 'sick', 'accident', 'help']
  },
  {
    question: "Is it mandatory to pay fees before registration?",
    answer: "Yes, Maseno University requires students to pay at least 50% of the tuition fees plus 100% of other administrative charges to be allowed to register for units. Full payment is required before sitting for end-of-semester examinations.",
    category: 'fees',
    keywords: ['must', 'mandatory', 'compulsory', 'required', 'deadline', 'clearance', 'fees', 'pay', 'lazima', 'sharti']
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
    keywords: ['library', 'books', 'study', 'siriba', 'location']
  },
  {
    question: "How can I reset my student portal password?",
    answer: "To reset your portal password, click on the 'Forgot Password' link on the login page. An OTP will be sent to your registered email address. Alternatively, visit the ICT directorate at Siriba or College Campus with your student ID.",
    category: 'general',
    keywords: ['password', 'reset', 'portal', 'login', 'ict']
  },
  {
    question: "Where can I download the latest exam timetable?",
    answer: "Latest exam timetables are available on the [Announcements Page](https://www.maseno.ac.ke/index.php/announcements). For the Main Campus (SEM 2, 25-26AY), use [this link](https://www.maseno.ac.ke/sites/default/files/Final%20-%20Main%20Campus%20-%20Exam%20TT%20-%20SEM%202%20(25-26AY).pdf).",
    category: 'academic',
    keywords: ['exam', 'timetable', 'download']
  }
];
