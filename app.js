// app.js

// ---------- دوال إدارة LocalStorage ----------

function loadData(key, fallback = null) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ---------- إدارة التذاكر ----------
function getTickets() {
  return loadData('tickets', []);
}
function addTicket(ticket) {
  const tickets = getTickets();
  ticket.id = Date.now();
  ticket.createdAt = new Date().toISOString();
  ticket.updatedAt = ticket.createdAt;
  tickets.push(ticket);
  saveData('tickets', tickets);
  updateStats();
}
function updateTicket(id, updates) {
  let tickets = getTickets();
  tickets = tickets.map(t =>
    t.id == id ? {...t, ...updates, updatedAt: new Date().toISOString()} : t
  );
  saveData('tickets', tickets);
  updateStats();
}
function deleteTicket(id) {
  if (!confirm('هل أنت متأكد من حذف التذكرة؟')) return;
  const tickets = getTickets().filter(t => t.id != id);
  saveData('tickets', tickets);
  updateStats();
}

function getTicketById(id) {
  return getTickets().find(t => t.id == id);
}

// ---------- إدارة الفِرَق ----------
function getTeams() {
  return loadData('teams', []);
}
function addTeam(team) {
  const teams = getTeams();
  team.id = Date.now();
  teams.push(team);
  saveData('teams', teams);
  updateStats();
}
function updateTeam(id, updates) {
  let teams = getTeams();
  teams = teams.map(t => t.id == id ? {...t, ...updates} : t);
  saveData('teams', teams);
  updateStats();
}
function deleteTeam(id) {
  if (!confirm('هل أنت متأكد من حذف الفريق؟')) return;
  const teams = getTeams().filter(t => t.id != id);
  saveData('teams', teams);
  updateStats();
}

function getTeamById(id) {
  return getTeams().find(t => t.id == id);
}

// ---------- إدارة المستخدمين ----------
function getUsers() {
  return loadData('users', []);
}
function addUser(user) {
  const users = getUsers();
  user.id = Date.now();
  users.push(user);
  saveData('users', users);
  updateStats();
}
function updateUser(id, updates) {
  let users = getUsers();
  users = users.map(u => u.id == id ? {...u, ...updates} : u);
  saveData('users', users);
  updateStats();
}
function deleteUser(id) {
  if (!confirm('هل أنت متأكد من حذف المستخدم؟')) return;
  const users = getUsers().filter(u => u.id != id);
  saveData('users', users);
  updateStats();
}

function getUserById(id) {
  return getUsers().find(u => u.id == id);
}

// ---------- الإحصائيات ----------
function updateStats() {
  const tickets = getTickets();
  const teams = getTeams();
  const users = getUsers();

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status == 'open').length,
    inProgressTickets: tickets.filter(t => t.status == 'in-progress').length,
    closedTickets: tickets.filter(t => t.status == 'closed').length,
    totalTeams: teams.length,
    totalUsers: users.length,
    highPriorityTickets: tickets.filter(t => t.priority == 'high').length,
    mediumPriorityTickets: tickets.filter(t => t.priority == 'medium').length,
    lowPriorityTickets: tickets.filter(t => t.priority == 'low').length,
  };
  saveData('stats', stats);
  return stats;
}
function getStats() {
  return loadData('stats', updateStats());
}

// ---------- للربط مع الواجهة ----------
window.AdditAPI = {
  getTickets, addTicket, updateTicket, deleteTicket, getTicketById,
  getTeams, addTeam, updateTeam, deleteTeam, getTeamById,
  getUsers, addUser, updateUser, deleteUser, getUserById,
  getStats
};

// تحديث الإحصائيات تلقائياً عند التحميل الأول
updateStats();
