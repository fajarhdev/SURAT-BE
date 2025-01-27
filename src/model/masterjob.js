const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Masterjob = sequelize.define('MASTER_JOB', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    desc: {
        type: DataTypes.TEXT,
    },
    lastRunning: {
        type: DataTypes.DATE,
        field: "last_running",
    },
    nextRunning: {
        type: DataTypes.DATE,
        field: "next_running",
    },
    cron: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'MASTER_JOB'
});

module.exports = Masterjob;