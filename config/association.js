const Executive = require("../src/model/executive");
const ExecutiveDetail = require("../src/model/executivedetail");
const IncMail = require("../src/model/incmail");
const MailCode = require("../src/model/mailcode");
const OutMail = require("../src/model/outmail");
const Role = require("../src/model/role");
const System = require("../src/model/system");
const SystemDetail = require("../src/model/systemdetail");
const Topic = require("../src/model/topic");
const TopicDetail = require("../src/model/topicdetail");
const Unit = require("../src/model/unit");
const User = require("../src/model/user");

Executive.hasMany(ExecutiveDetail, {
	foreignKey: "masterId",
	as: "details", // Alias for the related executive details
});

ExecutiveDetail.belongsTo(Executive, {
	foreignKey: "masterId",
	as: "executive", // Alias for the parent executive
});

ExecutiveDetail.hasMany(ExecutiveDetail, {
	foreignKey: "parentId",
	as: "children", // Alias for child executive details
});

ExecutiveDetail.belongsTo(ExecutiveDetail, {
	foreignKey: "parentId",
	as: "parent", // Alias for parent executive detail
});

System.hasMany(SystemDetail, {
	foreignKey: "masterId",
});

SystemDetail.belongsTo(System, {
	foreignKey: "masterId",
});

Topic.hasMany(TopicDetail, {
	foreignKey: "masterId",
	as: "details", // Alias for the related topic details
});

TopicDetail.belongsTo(Topic, {
	foreignKey: "masterId",
	as: "topic", // Alias for the parent topic
});

TopicDetail.hasMany(TopicDetail, {
	foreignKey: "parentId",
	as: "children", // Alias for child topic details
});

TopicDetail.belongsTo(TopicDetail, {
	foreignKey: "parentId",
	as: "parent", // Alias for parent topic detail
});

// Role.hasMany(User, {
// 	foreignKey: "role",
// });

// User.belongsTo(Role, {
// 	foreignKey: "role",
// });

// Unit.hasMany(User, {
// 	foreignKey: "unit",
// });

// User.belongsTo(Unit, {
// 	foreignKey: "unit",
// });
