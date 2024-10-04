import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';

const AchievementsPanel = ({ user }) => (
  <Card className="bg-purple-800 text-white">
    <CardHeader>
      <CardTitle>Your Achievements</CardTitle>
    </CardHeader>
    <CardContent>
      {user && user.badges && user.badges.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="text-center">
              <Award className="mx-auto mb-2" />
              <p>{badge.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No achievements yet. Keep learning to earn badges!</p>
      )}
    </CardContent>
  </Card>
);

export default AchievementsPanel;