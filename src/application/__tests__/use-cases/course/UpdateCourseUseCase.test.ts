import { UpdateCourseUseCase } from '@/src/application/use-cases/course/UpdateCourseUseCase';
import { ICourseRepository } from '@/src/core/interfaces/repositories/ICourseRepository';
import { IAuthRepository } from '@/src/core/interfaces/repositories/IAuthRepository';
import { IProfileRepository } from '@/src/core/interfaces/repositories/IProfileRepository';
import { CourseEntity } from '@/src/core/entities/Course.entity';
import { UserEntity } from '@/src/core/entities/User.entity';
import { ProfileEntity } from '@/src/core/entities/Profile.entity';
import { UpdateCourseInput } from '@/src/core/types/course.types';

describe('UpdateCourseUseCase', () => {
  let mockCourseRepository: jest.Mocked<ICourseRepository>;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;
  let mockProfileRepository: jest.Mocked<IProfileRepository>;
  let updateCourseUseCase: UpdateCourseUseCase;

  beforeEach(() => {
    mockCourseRepository = {
      createCourse: jest.fn(),
      getAllCourses: jest.fn(),
      getCourseById: jest.fn(),
      updateCourse: jest.fn(),
      deleteCourse: jest.fn(),
      assignTeacherToCourse: jest.fn(),
      removeTeacherFromCourse: jest.fn(),
      getCourseWithTeachers: jest.fn(),
      getTeacherCourses: jest.fn(),
    } as jest.Mocked<ICourseRepository>;

    mockAuthRepository = {
      login: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      resetPassword: jest.fn(),
      updatePassword: jest.fn(),
    } as jest.Mocked<IAuthRepository>;

    mockProfileRepository = {
      getProfileByUserId: jest.fn(),
      getAllStudents: jest.fn(),
      getAllTeachers: jest.fn(),
      updateUserRole: jest.fn(),
      createProfile: jest.fn(),
      deleteProfile: jest.fn(),
    } as jest.Mocked<IProfileRepository>;

    updateCourseUseCase = new UpdateCourseUseCase(
      mockCourseRepository,
      mockAuthRepository,
      mockProfileRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    const courseId = 'course-123';
    const validInput: UpdateCourseInput = {
      title: 'Updated Course',
      description: 'Updated Description',
      start_date: '2025-01-01',
      end_date: '2025-12-31',
      is_active: true,
    };

    const mockUser = new UserEntity('user-123', 'admin@example.com', 'Admin User');
    const mockAdminProfile = new ProfileEntity(
      'profile-123',
      'user-123',
      'Admin',
      'User',
      'admin',
      new Date(),
      new Date()
    );

    it('should update course successfully when user is admin', async () => {
      const mockUpdatedCourse = new CourseEntity(
        courseId,
        'Updated Course',
        'Updated Description',
        new Date('2025-01-01'),
        new Date('2025-12-31'),
        true,
        new Date(),
        new Date()
      );

      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
      mockProfileRepository.getProfileByUserId.mockResolvedValue(mockAdminProfile);
      mockCourseRepository.updateCourse.mockResolvedValue(mockUpdatedCourse);

      const result = await updateCourseUseCase.execute(courseId, validInput);

      expect(result.success).toBe(true);
      expect(result.course).toEqual(mockUpdatedCourse);
      expect(result.error).toBeUndefined();
      expect(mockCourseRepository.updateCourse).toHaveBeenCalledWith(courseId, validInput);
      expect(mockCourseRepository.updateCourse).toHaveBeenCalledTimes(1);
    });

    it('should return error when no user is authenticated', async () => {
      mockAuthRepository.getCurrentUser.mockResolvedValue(null);

      const result = await updateCourseUseCase.execute(courseId, validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No hay usuario autenticado');
      expect(result.course).toBeUndefined();
      expect(mockCourseRepository.updateCourse).not.toHaveBeenCalled();
    });

    it('should return error when user is student', async () => {
      const studentProfile = new ProfileEntity(
        'profile-123',
        'user-123',
        'Student',
        'User',
        'student',
        new Date(),
        new Date()
      );

      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
      mockProfileRepository.getProfileByUserId.mockResolvedValue(studentProfile);

      const result = await updateCourseUseCase.execute(courseId, validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('No tienes permisos para editar cursos');
      expect(result.course).toBeUndefined();
      expect(mockCourseRepository.updateCourse).not.toHaveBeenCalled();
    });

    it('should return error when end date is before start date', async () => {
      const invalidInput: UpdateCourseInput = {
        ...validInput,
        start_date: '2025-12-31',
        end_date: '2025-01-01',
      };

      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
      mockProfileRepository.getProfileByUserId.mockResolvedValue(mockAdminProfile);

      const result = await updateCourseUseCase.execute(courseId, invalidInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('La fecha de fin debe ser posterior a la fecha de inicio');
      expect(mockCourseRepository.updateCourse).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
      mockProfileRepository.getProfileByUserId.mockResolvedValue(mockAdminProfile);
      mockCourseRepository.updateCourse.mockRejectedValue(
        new Error('Course not found')
      );

      const result = await updateCourseUseCase.execute(courseId, validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Course not found');
      expect(result.course).toBeUndefined();
    });

    it('should handle unknown errors', async () => {
      mockAuthRepository.getCurrentUser.mockResolvedValue(mockUser);
      mockProfileRepository.getProfileByUserId.mockResolvedValue(mockAdminProfile);
      mockCourseRepository.updateCourse.mockRejectedValue('Unknown error');

      const result = await updateCourseUseCase.execute(courseId, validInput);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Error al actualizar curso');
    });
  });
});

