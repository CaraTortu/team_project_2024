import DoctorSidebar from '../../components/DoctorSidebar/DoctorSidebar';

const DoctorMyInfoPage = () => {
  // Mocked doctor's info for display
  const doctorInfo = {
    fullName: 'Mykhailo Shpyl',
    email: 'L00179131@atu.ie',
    employeeNumber: '0453',
    gender: 'Add gender',
    additionalName: 'Add additional name',
    dob: 'Add birthday', // Should be formatted as a date
    mailingAddress: 'undefined',
    phone: 'Add phone number',
    fax: 'Add business fax number',
    department: 'Add department',
    language: 'System Default (English)',
    privacySettings: 'Only doctors can view my profile information',
    notificationSettings: {
      stream: 'Stream notifications',
      email: 'Email notifications',
      push: 'Push notifications',
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 p-10 pl-64">
        <div className="container mx-auto bg-white shadow rounded">
          <div className="p-6">
            {/* Doctor's Basic Information */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.fullName}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.email}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Employee Number</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.employeeNumber}</div>
              </div>
              <div className="mb-4">
                <button className="text-blue-600 hover:text-blue-700">Change password</button>
              </div>
            </section>

            {/* Additional Information */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h2>
              <section className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.gender}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Additional name</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.additionalName}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Date of birth</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.dob}</div>
              </div>
            </section>
            </section>

            {/* Contact Information */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <section className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mailing address</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.mailingAddress}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone number</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.phone}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fax</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.fax}</div>
              </div>
            </section>
            </section>

            {/* Job Information */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Information</h2>
              <section className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.department}</div>
              </div>
            </section>
            </section>

            {/* System Settings */}
            <section className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Settings</h2>
              <section className="mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.language}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Privacy settings</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.privacySettings}</div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Notification settings</label>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.notificationSettings.stream}</div>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.notificationSettings.email}</div>
                <div className="mt-1 p-2 bg-gray-100 rounded">{doctorInfo.notificationSettings.push}</div>
              </div>
              
            </section>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorMyInfoPage;
