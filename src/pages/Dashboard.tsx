import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface Session {
  _id: string;
  deviceInfo: string;
  ipAddress: string;
  createdAt: string;
}

interface LoginRecord {
  _id: string;
  success: boolean;
  ipAddress: string;
  deviceInfo: string;
  createdAt: string;
}

type Tab = 'overview' | 'profile' | 'courses' | 'assignments' | 'internships' | 'diaries' | 'projects' | 'community' | 'sessions' | 'history' | 'admin' | 'faculty' | 'organization' | 'reports';

// ── ROLE PERMISSIONS ──
const ROLE_TABS: Record<string, Tab[]> = {
  user:        ['overview', 'profile', 'courses', 'assignments', 'internships', 'diaries', 'projects', 'community'],
  faculty:     ['overview', 'profile', 'courses', 'assignments', 'projects', 'community', 'faculty'],
  organization:['overview', 'profile', 'internships', 'projects', 'community', 'organization'],
  admin:       ['overview', 'profile', 'courses', 'assignments', 'internships', 'projects', 'community', 'admin', 'reports'],
  super_admin: ['overview', 'profile', 'courses', 'assignments', 'internships', 'projects', 'community', 'admin', 'reports', 'sessions', 'history'],
};
function can(role: string | undefined, tab: Tab) {
  return ROLE_TABS[role ?? 'user']?.includes(tab) ?? false;
}

const HomeIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>;

const AdminIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>;
const SessionIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>;
const HistoryIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>;
const LogoutIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/></svg>;
const ShieldIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>;
const UserIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>;
const TrashIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>;
const BookIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>;
const BriefcaseIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4a2 2 0 00-2 2v2H2v8a2 2 0 002 2h12a2 2 0 002-2V8h-2V6a2 2 0 00-2-2H6zm0 2h8v2H6V6z"/></svg>;
const ProjectIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M4 3a1 1 0 011-1h2a1 1 0 011 1v2H5V3zm8 0a1 1 0 011-1h2a1 1 0 011 1v2h-4V3zM5 9h4v4H5V9zm6 0h4v4h-4V9zM4 15a1 1 0 011-1h2a1 1 0 011 1v2H5v-2zm8 0a1 1 0 011-1h2a1 1 0 011 1v2h-4v-2z"/></svg>;
const CommunityIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H9l-4 3V5z"/></svg>;
const AssignmentIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/><path d="M4 5a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"/></svg>;
const DiaryIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>;
const FacultyIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>;
const OrganizationIcon = () => <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h.582A7.003 7.003 0 019 18a7.003 7.003 0 016.418-11H16a2 2 0 01-2-2V4a2 2 0 00-2-2H4zm2 6a1 1 0 100 2h8a1 1 0 100-2H6zm0 4a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>;

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtTime(d: string) {
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [history, setHistory] = useState<LoginRecord[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);
  const [internshipFilter, setInternshipFilter] = useState<string>('All');
  const [activeGroup, setActiveGroup] = useState<string>('Students');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<string, {sender:string; text:string; time:string}[]>>({
    Students:      [{sender:'Alice',text:'Hey everyone! Anyone working on the React assignment?',time:'10:02 AM'},{sender:'Bob',text:'Yes! Stuck on useEffect cleanup 😅',time:'10:04 AM'}],
    Faculty:       [{sender:'Prof. Smith',text:'Reminder: Assignment reviews due Friday.',time:'9:00 AM'},{sender:'Prof. Lee',text:'Will share feedback by EOD.',time:'9:15 AM'}],
    Organizations: [{sender:'Acme Corp',text:'We have 2 new frontend intern slots open!',time:'8:30 AM'},{sender:'HiveTech',text:'Looking for backend interns — apply now.',time:'8:45 AM'}],
    'Acme Corp':   [{sender:'Sarah',text:'Welcome to the Acme Corp group!',time:'Yesterday'},{sender:'Mike',text:'Excited to be here 🚀',time:'Yesterday'}],
    HiveTech:      [{sender:'David',text:'HiveTech standup at 10am tomorrow.',time:'Yesterday'}],
    DeepLens:      [{sender:'Rachel',text:'AI Resume Analyzer sprint starts Monday.',time:'2d ago'}],
    TechFlow:      [{sender:'Mark',text:'Mobile redesign review this week.',time:'2d ago'}],
  });

  useEffect(() => {
    Promise.all([
      api.get('/auth/me'),
      api.get('/user/sessions'),
      api.get('/user/login-history'),
    ])
      .then(([me, sess, hist]) => {
        setUser(me.data.user);
        setSessions(sess.data.sessions || []);
        setHistory(hist.data.history || []);
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      api.get('/admin/users').then(r => setAdminUsers(r.data.users || [])).catch(() => {});
    }
  }, [user]);

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.post('/auth/logout', { refreshToken }).catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const deleteUser = async (id: string) => {
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setAdminUsers(u => u.filter(x => x._id !== id));
    } catch {}
    setDeletingId(null);
  };

  const updateRole = async (id: string, role: string) => {
    setRoleUpdating(id);
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      setAdminUsers(u => u.map(x => x._id === id ? { ...x, role } : x));
    } catch {}
    setRoleUpdating(null);
  };

  interface Course { id: number; name: string; category: string; avatar: string; description: string; duration: string; level: string; status: 'approved' | 'pending' | 'rejected'; postedBy: string; }
  const [allCourses, setAllCourses] = useState<Course[]>([
    { id:1, name:'Full Stack Web Development', category:'Web', avatar:'🌐', description:'Build end-to-end web apps with React, Node.js and MongoDB.', duration:'12 weeks', level:'Intermediate', status:'approved', postedBy:'admin' },
    { id:2, name:'React & TypeScript Mastery', category:'Frontend', avatar:'⚛️', description:'Deep dive into React with TypeScript, hooks and state management.', duration:'8 weeks', level:'Advanced', status:'approved', postedBy:'admin' },
    { id:3, name:'Node.js & REST APIs', category:'Backend', avatar:'🟢', description:'Design and build scalable REST APIs using Node.js and Express.', duration:'6 weeks', level:'Intermediate', status:'approved', postedBy:'admin' },
    { id:4, name:'UI/UX Design Fundamentals', category:'Design', avatar:'🎨', description:'Learn design principles, Figma and user research techniques.', duration:'5 weeks', level:'Beginner', status:'pending', postedBy:'admin' },
    { id:5, name:'Database Design & SQL', category:'Data', avatar:'🗄️', description:'Master relational databases, SQL queries and schema design.', duration:'6 weeks', level:'Beginner', status:'approved', postedBy:'admin' },
    { id:6, name:'DevOps & CI/CD Basics', category:'Infrastructure', avatar:'🚀', description:'Automate deployments with Docker, GitHub Actions and cloud services.', duration:'7 weeks', level:'Advanced', status:'pending', postedBy:'admin' },
  ]);
  const [enrolledIds, setEnrolledIds] = useState<number[]>([1, 2]);
  const [savedIds, setSavedIds] = useState<number[]>([3]);
  const [courseFilter, setCourseFilter] = useState('All');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ name:'', category:'Web', avatar:'📘', description:'', duration:'', level:'Beginner' });
  const submitCourse = () => {
    if (!courseForm.name.trim() || !courseForm.description.trim()) return;
    const c: Course = { id: Date.now(), ...courseForm, status: 'pending', postedBy: user?.name ?? 'admin' };
    setAllCourses(prev => [c, ...prev]);
    setCourseForm({ name:'', category:'Web', avatar:'📘', description:'', duration:'', level:'Beginner' });
    setShowCourseForm(false);
  };
  const approveCourse = (id: number) => setAllCourses(prev => prev.map(c => c.id===id ? {...c, status:'approved'} : c));
  const rejectCourse  = (id: number) => setAllCourses(prev => prev.map(c => c.id===id ? {...c, status:'rejected'} : c));
  const courseCatalog = allCourses; // keep alias for reports tab

  const internshipBoard = [
    { title: 'Frontend Intern at Acme Corp', company: 'Acme', status: 'Open', posted: '3 days ago' },
    { title: 'Backend Intern at HiveTech', company: 'HiveTech', status: 'Interviewing', posted: '5 days ago' },
    { title: 'Data Science Intern at DeepLens', company: 'DeepLens', status: 'Closed', posted: '1 week ago' },
  ];

  const projectSpaces = [
    { 
      name: 'LMS Platform Upgrade', 
      company: 'Acme Corp',
      role: 'Contributor', 
      progress: 72,
      team: [
        { name: 'Sarah Johnson', role: 'Mentor', avatar: 'SJ' },
        { name: 'Mike Chen', role: 'Student', avatar: 'MC' },
        { name: 'Alex Rivera', role: 'Student', avatar: 'AR' },
        { name: 'Emma Davis', role: 'Student', avatar: 'ED' }
      ]
    },
    { 
      name: 'Campus Internship Matching', 
      company: 'HiveTech',
      role: 'Mentor', 
      progress: 54,
      team: [
        { name: 'David Kim', role: 'Mentor', avatar: 'DK' },
        { name: 'Lisa Wong', role: 'Student', avatar: 'LW' },
        { name: 'Tom Anderson', role: 'Student', avatar: 'TA' }
      ]
    },
    { 
      name: 'AI Resume Analyzer', 
      company: 'DeepLens',
      role: 'Member', 
      progress: 31,
      team: [
        { name: 'Rachel Green', role: 'Mentor', avatar: 'RG' },
        { name: 'James Wilson', role: 'Student', avatar: 'JW' },
        { name: 'Nina Patel', role: 'Student', avatar: 'NP' },
        { name: 'Carlos Mendez', role: 'Student', avatar: 'CM' },
        { name: 'Sophie Turner', role: 'Student', avatar: 'ST' }
      ]
    },
    { 
      name: 'Mobile App Redesign', 
      company: 'TechFlow',
      role: 'Contributor', 
      progress: 88,
      team: [
        { name: 'Mark Thompson', role: 'Mentor', avatar: 'MT' },
        { name: 'Anna Lee', role: 'Student', avatar: 'AL' },
        { name: 'Kevin Brown', role: 'Student', avatar: 'KB' }
      ]
    },
  ];

  const communityThreads = [
    { title: 'How to configure GitHub Actions for CI', replies: 12, updated: '2h ago' },
    { title: 'Best practices for internship diaries', replies: 8, updated: '1d ago' },
    { title: 'Project pairing request: Full Stack', replies: 5, updated: '4d ago' },
  ];

  const learningEvents = [
    { name: 'Hackathon 2026', date: '2026-04-05', status: 'Upcoming' },
    { name: 'Mentor Q&A Session', date: '2026-04-10', status: 'Upcoming' },
    { name: 'Workshop: Portfolio Review', date: '2026-04-15', status: 'Upcoming' },
  ];

  interface Assignment { id: number; title: string; course: string; dueDate: string; status: 'Pending' | 'Submitted' | 'Graded'; grade: string | null; feedback: string | null; submittedFile: string | null; submittedNote: string | null; postedBy: string; }
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([
    { id:1, title:'Build a React Todo App', course:'React & TypeScript Mastery', dueDate:'2026-04-01', status:'Graded', grade:'A', feedback:'Excellent use of hooks and clean component structure.', submittedFile:'todo-app.zip', submittedNote:'Used Context API for state management.', postedBy:'admin' },
    { id:2, title:'Database Schema Design', course:'Database Design & SQL', dueDate:'2026-04-05', status:'Submitted', grade:null, feedback:null, submittedFile:'schema.pdf', submittedNote:'Normalized to 3NF, added indexes.', postedBy:'admin' },
    { id:3, title:'API Integration Task', course:'Node.js & REST APIs', dueDate:'2026-03-30', status:'Graded', grade:'B+', feedback:'Good work, but error handling could be improved.', submittedFile:'api-task.zip', submittedNote:null, postedBy:'admin' },
    { id:4, title:'UI Component Library', course:'UI/UX Design Fundamentals', dueDate:'2026-04-10', status:'Pending', grade:null, feedback:null, submittedFile:null, submittedNote:null, postedBy:'admin' },
  ]);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title:'', course:'', dueDate:'', description:'' });
  const [submitForm, setSubmitForm] = useState<{id:number; note:string} | null>(null);
  const [gradeForm, setGradeForm] = useState<{id:number; grade:string; feedback:string} | null>(null);
  const [assignmentFilter, setAssignmentFilter] = useState<'All'|'Pending'|'Submitted'|'Graded'>('All');
  const postAssignment = () => {
    if (!assignmentForm.title.trim() || !assignmentForm.course.trim()) return;
    const a: Assignment = { id: Date.now(), ...assignmentForm, status:'Pending', grade:null, feedback:null, submittedFile:null, submittedNote:null, postedBy: user?.name ?? 'admin' };
    setAllAssignments(prev => [a, ...prev]);
    setAssignmentForm({ title:'', course:'', dueDate:'', description:'' });
    setShowAssignmentForm(false);
  };
  const submitAssignment = (id: number, note: string) => {
    setAllAssignments(prev => prev.map(a => a.id===id ? {...a, status:'Submitted', submittedNote: note || null, submittedFile:'submission.zip'} : a));
    setSubmitForm(null);
  };
  const gradeAssignment = (id: number, grade: string, feedback: string) => {
    setAllAssignments(prev => prev.map(a => a.id===id ? {...a, status:'Graded', grade, feedback} : a));
    setGradeForm(null);
  };

  interface DiaryEntry { id: number; date: string; title: string; content: string; mood: string; hours: string; tasks: string; status: 'Submitted' | 'Pending' | 'Reviewed'; feedback: string | null; }
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([
    { id: 1, date: '2026-03-25', title: 'Frontend Component Work', content: 'Worked on reusable React components. Learned about state management patterns and prop drilling alternatives using Context API.', mood: '😊', hours: '8', tasks: 'Built 3 components, wrote unit tests', status: 'Reviewed', feedback: 'Great work! Keep documenting your learnings.' },
    { id: 2, date: '2026-03-26', title: 'API Integration', content: 'Integrated REST API calls using Axios. Faced issues with CORS and authentication headers. Resolved with mentor guidance.', mood: '😅', hours: '7', tasks: 'API integration, bug fixes', status: 'Submitted', feedback: null },
    { id: 3, date: '2026-03-27', title: 'Database Schema Design', content: 'Designed the database schema for the user module. Discussed normalization strategies with the team lead.', mood: '🤔', hours: '6', tasks: 'Schema design, team meeting', status: 'Pending', feedback: null },
  ]);
  const [diaryForm, setDiaryForm] = useState({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: '😊', hours: '', tasks: '' });
  const [diaryView, setDiaryView] = useState<DiaryEntry | null>(null);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const submitDiary = () => {
    if (!diaryForm.title.trim() || !diaryForm.content.trim()) return;
    const entry: DiaryEntry = { id: Date.now(), ...diaryForm, status: 'Pending', feedback: null };
    setDiaryEntries(prev => [entry, ...prev]);
    setDiaryForm({ date: new Date().toISOString().split('T')[0], title: '', content: '', mood: '😊', hours: '', tasks: '' });
    setShowDiaryForm(false);
  };

  const facultyMentoring = [
    { intern: 'Alice Johnson', project: 'E-commerce Platform', progress: 75, lastUpdate: '2026-03-24' },
    { intern: 'Bob Smith', project: 'Data Visualization Tool', progress: 60, lastUpdate: '2026-03-23' },
  ];

  const organizationManagement = [
    { intern: 'Charlie Brown', internship: 'Frontend Intern', progress: 80, evaluation: 'Excellent' },
    { intern: 'Diana Prince', internship: 'Backend Intern', progress: 70, evaluation: 'Good' },
  ];

  const revokeSession = async (id: string) => {
    setRevoking(id);
    try {
      await api.delete(`/user/sessions/${id}`);
      setSessions(s => s.filter(x => x._id !== id));
    } catch {}
    setRevoking(null);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
    </div>
  );

  const successLogins = history.filter(h => h.success).length;

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">L</div>
          <div className="sidebar-brand-name">LMS<span>Portal</span></div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          <div className={`nav-item ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
            <UserIcon /> Profile
          </div>
          {can(user?.role,'courses') && <div className={`nav-item ${tab==='courses'?'active':''}`} onClick={()=>setTab('courses')}><BookIcon/>Courses</div>}
          {can(user?.role,'assignments') && <div className={`nav-item ${tab==='assignments'?'active':''}`} onClick={()=>setTab('assignments')}><AssignmentIcon/>Assignments</div>}
          {can(user?.role,'internships') && <div className={`nav-item ${tab==='internships'?'active':''}`} onClick={()=>setTab('internships')}><BriefcaseIcon/>Internships</div>}
          {can(user?.role,'diaries') && <div className={`nav-item ${tab==='diaries'?'active':''}`} onClick={()=>setTab('diaries')}><DiaryIcon/>Diaries</div>}
          {can(user?.role,'projects') && <div className={`nav-item ${tab==='projects'?'active':''}`} onClick={()=>setTab('projects')}><ProjectIcon/>Projects</div>}
          {can(user?.role,'community') && <div className={`nav-item ${tab==='community'?'active':''}`} onClick={()=>setTab('community')}><CommunityIcon/>Community</div>}
          {can(user?.role,'faculty') && <div className={`nav-item ${tab==='faculty'?'active':''}`} onClick={()=>setTab('faculty')}><FacultyIcon/>Mentoring</div>}
          {can(user?.role,'organization') && <div className={`nav-item ${tab==='organization'?'active':''}`} onClick={()=>setTab('organization')}><OrganizationIcon/>Management</div>}
          {(user?.role==='admin'||user?.role==='super_admin') && <>
            <div className="nav-label" style={{marginTop:'0.5rem'}}>Admin</div>
            <div className={`nav-item ${tab==='admin'?'active':''}`} onClick={()=>setTab('admin')}>
              <AdminIcon/>Manage Users
              {adminUsers.length>0&&<span className="badge badge-violet" style={{marginLeft:'auto',padding:'2px 7px'}}>{adminUsers.length}</span>}
            </div>
            <div className={`nav-item ${tab==='reports'?'active':''}`} onClick={()=>setTab('reports')}><BookIcon/>Analytics</div>
          </>}
          {user?.role==='super_admin' && <>
            <div className="nav-label" style={{marginTop:'0.5rem'}}>Account</div>
            <div className={`nav-item ${tab==='sessions'?'active':''}`} onClick={()=>setTab('sessions')}>
              <SessionIcon/>Sessions
              {sessions.length>0&&<span className="badge badge-indigo" style={{marginLeft:'auto',padding:'2px 7px'}}>{sessions.length}</span>}
            </div>
            <div className={`nav-item ${tab==='history'?'active':''}`} onClick={()=>setTab('history')}><HistoryIcon/>Login History</div>
          </>}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user ? initials(user.name) : 'U'}</div>
            <div>
              <div className="user-info-name">{user?.name?.split(' ')[0]}</div>
              <div className="user-info-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            {tab === 'overview' && 'Overview'}
            {tab === 'profile' && 'My Profile'}
            {tab === 'courses' && 'Courses'}
            {tab === 'assignments' && 'Assignments'}
            {tab === 'internships' && 'Internships'}
            {tab === 'diaries' && 'Internship Diaries'}
            {tab === 'projects' && 'Projects'}
            {tab === 'community' && 'Community'}
            {tab === 'faculty' && 'Faculty Mentoring'}
            {tab === 'organization' && 'Organization Management'}
            {tab === 'sessions' && 'Active Sessions'}
            {tab === 'history' && 'Login History'}
            {tab === 'admin' && 'Manage Users'}
            {tab === 'reports' && 'Analytics Reports'}
          </div>
          <div className="topbar-action">
            <button className="logout-btn" onClick={logout}>
              <LogoutIcon /> Logout
            </button>
          </div>
        </header>

        <main className="page-body">

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && (
            <>
              <div className="welcome-banner">
                <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
                <p>Welcome to your LMS Portal dashboard.</p>
                <div className="welcome-badges">
                  {user?.isVerified && <span className="badge badge-green">Verified</span>}
                  <span className="badge badge-indigo">{user?.role}</span>
                  <span className="badge badge-blue">Active</span>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(79,70,229,0.12)' }}>
                    <ShieldIcon />
                  </div>
                  <div className="stat-value">{sessions.length}</div>
                  <div className="stat-label">Active Sessions</div>
                  <div className="stat-sub neutral">Max 5 allowed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(34,197,94,0.12)' }}>
                    <HistoryIcon />
                  </div>
                  <div className="stat-value">{successLogins}</div>
                  <div className="stat-label">Successful Logins</div>
                  <div className="stat-sub up">Last 20 tracked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <HistoryIcon />
                  </div>
                  <div className="stat-value">{history.length - successLogins}</div>
                  <div className="stat-label">Failed Attempts</div>
                  <div className="stat-sub neutral">Lock after 5</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon-wrap" style={{ background: 'rgba(139,92,246,0.12)' }}>
                    <UserIcon />
                  </div>
                  <div className="stat-value">{user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0}</div>
                  <div className="stat-label">Days as Member</div>
                  <div className="stat-sub neutral">Since {user?.createdAt ? fmt(user.createdAt) : '—'}</div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Profile Information</div>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Full Name</span>
                    <span className="info-row-value">{user?.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Email</span>
                    <span className="info-row-value" style={{ fontSize: '0.82rem' }}>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="info-row">
                      <span className="info-row-label">Phone</span>
                      <span className="info-row-value">{user.phone}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="info-row-label">Role</span>
                    <span className="info-row-value" style={{ textTransform: 'capitalize' }}>{user?.role}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Member Since</span>
                    <span className="info-row-value">{user?.createdAt ? fmt(user.createdAt) : '—'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-row-label">Status</span>
                    <span className={`badge ${user?.isVerified ? 'badge-green' : 'badge-amber'}`}>
                      {user?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Recent Activity</div>
                  </div>
                  {history.slice(0, 5).length === 0 ? (
                    <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No activity recorded yet.</p>
                  ) : (
                    history.slice(0, 5).map(h => (
                      <div className="activity-item" key={h._id}>
                        <div className="act-dot" style={{ background: h.success ? 'var(--green)' : 'var(--red)' }} />
                        <div>
                          <div className="act-text">
                            <strong>{h.success ? 'Successful login' : 'Failed login attempt'}</strong>
                            {' '}from {h.ipAddress}
                          </div>
                          <div className="act-time">{fmtTime(h.createdAt)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === 'profile' && (
            <div className="profile-page">

              {/* Hero Banner */}
              <div className="profile-hero">
                <div className="profile-hero-bg" />
                <div className="profile-hero-content">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar-lg">{user ? initials(user.name) : 'U'}</div>
                    <div className={`profile-avatar-status ${user?.isVerified ? 'verified' : 'unverified'}`} />
                  </div>
                  <div className="profile-hero-info">
                    <h2 className="profile-name">{user?.name}</h2>
                    <p className="profile-role-line">
                      <span className="profile-role-dot" />
                      {user?.role?.replace('_', ' ')}
                      <span className="profile-sep">·</span>
                      Member since {user?.createdAt ? fmt(user.createdAt) : '—'}
                    </p>
                    <div className="profile-hero-badges">
                      {user?.isVerified
                        ? <span className="badge badge-green">✓ Verified</span>
                        : <span className="badge badge-amber">Unverified</span>}
                      <span className="badge badge-indigo">{user?.role}</span>
                      <span className="badge badge-blue">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="profile-stats-row">
                <div className="profile-stat">
                  <div className="profile-stat-val">6</div>
                  <div className="profile-stat-lbl">Courses</div>
                </div>
                <div className="profile-stat-divider" />
                <div className="profile-stat">
                  <div className="profile-stat-val">3</div>
                  <div className="profile-stat-lbl">Projects</div>
                </div>
                <div className="profile-stat-divider" />
                <div className="profile-stat">
                  <div className="profile-stat-val">{sessions.length}</div>
                  <div className="profile-stat-lbl">Sessions</div>
                </div>
                <div className="profile-stat-divider" />
                <div className="profile-stat">
                  <div className="profile-stat-val">{user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000) : 0}</div>
                  <div className="profile-stat-lbl">Days Active</div>
                </div>
              </div>

              {/* Two-col body */}
              <div className="profile-body">

                {/* LEFT COL */}
                <div className="profile-col">

                  {/* Contact Info */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Contact Information</div>
                    </div>
                    <div className="profile-info-item">
                      <div className="profile-info-icon" style={{ background: 'rgba(79,70,229,0.12)' }}>
                        <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                      </div>
                      <div>
                        <div className="profile-info-label">Email Address</div>
                        <div className="profile-info-value">{user?.email}</div>
                      </div>
                    </div>
                    {user?.phone && (
                      <div className="profile-info-item">
                        <div className="profile-info-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                        </div>
                        <div>
                          <div className="profile-info-label">Phone</div>
                          <div className="profile-info-value">{user.phone}</div>
                        </div>
                      </div>
                    )}
                    <div className="profile-info-item">
                      <div className="profile-info-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                      </div>
                      <div>
                        <div className="profile-info-label">Role</div>
                        <div className="profile-info-value" style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</div>
                      </div>
                    </div>
                    <div className="profile-info-item" style={{ border: 'none' }}>
                      <div className="profile-info-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg>
                      </div>
                      <div>
                        <div className="profile-info-label">Member Since</div>
                        <div className="profile-info-value">{user?.createdAt ? fmt(user.createdAt) : '—'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Skills</div>
                    </div>
                    <div className="profile-skills">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'SQL'].map(skill => (
                        <span key={skill} className="profile-skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Links</div>
                    </div>
                    <div className="profile-links">
                      <a href="https://github.com/user" target="_blank" className="profile-link-item">
                        <div className="profile-link-icon">⌥</div>
                        <div>
                          <div className="profile-link-label">GitHub</div>
                          <div className="profile-link-url">github.com/user</div>
                        </div>
                        <svg className="profile-link-arrow" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      </a>
                      <a href="#" className="profile-link-item" style={{ border: 'none' }}>
                        <div className="profile-link-icon">🔗</div>
                        <div>
                          <div className="profile-link-label">Portfolio</div>
                          <div className="profile-link-url">myportfolio.dev</div>
                        </div>
                        <svg className="profile-link-arrow" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                      </a>
                    </div>
                  </div>

                </div>

                {/* RIGHT COL */}
                <div className="profile-col">

                  {/* About */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">About</div>
                    </div>
                    <p className="profile-about">Passionate developer focused on building scalable web applications. Currently enrolled in the LMS Portal to sharpen full-stack skills and connect with real internship opportunities.</p>
                    <div className="profile-about-tags">
                      <span className="profile-about-tag">🎓 B.Tech Computer Science</span>
                      <span className="profile-about-tag">📍 India</span>
                      <span className="profile-about-tag">💼 Open to Internships</span>
                    </div>
                  </div>

                  {/* Current Courses */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Current Courses</div>
                      <span className="badge badge-indigo">3 active</span>
                    </div>
                    {[
                      { name: 'React & TypeScript Mastery', progress: 72, color: '#4f46e5', emoji: '⚛️' },
                      { name: 'Node.js & REST APIs', progress: 45, color: '#22c55e', emoji: '🟢' },
                      { name: 'Database Design & SQL', progress: 88, color: '#8b5cf6', emoji: '🗄️' },
                    ].map(c => (
                      <div key={c.name} className="profile-course-row">
                        <div className="profile-course-emoji">{c.emoji}</div>
                        <div className="profile-course-info">
                          <div className="profile-course-name">{c.name}</div>
                          <div className="profile-course-bar-wrap">
                            <div className="profile-course-bar">
                              <div className="profile-course-fill" style={{ width: `${c.progress}%`, background: c.color }} />
                            </div>
                            <span className="profile-course-pct">{c.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Projects */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Recent Projects</div>
                    </div>
                    {[
                      { name: 'E-commerce App', tech: 'React · Node.js · MongoDB', status: 'Completed' },
                      { name: 'Chat Application', tech: 'Socket.io · Express · Redis', status: 'In Progress' },
                      { name: 'LMS Platform Upgrade', tech: 'TypeScript · PostgreSQL', status: 'In Progress' },
                    ].map((p, i) => (
                      <div key={i} className="profile-project-item">
                        <div className="profile-project-dot" />
                        <div className="profile-project-info">
                          <div className="profile-project-name">{p.name}</div>
                          <div className="profile-project-tech">{p.tech}</div>
                        </div>
                        <span className={`badge ${p.status === 'Completed' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ── SESSIONS TAB ── */}
          {tab === 'sessions' && (
            <div className="card">
              <div className="card-header">
                <span className="badge badge-indigo">Max 5</span>
              </div>
              {sessions.length === 0 ? (
                <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No active sessions found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th>IP Address</th>
                        <th>Created</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map(s => (
                        <tr key={s._id}>
                          <td className="td-primary" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.deviceInfo || 'Unknown device'}
                          </td>
                          <td>{s.ipAddress}</td>
                          <td>{fmtTime(s.createdAt)}</td>
                          <td>
                            <button
                              onClick={() => revokeSession(s._id)}
                              disabled={revoking === s._id}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                background: 'var(--red-bg)', border: '1px solid var(--red-border)',
                                color: '#fca5a5', borderRadius: 7, padding: '4px 10px',
                                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                opacity: revoking === s._id ? 0.5 : 1,
                              }}
                            >
                              <TrashIcon /> {revoking === s._id ? '...' : 'Revoke'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── HISTORY TAB ── */}
          {tab === 'history' && (
            <div className="card">
              {history.length === 0 ? (
                <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No login history found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>IP Address</th>
                        <th>Device</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(h => (
                        <tr key={h._id}>
                          <td>
                            <span className={`badge ${h.success ? 'badge-green' : 'badge-red'}`}>
                              {h.success ? 'Success' : 'Failed'}
                            </span>
                          </td>
                          <td>{h.ipAddress}</td>
                          <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {h.deviceInfo || 'Unknown'}
                          </td>
                          <td>{fmtTime(h.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── COURSES TAB ── */}
          {tab === 'courses' && (() => {
            const role = user?.role ?? 'user';
            const isAdmin = role === 'admin' || role === 'super_admin';
            const isSuperAdmin = role === 'super_admin';
            const visibleCourses = allCourses.filter(c =>
              isAdmin ? true : c.status === 'approved'
            ).filter(c => courseFilter === 'All' || c.category === courseFilter);

            return (
              <div className="courses-page">

                {/* Header */}
                <div className="courses-page-header">
                  <div>
    
                    <div className="courses-page-sub">
                      {isSuperAdmin ? `${allCourses.filter(c=>c.status==='pending').length} pending approval` :
                       isAdmin ? 'Manage & post courses' :
                       `${enrolledIds.length} enrolled · ${savedIds.length} saved`}
                    </div>
                  </div>
                  {isAdmin && !isSuperAdmin && (
                    <button className="diary-new-btn" onClick={()=>setShowCourseForm(v=>!v)}>
                      {showCourseForm ? '✕ Cancel' : '+ Post Course'}
                    </button>
                  )}
                </div>

                {/* Pending approval banner for super_admin */}
                {isSuperAdmin && allCourses.some(c=>c.status==='pending') && (
                  <div className="courses-approval-banner">
                    <span>🔔 {allCourses.filter(c=>c.status==='pending').length} course(s) waiting for your approval</span>
                  </div>
                )}

                {/* Admin post form */}
                {showCourseForm && isAdmin && !isSuperAdmin && (
                  <div className="diary-form-card">
                    <div className="diary-form-title">Post New Course</div>
                    <div className="diary-form-row" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
                      <div className="diary-form-group">
                        <label>Category</label>
                        <select value={courseForm.category} onChange={e=>setCourseForm(f=>({...f,category:e.target.value}))} className="diary-input">
                          {['Web','Frontend','Backend','Design','Data','Infrastructure'].map(c=><option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="diary-form-group">
                        <label>Level</label>
                        <select value={courseForm.level} onChange={e=>setCourseForm(f=>({...f,level:e.target.value}))} className="diary-input">
                          {['Beginner','Intermediate','Advanced'].map(l=><option key={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="diary-form-group">
                        <label>Duration</label>
                        <input placeholder="e.g. 6 weeks" value={courseForm.duration} onChange={e=>setCourseForm(f=>({...f,duration:e.target.value}))} className="diary-input" />
                      </div>
                    </div>
                    <div className="diary-form-group">
                      <label>Course Name</label>
                      <input placeholder="e.g. Advanced React Patterns" value={courseForm.name} onChange={e=>setCourseForm(f=>({...f,name:e.target.value}))} className="diary-input" />
                    </div>
                    <div className="diary-form-group">
                      <label>Description</label>
                      <textarea placeholder="What will students learn?" value={courseForm.description} onChange={e=>setCourseForm(f=>({...f,description:e.target.value}))} className="diary-textarea" rows={3} />
                    </div>
                    <div className="diary-form-actions">
                      <button className="diary-submit-btn" onClick={submitCourse}>Submit for Approval</button>
                      <button className="diary-cancel-btn" onClick={()=>setShowCourseForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="course-filters">
                  {['All','Web','Frontend','Backend','Design','Data','Infrastructure'].map(f=>(
                    <button key={f} className={`filter-btn ${courseFilter===f?'active':''}`} onClick={()=>setCourseFilter(f)}>{f}</button>
                  ))}
                </div>

                {/* Course grid */}
                <div className="courses-grid">
                  {visibleCourses.map(course => {
                    const enrolled = enrolledIds.includes(course.id);
                    const saved    = savedIds.includes(course.id);
                    const progress = enrolled ? (course.id * 17) % 101 : 0;
                    return (
                      <div key={course.id} className="course-card">
                        <div className="course-card-header">
                          <div className="course-avatar">{course.avatar}</div>
                          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                            <span className="course-category">{course.category}</span>
                            {isAdmin && (
                              <span className={`badge ${
                                course.status==='approved'?'badge-green':
                                course.status==='pending'?'badge-amber':'badge-red'
                              }`} style={{fontSize:'0.62rem'}}>{course.status}</span>
                            )}
                          </div>
                        </div>
                        <div className="course-title">{course.name}</div>
                        <div style={{fontSize:'0.75rem',color:'var(--t4)',marginBottom:'0.6rem',lineHeight:1.5}}>{course.description}</div>
                        <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.75rem',flexWrap:'wrap'}}>
                          <span className="profile-about-tag">⏱ {course.duration}</span>
                          <span className="profile-about-tag">📊 {course.level}</span>
                        </div>
                        {enrolled && (
                          <div className="course-progress" style={{marginBottom:'0.75rem'}}>
                            <div className="progress-bar"><div className="progress-fill" style={{width:`${progress}%`}}/></div>
                            <span className="progress-text">{progress}% Complete</span>
                          </div>
                        )}
                        {/* Actions per role */}
                        {isSuperAdmin && course.status==='pending' ? (
                          <div style={{display:'flex',gap:'0.5rem'}}>
                            <button onClick={()=>approveCourse(course.id)} style={{flex:1,padding:'0.45rem',background:'var(--green-bg)',border:'1px solid var(--green-border)',color:'#86efac',borderRadius:8,fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}>✓ Approve</button>
                            <button onClick={()=>rejectCourse(course.id)}  style={{flex:1,padding:'0.45rem',background:'var(--red-bg)',border:'1px solid var(--red-border)',color:'#fca5a5',borderRadius:8,fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}>✕ Reject</button>
                          </div>
                        ) : !isAdmin ? (
                          <div style={{display:'flex',gap:'0.5rem'}}>
                            <button
                              onClick={()=>setEnrolledIds(prev=>enrolled?prev.filter(i=>i!==course.id):[...prev,course.id])}
                              style={{flex:1,padding:'0.45rem',background:enrolled?'var(--green-bg)':'var(--primary)',border:enrolled?'1px solid var(--green-border)':'none',color:enrolled?'#86efac':'#fff',borderRadius:8,fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}
                            >{enrolled?'✓ Enrolled':'Enroll'}</button>
                            <button
                              onClick={()=>setSavedIds(prev=>saved?prev.filter(i=>i!==course.id):[...prev,course.id])}
                              style={{padding:'0.45rem 0.75rem',background:saved?'rgba(245,158,11,0.1)':'var(--bg3)',border:saved?'1px solid rgba(245,158,11,0.3)':'1px solid var(--border)',color:saved?'#fcd34d':'var(--t3)',borderRadius:8,fontSize:'0.78rem',cursor:'pointer'}}
                            >{saved?'🔖':'🔖'}</button>
                          </div>
                        ) : (
                          <div style={{fontSize:'0.75rem',color:'var(--t4)'}}>Posted by {course.postedBy}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── ASSIGNMENTS TAB ── */}
          {tab === 'assignments' && (() => {
            const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
            const visible = allAssignments.filter(a => assignmentFilter === 'All' || a.status === assignmentFilter);

            return (
              <div className="courses-page">

                {/* Header */}
                <div className="courses-page-header">
                  <div>
    
                    <div className="courses-page-sub">
                      {isAdmin
                        ? `${allAssignments.filter(a=>a.status==='Submitted').length} pending review`
                        : `${allAssignments.filter(a=>a.status==='Graded').length} graded · ${allAssignments.filter(a=>a.status==='Pending').length} pending`}
                    </div>
                  </div>
                  {isAdmin && (
                    <button className="diary-new-btn" onClick={()=>setShowAssignmentForm(v=>!v)}>
                      {showAssignmentForm ? '✕ Cancel' : '+ Post Assignment'}
                    </button>
                  )}
                </div>

                {/* Submitted banner for admin */}
                {isAdmin && allAssignments.some(a=>a.status==='Submitted') && (
                  <div className="courses-approval-banner">
                    🔔 {allAssignments.filter(a=>a.status==='Submitted').length} submission(s) waiting for your review
                  </div>
                )}

                {/* Admin post form */}
                {showAssignmentForm && isAdmin && (
                  <div className="diary-form-card">
                    <div className="diary-form-title">Post New Assignment</div>
                    <div className="diary-form-row" style={{gridTemplateColumns:'1fr 1fr'}}>
                      <div className="diary-form-group">
                        <label>Course</label>
                        <input placeholder="e.g. React & TypeScript Mastery" value={assignmentForm.course} onChange={e=>setAssignmentForm(f=>({...f,course:e.target.value}))} className="diary-input" />
                      </div>
                      <div className="diary-form-group">
                        <label>Due Date</label>
                        <input type="date" value={assignmentForm.dueDate} onChange={e=>setAssignmentForm(f=>({...f,dueDate:e.target.value}))} className="diary-input" />
                      </div>
                    </div>
                    <div className="diary-form-group">
                      <label>Assignment Title</label>
                      <input placeholder="e.g. Build a REST API" value={assignmentForm.title} onChange={e=>setAssignmentForm(f=>({...f,title:e.target.value}))} className="diary-input" />
                    </div>
                    <div className="diary-form-group">
                      <label>Description / Instructions</label>
                      <textarea placeholder="Describe what students need to do..." value={assignmentForm.description} onChange={e=>setAssignmentForm(f=>({...f,description:e.target.value}))} className="diary-textarea" rows={3} />
                    </div>
                    <div className="diary-form-actions">
                      <button className="diary-submit-btn" onClick={postAssignment}>Post Assignment</button>
                      <button className="diary-cancel-btn" onClick={()=>setShowAssignmentForm(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Filters */}
                <div className="course-filters">
                  {(['All','Pending','Submitted','Graded'] as const).map(f=>(
                    <button key={f} className={`filter-btn ${assignmentFilter===f?'active':''}`} onClick={()=>setAssignmentFilter(f)}>{f}</button>
                  ))}
                </div>

                {/* Assignment cards */}
                <div className="asgn-list">
                  {visible.map(a => (
                    <div key={a.id} className="asgn-card">
                      <div className="asgn-card-top">
                        <div className="asgn-card-left">
                          <div className="asgn-icon">📌</div>
                          <div>
                            <div className="asgn-title">{a.title}</div>
                            <div className="asgn-meta">{a.course} · Due {a.dueDate}</div>
                          </div>
                        </div>
                        <div className="asgn-card-right">
                          <span className={`badge ${
                            a.status==='Graded'?'badge-green':
                            a.status==='Submitted'?'badge-blue':'badge-amber'
                          }`}>{a.status}</span>
                          {a.grade && <span className="asgn-grade">{a.grade}</span>}
                        </div>
                      </div>

                      {/* Feedback (student view) */}
                      {!isAdmin && a.feedback && (
                        <div className="diary-feedback-box" style={{marginTop:'0.75rem'}}>
                          <div className="diary-feedback-label">💬 Admin Feedback</div>
                          <div className="diary-feedback-text">{a.feedback}</div>
                        </div>
                      )}

                      {/* Submission note */}
                      {a.submittedNote && (
                        <div style={{marginTop:'0.5rem',fontSize:'0.78rem',color:'var(--t4)'}}>
                          📎 {a.submittedFile} &nbsp;&middot;&nbsp; "{a.submittedNote}"
                        </div>
                      )}

                      {/* Student: submit form */}
                      {!isAdmin && a.status==='Pending' && (
                        submitForm?.id===a.id ? (
                          <div className="asgn-submit-form">
                            <textarea
                              className="diary-textarea"
                              rows={2}
                              placeholder="Add a note about your submission (optional)"
                              value={submitForm.note}
                              onChange={e=>setSubmitForm({id:a.id,note:e.target.value})}
                            />
                            <div className="diary-form-actions" style={{marginTop:'0.5rem'}}>
                              <button className="diary-submit-btn" onClick={()=>submitAssignment(a.id, submitForm.note)}>Submit Assignment</button>
                              <button className="diary-cancel-btn" onClick={()=>setSubmitForm(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button className="asgn-action-btn" onClick={()=>setSubmitForm({id:a.id,note:''})}>📤 Submit Assignment</button>
                        )
                      )}

                      {/* Admin: grade form */}
                      {isAdmin && a.status==='Submitted' && (
                        gradeForm?.id===a.id ? (
                          <div className="asgn-submit-form">
                            <div className="diary-form-row" style={{gridTemplateColumns:'120px 1fr',gap:'0.5rem'}}>
                              <div className="diary-form-group">
                                <label>Grade</label>
                                <select value={gradeForm.grade} onChange={e=>setGradeForm(f=>f?{...f,grade:e.target.value}:f)} className="diary-input">
                                  {['A+','A','A-','B+','B','B-','C+','C','D','F'].map(g=><option key={g}>{g}</option>)}
                                </select>
                              </div>
                              <div className="diary-form-group">
                                <label>Feedback</label>
                                <input placeholder="Write feedback for the student..." value={gradeForm.feedback} onChange={e=>setGradeForm(f=>f?{...f,feedback:e.target.value}:f)} className="diary-input" />
                              </div>
                            </div>
                            <div className="diary-form-actions" style={{marginTop:'0.5rem'}}>
                              <button className="diary-submit-btn" onClick={()=>gradeAssignment(a.id, gradeForm.grade, gradeForm.feedback)}>✓ Submit Grade</button>
                              <button className="diary-cancel-btn" onClick={()=>setGradeForm(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button className="asgn-action-btn" style={{background:'rgba(79,70,229,0.1)',borderColor:'var(--primary-border)',color:'#a5b4fc'}} onClick={()=>setGradeForm({id:a.id,grade:'A',feedback:''})}>✏️ Grade Submission</button>
                        )
                      )}

                      {/* Admin: already graded */}
                      {isAdmin && a.status==='Graded' && a.feedback && (
                        <div className="diary-feedback-box" style={{marginTop:'0.75rem'}}>
                          <div className="diary-feedback-label">Your feedback · Grade: {a.grade}</div>
                          <div className="diary-feedback-text">{a.feedback}</div>
                        </div>
                      )}
                    </div>
                  ))}
                  {visible.length === 0 && (
                    <p style={{color:'var(--t4)',fontSize:'0.84rem',padding:'1rem 0'}}>No assignments found.</p>
                  )}
                </div>
              </div>
            );
          })()}

          {/* ── INTERNSHIPS TAB ── */}
          {tab === 'internships' && (
            <div className="card">
              {/* Internship Status Filters */}
              <div className="internship-filters">
                {['All', 'Open', 'Interviewing', 'Closed'].map(status => (
                  <button
                    key={status}
                    className={`status-filter ${internshipFilter === status ? 'active' : ''} ${status.toLowerCase()}`}
                    onClick={() => setInternshipFilter(status)}
                  >
                    {status}
                    <span className="filter-count">
                      {status === 'All' ? internshipBoard.length : internshipBoard.filter(i => i.status === status).length}
                    </span>
                  </button>
                ))}
              </div>
              
              <div className="internships-timeline">
                {internshipBoard
                  .filter(internship => internshipFilter === 'All' || internship.status === internshipFilter)
                  .map((internship, idx) => (
                    <div key={idx} className="internship-item">
                      <div className="internship-connector">
                        <div className="timeline-dot"></div>
                        {idx < internshipBoard.filter(i => internshipFilter === 'All' || i.status === internshipFilter).length - 1 && (
                          <div className="timeline-line"></div>
                        )}
                      </div>
                      <div className="internship-card">
                        <div className="internship-header">
                          <div className="company-logo">
                            {internship.company.charAt(0)}
                          </div>
                          <div className="internship-meta">
                            <div className="internship-company">{internship.company}</div>
                            <div className="internship-posted">{internship.posted}</div>
                          </div>
                          <div className="internship-status">
                            <span className={`status-badge ${internship.status.toLowerCase()}`}>
                              {internship.status}
                            </span>
                          </div>
                        </div>
                        <div className="internship-title">{internship.title}</div>
                        <div className="internship-actions">
                          <button className="action-btn apply-btn">
                            {internship.status === 'Open' ? 'Apply Now' : 
                             internship.status === 'Interviewing' ? 'In Process' : 'View Details'}
                          </button>
                          <button className="action-btn save-btn">Save</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── DIARIES TAB ── */}
          {tab === 'diaries' && (
            <div className="diary-page">

              {/* Header */}
              <div className="diary-header">
                <div>

                  <div className="diary-header-sub">{diaryEntries.length} entries · {diaryEntries.filter(d=>d.status==='Reviewed').length} reviewed</div>
                </div>
                <button className="diary-new-btn" onClick={()=>{setShowDiaryForm(v=>!v);setDiaryView(null);}}>
                  {showDiaryForm ? '✕ Cancel' : '+ New Entry'}
                </button>
              </div>

              {/* Stats strip */}
              <div className="diary-stats">
                <div className="diary-stat"><span className="diary-stat-val">{diaryEntries.length}</span><span className="diary-stat-lbl">Total</span></div>
                <div className="diary-stat"><span className="diary-stat-val" style={{color:'var(--amber)'}}>{diaryEntries.filter(d=>d.status==='Pending').length}</span><span className="diary-stat-lbl">Pending</span></div>
                <div className="diary-stat"><span className="diary-stat-val" style={{color:'var(--blue)'}}>{diaryEntries.filter(d=>d.status==='Submitted').length}</span><span className="diary-stat-lbl">Submitted</span></div>
                <div className="diary-stat"><span className="diary-stat-val" style={{color:'var(--green)'}}>{diaryEntries.filter(d=>d.status==='Reviewed').length}</span><span className="diary-stat-lbl">Reviewed</span></div>
                <div className="diary-stat"><span className="diary-stat-val">{diaryEntries.reduce((a,d)=>a+(parseFloat(d.hours)||0),0)}h</span><span className="diary-stat-lbl">Total Hours</span></div>
              </div>

              {/* New Entry Form */}
              {showDiaryForm && (
                <div className="diary-form-card">
                  <div className="diary-form-title">New Diary Entry</div>
                  <div className="diary-form-row">
                    <div className="diary-form-group">
                      <label>Date</label>
                      <input type="date" value={diaryForm.date} onChange={e=>setDiaryForm(f=>({...f,date:e.target.value}))} className="diary-input" />
                    </div>
                    <div className="diary-form-group">
                      <label>Hours Worked</label>
                      <input type="number" min="1" max="12" placeholder="e.g. 8" value={diaryForm.hours} onChange={e=>setDiaryForm(f=>({...f,hours:e.target.value}))} className="diary-input" />
                    </div>
                    <div className="diary-form-group">
                      <label>Mood</label>
                      <div className="diary-mood-row">
                        {['😊','😅','🤔','😴','🔥','😤'].map(m=>(
                          <button key={m} className={`diary-mood-btn ${diaryForm.mood===m?'active':''}`} onClick={()=>setDiaryForm(f=>({...f,mood:m}))}>{m}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="diary-form-group">
                    <label>Entry Title</label>
                    <input type="text" placeholder="e.g. API Integration Day" value={diaryForm.title} onChange={e=>setDiaryForm(f=>({...f,title:e.target.value}))} className="diary-input" />
                  </div>
                  <div className="diary-form-group">
                    <label>Tasks Completed</label>
                    <input type="text" placeholder="e.g. Fixed auth bug, wrote tests" value={diaryForm.tasks} onChange={e=>setDiaryForm(f=>({...f,tasks:e.target.value}))} className="diary-input" />
                  </div>
                  <div className="diary-form-group">
                    <label>Daily Log <span style={{color:'var(--t4)',fontWeight:400}}>(what you learned, challenges faced)</span></label>
                    <textarea placeholder="Describe your day in detail — what you worked on, what you learned, any blockers..." value={diaryForm.content} onChange={e=>setDiaryForm(f=>({...f,content:e.target.value}))} className="diary-textarea" rows={5} />
                  </div>
                  <div className="diary-form-actions">
                    <button className="diary-submit-btn" onClick={submitDiary}>Submit Entry</button>
                    <button className="diary-cancel-btn" onClick={()=>setShowDiaryForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Detail view */}
              {diaryView && !showDiaryForm && (
                <div className="diary-detail-card">
                  <div className="diary-detail-header">
                    <div>
                      <div className="diary-detail-title">{diaryView.mood} {diaryView.title}</div>
                      <div className="diary-detail-meta">{diaryView.date} · {diaryView.hours}h worked</div>
                    </div>
                    <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                      <span className={`badge ${diaryView.status==='Reviewed'?'badge-green':diaryView.status==='Submitted'?'badge-blue':'badge-amber'}`}>{diaryView.status}</span>
                      <button className="diary-close-btn" onClick={()=>setDiaryView(null)}>✕</button>
                    </div>
                  </div>
                  {diaryView.tasks && <div className="diary-detail-tasks"><strong>Tasks:</strong> {diaryView.tasks}</div>}
                  <div className="diary-detail-content">{diaryView.content}</div>
                  {diaryView.feedback && (
                    <div className="diary-feedback-box">
                      <div className="diary-feedback-label">💬 Mentor Feedback</div>
                      <div className="diary-feedback-text">{diaryView.feedback}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Entries list */}
              <div className="diary-entries">
                {diaryEntries.map(entry => (
                  <div key={entry.id} className={`diary-entry-card ${diaryView?.id===entry.id?'active':''}`} onClick={()=>{setDiaryView(entry);setShowDiaryForm(false);}}>
                    <div className="diary-entry-left">
                      <div className="diary-entry-mood">{entry.mood}</div>
                      <div className="diary-entry-date-col">
                        <div className="diary-entry-day">{new Date(entry.date).toLocaleDateString('en-US',{day:'2-digit'})}</div>
                        <div className="diary-entry-month">{new Date(entry.date).toLocaleDateString('en-US',{month:'short'})}</div>
                      </div>
                    </div>
                    <div className="diary-entry-body">
                      <div className="diary-entry-title">{entry.title}</div>
                      <div className="diary-entry-preview">{entry.content.slice(0,90)}{entry.content.length>90?'...':''}</div>
                      <div className="diary-entry-footer">
                        <span className="diary-entry-hours">⏱ {entry.hours}h</span>
                        {entry.tasks && <span className="diary-entry-tasks">✅ {entry.tasks.split(',').length} tasks</span>}
                        {entry.feedback && <span className="diary-entry-has-feedback">💬 Feedback</span>}
                      </div>
                    </div>
                    <div className="diary-entry-right">
                      <span className={`badge ${entry.status==='Reviewed'?'badge-green':entry.status==='Submitted'?'badge-blue':'badge-amber'}`}>{entry.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {tab === 'projects' && (
            <div className="card">
              <div className="card-header">
                <span className="badge badge-violet">{projectSpaces.length} active projects</span>
              </div>
              
              <div className="projects-hub">
                {projectSpaces.map((project, idx) => (
                    <div key={idx} className="project-hexagon">
                      <div className="hexagon-content">
                        <div className="project-progress-ring">
                          <svg className="progress-circle" width="80" height="80">
                            <circle
                              className="progress-bg"
                              cx="40"
                              cy="40"
                              r="35"
                              stroke="var(--border)"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              className="progress-fill"
                              cx="40"
                              cy="40"
                              r="35"
                              stroke={`url(#gradient-${project.role.toLowerCase()})`}
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 35}`}
                              strokeDashoffset={`${2 * Math.PI * 35 * (1 - project.progress / 100)}`}
                              transform="rotate(-90 40 40)"
                            />
                          </svg>
                          <div className="progress-text">
                            <span className="progress-percent">{project.progress}%</span>
                            <span className="progress-label">done</span>
                          </div>
                        </div>
                        
                        <div className="project-info">
                          <div className="project-name">{project.name}</div>
                          <div className="project-mentor">👤 {project.team[0]?.name}</div>
                          <div className="project-company">{project.company}</div>
                        </div>
                        
                        <div className="project-team">
                          <div className="team-members">
                            {project.team.slice(0, 3).map((member, idx) => (
                              <div key={idx} className={`team-member ${member.role.toLowerCase()}`}>
                                <div className="member-avatar">{member.avatar}</div>
                              </div>
                            ))}
                            {project.team.length > 3 && (
                              <div className="team-member more">
                                <div className="member-avatar">+{project.team.length - 3}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="project-actions">
                          <button className="hex-btn primary">Open Project</button>
                          <button className="hex-btn secondary">Team Chat</button>
                        </div>
                      </div>
                      
                      {/* SVG Gradients */}
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id={`gradient-contributor`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                          <linearGradient id={`gradient-mentor`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="100%" stopColor="#16a34a" />
                          </linearGradient>
                          <linearGradient id={`gradient-member`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ── COMMUNITY TAB ── */}
          {tab === 'community' && (() => {
            const role = user?.role ?? 'user';

            // Role groups visible to everyone
            const roleGroups = [
              { id: 'Students',      label: 'Students',      icon: '🎓', badge: 'badge-indigo' },
              { id: 'Faculty',       label: 'Faculty',       icon: '📚', badge: 'badge-violet' },
              { id: 'Organizations', label: 'Organizations', icon: '🏢', badge: 'badge-blue'   },
            ];

            // Company groups — org & admin can post; students/faculty can read
            const companyGroups = [
              { id: 'Acme Corp',  label: 'Acme Corp',  icon: 'A', color: '#4f46e5' },
              { id: 'HiveTech',   label: 'HiveTech',   icon: 'H', color: '#22c55e' },
              { id: 'DeepLens',   label: 'DeepLens',   icon: 'D', color: '#f59e0b' },
              { id: 'TechFlow',   label: 'TechFlow',   icon: 'T', color: '#ec4899' },
            ];

            const canPost = (groupId: string) => {
              if (['Students','Faculty','Organizations'].includes(groupId)) return true;
              // company groups: only org/admin can post
              return role === 'organization' || role === 'admin' || role === 'super_admin';
            };

            const msgs = chatMessages[activeGroup] ?? [];

            const sendMsg = () => {
              if (!chatInput.trim()) return;
              const now = new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
              setChatMessages(prev => ({
                ...prev,
                [activeGroup]: [...(prev[activeGroup]??[]), { sender: user?.name?.split(' ')[0]??'You', text: chatInput.trim(), time: now }]
              }));
              setChatInput('');
            };

            return (
              <div className="community-shell">
                {/* LEFT: group list */}
                <div className="community-sidebar">
                  <div className="community-section-label">Role Groups</div>
                  {roleGroups.map(g => (
                    <div key={g.id} className={`community-group-item ${activeGroup===g.id?'active':''}`} onClick={()=>setActiveGroup(g.id)}>
                      <div className="community-group-icon">{g.icon}</div>
                      <div className="community-group-name">{g.label}</div>
                      {chatMessages[g.id]?.length>0 && <span className={`badge ${g.badge}`} style={{marginLeft:'auto',padding:'1px 6px',fontSize:'0.65rem'}}>{chatMessages[g.id].length}</span>}
                    </div>
                  ))}
                  <div className="community-section-label" style={{marginTop:'1rem'}}>Company Groups</div>
                  {companyGroups.map(g => (
                    <div key={g.id} className={`community-group-item ${activeGroup===g.id?'active':''}`} onClick={()=>setActiveGroup(g.id)}>
                      <div className="community-group-icon" style={{background:g.color+'22',color:g.color,fontWeight:700,fontSize:'0.85rem'}}>{g.icon}</div>
                      <div className="community-group-name">{g.label}</div>
                      {chatMessages[g.id]?.length>0 && <span className="badge badge-indigo" style={{marginLeft:'auto',padding:'1px 6px',fontSize:'0.65rem'}}>{chatMessages[g.id].length}</span>}
                    </div>
                  ))}
                </div>

                {/* RIGHT: chat panel */}
                <div className="community-chat">
                  <div className="community-chat-header">
                    <div className="community-chat-title">
                      {[...roleGroups,...companyGroups].find(g=>g.id===activeGroup)?.icon} {activeGroup}
                    </div>
                    <div className="community-chat-meta">
                      <span className="badge badge-indigo">{msgs.length} messages</span>
                      {!canPost(activeGroup) && <span className="badge badge-amber">Read-only for your role</span>}
                    </div>
                  </div>

                  <div className="community-messages">
                    {msgs.length === 0 && (
                      <div className="community-empty">No messages yet. Be the first to say something!</div>
                    )}
                    {msgs.map((m, i) => {
                      const isMe = m.sender === user?.name?.split(' ')[0];
                      return (
                        <div key={i} className={`chat-msg ${isMe?'chat-msg-me':''}`}>
                          {!isMe && <div className="chat-avatar">{m.sender.slice(0,2).toUpperCase()}</div>}
                          <div className="chat-bubble-wrap">
                            {!isMe && <div className="chat-sender">{m.sender}</div>}
                            <div className={`chat-bubble ${isMe?'chat-bubble-me':''}`}>{m.text}</div>
                            <div className="chat-time">{m.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="community-input-row">
                    {canPost(activeGroup) ? (
                      <>
                        <input
                          className="community-input"
                          placeholder={`Message #${activeGroup}...`}
                          value={chatInput}
                          onChange={e=>setChatInput(e.target.value)}
                          onKeyDown={e=>e.key==='Enter'&&sendMsg()}
                        />
                        <button className="community-send-btn" onClick={sendMsg}>Send</button>
                      </>
                    ) : (
                      <div className="community-readonly">🔒 You can read but not post in this group</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ── FACULTY TAB ── */}
          {tab === 'faculty' && (
            <div className="card">
              <div className="card-header">
                <span className="badge badge-violet">{facultyMentoring.length} interns</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Intern</th>
                      <th>Project</th>
                      <th>Progress</th>
                      <th>Last Update</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyMentoring.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.intern}</td>
                        <td>{item.project}</td>
                        <td>
                          <div className="rp-course-prog-track" style={{ width: 120 }}>
                            <div className="rp-course-prog-fill" style={{ width: `${item.progress}%`, background: 'var(--green)' }} />
                          </div>
                          <span style={{ marginLeft: 6 }}>{item.progress}%</span>
                        </td>
                        <td>{item.lastUpdate}</td>
                        <td><button className="primary-btn">Review</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORGANIZATION TAB ── */}
          {tab === 'organization' && (
            <div className="card">
              <div className="card-header">
                <span className="badge badge-blue">{organizationManagement.length} interns</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Intern</th>
                      <th>Internship</th>
                      <th>Progress</th>
                      <th>Evaluation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizationManagement.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.intern}</td>
                        <td>{item.internship}</td>
                        <td>
                          <div className="rp-course-prog-track" style={{ width: 120 }}>
                            <div className="rp-course-prog-fill" style={{ width: `${item.progress}%`, background: 'var(--primary)' }} />
                          </div>
                          <span style={{ marginLeft: 6 }}>{item.progress}%</span>
                        </td>
                        <td>{item.evaluation}</td>
                        <td><button className="primary-btn">Hire</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REPORTS TAB ── */}
          {tab === 'reports' && (() => {
            // ── data derived from real state ──
            const weeks = ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7'];

            // Assignments: submitted per week (seeded)
            const asgnSubmitted = [1,2,1,3,2,1,2];
            const asgnGraded    = [0,1,1,2,2,1,2];
            const asgnPending   = [1,1,0,1,0,0,0];

            // Diary entries per week
            const diaryWeekly   = [0,1,1,2,1,2,3];

            // Course enrollment per week
            const enrollWeekly  = [2,1,0,1,2,1,1];

            // Engagement: combined activity score
            const engagement    = weeks.map((_,i) => asgnSubmitted[i] + diaryWeekly[i] + enrollWeekly[i]);

            const maxEngagement = Math.max(...engagement, 1);
            const maxBar        = Math.max(...asgnSubmitted, ...asgnGraded, 1);

            // Donut data: assignment status breakdown
            const totalA   = allAssignments.length;
            const gradedA  = allAssignments.filter(a=>a.status==='Graded').length;
            const submittedA = allAssignments.filter(a=>a.status==='Submitted').length;
            const pendingA = allAssignments.filter(a=>a.status==='Pending').length;

            // Donut helper
            const donutSlice = (pct: number, offset: number, color: string) => {
              const r = 40, cx = 50, cy = 50;
              const circ = 2 * Math.PI * r;
              return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="14"
                strokeDasharray={`${pct/100*circ} ${circ}`}
                strokeDashoffset={-offset/100*circ}
                transform="rotate(-90 50 50)" />;
            };

            const gradedPct   = totalA ? Math.round(gradedA/totalA*100)   : 0;
            const submittedPct= totalA ? Math.round(submittedA/totalA*100): 0;
            const pendingPct  = totalA ? Math.round(pendingA/totalA*100)  : 0;

            // Diary mood breakdown
            const moodCounts: Record<string,number> = {};
            diaryEntries.forEach(d => { moodCounts[d.mood] = (moodCounts[d.mood]||0)+1; });
            const moods = Object.entries(moodCounts);

            // Top-level KPIs
            const totalEnrolled  = enrolledIds.length;
            const totalDiaries   = diaryEntries.length;
            const totalAssignments = allAssignments.length;
            const gradedRate     = totalA ? Math.round(gradedA/totalA*100) : 0;

            return (
              <div className="analytics-page">

                {/* KPI row */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{background:'rgba(79,70,229,0.12)'}}>📚</div>
                    <div className="stat-value">{totalEnrolled}</div>
                    <div className="stat-label">Courses Enrolled</div>
                    <div className="stat-sub up">{allCourses.filter(c=>c.status==='approved').length} available</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{background:'rgba(34,197,94,0.12)'}}>📝</div>
                    <div className="stat-value">{totalAssignments}</div>
                    <div className="stat-label">Assignments</div>
                    <div className="stat-sub up">{gradedRate}% graded</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{background:'rgba(245,158,11,0.12)'}}>📓</div>
                    <div className="stat-value">{totalDiaries}</div>
                    <div className="stat-label">Diary Entries</div>
                    <div className="stat-sub up">{diaryEntries.filter(d=>d.status==='Reviewed').length} reviewed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{background:'rgba(139,92,246,0.12)'}}>🔥</div>
                    <div className="stat-value">{Math.max(...engagement)}</div>
                    <div className="stat-label">Peak Engagement</div>
                    <div className="stat-sub neutral">activities/week</div>
                  </div>
                </div>

                {/* Row 1: Bar chart + Donut */}
                <div className="analytics-row">

                  {/* Bar chart — Assignment activity */}
                  <div className="card analytics-chart-card">
                    <div className="card-header">
                      <div className="card-title">📊 Assignment Activity (Weekly)</div>
                      <div style={{display:'flex',gap:'0.75rem'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--t4)'}}><span style={{width:10,height:10,borderRadius:2,background:'#4f46e5',display:'inline-block'}}/> Submitted</span>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--t4)'}}><span style={{width:10,height:10,borderRadius:2,background:'#22c55e',display:'inline-block'}}/> Graded</span>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--t4)'}}><span style={{width:10,height:10,borderRadius:2,background:'#f59e0b',display:'inline-block'}}/> Pending</span>
                      </div>
                    </div>
                    <div className="bar-chart">
                      {weeks.map((w,i) => (
                        <div key={w} className="bar-group">
                          <div className="bar-col">
                            <div className="bar" style={{height:`${(asgnSubmitted[i]/maxBar)*120}px`,background:'#4f46e5'}} title={`Submitted: ${asgnSubmitted[i]}`}/>
                            <div className="bar" style={{height:`${(asgnGraded[i]/maxBar)*120}px`,background:'#22c55e'}} title={`Graded: ${asgnGraded[i]}`}/>
                            <div className="bar" style={{height:`${(asgnPending[i]/maxBar)*120}px`,background:'#f59e0b'}} title={`Pending: ${asgnPending[i]}`}/>
                          </div>
                          <div className="bar-label">{w.replace('Week ','W')}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Donut — Assignment status */}
                  <div className="card analytics-donut-card">
                    <div className="card-header"><div className="card-title">🍩 Assignment Status</div></div>
                    <div className="donut-wrap">
                      <svg viewBox="0 0 100 100" width="140" height="140">
                        {donutSlice(100, 0, 'var(--bg3)')}
                        {donutSlice(gradedPct, 0, '#22c55e')}
                        {donutSlice(submittedPct, gradedPct, '#4f46e5')}
                        {donutSlice(pendingPct, gradedPct+submittedPct, '#f59e0b')}
                        <text x="50" y="46" textAnchor="middle" fill="var(--t1)" fontSize="13" fontWeight="800">{gradedRate}%</text>
                        <text x="50" y="58" textAnchor="middle" fill="var(--t4)" fontSize="7">graded</text>
                      </svg>
                      <div className="donut-legend">
                        <div className="donut-item"><span className="donut-dot" style={{background:'#22c55e'}}/><span>Graded</span><strong>{gradedA}</strong></div>
                        <div className="donut-item"><span className="donut-dot" style={{background:'#4f46e5'}}/><span>Submitted</span><strong>{submittedA}</strong></div>
                        <div className="donut-item"><span className="donut-dot" style={{background:'#f59e0b'}}/><span>Pending</span><strong>{pendingA}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Line chart — Engagement + Diary */}
                <div className="analytics-row">

                  {/* Line chart — Weekly engagement */}
                  <div className="card analytics-chart-card">
                    <div className="card-header">
                      <div className="card-title">📈 Student Engagement (Weekly)</div>
                      <div style={{display:'flex',gap:'0.75rem'}}>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--t4)'}}><span style={{width:16,height:2,background:'#4f46e5',display:'inline-block',borderRadius:2}}/> Total Activity</span>
                        <span style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.72rem',color:'var(--t4)'}}><span style={{width:16,height:2,background:'#f59e0b',display:'inline-block',borderRadius:2}}/> Diary Entries</span>
                      </div>
                    </div>
                    <div className="line-chart-wrap">
                      <svg viewBox="0 0 420 130" preserveAspectRatio="none" style={{width:'100%',height:130}}>
                        {/* grid lines */}
                        {[0,1,2,3].map(i=>(
                          <line key={i} x1="30" y1={10+i*30} x2="410" y2={10+i*30} stroke="var(--border)" strokeWidth="1"/>
                        ))}
                        {/* engagement area */}
                        <defs>
                          <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                          </linearGradient>
                          <linearGradient id="diaryGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* engagement filled area */}
                        <polygon
                          points={[
                            '30,120',
                            ...engagement.map((v,i)=>`${30+i*60},${120-(v/maxEngagement)*100}`),
                            `${30+6*60},120`
                          ].join(' ')}
                          fill="url(#engGrad)"
                        />
                        {/* engagement line */}
                        <polyline
                          points={engagement.map((v,i)=>`${30+i*60},${120-(v/maxEngagement)*100}`).join(' ')}
                          fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                        />
                        {/* diary filled area */}
                        <polygon
                          points={[
                            '30,120',
                            ...diaryWeekly.map((v,i)=>`${30+i*60},${120-(v/maxEngagement)*100}`),
                            `${30+6*60},120`
                          ].join(' ')}
                          fill="url(#diaryGrad)"
                        />
                        {/* diary line */}
                        <polyline
                          points={diaryWeekly.map((v,i)=>`${30+i*60},${120-(v/maxEngagement)*100}`).join(' ')}
                          fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5 3"
                        />
                        {/* dots */}
                        {engagement.map((v,i)=>(
                          <circle key={i} cx={30+i*60} cy={120-(v/maxEngagement)*100} r="4" fill="#4f46e5" stroke="var(--bg2)" strokeWidth="2"/>
                        ))}
                        {/* x labels */}
                        {weeks.map((w,i)=>(
                          <text key={i} x={30+i*60} y="128" textAnchor="middle" fill="var(--t4)" fontSize="8">{w.replace('Week ','W')}</text>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Diary mood + horizontal bars */}
                  <div className="card analytics-donut-card">
                    <div className="card-header"><div className="card-title">😊 Diary Mood Breakdown</div></div>
                    <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',marginTop:'0.5rem'}}>
                      {moods.length === 0 ? (
                        <p style={{color:'var(--t4)',fontSize:'0.82rem'}}>No diary entries yet.</p>
                      ) : moods.map(([mood, count]) => (
                        <div key={mood} style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                          <span style={{fontSize:'1.2rem',width:28,textAlign:'center'}}>{mood}</span>
                          <div style={{flex:1,height:10,background:'var(--bg3)',borderRadius:99,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${(count/diaryEntries.length)*100}%`,background:'linear-gradient(90deg,#4f46e5,#8b5cf6)',borderRadius:99,transition:'width 0.4s'}}/>
                          </div>
                          <span style={{fontSize:'0.78rem',color:'var(--t3)',minWidth:16,textAlign:'right'}}>{count}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:'1.25rem'}}>
                      <div className="card-title" style={{marginBottom:'0.6rem'}}>📓 Diary Entries / Week</div>
                      {diaryWeekly.map((v,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.35rem'}}>
                          <span style={{fontSize:'0.72rem',color:'var(--t4)',width:24}}>W{i+1}</span>
                          <div style={{flex:1,height:8,background:'var(--bg3)',borderRadius:99,overflow:'hidden'}}>
                            <div style={{height:'100%',width:`${(v/Math.max(...diaryWeekly,1))*100}%`,background:'#f59e0b',borderRadius:99}}/>
                          </div>
                          <span style={{fontSize:'0.72rem',color:'var(--t3)',minWidth:12}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 3: Course enrollment horizontal bar + activity heatmap */}
                <div className="analytics-row">

                  {/* Course enrollment bars */}
                  <div className="card analytics-chart-card">
                    <div className="card-header"><div className="card-title">🎓 Course Enrollment & Progress</div></div>
                    <div style={{display:'flex',flexDirection:'column',gap:'0.85rem',marginTop:'0.25rem'}}>
                      {allCourses.filter(c=>c.status==='approved').map(c=>{
                        const enrolled = enrolledIds.includes(c.id);
                        const progress = enrolled ? (c.id*17)%101 : 0;
                        return (
                          <div key={c.id}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                              <span style={{fontSize:'0.8rem',color:'var(--t2)',fontWeight:600}}>{c.avatar} {c.name}</span>
                              <span style={{fontSize:'0.75rem',color: enrolled?'var(--green)':'var(--t4)'}}>{enrolled?`${progress}%`:'Not enrolled'}</span>
                            </div>
                            <div style={{height:8,background:'var(--bg3)',borderRadius:99,overflow:'hidden'}}>
                              <div style={{height:'100%',width:`${progress}%`,background:enrolled?'linear-gradient(90deg,#4f46e5,#8b5cf6)':'transparent',borderRadius:99,transition:'width 0.4s'}}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity heatmap (7 weeks × 5 activity types) */}
                  <div className="card analytics-donut-card">
                    <div className="card-header"><div className="card-title">🗓️ Activity Heatmap</div></div>
                    <div style={{overflowX:'auto'}}>
                      <table style={{borderCollapse:'separate',borderSpacing:4,fontSize:'0.7rem'}}>
                        <thead>
                          <tr>
                            <th style={{color:'var(--t4)',fontWeight:500,textAlign:'left',paddingRight:8}}></th>
                            {weeks.map(w=><th key={w} style={{color:'var(--t4)',fontWeight:500,minWidth:32,textAlign:'center'}}>{w.replace('Week ','W')}</th>)}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {label:'Assignments',data:asgnSubmitted,color:'#4f46e5'},
                            {label:'Graded',     data:asgnGraded,   color:'#22c55e'},
                            {label:'Diaries',    data:diaryWeekly,  color:'#f59e0b'},
                            {label:'Enrolled',   data:enrollWeekly, color:'#8b5cf6'},
                            {label:'Engagement', data:engagement,   color:'#ec4899'},
                          ].map(row=>(
                            <tr key={row.label}>
                              <td style={{color:'var(--t3)',paddingRight:8,whiteSpace:'nowrap',fontWeight:500}}>{row.label}</td>
                              {row.data.map((v,i)=>{
                                const max = Math.max(...row.data,1);
                                const opacity = 0.1 + (v/max)*0.85;
                                return (
                                  <td key={i} title={`${row.label} W${i+1}: ${v}`}>
                                    <div style={{
                                      width:32,height:22,borderRadius:5,
                                      background:row.color,
                                      opacity,
                                      display:'flex',alignItems:'center',justifyContent:'center',
                                      color:'#fff',fontSize:'0.68rem',fontWeight:700
                                    }}>{v||''}</div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ── INTERN TAB ── */}
          {tab === 'intern' && (() => {
            const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
            const allCourses = [
              { name: 'Full Stack Web Development', emoji: '🌐', color: '#3b82f6' },
              { name: 'React & TypeScript Mastery', emoji: '⚛️', color: '#06b6d4' },
              { name: 'Node.js & REST APIs', emoji: '🟢', color: '#22c55e' },
              { name: 'UI/UX Design Fundamentals', emoji: '🎨', color: '#f97316' },
              { name: 'Database Design & SQL', emoji: '🗄️', color: '#8b5cf6' },
              { name: 'DevOps & CI/CD Basics', emoji: '🚀', color: '#ec4899' },
            ];

            // seed deterministic progress per student per course using their name
            const seedProgress = (name: string, course: string) => {
              let h = 0;
              for (const c of name + course) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
              return Math.round(10 + (h % 91));
            };

            const students = adminUsers.filter(u => u.role === 'user');
            const totalStudents = students.length;
            const verifiedStudents = students.filter(u => u.isVerified).length;

            // build per-student course data
            const studentData = students.map(s => {
              const courses = allCourses.map(c => ({ ...c, progress: seedProgress(s.name, c.name) }));
              const avgProgress = Math.round(courses.reduce((a, c) => a + c.progress, 0) / courses.length);
              const completed = courses.filter(c => c.progress >= 90).length;
              return { ...s, courses, avgProgress, completed };
            });

            const myCourses = allCourses.map(c => ({ ...c, progress: seedProgress(user?.name || '', c.name) }));

            const courseCard = (
              <div className="card">
                <div className="card-header">
                  <div className="card-title">My Courses</div>
                  <span className="badge badge-indigo">{myCourses.length} enrolled</span>
                </div>
                {myCourses.map(c => (
                  <div className="rp-course-row" key={c.name}>
                    <div className="rp-course-thumb" style={{ background: c.color + '22' }}>{c.emoji}</div>
                    <div className="rp-course-info">
                      <div className="rp-course-name">{c.name}</div>
                      <div className="rp-course-prog-wrap">
                        <div className="rp-course-prog-track">
                          <div className="rp-course-prog-fill" style={{ width: `${c.progress}%`, background: c.color }} />
                        </div>
                        <span>{c.progress}%</span>
                      </div>
                    </div>
                    {c.progress >= 90 && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>✓</span>}
                  </div>
                ))}
              </div>
            );

            if (!isAdmin) return (
              <>
                <div className="welcome-banner">
                  <h2>My Learning 📚</h2>
                  <p>Track your enrolled courses and progress.</p>
                  <div className="welcome-badges">
                    <span className="badge badge-indigo">Student</span>
                    <span className="badge badge-green">Active</span>
                  </div>
                </div>
                {courseCard}
              </>
            );

            const rankEmojis = ['🥇', '🥈', '🥉'];
            const ranked = [...studentData].sort((a, b) => b.avgProgress - a.avgProgress);

            return (
              <>
                <div className="welcome-banner">
                  <h2>Intern Dashboard 🎓</h2>
                  <p>All students, their course progress and performance at a glance.</p>
                  <div className="welcome-badges">
                    <span className="badge badge-violet">{user?.role}</span>
                    <span className="badge badge-green">Live Data</span>
                    <span className="badge badge-indigo">LMS</span>
                  </div>
                </div>

                {/* stats from real adminUsers data */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(79,70,229,0.12)' }}>👥</div>
                    <div className="stat-value">{totalStudents}</div>
                    <div className="stat-label">Total Students</div>
                    <div className="stat-sub neutral">{adminUsers.length} total users</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(34,197,94,0.12)' }}>✅</div>
                    <div className="stat-value">{verifiedStudents}</div>
                    <div className="stat-label">Verified Students</div>
                    <div className="stat-sub up">{totalStudents - verifiedStudents} pending</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(59,130,246,0.12)' }}>📚</div>
                    <div className="stat-value">{allCourses.length}</div>
                    <div className="stat-label">Total Courses</div>
                    <div className="stat-sub neutral">Across all students</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrap" style={{ background: 'rgba(139,92,246,0.12)' }}>📈</div>
                    <div className="stat-value">
                      {totalStudents > 0
                        ? Math.round(studentData.reduce((a, s) => a + s.avgProgress, 0) / totalStudents)
                        : 0}%
                    </div>
                    <div className="stat-label">Avg. Progress</div>
                    <div className="stat-sub up">All students</div>
                  </div>
                </div>

                {/* per-student progress table */}
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div className="card-header">
                    <div className="card-title">All Students — Course Progress</div>
                    <span className="badge badge-indigo">{totalStudents} students</span>
                  </div>
                  {totalStudents === 0 ? (
                    <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No students found.</p>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Student</th>
                            {allCourses.map(c => <th key={c.name}>{c.emoji} {c.name.split(' ').slice(0, 2).join(' ')}</th>)}
                            <th>Avg %</th>
                            <th>Completed</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentData.map(s => (
                            <tr key={s._id}>
                              <td className="td-primary">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                                    {initials(s.name)}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--t4)' }}>{s.email}</div>
                                  </div>
                                </div>
                              </td>
                              {s.courses.map(c => (
                                <td key={c.name}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 80 }}>
                                    <div className="rp-course-prog-track" style={{ flex: 1 }}>
                                      <div className="rp-course-prog-fill" style={{ width: `${c.progress}%`, background: c.color }} />
                                    </div>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--t3)', minWidth: 28 }}>{c.progress}%</span>
                                  </div>
                                </td>
                              ))}
                              <td><strong style={{ color: 'var(--t1)' }}>{s.avgProgress}%</strong></td>
                              <td><span className="badge badge-green">{s.completed}/{allCourses.length}</span></td>
                              <td><span className={`badge ${s.isVerified ? 'badge-green' : 'badge-amber'}`}>{s.isVerified ? 'Verified' : 'Pending'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* leaderboard from real students */}
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Leaderboard — Top Students</div>
                    <span className="badge badge-violet">By Avg Progress</span>
                  </div>
                  {totalStudents === 0 ? (
                    <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No students yet.</p>
                  ) : (
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Rank</th>
                            <th>Student</th>
                            <th>Courses Completed</th>
                            <th>Avg Progress</th>
                            <th>Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ranked.map((s, i) => (
                            <tr key={s._id}>
                              <td style={{ fontSize: '1rem' }}>{rankEmojis[i] ?? i + 1}</td>
                              <td className="td-primary">{s.name}</td>
                              <td><span className="badge badge-indigo">{s.completed}/{allCourses.length}</span></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <div className="rp-course-prog-track" style={{ width: 80 }}>
                                    <div className="rp-course-prog-fill" style={{ width: `${s.avgProgress}%`, background: 'var(--primary)' }} />
                                  </div>
                                  <strong style={{ color: 'var(--t1)' }}>{s.avgProgress}%</strong>
                                </div>
                              </td>
                              <td style={{ fontSize: '0.78rem' }}>{fmt(s.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          })()}

          {/* ── ADMIN TAB ── */}
          {tab === 'admin' && (
            <div className="card">
              <div className="card-header">
                <span className="badge badge-violet">{user?.role}</span>
              </div>
              {adminUsers.length === 0 ? (
                <p style={{ color: 'var(--t4)', fontSize: '0.84rem' }}>No users found.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        {user?.role === 'super_admin' && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {adminUsers.map(u => (
                        <tr key={u._id}>
                          <td className="td-primary">{u.name}</td>
                          <td style={{ fontSize: '0.8rem' }}>{u.email}</td>
                          <td>
                            {user?.role === 'super_admin' ? (
                              <select
                                value={u.role}
                                disabled={roleUpdating === u._id}
                                onChange={e => updateRole(u._id, e.target.value)}
                                style={{
                                  background: 'var(--bg3)', border: '1px solid var(--border2)',
                                  color: 'var(--t2)', borderRadius: 6, padding: '3px 6px',
                                  fontSize: '0.78rem', cursor: 'pointer',
                                }}
                              >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="super_admin">super_admin</option>
                              </select>
                            ) : (
                              <span className={`badge ${
                                u.role === 'super_admin' ? 'badge-violet' :
                                u.role === 'admin' ? 'badge-blue' : 'badge-indigo'
                              }`}>{u.role}</span>
                            )}
                          </td>
                          <td>
                            <span className={`badge ${u.isVerified ? 'badge-green' : 'badge-amber'}`}>
                              {u.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td>{fmt(u.createdAt)}</td>
                          {user?.role === 'super_admin' && (
                            <td>
                              <button
                                onClick={() => deleteUser(u._id)}
                                disabled={deletingId === u._id}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  background: 'var(--red-bg)', border: '1px solid var(--red-border)',
                                  color: '#fca5a5', borderRadius: 7, padding: '4px 10px',
                                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                                  opacity: deletingId === u._id ? 0.5 : 1,
                                }}
                              >
                                <TrashIcon /> {deletingId === u._id ? '...' : 'Delete'}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
