import ErrorMonitor from '@/components/ErrorMonitor';

export function TestingDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Testing Dashboard</h1>
          <p className="text-gray-600">Monitor errors, system health, and performance across the application</p>
        </div>
        
        <div className="grid gap-6">
          <ErrorMonitor />
          
          {/* Test Trigger Buttons */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Error Testing Tools</h2>
            <div className="flex flex-wrap gap-4">
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  throw new Error('Test JavaScript Error');
                }}
              >
                Trigger JS Error
              </button>
              
              <button 
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                onClick={() => {
                  fetch('/nonexistent-api-endpoint')
                    .catch(err => console.error('Network error:', err));
                }}
              >
                Trigger Network Error
              </button>
              
              <button 
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  console.warn('Test warning message');
                }}
              >
                Trigger Warning
              </button>
              
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  localStorage.removeItem('test-storage');
                  localStorage.setItem('test-storage', 'test-value');
                }}
              >
                Test LocalStorage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}