import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/courseService';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses();
        setCourses(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-700 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Create Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <i className="fas fa-graduation-cap text-blue-600 mr-2"></i>
              All Courses
            </h1>
            <p className="text-gray-600">Browse and explore our collection of courses</p>
          </div>
          <Link
            to="/courses/create"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <i className="fas fa-plus-circle"></i>
            <span>Create New Course</span>
          </Link>
        </div>

        {/* Course Cards */}
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-6 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Course Image */}
              <div className="md:w-1/3 relative">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Course Info */}
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <p className="text-sm text-gray-700 mb-2">{course.instructor}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-600 font-bold">{course.rating}</span>
                    <div className="flex text-orange-500">
                      {renderStars(course.rating)}
                    </div>
                    <span className="text-gray-600 text-sm">({course.totalReviews})</span>
                  </div>

                  {/* Course Details */}
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-3">
                    <span>{course.totalHours} total {course.totalHours === 1 ? 'hour' : 'hours'}</span>
                    <span>•</span>
                    <span>{course.totalLectures} lectures</span>
                    <span>•</span>
                    <span>{course.level}</span>
                  </div>

                  {/* Bestseller Badge */}
                  {course.isBestseller && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₫{course.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₫{course.originalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link
                    to={`/courses/edit/${course.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-10 text-sm">
          <span className="text-gray-600">Showing 1-{courses.length} of {courses.length} courses</span>
          <div className="inline-flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <button className="px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              <i className="fas fa-chevron-left mr-2 text-xs"></i>
              Previous
            </button>

            <div className="flex divide-x divide-gray-200 text-gray-700">
              <button className="px-4 py-2 font-semibold bg-blue-50 text-blue-600">1</button>
              <button className="px-4 py-2 hover:bg-gray-50 transition-colors">2</button>
              <button className="px-4 py-2 hover:bg-gray-50 transition-colors">3</button>
              <span className="px-4 py-2 text-gray-400">...</span>
              <button className="px-4 py-2 hover:bg-gray-50 transition-colors">6</button>
            </div>

            <button className="px-4 py-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              Next
              <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default CourseList;
