module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
        user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: Sequelize.STRING(50)
        },
        last_name: {
            type: Sequelize.STRING(50)
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING(250),
            allowNull: false,
        },
        is_deleted: {
            type: Sequelize.INTEGER
        },
        created_date: {
            type: Sequelize.DATE
        },
        updated_date: {
            type: Sequelize.DATE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });

    users.associate = function (models) {
        users.hasMany(models.tasks, {
            foreignKey: 'user_id',
            targetKey: 'user_id',
        });
    };
    return users;
};