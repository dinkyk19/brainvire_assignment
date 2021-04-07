module.exports = (sequelize, Sequelize) => {
    const tasks = sequelize.define("tasks", {
        task_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        task_name: {
            type: Sequelize.STRING(50),
            allowNull : false
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        description: {
            type: Sequelize.TEXT,
        },
        is_completed : {
            type: Sequelize.INTEGER
        },
        is_deleted: {
            type: Sequelize.INTEGER
        },
        created_date: {
            type: Sequelize.DATE
        },
        updated_date: {
            type: Sequelize.DATE
        },
        date_of_completion: {
            type: Sequelize.DATE
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });

    return tasks;
};