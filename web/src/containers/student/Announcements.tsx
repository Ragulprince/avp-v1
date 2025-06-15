
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const Announcements = () => {
  const announcements = [
    'New Physics lecture uploaded: Quantum Mechanics',
    'Mock test scheduled for tomorrow at 10 AM',
    'Study materials updated for Chemistry'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Bell className="w-5 h-5 mr-2" />
          Announcements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p className="text-sm text-gray-700">{announcement}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Announcements;
