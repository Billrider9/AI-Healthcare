"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import DashboardLayout from '../../../../components/DashboardLayout';
import {
  CheckIcon,
  ArrowRightIcon,
  UserCircleIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function AIDoctorSelectionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');

  const handleDoctorSelect = async (doctorType) => {
    setIsLoading(true);
    setSelectedDoctor(doctorType);
    setError('');

    try {
      const token = user?.token;
      if (!token) {
        setError('You need to be signed in to start a session. Please log in again.');
        setIsLoading(false);
        return;
      }
      const response = await fetch('/api/doctor/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorType,
          userId: user?.id || '',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('doctorToken', data.token);
        router.push(`/dashboard/patient/ai-doctor/${doctorType}`);
      } else {
        setError(data.message || 'Could not start AI Doctor session.');
      }
    } catch (error) {
      console.error('Error selecting doctor:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
    <div className="mx-auto max-w-5xl">
      <p className="mb-8 text-base text-gray-600">
        Choose a mode to continue. The bar above shows where you are in the app.
      </p>

      {error ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 md:grid-cols-2">
        {/* General AI Doctor */}
        <div 
          className={`cursor-pointer overflow-hidden rounded-xl border-2 bg-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg ${
            selectedDoctor === 'general' ? 'border-primary-500 ring-1 ring-primary-200' : 'border-transparent'
          }`}
          onClick={() => handleDoctorSelect('general')}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">General AI Doctor</h2>
                  <p className="text-primary-600">Quick Medical Guidance</p>
                </div>
              </div>
              {selectedDoctor === 'general' && (
                <CheckIcon className="h-6 w-6 text-primary-600" />
              )}
            </div>

            <div className="mt-6">
              <p className="text-gray-600 mb-4">
                Get general health information and guidance without sharing personal medical history.
                Ideal for quick questions and basic health inquiries.
              </p>

              <div className="space-y-3 mt-6">
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">No account or personal information required</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">Anonymous consultations</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">General health information</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">No conversation history stored</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-primary-600">
                  <LockClosedIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">Medical privacy maintained</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-blue-50">
            <button 
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-700"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleDoctorSelect('general');
              }}
            >
              {isLoading && selectedDoctor === 'general' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : null}
              Select General AI Doctor
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Personal AI Doctor */}
        <div 
          className={`cursor-pointer overflow-hidden rounded-xl border-2 bg-white shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg ${
            selectedDoctor === 'personal' ? 'border-primary-500 ring-1 ring-primary-200' : 'border-transparent'
          }`}
          onClick={() => handleDoctorSelect('personal')}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">Personal AI Doctor</h2>
                  <p className="text-primary-600">Personalized Health Assistant</p>
                </div>
              </div>
              {selectedDoctor === 'personal' && (
                <CheckIcon className="h-6 w-6 text-primary-600" />
              )}
            </div>

            <div className="mt-6">
              <p className="text-gray-600 mb-4">
                Get personalized healthcare advice based on your medical history and profile.
                Your personal AI doctor remembers your information for more tailored guidance.
              </p>

              <div className="space-y-3 mt-6">
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">Personalized health recommendations</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">Conversation history saved for context</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">Considers your medical history</p>
                </div>
                <div className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="ml-3 text-gray-600">Continuous care with follow-ups</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center text-primary-600">
                  <ShieldCheckIcon className="h-5 w-5 mr-2" />
                  <span className="font-medium">End-to-end encrypted health data</span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 bg-green-50">
            <button 
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-white transition hover:bg-green-700"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleDoctorSelect('personal');
              }}
            >
              {isLoading && selectedDoctor === 'personal' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              ) : null}
              Select Personal AI Doctor
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Important information</h2>
        <ul className="list-inside list-disc space-y-2 text-gray-600">
          <li>The AI Doctor provides information for educational purposes only and is not a replacement for professional medical advice.</li>
          <li>In case of a medical emergency, call emergency services immediately.</li>
          <li>Consult a qualified healthcare provider for diagnosis and treatment decisions.</li>
          <li>Personal AI Doctor may store conversation context to tailor responses.</li>
        </ul>
      </div>
    </div>
    </DashboardLayout>
  );
} 