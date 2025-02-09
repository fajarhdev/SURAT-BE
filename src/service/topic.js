const { Op } = require("sequelize");
const Topic = require("../model/topic");
const TopicDetail = require("../model/topicdetail");

const buildHierarchy = async (masterTopics) => {
	// Fetch all topic details in one query
	const topicDetailList = await TopicDetail.findAll({
		where: {
			masterId: {
				[Op.in]: masterTopics.map((topic) => topic.id), // Fetch all at once
			},
		},
		raw: true, // Fetch as plain objects for faster processing
	});

	// Build a lookup map for quick access
	const topicDetailMap = new Map();
	topicDetailList.forEach((detail) => {
		if (!topicDetailMap.has(detail.masterId)) {
			topicDetailMap.set(detail.masterId, []);
		}
		topicDetailMap.get(detail.masterId).push(detail);
	});

	// Build hierarchy efficiently
	const buildChildren = (parentId, details) => {
		const children = details.filter((d) => d.parentId === parentId);
		return children.map((child) => ({
			id: child.id,
			code: child.code,
			name: child.name,
			desc: child.desc,
			children: buildChildren(child.id, details), // Recursive call
		}));
	};

	// Construct the final hierarchy
	return masterTopics.map((topic) => {
		const details = topicDetailMap.get(topic.id) || [];
		const rootDetail = details.find((d) => d.parentId === null);
		if (!rootDetail) return null;

		return {
			id: topic.id,
			code: topic.code,
			name: topic.name,
			desc: topic.desc,
			children: [
				{
					id: rootDetail.id,
					code: rootDetail.code,
					name: rootDetail.name,
					desc: rootDetail.desc,
					children: buildChildren(rootDetail.id, details),
				},
			],
		};
	}).filter(Boolean);
};

const getTopicService = async () => {
	// Fetch all master topics at once
	const masterTopics = await Topic.findAll({ raw: true });
	if (!masterTopics.length) return [];

	return await buildHierarchy(masterTopics);
};

module.exports = getTopicService;
