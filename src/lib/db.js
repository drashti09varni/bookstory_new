const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dbDir = path.join(process.cwd(), 'src', 'data');
const dbPath = path.join(dbDir, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Native Node.js PBKDF2 Password Hashing
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

// Initialise and Seed Database if empty
function initDb() {
  if (!fs.existsSync(dbPath)) {
    const defaultUsers = [
      { 
        name: "Admin User", 
        email: "admin@aethera.com", 
        username: "admin", 
        password: hashPassword("password123"),
        isSubscribed: true
      },
      { 
        name: "Guest User", 
        email: "guest@aethera.com", 
        username: "guest", 
        password: hashPassword("password123"),
        isSubscribed: false
      },
      { 
        name: "Test User", 
        email: "test@aethera.com", 
        username: "test", 
        password: hashPassword("password123"),
        isSubscribed: false
      }
    ];
    fs.writeFileSync(dbPath, JSON.stringify(defaultUsers, null, 2), 'utf-8');
  }
}

initDb();

function getUsers() {
  try {
    initDb();
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read user database", e);
    return [];
  }
}

function sanitizeUser(user) {
  if (!user) return user;
  const sanitized = { ...user };
  if (sanitized.name && sanitized.name.includes('@')) {
    if (sanitized.username) {
      sanitized.name = sanitized.username.charAt(0).toUpperCase() + sanitized.username.slice(1);
    } else {
      const prefix = sanitized.name.split('@')[0];
      sanitized.name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
  }
  return sanitized;
}

function saveUser(user) {
  try {
    const users = getUsers();
    const hashedPassword = hashPassword(user.password);
    const newUser = {
      name: user.name,
      email: user.email,
      username: user.username.toLowerCase(),
      password: hashedPassword,
      isSubscribed: false
    };
    users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    return sanitizeUser(newUser);
  } catch (e) {
    console.error("Failed to write to user database", e);
    throw new Error("Database save failed");
  }
}

function findUserByUsername(username) {
  const users = getUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  return sanitizeUser(user);
}

function findUserByEmail(email) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  return sanitizeUser(user);
}

function getUserProgress(username) {
  const user = findUserByUsername(username);
  return user ? (user.progress || {}) : {};
}

function updateUserProgress(username, bookId, lastChapter, scrollPercent) {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    if (!users[userIndex].progress) {
      users[userIndex].progress = {};
    }
    
    users[userIndex].progress[bookId] = {
      lastChapter: parseInt(lastChapter, 10),
      scrollPercent: parseFloat(scrollPercent),
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    return users[userIndex].progress;
  } catch (e) {
    console.error("Failed to update user progress in database", e);
    throw new Error("Database write failed");
  }
}

function setUserSubscription(username, isSubscribed) {
  try {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    users[userIndex].isSubscribed = !!isSubscribed;
    
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2), 'utf-8');
    return sanitizeUser(users[userIndex]);
  } catch (e) {
    console.error("Failed to update user subscription status in database", e);
    throw new Error("Database write failed");
  }
}

module.exports = {
  getUsers,
  saveUser,
  findUserByUsername,
  findUserByEmail,
  verifyPassword,
  hashPassword,
  getUserProgress,
  updateUserProgress,
  setUserSubscription
};


