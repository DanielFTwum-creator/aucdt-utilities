import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { AVATAR_PLACEHOLDER_URL, ONBOARDING_QUESTIONS, USER_ROLES } from '../constants';
import { User, OnboardingData, BadgeLevel, SelectOption, UserRole } from '../types'; // Fix: Import UserRole
import * as authService from '../services/authService';
import BadgeIcon from '../components/BadgeIcon';
import { Camera } from 'lucide-react';

// Fix: Define a clearer type for profileData state to distinguish system role from onboarding role
type ProfilePageData = Partial<{
  fullName: string;
  email: string;
  systemRole: UserRole; // User's system role (learner, educator, admin)
  onboardingUserRole: string; // User's self-declared role from onboarding (Student, Professional, etc.)
  experienceLevel: string;
  primaryGoal: string;
  availableHours: string;
  learningStyle: string;
}>;

const ProfilePage: React.FC = () => {
  const { user, setUser, isLoading: isAuthLoading } = useAuth();
  const { userProgress, isLoadingProgress } = useProgress();
  const [editing, setEditing] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  // Fix: Use the new ProfilePageData type
  const [profileData, setProfileData] = useState<ProfilePageData>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      // Fix: Populate profileData with distinct keys for system and onboarding roles
      setProfileData({
        fullName: user.fullName,
        email: user.email,
        systemRole: user.role, // Populate systemRole from user.role
        onboardingUserRole: user.onboardingData?.onboardingUserRole, // Populate onboardingUserRole from onboardingData
        experienceLevel: user.onboardingData?.experienceLevel,
        primaryGoal: user.onboardingData?.primaryGoal,
        availableHours: user.onboardingData?.availableHours,
        learningStyle: user.onboardingData?.learningStyle,
      });
    }
  }, [user]); // Fix: Added user to dependency array for useEffect

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoadingSave(true);
    try {
      let updatedAvatarUrl = user.avatarUrl;
      if (avatarFile) {
        // Simulate avatar upload (e.g., to S3, returns a URL)
        // For now, convert to base64 for immediate preview
        updatedAvatarUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      // Fix: Assign systemRole directly, ensuring it's a valid UserRole
      const newSystemRole: UserRole = (profileData.systemRole && USER_ROLES.includes(profileData.systemRole))
        ? profileData.systemRole
        : user.role;

      const updatedUser: User = {
        ...user,
        fullName: profileData.fullName || user.fullName,
        email: profileData.email || user.email,
        role: newSystemRole, // Use the validated system role
        avatarUrl: updatedAvatarUrl,
        onboardingData: {
          // Fix: Assign onboarding data fields specifically, defaulting to empty string if undefined
          onboardingUserRole: profileData.onboardingUserRole || '',
          experienceLevel: profileData.experienceLevel || '',
          primaryGoal: profileData.primaryGoal || '',
          availableHours: profileData.availableHours || '',
          learningStyle: profileData.learningStyle || '',
        },
      };

      await authService.updateUser(updatedUser); // Update mock user in localStorage
      setUser(updatedUser); // Update user in AuthContext
      setEditing(false);
      setAvatarFile(null); // Clear selected avatar file
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoadingSave(false);
    }
  };

  const allBadges: { moduleId: string; badge: BadgeLevel }[] = userProgress.map(p => ({
    moduleId: p.moduleNumber,
    badge: p.badgeLevel,
  })).filter(b => b.badge !== 'none');

  if (isAuthLoading || isLoadingProgress || !user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-6">User Profile</h1>

        <Card className="p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-x-8 md:space-y-0">
            <div className="relative group">
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatarUrl || AVATAR_PLACEHOLDER_URL}
                alt={user.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
              />
              {editing && (
                <label htmlFor="avatar-upload" className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={30} className="text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <span className="sr-only">Upload new avatar</span>
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">{user.fullName}</h2>
              <p className="text-lg text-subtle-text-light dark:text-subtle-text-dark">{user.email}</p>
              <p className="text-md text-gray-500 dark:text-gray-400 capitalize mt-1">Role: {user.role}</p>
              <div className="mt-4">
                <Button onClick={() => setEditing(!editing)} variant={editing ? 'secondary' : 'primary'}>
                  {editing ? 'Cancel Edit' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </div>

          {/* Profile Details Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-6">
            <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark">Personal Information</h3>
            <Input
              label="Full Name"
              id="fullName"
              value={profileData.fullName}
              onChange={handleInputChange}
              disabled={!editing}
            />
            <Input
              label="Email Address"
              id="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              disabled={!editing}
            />
            {user.role === 'admin' && ( // Allow admin to change system role in this mock
                <Select
                    label="System Role" // Fix: Clarified label for system role
                    id="systemRole" // Fix: Changed ID to match state key
                    options={USER_ROLES.map(role => ({value: role, label: role.charAt(0).toUpperCase() + role.slice(1)}))}
                    value={profileData.systemRole}
                    onChange={handleInputChange}
                    disabled={!editing}
                />
            )}

            <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark mt-8">Onboarding Preferences</h3>
            {ONBOARDING_QUESTIONS.map(q => {
              // Fix: Use `keyof ProfilePageData` to dynamically access the correct field from profileData
              const valueKey: keyof ProfilePageData = q.id === 'onboardingUserRole' ? 'onboardingUserRole' : q.id as keyof OnboardingData;
              const options = q.options.map(opt => ({ value: opt, label: opt }));
              return (
                <Select
                  key={q.id}
                  label={q.question}
                  id={valueKey} // Fix: Use the correct ID derived from `valueKey`
                  options={options}
                  value={profileData[valueKey]}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              );
            })}
          </div>

          {editing && (
            <div className="flex justify-end mt-8">
              <Button onClick={handleSave} loading={loadingSave} disabled={loadingSave}>
                {loadingSave ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {/* Badges Display */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-6">
            <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark">Your Badges</h3>
            {allBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allBadges.map((item, index) => (
                  <Card key={index} className="flex flex-col items-center justify-center p-4">
                    <BadgeIcon level={item.badge} size={40} className="mb-2" />
                    <p className="text-md font-medium text-text-light dark:text-text-dark">Module {item.moduleId}</p>
                    <p className="text-sm text-subtle-text-light dark:text-subtle-text-dark capitalize">{item.badge} Badge</p>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-subtle-text-light dark:text-subtle-text-dark">No badges earned yet. Keep learning!</p>
            )}
          </div>

          {/* Completion Certificate (placeholder) */}
          {userProgress.filter(p => p.status === 'completed' && p.badgeLevel !== 'none').length === userProgress.length && userProgress.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8 space-y-4">
              <h3 className="text-2xl font-semibold text-text-light dark:text-text-dark">Completion Certificate</h3>
              <p className="text-subtle-text-light dark:text-subtle-text-dark">
                You've completed all modules and earned a certificate!
              </p>
              <Button variant="success">Download Certificate</Button>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;