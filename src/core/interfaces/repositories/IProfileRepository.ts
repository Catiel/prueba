import { ProfileEntity } from '../../entities/Profile.entity';
import { UserRole } from '../../types/roles.types';

export interface IProfileRepository {
  getProfileByUserId(userId: string): Promise<ProfileEntity | null>;
  updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<ProfileEntity>;
  promoteToTeacher(userId: string): Promise<void>; // NUEVO
  demoteToStudent(userId: string): Promise<void>; // NUEVO
  updateRole(userId: string, role: UserRole): Promise<ProfileEntity>; // NUEVO
  getAllTeachers(): Promise<ProfileEntity[]>; // NUEVO
  getAllStudents(): Promise<ProfileEntity[]>; // NUEVO
}