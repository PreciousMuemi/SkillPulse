import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import Header from './Header';

function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const leaderboardData = await getLeaderboard();
      setLeaderboard(leaderboardData);
    }
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <Header />
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Level</th>
            <th>Tokens</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.level}</td>
              <td>{user.tokens}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoard;