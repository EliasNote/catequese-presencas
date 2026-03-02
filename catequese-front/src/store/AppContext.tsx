import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'ADMIN' | 'CATECHIST';

export interface Community {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  login: string;
  senha?: string;
  role: Role;
  communityId?: string;
}

export interface Student {
  id: string;
  name: string;
  catechistId: string;
}

export interface Meeting {
  id: string;
  catechistId: string;
  date: string; // ISO string
  theme: string;
  observations?: string;
  status: 'PENDING' | 'COMPLETED';
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'JUSTIFIED';

export interface AttendanceRecord {
  id: string;
  meetingId: string;
  studentId: string;
  status: AttendanceStatus;
  justification?: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  students: Student[];
  meetings: Meeting[];
  attendances: AttendanceRecord[];
  communities: Community[];
  isLoading: boolean;
  login: (login: string, password?: string) => Promise<void>;
  logout: () => void;
  fetchData: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addMeeting: (meeting: Omit<Meeting, 'id' | 'status'>) => Promise<string>;
  updateMeeting: (id: string, meeting: Partial<Meeting>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  saveAttendance: (meetingId: string, records: { studentId: string; status: AttendanceStatus; justification?: string }[]) => Promise<void>;
  addCommunity: (community: Omit<Community, 'id'>) => Promise<void>;
  updateCommunity: (id: string, community: Partial<Community>) => Promise<void>;
  deleteCommunity: (id: string) => Promise<void>;
}

import { authService } from '../services/authService';
import { comunidadesService } from '../services/comunidadesService';
import { catequistasService } from '../services/catequistasService';
import { catequizandosService } from '../services/catequizandosService';
import { encontrosService } from '../services/encontrosService';
import { presencasService } from '../services/presencasService';

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [usersData, studentsData, meetingsData, attendancesData, communitiesData] = await Promise.all([
        catequistasService.getAll(),
        catequizandosService.getAll(),
        encontrosService.getAll(),
        presencasService.getAll(),
        comunidadesService.getAll()
      ]);
      setUsers(usersData);
      setStudents(studentsData);
      setAttendances(attendancesData);
      setCommunities(communitiesData);

      // Derive meeting status from attendances to ensure it persists correctly
      // The API might not return populated presences in the meetings endpoint
      const meetingsWithStatus = meetingsData.map(m => {
        const hasAttendance = attendancesData.some(a => a.meetingId === m.id);
        return { ...m, status: hasAttendance ? 'COMPLETED' : 'PENDING' };
      });
      setMeetings(meetingsWithStatus);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const login = async (loginStr: string, senha?: string) => {
    try {
      const response = await authService.login(loginStr, senha || '');
      localStorage.setItem('token', response.token);
      
      const role = response.role === 'admin' ? 'ADMIN' : 'CATECHIST';
      const catequista = response.catequista || {};
      
      const user: User = {
        id: catequista.id ? String(catequista.id) : 'admin',
        name: catequista.nome || 'Administrador',
        login: loginStr,
        role: role,
        communityId: catequista.comunidade?.id ? String(catequista.comunidade.id) : undefined
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setUsers([]);
    setStudents([]);
    setMeetings([]);
    setAttendances([]);
    setCommunities([]);
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    const newUser = await catequistasService.create(user);
    setUsers([...users, newUser]);
  };

  const updateUser = async (id: string, updatedUser: Partial<User>) => {
    const currentUser = users.find(u => u.id === id);
    const mergedUser = currentUser ? { ...currentUser, ...updatedUser } : updatedUser;
    const updated = await catequistasService.update(id, mergedUser);
    setUsers(users.map(u => u.id === id ? updated : u));
  };

  const deleteUser = async (id: string) => {
    await catequistasService.delete(id);
    setUsers(users.filter(u => u.id !== id));
    setStudents(students.filter(s => s.catechistId !== id));
    setMeetings(meetings.filter(m => m.catechistId !== id));
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    const newStudent = await catequizandosService.create(student);
    setStudents([...students, newStudent]);
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    const currentStudent = students.find(s => s.id === id);
    const mergedStudent = currentStudent ? { ...currentStudent, ...updatedStudent } : updatedStudent;
    const updated = await catequizandosService.update(id, mergedStudent);
    setStudents(students.map(s => s.id === id ? updated : s));
  };

  const deleteStudent = async (id: string) => {
    await catequizandosService.delete(id);
    setStudents(students.filter(s => s.id !== id));
    setAttendances(attendances.filter(a => a.studentId !== id));
  };

  const addMeeting = async (meeting: Omit<Meeting, 'id' | 'status'>) => {
    const newMeeting = await encontrosService.create({ ...meeting, status: 'PENDING' });
    setMeetings([...meetings, newMeeting]);
    return newMeeting.id;
  };

  const updateMeeting = async (id: string, updatedMeeting: Partial<Meeting>) => {
    const currentMeeting = meetings.find(m => m.id === id);
    const mergedMeeting = currentMeeting ? { ...currentMeeting, ...updatedMeeting } : updatedMeeting;
    const updated = await encontrosService.update(id, mergedMeeting);
    setMeetings(meetings.map(m => m.id === id ? updated : m));
  };

  const deleteMeeting = async (id: string) => {
    // Delete associated attendances first (cascade delete)
    const meetingAttendances = attendances.filter(a => a.meetingId === id);
    await Promise.all(meetingAttendances.map(a => presencasService.delete(a.id)));

    // Then delete the meeting
    await encontrosService.delete(id);
    setMeetings(meetings.filter(m => m.id !== id));
    setAttendances(attendances.filter(a => a.meetingId !== id));
  };

  const saveAttendance = async (meetingId: string, records: { studentId: string; status: AttendanceStatus; justification?: string }[]) => {
    // Get existing attendances for this meeting to determine if we should create or update
    // We need to fetch fresh data to be sure
    const allAttendances = await presencasService.getAll();
    const existingAttendances = allAttendances.filter(a => a.meetingId === meetingId);
    
    await Promise.all(records.map(async (r) => {
      const existing = existingAttendances.find(ea => ea.studentId === r.studentId);
      
      if (existing) {
        // Update existing record
        return presencasService.update(existing.id, { 
          status: r.status, 
          justification: r.justification 
        });
      } else {
        // Create new record
        return presencasService.create({ 
          meetingId, 
          studentId: r.studentId, 
          status: r.status, 
          justification: r.justification 
        });
      }
    }));
    
    // Refresh all data to ensure consistency, especially meeting status derived from presences
    await fetchData();
  };

  const addCommunity = async (community: Omit<Community, 'id'>) => {
    const newCommunity = await comunidadesService.create(community);
    setCommunities([...communities, newCommunity]);
  };

  const updateCommunity = async (id: string, updatedCommunity: Partial<Community>) => {
    const currentCommunity = communities.find(c => c.id === id);
    const mergedCommunity = currentCommunity ? { ...currentCommunity, ...updatedCommunity } : updatedCommunity;
    const updated = await comunidadesService.update(id, mergedCommunity);
    setCommunities(communities.map(c => c.id === id ? updated : c));
  };

  const deleteCommunity = async (id: string) => {
    await comunidadesService.delete(id);
    setCommunities(communities.filter(c => c.id !== id));
    setUsers(users.map(u => u.communityId === id ? { ...u, communityId: undefined } : u));
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, students, meetings, attendances, communities, isLoading,
      login, logout, fetchData, addUser, updateUser, deleteUser,
      addStudent, updateStudent, deleteStudent,
      addMeeting, updateMeeting, deleteMeeting, saveAttendance,
      addCommunity, updateCommunity, deleteCommunity
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
