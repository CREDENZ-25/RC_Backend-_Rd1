const Progress = require('./Progress');
const UserModel = require('./User');


const db = require('../config/db');



// Define associations here
UserModel.hasOne(Progress, { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

// Export models
module.exports = {
  UserModel,
  Progress,
  db,
};

module.exports = { Progress, UserModel };

