import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { courseValidationRules, validatePriceComparison } from '../utils/courseValidation';
import { instructors } from '../data/mockData';

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue
  } = useForm({
    mode: 'onBlur'
  });

  const currentPrice = watch('currentPrice');
  const originalPrice = watch('originalPrice');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourseById(id);
        const course = response.data;
        
        // Set default values
        reset({
          title: course.title,
          description: course.description,
          imageUrl: course.imageUrl,
          instructorId: course.instructorId,
          rating: course.rating.toString(),
          totalReviews: course.totalReviews.toString(),
          totalHours: course.totalHours.toString(),
          totalLectures: course.totalLectures.toString(),
          level: course.level,
          currentPrice: course.currentPrice.toString(),
          originalPrice: course.originalPrice.toString(),
          isBestseller: course.isBestseller
        });
        
        setLoadError('');
      } catch (error) {
        setLoadError(error.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setSubmitError('');
    
    // Validate price comparison
    const priceValidation = validatePriceComparison(data.currentPrice, data.originalPrice);
    if (priceValidation !== true) {
      setSubmitError(priceValidation);
      return;
    }

    setIsSubmitting(true);

    try {
      // Find instructor name
      const instructor = instructors.find(i => i.id === data.instructorId);
      const courseData = {
        ...data,
        instructor: instructor?.name || '',
        isBestseller: data.isBestseller || false
      };

      await courseService.updateCourse(id, courseData);
      navigate('/courses');
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Loading course...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <p className="text-red-700 text-lg mb-4">{loadError}</p>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <i className="fas fa-edit text-blue-600 mr-2"></i>
            Edit Course
          </h1>
          <p className="text-gray-600">Update the information below to edit the course</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8">
          {/* Submit Error */}
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          {/* Course Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('title', courseValidationRules.title)}
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Complete Python Programming Masterclass 2025"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('description', courseValidationRules.description)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe what students will learn in this course..."
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Minimum 50 characters</p>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              {...register('imageUrl', courseValidationRules.imageUrl)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/course-image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Enter a valid image URL</p>
          </div>

          {/* Instructor */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Instructor <span className="text-red-500">*</span>
            </label>
            <select
              {...register('instructorId', courseValidationRules.instructorId)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Instructor --</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
            {errors.instructorId && (
              <p className="text-red-500 text-sm mt-1">{errors.instructorId.message}</p>
            )}
          </div>

          {/* Two Columns: Rating & Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Rating */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Rating <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('rating', courseValidationRules.rating)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="4.5"
              />
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">From 0.0 to 5.0</p>
            </div>

            {/* Total Reviews */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Total Reviews <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('totalReviews', courseValidationRules.totalReviews)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="150"
              />
              {errors.totalReviews && (
                <p className="text-red-500 text-sm mt-1">{errors.totalReviews.message}</p>
              )}
            </div>
          </div>

          {/* Two Columns: Hours & Lectures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Total Hours */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Total Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('totalHours', courseValidationRules.totalHours)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="10.5"
              />
              {errors.totalHours && (
                <p className="text-red-500 text-sm mt-1">{errors.totalHours.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Course duration in hours</p>
            </div>

            {/* Total Lectures */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Total Lectures <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('totalLectures', courseValidationRules.totalLectures)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="45"
              />
              {errors.totalLectures && (
                <p className="text-red-500 text-sm mt-1">{errors.totalLectures.message}</p>
              )}
            </div>
          </div>

          {/* Course Level */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Course Level <span className="text-red-500">*</span>
            </label>
            <select
              {...register('level', courseValidationRules.level)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Level --</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="All Levels">All Levels</option>
            </select>
            {errors.level && (
              <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
            )}
          </div>

          {/* Two Columns: Current Price & Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current Price (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                <input
                  type="text"
                  {...register('currentPrice', courseValidationRules.currentPrice)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="279000"
                />
              </div>
              {errors.currentPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPrice.message}</p>
              )}
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Original Price (VND) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                <input
                  type="text"
                  {...register('originalPrice', courseValidationRules.originalPrice)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="399000"
                />
              </div>
              {errors.originalPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.originalPrice.message}</p>
              )}
            </div>
          </div>

          {/* Bestseller Checkbox */}
          <div className="mb-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isBestseller')}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700 font-semibold">
                <i className="fas fa-crown text-yellow-500 mr-1"></i>
                Mark as Bestseller
              </span>
            </label>
          </div>

          {/* Divider */}
          <hr className="my-8 border-gray-200" />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/courses"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Update Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
