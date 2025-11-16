import client from './client.js';

// 🏏 Batting analytics
export const getTopBatters = () => client.get('/stats/batting/alltime');
export const getYearlyStats = (playerId) => client.get(`/stats/batting/yearly/${playerId}`);
export const getCareerStats = (playerId) => client.get(`/stats/player/${playerId}/career`);
export const getPlayerForm = (playerId, n = 5) =>
  client.get(`/stats/player/${playerId}/form/${n}`);

// 🎯 Bowling analytics
export const getTopBowlers = () => client.get('/stats/bowling/top');

// 📅 Matches Played by Month (for Dashboard chart)
export const getMatchesByMonth = () => client.get('/stats/matches-by-month');
