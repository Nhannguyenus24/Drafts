import { mockCourses } from '../data/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock axios-like API service
export const courseService = {
  // GET all courses
  getAllCourses: async () => {
    await delay(500);
    return {
      data: mockCourses,
      status: 200,
      statusText: 'OK'
    };
  },

  // GET course by ID
  getCourseById: async (id) => {
    await delay(300);
    const course = mockCourses.find(c => c.id === parseInt(id));
    if (!course) {
      throw {
        response: {
          status: 404,
          data: { message: 'Course not found' }
        }
      };
    }
    return {
      data: course,
      status: 200,
      statusText: 'OK'
    };
  },

  // POST create new course
  createCourse: async (courseData) => {
    await delay(800);
    const newCourse = {
      id: mockCourses.length + 1,
      ...courseData,
      rating: parseFloat(courseData.rating),
      totalReviews: parseInt(courseData.totalReviews),
      totalHours: parseFloat(courseData.totalHours),
      totalLectures: parseInt(courseData.totalLectures),
      currentPrice: parseInt(courseData.currentPrice),
      originalPrice: parseInt(courseData.originalPrice)
    };
    mockCourses.push(newCourse);
    return {
      data: newCourse,
      status: 201,
      statusText: 'Created'
    };
  },

  // PUT update course
  updateCourse: async (id, courseData) => {
    await delay(800);
    const index = mockCourses.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Course not found' }
        }
      };
    }
    const updatedCourse = {
      ...mockCourses[index],
      ...courseData,
      id: parseInt(id),
      rating: parseFloat(courseData.rating),
      totalReviews: parseInt(courseData.totalReviews),
      totalHours: parseFloat(courseData.totalHours),
      totalLectures: parseInt(courseData.totalLectures),
      currentPrice: parseInt(courseData.currentPrice),
      originalPrice: parseInt(courseData.originalPrice)
    };
    mockCourses[index] = updatedCourse;
    return {
      data: updatedCourse,
      status: 200,
      statusText: 'OK'
    };
  },

  // DELETE course
  deleteCourse: async (id) => {
    await delay(500);
    const index = mockCourses.findIndex(c => c.id === parseInt(id));
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: { message: 'Course not found' }
        }
      };
    }
    mockCourses.splice(index, 1);
    return {
      data: { message: 'Course deleted successfully' },
      status: 200,
      statusText: 'OK'
    };
  }
};
