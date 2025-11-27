import { GraduationCap, Settings, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import OpenGraph from "../components/seo/OpenGraph";
import SEO from "../components/seo/SEO";
import StructuredData from "../components/seo/StructuredData";
import TwitterCard from "../components/seo/TwitterCard";
import { ROUTES } from "../constants/routes";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* SEO Meta Tags */}
      <SEO
        title="Home"
        description="Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities all in one platform."
        keywords="school management system, LMS, learning management, education software, student management, teacher management, attendance system, exam management"
        canonical="/"
      />

      <OpenGraph
        title="Edu-Pro - School Management System"
        description="Comprehensive Learning Management System for schools. Manage students, teachers, courses, attendance, exams, library, and sports activities."
        image="/images/og-home.jpg"
        url="/"
        type="website"
      />

      <TwitterCard
        card="summary_large_image"
        title="Edu-Pro - School Management System"
        description="Comprehensive Learning Management System for schools"
        image="/images/twitter-home.jpg"
      />

      <StructuredData
        type="website"
        data={{
          name: "Edu-Pro LMS",
          url: "https://edupro.com",
        }}
      />

      <StructuredData
        type="organization"
        data={{
          name: "Edu-Pro",
          description: "Leading School Management System provider",
          socialProfiles: [
            "https://twitter.com/edupro",
            "https://facebook.com/edupro",
            "https://linkedin.com/company/edupro",
          ],
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                School Management System
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Login
              </Link>
              <Link
                to={ROUTES.ADMIN_LOGIN}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin Login
              </Link>
              <Link
                to={ROUTES.ADMIN_REGISTER}
                className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Register School
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Welcome to</span>{" "}
                  <span className="block text-blue-600 xl:inline">
                    School Management
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  A comprehensive platform for managing students, courses,
                  sports, library, attendance, and academic results. Choose your
                  role to get started.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to={ROUTES.LOGIN}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Student Portal
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to={ROUTES.ADMIN_LOGIN}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                    >
                      Admin Portal
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage your school
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comprehensive tools for students, teachers, and administrators to
              manage all aspects of school operations.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Student Features */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Student Portal
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Access course materials, view attendance, check library books,
                  track sports activities, and monitor academic results.
                </p>
              </div>

              {/* Admin Features */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Admin Dashboard
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Manage students, courses, sports teams, library inventory,
                  attendance records, and academic results.
                </p>
              </div>

              {/* Course Management */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  Course Management
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Enroll in courses, track progress, view assignments, and
                  monitor academic performance.
                </p>
              </div>

              {/* System Management */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Settings className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                  System Management
                </p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Comprehensive administrative tools for managing all aspects of
                  the school system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Choose your portal today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Join thousands of students and administrators who trust our platform
            for their educational needs.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                to={ROUTES.LOGIN}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Student Login
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                to={ROUTES.ADMIN_LOGIN}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; 2024 School Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
